"""Exportação: gera o JSON que o site lê e relatórios em CSV."""
import os
from datetime import date, datetime

from wattcerto import arquivos, indicadores
from wattcerto.aparelhos import listar_aparelhos
from wattcerto.banco import consultar
from wattcerto.config import ARQUIVO_CATALOGO_SITE, PASTA_SAIDA

# Nome do campo no banco -> nome usado pelo JavaScript do site.
CAMPOS_SITE = {
    "potencia_w": "potencia", "horas_dia": "horas", "minutos_uso": "minutos",
    "usos_mes": "usos", "espera_w": "espera", "meses_ano": "meses",
    "etiqueta_kwh_mes": "etiqueta", "quantidade_padrao": "quantidade",
}

# Valores que cada tipo mostra nos campos da calculadora.
VALORES_POR_TIPO = {
    "tempo": ("potencia_w", "horas_dia", "quantidade_padrao"),
    "standby": ("potencia_w", "horas_dia", "espera_w", "quantidade_padrao"),
    "evento": ("potencia_w", "minutos_uso", "usos_mes"),
    "climatizacao": ("potencia_w", "horas_dia", "meses_ano", "quantidade_padrao"),
    "ciclo": ("etiqueta_kwh_mes", "quantidade_padrao"),
}


def _numero(valor):
    """Decimal do banco vira int quando é inteiro (537.0 -> 537) para o JSON ficar limpo."""
    valor = float(valor)
    return int(valor) if valor.is_integer() else valor


def aparelho_para_site(aparelho):
    """Converte uma linha do banco no formato do catálogo do site."""
    item = {
        "id": aparelho["codigo"],
        "nome": aparelho["nome"],
        "grupo": aparelho["grupo"],
        "tipo": aparelho["cod_tipo"],
        "valores": {CAMPOS_SITE[c]: _numero(aparelho[c]) for c in VALORES_POR_TIPO[aparelho["cod_tipo"]]},
        "fonte": aparelho["origem_valor"],
    }
    if aparelho["cod_tipo"] == "ciclo" and aparelho["potencia_w"] is not None:
        item["potenciaW"] = _numero(aparelho["potencia_w"])
    if aparelho["nota"]:
        item["nota"] = aparelho["nota"]
    rotulos = {}
    if aparelho["rotulo_potencia"]:
        rotulos["potencia"] = aparelho["rotulo_potencia"]
    if aparelho["rotulo_quantidade"]:
        rotulos["quantidade"] = aparelho["rotulo_quantidade"]
    if rotulos:
        item["rotulos"] = rotulos
    return item


def exportar_catalogo_site(conexao, caminho=ARQUIVO_CATALOGO_SITE):
    """Gera dados/catalogo.json com os aparelhos da lista "Adicionar aparelho"."""
    aparelhos = [a for a in listar_aparelhos(conexao) if a["na_lista_adicionar"]]
    grupos = [g["nome"] for g in consultar(conexao,
              "SELECT DISTINCT g.nome, g.ordem FROM grupo_aparelho g "
              "JOIN aparelho a ON a.id_grupo = g.id_grupo "
              "WHERE a.ativo = TRUE AND a.na_lista_adicionar = TRUE ORDER BY g.ordem")]
    conteudo = {
        "gerado_em": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "grupos": grupos,
        "aparelhos": [aparelho_para_site(a) for a in aparelhos],
    }
    arquivos.gravar_json(caminho, conteudo)
    return len(conteudo["aparelhos"])


def exportar_relatorio_indicadores(conexao, pessoas=3):
    """Grava o ranking de consumo do catálogo em dados/saida/ranking_AAAA-MM-DD.csv."""
    ranking = indicadores.ranking_consumo(listar_aparelhos(conexao), pessoas)
    caminho = os.path.join(PASTA_SAIDA, f"ranking_{date.today().isoformat()}.csv")
    arquivos.gravar_csv(caminho, ranking, ["codigo", "nome", "grupo", "kwh_mes"])
    return caminho
