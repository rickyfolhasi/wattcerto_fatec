SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Limpa só as tabelas g03_ (pode rodar de novo sem duplicar)
DELETE FROM `g03_noticia_fonte`;
DELETE FROM `g03_noticia`;
DELETE FROM `g03_bandeira_mes`;
DELETE FROM `g03_bandeira`;
DELETE FROM `g03_aparelho`;
DELETE FROM `g03_distribuidora`;
DELETE FROM `g03_tipo_calculo`;
DELETE FROM `g03_grupo_aparelho`;
DELETE FROM `g03_fonte`;

-- Dados, na ordem das chaves estrangeiras (quem é referenciado entra primeiro)
INSERT INTO `g03_fonte` (`id_fonte`, `titulo`, `orgao`, `url`, `data_consulta`) VALUES (1,'Tabela de consumo de eletrodomésticos (Procel)','Procel/Eletrobras',NULL,'2026-11-18'),
(2,'Bandeiras tarifárias','ANEEL','https://www.gov.br/aneel/pt-br/assuntos/tarifas/bandeiras-tarifarias','2026-11-18'),
(3,'Anuário Estatístico de Energia Elétrica 2026 (ano-base 2025), sumário executivo','EPE','https://www.epe.gov.br/sites-pt/publicacoes-dados-abertos/publicacoes/PublicacoesArquivos/publicacao-160/topico-168/Anuario_Sumario%20Executivo_2026_V1.pdf','2026-11-18'),
(4,'Aneel mantém bandeira verde na conta de luz em novembro','SBT News','https://sbtnews.sbt.com.br/noticia/economia/aneel-mantem-bandeira-verde-na-conta-de-luz-em-novembro','2026-11-18'),
(5,'Chuveiro elétrico é o maior consumidor de energia em uma residência','AGEMS','https://www.agems.ms.gov.br/chuveiro-eletrico-e-o-maior-consumidor-de-energia-em-uma-residencia/','2026-11-18'),
(6,'Aneel aprova reajuste da Enel São Paulo com efeito médio de 10,18%','Cenário Energia','https://cenarioenergia.com.br/2026/06/30/aneel-aprova-reajuste-da-enel-sao-paulo-com-efeito-medio-de-1018/','2026-11-18'),
(7,'Aneel aprova reajuste de 10,18% nas tarifas da Enel SP','Agência Infra','https://agenciainfra.com/blog/aneel-aprova-reajuste-de-1018-nas-tarifas-da-enel-sp/','2026-11-18'),
(8,'MME: lâmpadas sem critério de eficiência não poderão ser vendidas após prazo de até 5 anos','Diário do Grande ABC','https://www.dgabc.com.br/Noticia/4332067/mme-lampadas-sem-criterio-de-eficiencia-nao-poderao-ser-vendidas-apos-prazo-de-ate-5-anos','2026-11-18'),
(9,'Alta na conta de luz deve ficar na média em 9,4% no ano de 2026, diz Aneel','Diário do Grande ABC','https://www.dgabc.com.br/Noticia/4347830/alta-na-conta-de-luz-deve-ficar-na-media-em-9-4-no-ano-de-2026-diz-aneel','2026-11-18');

INSERT INTO `g03_grupo_aparelho` (`id_grupo`, `nome`, `ordem`) VALUES (1,'Essenciais',1),
(2,'Climatização',2),
(3,'Cozinha',3),
(4,'Eletrônicos',4),
(5,'Casa e cuidados',5);

INSERT INTO `g03_tipo_calculo` (`cod_tipo`, `nome`, `formula`) VALUES ('banho','Banho (chuveiro)','potência × fator da estação × (minutos de banho ÷ 60) × pessoas × banhos por pessoa por dia × 30 ÷ 1000'),
('ciclo','Pela etiqueta Inmetro','consumo da etiqueta (kWh/mês) × quantidade'),
('climatizacao','Climatização','potência × horas por dia × quantidade × 30 ÷ 1000 × (meses de uso por ano ÷ 12)'),
('evento','Por uso','potência × (minutos por uso ÷ 60) × usos no mês ÷ 1000'),
('standby','Com modo de espera','(potência × horas de uso + potência em espera × horas parado) × quantidade × 30 ÷ 1000'),
('tempo','Por tempo de uso','potência × horas por dia × quantidade × 30 ÷ 1000');

INSERT INTO `g03_distribuidora` (`id_distribuidora`, `nome`, `sigla`, `uf`) VALUES (1,'Enel Distribuição São Paulo','ENEL SP','SP');

INSERT INTO `g03_aparelho` (`id_aparelho`, `codigo`, `nome`, `id_grupo`, `cod_tipo`, `potencia_w`, `horas_dia`, `minutos_uso`, `usos_mes`, `usos_pessoa_dia`, `espera_w`, `meses_ano`, `etiqueta_kwh_mes`, `quantidade_padrao`, `origem_valor`, `nota`, `rotulo_potencia`, `rotulo_quantidade`, `id_fonte`, `na_lista_adicionar`, `ativo`) VALUES (1,'chuveiro','Chuveiro elétrico',1,'banho',5500.0,NULL,15.0,NULL,1.00,NULL,NULL,NULL,1,'tipico','Fator da estação: inverno 1,0; verão 0,7.',NULL,NULL,NULL,0,1),
(2,'geladeira_1p','Geladeira 1 porta',1,'ciclo',120.0,NULL,NULL,NULL,NULL,NULL,NULL,25.2,1,'procel',NULL,NULL,NULL,1,0,1),
(3,'geladeira_1p_ff','Geladeira 1 porta frost free',1,'ciclo',150.0,NULL,NULL,NULL,NULL,NULL,NULL,39.6,1,'procel',NULL,NULL,NULL,1,0,1),
(4,'geladeira_2p','Geladeira 2 portas',1,'ciclo',180.0,NULL,NULL,NULL,NULL,NULL,NULL,48.2,1,'procel',NULL,NULL,NULL,1,0,1),
(5,'geladeira_2p_ff','Geladeira 2 portas frost free',1,'ciclo',200.0,NULL,NULL,NULL,NULL,NULL,NULL,56.9,1,'procel',NULL,NULL,NULL,1,0,1),
(6,'lavadora','Máquina de lavar',1,'evento',150.0,NULL,60.0,12,NULL,NULL,NULL,NULL,1,'procel','Procel: 12 lavagens de 1 hora dão 1,8 kWh/mês.',NULL,NULL,1,0,1),
(7,'led','Lâmpadas LED',1,'tempo',9.0,5.00,NULL,NULL,NULL,NULL,NULL,NULL,10,'tipico',NULL,'Potência de cada lâmpada (W)','Quantidade de lâmpadas',NULL,0,1),
(8,'ar_janela_9000','Ar-condicionado de janela 9.000 BTU',2,'climatizacao',537.0,8.00,NULL,NULL,NULL,NULL,12,NULL,1,'derivado','Procel: 128,8 kWh/mês com 8 h por dia. 128,8 ÷ 240 h = 537 W médios.',NULL,NULL,1,1,1),
(9,'ar_split_9000','Ar-condicionado split 9.000 BTU',2,'climatizacao',593.0,8.00,NULL,NULL,NULL,NULL,12,NULL,1,'derivado','Procel: 142,3 kWh/mês com 8 h por dia. 142,3 ÷ 240 h = 593 W médios.',NULL,NULL,1,1,1),
(10,'ar_split_12000','Ar-condicionado split 12.000 BTU',2,'climatizacao',790.0,8.00,NULL,NULL,NULL,NULL,12,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(11,'ventilador','Ventilador',2,'climatizacao',100.0,8.00,NULL,NULL,NULL,NULL,12,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(12,'micro_ondas','Micro-ondas',3,'evento',1200.0,NULL,8.0,30,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(13,'air_fryer','Air fryer',3,'evento',1500.0,NULL,20.0,16,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(14,'lava_loucas','Lava-louças',3,'evento',1200.0,NULL,90.0,12,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(15,'freezer','Freezer horizontal',3,'ciclo',220.0,NULL,NULL,NULL,NULL,NULL,NULL,62.0,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(16,'bebedouro','Bebedouro elétrico',3,'ciclo',100.0,NULL,NULL,NULL,NULL,NULL,NULL,25.0,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(17,'tv','Televisão',4,'standby',80.0,5.00,NULL,NULL,NULL,0.50,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(18,'computador','Computador de mesa',4,'tempo',150.0,4.00,NULL,NULL,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(19,'notebook','Notebook',4,'tempo',60.0,4.00,NULL,NULL,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(20,'roteador','Roteador de internet',4,'standby',10.0,24.00,NULL,NULL,NULL,10.00,NULL,NULL,1,'tipico','Fica ligado o mês inteiro: 10 W por 24 h dão 7,2 kWh/mês.',NULL,NULL,NULL,1,1),
(21,'videogame','Videogame',4,'standby',160.0,2.00,NULL,NULL,NULL,1.00,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(22,'ferro','Ferro de passar',5,'evento',1000.0,NULL,60.0,8,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(23,'secador','Secador de cabelo',5,'evento',1500.0,NULL,10.0,30,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(24,'bomba_agua','Bomba d\'água',5,'tempo',370.0,0.50,NULL,NULL,NULL,NULL,NULL,NULL,1,'tipico',NULL,NULL,NULL,NULL,1,1),
(25,'lampada_incandescente','Lâmpadas incandescentes',5,'tempo',60.0,5.00,NULL,NULL,NULL,NULL,NULL,NULL,10,'procel','Procel: uma lâmpada de 60 W acesa 5 h por dia gasta 9 kWh/mês.','Potência de cada lâmpada (W)','Quantidade de lâmpadas',1,1,1);

INSERT INTO `g03_bandeira` (`id_bandeira`, `nome`, `acrescimo_100kwh`, `id_fonte`) VALUES (1,'Verde',0.000,2),
(2,'Amarela',1.885,2),
(3,'Vermelha, patamar 1',4.463,2),
(4,'Vermelha, patamar 2',7.877,2);

INSERT INTO `g03_bandeira_mes` (`mes_referencia`, `id_bandeira`, `id_fonte`) VALUES ('2026-11-01',1,4);

INSERT INTO `g03_noticia` (`id_noticia`, `titulo`, `categoria`, `resumo`, `publicada_em`, `imagem`, `credito_imagem`) VALUES (1,'Novembro segue com bandeira verde','Bandeira tarifária','A Aneel decidiu manter a bandeira verde na conta de luz em novembro de 2026. Na bandeira verde não há cobrança extra: você paga só a tarifa normal.','2026-10-30','img/noticias/bandeira-verde-novembro.webp','Foto: jplenio, Pixabay'),
(2,'Conta da Enel SP ficou 10,18% mais cara','Reajuste','A Aneel aprovou o reajuste anual das tarifas da Enel São Paulo: alta média de 10,18% a partir de 4 de julho de 2026. Para as residências (classe B1), 9,02%.','2026-06-30','img/noticias/torre-energia-enel.webp','Foto: Pexels'),
(3,'Lâmpada LED vai ter eficiência mínima','Eficiência energética','O governo federal criou a primeira regra nacional de eficiência para lâmpadas e luminárias de LED: mínimo de 120 lm/W em 2028 e de 140 lm/W em 2030.','2026-06-29','img/noticias/lampadas-led-eficiencia.webp','Foto: analogicus, Pixabay');

INSERT INTO `g03_noticia_fonte` (`id_noticia`, `id_fonte`) VALUES (1,4),
(2,6),
(2,7),
(3,8);

SET FOREIGN_KEY_CHECKS = 1;
