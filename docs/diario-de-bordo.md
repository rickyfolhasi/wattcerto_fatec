# Diário de bordo: da A05 (MVP) à A06 (site final)

As datas vêm do histórico do Git (`git log`) e do registro de mudanças do site (`conteudo-removido.md`). Cada entrada traz o que foi decidido, o que a equipe aprendeu, o que deu trabalho e como foi resolvido.

## 18/10/2026 | Entrega do MVP (A05)

- **Feito:** Home completa, as outras 9 páginas como base (estrutura, menu e rodapé) e a primeira versão da calculadora. Commit `d204f8a`.
- **Decisão:** usar HTML, CSS e JavaScript puro, sem framework, para a equipe inteira conseguir ler e explicar o código.
- **Decisão:** a calculadora não pede cadastro e não envia nada para servidor. O cálculo acontece no navegador.
- **Aprendizado:** a conta "potência × horas" erra feio para aparelhos que não ficam na potência cheia. Uma geladeira de 200 W contada como "ligada 24 horas" daria 144 kWh por mês; uma de 2 portas frost free gasta 56,9 kWh (Procel). Daí veio a ideia de regras diferentes por tipo de aparelho.
- **Dificuldade:** 9 das 10 páginas ainda eram só um aviso de "em construção".

## 17/11/2026 | Notícias e auditoria de acessibilidade

- **Feito:** página de Notícias com três textos completos e fonte em cada um.
- **Feito:** auditoria com axe-core e testes manuais, com correções:
  - o laranja dos títulos pequenos passou de 4,2:1 para 4,9:1 de contraste;
  - títulos que pulavam do h1 para o h3 foram corrigidos;
  - tabelas com rolagem passaram a funcionar pelo teclado;
  - caixas de seleção passaram a 24 px, o alvo mínimo do WCAG 2.2;
  - nenhuma página rola para o lado com letra em 200%.
- **Aprendizado:** o axe acusa contraste errado em texto sobre degradê, porque não lê o degradê. A medida foi feita nos pixels: 5,4:1. Registramos isso como falso positivo.
- **Dificuldade:** com letra grande no celular, todas as páginas rolavam para o lado.
- **Solução:** grades com `min(Xrem, 100%)`, colunas com `minmax(0, 1fr)` e quebra de palavras longas.

## 18/11/2026 | Imagens leves, catálogo em JSON e hospedagem

- **Feito:** imagens em WebP com versões de 480, 720 e 800 px (`srcset`). As fotos das notícias caíram de 110 KB para 70 KB e de 70 KB para 29 KB.
- **Feito:** o catálogo de aparelhos saiu do JavaScript e passou para `dados/catalogo.json`, gerado pelo programa em Python do Projeto Integrador 2.
- **Feito:** o formulário de contato passou a ser recebido pelo Netlify Forms.
- **Decisão:** testar o site no Netlify (plano Free), porque o crédito de teste do Railway da equipe tinha acabado.
- **Aprendizado:** no plano Free do Netlify, cada publicação gasta 15 dos 300 créditos do mês. Por isso a equipe passou a testar tudo no computador e publicar de uma vez.

## 19/11/2026 | Um padrão só para as páginas internas

- **Feito:** Sobre, Impacto, Calculadora e Galeria passaram a seguir o mesmo esqueleto: abertura centralizada, e depois seções com título à esquerda e conteúdo à direita, com fundos alternados.
- **Feito:** a página Acessibilidade virou uma lista por tipo de deficiência.
- **Decisão:** frase pequena acima dos títulos em laranja nas páginas claras e em amarelo nas faixas verde-escuras, sempre com contraste AA.
- **Dificuldade:** cada seção tinha alinhamento e largura diferentes, e a página parecia desorganizada.
- **Solução:** um único conjunto de classes (`secao-abertura`, `secao-trilho`) usado em todas as seções.

## 22/11/2026 | Fechamento da A06

- **Feito:** banco de dados do PI2 no servidor da turma (tabelas com prefixo `g03_`).
- **Feito:** páginas que faltavam na lista da A06:
  - Mídia, com vídeo, áudio gravado pela equipe e iframe da ANEEL;
  - Projetos, página nova com Tarifa Social, troca de geladeiras e Procel;
  - Orçamento, com 3 hospedagens e 3 domínios;
  - Contato, com a equipe e dados fictícios.
- **Feito:** menu e rodapé com as 11 páginas.
- **Dificuldade:** o validador W3C, ao checar o endereço do Netlify, parava num script que o próprio Netlify injeta depois do `</html>` ("Fatal Error"). Com isso, ele escondia erros que eram nossos.
- **Solução:** validar os arquivos direto com o vnu, o mesmo motor do W3C. Apareceram 15 erros reais, todos corrigidos. Resultado: 0 erros nas 11 páginas.
- **Dificuldade:** no Railway não existe o Netlify Forms, e o formulário daria erro ao enviar.
- **Solução:** fora do Netlify, a página confere os dados e avisa que essa versão não envia a mensagem.
- **Aprendizado:** a regra de segurança `Content-Security-Policy` bloqueava qualquer iframe de fora. Ela foi liberada só para `www.youtube-nocookie.com`.
