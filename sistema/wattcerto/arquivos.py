"""Leitura e gravação de arquivos CSV e JSON (persistência em arquivo)."""
import csv
import json
import os

SEPARADOR = ";"  # padrão brasileiro: o Excel em português abre direto


def descobrir_separador(primeira_linha):
    """Os arquivos da equipe usam ";"; o CSV baixado do Netlify usa ","."""
    return ";" if primeira_linha.count(";") > primeira_linha.count(",") else ","


def ler_csv(caminho):
    """Lê um CSV com cabeçalho e devolve uma lista de dicionários.
    Campo vazio vira None, para o banco gravar NULL."""
    with open(caminho, newline="", encoding="utf-8-sig") as arquivo:
        separador = descobrir_separador(arquivo.readline())
        arquivo.seek(0)
        leitor = csv.DictReader(arquivo, delimiter=separador)
        linhas = []
        for linha in leitor:
            linhas.append({chave: (valor if valor != "" else None) for chave, valor in linha.items()})
        return linhas


def gravar_csv(caminho, linhas, campos=None):
    """Grava uma lista de dicionários em CSV. Devolve quantas linhas gravou."""
    if campos is None:
        campos = list(linhas[0].keys()) if linhas else []
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", newline="", encoding="utf-8") as arquivo:
        escritor = csv.DictWriter(arquivo, fieldnames=campos, delimiter=SEPARADOR, extrasaction="ignore")
        escritor.writeheader()
        escritor.writerows(linhas)
    return len(linhas)


def ler_json(caminho):
    """Lê um arquivo JSON e devolve o conteúdo (lista ou dicionário)."""
    with open(caminho, encoding="utf-8") as arquivo:
        return json.load(arquivo)


def gravar_json(caminho, conteudo):
    """Grava conteúdo em JSON legível (acentos preservados)."""
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", encoding="utf-8") as arquivo:
        json.dump(conteudo, arquivo, ensure_ascii=False, indent=2)
        arquivo.write("\n")
