-- WattCerto | Grupo 03 | EXPLAIN das 11 consultas (S1 a S11) de comandos-sql.md
-- Rodar no phpMyAdmin do servidor (banco u704608208_turma_tarde), aba SQL.
-- Cada EXPLAIN mostra como o servidor executa a consulta. Não altera nenhum dado.

-- S1. Listar o catálogo de um grupo
EXPLAIN SELECT a.codigo, a.nome, g.nome AS grupo, a.cod_tipo, a.potencia_w, a.origem_valor, f.titulo AS fonte FROM g03_aparelho a JOIN g03_grupo_aparelho g ON g.id_grupo = a.id_grupo LEFT JOIN g03_fonte f ON f.id_fonte = a.id_fonte WHERE a.ativo = TRUE AND g.nome = 'Cozinha' ORDER BY g.ordem, a.id_aparelho;

-- S2. Buscar um aparelho pelo código
EXPLAIN SELECT a.codigo, a.nome, a.cod_tipo, a.potencia_w FROM g03_aparelho a WHERE a.codigo = 'chuveiro';

-- S3. Buscar aparelhos por parte do nome
EXPLAIN SELECT a.codigo, a.nome FROM g03_aparelho a WHERE a.nome LIKE '%ar-condicionado%' ORDER BY a.nome;

-- S4. Grupos que aparecem na lista do site
EXPLAIN SELECT DISTINCT g.nome, g.ordem FROM g03_grupo_aparelho g JOIN g03_aparelho a ON a.id_grupo = g.id_grupo WHERE a.ativo = TRUE AND a.na_lista_adicionar = TRUE ORDER BY g.ordem;

-- S5. Bandeiras do menor para o maior acréscimo
EXPLAIN SELECT nome, acrescimo_100kwh FROM g03_bandeira ORDER BY acrescimo_100kwh;

-- S6. Bandeira de um mês
EXPLAIN SELECT b.nome, b.acrescimo_100kwh FROM g03_bandeira_mes bm JOIN g03_bandeira b ON b.id_bandeira = bm.id_bandeira WHERE bm.mes_referencia = '2026-11-01';

-- S7. Tarifa em vigor de uma distribuidora
EXPLAIN SELECT t.valor_kwh, t.vigencia_inicio FROM g03_tarifa t WHERE t.id_distribuidora = 1 AND t.vigencia_fim IS NULL;

-- S8. Fontes de cada notícia (N:N)
EXPLAIN SELECT n.titulo, GROUP_CONCAT(f.orgao ORDER BY f.orgao SEPARATOR ', ') AS fontes FROM g03_noticia n JOIN g03_noticia_fonte nf ON nf.id_noticia = n.id_noticia JOIN g03_fonte f ON f.id_fonte = nf.id_fonte GROUP BY n.id_noticia, n.titulo ORDER BY n.publicada_em DESC;

-- S9. Mensagem já importada?
EXPLAIN SELECT id_mensagem FROM g03_mensagem_contato WHERE email = 'maria.exemplo@exemplo.com' AND recebida_em = '2026-11-10 13:20:00';

-- S10. Mensagens por situação
EXPLAIN SELECT id_mensagem, nome, assunto, recebida_em, situacao FROM g03_mensagem_contato WHERE situacao = 'nova' ORDER BY recebida_em DESC;

-- S11. Quantos aparelhos têm fonte oficial
EXPLAIN SELECT origem_valor, COUNT(*) AS quantidade FROM g03_aparelho WHERE ativo = TRUE GROUP BY origem_valor;
