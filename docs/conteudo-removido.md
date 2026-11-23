# Conteúdo removido ou alterado

Registro de todo texto e elemento tirado ou trocado do site, para reaproveitar em outro lugar se for preciso (pedido do Ricky).

> **Aviso (17/11/2026, 16:24):** o ambiente de trabalho foi recriado e a versão anterior deste arquivo se perdeu, porque ainda não tinha commit. As entradas abaixo foram reconstruídas a partir do histórico da conversa e cobrem só as mudanças de 17/11/2026 a partir das 15:46. As entradas anteriores (hero, Explore, Contato, Impacto, Galeria, Notícias até o fundo branco) não puderam ser recuperadas. Também se perdeu o arquivo docs/galeria-telas-do-sistema-removido.html (cópia da seção "Telas do sistema" removida da Galeria); as quatro imagens dessa seção continuam em img/galeria/.

## 2026-11-17 | Notícias | Cartão ampliado e cartões da grade (ajustes finos)
- Cartão ampliado: o botão "Fechar" saiu de cima da imagem. Agora fica numa barra branca no topo, como botão cinza claro (#ecebe5) com o texto "FECHAR" e o X à direita. Antes: botão com o X à esquerda, posicionado sobre a imagem, com anel de foco aparecendo ao abrir.
- Correção: o cartão copiado para dentro da janela herdava o espaçamento, a borda e o arredondamento do cartão comum (imagem com margem e bordas diferentes). Agora a cópia não tem espaço nem borda.
- Arredondamento reduzido de 1.5rem / 3rem para 1.1rem / 2rem (cartões e janela).
- Grade: colunas iguais (antes 1.3fr / 1fr), largura máxima 52rem (antes 58rem); imagem dos cartões menores de proporção 5/2 para 4/1; destaque sem altura mínima de 16rem (altura agora acompanha os dois cartões ao lado).
- Etiqueta do tipo de notícia (ex.: "REAJUSTE"): antes pílula laranja (fundo #cf5a0a, texto branco, 0.72rem); agora pílula laranja como era (fundo #cf5a0a, texto branco), só menor: 0.62rem e espaçamento menor (a pedido do usuário, a cor laranja volta).
- "Leia mais": antes peso 800, 0.78rem, altura mínima 2.5rem; agora peso 500, 0.72rem, altura mínima 2rem.
- Etiqueta do tipo (2ª versão, a pedido: mais minimalista mas laranja): sem fundo nem pílula; só um pontinho laranja (#cf5a0a) e o texto em laranja escuro (#9a3f08) em 0.66rem, peso 700. Antes: pílula laranja preenchida com texto branco.
- Grifado do "Leia mais" (aparece ao passar o mouse): espessura de 2px para 1px.
- Notícias, cartões mais quadrados e mais ao centro (a pedido): largura máxima da grade de 52rem para 46rem (mais margem nas laterais); colunas de 1fr/1fr para 1.2fr/1fr; espaço entre cartões 1.25rem para 1.1rem; imagem dos cartões menores de 4/1 para 5/1; espaçamento interno do texto dos cartões menores reduzido. Resultado em 1366 px: destaque 392x415 (quase quadrado); antes 405x458.
- Etiqueta do tipo (3ª versão, a pedido: balão laranja, fonte mais fina): voltou o balão laranja (#cf5a0a, texto branco), menor (0.66rem, espaçamento 0.16rem 0.6rem) e com fonte mais fina (peso 500). Removida a versão "pontinho + texto laranja escuro (#9a3f08)".
- Etiqueta do tipo: ainda menor (a pedido): 0.6rem e espaçamento 0.1rem 0.5rem (antes 0.66rem e 0.16rem 0.6rem).
- Notícias, grade em quadrados (a pedido: notícias do lado o mais quadradas possível, proporcionais à principal): grade de 3 colunas, largura máxima 44rem; destaque ocupa 2x2 (464x464 em 1366 px) e as duas notícias do lado são quadrados de 224x224, metade do tamanho. Antes: destaque 392x415 e laterais 327x199. No celular (até 52rem) continuam empilhadas, sem proporção fixa.
- Notícias, telas menores (a pedido): até 52rem, uma coluna só, cartões menores (largura máxima 26rem), centralizados, um embaixo do outro. Até 36rem (celular), vira lista: imagem cinza à esquerda (6.5rem) e o resumo (título, data, "Leia mais") ao lado, em cada cartão.
- Notícias, estrutura (HTML) do destaque: o título "Novembro segue com bandeira verde" e a data "30 out. 2026" saíram do bloco `.noticia-capa-texto` (sobre a imagem) e foram para o corpo do cartão, como nas outras notícias. O visual no computador é o mesmo (o CSS sobe o título e a data para cima da imagem). Removidas as regras `.noticia-capa-texto`.
- Notícias, cartão ampliado (a pedido): imagem de proporção 16/9 para uma faixa de 6rem de altura (o título aparece logo no topo, sem precisar mostrar a imagem toda); cantos agora iguais nos quatro lados (1.1rem). Antes: 1.1rem 1.1rem 1.1rem 2rem (canto de baixo à esquerda maior).
- Correção técnica: as regras do destaque (.noticia-destaque .noticia-capa) passaram a valer só dentro da grade (.noticias-grade ...), para não afetar a cópia do cartão ampliado no celular.
- Notícias, botão "Fechar" (3ª versão, a pedido): o X agora fica dentro de uma bolinha cinza clara e a palavra "Fechar" (peso 400, cinza) fica ao lado, fora da bolinha. Os dois só ganham destaque ao passar o mouse, focar com o teclado ou clicar (bolinha verde com X branco, texto verde escuro). Antes: botão retangular cinza claro (#ecebe5) com texto em peso 800 e X à direita.
- Botão "Fechar" (4ª versão, a pedido: opaco e só tons de cinza): texto cinza #767676 e bolinha cinza clara #efefef com X #8c8c8c em repouso; ao passar o mouse/focar a bolinha vai a #d6d6d6 e o texto/X a #2e2e2e; ao clicar a bolinha vai a #b9b9b9 e o texto/X a #111. Antes: bolinha ficava verde (#1e6f52 / verde escuro) com X branco.
- "Leia mais" um pouco menor (a pedido): fonte de 0.72rem para 0.66rem, seta de 18px (1.125rem) para 0.95rem, altura mínima de 2rem para 1.8rem.
## 2026-11-17 | Notícias | Textos completos das 3 notícias (substituem os resumos)
Textos antigos (resumos), na ordem em que apareciam:

<div class="noticia-texto"> <p>A ANEEL manteve a bandeira verde em novembro: não há cobrança extra na conta. A volta das chuvas nas regiões das grandes hidrelétricas está enchendo os reservatórios e diminui o uso das usinas térmicas, que custam mais. Outubro também foi verde, depois de cinco meses seguidos de bandeira amarela (maio a setembro).</p> <p class="noticia-fonte">Fonte: <a href="https://sbtnews.sbt.com.br/noticia/economia/aneel-mantem-bandeira-verde-na-conta-de-luz-em-novembro">SBT News</a>. Veja quanto cada bandeira soma na conta na página <a href="impacto.html">Impacto</a>.</p> </div>

<div class="noticia-texto"> <p>A ANEEL aprovou o reajuste da Enel São Paulo, distribuidora que atende o ABC: alta média de 10,18%, e de 9,02% para as residências. As tarifas novas valem desde 4 de julho de 2026 para cerca de 8,9 milhões de unidades em 24 municípios da Grande São Paulo.</p> <p class="noticia-fonte">Fontes: <a href="https://cenarioenergia.com.br/2026/06/30/aneel-aprova-reajuste-da-enel-sao-paulo-com-efeito-medio-de-1018/">Cenário Energia</a> e <a href="https://agenciainfra.com/blog/aneel-aprova-reajuste-de-1018-nas-tarifas-da-enel-sp/">Agência Infra</a>.</p> </div>

<div class="noticia-texto"> <p>O Ministério de Minas e Energia criou a primeira regra de eficiência para lâmpadas e luminárias LED: pelo menos 120 lúmens por watt até 2028 e 140 até 2030. Quem não cumprir sai das lojas depois de 3 a 5 anos. O governo estima economizar de 283 a 432 TWh até 2040.</p> <p class="noticia-fonte">Fonte: <a href="https://www.dgabc.com.br/Noticia/4332067/mme-lampadas-sem-criterio-de-eficiencia-nao-poderao-ser-vendidas-apos-prazo-de-ate-5-anos">Diário do Grande ABC</a>.</p> </div>

Fatos novos vieram das mesmas fontes citadas em cada notícia (SBT News; Cenário Energia e Agência Infra; Diário do Grande ABC). O exemplo de 200 kWh na notícia da bandeira é uma conta feita no site (2 x R$ 1,885 = R$ 3,77; 2 x R$ 4,463 = R$ 8,93; 2 x R$ 7,877 = R$ 15,75).
- Botão "Fechar": espaço entre a palavra e a bolinha do X reduzido de 0.6rem para 0.3rem (a pedido).
- Cartão ampliado: a barra do topo (com o "Fechar") deixou de ficar fixa; agora sobe junto com o conteúdo ao rolar (a pedido). Antes: position sticky, ficava sempre visível no topo. O cartão continua fechando com Esc e clicando no fundo escurecido.
- Notícias: espaço entre a barra do topo e "Últimas notícias" reduzido (a pedido). Classe nova "noticias-secao" na seção; padding de cima de clamp(3rem, 7vw, 5.5rem) para clamp(1.75rem, 3.5vw, 2.5rem).

## 2026-11-17 | Acessibilidade | Frase de abertura
- Antes: "Economizar energia interessa a qualquer família ou pessoa, por isso o site é construído pensado para ser usado por todos!"
- Agora (texto do usuário): "Economizar energia interessa a qualquer pessoa, por isso o site é construído pensado para ser usado por todos!"

## 2026-11-17 | Acessibilidade | Nova seção "Para cada pessoa" (nada removido)
Seção nova entre a abertura e o "Explore", com 8 cartões: Baixa visão, Daltonismo, Cegueira, Surdez e baixa audição, Fala, Movimento e coordenação, Sensibilidade a movimento, Leitura simples. Fecha com a nota "O que ainda falta": tradução em Libras (VLibras) e testes com pessoas que usam leitor de tela no dia a dia. Cada afirmação foi conferida no código do site (vídeo sem som com descrição escrita; contato só por formulário; skip link; avisos com role="status"; prefers-reduced-motion; sem rolagem horizontal em 320 px nas 8 páginas). A frase "Por isso não precisa de legenda" vale só porque o vídeo da Galeria não tem áudio.

## 2026-11-17 | Auditoria de acessibilidade (axe-core + testes manuais) e correções
- Laranja dos títulos pequenos (kicker-laranja): #c4530a para #b34c08. Antes dava 4,2 para 1 sobre o bege (abaixo do AA); agora 4,9 para 1.
- Etiqueta do tipo de notícia: fundo de #cf5a0a (laranja da marca) para #b34c08. Com texto branco pequeno, antes dava 4,1 para 1; agora 5,3 para 1.
- Notícias: os títulos dos cartões passaram de h3 para h2 (a página pulava do h1 direto para o h3). Mesmo visual.
- Acessibilidade: "Atalhos de teclado" passou de h3 para h2, pelo mesmo motivo. Mesmo visual.
- Sobre e Impacto: as 4 tabelas com rolagem lateral ganharam tabindex="0", role="region" e aria-label (nome da tabela), para quem usa só o teclado conseguir rolar.
- Caixas de seleção (Calculadora e Contato): de 1.3rem e 1.4rem para 1.5rem (24 px, alvo mínimo do WCAG 2.2).
- Cartão ampliado de notícia: com "reduzir movimento" ligado, aparece só com esmaecer, sem o efeito de crescer.
- Letra grande no celular (200%): todas as páginas rolavam para o lado. Corrigido com: grades com mínimo em rem passam a usar min(Xrem, 100%); colunas 1fr passam a minmax(0, 1fr); palavras longas quebram (overflow-wrap); botões nunca mais largos que a tela; itens da fatura (Home) e atalhos de teclado (Acessibilidade) quebram de linha; o número grande "31,7%"/degradê tem tamanho mínimo limitado pela largura da tela.
- Menu: fecha ao rolar a página (folga de 24 px) e ao sair dele com o Tab. O clique fora já fechava.
- Falso positivo registrado: o axe acusa o título branco do destaque de Notícias porque não lê o degradê. Medido nos pixels: contraste mínimo de 5,4 para 1 (título, texto grande, precisa de 3 para 1) e 10,5 para 1 (data).

## 2026-11-17 | Home | Efeito da foto do topo (a pedido)
- Fundo da foto mais rápido: ciclos de cor de 3.5s e 4.5s para 2.4s e 3s; passeio das luzes de 8s e 10s para 5.5s e 7s.
- Pulsar da lâmpada mais forte e um pouco mais rápido: de 2.4s para 1.9s; opacidade de 0.35 a 0.9 para 0.15 a 1; halo laranja mais intenso (camadas de 0.55 e 0.34 para 0.7 e 0.46).
- Com "reduzir movimento" ligado, os dois efeitos continuam parados.
- Troca de cor do fundo da foto ainda mais rápida (a pedido): ciclos de 2.4s e 3s para 1.6s e 2s. O passeio das luzes (5.5s e 7s) e o pulsar da lâmpada (1.9s) não mudaram.

## 2026-11-18 | Notícias | Foto na notícia de novembro (bandeira verde)
- A capa do destaque "Novembro segue com bandeira verde" deixou de ser só cinza (#d9d6cc) e ganhou a foto enviada pelo Ricky (pôr do sol com torres de transmissão), salva em img/noticias/bandeira-verde-novembro.webp (1800x900, 68 KB). Arquivo original: jplenio-sunset-3442835.jpg.
- Crédito acrescentado no fim do texto da notícia: "Foto: Johannes Plenio, Pixabay." (autor e número deduzidos do nome do arquivo baixado do Pixabay; conferir).
- A foto é decorativa (alt vazio): o título já diz do que se trata.
- Correção do crédito da foto de novembro: antes "Foto: Johannes Plenio, Pixabay" com link montado por mim (sunset-pylon-electricity-3442835); agora "Foto: jplenio, Pixabay" com o endereço oficial conferido na página (https://pixabay.com/photos/sunset-countryside-power-lines-3442835/).

## 2026-11-18 | Notícias | Foto na notícia da lâmpada LED
- A capa de "Lâmpada LED vai ter eficiência mínima" deixou de ser só cinza (#d9d6cc) e ganhou a foto enviada pelo Ricky (monte de lâmpadas usadas), salva em img/noticias/lampadas-led-eficiencia.webp (1500x1000). Arquivo original: analogicus-lightbulb-7432190.jpg.
- Crédito no fim do texto: "Foto: analogicus, Pixabay", com link conferido (https://pixabay.com/photos/lightbulb-energy-saving-lights-7432190/).
- Foto decorativa (alt vazio).

## 2026-11-18 | Notícias | Foto na notícia do reajuste da Enel
- A capa de "Conta da Enel SP ficou 10,18% mais cara" deixou de ser só cinza (#d9d6cc) e ganhou a foto enviada pelo Ricky (torre de transmissão contra o céu), salva em img/noticias/torre-energia-enel.webp. Arquivo original: pexels-power-lines-1868352.jpg.
- Crédito no fim do texto: "Foto: Pexels", com link https://www.pexels.com/photo/1868352/ (número tirado do nome do arquivo; a página do Pexels não abriu para conferir o fotógrafo).
- Foto decorativa (alt vazio). Agora as três notícias têm foto.

## 2026-11-18 | Acessibilidade | Item da lista de abertura
- Antes: "Nível de consumo indicado por cor e também por texto, nunca só por cor."
- Agora (texto do Ricky): "Nível de consumo indicado por cor e também por texto."

## 2026-11-18 | Acessibilidade | Seção "Para cada pessoa" (a pedido)
- Frase removida do cabeçalho da seção: "Cada pessoa lê, ouve e navega de um jeito. Veja o que o site faz em cada caso."
- Os 8 tópicos continuam em caixas, agora numa lista centralizada, 3 por linha (2 no tablet, 1 no celular).
- O parágrafo solto "O que ainda falta: tradução em Libras (como a do VLibras, do governo federal) e testes com pessoas que usam leitor de tela no dia a dia. São os próximos passos do projeto." virou a 9ª caixa, no fim da lista: título "O que ainda falta" + texto "Tradução em Libras (como a do VLibras, do governo federal) e testes com pessoas que usam leitor de tela no dia a dia. São os próximos passos do projeto."

## 2026-11-18 | Contato | Fundo da moldura do formulário (a pedido)
- Correção: eu tinha pintado a moldura do formulário de cinza, mas o pedido era o fundo da seção atrás dela. A moldura voltou ao verde claro (#e6f2ea, var(--verde-100)) e o fundo da área principal da página Contato (atrás da moldura) ficou cinza bem claro (#f3f4f3). Cabeçalho e rodapé não mudaram.
- Depois (a pedido): fundo da área principal do Contato, atrás da moldura verde, de cinza bem claro (#f3f4f3) para branco (#fff).

## 2026-11-18 | Contato | Aviso de privacidade menor (a pedido)
- Texto "Usamos o que você escreve só para responder ao seu contato. Projeto acadêmico, sem fins comerciais." (o texto não mudou): fonte de 0.95rem para 0.82rem (cerca de 13px).

## 2026-11-18 | Contato | Aviso de privacidade (a pedido)
- O texto não mudou: "Usamos o que você escreve só para responder ao seu contato. Projeto acadêmico, sem fins comerciais."
- Visual: fonte menor (0.82rem para 0.78rem), no estilo do aviso "Sem cadastro e sem login" da Home: verde da marca, Atkinson Hyperlegible Next fina (peso 300), sem a linha de cima e com o ícone de escudo (antes um cadeado de 20px, linha cinza acima e texto na cor cinza-esverdeada).

## 2026-11-18 | Contato | Cor dos campos do formulário (a pedido)
- Campos de nome, e-mail, assunto e mensagem: fundo de branco (#fff) para o bege da página (#faf6ee). O texto de exemplo (placeholder) ganhou cor própria (#455a4f, 7:1 sobre o bege) para manter o contraste AA sobre o bege. Caixa de marcar e botão não mudaram.

## 2026-11-18 | Imagens | Otimização para conexão lenta (a pedido)
- Nada de texto saiu. Só mudou o peso e a forma de carregar as imagens.
- Imagens das fatias ("reel", 6 fotos): o arquivo padrão deixou de ser 1200x1490 (~20 KB) e passou a 800x993 (~9 KB). Nova versão de 480x596 (~5 KB) para telas pequenas. width/height do HTML corrigidos (antes 640x800, que não batia com a proporção real).
- Foto do topo da Home (hero-lampada): padrão 1000x1500 recomprimido (67 KB para 60 KB), mais versões de 720 px (37 KB) e 480 px (21 KB). O efeito de brilho atrás da foto (CSS) usa a de 480 px.
- Fotos das notícias: o arquivo padrão deixou de ser 1800x900 / 1500x1000 e passou a 1200 px de largura (bandeira verde 70 KB para 29 KB; lâmpadas LED 110 KB para 70 KB; Enel 51 KB para 36 KB). Versões de 800 px e 400 px de cada uma. A janela da notícia pede a versão certa pela largura (js/noticias.js).
- HTML: srcset e sizes nas imagens; loading="lazy" e decoding="async" em todas as fatias; a foto principal da página Notícias ganhou fetchpriority="high".
- Os originais antigos (antes desta otimização) estão na versão publicada v249. Não tenho os JPG originais baixados do Pixabay/Pexels (se quiser qualidade máxima, mande de novo que eu regero).
- Não mexi no vídeo da Galeria (já tem 700 KB, faststart, preload="none" e imagem de capa) nem apaguei arquivos sem uso: img/galeria/tela-*.webp (4 arquivos, ~90 KB), img/hero.svg e img/reel-*.svg não são usados por nenhuma página.

## 2026-11-18 | Contato | Caixa do formulário mais baixa (a pedido)
- Nenhum texto mudou. Altura da caixa no computador: de ~783 px para ~581 px (celular de 390 px: de ~900 px para ~677 px).
- Nome completo e E-mail ficam lado a lado (empilham no celular); campo Mensagem de 5 para 4 linhas; campos de 3 rem para 2,75 rem de altura; espaços entre campos e margem interna da caixa menores.

## 2026-11-18 | Calculadora | Catálogo de aparelhos saiu do js/aparelhos.js (PI2)
- O arquivo js/aparelhos.js foi removido. O catálogo (18 aparelhos da lista "Adicionar aparelho", com notas e fontes) agora vive no banco de dados e é exportado pelo Python para dados/catalogo.json, que a calculadora lê. O conteúdo é idêntico (conferido campo a campo).
- Os dados de origem ficam em sistema/dados/entrada/aparelhos.csv. Cópia do arquivo antigo guardada fora do site (pasta de rascunho da sessão) e no histórico do Git (commit 0cff784).
- Se o catálogo não carregar (arquivo aberto direto do computador, sem servidor), a área "Adicionar aparelho" fica escondida e a calculadora segue com os quatro aparelhos fixos.

## 2026-11-18 | Sobre | Escolha da hospedagem (a pedido: Netlify, orçamento na Sobre)
- Antes, em "Nossa escolha": "A equipe vai publicar o site no Railway, como está no escopo do projeto: ele publica direto do repositório no GitHub. Para o domínio, a sugestão é o .com.br no Registro.br, que é o registro oficial dos domínios brasileiros e não tem preço promocional que sobe na renovação."
- Agora: três parágrafos explicando o Netlify Free (crédito do Railway acabou; site sem servidor; 300 créditos = 20 publicações de 15; formulário não gasta crédito; testar no computador e publicar de uma vez), mantendo a frase do domínio.
- Tabela de hospedagem, linha Netlify, coluna "O que inclui": antes "300 créditos por mês no plano Free"; agora "300 créditos por mês no plano Free; cada publicação gasta 15; formulário de contato não gasta".
- Nome do link de fonte: antes "plano Pro da Netlify"; agora "plano Pro e formulários da Netlify (abr. 2026)".

## 2026-11-18 | Orçamento e hospedagem (orcamento_hospedagem.html)
- Antes: "Página em construção" / "Comparativo de hospedagens e domínios para publicar o site." / "Entrega parcial (MVP)" / "Esta página já faz parte do mapa do site e do menu principal. O conteúdo completo será desenvolvido na entrega final do projeto." / botão "Voltar ao início".
- Agora: resumo da escolha (Netlify Free e .com.br no Registro.br) e botão "Ver o orçamento completo", que leva para sobre.html#hospedagem.

## 2026-11-18 | Contato | Envio pelo Netlify Forms (PI2)
- Mensagem que saiu (aparecia ao enviar): "Dados validados. O envio será ativado quando o site for publicado no Railway."
- Agora o formulário é recebido pelo Netlify Forms (atributo data-netlify, campo armadilha contra robôs). Mensagens novas: "Enviando...", "Mensagem enviada. Vamos responder no e-mail que você informou." e, em caso de falha, "Não foi possível enviar agora. Confira sua internet e tente de novo em alguns minutos."

## 2026-11-19 | Acessibilidade | Seção das pessoas vira lista (a pedido)
- Selo (kicker): antes "Para cada pessoa"; agora "Por cada pessoa".
- Título: antes "O que fizemos por quem usa o site de outro jeito"; agora "O que fizemos para quem usa o site:".
- As 9 caixas (3 por linha) viraram uma lista centralizada: nome da situação à esquerda e texto à direita, com linha fina entre os itens. Textos sem mudança. "O que ainda falta" continua como último item.
- Depois (a pedido): cada item da lista voltou a ser uma caixa, agora branca e uma embaixo da outra (largura máxima de 46rem, centralizada). Textos sem mudança.

## 2026-11-19 | Acessibilidade | "Em primeiro lugar" juntou com a lista das pessoas (a pedido: menos repetição)
- Agora é uma seção só: selo "Em primeiro lugar", título "Um site que funciona para todo mundo", frase de abertura, subtítulo "O que fizemos para quem usa o site:", as 9 caixas e, no fim, o cartão "Atalhos de teclado".
- Saiu o selo "Por cada pessoa" (o selo "Em primeiro lugar" ficou).
- Saiu a lista com ✓ (cada item já estava dito numa caixa):
  - "Navegação completa pelo teclado, com foco sempre visível." (foi para a caixa Movimento e coordenação)
  - "Estrutura semântica e textos alternativos para leitores de tela." (foi para a caixa Cegueira)
  - "Contraste verificado: todas as combinações passam no nível AA." (já estava na caixa Daltonismo)
  - "Nível de consumo indicado por cor e também por texto." (já estava na caixa Daltonismo)
- Caixa Movimento e coordenação: antes "Tudo funciona só com o teclado, sem precisar de mouse. Não há nada com tempo limite e nenhuma ação exige arrastar ou fazer gestos complicados."; agora "Tudo funciona só com o teclado, sem precisar de mouse, e o item em foco fica sempre marcado na tela. Não há nada com tempo limite e nenhuma ação exige arrastar ou fazer gestos complicados."
- Caixa Cegueira: antes "... Imagens que só enfeitam ficam de fora da leitura, e os avisos da calculadora..."; agora "... Imagens que informam têm descrição em texto, as que só enfeitam ficam de fora da leitura, e os avisos da calculadora..."
- Depois (a pedido): com a tela deitada, as caixas ficam lado a lado (3 por linha no computador, 2 em telas deitadas menores); com a tela em pé, continuam em lista, uma embaixo da outra.

## 19/11/2026 | Acessibilidade | caixas "O que fizemos para quem usa o site"
- Depois (a pedido): cada caixa ganhou um ícone ao lado do título, no mesmo estilo dos ícones do site (traço de 2 px, círculo verde-claro; "O que ainda falta" em amarelo). Ícones: olho (Baixa visão), círculo dividido (Daltonismo), olho cortado (Cegueira), alto-falante mudo (Surdez e baixa audição), balão de conversa (Fala), teclado (Movimento e coordenação), pausa (Sensibilidade a movimento), documento (Leitura simples), bandeira (O que ainda falta). Os ícones são decorativos e escondidos do leitor de tela. Nenhum texto foi alterado.

## 19/11/2026 | Acessibilidade | caixa "Leitura simples"
- Antes: "Escrevemos de forma direta e próxima, sem jargão, e explicamos os termos de energia quando eles aparecem. Quem não é da área entende na primeira leitura."
- Depois (texto do usuário): "Escrevemos de forma direta, próxima e simples. Explicamos os termos técnicos de energia quando eles aparecem."

## 19/11/2026 | Acessibilidade | espaçamento
- Depois (a pedido): o espaço entre o texto de abertura e "O que fizemos para quem usa o site:" passou de 40 px para 28 px, igual ao espaço entre esse título e as caixas (testado antes com 20 px, que ficou apertado). Nenhum texto alterado.

## 19/11/2026 | Acessibilidade | espaço no topo
- Depois (a pedido): "Em primeiro lugar" ficou mais perto da barra do topo (espaço de 88 px para 40 px no computador, 48 px para 24 px no celular). Nenhum texto alterado.

## 19/11/2026 | Acessibilidade | espaço acima de "O que fizemos"
- Depois (a pedido): "O que fizemos para quem usa o site:" desceu um pouco; o espaço acima dele passou de 28 px para 36 px (abaixo continua 28 px). Nenhum texto alterado.

## 19/11/2026 | Acessibilidade | respiro do topo
- Depois (a pedido): mais espaço entre "Em primeiro lugar", o título, o texto de abertura e "O que fizemos para quem usa o site:" (kicker 10 para 16 px do título; título para texto 14 para 22 px; texto para "O que fizemos" 36 para 48 px; "O que fizemos" para as caixas 28 para 24 px). Nenhum texto alterado.
- Depois (a pedido, "mais"): respiro aumentado de novo no topo da Acessibilidade: "Em primeiro lugar" a 22 px do título; título a 30 px do texto; texto a 68 px de "O que fizemos"; "O que fizemos" a 28 px das caixas. Nenhum texto alterado.
- Depois (a pedido): espaço entre o texto de abertura e "O que fizemos para quem usa o site:" aumentado para 96 px (antes 68 px). Nenhum texto alterado.
- Depois (a pedido): os três textos do topo da Acessibilidade ("Em primeiro lugar", título e texto de abertura) voltaram a ficar juntos, com o espaçamento original (10 px e 14 px). Só o espaço entre eles e "O que fizemos para quem usa o site:" foi ajustado, para 48 px; "O que fizemos" a 24 px das caixas. Nenhum texto alterado.

## 19/11/2026 | Galeria | topo da página
- Antes: faixa de abertura (`page-topo`) com título "Galeria" e o texto "Telas do sistema e imagens dos aparelhos analisados, com legendas e fontes."
- Depois (a pedido, para seguir o padrão de Notícias e Acessibilidade): cabeçalho centralizado direto na seção, com a linha pequena "Telas e aparelhos" (texto novo), o título "Galeria" e o mesmo texto de abertura, sem alteração. Espaço do topo igual ao da Acessibilidade.

## 19/11/2026 | Calculadora, Sobre, Impacto e Galeria | abertura das páginas no padrão do site
Padrão seguido (o mesmo de Notícias e Acessibilidade): sem a faixa branca de abertura (`page-topo`); cabeçalho centralizado direto na seção, com linha pequena (kicker), título em frase e texto de abertura; título com quebra equilibrada.

### Galeria
- Antes: linha pequena "Telas e aparelhos" e título "Galeria".
- Depois: linha pequena "Galeria" e título "O WattCerto em imagens" (texto novo, para o título ter a mesma proporção dos outros). Texto de abertura sem alteração.

### Calculadora
- Removido: título "Calculadora" (era o h1) e a linha pequena "Passo a passo".
- Depois: linha pequena "Estime a sua conta" (mantida), título "Calcule o consumo da sua casa" (era o subtítulo da seção e virou o título da página), seguido dos textos que já existiam: "Informe quantas pessoas moram na casa e quais aparelhos você usa. A calculadora mostra quanto cada um consome, quem pesa mais na conta e quanto dá para economizar com uma troca." e "Tudo é calculado no seu navegador. Nada do que você digita é enviado ou salvo." O parágrafo "Os números que já aparecem nos campos são valores de partida..." continua, logo acima do formulário. Assim a página não repete dois títulos seguidos.

### Sobre
- Antes: título "Sobre o projeto".
- Depois: linha pequena "Sobre o projeto" e título "Por que criamos o WattCerto" (texto novo). Texto "Origem, missão e objetivos do WattCerto, projeto acadêmico da Fatec São Caetano do Sul." e o índice "Nesta página" mantidos, agora centralizados.

### Impacto
- Antes: título "Impacto".
- Depois: linha pequena "Impacto" e título "Quanto a energia pesa e quanto dá para economizar" (texto novo). Texto "Tabelas de consumo, tarifas e economia possível com a troca de aparelhos." mantido.

## 19/11/2026 | Páginas internas | laranja da marca nos títulos
- Depois (a pedido, "cadê o laranja"): o título principal de cada página interna ganhou o grifo laranja da marca (o mesmo traço laranja de "economizar?" da Home), desenhado da esquerda para a direita ao abrir a página; com "reduzir movimento" ligado aparece parado. Palavras grifadas: Acessibilidade "todo mundo", Notícias "conta de luz", Galeria "imagens", Calculadora "sua casa", Sobre "WattCerto", Impacto "economizar", Contato "Contato". Nenhum texto alterado.
- Depois (a pedido): na Sobre, o botão "Abrir a calculadora" (caixa "Calculadora de consumo") passou a usar o mesmo botão da Home: laranja da marca com contorno e sombra verdes e a seta num círculo verde. Texto sem alteração.
- Desfeito (a pedido): o grifo laranja nos títulos das páginas internas foi removido de todas as páginas (Acessibilidade, Notícias, Galeria, Calculadora, Sobre, Impacto e Contato). Os títulos voltaram a ficar só em verde.

## 19/11/2026 | Calculadora, Sobre e Impacto | textos sem repetição e páginas contínuas
Cópias das páginas antes da mudança: pasta de trabalho do Claude (`removidos/*-antes-19-11.html`), além do histórico do Git (commit 0cff784 e o próximo).

### Calculadora (começo da página)
- Linha pequena: antes "Estime a sua conta" (repetia o título); depois "Calculadora".
- Texto de abertura, antes: "Informe quantas pessoas moram na casa e quais aparelhos você usa. A calculadora mostra quanto cada um consome, quem pesa mais na conta e quanto dá para economizar com uma troca."
- Depois: "Diga quantas pessoas moram na casa e quais aparelhos você usa. Você vê quanto cada um gasta, quem pesa mais na conta e quanto economiza trocando um aparelho."
- Dois textos juntados em um. Antes: "Tudo é calculado no seu navegador. Nada do que você digita é enviado ou salvo." e "Os números que já aparecem nos campos são valores de partida. Troque pelos da etiqueta de cada aparelho e pelo seu hábito de uso. Para ver de onde vem cada número, leia como o cálculo é feito."
- Depois: "Os campos já vêm com valores de partida: troque pelos da etiqueta e pelo seu uso (de onde vem cada número). Tudo é calculado no seu navegador, nada é enviado."

### Sobre
- Cor e separação: a página inteira ficou no mesmo fundo creme (antes alternava creme e branco em faixas) e com menos espaço entre as seções. A abertura e "As frentes do projeto" viraram uma seção só. Os destaques continuam em painéis (calculadora em amarelo, chuveiro em amarelo, "Nossa escolha", ficha em verde escuro).
- Abertura, antes: "Origem, missão e objetivos do WattCerto, projeto acadêmico da Fatec São Caetano do Sul." (a página não fala de origem nem de missão). Depois: "O que o site faz, como ele chega em cada número, onde a estimativa pode errar e quem está por trás do projeto."
- Modo avançado, antes: "Aparelhos com consumo variável, como o chuveiro, ganham perguntas próprias: potência, estação do ano, tempo de banho e frequência." Depois: "Aparelhos que gastam conforme o uso, como o chuveiro, ganham perguntas próprias: estação do ano, tempo de banho e quantas pessoas tomam banho."
- Diagnóstico da conta, antes: "Comparação entre o valor estimado e o valor real da fatura, para mostrar se a conta veio acima do esperado." Depois: "Compara a estimativa com o valor da sua fatura e mostra se a conta veio acima do esperado."
- Sugestão de troca, antes: "Quanto a casa economizaria por mês ao substituir um aparelho antigo por um modelo mais eficiente." Depois: "Mostra quanto a casa economiza por mês trocando um aparelho antigo por um mais eficiente."
- Privacidade por padrão, antes: "Nenhum cadastro: os dados ficam salvos no navegador do usuário, com termo de consentimento que pode ser recusado." (estava errado: a simulação não é salva e não há termo de consentimento na calculadora). Depois: "Sem cadastro e sem login. O que você digita fica só no seu navegador e não é enviado para ninguém."
- Resultado em minutos, antes: "O diagnóstico completo sai em poucos minutos, sem precisar entender de física ou ler a fatura inteira." Depois: "O diagnóstico sai em poucos minutos, sem precisar entender de física nem ler a fatura inteira."
- Como o cálculo é feito, dois parágrafos juntados. Antes: "Cada número do resultado vem de uma das fórmulas abaixo. Não há estimativa escondida." e "A conta potência × horas só vale para quem fica ligado na potência cheia. Uma geladeira de 200 W contada como "ligada 24 horas" daria 144 kWh por mês, mas uma de 2 portas frost free gasta 56,9 kWh (Procel). Por isso cada aparelho usa a regra do seu tipo." Depois: "Cada número do resultado sai de uma das regras abaixo, escolhida pelo jeito que o aparelho gasta energia. A conta potência × horas só vale para quem fica ligado na potência cheia: uma geladeira de 200 W contada como "ligada 24 horas" daria 144 kWh por mês, mas uma de 2 portas frost free gasta 56,9 kWh (Procel)."
- Chuveiro, antes: "O chuveiro é o primeiro aparelho com consumo que muda conforme o uso: depende da estação, do tempo de banho e de quantas pessoas tomam banho. Por isso ele tem uma fórmula própria." Depois: "O gasto do chuveiro muda com a estação, o tempo de banho e o número de pessoas. Por isso ele tem fórmula própria."
- Fator da estação, antes: "O fator da estação é 1,0 na posição inverno e 0,7 na posição verão. É o valor adotado pelo projeto WattCerto." Depois: "O fator da estação é 1,0 na posição inverno e 0,7 na posição verão, valor adotado pelo WattCerto."
- "Níveis de consumo" saiu de "O que a estimativa não sabe" (não é um limite da estimativa) e foi para dentro da regra "Custo, parte e economia". Texto antigo: "Cada aparelho é classificado pela sua participação no total: alto a partir de 30%, médio de 10% até menos de 30% e baixo abaixo de 10%. É uma regra do WattCerto para destacar o que pesa mais, e o nível aparece sempre em texto e em cor." Texto novo: "O nível de cada aparelho vem da parte dele na conta: alto a partir de 30%, médio de 10% até menos de 30% e baixo abaixo de 10%. O nível aparece sempre em texto e em cor."
- Valores de partida, antes: "Os números que já vêm nos campos são pontos de partida editáveis. Alguns são da tabela de consumo da Procel; os outros são potências típicas de mercado, e cada aparelho diz de onde veio o seu. Quanto mais próximo da etiqueta e do seu hábito, melhor a estimativa." Depois: "Os números que já vêm nos campos são pontos de partida. Alguns são da tabela da Procel; os outros são potências típicas de mercado, e cada aparelho diz de onde veio o seu. Quanto mais perto da etiqueta e do seu hábito, melhor a estimativa."
- Tarifa e fatura, antes: "A tarifa varia por distribuidora e por bandeira. No MVP os dados de tarifa estão validados apenas para o estado de São Paulo, e a tarifa usada é sempre exibida no resultado. A fatura pode incluir itens que a calculadora não considera, como a contribuição de iluminação pública." Depois: "A tarifa muda por distribuidora e por bandeira. Por enquanto, os dados de tarifa foram conferidos só para o estado de São Paulo, e a tarifa usada sempre aparece no resultado. A fatura também cobra itens que a calculadora não conta, como a iluminação pública."
- Aparelhos que ficam de fora, antes: "Só entram na soma os aparelhos que estão na lista. Na calculadora, use "Adicionar aparelho" para incluir os que faltam, inclusive um com o nome escrito por você. Carregadores e aparelhos pequenos ficam de fora." Depois: "Só entra na soma o que está na lista. Na calculadora, use "Adicionar aparelho" para incluir o que falta, até com um nome escrito por você. Carregadores e aparelhos muito pequenos não estão na lista."
- Ficha do fim, título: antes "Sobre o projeto" (repetia o topo); depois "Equipe e instituição" (igual ao índice "Nesta página").

### Impacto
- Cor e separação: a página inteira no mesmo fundo creme (antes: abertura creme, faixa verde escura de ponta a ponta, creme e branco). Os números do Brasil viraram um painel verde escuro com cantos arredondados, logo abaixo do título, na mesma seção. Menos espaço entre as seções.
- Título, antes: "Quanto a energia pesa e quanto dá para economizar" (a página não mostra economia). Depois: "Quanto a energia de casa pesa no país e na conta".
- Abertura, antes: "Tabelas de consumo, tarifas e economia possível com a troca de aparelhos." Depois: "A parte das casas no consumo do Brasil, quanto cada bandeira soma na conta e para onde vai a energia de uma casa típica."
- Painel, título antes: "As residências respondem por quase um terço de toda a eletricidade do país." Depois: "Quase um terço da eletricidade do país vai para as casas".
- Painel, legenda antes: "da eletricidade consumida no Brasil em 2025 foi para residências como a sua: 179.648 GWh em 84,5 milhões de unidades residenciais." Depois: "da eletricidade consumida no Brasil em 2025 ficou nas residências: 179.648 GWh, em 84,5 milhões de casas."
- Fonte do painel: "Por residência" virou "Por casa".
- Bandeiras, antes: "...Na verde não há nada a mais. Nas outras, cada 100 kWh consumidos ficam mais caros." Depois: "...Na verde não há nada a mais; nas outras, cada 100 kWh ficam mais caros."
- Fonte das bandeiras, antes: "Os 177 kWh por mês são a média das residências do país, calculada com dados da EPE (veja acima)." Depois: "Os 177 kWh por mês são a média das casas do país, calculada acima com dados da EPE."
- Consumo, antes: "Resultado da calculadora com os valores que já vêm nos campos: ..." Depois: "O que a calculadora mostra com os valores que já vêm nos campos: ..."
- Fonte do consumo, antes: "Cálculo do próprio WattCerto, com as fórmulas da página Sobre. A geladeira usa o consumo do selo Procel de um modelo 2 portas frost free (56,9 kWh por mês). Quer ver quanto dá para economizar trocando hábitos e aparelhos? Veja o exemplo na página inicial ou faça a conta da sua casa." Depois: "Conta do próprio WattCerto, com as regras da página Sobre. A geladeira usa o selo Procel de um modelo 2 portas frost free (56,9 kWh por mês). Para ver quanto dá para economizar, faça a conta da sua casa."

## 19/11/2026 | Sobre e Impacto | um esqueleto só para todas as seções
Motivo (pedido do usuário): as seções mudavam de alinhamento, largura e formato a cada bloco e a página parecia montada sem lógica. Regra aplicada, tirada da Home: abertura centralizada; depois dela, toda seção com o título à esquerda (linha pequena, título e uma frase) e o conteúdo à direita, separada da anterior por uma linha fina; no celular, empilha. Listas no estilo do "Como funciona" da Home (itens com linha, sem caixas). Cor forte só com propósito.

### Sobre
- Removida a caixa amarela "Calculadora de consumo" com o botão. O item virou o primeiro da lista de frentes e o botão "Abrir a calculadora" foi para a coluna do título.
  - Texto antes: "Estimativa mensal em kWh e em reais para cada aparelho cadastrado, com a participação de cada um no total da casa."
  - Texto depois: "Estimativa mensal em kWh e em reais para cada aparelho, com a parte de cada um no total da casa."
- Frase nova sob "As frentes do projeto": "Tudo parte da calculadora: os outros recursos usam o mesmo cálculo."
- "Como o cálculo é feito", antes: "Cada número do resultado sai de uma das regras abaixo, escolhida pelo jeito que o aparelho gasta energia. ..." Depois: "Cada número sai de uma regra, escolhida pelo jeito que o aparelho gasta energia. ..." (o resto igual).
- Exemplo do chuveiro: continua no painel amarelo, agora em uma coluna (regra em cima, conta embaixo).
- Frase nova sob "O que a estimativa não sabe": "É uma estimativa: chega perto da conta real quando os números são os da sua casa." Os três itens viraram lista em uma coluna.
- "Orçamento e hospedagem", antes: "Comparativo de hospedagens e domínios para publicar o site." Depois: "Três hospedagens e três domínios comparados para publicar o site."
- "Nossa escolha": tirada a tarja laranja do lado esquerdo; virou painel amarelo claro inteiro. Texto igual.
- "Equipe e instituição": saiu o cartão verde escuro; os dados ficaram em duas colunas, no mesmo esqueleto das outras seções. Linha pequena nova: "Quem fez".
- Sobra de CSS sem uso: as regras antigas de `.frente-destaque`, `.frentes`, `.ficha-projeto` e `.secao-ficha` continuam no style.css (não são mais usadas pela Sobre).

### Impacto
- A faixa verde dos números do Brasil voltou a ir de ponta a ponta, igual à faixa verde da Home (antes eu tinha feito um painel arredondado).
- "Quanto cada bandeira soma na conta" e "Onde vai a energia de uma casa típica" no mesmo esqueleto: título e frase à esquerda, tabela e fonte à direita. Textos iguais.
- Depois (a pedido): o título de cada seção (ex.: "O que o site entrega" e o botão "Abrir a calculadora") não acompanha mais a rolagem; fica no lugar dele.

## 19/11/2026 | Sobre | outras cores da marca (a pedido: "tudo menos grifado ou linha em laranja")
- Título: "WattCerto" escrito nas cores da marca (Watt em verde, Certo em laranja), como no logo.
- Ícones das frentes alternando amarelo, terracota e verde (antes todos amarelos).
- "O que a estimativa não sabe": itens numerados 1, 2, 3 na cor dourada dos passos do "Como funciona" da Home.
- "As frentes do projeto" em faixa branca (como o "Como funciona" da Home) e "Equipe e instituição" em faixa amarela clara (como o "Alguma dúvida?" da Home).
- Palavras e números que merecem destaque em laranja escuro e negrito (sem grifo): "56,9 kWh", "123,75 kWh por mês", "R$ 106,43", "Netlify, no plano Free", "20 publicações"; e "144 kWh por mês" (a conta errada da geladeira) em vermelho. Nenhum texto alterado.
- Depois (a pedido): o índice "Nesta página" saiu da abertura e foi para dentro de "O que o site entrega", na coluna do título, abaixo do botão "Abrir a calculadora", com os links um embaixo do outro. Texto igual.
- Removido do índice "Nesta página" o link "As frentes do projeto" (#frentes): o índice agora fica dentro dessa própria seção, então o link levava para onde a pessoa já está.
- Depois (a pedido): na lista "As frentes do projeto", o círculo do ícone não gira, não cresce e não muda de cor ao passar o mouse, e o desenho dentro dele não repete o movimento. Fica só a entrada, uma vez, quando a lista aparece na tela. Corrigida também a cor de fundo das bolinhas do ícone "Modo avançado" no círculo terracota.

## 19/11/2026 | Sobre | "As frentes do projeto"
- Removido (a pedido) o item "Privacidade por padrão": "Sem cadastro e sem login. O que você digita fica só no seu navegador e não é enviado para ninguém." (ícone de escudo com check, círculo terracota).
- Renomeado (a pedido): "Modo avançado" passou a se chamar "Aparelhos domésticos em detalhes". Texto do item igual.
- Depois (a pedido): em "O que a estimativa não sabe", os números 1, 2, 3 foram trocados por uma bolinha vermelha antes de cada item.
- Depois (a pedido, opção B): os ícones de "As frentes do projeto" perderam o círculo colorido; ficou só o desenho, pequeno e verde, ao lado do título.

## 19/11/2026 | Sobre | "As frentes do projeto" (a pedido)
- Removido o botão "Abrir a calculadora" (laranja com contorno verde) que ficava abaixo da frase "Tudo parte da calculadora: os outros recursos usam o mesmo cálculo."
- Removida a animação de entrada dos ícones (antes eles se desenhavam um depois do outro quando a lista aparecia na tela). Agora ficam parados. O JavaScript que ligava essa animação também saiu de js/animacoes.js; as animações da Home (números, barra da fatura, grifo) continuam.

## 19/11/2026 | Sobre | "Equipe e instituição" (a pedido)
- A faixa "Quem fez" deixou de ser amarela clara e passou a ser verde escura (mesma faixa do Impacto). Rótulos em amarelo, dados em branco. Texto igual.

## 19/11/2026 | Sobre | abertura (a pedido)
- Removida a frase abaixo do título: "O que o site faz, como ele chega em cada número, onde a estimativa pode errar e quem está por trás do projeto."

## 19/11/2026 | Sobre | "Como o cálculo é feito" e "Antes de confiar no número" (a pedido)
- Removida a frase: "Toque em uma regra para ver a fórmula."
- Removido o parágrafo sob o título "Como o cálculo é feito": "Cada número sai de uma regra, escolhida pelo jeito que o aparelho gasta energia. A conta potência × horas só vale para quem fica ligado na potência cheia: uma geladeira de 200 W contada como “ligada 24 horas” daria 144 kWh por mês, mas uma de 2 portas frost free gasta 56,9 kWh (Procel)."
- A seção "Antes de confiar no número" / "O que a estimativa não sabe" passou a ter fundo branco (antes, creme).

## 19/11/2026 | Sobre | abertura (a pedido)
- Frase nova sob o título: "Entenda quanto sua casa gasta de energia, sem precisar entender termos técnicos." (no lugar da frase removida mais cedo).

## 19/11/2026 | Sobre | título de "Antes de confiar no número" (a pedido)
- Antes: "O que a estimativa não sabe". Depois: "O que a estimativa não sabe?" (pergunta, como os títulos da Home). O link do índice "Nesta página" continua "O que a estimativa não sabe", sem "?".

## 19/11/2026 | Sobre | cor das frases em cima dos títulos (a pedido, opção A)
- As frases pequenas em cima dos títulos passaram de verde para laranja escurecido (#b34c08): "Sobre o projeto", "O que o site entrega", "Transparência", "Antes de confiar no número", "Publicação do site". Na faixa verde escura, "Quem fez" continua amarela. Nenhum texto alterado. As outras páginas ficaram como estavam.

## 19/11/2026 | Sobre e Impacto | grifo verde nos títulos das seções (a pedido)
- Os títulos das seções claras ("As frentes do projeto", "Como o cálculo é feito", "O que a estimativa não sabe?", "Orçamento e hospedagem", "Quanto cada bandeira soma na conta", "Onde vai a energia de uma casa típica") ganharam grifo verde escuro embaixo da letra. O título do topo da página e o título da faixa verde escura ("Equipe e instituição") ficaram sem grifo. Nenhum texto alterado.

## 19/11/2026 | Sobre e Impacto | grifo verde nos títulos das seções (a pedido, removido)
- O grifo verde escuro dos títulos das seções foi removido logo depois de aplicado. Os títulos voltaram a ficar sem grifo e com o espaço entre linhas de antes.

## 19/11/2026 | Acessibilidade | frase em cima do título (a pedido)
- Antes: "Em primeiro lugar". Depois: "Acessibilidade".

## 19/11/2026 | Impacto | faixa verde dos números do Brasil (a pedido)
- A faixa verde ("A casa brasileira em números") passou a usar o mesmo esqueleto das outras seções: à esquerda a frase pequena, o título, o número "31,7%" e a legenda; à direita o gráfico "De cada 100 kWh consumidos no Brasil". Antes eram duas colunas centralizadas, com bordas diferentes das demais seções. A faixa continua verde escura e de ponta a ponta. Nenhum texto alterado. A Home não mudou.

## 19/11/2026 | Impacto | título da faixa verde (a pedido)
- Antes: "Quase um terço da eletricidade do país vai para as casas". Depois: "A conta de casa impacta também o Brasil". A frase "quase um terço" continua dita pelo número "31,7%" e pela legenda logo abaixo.

## 19/11/2026 | Impacto | números do Brasil (a pedido: "mt grosseiro no começo da página")
- A faixa verde escura (de ponta a ponta) logo abaixo da abertura deixou de existir. As mesmas informações ficaram no mesmo lugar, agora numa seção clara (fundo branco) no mesmo esqueleto das outras: à esquerda a frase pequena, o título, o "31,7%" (em laranja escurecido) e a legenda; à direita o gráfico, num cartão claro com barra verde para "Indústria, comércio e outros setores" e barra laranja para "Residências". Nenhum texto alterado.

## 19/11/2026 | Impacto | fundos alternados (a pedido: "o verde dentro da caixa estava bom ... e vice versa nos próximos")
- "A casa brasileira em números": fundo branco; o cartão do gráfico voltou a ser verde escuro (com texto claro, barra verde-clara e barra amarela, como era).
- "Quanto cada bandeira soma na conta": passou a ter fundo verde escuro, com a tabela em cartão claro.
- "Onde vai a energia de uma casa típica": fundo branco, tabela em cartão claro.
- Nenhum texto alterado.

## 19/11/2026 | Impacto | título do topo (a pedido)
- "Quanto a energia de casa pesa no país e na conta" agora ocupa uma linha só, até onde couber; em telas estreitas quebra em mais linhas. Antes era sempre em duas linhas, equilibradas. Texto igual. A frase de apoio embaixo continua com largura de leitura.

## 22/11/2026 | Acessibilidade, Calculadora, Galeria, Impacto e Notícias | frase em cima dos títulos (a pedido)
- As frases pequenas em cima dos títulos passaram de verde para laranja escurecido (#b34c08), como na Sobre: "Acessibilidade", "Calculadora", "Galeria", "Mídia" (Galeria), "Impacto", "A casa brasileira em números", "Consumo" e "Últimas notícias". "Tarifas", na faixa verde escura do Impacto, continua amarela (contraste). Nenhum texto alterado. A Home ficou como estava.

## 22/11/2026 | Sobre | frase de abertura (a pedido, com revisão)
- Antes: "Entenda quanto sua casa gasta de energia, sem precisar entender termos técnicos."
- Pedido: "Entenda onde sua casa gera gasto de energia e consiga economizar, sem precisar entender termos técnicos."
- Depois (revisado): "Entenda onde sua casa mais gasta energia e como economizar, sem precisar saber termos técnicos." (tirei "gera gasto de energia", que ficava pesado, e a repetição de "entender".)

## 22/11/2026 | Várias páginas | correções do validador W3C (sem mudança de texto visível)
- Validador oficial (vnu, o mesmo do W3C) rodado nos arquivos das 10 páginas: 15 erros, agora 0.
- Faixa de páginas ("reel") de Acessibilidade, Calculadora, Galeria, Impacto, Notícias e Sobre: ganhou role="group", porque aria-label não vale em div sem papel.
- Calculadora: o aviso "A calculadora precisa de JavaScript" (só aparece sem JavaScript) passou de h3 para h2, para não pular nível de título.
- Sobre, "Como o site calcula": os seis nomes de regra ("Por hora" e as outras) deixaram de ser h3 dentro de span (inválido) e viraram span com role="heading" aria-level="3". Mesma aparência e mesmo nível para leitor de tela.
- Contato: "netlify-honeypot" virou "data-netlify-honeypot" (forma válida em HTML5).
- Observação: o erro "Stray start tag script" que aparece ao validar o endereço do Netlify vem de um script que o próprio Netlify injeta depois do </html>. Não está nos nossos arquivos.

## 22/11/2026 | Contato | mensagem depois de enviar (site fora do Netlify)
- Novo texto, só quando o site não está no Netlify (Railway): "Tudo certo com os dados. Esta versão do site confere o formulário, mas não envia a mensagem para um servidor."
- No Netlify, nada mudou: a mensagem continua sendo enviada e o texto de sucesso é o mesmo.

## 22/11/2026 | Menu e rodapé | 10 páginas interligadas (A06)
- Menu principal e rodapé de todas as páginas ganharam "Mídia" e "Orçamento". Antes o menu tinha 8 itens e o rodapé 7; a Mídia e o Orçamento só eram alcançados por link direto.

## 22/11/2026 | Orçamento e Sobre | orçamento completo na página própria (A06)
- A comparação de hospedagens e domínios saiu da Sobre (seção "Orçamento e hospedagem" e o item "Orçamento e hospedagem" do "Nesta página") e foi para a página orcamento_hospedagem.html, que antes era só um aviso com link para a Sobre.
- Texto que saiu da página Orçamento: "O comparativo de três hospedagens e três domínios, com preços e a escolha da equipe, fica na página Sobre." e "O site está no Netlify, no plano Free, porque é feito só de páginas prontas e não precisa de servidor. Para o domínio, a sugestão é o .com.br no Registro.br." e o botão "Ver o orçamento completo".
- Linha do Railway na tabela, antes: "Teste grátis com US$ 5 de crédito; plano Hobby a US$ 5 por mês" / "US$ 5 de uso incluídos por mês no Hobby; publica direto do GitHub" / "Cobra pelo uso que passar do incluído". Agora: "Plano Free: US$ 1 de uso por mês. Teste: US$ 5 de crédito, uma vez só. Hobby: US$ 5 por mês" / "Publica sozinho a cada mudança no GitHub; endereço com HTTPS" / "Cobra pelo uso; quando o crédito acaba, o site para" (fonte: docs.railway.com, planos).
- "Nossa escolha" saiu (texto do Netlify, os três parágrafos) e entrou "Por que o Railway": Railway como hospedagem final, custo, Netlify como plano B e domínio. A frase do Registro.br foi mantida.

## 22/11/2026 | Contato | equipe, dados fictícios e novos campos (A06)
- Nada saiu. Entrou na coluna da esquerda: "Quem responde" (os cinco integrantes e a parte de cada um, conforme a divisão de funções do README), e-mail "contato@wattcerto.example", telefone "(11) 0000-0000", endereço da Fatec São Caetano do Sul e o aviso "E-mail e telefone são fictícios: o projeto é acadêmico. Para falar com a equipe, use o formulário."
- Entraram no formulário três campos opcionais: Telefone (tel, com pattern), Pessoas na casa (number, 1 a 20) e Data da última conta de luz (date, não aceita data futura).
- Meta description, antes: "Formulário para falar com a equipe do projeto." Agora: "Fale com a equipe do WattCerto: formulário de contato e quem cuida de cada parte do site."

## 22/11/2026 | Mídia | página completa (A06)
- Saiu o aviso de página em construção: "Página em construção", "Entrega parcial (MVP)", "Esta página já faz parte do mapa do site e do menu principal. O conteúdo completo será desenvolvido na entrega final do projeto." e o botão "Voltar ao início".
- Entrou: abertura "Para ver e ouvir"; o vídeo da calculadora (o mesmo da Galeria, que continua lá); um áudio de 45 segundos com três dicas de economia (voz gerada pelo Piper, voz "faber", licença CC0), com o texto completo; e a lista oficial de vídeos da ANEEL sobre consumo consciente num iframe do YouTube sem cookies.
- _headers: a Content-Security-Policy passou a permitir quadros só de www.youtube-nocookie.com (antes nenhum quadro de fora era permitido).

## 22/11/2026 | Acessibilidade | cartão "Surdez e baixa audição"
- Antes: "Nada no site depende de som. O único vídeo, na Galeria, é sem som e vem com a descrição escrita do que acontece nele. Por isso não precisa de legenda."
- Agora: "Nada no site depende só de som. O vídeo da calculadora, na Galeria e na Mídia, é sem som e vem com a descrição escrita do que acontece nele. O áudio de dicas, na Mídia, tem o texto completo logo abaixo." (o texto antigo deixou de ser verdade quando entrou o áudio)

## 22/11/2026 | Projetos | página nova (A06, lista de páginas)
- Nada saiu. Página nova projetos.html, "Projetos que ajudam a pagar menos luz": Tarifa Social de Energia Elétrica (Lei nº 15.235/2025), troca de geladeira de graça da Enel São Paulo (Programa de Eficiência Energética da ANEEL), Procel e Selo Procel (23,91 bilhões de kWh evitados em 2023, MME) e o próprio WattCerto. Cada um com fonte.
- Menu e rodapé de todas as páginas ganharam "Projetos", depois de "Sobre". O site passou a ter 11 páginas.

## 22/11/2026 | Mídia | áudio gravado pela equipe
- O áudio gerado por computador foi trocado pela gravação de Henrique Folhasi (mesmo arquivo: audio/dicas-economia.mp3; 53 s, volume normalizado).
- Legenda, antes: "Dicas de economia de energia, 45 segundos. Voz gerada por computador (Piper, voz "faber", licença CC0)." Agora: "Dicas de economia de energia, 53 segundos. Gravado por Henrique Folhasi, da equipe do WattCerto."
- Transcrição ajustada ao que foi dito: "Três dicas rápidas" virou "E aqui vão três dicas rápidas"; "Primeira:", "Segunda:" e "Terceira:" viraram "Primeira dica:", "Segunda dica:" e "Terceira dica:".

## 22/11/2026 | Mídia | legenda do áudio (a pedido)
- Antes: "Dicas de economia de energia, 53 segundos. Gravado por Henrique Folhasi, da equipe do WattCerto." Agora: "Dicas de economia de energia, 53 segundos."

## 22/11/2026 | Contato | equipe só com nomes e formulário como antes (a pedido)
- Título "Quem responde" virou "Equipe WattCerto". Saiu a parte de cada um: "Página inicial, visual do site e CSS" (Henrique Folhasi), "Sobre e Calculadora" (Guilherme Cerqueira), "Impacto e Galeria" (João Pedro), "Mídia, Notícias e documentação" (Miguel Essien) e "Contato, hospedagem e publicação" (Pedro Accorsi). Ficaram os cinco nomes.
- Saíram do formulário os campos Telefone (tel), Pessoas na casa (number) e Data da última conta de luz (date), com as dicas "Opcional. DDD e número.", "Opcional. De 1 a 20." e "Opcional. Ajuda quando a dúvida é sobre uma conta específica." O formulário voltou a ter nome, e-mail, assunto, mensagem e consentimento.
- Atenção registrada: a rubrica da A06 (critério 4) cita tel, date e number.

## 22/11/2026 | Galeria | imagens reais no lugar dos quadros cinza (A06: "imagens com legendas e fontes")
- Saíram os 15 quadros cinza (rascunho, sem imagem e sem texto).
- Entraram 7 imagens, cada uma com legenda e fonte: 4 telas da calculadora (resultado, simular troca, chuveiro em detalhe e primeiro passo), capturadas pela equipe, e as 3 fotos que já estavam nas Notícias (linhas de transmissão, de jplenio no Pixabay; lâmpadas, de analogicus no Pixabay; torre de transmissão, do Pexels). A grade, a animação ao rolar e o desfoque das bordas continuam iguais.

## 23/11/2026 | Home → Calculadora | animação do botão "Simular meu consumo"
- Nada saiu. Entrou uma cortina de chegada na Calculadora, só para quem clica em "Simular meu consumo" na Home: o botão cresce até cobrir a tela (fundo bege), o check laranja da marca se desenha, aparece "Calculadora" (texto decorativo, escondido de leitor de tela) e a cortina sobe. Quem chega pelo menu ou pede menos movimento não vê a cortina.
- Atualização (23/11): a cortina bege com o check e o texto "Calculadora" saiu. No lugar: ao clicar, a seta do botão vira o check da marca e a Calculadora se espalha num círculo de borda macia que nasce no botão. Nenhum texto novo.
- Atualização (23/11, versão final da animação): saíram o check no botão e o círculo que se espalhava. Ficou uma troca discreta: o topo do site fica parado, o conteúdo da Home sobe um pouco e some, e o da Calculadora entra subindo de leve (cerca de meio segundo). O botão não muda.

## 23/11/2026 | Calculadora | topo só com o título e dica de "Seus aparelhos" mais curta (a pedido)
- Saiu, abaixo do título "Calcule o consumo da sua casa": "Diga quantas pessoas moram na casa e quais aparelhos você usa. Você vê quanto cada um gasta, quem pesa mais na conta e quanto economiza trocando um aparelho."
- Saiu a nota: "Os campos já vêm com valores de partida: troque pelos da etiqueta e pelo seu uso (de onde vem cada número). Tudo é calculado no seu navegador, nada é enviado." (o link "de onde vem cada número" levava a sobre.html#como-calcula)
- Saiu do fim da dica do bloco "2. Seus aparelhos": "Cada um é calculado pela regra que combina com o jeito que ele gasta energia."

## 23/11/2026 | Calculadora | "Banhos por pessoa por dia" só aceita número inteiro
- Antes o campo aceitava frações (0,25 em 0,25). Agora vai de 1 a 10, de 1 em 1, com teclado numérico no celular; se a pessoa digitar 1,5, o campo e a conta passam a usar 2. Nenhum texto mudou.

## Calculadora: botão "Voltar aos valores iniciais"

- Mudou só o estilo: em repouso fica cinza opaco (fundo, borda e texto cinzas); o verde clarinho aparece apenas com o mouse por cima ou com o foco do teclado. Nenhum texto foi removido.
