"""Testes do programa contra um banco de TESTE (nunca rode no banco de produção).

Uso: python testes/testar_sistema.py
Cada teste imprime OK ou FALHOU. Ao final, mostra o total."""
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from wattcerto import aparelhos, contato, indicadores, validacao  # noqa: E402
from wattcerto.banco import conectar, consultar_um  # noqa: E402
from wattcerto.calculo import arredondar_reais, custo_mes, kwh_mes  # noqa: E402
from wattcerto.carga import carregar_tudo  # noqa: E402
from wattcerto.config import PASTA_SISTEMA  # noqa: E402

resultados = []


def teste(nome, condicao):
    resultados.append(condicao)
    print(("OK      " if condicao else "FALHOU  ") + nome)


def main():
    conexao = conectar()
    carregar_tudo(conexao)

    # Cálculo: os mesmos números da página Impacto do site (casa de 3 pessoas).
    chuveiro = aparelhos.buscar_por_codigo(conexao, "chuveiro")
    teste("chuveiro de 5.500 W, 15 min, 3 pessoas = 123,75 kWh", round(kwh_mes(chuveiro, 3), 2) == 123.75)
    teste("chuveiro no verão = 70% do inverno",
          round(kwh_mes(chuveiro, 3, "verao"), 3) == round(123.75 * 0.7, 3))
    led = aparelhos.buscar_por_codigo(conexao, "led")
    teste("10 lâmpadas LED de 9 W, 5 h = 13,5 kWh", round(kwh_mes(led, 3), 2) == 13.5)
    roteador = aparelhos.buscar_por_codigo(conexao, "roteador")
    teste("roteador 10 W ligado 24 h = 7,2 kWh", round(kwh_mes(roteador), 2) == 7.2)
    teste("custo: 123,75 kWh × R$ 0,86 = R$ 106,43 (igual ao site)", arredondar_reais(custo_mes(123.75, 0.86)) == 106.43)
    teste("bandeira amarela soma R$ 1,885 a cada 100 kWh", round(custo_mes(100, 0, 1.885), 3) == 1.885)
    tabela = indicadores.peso_das_bandeiras(conexao, 177, 0)
    teste("177 kWh na vermelha 2 = R$ 13,94 a mais (igual à página Impacto)",
          [t["a_mais"] for t in tabela if t["bandeira"] == "Vermelha, patamar 2"] == [13.94])

    # Validação
    _, erros = validacao.normalizar_aparelho({"potencia_w": "abc"})
    teste("texto no lugar de número é recusado", any("não é um número" in e for e in erros))
    erros = validacao.validar_aparelho({"codigo": "x", "nome": "AB", "cod_tipo": "nenhum", "origem_valor": "procel"})
    teste("aparelho inválido gera vários erros", len(erros) >= 3)

    # CRUD
    if aparelhos.buscar_por_codigo(conexao, "cafeteira_teste"):
        aparelhos.excluir_aparelho(conexao, "cafeteira_teste")
    novo_id, erros = aparelhos.cadastrar_aparelho(conexao, {
        "codigo": "cafeteira_teste", "nome": "Cafeteira (teste)", "grupo": "Cozinha",
        "cod_tipo": "evento", "origem_valor": "tipico",
        "potencia_w": "800", "minutos_uso": "10", "usos_mes": "30"})
    teste("cadastrar aparelho válido", novo_id is not None and not erros)
    _, erros = aparelhos.cadastrar_aparelho(conexao, {
        "codigo": "cafeteira_teste", "nome": "Outra", "grupo": "Cozinha", "cod_tipo": "evento",
        "origem_valor": "tipico", "potencia_w": "800", "minutos_uso": "10", "usos_mes": "30"})
    teste("código repetido é recusado", any("já existe" in e for e in erros))
    teste("buscar pelo nome encontra", len(aparelhos.buscar_por_nome(conexao, "cafeteira")) == 1)
    teste("alterar potência", aparelhos.atualizar_aparelho(conexao, "cafeteira_teste", {"potencia_w": "900"}) == [])
    teste("alterar para valor fora da faixa é recusado",
          aparelhos.atualizar_aparelho(conexao, "cafeteira_teste", {"potencia_w": "-5"}) != [])
    teste("alterar campo proibido é recusado",
          aparelhos.atualizar_aparelho(conexao, "cafeteira_teste", {"origem_valor": "procel"}) != [])
    teste("desativar tira da lista", aparelhos.desativar_aparelho(conexao, "cafeteira_teste")
          and not aparelhos.buscar_por_nome(conexao, "cafeteira")[0]["ativo"])
    teste("excluir apaga de vez", aparelhos.excluir_aparelho(conexao, "cafeteira_teste"))

    # Indicadores
    lista = aparelhos.listar_aparelhos(conexao)
    ranking = indicadores.ranking_consumo(lista, 3)
    teste("o que mais gasta no catálogo é o ar-condicionado split 12.000 BTU (189,6 kWh)",
          ranking[0]["codigo"] == "ar_split_12000" and ranking[0]["kwh_mes"] == 189.6)
    teste("ranking vem do maior para o menor", all(ranking[i]["kwh_mes"] >= ranking[i + 1]["kwh_mes"]
                                                  for i in range(len(ranking) - 1)))
    cobertura = indicadores.cobertura_de_fontes(lista)
    teste("cobertura de fontes soma o total", cobertura["procel"] + cobertura["derivado"] + cobertura["tipico"] == len(lista))

    # Contato: importa o CSV de exemplo (2 válidas recentes, 1 antiga, 2 inválidas)
    conexao.cursor().execute("DELETE FROM mensagem_contato")
    conexao.commit()
    caminho = os.path.join(PASTA_SISTEMA, "dados", "exemplos", "contato_netlify_exemplo.csv")
    importadas, repetidas, rejeitadas = contato.importar_csv(conexao, caminho)
    teste("importa 3 mensagens e recusa 2", importadas == 3 and len(rejeitadas) == 2)
    importadas, repetidas, _ = contato.importar_csv(conexao, caminho)
    teste("importar de novo não duplica", importadas == 0 and repetidas == 3)
    apagadas = contato.apagar_vencidas(conexao, hoje=date(2026, 11, 18))
    teste("apaga só a mensagem vencida (de março)", apagadas == 1)
    restantes = consultar_um(conexao, "SELECT COUNT(*) AS n FROM mensagem_contato")["n"]
    teste("ficam 2 mensagens", restantes == 2)

    # Banco: regras que o próprio MySQL garante (CHECK e UNIQUE)
    cursor = conexao.cursor()
    try:
        cursor.execute("INSERT INTO mensagem_contato (nome, email, assunto, texto, consentimento, recebida_em, apagar_em) "
                       "VALUES ('X', 'x@x.com', 'Teste', 'Mensagem sem consentimento', FALSE, NOW(), CURDATE())")
        bloqueou = False
    except Exception:
        bloqueou = True
    conexao.rollback()
    teste("o banco recusa mensagem sem consentimento (CHECK)", bloqueou)

    conexao.close()
    print(f"\n{sum(resultados)} de {len(resultados)} testes passaram.")
    return 0 if all(resultados) else 1


if __name__ == "__main__":
    sys.exit(main())
