# Projeto Integrador 2026/2 | Compliance e Segurança da Informação

**Sistema:** WattCerto | **Professora:** Edna Mataruco Duarte
**Equipe:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien e Pedro Accorsi

Este documento mostra os requisitos de segurança do WattCerto: quais dados o sistema trata, como ele cumpre a LGPD desde o projeto (Privacy by Design), quais são as vulnerabilidades e como cada uma foi tratada, com base no OWASP Top 10 e no NIST.

---

## 1. Como o sistema funciona (o que precisa ser protegido)

| Parte | Onde roda | O que guarda |
|---|---|---|
| Site (HTML, CSS, JavaScript) | Netlify, com HTTPS | Nada da pessoa. A simulação fica só no navegador de quem usa. |
| Formulário de contato | Netlify Forms | Nome, e-mail, assunto e mensagem de quem escreve, com consentimento. |
| Programa em Python | Computador da equipe | Nada; lê arquivos e o banco. A senha do banco fica no arquivo `.env`, fora do GitHub. |
| Banco MySQL | Servidor da Fatec (professor Banin) | Catálogo de aparelhos, tarifas, bandeiras, fontes, notícias e as mensagens de contato importadas. |

---

## 2. Inventário de dados (que dados o sistema trata)

| Dado | Onde fica | Classificação LGPD | Finalidade | Base legal | Quanto tempo fica |
|---|---|---|---|---|---|
| Aparelhos, horas de uso, nº de pessoas, valor da fatura (simulação) | Só no navegador do usuário | Pode ser dado pessoal se ligado a alguém, mas **não é coletado** | Fazer o cálculo na tela | Não há tratamento pela equipe | Até a pessoa fechar ou recarregar a página |
| Nome e e-mail do contato | Netlify Forms e tabela `mensagem_contato` | Dado pessoal comum (art. 5º, I) | Responder a quem escreveu | Consentimento (art. 7º, I), com caixa de "Concordo" obrigatória | 180 dias após o envio (`apagar_em`) |
| Assunto e texto da mensagem | Netlify Forms e `mensagem_contato` | Pode conter dado pessoal se a pessoa escrever | Responder | Consentimento | 180 dias |
| Dados técnicos do envio (data e informações de conexão que o Netlify usa contra spam) | Netlify | Dado pessoal (identificador online) | Filtrar spam | Legítimo interesse (art. 7º, IX) | Apagar junto com a mensagem no painel do Netlify |
| Catálogo, tarifas, bandeiras, fontes, notícias | Banco e `dados/catalogo.json` | Não é dado pessoal | Funcionamento da calculadora | Não se aplica | Enquanto o projeto existir |
| Usuário e senha do banco | Arquivo `.env` no computador da equipe | Credencial (segredo) | Acesso ao banco | Não se aplica | Trocar ao fim do semestre |

### O sistema armazena dados sensíveis?

**Não.** Dado sensível, pela LGPD (art. 5º, II), é origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato, dado de saúde ou vida sexual, genético ou biométrico. O WattCerto não pede nenhum deles. O formulário de contato pede só nome, e-mail, assunto e mensagem. O único risco é a pessoa escrever um dado sensível no texto por conta própria; por isso a mensagem tem limite de 600 caracteres e prazo para ser apagada.

---

## 3. Privacy by Design: os 7 princípios aplicados

| Princípio | Como o WattCerto aplica |
|---|---|
| 1. Proativo, não reativo | A decisão de não guardar a simulação foi tomada antes de escrever o código (decisão D1 do banco de dados). |
| 2. Privacidade como padrão | Sem cadastro e sem login. Quem só usa a calculadora não entrega nenhum dado. |
| 3. Privacidade incorporada ao design | O banco não tem tabela de simulação; `mensagem_contato` não se liga a nenhuma outra tabela, para poder ser apagada sem afetar o resto. |
| 4. Funcionalidade total (soma positiva) | A calculadora funciona por completo sem coletar dados: privacidade não custou nenhuma função. |
| 5. Segurança de ponta a ponta (ciclo de vida) | O dado de contato entra com consentimento, tem data de exclusão (`apagar_em`) e uma rotina no Python apaga o que venceu. |
| 6. Visibilidade e transparência | A página de Contato avisa: "Usamos o que você escreve só para responder ao seu contato." O código é aberto no GitHub. |
| 7. Respeito à privacidade do usuário | Consentimento explícito numa caixa obrigatória, não marcada por padrão; a pessoa pode pedir a exclusão pelo próprio formulário. |

### Direitos do titular (art. 18)

Quem escreveu pode pedir, pelo formulário de contato, para ver, corrigir ou apagar a própria mensagem. A equipe apaga a linha em `mensagem_contato` e o envio no painel do Netlify, e responde confirmando.

---

## 4. Requisitos de segurança do sistema

| Nº | Requisito |
|---|---|
| RS1 | Todo acesso ao site deve ser por HTTPS (garantido pelo Netlify). |
| RS2 | O site só pode carregar scripts, estilos, fontes e imagens dele mesmo (Content-Security-Policy no arquivo `_headers`). A única exceção é o quadro (iframe) da página Mídia, liberado só para `www.youtube-nocookie.com`, a versão do YouTube que não grava cookies até a pessoa dar play. Os cabeçalhos do `_headers` valem no Netlify; no Railway eles precisam ser configurados no servidor. |
| RS3 | Todo comando SQL deve usar parâmetros; nenhum valor digitado pode ser colado no texto do SQL. |
| RS4 | Todo dado que entra no banco deve ser validado antes (tipo, tamanho, faixa, formato de e-mail). |
| RS5 | Senhas e dados de acesso ao banco nunca podem ficar no código nem no GitHub. |
| RS6 | O usuário do banco deve ter permissão só no banco `wattcerto` (privilégio mínimo). |
| RS7 | Mensagem de contato só pode ser guardada com consentimento, e deve ser apagada até 180 dias depois. |
| RS8 | Dados vindos de fora (catálogo, mensagens) devem ser mostrados na tela como texto, nunca como HTML. |

---

## 5. Análise de ameaças e tratativas

Classificação de cada ameaça pelo modelo **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) e pela categoria do **OWASP Top 10 (edição 2021)**. Risco = probabilidade × impacto (baixo, médio, alto).

| Nº | Ameaça | STRIDE / OWASP | Risco | Tratativa | Situação |
|---|---|---|---|---|---|
| **A1** | **Injeção de SQL**: alguém escreve um comando SQL no formulário de contato (ex.: `'); DROP TABLE aparelho; --`) e ele é executado quando a mensagem é importada para o banco. | Tampering / **A03 Injection** | Alto | Todos os comandos do Python usam parâmetros (`%s`) com o `mysql-connector`: o valor vai separado do SQL e nunca é executado. A importação ainda valida tamanho e formato antes de gravar. | Implementado (`banco.py`, `contato.py`) |
| **A2** | **XSS (script malicioso na página)**: um texto com `<script>` entra no catálogo ou numa mensagem e roda no navegador de quem abre. | Tampering / **A03 Injection** | Médio | A calculadora monta a lista com `textContent` (o navegador mostra como texto, não executa). A Content-Security-Policy bloqueia qualquer script que não seja arquivo do próprio site, mesmo se um entrar. As mensagens não são mostradas no site. | Implementado (`js/calculadora.js`, `_headers`) |
| **A3** | **Vazamento da senha do banco**: a senha é publicada sem querer no GitHub, que é público. | Information disclosure / **A07 Identification and Authentication Failures** e **A05 Security Misconfiguration** | Alto | A senha fica em `.env`, listado no `.gitignore`; o repositório só tem `.env.exemplo` sem senha. O usuário do banco só tem acesso ao banco `wattcerto`. Se vazar, trocar a senha na hora. | Implementado |
| **A4** | **Spam e robôs no formulário**: robôs enviam centenas de mensagens, enchendo o banco e escondendo as mensagens reais. | Denial of service / **A04 Insecure Design** | Médio | Campo armadilha (honeypot) invisível: gente não preenche, robô preenche e o Netlify descarta. O Netlify filtra spam. O Python valida cada linha e recusa as inválidas ao importar. | Implementado (`contato.html`, `contato.py`) |
| **A5** | **Guardar dado pessoal além do necessário**: mensagens antigas ficam para sempre, e um vazamento futuro expõe nomes e e-mails de anos. | Information disclosure / LGPD art. 6º (necessidade) e art. 15 | Médio | Cada mensagem tem `apagar_em` (180 dias). A opção 9 do programa apaga as vencidas. O banco recusa mensagem sem consentimento (CHECK). | Implementado; falta rodar a rotina todo mês |
| **A6** | **Clickjacking**: outro site coloca o WattCerto dentro de um quadro invisível para enganar cliques. | Spoofing / **A05 Security Misconfiguration** | Baixo | Cabeçalhos `X-Frame-Options: DENY` e `frame-ancestors 'none'`. | Implementado (`_headers`) |
| **A7** | **Catálogo adulterado**: alguém altera `dados/catalogo.json` ou os CSVs e o site passa a mostrar números falsos. | Tampering / **A08 Software and Data Integrity Failures** | Médio | O catálogo só é gerado pelo programa a partir do banco, que valida faixas (potência, horas) e fonte. O site só publica o que está no repositório, com histórico de quem mudou o quê. Teste automático confere que os números do Python batem com os do site. | Implementado |
| **A8** | **Componente desatualizado com falha conhecida**. | **A06 Vulnerable and Outdated Components** | Baixo | O site não usa biblioteca JavaScript de fora. O Python usa uma biblioteca só, com versão fixa (`requirements.txt`), que deve ser atualizada a cada semestre. | Implementado |
| **A9** | **Site fora do ar por fim dos créditos do Netlify** (300 por mês; cada publicação gasta 15). | Denial of service | Médio | Testar tudo no computador e publicar em lote, no máximo uma vez por dia de trabalho. Acompanhar os créditos no painel. | Processo combinado pela equipe |
| **A10** | **Sem registro de incidentes**: um ataque acontece e ninguém percebe. | Repudiation / **A09 Security Logging and Monitoring Failures** | Baixo | O Netlify guarda o histórico de publicações e de envios. A equipe confere o painel de formulários toda semana. Em caso de vazamento de dado pessoal, comunicar os titulares e a ANPD (LGPD, art. 48). | Parcial: depende de rotina da equipe |

**Categorias do OWASP que não se aplicam:** A01 (Broken Access Control) e A02 (Cryptographic Failures) quase não se aplicam porque o site não tem login nem área restrita, e o HTTPS é feito pelo Netlify. A10 (SSRF) não se aplica porque o site não faz requisições a outros servidores a partir de dados do usuário.

---

## 6. Relação com o NIST Cybersecurity Framework 2.0

| Função do NIST | O que o WattCerto faz |
|---|---|
| **Governar** | Regras escritas neste documento; decisões registradas no histórico do banco. |
| **Identificar** | Inventário de dados (seção 2) e análise de ameaças (seção 5). |
| **Proteger** | HTTPS, Content-Security-Policy, SQL com parâmetros, validação, privilégio mínimo no banco, senha fora do código, minimização de dados. |
| **Detectar** | Conferência semanal do painel do Netlify; o programa avisa as linhas rejeitadas ao importar. |
| **Responder** | Em vazamento: trocar a senha, apagar o dado exposto, avisar os titulares e a ANPD. |
| **Recuperar** | O site volta a uma versão anterior pelo histórico do Netlify ou do Git; o banco é recriado pelo script `01_criar_banco.sql` e recarregado pelos CSVs. |

---

## 7. O que ainda falta (próximos passos)

1. Publicar um texto curto de privacidade no site (o que é coletado, por quanto tempo e como pedir a exclusão).
2. Conferir no painel do Netlify quais dados técnicos ele guarda de cada envio e o prazo, e registrar aqui. O Netlify é uma empresa dos Estados Unidos: isso é transferência internacional de dados (LGPD, art. 33) e deve ser informado no texto de privacidade.
3. Combinar quem da equipe roda, todo mês, a rotina que apaga as mensagens vencidas.
