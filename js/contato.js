/* Contato: o navegador valida os campos pelos atributos HTML5 (required, type, pattern).
   No Netlify, o envio vai para o Netlify Forms; em outra hospedagem, só a validação vale. Com JavaScript, a página envia sem recarregar e
   mostra o resultado aqui mesmo. Sem JavaScript, o formulário é enviado do jeito
   comum e volta para esta página com "?enviado=1". */
(function () {
  var form = document.getElementById("form-contato");
  var status = document.getElementById("form-status");
  var botao;
  if (!form) return;
  botao = form.querySelector('button[type="submit"]');

  /* E-mail: confere o formato inteiro (nome, @, domínio com ponto e final com 2 letras ou mais)
     e explica o que está errado, em vez de só dizer "inválido". Não dá para saber se a caixa
     existe sem mandar uma mensagem de confirmação; aqui só se confere o jeito de escrever. */
  var campoEmail = document.getElementById("email");
  var erroEmail = document.getElementById("erro-email");
  var emailTocado = false;

  function mensagemEmail(valor) {
    var partes, local, dominio;
    if (valor === "") { return "Informe o seu e-mail. Exemplo: voce@exemplo.com"; }
    if (/\s/.test(valor)) { return "O e-mail não pode ter espaços."; }
    if (valor.indexOf("@") === -1) { return "Falta o @ no e-mail. Exemplo: voce@exemplo.com"; }
    partes = valor.split("@");
    if (partes.length > 2) { return "O e-mail só pode ter um @."; }
    local = partes[0];
    dominio = partes[1];
    if (local === "") { return "Falta o nome antes do @. Exemplo: voce@exemplo.com"; }
    if (dominio === "") { return "Falta o domínio depois do @. Exemplo: voce@exemplo.com"; }
    if (dominio.indexOf(".") === -1) { return "Falta o final do domínio, como .com ou .com.br."; }
    if (/\.\./.test(valor) || local.charAt(0) === "." || local.charAt(local.length - 1) === ".") {
      return "Tem um ponto no lugar errado. Confira o e-mail.";
    }
    if (!/^[A-Za-z0-9._%+\-]+$/.test(local)) { return "O nome antes do @ tem um caractere que e-mail não aceita."; }
    if (!/^(?:[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(dominio)) {
      return "O domínio depois do @ não parece certo. Exemplo: exemplo.com.br";
    }
    return "";
  }

  function conferirEmail(mostrar) {
    var texto = mensagemEmail(campoEmail.value.trim());
    campoEmail.setCustomValidity(texto);
    if (mostrar) {
      erroEmail.textContent = texto;
      if (texto) {
        campoEmail.setAttribute("aria-invalid", "true");
      } else {
        campoEmail.removeAttribute("aria-invalid");
      }
    }
    return texto === "";
  }

  /* Erro de digitação no domínio (gmial.com, hotmal.com, gmail.con...): o formato está certo,
     então o envio não é bloqueado, mas a página sugere o domínio parecido e oferece um botão
     para corrigir. Tudo roda aqui no navegador; o e-mail não é enviado para lugar nenhum. */
  var caixaSugestao = document.getElementById("sugestao-email");
  var dominiosComuns = [
    "gmail.com", "hotmail.com", "hotmail.com.br", "outlook.com", "outlook.com.br", "live.com",
    "msn.com", "yahoo.com", "yahoo.com.br", "ymail.com", "icloud.com", "me.com", "mail.com",
    "aol.com", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "globo.com",
    "globomail.com", "r7.com", "protonmail.com", "proton.me", "fatec.sp.gov.br", "etec.sp.gov.br"
  ];

  /* Quantas letras precisam mudar para uma palavra virar a outra (trocar duas letras de lugar conta 1). */
  function distancia(a, b) {
    var d = [], i, j, custo;
    for (i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (j = 0; j <= b.length; j++) { d[0][j] = j; }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        custo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + custo);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }

  function dominioParecido(dominio) {
    var melhor = "", menor = 99, limite, i, dist;
    dominio = dominio.toLowerCase();
    if (dominiosComuns.indexOf(dominio) !== -1) { return ""; }
    limite = dominio.length >= 8 ? 2 : 1;
    for (i = 0; i < dominiosComuns.length; i++) {
      dist = distancia(dominio, dominiosComuns[i]);
      if (dist < menor) { menor = dist; melhor = dominiosComuns[i]; }
    }
    return menor <= limite ? melhor : "";
  }

  function limparSugestao() {
    if (caixaSugestao) { caixaSugestao.textContent = ""; }
  }

  function sugerirEmail() {
    var valor = campoEmail.value.trim(), partes, sugerido, novo, frase, botao;
    limparSugestao();
    if (!caixaSugestao || mensagemEmail(valor) !== "") { return; }
    partes = valor.split("@");
    sugerido = dominioParecido(partes[1]);
    if (!sugerido) { return; }
    novo = partes[0] + "@" + sugerido;
    frase = document.createElement("span");
    frase.textContent = "Você quis dizer " + novo + "?";
    botao = document.createElement("button");
    botao.type = "button";
    botao.className = "sugestao-botao";
    botao.textContent = "Corrigir";
    botao.addEventListener("click", function () {
      campoEmail.value = novo;
      conferirEmail(true);
      limparSugestao();
      caixaSugestao.textContent = "E-mail corrigido para " + novo + ".";
      campoEmail.focus();
    });
    caixaSugestao.appendChild(frase);
    caixaSugestao.appendChild(document.createTextNode(" "));
    caixaSugestao.appendChild(botao);
  }

  if (campoEmail && erroEmail) {
    conferirEmail(false);
    campoEmail.addEventListener("input", function () {
      conferirEmail(emailTocado);
      limparSugestao();
    });
    campoEmail.addEventListener("blur", function () {
      campoEmail.value = campoEmail.value.trim();
      emailTocado = true;
      conferirEmail(true);
      sugerirEmail();
    });
    /* Ao tentar enviar com o e-mail errado, o navegador dispara "invalid" e mostra o aviso. */
    campoEmail.addEventListener("invalid", function () {
      emailTocado = true;
      conferirEmail(true);
    });
  }

  function avisar(classe, texto) {
    status.className = "form-status" + (classe ? " " + classe : "");
    status.textContent = texto;
  }

  /* Volta do envio sem JavaScript. */
  if (window.location.search.indexOf("enviado=1") !== -1) {
    avisar("ok", "Mensagem enviada. Vamos responder no e-mail que você informou.");
  }

  form.addEventListener("submit", function (evento) {
    if (!window.fetch || !window.URLSearchParams || !window.FormData) {
      return; /* navegador antigo: envio comum */
    }
    evento.preventDefault();

    /* Fora do Netlify (no Railway, por exemplo) não existe servidor para receber a
       mensagem. A página só confirma que os dados passaram na validação. */
    if (!/\.netlify\.app$/.test(window.location.hostname)) {
      form.reset();
      avisar("ok", "Tudo certo com os dados. Esta versão do site confere o formulário, mas não envia a mensagem para um servidor.");
      return;
    }

    botao.disabled = true;
    avisar("", "Enviando...");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (resposta) {
        if (!resposta.ok) {
          throw new Error("falha no envio");
        }
        form.reset();
        avisar("ok", "Mensagem enviada. Vamos responder no e-mail que você informou.");
      })
      .catch(function () {
        avisar("erro", "Não foi possível enviar agora. Confira sua internet e tente de novo em alguns minutos.");
      })
      .then(function () {
        botao.disabled = false;
      });
  });

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      if (campoEmail && erroEmail) {
        emailTocado = false;
        erroEmail.textContent = "";
        campoEmail.removeAttribute("aria-invalid");
        conferirEmail(false);
        limparSugestao();
      }
      if (status.className.indexOf("ok") === -1) {
        avisar("", "");
      }
    }, 0);
  });
})();
