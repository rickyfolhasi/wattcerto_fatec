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
