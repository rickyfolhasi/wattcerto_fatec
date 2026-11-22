-- =====================================================================
-- WattCerto | Script de criação do banco (DDL) para MySQL 8
-- Projeto Integrador 2 | Banco de Dados I | Fatec Antônio Russo
--
-- O banco guarda os dados DO SISTEMA (catálogo de aparelhos, tarifas,
-- bandeiras, fontes, notícias) e as mensagens do formulário de contato.
-- A simulação de cada pessoa NÃO passa por aqui: ela fica no navegador
-- de quem usa o site (Privacy by Design, ver docs/pi2/seguranca).
--
-- Ordem: tabelas sem chave estrangeira primeiro, depois as que dependem
-- delas. Rodar inteiro: mysql -u USUARIO -p < 01_criar_banco.sql
-- =====================================================================

DROP DATABASE IF EXISTS wattcerto;
CREATE DATABASE wattcerto
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE wattcerto;

-- ---------------------------------------------------------------------
-- 1. fonte: de onde vem cada número do sistema (regra do projeto:
--    todo número tem fonte citada).
-- ---------------------------------------------------------------------
CREATE TABLE fonte (
  id_fonte             SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da fonte',
  titulo               VARCHAR(200)      NOT NULL COMMENT 'Título do documento ou da reportagem',
  orgao                VARCHAR(80)       NOT NULL COMMENT 'Quem publicou (ANEEL, EPE, Procel, jornal...)',
  url                  VARCHAR(300)      NULL COMMENT 'Endereço na internet; nulo para fonte impressa ou fatura',
  data_consulta        DATE              NOT NULL COMMENT 'Data em que a equipe conferiu a fonte',
  CONSTRAINT pk_fonte PRIMARY KEY (id_fonte),
  CONSTRAINT uq_fonte_titulo UNIQUE (titulo),
  CONSTRAINT uq_fonte_url UNIQUE (url)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 2. grupo_aparelho: como os aparelhos aparecem agrupados na
--    calculadora (Essenciais, Climatização, Cozinha...).
-- ---------------------------------------------------------------------
CREATE TABLE grupo_aparelho (
  id_grupo             TINYINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do grupo',
  nome                 VARCHAR(40)      NOT NULL COMMENT 'Nome do grupo mostrado na calculadora',
  ordem                TINYINT UNSIGNED NOT NULL COMMENT 'Posição do grupo na lista da calculadora',
  CONSTRAINT pk_grupo_aparelho PRIMARY KEY (id_grupo),
  CONSTRAINT uq_grupo_nome  UNIQUE (nome),
  CONSTRAINT uq_grupo_ordem UNIQUE (ordem)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 3. tipo_calculo: as regras do motor de cálculo. A chave é um código
--    curto e estável, o mesmo usado no JavaScript do site.
-- ---------------------------------------------------------------------
CREATE TABLE tipo_calculo (
  cod_tipo             VARCHAR(15)  NOT NULL COMMENT 'Código da regra de cálculo, o mesmo do JavaScript',
  nome                 VARCHAR(40)  NOT NULL COMMENT 'Nome da regra para mostrar às pessoas',
  formula              VARCHAR(255) NOT NULL COMMENT 'Fórmula da regra, por extenso',
  CONSTRAINT pk_tipo_calculo PRIMARY KEY (cod_tipo),
  CONSTRAINT uq_tipo_nome UNIQUE (nome)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 4. aparelho: catálogo com os valores de partida de cada aparelho.
--    Uma tabela só para todos os tipos de cálculo: cada tipo usa
--    algumas colunas e deixa as outras nulas (decisão D4 no histórico).
-- ---------------------------------------------------------------------
CREATE TABLE aparelho (
  id_aparelho          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do aparelho',
  codigo               VARCHAR(40)       NOT NULL COMMENT 'Código estável do aparelho, usado pelo site',
  nome                 VARCHAR(80)       NOT NULL COMMENT 'Nome do aparelho mostrado na calculadora',
  id_grupo             TINYINT UNSIGNED  NOT NULL COMMENT 'Grupo do aparelho',
  cod_tipo             VARCHAR(15)       NOT NULL COMMENT 'Regra de cálculo usada pelo aparelho',
  potencia_w           DECIMAL(7,1)      NULL COMMENT 'Potência em watts',
  horas_dia            DECIMAL(4,2)      NULL COMMENT 'Horas de uso por dia',
  minutos_uso          DECIMAL(5,1)      NULL COMMENT 'Minutos de cada uso (ou de cada banho)',
  usos_mes             SMALLINT UNSIGNED NULL COMMENT 'Quantas vezes é usado no mês',
  usos_pessoa_dia      DECIMAL(4,2)      NULL COMMENT 'Banhos por pessoa por dia (só chuveiro)',
  espera_w             DECIMAL(6,2)      NULL COMMENT 'Potência em modo de espera, em watts',
  meses_ano            TINYINT UNSIGNED  NULL COMMENT 'Meses do ano em que é usado (climatização)',
  etiqueta_kwh_mes     DECIMAL(6,1)      NULL COMMENT 'Consumo da etiqueta Inmetro, em kWh por mês',
  quantidade_padrao    TINYINT UNSIGNED  NOT NULL DEFAULT 1 COMMENT 'Quantidade que já vem preenchida',
  origem_valor         ENUM('procel','derivado','tipico') NOT NULL COMMENT 'De onde veio o número: Procel, derivado da Procel ou típico',
  nota                 VARCHAR(255)      NULL COMMENT 'Explicação do número mostrada abaixo do aparelho',
  rotulo_potencia      VARCHAR(60)       NULL COMMENT 'Texto próprio para o campo de potência',
  rotulo_quantidade    VARCHAR(60)       NULL COMMENT 'Texto próprio para o campo de quantidade',
  id_fonte             SMALLINT UNSIGNED NULL COMMENT 'Fonte do número (obrigatória se não for típico)',
  na_lista_adicionar   BOOLEAN           NOT NULL DEFAULT TRUE COMMENT 'Aparece na lista "Adicionar aparelho" do site',
  ativo                BOOLEAN           NOT NULL DEFAULT TRUE COMMENT 'Falso = tirado do site sem apagar (exclusão lógica)',
  CONSTRAINT pk_aparelho PRIMARY KEY (id_aparelho),
  CONSTRAINT uq_aparelho_codigo UNIQUE (codigo),
  CONSTRAINT uq_aparelho_nome   UNIQUE (nome),
  CONSTRAINT fk_aparelho_grupo FOREIGN KEY (id_grupo)
    REFERENCES grupo_aparelho (id_grupo) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_aparelho_tipo FOREIGN KEY (cod_tipo)
    REFERENCES tipo_calculo (cod_tipo) ON UPDATE CASCADE ON DELETE RESTRICT,
  -- RESTRICT aqui: o MySQL não aceita CASCADE/SET NULL numa coluna usada em
  -- CHECK (ck_aparelho_fonte). E faz sentido: fonte citada não pode sumir.
  CONSTRAINT fk_aparelho_fonte FOREIGN KEY (id_fonte)
    REFERENCES fonte (id_fonte) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT ck_aparelho_potencia   CHECK (potencia_w IS NULL OR potencia_w > 0),
  CONSTRAINT ck_aparelho_horas      CHECK (horas_dia IS NULL OR (horas_dia > 0 AND horas_dia <= 24)),
  CONSTRAINT ck_aparelho_meses      CHECK (meses_ano IS NULL OR meses_ano BETWEEN 1 AND 12),
  CONSTRAINT ck_aparelho_quantidade CHECK (quantidade_padrao >= 1),
  -- Valor "procel" ou "derivado" precisa apontar a fonte; "tipico" não.
  CONSTRAINT ck_aparelho_fonte CHECK (origem_valor = 'tipico' OR id_fonte IS NOT NULL)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 5. distribuidora: empresa que entrega a energia (Enel SP etc.).
-- ---------------------------------------------------------------------
CREATE TABLE distribuidora (
  id_distribuidora     SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da distribuidora',
  nome                 VARCHAR(80)       NOT NULL COMMENT 'Nome oficial da distribuidora',
  sigla                VARCHAR(20)       NOT NULL COMMENT 'Sigla usada nos arquivos de carga',
  uf                   CHAR(2)           NOT NULL COMMENT 'Estado atendido',
  CONSTRAINT pk_distribuidora PRIMARY KEY (id_distribuidora),
  CONSTRAINT uq_distribuidora_nome  UNIQUE (nome),
  CONSTRAINT uq_distribuidora_sigla UNIQUE (sigla)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 6. tarifa: preço do kWh residencial de uma distribuidora num período.
--    vigencia_fim nula = tarifa em vigor hoje.
-- ---------------------------------------------------------------------
CREATE TABLE tarifa (
  id_tarifa            INT UNSIGNED      NOT NULL AUTO_INCREMENT COMMENT 'Identificador da tarifa',
  id_distribuidora     SMALLINT UNSIGNED NOT NULL COMMENT 'Distribuidora dona da tarifa',
  valor_kwh            DECIMAL(6,4)      NOT NULL COMMENT 'Preço do kWh residencial, em reais',
  vigencia_inicio      DATE              NOT NULL COMMENT 'Primeiro dia em que a tarifa vale',
  vigencia_fim         DATE              NULL COMMENT 'Último dia em que vale; nulo = em vigor',
  id_fonte             SMALLINT UNSIGNED NOT NULL COMMENT 'Fonte do valor da tarifa',
  CONSTRAINT pk_tarifa PRIMARY KEY (id_tarifa),
  CONSTRAINT uq_tarifa_periodo UNIQUE (id_distribuidora, vigencia_inicio),
  CONSTRAINT fk_tarifa_distribuidora FOREIGN KEY (id_distribuidora)
    REFERENCES distribuidora (id_distribuidora) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tarifa_fonte FOREIGN KEY (id_fonte)
    REFERENCES fonte (id_fonte) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_tarifa_valor CHECK (valor_kwh > 0),
  CONSTRAINT ck_tarifa_datas CHECK (vigencia_fim IS NULL OR vigencia_fim >= vigencia_inicio)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 7. bandeira: as cores da bandeira tarifária e o acréscimo de cada uma.
-- ---------------------------------------------------------------------
CREATE TABLE bandeira (
  id_bandeira          TINYINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'Identificador da bandeira',
  nome                 VARCHAR(30)       NOT NULL COMMENT 'Cor e patamar da bandeira',
  acrescimo_100kwh     DECIMAL(6,3)      NOT NULL COMMENT 'Reais a mais a cada 100 kWh',
  id_fonte             SMALLINT UNSIGNED NOT NULL COMMENT 'Fonte do valor do acréscimo',
  CONSTRAINT pk_bandeira PRIMARY KEY (id_bandeira),
  CONSTRAINT uq_bandeira_nome UNIQUE (nome),
  CONSTRAINT fk_bandeira_fonte FOREIGN KEY (id_fonte)
    REFERENCES fonte (id_fonte) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_bandeira_acrescimo CHECK (acrescimo_100kwh >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 8. bandeira_mes: qual bandeira valeu em cada mês. O mês é guardado
--    como o dia 1 (2026-11-01 = novembro de 2026) e é a própria chave.
-- ---------------------------------------------------------------------
CREATE TABLE bandeira_mes (
  mes_referencia       DATE              NOT NULL COMMENT 'Mês, guardado como o dia 1',
  id_bandeira          TINYINT UNSIGNED  NOT NULL COMMENT 'Bandeira que valeu no mês',
  id_fonte             SMALLINT UNSIGNED NOT NULL COMMENT 'Fonte do anúncio da bandeira',
  CONSTRAINT pk_bandeira_mes PRIMARY KEY (mes_referencia),
  CONSTRAINT fk_bandeira_mes_bandeira FOREIGN KEY (id_bandeira)
    REFERENCES bandeira (id_bandeira) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_bandeira_mes_fonte FOREIGN KEY (id_fonte)
    REFERENCES fonte (id_fonte) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_bandeira_mes_dia1 CHECK (DAY(mes_referencia) = 1)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 9. noticia: as notícias da página Notícias.
-- ---------------------------------------------------------------------
CREATE TABLE noticia (
  id_noticia           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da notícia',
  titulo               VARCHAR(150)      NOT NULL COMMENT 'Título da notícia',
  categoria            VARCHAR(40)       NOT NULL COMMENT 'Etiqueta da notícia (Reajuste, Bandeira...)',
  resumo               VARCHAR(400)      NOT NULL COMMENT 'Resumo de até 400 caracteres',
  publicada_em         DATE              NOT NULL COMMENT 'Data da notícia',
  imagem               VARCHAR(200)      NULL COMMENT 'Caminho da foto no site',
  credito_imagem       VARCHAR(150)      NULL COMMENT 'Crédito da foto',
  CONSTRAINT pk_noticia PRIMARY KEY (id_noticia),
  CONSTRAINT uq_noticia_titulo UNIQUE (titulo)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 10. noticia_fonte: uma notícia cita várias fontes e uma fonte pode
--     ser citada por várias notícias (relacionamento N:N).
-- ---------------------------------------------------------------------
CREATE TABLE noticia_fonte (
  id_noticia           SMALLINT UNSIGNED NOT NULL COMMENT 'Notícia que cita a fonte',
  id_fonte             SMALLINT UNSIGNED NOT NULL COMMENT 'Fonte citada',
  CONSTRAINT pk_noticia_fonte PRIMARY KEY (id_noticia, id_fonte),
  CONSTRAINT fk_nf_noticia FOREIGN KEY (id_noticia)
    REFERENCES noticia (id_noticia) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_nf_fonte FOREIGN KEY (id_fonte)
    REFERENCES fonte (id_fonte) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 11. mensagem_contato: o que chega pelo formulário de contato.
--     É o ÚNICO dado pessoal do sistema. Só entra com consentimento e
--     tem data para ser apagado (LGPD: necessidade e retenção mínima).
-- ---------------------------------------------------------------------
CREATE TABLE mensagem_contato (
  id_mensagem          INT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'Identificador da mensagem',
  nome                 VARCHAR(80)   NOT NULL COMMENT 'Nome de quem escreveu (dado pessoal)',
  email                VARCHAR(254)  NOT NULL COMMENT 'E-mail para resposta (dado pessoal)',
  assunto              VARCHAR(80)   NOT NULL COMMENT 'Assunto da mensagem',
  texto                VARCHAR(600)  NOT NULL COMMENT 'Texto da mensagem',
  consentimento        BOOLEAN       NOT NULL COMMENT 'Pessoa concordou com o uso dos dados (sempre verdadeiro)',
  recebida_em          DATETIME      NOT NULL COMMENT 'Data e hora do envio',
  apagar_em            DATE          NOT NULL COMMENT 'Data em que a mensagem deve ser apagada (LGPD)',
  situacao             ENUM('nova','respondida') NOT NULL DEFAULT 'nova' COMMENT 'Nova ou respondida',
  CONSTRAINT pk_mensagem_contato PRIMARY KEY (id_mensagem),
  CONSTRAINT ck_mensagem_consentimento CHECK (consentimento = TRUE),
  CONSTRAINT ck_mensagem_texto CHECK (CHAR_LENGTH(texto) >= 10)
) ENGINE = InnoDB;

-- Índices para as buscas que o sistema faz (ver 03_consultas.sql).
CREATE INDEX ix_tarifa_vigente  ON tarifa (id_distribuidora, vigencia_fim);
CREATE INDEX ix_mensagem_apagar ON mensagem_contato (apagar_em);
-- Achado no EXPLAIN: sem este índice, conferir se a mensagem já foi importada lia a tabela inteira.
CREATE INDEX ix_mensagem_email ON mensagem_contato (email, recebida_em);
CREATE INDEX ix_noticia_data    ON noticia (publicada_em);
