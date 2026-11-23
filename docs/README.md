# WattCerto: calculadora de consumo de energia residencial

**Equipe WattCerto:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien e Pedro Accorsi
**Disciplina:** Desenvolvimento Web (Front-End), Prof. Paulo Fratta, Fatec São Caetano do Sul (Antônio Russo), curso de Análise e Desenvolvimento de Sistemas
**Atividade:** A06, Conclusão e Apresentação de Projeto de Site (entrega final; a A05 foi o MVP)
**Tema:** sustentabilidade e impacto social, com foco em consumo consciente de energia elétrica

- **Site publicado:** https://wattcertocalculadora.netlify.app/ (Netlify, plano Free). A publicação final é no Railway; quando o endereço do Railway sair, ele entra aqui.
- **Repositório:** https://github.com/rickyfolhasi/wattcerto_fatec

## O que é

Site que estima o consumo mensal de energia de uma casa, aparelho por aparelho. Mostra quanto cada um pesa na conta, compara a estimativa com a fatura real e sugere trocas que geram economia. Sem cadastro e sem login: nada do que a pessoa digita sai do navegador.

## Objetivos

**Geral:** ajudar qualquer família, incluindo pessoas com deficiência, a entender onde a conta de luz pesa e como gastar menos, sem precisar saber termos técnicos.

**Específicos:**
1. Calcular o consumo de cada aparelho em kWh e em reais, com regras diferentes para quem gasta conforme o uso (chuveiro, geladeira, ar-condicionado).
2. Comparar a estimativa com o valor da última fatura.
3. Mostrar quanto a casa economiza com cada troca ou mudança de hábito.
4. Publicar dados do setor elétrico com fonte (EPE, ANEEL, AGEMS, Procel).
5. Cumprir o nível AA do WCAG nas 11 páginas, com navegação completa pelo teclado.

## Páginas (11)

| Página | O que tem |
|---|---|
| index.html | Resumo do tema, como funciona, peso do chuveiro na conta, exemplo de economia |
| calculadora.html | Calculadora de consumo por aparelho |
| sobre.html | Por que o projeto existe, frentes, como o cálculo é feito, limites da estimativa, ficha da equipe |
| projetos.html | Tarifa Social, troca de geladeiras da Enel SP, Procel e o próprio WattCerto |
| impacto.html | Dados do Brasil, bandeiras tarifárias e consumo por aparelho, com fontes |
| acessibilidade.html | Medidas para cada tipo de deficiência e atalhos de teclado |
| galeria.html | Telas da calculadora com legendas e o vídeo de uso |
| midia.html | Vídeo com poster, áudio com transcrição e iframe com os vídeos da ANEEL |
| noticias.html | Três notícias sobre tarifa, bandeira e eficiência, com fonte |
| contato.html | Formulário validado, equipe e dados de contato fictícios |
| orcamento_hospedagem.html | Três hospedagens e três domínios comparados, com a escolha da equipe |

## Estrutura de pastas

```
wattcerto_fatec/
├── index.html, contato.html, orcamento_hospedagem.html
├── [outras 8 páginas].html
├── css/style.css            folha de estilo única, cores em variáveis no :root
├── js/                      menu, calculadora, formulário e animações (melhoria progressiva)
├── img/  video/  audio/     imagens em WebP, vídeo MP4 e áudio MP3
├── assets/fonts/            Fraunces e Atkinson Hyperlegible (licença aberta, hospedadas no site)
├── dados/catalogo.json      catálogo de aparelhos usado pela calculadora
├── sistema/                 programa em Python e scripts SQL (Projeto Integrador 2)
└── docs/                    esta documentação
```

## Divisão de funções

| Integrante | Responsável por |
|---|---|
| Henrique Folhasi | Home, CSS base e identidade visual |
| Guilherme Cerqueira | Sobre e Calculadora |
| João Pedro | Impacto e Galeria |
| Miguel Essien | Mídia, Notícias e documentação |
| Pedro Accorsi | Contato (formulário), hospedagem e publicação |

## Tecnologias

HTML5, CSS3 e JavaScript puro (sem framework). Git e GitHub para versão. Validador W3C (vnu), axe-core e Playwright para testes. Hospedagem no Netlify (testes) e no Railway (publicação final).

## Documentos desta pasta

| Arquivo | Conteúdo |
|---|---|
| [diario-de-bordo.md](diario-de-bordo.md) | Entradas datadas da A05 até a A06: decisões, aprendizados, dificuldades e soluções |
| [orcamento-hospedagem.md](orcamento-hospedagem.md) | Tabela comparativa de hospedagem e domínio, com a justificativa |
| [evidencias-de-testes.md](evidencias-de-testes.md) | W3C, acessibilidade automática, teclado, contraste, celular e formulário |
| [relatorio-de-melhorias.md](relatorio-de-melhorias.md) | Do MVP ao site final, com prints de antes e depois |
| [escopo-atualizado.md](escopo-atualizado.md) | Escopo da A05 atualizado, com os critérios de aceitação e o status de cada um |
| [conteudo-removido.md](conteudo-removido.md) | Registro de cada texto que saiu ou mudou no site |
| [pi2/](pi2/) | Entregas do Projeto Integrador 2, que usa o mesmo site |

## Como abrir no computador

O site é feito só de páginas prontas. Basta abrir o `index.html` no navegador. A calculadora lê o `dados/catalogo.json`, e alguns navegadores bloqueiam isso em arquivo local; nesse caso, rode um servidor simples na pasta do projeto (`python -m http.server`) e abra `http://localhost:8000`.
