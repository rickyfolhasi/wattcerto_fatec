# WattCerto | sistema (bastidor do site)

O site é estático (HTML, CSS e JavaScript no Netlify). Este programa em Python é o bastidor: guarda os dados do sistema num banco MySQL e gera o arquivo que o site lê.

```
dados/entrada/*.csv, noticias.json  →  Python (validação, CRUD, cálculos)  →  MySQL
                                                   ↓
                                    ../dados/catalogo.json  →  calculadora do site
```

## Como rodar

1. Instale a biblioteca: `pip install -r requirements.txt`
2. Copie `.env.exemplo` para `.env` e preencha host, usuário e senha do MySQL (o `.env` não vai para o GitHub).
3. Crie o banco: `mysql -h HOST -u USUARIO -p < sql/01_criar_banco.sql`
   (no servidor do professor, rode no phpMyAdmin, aba SQL, colando o arquivo).
4. Carregue os dados: `python main.py carregar`
5. Gere o catálogo do site: `python main.py exportar` (grava `../dados/catalogo.json`)
6. Menu completo (CRUD, indicadores, contato): `python main.py`

## Testes

`python testes/testar_sistema.py` roda 25 testes (cálculo igual ao site, validação, CRUD, importação do contato, regras do banco). **Use um banco de teste**: o teste apaga as mensagens de contato.

## Documentação do banco

`python documentar_banco.py` gera, a partir do banco configurado no `.env`, o dicionário de dados e a lista de comandos SQL com o EXPLAIN de cada SELECT, em `docs/pi2/banco-de-dados/`. Rode conectado ao servidor do professor para o EXPLAIN ser o do servidor dele.

## Módulos

| Arquivo | Faz |
|---|---|
| `main.py` | Menu e comandos de linha |
| `wattcerto/config.py` | Caminhos e leitura do `.env` |
| `wattcerto/banco.py` | Conexão e execução de SQL com parâmetros |
| `wattcerto/arquivos.py` | Ler e gravar CSV e JSON |
| `wattcerto/validacao.py` | Regras de validação de aparelho e de mensagem |
| `wattcerto/calculo.py` | Fórmulas de consumo e custo (as mesmas do site) |
| `wattcerto/carga.py` | Carga dos arquivos no banco, em transação |
| `wattcerto/aparelhos.py` | CRUD do catálogo |
| `wattcerto/indicadores.py` | Ranking, média por grupo, bandeiras, cobertura de fontes |
| `wattcerto/contato.py` | Importar o CSV do Netlify Forms e apagar mensagens vencidas |
| `wattcerto/exportar.py` | Gerar o JSON do site e relatórios CSV |

## Como o programa atende Linguagem de Programação I

| Requisito | Onde está no código |
|---|---|
| **Leitura de arquivos (CSV e JSON)** | `arquivos.ler_csv()` descobre sozinho se o separador é vírgula ou ponto e vírgula; `arquivos.ler_json()`. A carga (`carga.carregar_tudo()`) lê os 8 CSV e o `noticias.json` de `dados/entrada/`. |
| **Cadastro** | `aparelhos.cadastrar_aparelho()` (menu, opção cadastrar), com validação antes de gravar; `contato.importar_csv()` importa as mensagens do formulário do site. |
| **Exportação** | `exportar.exportar_catalogo_site()` gera o `catalogo.json` que a calculadora do site lê; `exportar.exportar_relatorio_indicadores()` grava os indicadores em CSV (`arquivos.gravar_csv()`). |
| **Funções com parâmetros e retorno** | Ex.: `calculo.kwh_mes(aparelho, pessoas=3, estacao="inverno")` devolve o consumo em kWh; `validacao.validar_aparelho(aparelho)` devolve a lista de erros; `indicadores.ranking_consumo(aparelhos, pessoas, limite)` devolve a lista ordenada. |
| **Busca, filtragem e indicadores** | `aparelhos.buscar_por_codigo()`, `aparelhos.buscar_por_nome()`, `aparelhos.listar_aparelhos(grupo=...)`; `indicadores.ranking_consumo()`, `media_por_grupo()`, `peso_das_bandeiras()`, `cobertura_de_fontes()`. |
| **Listas e dicionários** | Cada aparelho é um dicionário; o catálogo é uma lista de dicionários. `media_por_grupo()` monta um dicionário grupo → quantidade, total e média. |
| **Decisão e repetição para validar** | `validar_aparelho()` percorre os campos obrigatórios de cada tipo de cálculo e as faixas de valor (`for` + `if`) e junta todos os erros, em vez de parar no primeiro. A carga só grava se tudo for válido (transação). |
| **Testes** | `testes/testar_sistema.py`: 25 testes de cálculo, validação, CRUD e importação. |
