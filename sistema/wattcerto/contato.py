"""Mensagens do formulário de contato.

O site é estático (Netlify). O Netlify Forms recebe o formulário e permite
baixar as mensagens em CSV. Este módulo importa esse CSV para o banco,
validando cada linha, e apaga as mensagens vencidas (LGPD)."""
from datetime import date, datetime, timedelta

from wattcerto import arquivos, validacao
from wattcerto.banco import consultar, consultar_um, executar
from wattcerto.config import DIAS_GUARDAR_MENSAGEM


def _ler_data(texto):
    """Aceita a data do Netlify ("2026-11-18T17:05:00Z") ou "2026-11-18 17:05:00"."""
    texto = (texto or "").strip().replace("Z", "+00:00")
    if not texto:
        return datetime.now()
    momento = datetime.fromisoformat(texto)
    return momento.replace(tzinfo=None)


def importar_csv(conexao, caminho):
    """Importa as mensagens de um CSV. Devolve (importadas, repetidas, rejeitadas)."""
    importadas, repetidas, rejeitadas = 0, 0, []
    for numero, linha in enumerate(arquivos.ler_csv(caminho), start=2):
        erros = validacao.validar_mensagem(linha)
        if erros:
            rejeitadas.append((numero, erros))
            continue
        recebida = _ler_data(linha.get("created_at"))
        ja_existe = consultar_um(conexao,
            "SELECT id_mensagem FROM mensagem_contato WHERE email = %s AND recebida_em = %s",
            (linha["email"].strip().lower(), recebida))
        if ja_existe:
            repetidas += 1
            continue
        executar(conexao,
            "INSERT INTO mensagem_contato (nome, email, assunto, texto, consentimento, recebida_em, apagar_em) "
            "VALUES (%s, %s, %s, %s, TRUE, %s, %s)",
            (linha["nome"].strip(), linha["email"].strip().lower(), linha["assunto"].strip(),
             linha["mensagem"].strip(), recebida, recebida.date() + timedelta(days=DIAS_GUARDAR_MENSAGEM)))
        importadas += 1
    conexao.commit()
    return importadas, repetidas, rejeitadas


def listar_mensagens(conexao, situacao=None):
    if situacao:
        return consultar(conexao,
            "SELECT id_mensagem, nome, assunto, recebida_em, situacao FROM mensagem_contato "
            "WHERE situacao = %s ORDER BY recebida_em DESC", (situacao,))
    return consultar(conexao,
        "SELECT id_mensagem, nome, assunto, recebida_em, situacao FROM mensagem_contato "
        "ORDER BY recebida_em DESC")


def marcar_respondida(conexao, id_mensagem):
    linhas, _ = executar(conexao,
        "UPDATE mensagem_contato SET situacao = 'respondida' WHERE id_mensagem = %s", (id_mensagem,))
    conexao.commit()
    return linhas == 1


def apagar_vencidas(conexao, hoje=None):
    """Apaga as mensagens que passaram do prazo de guarda. Devolve quantas apagou."""
    linhas, _ = executar(conexao, "DELETE FROM mensagem_contato WHERE apagar_em < %s",
                         (hoje or date.today(),))
    conexao.commit()
    return linhas
