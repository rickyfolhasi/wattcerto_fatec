"""Carga dos arquivos CSV/JSON para o banco, na ordem das dependências
(primeiro as tabelas que não apontam para ninguém).

Pode rodar de novo sem duplicar: cada INSERT usa ON DUPLICATE KEY UPDATE
sobre uma chave única (título, nome, código...)."""
import os

from wattcerto import arquivos, validacao
from wattcerto.banco import consultar_um, executar
from wattcerto.config import PASTA_ENTRADA


def _arquivo(nome):
    return os.path.join(PASTA_ENTRADA, nome)


def _id(conexao, sql, valor):
    linha = consultar_um(conexao, sql, (valor,))
    if linha is None:
        raise ValueError(f"referência não encontrada: {valor}")
    return list(linha.values())[0]


def carregar_fontes(conexao):
    """Grava as fontes e devolve o mapa chave do CSV -> id_fonte."""
    mapa = {}
    for f in arquivos.ler_csv(_arquivo("fontes.csv")):
        executar(conexao,
                 "INSERT INTO fonte (titulo, orgao, url, data_consulta) VALUES (%s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE orgao = VALUES(orgao), url = VALUES(url), "
                 "data_consulta = VALUES(data_consulta)",
                 (f["titulo"], f["orgao"], f["url"], f["data_consulta"]))
        mapa[f["chave"]] = _id(conexao, "SELECT id_fonte FROM fonte WHERE titulo = %s", f["titulo"])
    return mapa


def carregar_grupos(conexao):
    for g in arquivos.ler_csv(_arquivo("grupos.csv")):
        executar(conexao,
                 "INSERT INTO grupo_aparelho (nome, ordem) VALUES (%s, %s) "
                 "ON DUPLICATE KEY UPDATE ordem = VALUES(ordem)",
                 (g["nome"], int(g["ordem"])))


def carregar_tipos(conexao):
    for t in arquivos.ler_csv(_arquivo("tipos_calculo.csv")):
        executar(conexao,
                 "INSERT INTO tipo_calculo (cod_tipo, nome, formula) VALUES (%s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE nome = VALUES(nome), formula = VALUES(formula)",
                 (t["cod_tipo"], t["nome"], t["formula"]))


def carregar_aparelhos(conexao, fontes):
    """Valida cada aparelho antes de gravar. Devolve (gravados, lista de rejeitados)."""
    gravados, rejeitados = 0, []
    for linha in arquivos.ler_csv(_arquivo("aparelhos.csv")):
        aparelho, erros = validacao.normalizar_aparelho(linha)
        erros += validacao.validar_aparelho(aparelho)
        if aparelho.get("fonte") and aparelho["fonte"] not in fontes:
            erros.append(f"fonte desconhecida: {aparelho['fonte']}")
        if erros:
            rejeitados.append((linha.get("codigo"), erros))
            continue
        id_grupo = _id(conexao, "SELECT id_grupo FROM grupo_aparelho WHERE nome = %s", aparelho["grupo"])
        executar(conexao,
                 "INSERT INTO aparelho (codigo, nome, id_grupo, cod_tipo, potencia_w, horas_dia, "
                 "minutos_uso, usos_mes, usos_pessoa_dia, espera_w, meses_ano, etiqueta_kwh_mes, "
                 "quantidade_padrao, origem_valor, nota, rotulo_potencia, rotulo_quantidade, id_fonte, "
                 "na_lista_adicionar) "
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE nome = VALUES(nome), id_grupo = VALUES(id_grupo), "
                 "cod_tipo = VALUES(cod_tipo), potencia_w = VALUES(potencia_w), horas_dia = VALUES(horas_dia), "
                 "minutos_uso = VALUES(minutos_uso), usos_mes = VALUES(usos_mes), "
                 "usos_pessoa_dia = VALUES(usos_pessoa_dia), espera_w = VALUES(espera_w), "
                 "meses_ano = VALUES(meses_ano), etiqueta_kwh_mes = VALUES(etiqueta_kwh_mes), "
                 "quantidade_padrao = VALUES(quantidade_padrao), origem_valor = VALUES(origem_valor), "
                 "nota = VALUES(nota), rotulo_potencia = VALUES(rotulo_potencia), "
                 "rotulo_quantidade = VALUES(rotulo_quantidade), id_fonte = VALUES(id_fonte), "
                 "na_lista_adicionar = VALUES(na_lista_adicionar)",
                 (aparelho["codigo"], aparelho["nome"], id_grupo, aparelho["cod_tipo"],
                  aparelho["potencia_w"], aparelho["horas_dia"], aparelho["minutos_uso"],
                  aparelho["usos_mes"], aparelho["usos_pessoa_dia"], aparelho["espera_w"],
                  aparelho["meses_ano"], aparelho["etiqueta_kwh_mes"], aparelho["quantidade_padrao"],
                  aparelho["origem_valor"], aparelho.get("nota"), aparelho.get("rotulo_potencia"),
                  aparelho.get("rotulo_quantidade"), fontes.get(aparelho.get("fonte")),
                  aparelho.get("na_lista_adicionar", True)))
        gravados += 1
    return gravados, rejeitados


def carregar_distribuidoras(conexao):
    for d in arquivos.ler_csv(_arquivo("distribuidoras.csv")):
        executar(conexao,
                 "INSERT INTO distribuidora (nome, sigla, uf) VALUES (%s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE sigla = VALUES(sigla), uf = VALUES(uf)",
                 (d["nome"], d["sigla"], d["uf"]))


def carregar_tarifas(conexao, fontes):
    total = 0
    for t in arquivos.ler_csv(_arquivo("tarifas.csv")):
        id_dist = _id(conexao, "SELECT id_distribuidora FROM distribuidora WHERE sigla = %s", t["distribuidora"])
        executar(conexao,
                 "INSERT INTO tarifa (id_distribuidora, valor_kwh, vigencia_inicio, vigencia_fim, id_fonte) "
                 "VALUES (%s, %s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE valor_kwh = VALUES(valor_kwh), vigencia_fim = VALUES(vigencia_fim), "
                 "id_fonte = VALUES(id_fonte)",
                 (id_dist, validacao.para_numero(t["valor_kwh"]), t["vigencia_inicio"],
                  t["vigencia_fim"], fontes[t["fonte"]]))
        total += 1
    return total


def carregar_bandeiras(conexao, fontes):
    for b in arquivos.ler_csv(_arquivo("bandeiras.csv")):
        executar(conexao,
                 "INSERT INTO bandeira (nome, acrescimo_100kwh, id_fonte) VALUES (%s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE acrescimo_100kwh = VALUES(acrescimo_100kwh), id_fonte = VALUES(id_fonte)",
                 (b["nome"], validacao.para_numero(b["acrescimo_100kwh"]), fontes[b["fonte"]]))
    for m in arquivos.ler_csv(_arquivo("bandeiras_mes.csv")):
        id_bandeira = _id(conexao, "SELECT id_bandeira FROM bandeira WHERE nome = %s", m["bandeira"])
        executar(conexao,
                 "INSERT INTO bandeira_mes (mes_referencia, id_bandeira, id_fonte) VALUES (%s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE id_bandeira = VALUES(id_bandeira), id_fonte = VALUES(id_fonte)",
                 (m["mes_referencia"], id_bandeira, fontes[m["fonte"]]))


def carregar_noticias(conexao, fontes):
    """Notícias vêm de JSON porque cada uma tem uma lista de fontes (N:N)."""
    noticias = arquivos.ler_json(_arquivo("noticias.json"))
    for n in noticias:
        executar(conexao,
                 "INSERT INTO noticia (titulo, categoria, resumo, publicada_em, imagem, credito_imagem) "
                 "VALUES (%s, %s, %s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE categoria = VALUES(categoria), resumo = VALUES(resumo), "
                 "publicada_em = VALUES(publicada_em), imagem = VALUES(imagem), "
                 "credito_imagem = VALUES(credito_imagem)",
                 (n["titulo"], n["categoria"], n["resumo"], n["publicada_em"], n.get("imagem"),
                  n.get("credito_imagem")))
        id_noticia = _id(conexao, "SELECT id_noticia FROM noticia WHERE titulo = %s", n["titulo"])
        for chave in n["fontes"]:
            executar(conexao,
                     "INSERT IGNORE INTO noticia_fonte (id_noticia, id_fonte) VALUES (%s, %s)",
                     (id_noticia, fontes[chave]))
    return len(noticias)


def carregar_tudo(conexao):
    """Carrega todos os arquivos numa transação só: ou entra tudo, ou nada."""
    try:
        fontes = carregar_fontes(conexao)
        carregar_grupos(conexao)
        carregar_tipos(conexao)
        gravados, rejeitados = carregar_aparelhos(conexao, fontes)
        carregar_distribuidoras(conexao)
        tarifas = carregar_tarifas(conexao, fontes)
        carregar_bandeiras(conexao, fontes)
        noticias = carregar_noticias(conexao, fontes)
        conexao.commit()
    except Exception:
        conexao.rollback()
        raise
    return {"fontes": len(fontes), "aparelhos": gravados, "rejeitados": rejeitados,
            "tarifas": tarifas, "noticias": noticias}
