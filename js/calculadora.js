/* WattCerto: calculadora de consumo (melhoria progressiva).
   Tudo acontece no navegador: nenhum dado é enviado ou salvo.

   Cada aparelho tem um tipo de cálculo (atributo data-tipo no HTML ou campo
   "tipo" no catálogo js/aparelhos.js). As fórmulas são as mesmas da página:
     tempo         potência × horas por dia × quantidade × 30 ÷ 1000
     standby       (potência × horas de uso + potência em espera × horas paradas)
                   × quantidade × 30 ÷ 1000
     evento        potência × (minutos por uso ÷ 60) × usos no mês ÷ 1000
     climatizacao  potência média × horas por dia × quantidade × 30 ÷ 1000
                   × (meses de uso ÷ 12), ou seja, a média de um mês do ano
     ciclo         consumo da etiqueta (kWh/mês) × quantidade
     banho         potência × fator da estação × (minutos ÷ 60)
                   × pessoas × banhos por pessoa × 30 ÷ 1000
     custo (R$) = kWh × tarifa; custo no ano = custo do mês × 12
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
  var MESES_NO_ANO = 12;

  /* Média de consumo de uma residência brasileira, em kWh por mês.
     Cálculo nosso com dados da EPE (Anuário 2026, ano-base 2025):
     179.648 GWh ÷ 84,5 milhões de residências ÷ 12 meses = 177 kWh. */
  var MEDIA_BRASIL_KWH = 177;

  var listaAparelhos = form.querySelector(".aparelhos");
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
  /* Campos desligados não entram na validação nem no cálculo.
     Os aparelhos fixos têm caixa de marcar; os adicionados sempre contam. */
  function aparelhoLigado(bloco) {
    var caixa = bloco.querySelector(".aparelho-tem input");
    return caixa ? caixa.checked : true;
  }

  function sincronizar() {
    var aparelhos = form.querySelectorAll(".aparelho");
    var i;
    var j;
    var ligado;
    var campos;
    var grupos;
    var grupo;
    var modo = modoChuveiro();

    for (i = 0; i < aparelhos.length; i++) {
      ligado = aparelhoLigado(aparelhos[i]);
      campos = aparelhos[i].querySelectorAll(".campos input, .campos select, .modo input");
      for (j = 0; j < campos.length; j++) {
        campos[j].disabled = !ligado;
      }
      aparelhos[i].classList.toggle("is-desligado", !ligado);
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

  /* Lê um campo do aparelho pelo atributo data-campo (potencia, horas...). */
  function campo(bloco, nome) {
    var el = bloco.querySelector('[data-campo="' + nome + '"]');
    return el ? parseFloat(el.value) : NaN;
  }

  /* Consumo do mês de um aparelho, pela regra do tipo dele. */
  function consumo(bloco, pessoas) {
    var tipo = bloco.getAttribute("data-tipo");
    var potencia = campo(bloco, "potencia");
    var horas = campo(bloco, "horas");
    var quantidade = campo(bloco, "quantidade");

    if (tipo === "banho") {
      return consumoChuveiro(pessoas);
    }
    if (tipo === "ciclo") {
      return campo(bloco, "etiqueta") * quantidade;
    }
    if (tipo === "evento") {
      return potencia * (campo(bloco, "minutos") / 60) * campo(bloco, "usos") / 1000;
    }
    if (tipo === "climatizacao") {
      return potencia * horas * quantidade * DIAS_NO_MES / 1000 * (campo(bloco, "meses") / 12);
    }
    if (tipo === "standby") {
      return (potencia * horas + campo(bloco, "espera") * (24 - horas)) * quantidade * DIAS_NO_MES / 1000;
    }
    return potencia * horas * quantidade * DIAS_NO_MES / 1000; /* tipo "tempo" */
  }

  /* Potência usada no simulador de troca. Nos aparelhos "pela etiqueta" não há
     campo de potência: vale a potência do modelo, guardada em data-potencia. */
  function potenciaDe(bloco) {
    if (bloco.getAttribute("data-tipo") === "banho") {
      return valor("pot-chuveiro");
    }
    if (bloco.getAttribute("data-tipo") === "ciclo") {
      return parseFloat(bloco.getAttribute("data-potencia"));
    }
    return campo(bloco, "potencia");
  }

  function coletar(pessoas) {
    var aparelhos = form.querySelectorAll(".aparelho");
    var lista = [];
    var i;
    var bloco;

    for (i = 0; i < aparelhos.length; i++) {
      bloco = aparelhos[i];
      if (!aparelhoLigado(bloco)) {
        continue;
      }
      lista.push({
        nome: bloco.getAttribute("data-nome") || bloco.querySelector("legend").textContent,
        potencia: potenciaDe(bloco),
        kwh: consumo(bloco, pessoas)
      });
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

  /* Custo do mês e, numa segunda linha, o custo do ano (mês × 12). */
  function preencherCusto(el, custoMes, sufixo) {
    var ano = document.createElement("span");

    el.textContent = reais(custoMes) + (sufixo || "");
    ano.className = "por-ano";
    ano.textContent = reais(custoMes * MESES_NO_ANO) + " por ano";
    el.appendChild(ano);
  }

  function celulaCusto(custoMes) {
    var el = document.createElement("td");
    preencherCusto(el, custoMes);
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
      linha.appendChild(celulaCusto(item.kwh * tarifa));
      linha.appendChild(celula("td", formatar(item.participacao, 0) + "%"));
      corpo.appendChild(linha);
    }

    document.getElementById("res-total-kwh").textContent = formatar(total, 0);
    preencherCusto(document.getElementById("res-total-custo"), total * tarifa);
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

  /* Compara a estimativa com a média brasileira. Até 10% de diferença,
     para mais ou para menos, conta como "perto da média". */
  function desenharMedia(total) {
    var texto = document.getElementById("media-texto");
    var maior = Math.max(total, MEDIA_BRASIL_KWH);
    var diferenca = (total - MEDIA_BRASIL_KWH) / MEDIA_BRASIL_KWH * 100;
    var inicio = "A estimativa da sua casa é de " + formatar(total, 0) + " kWh por mês";

    if (Math.abs(diferenca) <= 10) {
      texto.textContent = inicio + ", perto da média das residências brasileiras, de cerca de " +
        MEDIA_BRASIL_KWH + " kWh por mês.";
    } else if (diferenca > 0) {
      texto.textContent = inicio + ", " + formatar(diferenca, 0) +
        "% acima da média das residências brasileiras, de cerca de " + MEDIA_BRASIL_KWH + " kWh por mês.";
    } else {
      texto.textContent = inicio + ", " + formatar(-diferenca, 0) +
        "% abaixo da média das residências brasileiras, de cerca de " + MEDIA_BRASIL_KWH + " kWh por mês.";
    }

    document.getElementById("media-valor-casa").textContent = formatar(total, 0) + " kWh";
    document.getElementById("media-barra-casa").style.width = (total / maior * 100) + "%";
    document.getElementById("media-barra-media").style.width = (MEDIA_BRASIL_KWH / maior * 100) + "%";
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
    preencherCusto(document.getElementById("res-custo"), total * tarifa, " por mês");
    document.getElementById("res-maior").textContent =
      lista[0].nome + " (" + formatar(lista[0].participacao, 0) + "% do total)";
    document.getElementById("res-tarifa").textContent =
      "Tarifa usada: " + reais(tarifa) + " por kWh. Valores de kWh arredondados para número inteiro.";

    desenharTabela(lista, total, tarifa);
    desenharComparacao(total * tarifa, fatura);
    desenharMedia(total);
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

  /* ---------- Geladeira: o modelo preenche o consumo da etiqueta ---------- */
  var modeloGeladeira = document.getElementById("geladeira-modelo");

  function aplicarModeloGeladeira() {
    var opcao = modeloGeladeira.options[modeloGeladeira.selectedIndex];
    document.getElementById("geladeira-etiqueta").value = modeloGeladeira.value;
    modeloGeladeira.closest(".aparelho").setAttribute("data-potencia", opcao.getAttribute("data-potencia"));
  }

  modeloGeladeira.addEventListener("change", aplicarModeloGeladeira);

  /* ---------- Adicionar aparelho ---------- */
  /* Os campos que cada tipo de cálculo pede, na ordem em que aparecem. */
  var CAMPOS = {
    potencia: { rotulo: "Potência (W)", min: "1", max: "10000", passo: "1", teclado: "numeric" },
    horas: { rotulo: "Horas por dia", min: "0.05", max: "24", passo: "0.05", teclado: "decimal" },
    quantidade: { rotulo: "Quantidade", min: "1", max: "100", passo: "1", teclado: "numeric" },
    minutos: { rotulo: "Minutos por uso", min: "1", max: "600", passo: "1", teclado: "numeric" },
    usos: { rotulo: "Usos por mês", min: "1", max: "300", passo: "1", teclado: "numeric" },
    espera: { rotulo: "Potência em espera (W)", min: "0", max: "100", passo: "0.1", teclado: "decimal" },
    etiqueta: { rotulo: "Consumo da etiqueta (kWh/mês)", min: "1", max: "500", passo: "0.1", teclado: "decimal" },
    meses: { rotulo: "Meses de uso por ano", min: "1", max: "12", passo: "1", teclado: "numeric" }
  };

  var TIPOS = {
    tempo: {
      campos: ["potencia", "horas", "quantidade"],
      regra: "Conta por hora",
      explicacao: "Potência × horas por dia × quantidade × 30 ÷ 1000."
    },
    standby: {
      campos: ["potencia", "horas", "espera", "quantidade"],
      regra: "Conta por hora, com espera",
      explicacao: "Fica na tomada o dia todo: as horas paradas entram com a potência em espera."
    },
    evento: {
      campos: ["potencia", "minutos", "usos"],
      regra: "Conta por uso",
      explicacao: "Potência × minutos de cada uso × usos no mês. O que conta é cada uso, não as horas do dia."
    },
    climatizacao: {
      campos: ["potencia", "horas", "meses", "quantidade"],
      regra: "Conta por hora e meses de uso",
      explicacao: "Usa a potência média de funcionamento e dá a média de um mês do ano. Se você só liga no calor, informe quantos meses usa: com 4 meses, a conta fica em 4 ÷ 12 do valor do mês de uso."
    },
    ciclo: {
      campos: ["etiqueta", "quantidade"],
      regra: "Conta pela etiqueta",
      explicacao: "Liga e desliga sozinho o dia todo, por isso a conta usa o consumo do selo Inmetro, e não horas por dia."
    }
  };

  var areaAdicionar = document.getElementById("adicionar");
  var botaoAdicionar = document.getElementById("adicionar-botao");
  var painelAdicionar = document.getElementById("adicionar-lista");
  var escolha = document.getElementById("adicionar-select");
  var dicaEscolha = document.getElementById("adicionar-regra");
  var caixaOutro = document.getElementById("adicionar-outro");
  var avisoAdicionar = document.getElementById("adicionar-aviso");
  var campoOutro = document.getElementById("outro-nome");
  var catalogo = window.CATALOGO_APARELHOS || [];
  var contador = 0;

  function textoFonte(item) {
    if (item.nota) {
      return item.nota;
    }
    if (item.fonte === "tipico") {
      return "Valor típico de mercado: confira na etiqueta do seu aparelho.";
    }
    return "";
  }

  function abrirLista(abrir) {
    painelAdicionar.hidden = !abrir;
    botaoAdicionar.setAttribute("aria-expanded", abrir ? "true" : "false");
  }

  function criarCampo(item, nome, prefixo) {
    var def = CAMPOS[nome];
    var caixa = document.createElement("div");
    var rotulo = document.createElement("label");
    var entrada = document.createElement("input");

    caixa.className = "campo";
    rotulo.setAttribute("for", prefixo + "-" + nome);
    rotulo.textContent = (item.rotulos && item.rotulos[nome]) || def.rotulo;

    entrada.type = "number";
    entrada.setAttribute("inputmode", def.teclado);
    entrada.min = def.min;
    entrada.max = def.max;
    entrada.step = def.passo;
    entrada.required = true;
    entrada.id = prefixo + "-" + nome;
    entrada.setAttribute("data-campo", nome);
    entrada.value = String(item.valores[nome]);

    caixa.appendChild(rotulo);
    caixa.appendChild(entrada);
    return caixa;
  }

  /* Monta o card do aparelho com os campos do tipo dele. */
  function criarCartao(item) {
    var tipo = TIPOS[item.tipo];
    var prefixo = "extra" + (++contador);
    var bloco = document.createElement("fieldset");
    var titulo = document.createElement("legend");
    var remover = document.createElement("button");
    var campos = document.createElement("div");
    var dica = document.createElement("p");
    var regra = document.createElement("strong");
    var i;

    bloco.className = "aparelho aparelho-extra";
    bloco.setAttribute("data-id", item.id);
    bloco.setAttribute("data-tipo", item.tipo);
    bloco.setAttribute("data-nome", item.nome);
    if (item.potenciaW) {
      bloco.setAttribute("data-potencia", String(item.potenciaW));
    }

    titulo.textContent = item.nome;

    remover.type = "button";
    remover.className = "aparelho-remover";
    remover.setAttribute("aria-label", "Remover " + item.nome);
    remover.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    remover.addEventListener("click", function () {
      removerCartao(bloco, item);
    });

    campos.className = "campos";
    for (i = 0; i < tipo.campos.length; i++) {
      campos.appendChild(criarCampo(item, tipo.campos[i], prefixo));
    }

    dica.className = "dica campo-largo";
    dica.id = prefixo + "-dica";
    regra.textContent = tipo.regra + ".";
    dica.appendChild(regra);
    dica.appendChild(document.createTextNode(" " + tipo.explicacao + " " + textoFonte(item)));
    campos.appendChild(dica);
    campos.querySelector("[data-campo]").setAttribute("aria-describedby", dica.id);

    bloco.appendChild(titulo);
    bloco.appendChild(remover);
    bloco.appendChild(campos);
    return bloco;
  }

  var TEXTO_ESCOLHA = "Cada aparelho entra com a regra de cálculo dele e com valores de partida. Depois é só ajustar ao seu uso.";
  var TEXTO_OUTRO = "Escreva o nome do aparelho. Ele entra com a conta por hora: potência × horas por dia × quantidade × 30 ÷ 1000. Se o aparelho liga e desliga sozinho ou é usado por ciclos, prefira um da lista.";

  function itemDoCatalogo(id) {
    var i;
    for (i = 0; i < catalogo.length; i++) {
      if (catalogo[i].id === id) {
        return catalogo[i];
      }
    }
    return null;
  }

  /* Só os aparelhos do catálogo têm opção no menu; o "outro" pode repetir. */
  function opcaoDoCatalogo(id) {
    return itemDoCatalogo(id) ? escolha.querySelector('option[value="' + id + '"]') : null;
  }

  /* Na lista, o aparelho já incluído fica indisponível até ser removido. */
  function marcarIncluido(opcao, incluido) {
    var item = itemDoCatalogo(opcao.value);
    opcao.disabled = incluido;
    opcao.textContent = item.nome + (incluido ? " (já incluído)" : "");
  }

  function incluir(item) {
    var bloco = criarCartao(item);
    var opcao = opcaoDoCatalogo(item.id);

    listaAparelhos.appendChild(bloco);
    if (opcao) {
      marcarIncluido(opcao, true);
    }
    escolha.value = "";
    mostrarRegra();
    abrirLista(false);
    sincronizar();
    avisoAdicionar.textContent = item.nome + " foi incluído na lista de aparelhos.";
    bloco.querySelector("[data-campo]").focus();
  }

  function removerCartao(bloco, item) {
    var opcao = opcaoDoCatalogo(item.id);

    bloco.parentNode.removeChild(bloco);
    if (opcao) {
      marcarIncluido(opcao, false);
    }
    avisoAdicionar.textContent = item.nome + " foi removido da lista de aparelhos.";
    botaoAdicionar.focus();
  }

  /* Monta o menu de seleção: um grupo (optgroup) por categoria. */
  function montarLista() {
    var grupos = window.GRUPOS_APARELHOS || [];
    var g;
    var i;
    var grupo;
    var opcao;

    opcao = document.createElement("option");
    opcao.value = "";
    opcao.textContent = "Escolha um aparelho";
    escolha.appendChild(opcao);

    for (g = 0; g < grupos.length; g++) {
      grupo = document.createElement("optgroup");
      grupo.label = grupos[g];
      for (i = 0; i < catalogo.length; i++) {
        if (catalogo[i].grupo === grupos[g]) {
          opcao = document.createElement("option");
          opcao.value = catalogo[i].id;
          opcao.textContent = catalogo[i].nome;
          grupo.appendChild(opcao);
        }
      }
      escolha.appendChild(grupo);
    }

    grupo = document.createElement("optgroup");
    grupo.label = "Não está na lista";
    opcao = document.createElement("option");
    opcao.value = "outro";
    opcao.textContent = "Outro aparelho";
    grupo.appendChild(opcao);
    escolha.appendChild(grupo);
  }

  /* Abaixo do menu, mostra a regra de cálculo do aparelho escolhido. */
  function mostrarRegra() {
    var item = itemDoCatalogo(escolha.value);
    var regra;

    escolha.removeAttribute("aria-invalid");
    caixaOutro.hidden = escolha.value !== "outro";
    dicaEscolha.textContent = "";

    if (item) {
      regra = document.createElement("strong");
      regra.textContent = TIPOS[item.tipo].regra + ".";
      dicaEscolha.appendChild(regra);
      dicaEscolha.appendChild(document.createTextNode(" " + TIPOS[item.tipo].explicacao));
    } else if (escolha.value === "outro") {
      dicaEscolha.textContent = TEXTO_OUTRO;
    } else {
      dicaEscolha.textContent = TEXTO_ESCOLHA;
    }
  }

  function erroEscolha(campoComErro, texto) {
    campoComErro.setAttribute("aria-invalid", "true");
    dicaEscolha.textContent = texto;
    campoComErro.focus();
  }

  function confirmarEscolha() {
    var item = itemDoCatalogo(escolha.value);
    var nome;

    if (item) {
      incluir(item);
      return;
    }
    if (escolha.value !== "outro") {
      erroEscolha(escolha, "Escolha um aparelho no menu para incluir.");
      return;
    }

    /* "Outro aparelho": a pessoa escreve o nome e ele entra com a conta por hora. */
    nome = campoOutro.value.trim();
    if (!nome) {
      erroEscolha(campoOutro, "Escreva o nome do aparelho para incluir.");
      return;
    }
    campoOutro.removeAttribute("aria-invalid");
    campoOutro.value = "";
    incluir({
      id: "outro",
      nome: nome,
      tipo: "tempo",
      valores: { potencia: 100, horas: 1, quantidade: 1 },
      nota: "Confira a potência na etiqueta. Se ele liga e desliga sozinho ou é usado por ciclos, prefira um aparelho da lista."
    });
  }

  function limparAdicionados() {
    var extras = listaAparelhos.querySelectorAll(".aparelho-extra");
    var opcoes = escolha.querySelectorAll("option");
    var i;

    for (i = 0; i < extras.length; i++) {
      extras[i].parentNode.removeChild(extras[i]);
    }
    for (i = 0; i < opcoes.length; i++) {
      if (itemDoCatalogo(opcoes[i].value)) {
        marcarIncluido(opcoes[i], false);
      }
    }
    campoOutro.value = "";
    escolha.value = "";
    mostrarRegra();
    abrirLista(false);
  }

  montarLista();
  mostrarRegra();
  areaAdicionar.hidden = false;

  botaoAdicionar.addEventListener("click", function () {
    abrirLista(painelAdicionar.hidden);
    if (!painelAdicionar.hidden) {
      escolha.focus();
    }
  });

  areaAdicionar.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !painelAdicionar.hidden) {
      abrirLista(false);
      botaoAdicionar.focus();
    }
  });

  escolha.addEventListener("change", mostrarRegra);
  campoOutro.addEventListener("input", function () {
    campoOutro.removeAttribute("aria-invalid");
  });
  document.getElementById("adicionar-confirmar").addEventListener("click", confirmarEscolha);

  /* Enter no nome do outro aparelho inclui o aparelho, em vez de enviar o formulário. */
  campoOutro.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      confirmarEscolha();
    }
  });

  /* ---------- Eventos de apoio ---------- */
  form.addEventListener("change", sincronizar);
  campoPessoas.addEventListener("input", sincronizar);

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      limparAdicionados();
      aplicarModeloGeladeira();
      sincronizar();
      avisoForm.hidden = true;
      secaoResultado.hidden = true;
      ultimo = null;
    }, 0);
  });

  sincronizar();
})();
