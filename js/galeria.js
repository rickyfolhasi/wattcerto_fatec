/* Galeria: desfoque progressivo nas bordas da tela enquanto a galeria passa (Gradual Blur, versão simples).
   A galeria rola junto com a página, sem caixa própria. O CSS faz o desfoque. Este
   arquivo só cria as camadas e, enquanto a página rola, mede quanta galeria ainda
   existe acima e abaixo da tela, para o desfoque de cima só aparecer depois que a
   galeria começou a subir e o de baixo sumir quando ela termina.
   Sem JavaScript, a galeria continua igual, só sem o desfoque. */
(function () {
  "use strict";

  var CAMADAS = 8;

  function limitar(valor) {
    return Math.min(Math.max(valor, 0), 1);
  }

  /* Uma âncora de altura zero que gruda no topo ou no pé da tela (sticky, no CSS),
     com a borda desfocada dentro. */
  function criarBorda(classe) {
    var ancora = document.createElement("div");
    ancora.className = "gradual-blur-ancora " + classe;
    ancora.setAttribute("aria-hidden", "true");
    var borda = document.createElement("div");
    borda.className = "gradual-blur";
    for (var i = 0; i < CAMADAS; i++) {
      borda.appendChild(document.createElement("span"));
    }
    var cor = document.createElement("span");
    cor.className = "gradual-blur-cor";
    borda.appendChild(cor);
    ancora.appendChild(borda);
    return { ancora: ancora, borda: borda };
  }

  Array.prototype.forEach.call(document.querySelectorAll(".galeria-janela"), function (janela) {
    var topo = criarBorda("gradual-blur-topo");
    var base = criarBorda("gradual-blur-base");
    janela.insertBefore(topo.ancora, janela.firstChild);
    janela.appendChild(base.ancora);

    var esperando = false;

    function atualizar() {
      esperando = false;
      var caixa = janela.getBoundingClientRect();
      var alcance = Math.max(topo.borda.getBoundingClientRect().height, 1);
      /* Em cima: só depois que a galeria começou a subir, e some quando o fim dela chega ao topo.
         Embaixo: some quando o fim da galeria entra na tela, e só aparece depois que o começo dela entrou. */
      var acima = Math.min(-caixa.top, caixa.bottom);
      var abaixo = Math.min(caixa.bottom - window.innerHeight, window.innerHeight - caixa.top);
      topo.borda.style.setProperty("--gradual-blur-reveal", limitar(acima / alcance).toFixed(3));
      base.borda.style.setProperty("--gradual-blur-reveal", limitar(abaixo / alcance).toFixed(3));
    }

    function agendar() {
      if (!esperando) {
        esperando = true;
        window.requestAnimationFrame(atualizar);
      }
    }

    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
  });
})();
