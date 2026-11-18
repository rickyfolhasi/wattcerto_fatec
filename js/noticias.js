/* Notícias: clique em qualquer parte do cartão abre o cartão ampliado por cima da página,
   com o fundo escurecido. Usa o <dialog> do HTML: o Esc fecha, o foco fica preso na janela e volta
   para o cartão ao fechar. Sem JavaScript, o texto completo já aparece dentro de cada cartão. */
(function () {
  "use strict";

  var cartoes = document.querySelectorAll(".noticias-grade .noticia");
  if (!cartoes.length || typeof HTMLDialogElement === "undefined") {
    return;
  }

  var dialogo = document.createElement("dialog");
  dialogo.className = "noticia-dialogo";
  dialogo.tabIndex = -1;
  document.body.appendChild(dialogo);

  var origem = null;

  function abrir(cartao) {
    var conteudo = cartao.cloneNode(true);
    /* Dentro da janela aberta a foto fica larga: avisa o navegador para escolher a versão certa. */
    Array.prototype.forEach.call(conteudo.querySelectorAll("img[sizes]"), function (foto) {
      foto.setAttribute("sizes", "(max-width: 42rem) 100vw, 40rem");
    });
    var botao = conteudo.querySelector(".noticia-abrir");
    if (botao) {
      botao.parentNode.removeChild(botao);
    }
    var tituloClone = conteudo.querySelector("h2");
    if (tituloClone) {
      tituloClone.id = "titulo-noticia-aberta";
      dialogo.setAttribute("aria-labelledby", "titulo-noticia-aberta");
    }

    dialogo.textContent = "";
    var topo = document.createElement("div");
    topo.className = "noticia-dialogo-topo";
    var fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "noticia-fechar";
    fechar.innerHTML =
      '<span class="noticia-fechar-texto">Fechar</span><span class="noticia-fechar-bola" aria-hidden="true"><svg class="icon" width="14" height="14" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span>';
    fechar.addEventListener("click", function () {
      dialogo.close();
    });
    topo.appendChild(fechar);
    dialogo.appendChild(topo);
    dialogo.appendChild(conteudo);

    origem = cartao;
    dialogo.showModal();

    /* O cartão ampliado nasce na posição do cartão clicado e cresce até o centro. */
    var caixa = cartao.getBoundingClientRect();
    var alvo = dialogo.getBoundingClientRect();
    dialogo.style.setProperty("--origem-x", caixa.left + caixa.width / 2 - alvo.left + "px");
    dialogo.style.setProperty("--origem-y", caixa.top + caixa.height / 2 - alvo.top + "px");
    dialogo.scrollTop = 0;
    /* O foco começa na própria janela (sem anel sobre o botão); o Tab leva ao "Fechar" e aos links. */
    dialogo.focus();
  }

  Array.prototype.forEach.call(cartoes, function (cartao) {
    cartao.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) {
        return;
      }
      abrir(cartao);
    });
  });

  /* Clique no fundo escurecido (fora do cartão ampliado) fecha. */
  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });

  dialogo.addEventListener("close", function () {
    if (origem) {
      var botao = origem.querySelector(".noticia-abrir");
      (botao || origem).focus();
      origem = null;
    }
  });
})();
