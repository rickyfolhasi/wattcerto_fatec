# Histórico de decisões do banco | WattCerto

Registro das decisões que levaram ao dicionário de dados, na ordem em que foram tomadas.

**D1. O banco guarda dados do sistema, não da pessoa que simula.**
O site foi feito sem cadastro: a simulação de cada casa fica só no navegador de quem usa. Levar essa simulação para o banco criaria um dado pessoal (hábitos de consumo de uma casa) sem necessidade. Por isso o banco guarda o catálogo de aparelhos, as tarifas, as bandeiras, as fontes e as notícias, que são os dados que a equipe mantém. Alternativa descartada: tabela `simulacao` com os resultados de cada visita.

**D2. Uma tabela `fonte` para todo o sistema.**
A regra do projeto é "todo número tem fonte". Em vez de guardar o link solto em cada tabela, todas apontam para `fonte`. Assim a mesma fonte (ex.: ANEEL) é cadastrada uma vez e reaproveitada. A URL pode ser nula porque há fontes sem link (tabela impressa da Procel, fatura de energia).

**D3. `tipo_calculo` como tabela com chave em texto (`cod_tipo`).**
As seis regras de cálculo (tempo, standby, evento, climatização, ciclo, banho) já existiam no JavaScript com esses códigos. Usar o mesmo código como chave mantém banco, Python e site falando a mesma língua e deixa o SELECT legível. Alternativa descartada: ENUM em `aparelho`, que não permitiria guardar o nome e a fórmula de cada regra.

**D4. Uma tabela `aparelho` para todos os tipos de cálculo.**
Cada tipo usa só algumas colunas (o chuveiro usa minutos e banhos por pessoa; a geladeira usa a etiqueta). A alternativa seria uma tabela por tipo (especialização), com seis tabelas e JOINs em toda consulta. Para 25 aparelhos isso complica sem ganho. As colunas que um tipo não usa ficam nulas, e o programa em Python valida quais são obrigatórias para cada tipo (`CAMPOS_POR_TIPO` em `validacao.py`).

**D5. `origem_valor` + CHECK de fonte.**
Cada aparelho diz se o número é da Procel, derivado da Procel ou típico de mercado (o site mostra isso). O CHECK `ck_aparelho_fonte` obriga a ter fonte quando não é típico. Consequência: o MySQL não aceita CASCADE nem SET NULL numa chave estrangeira cuja coluna está num CHECK, então `fk_aparelho_fonte` ficou com RESTRICT. Faz sentido: uma fonte citada não pode ser apagada.

**D6. Tarifa com período de vigência.**
A tarifa muda todo ano (reajuste da Enel SP em 4 de julho de 2026). Guardar só o valor atual perderia o histórico. Por isso `vigencia_inicio` e `vigencia_fim` (nula = em vigor) e a chave única (distribuidora, início), que impede duas tarifas começando no mesmo dia.

**D7. Bandeira separada da bandeira do mês.**
O acréscimo de cada cor (R$ 1,885 a cada 100 kWh na amarela, por exemplo) muda raramente; a cor do mês muda todo mês. Separar em `bandeira` e `bandeira_mes` evita repetir o valor do acréscimo em cada mês. O mês é guardado como o dia 1 (CHECK `ck_bandeira_mes_dia1`) e é a própria chave primária, porque cada mês tem uma bandeira só.

**D8. Notícia e fonte em N:N.**
A notícia do reajuste da Enel cita duas fontes; a ANEEL pode ser citada por várias notícias. Tabela associativa `noticia_fonte` com chave composta, que também impede citar a mesma fonte duas vezes na mesma notícia.

**D9. `mensagem_contato` isolada, com consentimento e prazo.**
É o único dado pessoal. Decisões: (a) o CHECK `ck_mensagem_consentimento` faz o próprio banco recusar mensagem sem consentimento; (b) `apagar_em` define quando a mensagem é apagada (180 dias após o envio) e o programa tem a rotina que apaga; (c) nenhuma chave estrangeira aponta para ela, para poder apagar sem afetar o resto.

**D10. Exclusão lógica de aparelho (`ativo`).**
Tirar um aparelho do site não apaga o registro: `ativo = FALSE`. Preserva o histórico e evita quebrar referências. A exclusão física continua possível para cadastros errados.

**D11. Tipos e tamanhos.**
`DECIMAL` (e não FLOAT) para potência, tarifa e acréscimo, porque são valores exatos e alguns são dinheiro. `DECIMAL(6,4)` na tarifa porque as tarifas têm 4 casas (R$ 0,8612 por kWh, por exemplo). `email` com 254 caracteres, o máximo que um e-mail pode ter. Chaves com o menor inteiro que cabe (TINYINT para grupos e bandeiras, SMALLINT para aparelhos e fontes). `utf8mb4` para acentos.

**D12. Índice criado a partir do EXPLAIN.**
O EXPLAIN da consulta "mensagem já importada?" mostrou `type = ALL` (leitura da tabela inteira). Foi criado `ix_mensagem_email (email, recebida_em)` e o EXPLAIN passou a `ref`, usando só o índice. Também existem `ix_mensagem_apagar` (para a rotina de apagar vencidas) e `ix_noticia_data`.
