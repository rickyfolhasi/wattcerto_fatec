# Watt Certo: Projeto de Site MVP

**Tema:** sustentabilidade e impacto social, com foco em consumo consciente de energia elétrica.
**Disciplina:** Desenvolvimento Web, curso de ADS, Fatec Antônio Russo (São Caetano do Sul/SP).
**Atividade:** Atividade 05, Projeto de Site MVP (entrega parcial).

## O que é
Site que estima o consumo mensal de energia de uma residência por aparelho,
mostra quanto cada um pesa na conta, compara a estimativa com a fatura real e
sugere trocas que geram economia. Sem cadastro e sem login.

## Estrutura
```
wattcerto/
├── index.html              Home (entregue nesta etapa)
├── sobre.html              demais páginas do mapa do site
├── calculadora.html
├── impacto.html
├── acessibilidade.html
├── galeria.html
├── midia.html
├── noticias.html
├── contato.html
├── orcamento_hospedagem.html
├── css/style.css           folha de estilo única
├── js/menu.js              menu responsivo (melhoria progressiva)
├── img/                    ilustração da Home (SVG autoral)
├── assets/fonts/           Fraunces e Atkinson Hyperlegible (licença aberta)
└── docs/                   documentação
```

## Divisão de funções
- Henrique Folhasi: Home, CSS base e identidade visual
- Guilherme Cerqueira: Sobre e Calculadora
- João Pedro: Impacto e Galeria
- Miguel Essien: Mídia, Notícias e documentação
- Pedro Accorsi: Contato (formulário), hospedagem e deploy no Railway

## Validação feita nesta entrega
- HTML das 10 páginas sem erros de validação.
- Contraste de todas as combinações de cor igual ou superior a 4,5:1 (nível AA).
- Navegação por teclado com foco visível e link de salto para o conteúdo.
- Sem rolagem horizontal em 390 px de largura (celular).

## Fontes dos dados
- EPE, Anuário Estatístico de Energia Elétrica 2025 (ano-base 2024).
- AGEMS, Chuveiro elétrico é o maior consumidor de energia em uma residência.
