# Comandos SQL do sistema | WattCerto
Gerado em 18/11/2026 14:37, servidor 10.11.14-MariaDB-0ubuntu0.24.04.1. Todos os comandos abaixo estão no código Python (`sistema/wattcerto/`), no arquivo indicado. No código os valores entram como parâmetros (`%s`); aqui eles aparecem preenchidos com dados reais da carga para o EXPLAIN poder rodar.

## Como ler o EXPLAIN
- **type**: como a tabela é lida. `const`/`eq_ref` = vai direto numa linha pela chave (o melhor); `ref` = usa um índice; `index` = lê o índice inteiro; `ALL` = lê a tabela inteira.
- **key**: o índice escolhido. **rows**: quantas linhas o banco estima ler.
- **Extra**: `Using where` = filtra depois de ler; `Using filesort` = precisou ordenar; `Using index` = respondeu só com o índice.

## Comandos de alteração (DML)

### D1. Gravar ou atualizar uma fonte (INSERT)

**Onde:** `carga.py, carregar_fontes()`  
**O que faz:** ON DUPLICATE KEY UPDATE usa a chave única do título: se a fonte já existe, atualiza em vez de duplicar. Assim a carga pode ser rodada de novo sem erro.

```sql
INSERT INTO fonte (titulo, orgao, url, data_consulta) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE orgao = VALUES(orgao), url = VALUES(url), data_consulta = VALUES(data_consulta);
```

### D2. Cadastrar aparelho (INSERT)

**Onde:** `aparelhos.py, cadastrar_aparelho()`  
**O que faz:** Os valores vão como parâmetros (%s), nunca colados no texto: isso impede injeção de SQL. Antes do INSERT o Python já validou tipo, faixas e fonte.

```sql
INSERT INTO aparelho (codigo, nome, id_grupo, cod_tipo, potencia_w, horas_dia, minutos_uso, usos_mes, usos_pessoa_dia, espera_w, meses_ano, etiqueta_kwh_mes, quantidade_padrao, origem_valor, nota, id_fonte) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
```

### D3. Ligar notícia e fonte (INSERT)

**Onde:** `carga.py, carregar_noticias()`  
**O que faz:** INSERT IGNORE: se o par (notícia, fonte) já existe, a chave primária composta impede a repetição e o comando segue sem erro.

```sql
INSERT IGNORE INTO noticia_fonte (id_noticia, id_fonte) VALUES (%s, %s);
```

### D4. Guardar mensagem do contato (INSERT)

**Onde:** `contato.py, importar_csv()`  
**O que faz:** consentimento entra sempre TRUE (o CHECK do banco recusa FALSE) e apagar_em é a data de envio + 180 dias.

```sql
INSERT INTO mensagem_contato (nome, email, assunto, texto, consentimento, recebida_em, apagar_em) VALUES (%s, %s, %s, %s, TRUE, %s, %s);
```

### D5. Alterar campos de um aparelho (UPDATE)

**Onde:** `aparelhos.py, atualizar_aparelho()`  
**O que faz:** Só colunas de uma lista branca podem entrar no SET; o código e a origem do valor não mudam por aqui.

```sql
UPDATE aparelho SET potencia_w = %s WHERE codigo = %s;
```

### D6. Tirar aparelho do site (UPDATE)

**Onde:** `aparelhos.py, desativar_aparelho()`  
**O que faz:** Exclusão lógica: o aparelho some do site, mas o registro e o histórico continuam no banco.

```sql
UPDATE aparelho SET ativo = FALSE WHERE codigo = %s;
```

### D7. Marcar mensagem como respondida (UPDATE)

**Onde:** `contato.py, marcar_respondida()`  
**O que faz:** Muda a situação para a equipe saber o que já foi atendido.

```sql
UPDATE mensagem_contato SET situacao = 'respondida' WHERE id_mensagem = %s;
```

### D8. Apagar aparelho de vez (DELETE)

**Onde:** `aparelhos.py, excluir_aparelho()`  
**O que faz:** Exclusão física. Só funciona se nada depender do aparelho.

```sql
DELETE FROM aparelho WHERE codigo = %s;
```

### D9. Apagar mensagens vencidas (DELETE)

**Onde:** `contato.py, apagar_vencidas()`  
**O que faz:** Cumpre o prazo de guarda (LGPD): apaga o que passou de apagar_em. Usa o índice ix_mensagem_apagar.

```sql
DELETE FROM mensagem_contato WHERE apagar_em < %s;
```

## Consultas (SELECT) com EXPLAIN

### S1. Listar o catálogo de um grupo

**Onde:** `aparelhos.py, listar_aparelhos()`  
**O que faz:** Junta aparelho com grupo (JOIN) e com fonte (LEFT JOIN, porque aparelho de valor típico não tem fonte). Filtra os ativos de um grupo e ordena como aparece no site.

```sql
SELECT a.codigo, a.nome, g.nome AS grupo, a.cod_tipo, a.potencia_w, a.origem_valor, f.titulo AS fonte FROM aparelho a JOIN grupo_aparelho g ON g.id_grupo = a.id_grupo LEFT JOIN fonte f ON f.id_fonte = a.id_fonte WHERE a.ativo = TRUE AND g.nome = 'Cozinha' ORDER BY g.ordem, a.id_aparelho;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | g | const | PRIMARY,uq_grupo_nome | uq_grupo_nome | 162 | const | 1 |  |
| 1 | SIMPLE | a | ref | fk_aparelho_grupo | fk_aparelho_grupo | 1 | const | 5 | Using where |
| 1 | SIMPLE | f | eq_ref | PRIMARY | PRIMARY | 2 | wattcerto.a.id_fonte | 1 | Using where |

### S2. Buscar um aparelho pelo código

**Onde:** `aparelhos.py, buscar_por_codigo()`  
**O que faz:** Busca exata pela coluna codigo, que tem índice único (uq_aparelho_codigo): o banco vai direto na linha.

```sql
SELECT a.codigo, a.nome, a.cod_tipo, a.potencia_w FROM aparelho a WHERE a.codigo = 'chuveiro';
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | a | const | uq_aparelho_codigo | uq_aparelho_codigo | 162 | const | 1 |  |

### S3. Buscar aparelhos por parte do nome

**Onde:** `aparelhos.py, buscar_por_nome()`  
**O que faz:** LIKE com % no começo não usa índice: o banco lê a tabela inteira. Com algumas dezenas de aparelhos isso é instantâneo; com milhares, a saída seria um índice FULLTEXT.

```sql
SELECT a.codigo, a.nome FROM aparelho a WHERE a.nome LIKE '%ar-condicionado%' ORDER BY a.nome;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | a | ALL |  |  |  |  | 25 | Using where; Using filesort |

### S4. Grupos que aparecem na lista do site

**Onde:** `exportar.py, exportar_catalogo_site()`  
**O que faz:** DISTINCT tira os grupos repetidos; só entram grupos com pelo menos um aparelho ativo na lista.

```sql
SELECT DISTINCT g.nome, g.ordem FROM grupo_aparelho g JOIN aparelho a ON a.id_grupo = g.id_grupo WHERE a.ativo = TRUE AND a.na_lista_adicionar = TRUE ORDER BY g.ordem;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | g | ALL | PRIMARY |  |  |  | 5 | Using temporary; Using filesort |
| 1 | SIMPLE | a | ref | fk_aparelho_grupo | fk_aparelho_grupo | 1 | wattcerto.g.id_grupo | 1 | Using where; Distinct |

### S5. Bandeiras do menor para o maior acréscimo

**Onde:** `indicadores.py, peso_das_bandeiras()`  
**O que faz:** Lê as quatro bandeiras para montar a tabela de quanto cada uma soma na conta.

```sql
SELECT nome, acrescimo_100kwh FROM bandeira ORDER BY acrescimo_100kwh;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | bandeira | ALL |  |  |  |  | 4 | Using filesort |

### S6. Bandeira de um mês

**Onde:** `indicadores.py, bandeira_do_mes()`  
**O que faz:** O mês é a chave primária de bandeira_mes, então a busca é direta; o JOIN traz o nome e o valor.

```sql
SELECT b.nome, b.acrescimo_100kwh FROM bandeira_mes bm JOIN bandeira b ON b.id_bandeira = bm.id_bandeira WHERE bm.mes_referencia = '2026-11-01';
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | bm | const | PRIMARY,fk_bandeira_mes_bandeira | PRIMARY | 3 | const | 1 |  |
| 1 | SIMPLE | b | const | PRIMARY | PRIMARY | 1 | const | 1 |  |

### S7. Tarifa em vigor de uma distribuidora

**Onde:** `consulta de apoio às tarifas`  
**O que faz:** vigencia_fim nula indica a tarifa atual. Há dois índices que começam por id_distribuidora (uq_tarifa_periodo e ix_tarifa_vigente); o otimizador escolhe um conforme a quantidade de linhas.

```sql
SELECT t.valor_kwh, t.vigencia_inicio FROM tarifa t WHERE t.id_distribuidora = 1 AND t.vigencia_fim IS NULL;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | t | ref | uq_tarifa_periodo,ix_tarifa_vigente | uq_tarifa_periodo | 2 | const | 1 | Using where |

### S8. Fontes de cada notícia (N:N)

**Onde:** `conferência das notícias`  
**O que faz:** Passa pela tabela associativa noticia_fonte para ligar notícias e fontes. GROUP_CONCAT junta as fontes numa linha.

```sql
SELECT n.titulo, GROUP_CONCAT(f.orgao ORDER BY f.orgao SEPARATOR ', ') AS fontes FROM noticia n JOIN noticia_fonte nf ON nf.id_noticia = n.id_noticia JOIN fonte f ON f.id_fonte = nf.id_fonte GROUP BY n.id_noticia, n.titulo ORDER BY n.publicada_em DESC;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | n | ALL | PRIMARY |  |  |  | 3 | Using temporary; Using filesort |
| 1 | SIMPLE | nf | ref | PRIMARY,fk_nf_fonte | PRIMARY | 2 | wattcerto.n.id_noticia | 1 | Using index |
| 1 | SIMPLE | f | eq_ref | PRIMARY | PRIMARY | 2 | wattcerto.nf.id_fonte | 1 |  |

### S9. Mensagem já importada?

**Onde:** `contato.py, importar_csv()`  
**O que faz:** Evita importar a mesma mensagem duas vezes (mesmo e-mail e mesmo horário). Usa o índice ix_mensagem_email, criado depois que o EXPLAIN mostrou leitura da tabela inteira.

```sql
SELECT id_mensagem FROM mensagem_contato WHERE email = 'maria.exemplo@exemplo.com' AND recebida_em = '2026-11-10 13:20:00';
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | mensagem_contato | ref | ix_mensagem_email | ix_mensagem_email | 1023 | const,const | 1 | Using where; Using index |

### S10. Mensagens por situação

**Onde:** `contato.py, listar_mensagens()`  
**O que faz:** Lista as mensagens novas, das mais recentes para as mais antigas.

```sql
SELECT id_mensagem, nome, assunto, recebida_em, situacao FROM mensagem_contato WHERE situacao = 'nova' ORDER BY recebida_em DESC;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | mensagem_contato | ALL |  |  |  |  | 2 | Using where; Using filesort |

### S11. Quantos aparelhos têm fonte oficial

**Onde:** `indicadores.py (conferência no banco)`  
**O que faz:** Agrupa o catálogo pela origem do número. É o mesmo indicador que o Python calcula com dicionários.

```sql
SELECT origem_valor, COUNT(*) AS quantidade FROM aparelho WHERE ativo = TRUE GROUP BY origem_valor;
```

**EXPLAIN:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | aparelho | ALL |  |  |  |  | 25 | Using where; Using temporary; Using filesort |

## Prova no servidor do Banin (turma da tarde, grupo 03)

Em 22/11/2026 as 11 tabelas e os dados do sistema foram criados no servidor da turma (phpMyAdmin, banco `u704608208_turma_tarde`). O banco é compartilhado entre os grupos, então todas as tabelas, chaves e índices do grupo 03 começam com `g03_` (ex.: `g03_aparelho`, `g03_fk_aparelho_grupo`). Nas consultas abaixo os nomes aparecem sem o prefixo; no servidor dele, acrescente `g03_`.

Contagem de linhas conferida após a carga: fonte 9, grupo_aparelho 5, tipo_calculo 6, aparelho 25, distribuidora 1, bandeira 4, bandeira_mes 1, noticia 3, noticia_fonte 4.

**EXPLAIN da consulta S1 rodado no servidor do Banin** (resultado idêntico ao do servidor local):

```sql
EXPLAIN SELECT g.nome AS grupo, a.nome AS aparelho, a.potencia_w
FROM g03_aparelho a JOIN g03_grupo_aparelho g ON g.id_grupo = a.id_grupo
WHERE g.nome = 'Cozinha' ORDER BY a.nome;
```

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SIMPLE | g | const | PRIMARY, g03_uq_grupo_nome | g03_uq_grupo_nome | 162 | const | 1 | Using index |
| 1 | SIMPLE | a | ref | g03_fk_aparelho_grupo | g03_fk_aparelho_grupo | 1 | const | 5 | Using where; Using filesort |

Leitura: o grupo é achado direto pelo índice único do nome (`const`, 1 linha) e os aparelhos são lidos pelo índice da chave estrangeira (`ref`, 5 linhas), sem varrer a tabela inteira. O `Using filesort` é só a ordenação por nome de poucas linhas.
