/* Watt Certo: calculadora de consumo (melhoria progressiva).
   Tudo acontece no navegador: nenhum dado é enviado ou salvo.
   Fórmulas (iguais às da página):
     modo padrão:  kWh = potência (W) × horas por dia × quantidade × 30 ÷ 1000
     chuveiro avançado: kWh = potência × fator da estação × (minutos ÷ 60)
                              × pessoas × banhos por pessoa × 30 ÷ 1000
     custo (R$) = kWh × tarifa
     participação (%) = kWh do aparelho ÷ kWh total × 100
     economia (R$) = (kWh atual − kWh do modelo eficiente) × tarifa */
(function () {
  "use strict";

  var form = document.getElementById("form-calculadora");
  if (!form) {
    return;
  }

  var DIAS_NO_MES = 30;
  var FATOR_ESTACAO = { verao: 0.7, inverno: 1.0 };
  var LIMITE_ALTO = 30;
  var LIMITE_MEDIO = 10;

  var aparelhos = form.querySelectorAll(".aparelho");
  var avisoForm = document.getElementById("aviso-form");
  var secaoResultado = document.getElementById("resultado");
  var tituloResultado = document.getElementById("titulo-resultado");
  var formTroca = document.getElementById("form-troca");
  var selectTroca = document.getElementById("troca-aparelho");
  var textoTroca = document.getElementById("troca-resultado");
  var campoPessoas = document.getElementById("pessoas");

  var ultimo = null; // guarda o último cálculo para o simulador de troca

  /* ---------- Leitura de campos ---------- */
  function valor(id) {
    return parseFloat(document.getElementById(id).value);
  }

  function modoChuveiro() {
    return form.querySelector('input[name="modo-chuveiro"]:checked').value;
  }

  /* ---------- Formatação ---------- */
  function formatar(numero, casas) {
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas
    });
  }

  /* Arredonda os centavos para cima na metade (106,425 vira 106,43). O pequeno
     acréscimo evita que o erro de ponto flutuante do computador arredonde para baixo. */
  function reais(numero) {
    var centavos = Math.round(numero * 100 + 0.000001) / 100;
    return centavos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  /* ---------- Campos ligados e desligados ---------- */
  /* Campos desligados não entram na validação nem no cálculo. */
  function sincronizar() {
    var i;
    var j;
    var caixa;
    var campos;
    var grupos;
    var grupo;
    var modo = modoChuveiro();

    for (i = 0; i < aparelhos.length; i++) {
      caixa = aparelhos[i].querySelector(".aparelho-tem input");
      campos = aparelhos[i].querySelectorAll(".campos input, .campos select, .modo input");
      for (j = 0; j < campos.length; j++) {
        campos[j].disabled = !caixa.checked;
      }
      aparelhos[i].classList.toggle("is-desligado", !caixa.checked);
    }

    grupos = document.querySelectorAll("#fs-chuveiro [data-modo]");
    for (i = 0; i < grupos.length; i++) {
      grupo = grupos[i];
      grupo.hidden = grupo.getAttribute("data-modo") !== modo;
      campos = grupo.querySelectorAll("input, select");
      for (j = 0; j < campos.length; j++) {
        campos[j].disabled = grupo.hidden || !document.getElementById("tem-chuveiro").checked;
      }
    }

    document.getElementById("pessoas-eco").textContent = campoPessoas.value || "0";
  }

  /* ---------- Cálculo ---------- */
  function consumoChuveiro(pessoas) {
    var potencia = valor("pot-chuveiro");
    if (modoChuveiro() === "avancado") {
      return potencia *
        FATOR_ESTACAO[document.getElementById("estacao-chuveiro").value] *
        (valor("min-chuveiro") / 60) *
        pessoas *
        valor("banhos-chuveiro") *
        DIAS_NO_MES / 1000;
    }
    return potencia * valor("hor-chuveiro") * DIAS_NO_MES / 1000;
  }

  function coletar(pessoas) {
    var lista = [];
    var i;
    var bloco;
    var id;
    var nome;
    var campoNome;

    for (i = 0; i < aparelhos.length; i++) {
      bloco = aparelhos[i];
      id = bloco.getAttribute("data-id");
      if (!bloco.querySelector(".aparelho-tem input").checked) {
        continue;
      }

      nome = bloco.querySelector("legend").textContent;
      if (id === "outro") {
        campoNome = document.getElementById("nome-outro").value.trim();
        nome = campoNome || "Outro aparelho";
      }

      if (id === "chuveiro") {
        lista.push({
          nome: nome,
          potencia: valor("pot-chuveiro"),
          kwh: consumoChuveiro(pessoas)
        });
      } else {
        lista.push({
          nome: nome,
          potencia: valor("pot-" + id),
          kwh: valor("pot-" + id) * valor("hor-" + id) * valor("qtd-" + id) * DIAS_NO_MES / 1000
        });
      }
    }
    return lista;
  }

  function nivel(participacao) {
    if (participacao >= LIMITE_ALTO) {
      return { classe: "nivel-alto", texto: "Consumo alto" };
    }
    if (participacao >= LIMITE_MEDIO) {
      return { classe: "nivel-medio", texto: "Consumo médio" };
    }
    return { classe: "nivel-baixo", texto: "Consumo baixo" };
  }

  /* ---------- Desenho do resultado ---------- */
  function celula(tag, texto, escopo) {
    var el = document.createElement(tag);
    el.textContent = texto;
    if (escopo) {
      el.setAttribute("scope", escopo);
    }
    return el;
  }

  function desenharTabela(lista, total, tarifa) {
    var corpo = document.getElementById("res-corpo");
    var i;
    var item;
    var linha;
    var cabeca;
    var info;
    var nivelTexto;

    corpo.textContent = "";
    for (i = 0; i < lista.length; i++) {
      item = lista[i];
      info = nivel(item.participacao);
      linha = document.createElement("tr");
      linha.className = info.classe;

      cabeca = celula("th", item.nome, "row");
      nivelTexto = document.createElement("span");
      nivelTexto.className = "nivel-texto";
      nivelTexto.textContent = info.texto;
      cabeca.appendChild(nivelTexto);

      linha.appendChild(cabeca);
      linha.appendChild(celula("td", formatar(item.kwh, 0)));
      linha.appendChild(celula("td", reais(item.kwh * tarifa)));
      linha.appendChild(celula("td", formatar(item.participacao, 0) + "%"));
      corpo.appendChild(linha);
    }

    document.getElementById("res-total-kwh").textContent = formatar(total, 0);
    document.getElementById("res-total-custo").textContent = reais(total * tarifa);
  }

  function desenharComparacao(estimado, fatura) {
    var bloco = document.getElementById("comparacao");
    var texto = document.getElementById("comparacao-texto");
    var diferenca;
    var percentual;

    if (isNaN(fatura) || fatura <= 0) {
      bloco.hidden = true;
      return;
    }

    diferenca = estimado - fatura;
    percentual = Math.abs(diferenca) / fatura * 100;
    bloco.hidden = false;

    if (Math.round(Math.abs(diferenca) * 100) === 0) {
      texto.textContent = "A estimativa de " + reais(estimado) + " ficou igual à fatura de " + reais(fatura) + ".";
    } else if (diferenca < 0) {
      texto.textContent = "A estimativa de " + reais(estimado) + " ficou " + reais(-diferenca) +
        " (" + formatar(percentual, 0) + "%) abaixo da fatura de " + reais(fatura) +
        ". Isso é esperado quando há aparelhos fora da lista, ou itens da fatura que a calculadora não considera, " +
        "como a contribuição de iluminação pública. Se quiser aproximar, inclua mais aparelhos ou revise as horas de uso.";
    } else {
      texto.textContent = "A estimativa de " + reais(estimado) + " ficou " + reais(diferenca) +
        " (" + formatar(percentual, 0) + "%) acima da fatura de " + reais(fatura) +
        ". Vale conferir se as potências e as horas de uso informadas refletem o uso real da casa.";
    }
  }

  function preencherTroca(lista) {
    var i;
    var opcao;

    selectTroca.textContent = "";
    for (i = 0; i < lista.length; i++) {
      opcao = document.createElement("option");
      opcao.value = String(i);
      opcao.textContent = lista[i].nome + " (" + formatar(lista[i].potencia, 0) + " W)";
      selectTroca.appendChild(opcao);
    }
    document.getElementById("troca-potencia").value = "";
    textoTroca.textContent = "";
  }

  /* ---------- Envio do formulário principal ---------- */
  form.addEventListener("submit", function (evento) {
    var pessoas;
    var tarifa;
    var fatura;
    var lista;
    var total = 0;
    var i;

    evento.preventDefault();
    avisoForm.hidden = true;

    pessoas = valor("pessoas");
    tarifa = valor("tarifa");
    fatura = valor("fatura");
    lista = coletar(pessoas);

    if (lista.length === 0) {
      avisoForm.textContent = "Marque pelo menos um aparelho para calcular.";
      avisoForm.hidden = false;
      return;
    }

    for (i = 0; i < lista.length; i++) {
      total += lista[i].kwh;
    }
    for (i = 0; i < lista.length; i++) {
      lista[i].participacao = total > 0 ? lista[i].kwh / total * 100 : 0;
    }
    lista.sort(function (a, b) {
      return b.kwh - a.kwh;
    });

    ultimo = { lista: lista, tarifa: tarifa };

    document.getElementById("res-kwh").textContent = formatar(total, 0) + " kWh por mês";
    document.getElementById("res-custo").textContent = reais(total * tarifa) + " por mês";
    document.getElementById("res-maior").textContent =
      lista[0].nome + " (" + formatar(lista[0].participacao, 0) + "% do total)";
    document.getElementById("res-tarifa").textContent =
      "Tarifa usada: " + reais(tarifa) + " por kWh. Valores de kWh arredondados para número inteiro.";

    desenharTabela(lista, total, tarifa);
    desenharComparacao(total * tarifa, fatura);
    preencherTroca(lista);

    secaoResultado.hidden = false;
    tituloResultado.focus();
    secaoResultado.scrollIntoView();
  });

  /* ---------- Simulador de troca ---------- */
  formTroca.addEventListener("submit", function (evento) {
    var item;
    var novaPotencia;
    var kwhNovo;
    var economiaKwh;
    var economiaReais;

    evento.preventDefault();
    if (!ultimo) {
      return;
    }

    item = ultimo.lista[parseInt(selectTroca.value, 10)];
    novaPotencia = valor("troca-potencia");

    if (novaPotencia >= item.potencia) {
      textoTroca.textContent = "O modelo novo precisa ter potência menor que " +
        formatar(item.potencia, 0) + " W para gerar economia.";
      return;
    }

    kwhNovo = item.kwh * novaPotencia / item.potencia;
    economiaKwh = item.kwh - kwhNovo;
    economiaReais = economiaKwh * ultimo.tarifa;

    textoTroca.textContent = "Trocar " + item.nome + " de " + formatar(item.potencia, 0) + " W por um de " +
      formatar(novaPotencia, 0) + " W reduz o consumo de " + formatar(item.kwh, 0) + " para " +
      formatar(kwhNovo, 0) + " kWh por mês. Economia: " + reais(economiaReais) + " por mês, ou " +
      reais(economiaReais * 12) + " por ano, com a tarifa de " + reais(ultimo.tarifa) + " por kWh.";
  });

  /* ---------- Eventos de apoio ---------- */
  form.addEventListener("change", sincronizar);
  campoPessoas.addEventListener("input", sincronizar);

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      sincronizar();
      avisoForm.hidden = true;
      secaoResultado.hidden = true;
      ultimo = null;
    }, 0);
  });

  sincronizar();
})();
