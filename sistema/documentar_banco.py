"""Gera a documentação do banco a partir do próprio banco (Banco de Dados I):

  docs/pi2/banco-de-dados/dicionario-de-dados.md   tabelas, campos, chaves e regras
  docs/pi2/banco-de-dados/comandos-sql.md          DML e SELECT do sistema, explicados,
                                                    cada SELECT com o resultado do EXPLAIN

Rode depois de criar e carregar o banco. Rodando no servidor do professor
(configurado no .env), o EXPLAIN mostrado é o do servidor dele.
Uso: python documentar_banco.py
"""
import os
from datetime import datetime

from wattcerto.banco import conectar, consultar, explicar
from wattcerto.config import PASTA_SITE

PASTA_DOC = os.path.join(PASTA_SITE, "docs", "pi2", "banco-de-dados")

# Os comandos abaixo são os mesmos que estão no código (arquivo indicado em "onde").
# Os parâmetros de exemplo são valores reais da carga.
COMANDOS = [
    # ---------------- SELECT ----------------
    ("SELECT", "Listar o catálogo de um grupo", "aparelhos.py, listar_aparelhos()",
     "Junta aparelho com grupo (JOIN) e com fonte (LEFT JOIN, porque aparelho de valor típico não tem fonte). "
     "Filtra os ativos de um grupo e ordena como aparece no site.",
     "SELECT a.codigo, a.nome, g.nome AS grupo, a.cod_tipo, a.potencia_w, a.origem_valor, f.titulo AS fonte "
     "FROM aparelho a JOIN grupo_aparelho g ON g.id_grupo = a.id_grupo "
     "LEFT JOIN fonte f ON f.id_fonte = a.id_fonte "
     "WHERE a.ativo = TRUE AND g.nome = %s ORDER BY g.ordem, a.id_aparelho", ("Cozinha",)),
    ("SELECT", "Buscar um aparelho pelo código", "aparelhos.py, buscar_por_codigo()",
     "Busca exata pela coluna codigo, que tem índice único (uq_aparelho_codigo): o banco vai direto na linha.",
     "SELECT a.codigo, a.nome, a.cod_tipo, a.potencia_w FROM aparelho a WHERE a.codigo = %s", ("chuveiro",)),
    ("SELECT", "Buscar aparelhos por parte do nome", "aparelhos.py, buscar_por_nome()",
     "LIKE com % no começo não usa índice: o banco lê a tabela inteira. Com algumas dezenas de aparelhos "
     "isso é instantâneo; com milhares, a saída seria um índice FULLTEXT.",
     "SELECT a.codigo, a.nome FROM aparelho a WHERE a.nome LIKE %s ORDER BY a.nome", ("%ar-condicionado%",)),
    ("SELECT", "Grupos que aparecem na lista do site", "exportar.py, exportar_catalogo_site()",
     "DISTINCT tira os grupos repetidos; só entram grupos com pelo menos um aparelho ativo na lista.",
     "SELECT DISTINCT g.nome, g.ordem FROM grupo_aparelho g JOIN aparelho a ON a.id_grupo = g.id_grupo "
     "WHERE a.ativo = TRUE AND a.na_lista_adicionar = TRUE ORDER BY g.ordem", ()),
    ("SELECT", "Bandeiras do menor para o maior acréscimo", "indicadores.py, peso_das_bandeiras()",
     "Lê as quatro bandeiras para montar a tabela de quanto cada uma soma na conta.",
     "SELECT nome, acrescimo_100kwh FROM bandeira ORDER BY acrescimo_100kwh", ()),
    ("SELECT", "Bandeira de um mês", "indicadores.py, bandeira_do_mes()",
     "O mês é a chave primária de bandeira_mes, então a busca é direta; o JOIN traz o nome e o valor.",
     "SELECT b.nome, b.acrescimo_100kwh FROM bandeira_mes bm JOIN bandeira b ON b.id_bandeira = bm.id_bandeira "
     "WHERE bm.mes_referencia = %s", ("2026-11-01",)),
    ("SELECT", "Tarifa em vigor de uma distribuidora", "consulta de apoio às tarifas",
     "vigencia_fim nula indica a tarifa atual. Há dois índices que começam por id_distribuidora "
     "(uq_tarifa_periodo e ix_tarifa_vigente); o otimizador escolhe um conforme a quantidade de linhas.",
     "SELECT t.valor_kwh, t.vigencia_inicio FROM tarifa t WHERE t.id_distribuidora = %s AND t.vigencia_fim IS NULL",
     (1,)),
    ("SELECT", "Fontes de cada notícia (N:N)", "conferência das notícias",
     "Passa pela tabela associativa noticia_fonte para ligar notícias e fontes. GROUP_CONCAT junta as fontes numa linha.",
     "SELECT n.titulo, GROUP_CONCAT(f.orgao ORDER BY f.orgao SEPARATOR ', ') AS fontes FROM noticia n "
     "JOIN noticia_fonte nf ON nf.id_noticia = n.id_noticia JOIN fonte f ON f.id_fonte = nf.id_fonte "
     "GROUP BY n.id_noticia, n.titulo ORDER BY n.publicada_em DESC", ()),
    ("SELECT", "Mensagem já importada?", "contato.py, importar_csv()",
     "Evita importar a mesma mensagem duas vezes (mesmo e-mail e mesmo horário). Usa o índice "
     "ix_mensagem_email, criado depois que o EXPLAIN mostrou leitura da tabela inteira.",
     "SELECT id_mensagem FROM mensagem_contato WHERE email = %s AND recebida_em = %s",
     ("maria.exemplo@exemplo.com", "2026-11-10 13:20:00")),
    ("SELECT", "Mensagens por situação", "contato.py, listar_mensagens()",
     "Lista as mensagens novas, das mais recentes para as mais antigas.",
     "SELECT id_mensagem, nome, assunto, recebida_em, situacao FROM mensagem_contato "
     "WHERE situacao = %s ORDER BY recebida_em DESC", ("nova",)),
    ("SELECT", "Quantos aparelhos têm fonte oficial", "indicadores.py (conferência no banco)",
     "Agrupa o catálogo pela origem do número. É o mesmo indicador que o Python calcula com dicionários.",
     "SELECT origem_valor, COUNT(*) AS quantidade FROM aparelho WHERE ativo = TRUE GROUP BY origem_valor", ()),
]

DML = [
    ("INSERT", "Gravar ou atualizar uma fonte", "carga.py, carregar_fontes()",
     "ON DUPLICATE KEY UPDATE usa a chave única do título: se a fonte já existe, atualiza em vez de duplicar. "
     "Assim a carga pode ser rodada de novo sem erro.",
     "INSERT INTO fonte (titulo, orgao, url, data_consulta) VALUES (%s, %s, %s, %s) "
     "ON DUPLICATE KEY UPDATE orgao = VALUES(orgao), url = VALUES(url), data_consulta = VALUES(data_consulta)"),
    ("INSERT", "Cadastrar aparelho", "aparelhos.py, cadastrar_aparelho()",
     "Os valores vão como parâmetros (%s), nunca colados no texto: isso impede injeção de SQL. "
     "Antes do INSERT o Python já validou tipo, faixas e fonte.",
     "INSERT INTO aparelho (codigo, nome, id_grupo, cod_tipo, potencia_w, horas_dia, minutos_uso, usos_mes, "
     "usos_pessoa_dia, espera_w, meses_ano, etiqueta_kwh_mes, quantidade_padrao, origem_valor, nota, id_fonte) "
     "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"),
    ("INSERT", "Ligar notícia e fonte", "carga.py, carregar_noticias()",
     "INSERT IGNORE: se o par (notícia, fonte) já existe, a chave primária composta impede a repetição e o "
     "comando segue sem erro.",
     "INSERT IGNORE INTO noticia_fonte (id_noticia, id_fonte) VALUES (%s, %s)"),
    ("INSERT", "Guardar mensagem do contato", "contato.py, importar_csv()",
     "consentimento entra sempre TRUE (o CHECK do banco recusa FALSE) e apagar_em é a data de envio + 180 dias.",
     "INSERT INTO mensagem_contato (nome, email, assunto, texto, consentimento, recebida_em, apagar_em) "
     "VALUES (%s, %s, %s, %s, TRUE, %s, %s)"),
    ("UPDATE", "Alterar campos de um aparelho", "aparelhos.py, atualizar_aparelho()",
     "Só colunas de uma lista branca podem entrar no SET; o código e a origem do valor não mudam por aqui.",
     "UPDATE aparelho SET potencia_w = %s WHERE codigo = %s"),
    ("UPDATE", "Tirar aparelho do site", "aparelhos.py, desativar_aparelho()",
     "Exclusão lógica: o aparelho some do site, mas o registro e o histórico continuam no banco.",
     "UPDATE aparelho SET ativo = FALSE WHERE codigo = %s"),
    ("UPDATE", "Marcar mensagem como respondida", "contato.py, marcar_respondida()",
     "Muda a situação para a equipe saber o que já foi atendido.",
     "UPDATE mensagem_contato SET situacao = 'respondida' WHERE id_mensagem = %s"),
    ("DELETE", "Apagar aparelho de vez", "aparelhos.py, excluir_aparelho()",
     "Exclusão física. Só funciona se nada depender do aparelho.",
     "DELETE FROM aparelho WHERE codigo = %s"),
    ("DELETE", "Apagar mensagens vencidas", "contato.py, apagar_vencidas()",
     "Cumpre o prazo de guarda (LGPD): apaga o que passou de apagar_em. Usa o índice ix_mensagem_apagar.",
     "DELETE FROM mensagem_contato WHERE apagar_em < %s"),
]


def tabela_md(linhas, colunas):
    if not linhas:
        return "_(sem linhas)_\n"
    texto = "| " + " | ".join(colunas) + " |\n|" + "---|" * len(colunas) + "\n"
    for linha in linhas:
        texto += "| " + " | ".join("" if linha.get(c) is None else str(linha.get(c)).replace("|", "\\|")
                                  for c in colunas) + " |\n"
    return texto


def servidor(conexao):
    return consultar(conexao, "SELECT VERSION() AS v")[0]["v"]


def gerar_dicionario(conexao):
    banco = conexao.database
    tabelas = consultar(conexao, "SELECT TABLE_NAME, TABLE_COMMENT FROM information_schema.TABLES "
                                 "WHERE TABLE_SCHEMA = %s ORDER BY TABLE_NAME", (banco,))
    texto = ["# Dicionário de dados | WattCerto\n",
             f"Gerado do próprio banco em {datetime.now():%d/%m/%Y %H:%M} (servidor {servidor(conexao)}). "
             "Script de criação: `sistema/sql/01_criar_banco.sql`.\n",
             "Legenda: **PK** chave primária, **FK** chave estrangeira, **UQ** valor único, "
             "**NN** não nulo (NOT NULL).\n"]
    for t in tabelas:
        nome = t["TABLE_NAME"]
        colunas = consultar(conexao,
            "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, COLUMN_COMMENT "
            "FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s ORDER BY ORDINAL_POSITION",
            (banco, nome))
        chaves = consultar(conexao,
            "SELECT k.COLUMN_NAME, c.CONSTRAINT_TYPE, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME "
            "FROM information_schema.KEY_COLUMN_USAGE k JOIN information_schema.TABLE_CONSTRAINTS c "
            "ON c.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA AND c.TABLE_NAME = k.TABLE_NAME "
            "AND c.CONSTRAINT_NAME = k.CONSTRAINT_NAME WHERE k.TABLE_SCHEMA = %s AND k.TABLE_NAME = %s",
            (banco, nome))
        marcas = {}
        for k in chaves:
            if k["CONSTRAINT_TYPE"] == "PRIMARY KEY":
                rotulo = "PK"
            elif k["CONSTRAINT_TYPE"] == "FOREIGN KEY":
                rotulo = f"FK → {k['REFERENCED_TABLE_NAME']}.{k['REFERENCED_COLUMN_NAME']}"
            else:
                rotulo = "UQ"
            marcas.setdefault(k["COLUMN_NAME"], []).append(rotulo)
        texto.append(f"\n## {nome}\n")
        texto.append("| Campo | Tipo | Chaves | NN | Padrão | Descrição |\n|---|---|---|---|---|---|\n")
        for c in colunas:
            padrao = c["COLUMN_DEFAULT"]
            if c["EXTRA"] and "auto_increment" in c["EXTRA"]:
                padrao = "auto_increment"
            if padrao in (None, "NULL"):
                padrao = ""
            texto.append(f"| {c['COLUMN_NAME']} | {c['COLUMN_TYPE']} | {', '.join(marcas.get(c['COLUMN_NAME'], []))} "
                         f"| {'sim' if c['IS_NULLABLE'] == 'NO' else 'não'} | {padrao} | {c['COLUMN_COMMENT']} |\n")
        regras = consultar(conexao,
            "SELECT CONSTRAINT_NAME, CHECK_CLAUSE FROM information_schema.CHECK_CONSTRAINTS "
            "WHERE CONSTRAINT_SCHEMA = %s AND TABLE_NAME = %s ORDER BY CONSTRAINT_NAME", (banco, nome))
        if regras:
            texto.append("\nRegras (CHECK): " + "; ".join(
                f"`{r['CONSTRAINT_NAME']}`: `{r['CHECK_CLAUSE']}`" for r in regras) + "\n")
    caminho = os.path.join(PASTA_DOC, "dicionario-de-dados.md")
    with open(caminho, "w", encoding="utf-8") as arquivo:
        arquivo.write("".join(texto))
    return caminho


def _sql_exemplo(sql, parametros):
    """Mostra o comando com os valores de exemplo no lugar dos %s (só para leitura)."""
    for valor in parametros:
        sql = sql.replace("%s", repr(valor) if isinstance(valor, str) else str(valor), 1)
    return sql


def gerar_comandos(conexao):
    texto = ["# Comandos SQL do sistema | WattCerto\n",
             f"Gerado em {datetime.now():%d/%m/%Y %H:%M}, servidor {servidor(conexao)}. "
             "Todos os comandos abaixo estão no código Python (`sistema/wattcerto/`), no arquivo indicado. "
             "No código os valores entram como parâmetros (`%s`); aqui eles aparecem preenchidos com dados reais "
             "da carga para o EXPLAIN poder rodar.\n",
             "\n## Como ler o EXPLAIN\n",
             "- **type**: como a tabela é lida. `const`/`eq_ref` = vai direto numa linha pela chave (o melhor); "
             "`ref` = usa um índice; `index` = lê o índice inteiro; `ALL` = lê a tabela inteira.\n"
             "- **key**: o índice escolhido. **rows**: quantas linhas o banco estima ler.\n"
             "- **Extra**: `Using where` = filtra depois de ler; `Using filesort` = precisou ordenar; "
             "`Using index` = respondeu só com o índice.\n",
             "\n## Comandos de alteração (DML)\n"]
    for numero, (tipo, titulo, onde, explicacao, sql) in enumerate(DML, start=1):
        texto.append(f"\n### D{numero}. {titulo} ({tipo})\n\n**Onde:** `{onde}`  \n**O que faz:** {explicacao}\n\n"
                     f"```sql\n{sql};\n```\n")
    texto.append("\n## Consultas (SELECT) com EXPLAIN\n")
    for numero, (_, titulo, onde, explicacao, sql, parametros) in enumerate(COMANDOS, start=1):
        plano = explicar(conexao, sql, parametros)
        colunas = [c for c in ("id", "select_type", "table", "type", "possible_keys", "key", "key_len",
                               "ref", "rows", "Extra") if plano and c in plano[0]]
        texto.append(f"\n### S{numero}. {titulo}\n\n**Onde:** `{onde}`  \n**O que faz:** {explicacao}\n\n"
                     f"```sql\n{_sql_exemplo(sql, parametros)};\n```\n\n**EXPLAIN:**\n\n{tabela_md(plano, colunas)}")
    caminho = os.path.join(PASTA_DOC, "comandos-sql.md")
    with open(caminho, "w", encoding="utf-8") as arquivo:
        arquivo.write("".join(texto))
    return caminho


def main():
    os.makedirs(PASTA_DOC, exist_ok=True)
    conexao = conectar()
    try:
        print("Gerado:", gerar_dicionario(conexao))
        print("Gerado:", gerar_comandos(conexao))
    finally:
        conexao.close()


if __name__ == "__main__":
    main()
