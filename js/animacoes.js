/* WattCerto: animações da Home (melhoria progressiva).

   O movimento em si é CSS. Este arquivo faz só o que CSS não faz:
   1. nas seções com números em destaque ([data-conta]), faz cada número
      crescer de 0 até o valor quando a seção aparece na tela;
   2. avisa quando a barra da fatura apareceu, para ela crescer e esquentar.

   Sem JavaScript, ou para quem pede menos movimento, nada se mexe e o número
   já está escrito no HTML. */
(function () {
  "use strict";

  var raiz = document.documentElement;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  /* ---------- Barra da fatura ("Por que isso importa?") ----------
     A barra espera vazia e, quando aparece na tela, a parte do chuveiro cresce
     de amarelo claro até vermelho (o movimento está no CSS). */
  var barra = document.querySelector(".fatura-barra");

  if (barra && "IntersectionObserver" in window) {
    barra.classList.add("fatura-espera");
    var vigiaBarra = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            barra.classList.add("encher");
            vigiaBarra.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    vigiaBarra.observe(barra);
  }

  /* ---------- Números em destaque crescendo quando a seção aparece ---------- */
  var contadores = document.querySelectorAll("[data-conta]");

  if (contadores.length && "IntersectionObserver" in window) {
    var formatar = function (valor, casas) {
      try {
        return valor.toLocaleString("pt-BR", {
          minimumFractionDigits: casas,
          maximumFractionDigits: casas
        });
      } catch (erro) {
        return String(valor.toFixed(casas)).replace(".", ",");
      }
    };

    var secoes = [];
    var DUR = 2000;

    Array.prototype.forEach.call(contadores, function (el) {
      var secao = el.closest("section");
      if (secoes.indexOf(secao) === -1) {
        secoes.push(secao);
      }
    });

    var tocar = function (secao) {
      var itens = secao.querySelectorAll("[data-conta]");
      var inicio = window.performance.now();
      var fim = 0;

      Array.prototype.forEach.call(itens, function (el) {
        var atraso = parseInt(el.getAttribute("data-atraso") || "0", 10);
        fim = Math.max(fim, atraso + DUR);
      });

      /* Números do mesmo grupo (data-sincro) sobem juntos, no mesmo ritmo:
         o maior do grupo dita a curva e os menores param ao chegar no valor
         deles. Ex.: "25% a 35%" começa junto e o 35 termina depois. */
      var maiorDoGrupo = {};
      Array.prototype.forEach.call(itens, function (el) {
        var grupo = el.getAttribute("data-sincro");
        if (grupo) {
          maiorDoGrupo[grupo] = Math.max(maiorDoGrupo[grupo] || 0, parseFloat(el.getAttribute("data-conta")));
        }
      });

      var passo = function (agora) {
        var t = agora - inicio;
        Array.prototype.forEach.call(itens, function (el) {
          var casas = parseInt(el.getAttribute("data-decimais") || "0", 10);
          var alvo = parseFloat(el.getAttribute("data-conta"));
          var atraso = parseInt(el.getAttribute("data-atraso") || "0", 10);
          var grupo = el.getAttribute("data-sincro");
          var referencia = grupo ? maiorDoGrupo[grupo] : alvo;
          var p = Math.max(0, Math.min(1, (t - atraso) / DUR));
          /* Começa e termina devagar: quem tem atraso chega depois dos outros. */
          var suave = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          var valor = Math.min(alvo, referencia * suave);
          var terminou = grupo ? valor >= alvo : p >= 1;
          el.textContent = terminou ? el.getAttribute("data-final") : formatar(valor, casas);
        });
        if (t < fim) {
          window.requestAnimationFrame(passo);
        }
      };

      window.requestAnimationFrame(passo);
    };

    var vigiaNumeros = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) {
            return;
          }
          vigiaNumeros.unobserve(entrada.target);
          tocar(entrada.target);
        });
      },
      { threshold: 0.35 }
    );

    /* A medida só vale com a fonte dos números já carregada. */
    var iniciar = function () {
      secoes.forEach(function (secao) {
        var itens = secao.querySelectorAll("[data-conta]");

        Array.prototype.forEach.call(itens, function (el) {
          var casas = parseInt(el.getAttribute("data-decimais") || "0", 10);
          var final = el.textContent;
          var largura = el.getBoundingClientRect().width;

          el.setAttribute("data-final", final);

          /* Reserva o espaço do maior valor que aparece durante a contagem,
             para o que vem depois do número ficar parado. */
          var alvoMedida = parseFloat(el.getAttribute("data-conta"));
          var passos = 60;
          for (var n = 0; n <= passos; n++) {
            var valor = Math.round(alvoMedida * (n / passos) * Math.pow(10, casas)) / Math.pow(10, casas);
            el.textContent = formatar(valor, casas);
            largura = Math.max(largura, el.getBoundingClientRect().width);
          }
          el.style.minWidth = Math.ceil(largura) + "px";
          el.textContent = formatar(0, casas);
        });

        vigiaNumeros.observe(secao);
      });
    };

    var fonteCarregada = false;
    var comecar = function () {
      if (!fonteCarregada) {
        fonteCarregada = true;
        iniciar();
      }
    };

    if (document.fonts && document.fonts.load) {
      document.fonts.load('700 1em "Fraunces"').then(comecar, comecar);
      window.setTimeout(comecar, 1500);
    } else {
      comecar();
    }
  }

  /* ---------- Grifo de "economizar?" e "?" de "casa?" ----------
     Os dois esperam escondidos e entram quando aparecem na tela (o movimento
     está no CSS). O grifo de "economizar?" só é desenhado quando a palavra
     já passou do meio e está chegando no topo: a 30% da altura da tela, de
     cima para baixo (a área vigiada é só a faixa de cima, margem de -70%). */
  var LINHA_GRIFO = 0.3;
  var entradaGrifo = [
    { alvo: document.querySelector(".sublinha-laranja"), espera: "grifo-espera", entra: "desenhar",
      opcoes: { threshold: 0, rootMargin: "0px 0px -" + (100 - LINHA_GRIFO * 100) + "% 0px" }, linha: LINHA_GRIFO },
    { alvo: document.querySelector(".exemplo-chamada"), espera: "interrogacao-espera", entra: "aparecer",
      opcoes: { threshold: 0.6, rootMargin: "0px 0px -12% 0px" } }
  ];

  if ("IntersectionObserver" in window) {
    entradaGrifo.forEach(function (item) {
      if (!item.alvo) {
        return;
      }
      item.alvo.classList.add(item.espera);
      var vigiaItem = new IntersectionObserver(
        function (entradas) {
          entradas.forEach(function (entrada) {
            /* Quem chega já com a palavra acima da linha (link direto, voltar
               da página seguinte) também vê o grifo. */
            var acimaDaLinha = item.linha && entrada.boundingClientRect.top < window.innerHeight * item.linha;
            if (entrada.isIntersecting || acimaDaLinha) {
              item.alvo.classList.add(item.entra);
              vigiaItem.disconnect();
            }
          });
        },
        item.opcoes
      );
      vigiaItem.observe(item.alvo);
    });
  }
})();
