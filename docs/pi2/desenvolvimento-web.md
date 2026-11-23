# Projeto Integrador 2026/2 | Desenvolvimento Web

**Sistema:** WattCerto, calculadora de consumo de energia residencial | **Professor:** Paulo Fratta
**Equipe:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien e Pedro Accorsi

- **Site publicado:** https://wattcertocalculadora.netlify.app/ (o endereço final no Railway entra aqui quando estiver no ar)
- **Repositório:** https://github.com/rickyfolhasi/wattcerto_fatec
- **Documentação completa:** pasta `docs/` do repositório

## Sustentabilidade e impacto social

O WattCerto mostra a qualquer família onde a conta de luz pesa e como gastar menos, sem termos técnicos e sem cadastro. O chuveiro elétrico, sozinho, pode ficar com 25% a 35% da conta (AGEMS), e a tarifa tem alta média prevista de 9,4% em 2026 (ANEEL).

O site se liga a dois Objetivos de Desenvolvimento Sustentável:

- **ODS 7**, energia limpa e acessível;
- **ODS 12**, consumo e produção responsáveis.

A página Projetos aponta programas reais para quem ganha menos: a Tarifa Social, a troca de geladeira da Enel SP e o Procel. Pessoas com deficiência são público prioritário.

## O projeto em etapas

| Etapa | O que foi feito | Onde está a prova |
|---|---|---|
| **Planejamento** (A05) | Escopo com objetivos, público-alvo, mapa do site, identidade visual, riscos e critérios de aceitação; MVP entregue em 18/10/2026 | `docs/escopo-atualizado.md` |
| **Código** | 11 páginas em HTML5, CSS3 e JavaScript puro, sem framework: calculadora por aparelho, formulário validado, vídeo, áudio e iframe | Repositório; `docs/diario-de-bordo.md` |
| **Validação** | Validador W3C (vnu) com 0 erros nas 11 páginas; axe-core (WCAG 2.2 AA) com 0 problemas; 14 de 14 combinações de cor no nível AA; teste só com teclado | `docs/evidencias-de-testes.md` e `docs/evidencias/` |
| **Responsividade** | Celular, tablet e computador; nenhuma página rola para o lado em 390 px; letra em 200% sem quebrar | Prints `docs/evidencias/celular-*.png` |
| **Publicação** | No ar com HTTPS no Netlify; publicação final no Railway, ligada ao GitHub | `docs/orcamento-hospedagem.md` |

## Do MVP ao site final

Não houve apontamentos do professor no MVP. A própria equipe revisou o site:

- **Home:** passou de 9 para 5 blocos, com um botão principal só e dados em reais em vez de GWh.
- **Páginas internas:** as 8 que eram "em construção" ficaram completas, com fonte em cada número.
- **Página nova:** Projetos.

O antes e depois, com prints, está em `docs/relatorio-de-melhorias.md`.

## Apresentação final

A apresentação final, a prova prática, é a Atividade 06. Ela tem:

- 22 slides, com a seção MVP vs Atual;
- demonstração ao vivo do site publicado: menu, celular, formulário, mídia, teclado, `/docs` e deploy.
