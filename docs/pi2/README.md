# Projeto Integrador 2 | WattCerto | entregas por matéria

| Matéria | Professor(a) | Onde está |
|---|---|---|
| Banco de Dados I | Banin | `banco-de-dados/der.png` (DER), `banco-de-dados/der.md` (cardinalidades), `banco-de-dados/dicionario-de-dados.md`, `banco-de-dados/historico-decisoes.md`, `banco-de-dados/comandos-sql.md` (DML e SELECT com EXPLAIN), script DDL em `../../sistema/sql/01_criar_banco.sql` |
| Linguagem de Programação I | Banin / Lúcio | Programa em `../../sistema/` (ver `sistema/README.md`): carga de CSV/JSON, CRUD, indicadores, exportação do JSON do site, testes |
| Compliance e Segurança da Informação | Edna | `seguranca-da-informacao.md` + cabeçalhos de segurança em `../../_headers` |
| Engenharia de Software II | Gallão | `engenharia-de-software-ii.md` |
| Inglês II | Margareth | `ingles-ii.md` |
| Desenvolvimento Web | Fratta | O próprio site (10 páginas) + orçamento em `sobre.html#hospedagem` |

## Como as partes se ligam

```
sistema/dados/entrada (CSV/JSON) → Python → MySQL → Python → dados/catalogo.json → calculadora do site
formulário de Contato → Netlify Forms → CSV → Python → tabela mensagem_contato (apagada em 180 dias)
```

## Para a demonstração no servidor do Banin

1. Em `sistema/.env`, colocar host, usuário e senha que o professor passar.
2. Rodar `sql/01_criar_banco.sql` no phpMyAdmin (aba SQL). Se o usuário não puder criar banco, apagar as 4 primeiras linhas de comando (DROP/CREATE/USE) e rodar dentro do banco que ele liberou, ajustando `DB_NAME`.
3. `python main.py carregar` e conferir as tabelas no phpMyAdmin.
4. `python documentar_banco.py` para gerar o EXPLAIN do servidor dele.
