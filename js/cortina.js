/* WattCerto: cortina de chegada na calculadora.
   Quem clicou em "Simular meu consumo" na Home chega com uma cortina laranja
   escrita "Calculadora" que sobe e revela a página. Roda antes de a página
   aparecer (sem defer), para a cortina já estar lá no primeiro quadro.
   Quem chega por outro caminho, ou pede menos movimento, não vê cortina. */
(function () {
  "use strict";
  try {
    if (window.sessionStorage.getItem("wattcerto-simular") === "1") {
      window.sessionStorage.removeItem("wattcerto-simular");
      var menos = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!menos) {
        document.documentElement.classList.add("vindo-de-simular");
      }
    }
  } catch (erro) {
    /* Sem sessionStorage (janela anônima bloqueada): a página abre normal. */
  }
})();
