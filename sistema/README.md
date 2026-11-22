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
