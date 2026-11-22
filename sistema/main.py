"""WattCerto | programa de bastidor (Linguagem de Programação I).

Uso:
  python main.py            abre o menu
  python main.py carregar   só carrega os arquivos de entrada no banco
  python main.py exportar   só gera dados/catalogo.json para o site
"""
import sys

from wattcerto import aparelhos, contato, exportar, indicadores
from wattcerto.banco import conectar
from wattcerto.carga import carregar_tudo
from wattcerto.validacao import CAMPOS_NUMERICOS, TIPOS_VALIDOS

OPCOES = {
    "1": "Carregar dados dos arquivos (CSV/JSON) no banco",
    "2": "Listar aparelhos",
    "3": "Buscar aparelho pelo nome",
    "4": "Cadastrar aparelho",
    "5": "Alterar aparelho",
    "6": "Tirar aparelho do site (desativar)",
    "7": "Ver indicadores de consumo",
    "8": "Importar mensagens do contato (CSV do Netlify)",
    "9": "Apagar mensagens vencidas (LGPD)",
    "10": "Exportar catálogo para o site (JSON)",
    "11": "Exportar ranking de consumo (CSV)",
    "0": "Sair",
}


def perguntar(texto, obrigatorio=True):
    while True:
        resposta = input(texto).strip()
        if resposta or not obrigatorio:
            return resposta
        print("  Campo obrigatório.")


def perguntar_numero(texto, padrao):
    while True:
        resposta = input(f"{texto} [{padrao}]: ").strip()
        if not resposta:
            return padrao
        try:
            return float(resposta.replace(",", "."))
        except ValueError:
            print("  Digite um número.")


def mostrar_erros(erros):
    for erro in erros:
        print("  -", erro)


def mostrar_aparelhos(lista):
    if not lista:
        print("  Nenhum aparelho encontrado.")
        return
    for a in lista:
        print(f"  {a['codigo']:<24} {a['nome']:<40} {a['grupo']:<16} {a['cod_tipo']}")


def acao_carregar(conexao):
    resumo = carregar_tudo(conexao)
    print(f"  Fontes: {resumo['fontes']} | Aparelhos: {resumo['aparelhos']} | "
          f"Tarifas: {resumo['tarifas']} | Notícias: {resumo['noticias']}")
    for codigo, erros in resumo["rejeitados"]:
        print(f"  Rejeitado {codigo}:")
        mostrar_erros(erros)


def acao_listar(conexao):
    grupo = perguntar("Grupo (Enter para todos): ", obrigatorio=False)
    mostrar_aparelhos(aparelhos.listar_aparelhos(conexao, grupo or None))


def acao_buscar(conexao):
    mostrar_aparelhos(aparelhos.buscar_por_nome(conexao, perguntar("Parte do nome: ")))


def acao_cadastrar(conexao):
    dados = {
        "codigo": perguntar("Código (ex.: cafeteira): ").lower(),
        "nome": perguntar("Nome: "),
        "grupo": perguntar("Grupo (ex.: Cozinha): "),
        "cod_tipo": perguntar(f"Tipo de cálculo {TIPOS_VALIDOS}: "),
        "origem_valor": perguntar("Origem do valor (procel, derivado, tipico): "),
    }
    if dados["origem_valor"] != "tipico":
        dados["fonte"] = perguntar("Título da fonte cadastrada: ")
    print("Números (Enter deixa em branco):")
    for campo in CAMPOS_NUMERICOS:
        dados[campo] = perguntar(f"  {campo}: ", obrigatorio=False) or None
    novo_id, erros = aparelhos.cadastrar_aparelho(conexao, dados)
    if erros:
        print("Não foi cadastrado:")
        mostrar_erros(erros)
    else:
        print(f"  Cadastrado com id {novo_id}.")


def acao_alterar(conexao):
    codigo = perguntar("Código do aparelho: ")
    campo = perguntar(f"Campo {aparelhos.CAMPOS_ALTERAVEIS}: ")
    valor = perguntar("Novo valor: ")
    erros = aparelhos.atualizar_aparelho(conexao, codigo, {campo: valor})
    print("  Alterado." if not erros else "Não foi alterado:")
    mostrar_erros(erros)


def acao_desativar(conexao):
    codigo = perguntar("Código do aparelho: ")
    print("  Desativado." if aparelhos.desativar_aparelho(conexao, codigo) else "  Código não encontrado.")


def acao_indicadores(conexao):
    pessoas = int(perguntar_numero("Pessoas na casa", 3))
    lista = aparelhos.listar_aparelhos(conexao)
    print("\nOs 5 que mais gastam (kWh por mês, valores de partida):")
    for posicao, item in enumerate(indicadores.ranking_consumo(lista, pessoas, limite=5), start=1):
        print(f"  {posicao}. {item['nome']:<40} {item['kwh_mes']:>8.1f}")
    print("\nMédia por grupo:")
    for grupo, dados in indicadores.media_por_grupo(lista, pessoas).items():
        print(f"  {grupo:<16} {dados['quantidade']:>2} aparelhos, média {dados['media_kwh']:.1f} kWh")
    cobertura = indicadores.cobertura_de_fontes(lista)
    print(f"\nCatálogo com fonte oficial (Procel ou derivado): {cobertura['percentual_com_fonte']}%")
    kwh = perguntar_numero("\nConsumo para comparar as bandeiras (kWh)", 177)
    tarifa = perguntar_numero("Tarifa (R$ por kWh)", 0.86)
    for linha in indicadores.peso_das_bandeiras(conexao, kwh, tarifa):
        print(f"  {linha['bandeira']:<22} R$ {linha['custo_mes']:>8.2f}  (R$ {linha['a_mais']:.2f} a mais)")


def acao_importar_contato(conexao):
    caminho = perguntar("Caminho do CSV baixado do Netlify: ")
    importadas, repetidas, rejeitadas = contato.importar_csv(conexao, caminho)
    print(f"  Importadas: {importadas} | Já existiam: {repetidas} | Rejeitadas: {len(rejeitadas)}")
    for linha, erros in rejeitadas:
        print(f"  Linha {linha}:")
        mostrar_erros(erros)


def acao_apagar_vencidas(conexao):
    print(f"  Mensagens apagadas: {contato.apagar_vencidas(conexao)}")


def acao_exportar(conexao):
    print(f"  catalogo.json gerado com {exportar.exportar_catalogo_site(conexao)} aparelhos.")


def acao_relatorio(conexao):
    print("  Gravado em", exportar.exportar_relatorio_indicadores(conexao))


ACOES = {
    "1": acao_carregar, "2": acao_listar, "3": acao_buscar, "4": acao_cadastrar,
    "5": acao_alterar, "6": acao_desativar, "7": acao_indicadores, "8": acao_importar_contato,
    "9": acao_apagar_vencidas, "10": acao_exportar, "11": acao_relatorio,
}


def menu(conexao):
    while True:
        print("\n=== WattCerto | bastidor ===")
        for chave, texto in OPCOES.items():
            print(f"{chave:>3}. {texto}")
        escolha = input("Opção: ").strip()
        if escolha == "0":
            break
        acao = ACOES.get(escolha)
        if acao is None:
            print("  Opção inválida.")
            continue
        try:
            acao(conexao)
        except Exception as erro:  # mostra o problema e volta ao menu, sem derrubar o programa
            conexao.rollback()
            print(f"  Erro: {erro}")


def main():
    conexao = conectar()
    try:
        comando = sys.argv[1] if len(sys.argv) > 1 else None
        if comando == "carregar":
            acao_carregar(conexao)
        elif comando == "exportar":
            acao_exportar(conexao)
        else:
            menu(conexao)
    finally:
        conexao.close()


if __name__ == "__main__":
    main()
