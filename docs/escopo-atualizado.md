# Escopo do Projeto: WattCerto (atualizado na A06)

Segue o roteiro da A05 (seções 5.1 a 5.13). As mudanças desde o MVP estão marcadas com **(mudou)**.

## 5.1 Identificação

- **Equipe:** Equipe WattCerto
- **Projeto/site:** WattCerto, calculadora de consumo de energia residencial
- **Integrantes:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien e Pedro Accorsi
- **Data:** 22/11/2026 (atualização da A06; MVP entregue em 18/10/2026)
- **Professor/disciplina:** Prof. Paulo Fratta, Desenvolvimento Web (Front-End), Fatec São Caetano do Sul

## 5.2 Contexto e justificativa

**O problema.** A conta de luz chega como um número só, e a família não sabe qual aparelho pesa mais nem o que mudar. O chuveiro elétrico, sozinho, pode ficar com 25% a 35% da conta (AGEMS), e a tarifa no Brasil tem alta média prevista de 9,4% em 2026 (ANEEL).

**A relação com sustentabilidade e impacto social.** Gastar menos energia alivia o orçamento das famílias, principalmente as de baixa renda, e reduz o desperdício na rede elétrica do país. O tema do projeto é consumo consciente.

## 5.3 Objetivos

**Geral:** mostrar a qualquer família, incluindo pessoas com deficiência, onde a conta de luz pesa e como gastar menos, sem termos técnicos.

**Específicos (mensuráveis):**
1. Estimar o consumo de cada aparelho em kWh e em reais, com regra própria para quem não fica na potência cheia: chuveiro, geladeira, ar-condicionado e máquina de lavar.
2. Comparar a estimativa com o valor da última fatura.
3. Mostrar a economia mensal e anual de cada troca ou mudança de hábito.
4. Publicar 11 páginas com dados e fontes do setor elétrico.
5. Atingir o nível AA do WCAG e 0 erros no W3C nas 11 páginas.

## 5.4 Público-alvo

- **Quem:** famílias brasileiras, de qualquer idade adulta, começando pela região do ABC paulista (área da Enel SP).
- **Pessoas com deficiência são público prioritário:** baixa visão, daltonismo, cegueira (leitor de tela), surdez, deficiência motora e sensibilidade a movimento. Cada caso tem medida própria na página Acessibilidade.
- **Perfis e necessidades:**
  - **Quem paga a conta:** quer saber por que ela veio alta e o que mudar.
  - **Família de baixa renda:** quer saber se tem direito à Tarifa Social e à troca de geladeira (página Projetos).
  - **Quem vai comprar um aparelho:** quer saber quanto o modelo novo economiza.
- **Onde usar:** no celular ou no computador, sem cadastro e sem instalar nada.

## 5.5 Escopo funcional

**(mudou)** As 10 páginas pedidas viraram 11: a Calculadora é o coração do projeto e ficou como página própria, além das 10 da lista.

- index.html: resumo do tema, como funciona, peso do chuveiro e exemplo de economia
- calculadora.html: calculadora por aparelho, comparação com a fatura e simulação de troca
- sobre.html: história, missão, como o cálculo é feito, limites e ficha da equipe
- projetos.html: Tarifa Social, troca de geladeiras da Enel SP, Procel e o WattCerto
- impacto.html: dados do Brasil, bandeiras tarifárias e consumo por aparelho, com fontes
- acessibilidade.html: medidas por tipo de deficiência e atalhos de teclado
- galeria.html: telas e fotos com legendas e fontes, e vídeo de uso
- midia.html: vídeo com poster, áudio com transcrição e iframe da ANEEL
- noticias.html: três notícias com fonte
- contato.html: formulário validado, equipe e dados fictícios
- orcamento_hospedagem.html: 3 hospedagens e 3 domínios comparados

Navegação: menu com as 11 páginas, rodapé com links e fontes, e link para pular ao conteúdo.

**Fora do escopo desta disciplina:** portal com login, fórum e blog com banco de dados. O banco de dados e o programa em Python existem, mas fazem parte do Projeto Integrador 2 e geram o catálogo que o site lê.

## 5.6 Escopo não funcional

- **Acessibilidade:** `alt`, contraste AA, teclado, leitor de tela, ARIA onde precisa, `prefers-reduced-motion`.
- **Sustentabilidade:** conteúdo educativo sobre consumo; imagens em WebP leves; site sem servidor, que gasta pouco para ficar no ar.
- **Responsividade:** celular, tablet e computador, sem rolagem lateral em 390 px.
- **Desempenho:** imagens em até 3 tamanhos e carregamento sob demanda; fontes hospedadas no próprio site.
- **SEO básico:** `title` e `meta description` próprios e um `h1` por página.
- **Segurança:** HTTPS; cabeçalhos de segurança (Content-Security-Policy); nenhum dado da calculadora sai do navegador; o formulário pede consentimento (LGPD). O site não tem login, então não guarda senhas.

## 5.7 Mapa do site

```
Início (index.html)
├── Calculadora
├── Sobre
├── Projetos          (mudou: página nova)
├── Impacto
├── Galeria
├── Mídia
├── Notícias
├── Acessibilidade
├── Orçamento
└── Contato
```

Todas as páginas têm o mesmo menu e o mesmo rodapé, então de qualquer página se chega a qualquer outra em um clique.

## 5.8 Conteúdo e identidade visual

- **Tom de voz:** direto, próximo e simples. Todo número tem fonte.
- **Cores:**
  - verde-escuro `#11392b`: títulos e faixas;
  - bege `#faf6ee`: fundo;
  - laranja `#cf5a0a`: marca;
  - laranja escurecido `#b34c08`: texto pequeno;
  - amarelo `#f4c04e`: destaques sobre o verde.
- **Tipografia:**
  - Fraunces nos títulos;
  - Atkinson Hyperlegible no texto, uma letra feita para quem enxerga pouco.
- **Logotipo:** "Watt" em verde e "Certo" em laranja.
- **Imagens:**
  - telas da calculadora, capturadas pela equipe;
  - fotos do Pixabay e do Pexels, com crédito;
  - vídeo e áudio feitos pela equipe.

## 5.9 Tecnologias e ferramentas

- **Linguagens:** HTML5, CSS3 e JavaScript puro.
- **Ferramentas:** VS Code, Git e GitHub.
- **Testes:** validador W3C (vnu), axe-core e Playwright.
- **Hospedagem:** **(mudou)** Railway na publicação final, com o Netlify Free como ambiente de testes e plano B. O motivo está em `orcamento-hospedagem.md`.

## 5.10 Cronograma e divisão de tarefas

| Etapa | Planejado | Realizado |
|---|---|---|
| MVP: Home, escopo e slides (A05) | Entrega da A05 | 18/10/2026 |
| Páginas internas, notícias e acessibilidade | Entre a A05 e a A06 | 17/11 a 19/11/2026 |
| Mídia, Projetos, Orçamento, Contato, Galeria e testes | Antes da A06 | 22/11/2026 |
| Publicação no Railway e apresentação (A06) | Data da apresentação | A fazer |

Responsáveis: ver a divisão de funções no [README](README.md).

## 5.11 Riscos e restrições

- **Crédito de hospedagem:** o teste grátis do Railway acabou durante o projeto. Mitigação: testes no Netlify e publicação final de uma vez.
- **Internet no dia da apresentação.** Mitigação: plano B com prints e vídeo da navegação.
- **Dados que mudam:** tarifas e bandeiras mudam todo mês. Mitigação: data e fonte em cada número.
- **Tempo e conhecimento:** equipe de 2º semestre. Mitigação: código sem framework, comentado em português.

## 5.12 Critérios de aceitação

| Critério | Status |
|---|---|
| 10 páginas interligadas e navegáveis | Atingido (11 páginas) |
| Formulário de contato validado em HTML5 | Atingido (`required`, `type="email"`, `pattern`, `minlength`, `label for`) |
| Vídeo, áudio e iframe na página Mídia | Atingido |
| Acessibilidade aplicada (alt, contraste, teclado, ARIA) | Atingido (axe com 0 problemas, contraste AA) |
| W3C sem erros | Atingido (0 erros nas 11 páginas) |
| Responsivo em celular, tablet e computador | Atingido |
| Documentação em /docs | Atingido |
| Publicado no Railway com HTTPS | Atingido (https://wattcertocalculadora.up.railway.app/, conferido em 24/11/2026; plano B no Netlify) |

## 5.13 Aprovação

- Responsável pela validação do escopo: __________________________
- Data: ____/____/2026
- Assinatura: __________________________
