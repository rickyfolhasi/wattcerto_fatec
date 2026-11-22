# Projeto Integrador 2026/2 | Engenharia de Software II

**Sistema:** WattCerto, calculadora de consumo de energia residencial
**Professor:** Celso Gallão | **Curso:** Análise e Desenvolvimento de Sistemas, Fatec Antônio Russo
**Equipe:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien e Pedro Accorsi

---

## 1. Declaração do sistema

| Item | Descrição |
|---|---|
| **Função principal deste sistema** | Estimar o consumo mensal de energia elétrica (em kWh) e o custo (em R$) de uma residência, aparelho por aparelho, mostrando quais aparelhos mais pesam na conta e quanto a família economizaria trocando um aparelho por um modelo mais eficiente. |
| **Pré-condições** | 1. O usuário acessa o site por um navegador com JavaScript ativo. 2. O usuário informa a tarifa em R$ por kWh (está na fatura de energia) ou aceita o valor de exemplo. 3. Para cada aparelho, o usuário informa ou aceita os valores de partida (potência, tempo de uso, quantidade). 4. O catálogo de aparelhos (`dados/catalogo.json`) foi gerado pela equipe a partir do banco de dados. |
| **Entradas** | Número de pessoas na casa; tarifa em R$/kWh; valor da última fatura (opcional, para comparar); para cada aparelho: potência em watts, horas de uso por dia ou minutos por uso e usos no mês, quantidade e, conforme o aparelho, consumo da etiqueta Inmetro (kWh/mês), potência em espera, meses de uso no ano; para o chuveiro: estação (inverno ou verão), minutos de banho e banhos por pessoa por dia. |
| **Descrição das funcionalidades principais** | 1. Calcular o consumo mensal de cada aparelho com a regra adequada ao tipo de uso (por tempo, por uso, com espera, climatização, pela etiqueta e banho). 2. Calcular o custo mensal e anual de cada aparelho e da casa. 3. Ordenar os aparelhos do maior para o menor consumo e mostrar a participação de cada um na conta, com nível indicado por cor e por texto (alto, médio, baixo). 4. Comparar o total estimado com o valor da fatura informada e apontar se a conta veio acima do esperado. 5. Simular a troca de um aparelho por outro de menor potência e mostrar a economia em kWh e em R$ por mês e por ano. 6. Permitir incluir aparelhos de um catálogo agrupado (climatização, cozinha, eletrônicos, casa) ou um aparelho fora da lista. 7. Calcular o chuveiro em modo avançado (estação, minutos e pessoas) ou padrão (horas por dia). 8. Mostrar a fonte de cada valor de partida (Procel, derivado da Procel ou valor típico de mercado). |
| **Saídas** | Consumo total da casa em kWh por mês; custo em R$ por mês e por ano; tabela por aparelho com kWh, custo e participação percentual; comparação com a fatura; resultado da simulação de troca (kWh e R$ economizados por mês e por ano); avisos de validação quando um campo está fora da faixa aceita. |
| **Entidades externas** | Usuário (morador que simula a própria casa); equipe administradora (mantém o catálogo pelo programa em Python e o banco MySQL); ANEEL (define tarifas e bandeiras tarifárias); Procel/Inmetro (tabelas e etiquetas de consumo dos aparelhos); distribuidora de energia, como a Enel SP (emite a fatura com a tarifa); Netlify (hospeda o site e recebe o formulário de contato). |
| **Pós-condições** | O resultado do cálculo fica na tela do usuário; nenhum dado da simulação é enviado nem guardado em servidor (fica só no navegador); o usuário pode alterar qualquer valor e recalcular, ou simular uma troca de aparelho a partir do último cálculo. |
| **Possíveis efeitos colaterais** | 1. O usuário pode tomar uma decisão de compra com base numa estimativa que difere da conta real, porque a fatura inclui impostos, iluminação pública e bandeira, e o uso real de cada aparelho varia. 2. Valores de partida desatualizados no catálogo podem distorcer o resultado de quem não confere a etiqueta. 3. A simulação de troca pode criar expectativa de economia maior que a real se a pessoa mudar o hábito de uso junto com o aparelho. 4. Ao perceber o peso do chuveiro e do ar-condicionado, a família pode reduzir o uso, o que é o efeito desejado, mas também pode gerar conflito sobre hábitos dentro da casa. |

---

## 2. Requisitos de domínio

**RD1.** O sistema deve calcular o consumo de energia de cada aparelho pela fórmula *consumo (kWh) = potência (W) × tempo de uso (h) ÷ 1.000*, considerando o mês com 30 dias.

*Por que é de domínio:* a regra não foi escolhida pela equipe nem pedida por um cliente. Ela vem da física e da forma como o setor elétrico mede e fatura energia (em quilowatt-hora). Qualquer sistema que trate de consumo de energia precisa obedecê-la; se ela for violada, o sistema simplesmente erra.

**RD2.** O sistema deve calcular o acréscimo da bandeira tarifária sobre cada 100 kWh consumidos, com os valores definidos pela ANEEL para cada bandeira (verde: sem acréscimo; amarela: R$ 1,885; vermelha patamar 1: R$ 4,463; vermelha patamar 2: R$ 7,877).

*Por que é de domínio:* é uma regra do setor elétrico brasileiro, imposta pelo órgão regulador. A equipe não pode mudá-la; só pode representá-la corretamente e atualizar os valores quando a ANEEL os alterar.

---

## 3. Requisitos de negócio

**RN1.** Todo número apresentado pelo sistema deve ter a fonte identificada: valor medido pela Procel, valor derivado da tabela da Procel (com a conta explicada) ou valor típico de mercado, que o usuário deve conferir na etiqueta do aparelho.

*Por que é de negócio:* é uma política da organização (a equipe do WattCerto) para gerar confiança, que é o valor central do produto. Não é uma função do sistema nem uma lei do domínio; é uma decisão de como o negócio quer se posicionar diante do usuário.

**RN2.** O uso da calculadora deve ser gratuito e sem cadastro, e os dados informados na simulação não podem ser guardados pela equipe.

*Por que é de negócio:* define o modelo de negócio (acesso livre, sem coleta de dados para monetização) e reduz a barreira de entrada para o público leigo. É uma escolha estratégica da organização, que restringe as soluções técnicas possíveis.

---

## 4. Requisito funcional (função principal)

**RF1.** O sistema deve calcular, a partir das entradas informadas pelo usuário (número de pessoas, tarifa em R$/kWh e, para cada aparelho, potência, tempo de uso e quantidade), o consumo mensal estimado em kWh e o custo mensal em R$ de cada aparelho e da residência, e apresentar a lista dos aparelhos ordenada do maior para o menor consumo, com a participação percentual de cada um no total.

---

## 5. Requisitos não funcionais do RF1 (taxonomia de Sommerville)

Sommerville divide os requisitos não funcionais em **de produto** (eficiência, confiabilidade, proteção, usabilidade), **organizacionais** (ambientais, operacionais, de desenvolvimento) e **externos** (regulatórios, éticos, legais).

| Nº | Requisito | Classificação (Sommerville) |
|---|---|---|
| **RNF1** | O resultado do cálculo do RF1 deve aparecer em até 1 segundo depois que o usuário aciona "Calcular", com até 20 aparelhos na lista, em um celular intermediário. | De produto → Eficiência → **Desempenho** |
| **RNF2** | Todos os campos de entrada do RF1 devem ter rótulo visível, ser preenchíveis só com o teclado e ter contraste mínimo de 4,5:1 com o fundo (WCAG 2.1, nível AA); o nível de consumo de cada aparelho deve ser indicado por cor e também por texto. | De produto → **Usabilidade** |
| **RNF3** | O cálculo do RF1 deve ser executado inteiramente no navegador, sem depender de servidor; se o catálogo de aparelhos não carregar, o cálculo deve continuar funcionando com os quatro aparelhos fixos da página (chuveiro, geladeira, máquina de lavar e iluminação). | De produto → **Confiabilidade** (disponibilidade) |
| **RNF4** | Nenhuma entrada do RF1 (hábitos de consumo da casa, número de pessoas, valor da fatura) pode ser enviada a servidor ou armazenada fora do dispositivo do usuário, conforme os princípios de necessidade e minimização da LGPD (Lei 13.709/2018, art. 6º). | Externo → Legal → **Proteção de dados (privacidade)** |
