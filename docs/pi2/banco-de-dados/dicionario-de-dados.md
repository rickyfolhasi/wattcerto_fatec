# Dicionário de dados | WattCerto
Gerado do próprio banco em 18/11/2026 14:37 (servidor 10.11.14-MariaDB-0ubuntu0.24.04.1). Script de criação: `sistema/sql/01_criar_banco.sql`.
Legenda: **PK** chave primária, **FK** chave estrangeira, **UQ** valor único, **NN** não nulo (NOT NULL).

## aparelho
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_aparelho | smallint(5) unsigned | PK | sim | auto_increment | Identificador do aparelho |
| codigo | varchar(40) | UQ | sim |  | CÃ³digo estÃ¡vel do aparelho, usado pelo site |
| nome | varchar(80) | UQ | sim |  | Nome do aparelho mostrado na calculadora |
| id_grupo | tinyint(3) unsigned | FK → grupo_aparelho.id_grupo | sim |  | Grupo do aparelho |
| cod_tipo | varchar(15) | FK → tipo_calculo.cod_tipo | sim |  | Regra de cÃ¡lculo usada pelo aparelho |
| potencia_w | decimal(7,1) |  | não |  | PotÃªncia em watts |
| horas_dia | decimal(4,2) |  | não |  | Horas de uso por dia |
| minutos_uso | decimal(5,1) |  | não |  | Minutos de cada uso (ou de cada banho) |
| usos_mes | smallint(5) unsigned |  | não |  | Quantas vezes Ã© usado no mÃªs |
| usos_pessoa_dia | decimal(4,2) |  | não |  | Banhos por pessoa por dia (sÃ³ chuveiro) |
| espera_w | decimal(6,2) |  | não |  | PotÃªncia em modo de espera, em watts |
| meses_ano | tinyint(3) unsigned |  | não |  | Meses do ano em que Ã© usado (climatizaÃ§Ã£o) |
| etiqueta_kwh_mes | decimal(6,1) |  | não |  | Consumo da etiqueta Inmetro, em kWh por mÃªs |
| quantidade_padrao | tinyint(3) unsigned |  | sim | 1 | Quantidade que jÃ¡ vem preenchida |
| origem_valor | enum('procel','derivado','tipico') |  | sim |  | De onde veio o nÃºmero: Procel, derivado da Procel ou tÃ­pico |
| nota | varchar(255) |  | não |  | ExplicaÃ§Ã£o do nÃºmero mostrada abaixo do aparelho |
| rotulo_potencia | varchar(60) |  | não |  | Texto prÃ³prio para o campo de potÃªncia |
| rotulo_quantidade | varchar(60) |  | não |  | Texto prÃ³prio para o campo de quantidade |
| id_fonte | smallint(5) unsigned | FK → fonte.id_fonte | não |  | Fonte do nÃºmero (obrigatÃ³ria se nÃ£o for tÃ­pico) |
| na_lista_adicionar | tinyint(1) |  | sim | 1 | Aparece na lista "Adicionar aparelho" do site |
| ativo | tinyint(1) |  | sim | 1 | Falso = tirado do site sem apagar (exclusÃ£o lÃ³gica) |

Regras (CHECK): `ck_aparelho_fonte`: ``origem_valor` = 'tipico' or `id_fonte` is not null`; `ck_aparelho_horas`: ``horas_dia` is null or `horas_dia` > 0 and `horas_dia` <= 24`; `ck_aparelho_meses`: ``meses_ano` is null or `meses_ano` between 1 and 12`; `ck_aparelho_potencia`: ``potencia_w` is null or `potencia_w` > 0`; `ck_aparelho_quantidade`: ``quantidade_padrao` >= 1`

## bandeira
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_bandeira | tinyint(3) unsigned | PK | sim | auto_increment | Identificador da bandeira |
| nome | varchar(30) | UQ | sim |  | Cor e patamar da bandeira |
| acrescimo_100kwh | decimal(6,3) |  | sim |  | Reais a mais a cada 100 kWh |
| id_fonte | smallint(5) unsigned | FK → fonte.id_fonte | sim |  | Fonte do valor do acrÃ©scimo |

Regras (CHECK): `ck_bandeira_acrescimo`: ``acrescimo_100kwh` >= 0`

## bandeira_mes
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| mes_referencia | date | PK | sim |  | MÃªs, guardado como o dia 1 |
| id_bandeira | tinyint(3) unsigned | FK → bandeira.id_bandeira | sim |  | Bandeira que valeu no mÃªs |
| id_fonte | smallint(5) unsigned | FK → fonte.id_fonte | sim |  | Fonte do anÃºncio da bandeira |

Regras (CHECK): `ck_bandeira_mes_dia1`: `dayofmonth(`mes_referencia`) = 1`

## distribuidora
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_distribuidora | smallint(5) unsigned | PK | sim | auto_increment | Identificador da distribuidora |
| nome | varchar(80) | UQ | sim |  | Nome oficial da distribuidora |
| sigla | varchar(20) | UQ | sim |  | Sigla usada nos arquivos de carga |
| uf | char(2) |  | sim |  | Estado atendido |

## fonte
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_fonte | smallint(5) unsigned | PK | sim | auto_increment | Identificador da fonte |
| titulo | varchar(200) | UQ | sim |  | TÃ­tulo do documento ou da reportagem |
| orgao | varchar(80) |  | sim |  | Quem publicou (ANEEL, EPE, Procel, jornal...) |
| url | varchar(300) | UQ | não |  | EndereÃ§o na internet; nulo para fonte impressa ou fatura |
| data_consulta | date |  | sim |  | Data em que a equipe conferiu a fonte |

## grupo_aparelho
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_grupo | tinyint(3) unsigned | PK | sim | auto_increment | Identificador do grupo |
| nome | varchar(40) | UQ | sim |  | Nome do grupo mostrado na calculadora |
| ordem | tinyint(3) unsigned | UQ | sim |  | PosiÃ§Ã£o do grupo na lista da calculadora |

## mensagem_contato
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_mensagem | int(10) unsigned | PK | sim | auto_increment | Identificador da mensagem |
| nome | varchar(80) |  | sim |  | Nome de quem escreveu (dado pessoal) |
| email | varchar(254) |  | sim |  | E-mail para resposta (dado pessoal) |
| assunto | varchar(80) |  | sim |  | Assunto da mensagem |
| texto | varchar(600) |  | sim |  | Texto da mensagem |
| consentimento | tinyint(1) |  | sim |  | Pessoa concordou com o uso dos dados (sempre verdadeiro) |
| recebida_em | datetime |  | sim |  | Data e hora do envio |
| apagar_em | date |  | sim |  | Data em que a mensagem deve ser apagada (LGPD) |
| situacao | enum('nova','respondida') |  | sim | 'nova' | Nova ou respondida |

Regras (CHECK): `ck_mensagem_consentimento`: ``consentimento` = 1`; `ck_mensagem_texto`: `char_length(`texto`) >= 10`

## noticia
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_noticia | smallint(5) unsigned | PK | sim | auto_increment | Identificador da notÃ­cia |
| titulo | varchar(150) | UQ | sim |  | TÃ­tulo da notÃ­cia |
| categoria | varchar(40) |  | sim |  | Etiqueta da notÃ­cia (Reajuste, Bandeira...) |
| resumo | varchar(400) |  | sim |  | Resumo de atÃ© 400 caracteres |
| publicada_em | date |  | sim |  | Data da notÃ­cia |
| imagem | varchar(200) |  | não |  | Caminho da foto no site |
| credito_imagem | varchar(150) |  | não |  | CrÃ©dito da foto |

## noticia_fonte
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_noticia | smallint(5) unsigned | PK, FK → noticia.id_noticia | sim |  | NotÃ­cia que cita a fonte |
| id_fonte | smallint(5) unsigned | PK, FK → fonte.id_fonte | sim |  | Fonte citada |

## tarifa
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| id_tarifa | int(10) unsigned | PK | sim | auto_increment | Identificador da tarifa |
| id_distribuidora | smallint(5) unsigned | UQ, FK → distribuidora.id_distribuidora | sim |  | Distribuidora dona da tarifa |
| valor_kwh | decimal(6,4) |  | sim |  | PreÃ§o do kWh residencial, em reais |
| vigencia_inicio | date | UQ | sim |  | Primeiro dia em que a tarifa vale |
| vigencia_fim | date |  | não |  | Ãšltimo dia em que vale; nulo = em vigor |
| id_fonte | smallint(5) unsigned | FK → fonte.id_fonte | sim |  | Fonte do valor da tarifa |

Regras (CHECK): `ck_tarifa_datas`: ``vigencia_fim` is null or `vigencia_fim` >= `vigencia_inicio``; `ck_tarifa_valor`: ``valor_kwh` > 0`

## tipo_calculo
| Campo | Tipo | Chaves | NN | Padrão | Descrição |
|---|---|---|---|---|---|
| cod_tipo | varchar(15) | PK | sim |  | CÃ³digo da regra de cÃ¡lculo, o mesmo do JavaScript |
| nome | varchar(40) | UQ | sim |  | Nome da regra para mostrar Ã s pessoas |
| formula | varchar(255) |  | sim |  | FÃ³rmula da regra, por extenso |
