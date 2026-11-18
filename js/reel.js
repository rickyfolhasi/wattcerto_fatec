/* Elastic Reel (versão estática): fatias que se abrem em imagens.
   Mouse e teclado abrem a fatia; no toque, o primeiro toque abre e o segundo abre a página. */
(function () {
  var reel = document.querySelector(".reel");
  if (!reel) return;

  var itens = Array.prototype.slice.call(reel.querySelectorAll(".reel-item"));
  /* A página seguinte à atual, na ordem do menu, é a que começa aberta (marcada com data-proxima no HTML). */
  var proxima = reel.querySelector(".reel-item[data-proxima]");
  var estavaAberto = false;
  var toque = false;

  function abrir(item) {
    itens.forEach(function (outro) {
      outro.classList.toggle("aberto", outro === item);
    });
  }

  /* Telas largas (fatias na horizontal): o cartão da página seguinte ("Veja mais") já começa aberto.
     Telas pequenas (linhas empilhadas): tudo começa fechado, em linhas finas. */
  var horizontal = window.matchMedia("(min-width: 52.01rem)");

  function estadoInicial() {
    var algumAberto = itens.some(function (item) {
      return item.classList.contains("aberto");
    });
    if (horizontal.matches) {
      if (!algumAberto) abrir(proxima || itens[0]);
    } else {
      abrir(null);
    }
  }

  estadoInicial();
  if (horizontal.addEventListener) {
    horizontal.addEventListener("change", estadoInicial);
  } else if (horizontal.addListener) {
    horizontal.addListener(estadoInicial);
  }

  itens.forEach(function (item) {
    item.addEventListener("pointerdown", function (evento) {
      toque = evento.pointerType !== "mouse";
      estavaAberto = item.classList.contains("aberto");
    });
    item.addEventListener("mouseenter", function () {
      abrir(item);
    });
    item.addEventListener("focus", function () {
      abrir(item);
    });
    item.addEventListener("click", function (evento) {
      if (toque && !estavaAberto) {
        evento.preventDefault();
        abrir(item);
      }
      toque = false;
    });
  });
})();
