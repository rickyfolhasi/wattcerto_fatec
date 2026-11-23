# Evidências de testes

Testes feitos em 22/11/2026 nas 11 páginas, com os arquivos da versão final (`main` no GitHub). Os prints e relatórios ficam em [`evidencias/`](evidencias/).

## Resumo

| Teste | Ferramenta | Resultado | Evidência |
|---|---|---|---|
| Validação HTML | vnu (Nu Html Checker), o mesmo motor do validator.w3.org | **0 erros nas 11 páginas** | [w3c-validador.txt](evidencias/w3c-validador.txt) |
| Acessibilidade automática | axe-core 4, regras WCAG 2.0, 2.1 e 2.2 nível AA | **0 problemas nas 11 páginas** | [acessibilidade-axe.json](evidencias/acessibilidade-axe.json) |
| Contraste de cores | Fórmula do WCAG 2.2 sobre as cores do CSS | **14 de 14 combinações passam no AA** | [contraste.md](evidencias/contraste.md) |
| Navegação por teclado | Playwright (Tab, Enter, Esc) e teste manual | Tudo alcançável, foco sempre visível | prints `teclado-*.png` |
| Celular (390 px) | Playwright, tela de iPhone 12/13/14 | **Nenhuma página rola para o lado** | prints `celular-*.png` |
| Formulário | Validação do próprio navegador (HTML5) | Bloqueia envio vazio e e-mail errado | `teclado-formulario-erro.png` |

## 1. Validador W3C

Os arquivos foram validados direto com o vnu, o mesmo validador do site do W3C.

**Atenção ao validar o endereço do Netlify:** o validador mostra "Stray start tag script" e "Fatal Error". Esse erro não está no nosso código. É um script que o próprio Netlify injeta depois do `</html>`. Ao dar Fatal Error, o validador para e esconde o resto. Por isso a validação foi feita nos arquivos.

Para conferir no site do W3C, use **Check by: file upload** e envie cada `.html`. No Railway esse script não existe.

Na primeira rodada apareceram 15 erros reais, todos corrigidos:
- `aria-label` em `div` sem papel;
- título h3 dentro de `span`;
- título pulando do h1 para o h3;
- um atributo do Netlify fora do padrão.

## 2. Acessibilidade (axe-core)

Rodado em cada página com tela de celular e "reduzir movimento" ligado. Resultado: nenhuma violação nas 11 páginas.

Cada página tem:
- `lang="pt-BR"`, `title` e `meta description` próprios;
- um único `h1`;
- link "Pular para o conteúdo principal";
- `alt` descritivo nas imagens que informam e `alt=""` nas decorativas;
- tabelas com legenda;
- tabelas com rolagem alcançáveis pelo teclado.

## 3. Navegação por teclado

Teste na Home, só com o teclado:

1. **1º Tab:** "Pular para o conteúdo principal" aparece no topo ([teclado-1.png](evidencias/teclado-1.png)).
2. **2º Tab:** logo do WattCerto, com contorno azul de foco ([teclado-2.png](evidencias/teclado-2.png)).
3. **3º Tab:** botão "Menu" ([teclado-3.png](evidencias/teclado-3.png)).
4. **Enter no Menu:** o menu abre (`aria-expanded="true"`). O Tab percorre os links ([teclado-menu-aberto.png](evidencias/teclado-menu-aberto.png)) e o Esc fecha.
5. **Contato:** Enter em "Enviar mensagem" com tudo vazio. O envio é bloqueado e o foco vai para o primeiro campo com erro ([teclado-formulario-erro.png](evidencias/teclado-formulario-erro.png)).

## 4. Contraste

Tabela completa em [contraste.md](evidencias/contraste.md). O menor valor de texto normal é 4,9:1, no laranja das frases acima dos títulos sobre o bege. O mínimo do AA é 4,5:1.

## 5. Celular

Prints das 11 páginas em 390 px de largura: `evidencias/celular-<página>.png`. Em todas, a largura da página é igual à da tela (390 px), sem rolagem para o lado. A Home também foi testada com letra em 200%, sem rolagem lateral (ver diário, 17/11).

## 6. Formulário de contato

- Nome: `required`, `minlength="3"`, `pattern` só com letras e espaços, `label for`/`id`.
- E-mail: `type="email"` e `required`.
- Assunto e mensagem: `required`, com mínimo e máximo de caracteres.
- Consentimento: caixa de seleção obrigatória.

No Netlify, a mensagem é enviada pelo Netlify Forms. Em outra hospedagem, a página confere os dados e avisa que essa versão não envia a mensagem para um servidor.
