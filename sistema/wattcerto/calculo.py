"""Motor de cálculo: as mesmas fórmulas da calculadora do site (js/calculadora.js)."""
from decimal import ROUND_HALF_UP, Decimal

from wattcerto.config import DIAS_NO_MES, FATOR_ESTACAO


def _n(aparelho, campo, padrao=0.0):
    """Lê um número do aparelho; vazio vira o valor padrão."""
    valor = aparelho.get(campo)
    return float(valor) if valor is not None else padrao


def kwh_mes(aparelho, pessoas=3, estacao="inverno"):
    """Consumo de um aparelho em kWh por mês, conforme o tipo de cálculo."""
    tipo = aparelho["cod_tipo"]
    potencia = _n(aparelho, "potencia_w")
    horas = _n(aparelho, "horas_dia")
    quantidade = _n(aparelho, "quantidade_padrao", 1.0)

    if tipo == "banho":
        return (potencia * FATOR_ESTACAO[estacao] * _n(aparelho, "minutos_uso") / 60
                * pessoas * _n(aparelho, "usos_pessoa_dia", 1.0) * DIAS_NO_MES / 1000)
    if tipo == "ciclo":
        return _n(aparelho, "etiqueta_kwh_mes") * quantidade
    if tipo == "evento":
        return potencia * (_n(aparelho, "minutos_uso") / 60) * _n(aparelho, "usos_mes") / 1000
    if tipo == "climatizacao":
        return potencia * horas * quantidade * DIAS_NO_MES / 1000 * (_n(aparelho, "meses_ano", 12) / 12)
    if tipo == "standby":
        espera = _n(aparelho, "espera_w")
        return (potencia * horas + espera * (24 - horas)) * quantidade * DIAS_NO_MES / 1000
    return potencia * horas * quantidade * DIAS_NO_MES / 1000  # tipo "tempo"


def custo_mes(kwh, tarifa, acrescimo_100kwh=0.0):
    """Custo em reais: kWh × tarifa + acréscimo da bandeira a cada 100 kWh."""
    return kwh * tarifa + kwh / 100 * acrescimo_100kwh


def arredondar_reais(valor):
    """Arredonda para centavos com meio para cima, como o site faz (106,425 -> 106,43).
    O round() do Python arredonda 106,425 para 106,42 por causa do float."""
    return float(Decimal(str(round(valor, 6))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
