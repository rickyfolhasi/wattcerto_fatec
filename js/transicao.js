/* WattCerto: ponto de origem da transição "Simular meu consumo".
   O js/menu.js, na Home, guarda o centro do botão clicado; aqui, antes de a
   calculadora aparecer (sem defer), esse ponto vira --vt-x e --vt-y no <html>,
   e o CSS faz a página nova se espalhar a partir dele. */
(function () {
  "use strict";
  try {
    var guardado = window.sessionStorage.getItem("wattcerto-simular");
    if (guardado) {
      window.sessionStorage.removeItem("wattcerto-simular");
      var origem = JSON.parse(guardado);
      var raiz = document.documentElement;
      if (/^\d{1,3}(\.\d)?%$/.test(origem.x) && /^\d{1,3}(\.\d)?%$/.test(origem.y)) {
        raiz.style.setProperty("--vt-x", origem.x);
        raiz.style.setProperty("--vt-y", origem.y);
      }
    }
  } catch (erro) {
    /* Sem sessionStorage ou dado estranho: o círculo nasce no centro. */
  }
})();
