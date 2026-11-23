/* WattCerto: menu responsivo (melhoria progressiva).
   Sem JavaScript, a navegação continua visível e funcional.

   O que este arquivo faz:
   1. abre e fecha o menu no celular (o painel desce e sobe pelo CSS);
   2. desenha o destaque da página atual como uma pílula só (classe
      "tem-indicador") e, ao tocar em outra página, desliza essa pílula até
      ela antes de abrir a página nova. */
(function () {
  "use strict";

  var botao = document.querySelector(".menu-toggle");
  var lista = document.getElementById("menu-principal");

  if (!botao || !lista) {
    return;
  }

  var painel = lista.parentElement;
  var menosMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var atual = lista.querySelector('a[aria-current="page"]');
  var TEMPO_TROCA = 280;

  document.documentElement.classList.add("js");
  botao.setAttribute("aria-expanded", "false");

  /* Cada nome do menu ganha um <span> que guarda a largura do nome em
     negrito: assim, quando o negrito passa de um item para outro, nada pula. */
  Array.prototype.forEach.call(lista.querySelectorAll("a"), function (link) {
    var texto = document.createElement("span");
    texto.className = "nav-texto";
    texto.setAttribute("data-texto", link.textContent.trim());
    while (link.firstChild) {
      texto.appendChild(link.firstChild);
    }
    link.appendChild(texto);
  });

  /* ---------- Pílula que marca a página atual ---------- */
  function posicionar(link, semAnimar) {
    if (!link) {
      return;
    }
    if (semAnimar) {
      lista.classList.add("sem-transicao");
    }
    /* Soma as distâncias até a lista: durante a entrada animada dos itens, o
       item (li) vira a referência de offsetTop do link. */
    var x = 0;
    var y = 0;
    var el = link;
    while (el && el !== lista) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    lista.style.setProperty("--ind-x", x + "px");
    lista.style.setProperty("--ind-y", y + "px");
    lista.style.setProperty("--ind-l", link.offsetWidth + "px");
    lista.style.setProperty("--ind-a", link.offsetHeight + "px");
    if (semAnimar) {
      void lista.offsetWidth;
      lista.classList.remove("sem-transicao");
    }
  }

  if (atual) {
    lista.classList.add("tem-indicador");
    posicionar(atual, true);
    /* A largura dos nomes muda quando a fonte termina de carregar: remede. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (!lista.classList.contains("trocando")) {
          posicionar(atual, true);
        }
      });
    }
    window.addEventListener("load", function () {
      if (!lista.classList.contains("trocando")) {
        posicionar(atual, true);
      }
    });
  }

  window.addEventListener("resize", function () {
    posicionar(lista.querySelector("a.alvo") || atual, true);
  });

  /* Voltando pelo botão do navegador, a página pode vir da memória: desfaz a troca. */
  window.addEventListener("pageshow", function (evento) {
    if (evento.persisted) {
      lista.classList.remove("trocando");
      var alvo = lista.querySelector("a.alvo");
      if (alvo) {
        alvo.classList.remove("alvo");
      }
      if (!atual) {
        lista.classList.remove("tem-indicador");
      }
      posicionar(atual, true);
    }
  });

  lista.addEventListener("click", function (evento) {
    var link = evento.target.closest ? evento.target.closest("a") : null;

    if (!link || link === atual || menosMovimento || evento.defaultPrevented ||
        evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return;
    }

    evento.preventDefault();

    /* Na Home nenhum item está marcado: a pílula nasce no item tocado. */
    if (!atual) {
      posicionar(link, true);
      lista.classList.add("tem-indicador", "surgindo");
    } else {
      posicionar(link);
    }

    lista.classList.add("trocando");
    link.classList.add("alvo");

    window.setTimeout(function () {
      window.location.href = link.href;
    }, TEMPO_TROCA);
  });

  /* ---------- Abrir e fechar no celular ---------- */
  var rolagemAoAbrir = 0;

  function aberto() {
    return botao.getAttribute("aria-expanded") === "true";
  }

  function alternar(abrir) {
    lista.classList.toggle("is-open", abrir);
    painel.classList.toggle("aberto", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    if (abrir) {
      rolagemAoAbrir = window.scrollY;
      posicionar(atual, true);
    }
  }

  /* Rolar a página fecha o menu. Uma folga pequena evita fechar com um tremor do dedo, e quem
     navega pelo teclado dentro do menu não perde o menu se a página andar um pouco. */
  window.addEventListener("scroll", function () {
    if (aberto() && !lista.contains(document.activeElement) &&
        Math.abs(window.scrollY - rolagemAoAbrir) > 24) {
      alternar(false);
    }
  }, { passive: true });

  /* Saindo do menu com o Tab, ele fecha: assim o painel não fica por cima do que recebe o foco. */
  document.addEventListener("focusin", function (evento) {
    if (aberto() && !botao.contains(evento.target) && !lista.contains(evento.target)) {
      alternar(false);
    }
  });

  botao.addEventListener("click", function () {
    alternar(botao.getAttribute("aria-expanded") !== "true");
  });

  /* Clique fora do menu aberto fecha o menu. */
  document.addEventListener("click", function (evento) {
    if (botao.getAttribute("aria-expanded") === "true" &&
        !botao.contains(evento.target) && !lista.contains(evento.target)) {
      alternar(false);
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      alternar(false);
      botao.focus();
    }
  });
})();

/* Animação de "Simular meu consumo" até a calculadora (View Transition entre
   páginas): a seta do botão vira o check da marca e a calculadora se espalha
   num círculo que nasce no botão (o CSS está no fim do style.css; o ponto de
   origem chega à calculadora pelo js/transicao.js).
   Só esse caminho anima; o menu e os outros links trocam de página como sempre.
   Navegador sem suporte (Firefox) ou "reduzir movimento" ligado: troca normal. */
(function () {
  "use strict";

  var MARCA = "vt-simular";
  var ESPERA_CHECK = 380;
  var menos = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temTransicao = "onpageswap" in window;

  function limpar() {
    var marcado = document.querySelector("." + MARCA);
    if (marcado) {
      marcado.classList.remove(MARCA, "confirmando");
    }
  }

  function colocarCheck(link) {
    if (link.querySelector(".vt-check-botao")) {
      return;
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon vt-check-botao");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    var risco = document.createElementNS("http://www.w3.org/2000/svg", "path");
    risco.setAttribute("d", "M5 12.5l4.5 4.5L19 7.5");
    svg.appendChild(risco);
    link.appendChild(svg);
  }

  document.addEventListener("click", function (evento) {
    var link = evento.target.closest && evento.target.closest('a.btn-destaque[href="calculadora.html"]');
    if (!link || menos || !temTransicao || evento.defaultPrevented ||
        evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
      return;
    }
    evento.preventDefault();
    limpar();

    /* De onde o círculo nasce: o centro do botão, em % da tela. */
    var r = link.getBoundingClientRect();
    var origem = {
      x: ((r.left + r.width / 2) / window.innerWidth * 100).toFixed(1) + "%",
      y: ((r.top + r.height / 2) / window.innerHeight * 100).toFixed(1) + "%"
    };
    try {
      window.sessionStorage.setItem("wattcerto-simular", JSON.stringify(origem));
    } catch (erro) {
      /* Sem sessionStorage: o círculo nasce no centro da tela. */
    }

    colocarCheck(link);
    link.classList.add(MARCA, "confirmando");
    window.setTimeout(function () {
      window.location.href = link.href;
    }, ESPERA_CHECK);
  });

  window.addEventListener("pageswap", function (evento) {
    if (!evento.viewTransition) {
      return;
    }
    var destino = evento.activation && evento.activation.entry ? evento.activation.entry.url : "";
    if (!document.querySelector("." + MARCA) || !/calculadora\.html/.test(destino)) {
      evento.viewTransition.skipTransition();
    }
  });

  /* Voltando para a Home pelo botão do navegador, o botão volta ao normal. */
  window.addEventListener("pageshow", limpar);
})();
