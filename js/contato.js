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

  /* A data da última conta não pode ser no futuro: o limite é hoje. */
  var dataConta = document.getElementById("data-conta");
  if (dataConta) {
    var hoje = new Date();
    var mes = String(hoje.getMonth() + 1);
    var dia = String(hoje.getDate());
    dataConta.max = hoje.getFullYear() + "-" + (mes.length < 2 ? "0" + mes : mes) + "-" + (dia.length < 2 ? "0" + dia : dia);
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
      if (status.className.indexOf("ok") === -1) {
        avisar("", "");
      }
    }, 0);
  });
})();
