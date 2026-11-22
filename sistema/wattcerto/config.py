"""Configuração: caminhos do projeto e dados de acesso ao banco.

A senha nunca fica no código. Ela vem de variável de ambiente ou do arquivo
.env (que não vai para o GitHub). Ver .env.exemplo.
"""
import os

PASTA_SISTEMA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA_SITE = os.path.dirname(PASTA_SISTEMA)
PASTA_ENTRADA = os.path.join(PASTA_SISTEMA, "dados", "entrada")
PASTA_SAIDA = os.path.join(PASTA_SISTEMA, "dados", "saida")
ARQUIVO_CATALOGO_SITE = os.path.join(PASTA_SITE, "dados", "catalogo.json")

DIAS_NO_MES = 30
FATOR_ESTACAO = {"inverno": 1.0, "verao": 0.7}
DIAS_GUARDAR_MENSAGEM = 180  # retenção das mensagens de contato (LGPD)


def ler_arquivo_env(caminho):
    """Lê um arquivo .env simples (CHAVE=valor por linha) e devolve um dicionário."""
    valores = {}
    if not os.path.exists(caminho):
        return valores
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            linha = linha.strip()
            if not linha or linha.startswith("#") or "=" not in linha:
                continue
            chave, valor = linha.split("=", 1)
            valores[chave.strip()] = valor.strip()
    return valores


def dados_conexao():
    """Monta os dados de conexão: a variável de ambiente vale mais que o .env."""
    arquivo = ler_arquivo_env(os.path.join(PASTA_SISTEMA, ".env"))

    def pegar(chave, padrao=""):
        return os.environ.get(chave, arquivo.get(chave, padrao))

    return {
        "host": pegar("DB_HOST", "localhost"),
        "port": int(pegar("DB_PORT", "3306")),
        "user": pegar("DB_USER"),
        "password": pegar("DB_PASSWORD"),
        "database": pegar("DB_NAME", "wattcerto"),
    }
