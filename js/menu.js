/* Watt Certo: menu responsivo (melhoria progressiva).
   Sem JavaScript, a navegação continua visível e funcional. */
(function () {
  "use strict";

  var botao = document.querySelector(".menu-toggle");
  var lista = document.getElementById("menu-principal");

  if (!botao || !lista) {
    return;
  }

  document.documentElement.classList.add("js");
  botao.setAttribute("aria-expanded", "false");

  function alternar(abrir) {
    lista.classList.toggle("is-open", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
  }

  botao.addEventListener("click", function () {
    alternar(botao.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      alternar(false);
      botao.focus();
    }
  });
})();
