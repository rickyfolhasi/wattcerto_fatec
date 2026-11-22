"""Validação dos dados antes de entrar no banco. Cada função devolve a lista
de erros encontrados: lista vazia significa que está tudo certo."""
import re

TIPOS_VALIDOS = ("tempo", "standby", "evento", "climatizacao", "ciclo", "banho")
ORIGENS_VALIDAS = ("procel", "derivado", "tipico")

# Campos que cada regra de cálculo precisa para funcionar.
CAMPOS_POR_TIPO = {
    "tempo": ("potencia_w", "horas_dia"),
    "standby": ("potencia_w", "horas_dia", "espera_w"),
    "evento": ("potencia_w", "minutos_uso", "usos_mes"),
    "climatizacao": ("potencia_w", "horas_dia", "meses_ano"),
    "ciclo": ("etiqueta_kwh_mes",),
    "banho": ("potencia_w", "minutos_uso", "usos_pessoa_dia"),
}

CAMPOS_NUMERICOS = (
    "potencia_w", "horas_dia", "minutos_uso", "usos_mes", "usos_pessoa_dia",
    "espera_w", "meses_ano", "etiqueta_kwh_mes", "quantidade_padrao",
)

# Faixa aceita para cada número: (mínimo, máximo).
LIMITES = {
    "potencia_w": (0.1, 20000),
    "horas_dia": (0.01, 24),
    "minutos_uso": (0.1, 1440),
    "usos_mes": (1, 1000),
    "usos_pessoa_dia": (0.1, 10),
    "espera_w": (0, 500),
    "meses_ano": (1, 12),
    "etiqueta_kwh_mes": (0.1, 1000),
    "quantidade_padrao": (1, 100),
}

PADRAO_CODIGO = re.compile(r"^[a-z0-9_]{2,40}$")
PADRAO_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def para_numero(valor):
    """Converte texto em número aceitando vírgula decimal ("0,5"). None continua None."""
    if valor is None or valor == "":
        return None
    if isinstance(valor, (int, float)):
        return valor
    return float(str(valor).replace(",", "."))


def normalizar_aparelho(dados):
    """Converte os números de um aparelho (que vêm como texto do CSV) e devolve
    (aparelho, erros). Os erros de conversão já entram na lista."""
    aparelho = dict(dados)
    erros = []
    for campo in CAMPOS_NUMERICOS:
        try:
            aparelho[campo] = para_numero(aparelho.get(campo))
        except ValueError:
            erros.append(f"{campo}: '{aparelho.get(campo)}' não é um número")
            aparelho[campo] = None
    if aparelho.get("quantidade_padrao") is None:
        aparelho["quantidade_padrao"] = 1
    for campo in ("na_lista_adicionar", "ativo"):
        if campo in aparelho and aparelho[campo] is not None:
            aparelho[campo] = str(aparelho[campo]).strip().lower() in ("1", "true", "sim", "s")
    return aparelho, erros


def validar_aparelho(aparelho):
    """Confere as regras do catálogo. Devolve a lista de erros."""
    erros = []
    if not aparelho.get("codigo") or not PADRAO_CODIGO.match(aparelho["codigo"]):
        erros.append("código: use de 2 a 40 letras minúsculas, números ou _")
    nome = (aparelho.get("nome") or "").strip()
    if len(nome) < 3 or len(nome) > 80:
        erros.append("nome: entre 3 e 80 caracteres")
    tipo = aparelho.get("cod_tipo")
    if tipo not in TIPOS_VALIDOS:
        erros.append(f"tipo de cálculo inválido: {tipo}")
    else:
        for campo in CAMPOS_POR_TIPO[tipo]:
            if aparelho.get(campo) is None:
                erros.append(f"{campo}: obrigatório para o tipo '{tipo}'")
    for campo, (minimo, maximo) in LIMITES.items():
        valor = aparelho.get(campo)
        if valor is not None and not (minimo <= valor <= maximo):
            erros.append(f"{campo}: {valor} fora da faixa de {minimo} a {maximo}")
    origem = aparelho.get("origem_valor")
    if origem not in ORIGENS_VALIDAS:
        erros.append(f"origem do valor inválida: {origem}")
    elif origem != "tipico" and not aparelho.get("fonte"):
        erros.append("valor da Procel ou derivado precisa indicar a fonte")
    return erros


def validar_mensagem(mensagem):
    """Confere uma mensagem do formulário de contato. Devolve a lista de erros."""
    erros = []
    nome = (mensagem.get("nome") or "").strip()
    if not 3 <= len(nome) <= 80:
        erros.append("nome: entre 3 e 80 caracteres")
    email = (mensagem.get("email") or "").strip()
    if len(email) > 254 or not PADRAO_EMAIL.match(email):
        erros.append("e-mail inválido")
    assunto = (mensagem.get("assunto") or "").strip()
    if not 3 <= len(assunto) <= 80:
        erros.append("assunto: entre 3 e 80 caracteres")
    texto = (mensagem.get("mensagem") or "").strip()
    if not 10 <= len(texto) <= 600:
        erros.append("mensagem: entre 10 e 600 caracteres")
    if str(mensagem.get("consentimento") or "").strip().lower() not in ("on", "1", "true", "sim"):
        erros.append("sem consentimento: a mensagem não pode ser guardada")
    return erros
