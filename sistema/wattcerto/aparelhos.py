"""CRUD do catálogo de aparelhos (Create, Read, Update, Delete)."""
from wattcerto import validacao
from wattcerto.banco import consultar, consultar_um, executar

SELECT_APARELHO = (
    "SELECT a.id_aparelho, a.codigo, a.nome, g.nome AS grupo, a.cod_tipo, a.potencia_w, "
    "a.horas_dia, a.minutos_uso, a.usos_mes, a.usos_pessoa_dia, a.espera_w, a.meses_ano, "
    "a.etiqueta_kwh_mes, a.quantidade_padrao, a.origem_valor, a.nota, a.rotulo_potencia, "
    "a.rotulo_quantidade, a.na_lista_adicionar, a.ativo, f.titulo AS fonte "
    "FROM aparelho a "
    "JOIN grupo_aparelho g ON g.id_grupo = a.id_grupo "
    "LEFT JOIN fonte f ON f.id_fonte = a.id_fonte "
)

# Só estas colunas podem ser alteradas pelo menu (lista branca contra alteração indevida).
CAMPOS_ALTERAVEIS = (
    "nome", "potencia_w", "horas_dia", "minutos_uso", "usos_mes", "usos_pessoa_dia",
    "espera_w", "meses_ano", "etiqueta_kwh_mes", "quantidade_padrao", "nota",
)


def listar_aparelhos(conexao, grupo=None, somente_ativos=True):
    """Lista o catálogo, com filtro opcional por grupo."""
    condicoes, parametros = [], []
    if somente_ativos:
        condicoes.append("a.ativo = TRUE")
    if grupo:
        condicoes.append("g.nome = %s")
        parametros.append(grupo)
    where = ("WHERE " + " AND ".join(condicoes) + " ") if condicoes else ""
    return consultar(conexao, SELECT_APARELHO + where + "ORDER BY g.ordem, a.id_aparelho", tuple(parametros))


def buscar_por_codigo(conexao, codigo):
    return consultar_um(conexao, SELECT_APARELHO + "WHERE a.codigo = %s", (codigo,))


def buscar_por_nome(conexao, trecho):
    """Busca aparelhos cujo nome contém o trecho digitado (sem diferenciar maiúsculas)."""
    return consultar(conexao, SELECT_APARELHO + "WHERE a.nome LIKE %s ORDER BY a.nome",
                     ("%" + trecho.strip() + "%",))


def cadastrar_aparelho(conexao, dados):
    """Valida e grava um aparelho novo. Devolve (id criado, erros)."""
    aparelho, erros = validacao.normalizar_aparelho(dados)
    erros += validacao.validar_aparelho(aparelho)
    grupo = consultar_um(conexao, "SELECT id_grupo FROM grupo_aparelho WHERE nome = %s", (aparelho.get("grupo"),))
    if grupo is None:
        erros.append(f"grupo inexistente: {aparelho.get('grupo')}")
    if buscar_por_codigo(conexao, aparelho.get("codigo")):
        erros.append(f"já existe aparelho com o código {aparelho.get('codigo')}")
    id_fonte = None
    if aparelho.get("fonte"):
        fonte = consultar_um(conexao, "SELECT id_fonte FROM fonte WHERE titulo = %s", (aparelho["fonte"],))
        if fonte is None:
            erros.append(f"fonte inexistente: {aparelho['fonte']}")
        else:
            id_fonte = fonte["id_fonte"]
    if erros:
        return None, erros
    _, novo_id = executar(conexao,
        "INSERT INTO aparelho (codigo, nome, id_grupo, cod_tipo, potencia_w, horas_dia, minutos_uso, "
        "usos_mes, usos_pessoa_dia, espera_w, meses_ano, etiqueta_kwh_mes, quantidade_padrao, "
        "origem_valor, nota, id_fonte) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (aparelho["codigo"], aparelho["nome"].strip(), grupo["id_grupo"], aparelho["cod_tipo"],
         aparelho["potencia_w"], aparelho["horas_dia"], aparelho["minutos_uso"], aparelho["usos_mes"],
         aparelho["usos_pessoa_dia"], aparelho["espera_w"], aparelho["meses_ano"],
         aparelho["etiqueta_kwh_mes"], aparelho["quantidade_padrao"], aparelho["origem_valor"],
         aparelho.get("nota"), id_fonte))
    conexao.commit()
    return novo_id, []


def atualizar_aparelho(conexao, codigo, alteracoes):
    """Altera campos de um aparelho, validando o resultado final. Devolve a lista de erros."""
    atual = buscar_por_codigo(conexao, codigo)
    if atual is None:
        return [f"aparelho não encontrado: {codigo}"]
    invalidos = [campo for campo in alteracoes if campo not in CAMPOS_ALTERAVEIS]
    if invalidos:
        return ["campo não pode ser alterado: " + ", ".join(invalidos)]
    novo = dict(atual)
    novo.update(alteracoes)
    novo["fonte"] = atual["fonte"]
    aparelho, erros = validacao.normalizar_aparelho(novo)
    erros += validacao.validar_aparelho(aparelho)
    if erros:
        return erros
    colunas = ", ".join(f"{campo} = %s" for campo in alteracoes)
    valores = tuple(aparelho[campo] for campo in alteracoes) + (codigo,)
    executar(conexao, f"UPDATE aparelho SET {colunas} WHERE codigo = %s", valores)
    conexao.commit()
    return []


def desativar_aparelho(conexao, codigo):
    """Tira o aparelho do site sem apagar o histórico (exclusão lógica)."""
    linhas, _ = executar(conexao, "UPDATE aparelho SET ativo = FALSE WHERE codigo = %s", (codigo,))
    conexao.commit()
    return linhas == 1


def excluir_aparelho(conexao, codigo):
    """Apaga o aparelho de vez (exclusão física)."""
    linhas, _ = executar(conexao, "DELETE FROM aparelho WHERE codigo = %s", (codigo,))
    conexao.commit()
    return linhas == 1
