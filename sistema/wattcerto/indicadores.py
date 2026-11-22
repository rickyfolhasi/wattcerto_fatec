"""Indicadores calculados a partir do catálogo: ranking de consumo, média por
grupo, peso das bandeiras e quanto do catálogo tem fonte oficial."""
from wattcerto.banco import consultar, consultar_um
from wattcerto.calculo import arredondar_reais, custo_mes, kwh_mes


def ranking_consumo(aparelhos, pessoas=3, limite=None):
    """Ordena os aparelhos do que mais gasta para o que menos gasta (kWh/mês)."""
    ranking = []
    for aparelho in aparelhos:
        ranking.append({"codigo": aparelho["codigo"], "nome": aparelho["nome"],
                        "grupo": aparelho["grupo"], "kwh_mes": round(kwh_mes(aparelho, pessoas), 2)})
    ranking.sort(key=lambda item: item["kwh_mes"], reverse=True)
    return ranking[:limite] if limite else ranking


def media_por_grupo(aparelhos, pessoas=3):
    """Consumo médio e total de cada grupo. Devolve um dicionário grupo -> números."""
    grupos = {}
    for aparelho in aparelhos:
        dados = grupos.setdefault(aparelho["grupo"], {"quantidade": 0, "total_kwh": 0.0})
        dados["quantidade"] += 1
        dados["total_kwh"] += kwh_mes(aparelho, pessoas)
    for dados in grupos.values():
        dados["media_kwh"] = round(dados["total_kwh"] / dados["quantidade"], 2)
        dados["total_kwh"] = round(dados["total_kwh"], 2)
    return grupos


def peso_das_bandeiras(conexao, kwh, tarifa):
    """Quanto custa o mesmo consumo em cada bandeira tarifária."""
    tabela = []
    for bandeira in consultar(conexao, "SELECT nome, acrescimo_100kwh FROM bandeira ORDER BY acrescimo_100kwh"):
        acrescimo = float(bandeira["acrescimo_100kwh"])
        tabela.append({"bandeira": bandeira["nome"],
                       "custo_mes": arredondar_reais(custo_mes(kwh, tarifa, acrescimo)),
                       "a_mais": arredondar_reais(kwh / 100 * acrescimo)})
    return tabela


def bandeira_do_mes(conexao, mes_referencia):
    return consultar_um(conexao,
        "SELECT b.nome, b.acrescimo_100kwh FROM bandeira_mes bm "
        "JOIN bandeira b ON b.id_bandeira = bm.id_bandeira WHERE bm.mes_referencia = %s",
        (mes_referencia,))


def cobertura_de_fontes(aparelhos):
    """Quantos aparelhos têm valor da Procel, derivado dela ou típico de mercado."""
    contagem = {"procel": 0, "derivado": 0, "tipico": 0}
    for aparelho in aparelhos:
        contagem[aparelho["origem_valor"]] += 1
    total = len(aparelhos)
    com_fonte = contagem["procel"] + contagem["derivado"]
    contagem["percentual_com_fonte"] = round(com_fonte / total * 100, 1) if total else 0.0
    return contagem
