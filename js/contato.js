/* Contato: o navegador valida os campos pelos atributos HTML5 (required, type, pattern).
   Este script só trata o envio de um formulário já válido e avisa que o envio
   ainda não está ligado a um servidor. Sem JavaScript, a validação continua funcionando. */
(function () {
  var form = document.getElementById("form-contato");
  var status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    status.className = "form-status ok";
    status.textContent = "Dados validados. O envio será ativado quando o site for publicado no Railway.";
  });

  form.addEventListener("reset", function () {
    status.className = "form-status";
    status.textContent = "";
  });
})();
