/* WattCerto: abertura animada da marca (melhoria progressiva).
   Na página inicial, "Watt" aparece escrito, um check laranja é riscado logo
   depois dele, se transforma na letra C e dele sai "erto": WattCerto.

   Este arquivo é carregado no <head>, sem defer, para a abertura já estar
   ligada antes da primeira pintura da página (senão a Home piscaria antes).
   A animação em si é só CSS; aqui só decidimos SE ela aparece, QUANDO começa
   e como pular.

   Classes no <html>:
     intro-on     mostra a abertura (celular: fundo liso por cima da Home;
                  tela larga: a animação acontece no logo do topo)
     intro-vai    dá a partida na animação, assim que a fonte dos títulos carrega
     intro-fim    a animação do logo terminou (só importa em tela larga)
     intro-pular  a pessoa pulou a abertura

   Não aparece quando:
   - a pessoa pede menos movimento (prefers-reduced-motion);
   - ela já viu a abertura nesta sessão do navegador;
   - o JavaScript está desligado (a marcação fica escondida por padrão).
   Qualquer clique, toque ou tecla pula a abertura.

   Para rever a abertura sem fechar o navegador: acrescente #intro ao endereço
   da Home (index.html#intro) e recarregue. Isso ignora só o "já viu"; quem pede
   menos movimento continua sem a animação. */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var CHAVE = "wattcerto-intro-vista";

  function jaViu() {
    try {
      return window.sessionStorage.getItem(CHAVE) === "1";
    } catch (erro) {
      return false; /* sem armazenamento, a abertura aparece de novo: não é grave */
    }
  }

  function marcarComoVista() {
    try {
      window.sessionStorage.setItem(CHAVE, "1");
    } catch (erro) {
      /* sem armazenamento: segue sem lembrar */
    }
  }

  function menosMovimento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  var reverDeNovo = window.location.hash === "#intro";

  if (menosMovimento() || (jaViu() && !reverDeNovo)) {
    return;
  }

  raiz.classList.add("intro-on");
  marcarComoVista();

  /* A partida espera a fonte Fraunces: sem ela, "Watt" apareceria com outra
     letra e trocaria no meio da animação. Se a fonte demorar ou falhar, a
     animação começa mesmo assim depois de 0,9 segundo. */
  var comecou = false;

  function comecar() {
    if (!comecou) {
      comecou = true;
      raiz.classList.add("intro-vai");
    }
  }

  if (document.fonts && document.fonts.load) {
    document.fonts.load('700 1em "Fraunces"').then(comecar, comecar);
  }
  window.setTimeout(comecar, 900);

  /* Em tela larga a abertura acontece no logo do topo: quando "erto" termina
     de aparecer, o logo de verdade assume (classe intro-fim). Se algo falhar,
     um tempo limite garante que o logo nunca fique escondido. */
  function terminou() {
    raiz.classList.add("intro-fim");
    document.removeEventListener("animationend", aoTerminarAnimacao);
  }

  function aoTerminarAnimacao(evento) {
    var alvo = evento.target;
    if (alvo && alvo.classList && alvo.classList.contains("intro-erto") && alvo.closest(".brand-intro")) {
      terminou();
    }
  }

  document.addEventListener("animationend", aoTerminarAnimacao);
  window.setTimeout(terminou, 5000);

  function pular() {
    raiz.classList.add("intro-pular");
    document.removeEventListener("click", pular);
    document.removeEventListener("keydown", pular);
    document.removeEventListener("touchstart", pular);
  }

  document.addEventListener("click", pular);
  document.addEventListener("keydown", pular);
  document.addEventListener("touchstart", pular, { passive: true });
})();
