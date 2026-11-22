"""Acesso ao MySQL. Toda consulta usa parâmetros (%s): o valor nunca é
colado no texto do SQL, o que impede injeção de SQL (OWASP A03)."""
import mysql.connector

from wattcerto.config import dados_conexao


def conectar():
    """Abre uma conexão com o banco configurado em .env."""
    return mysql.connector.connect(**dados_conexao())


def consultar(conexao, sql, parametros=()):
    """Executa um SELECT e devolve a lista de linhas como dicionários."""
    cursor = conexao.cursor(dictionary=True)
    try:
        cursor.execute(sql, parametros)
        return cursor.fetchall()
    finally:
        cursor.close()


def consultar_um(conexao, sql, parametros=()):
    """Executa um SELECT e devolve só a primeira linha (ou None)."""
    linhas = consultar(conexao, sql, parametros)
    return linhas[0] if linhas else None


def executar(conexao, sql, parametros=()):
    """Executa INSERT, UPDATE ou DELETE e devolve (linhas afetadas, último id)."""
    cursor = conexao.cursor()
    try:
        cursor.execute(sql, parametros)
        return cursor.rowcount, cursor.lastrowid
    finally:
        cursor.close()


def explicar(conexao, sql, parametros=()):
    """Roda EXPLAIN de um SELECT e devolve o plano de execução."""
    return consultar(conexao, "EXPLAIN " + sql, parametros)
