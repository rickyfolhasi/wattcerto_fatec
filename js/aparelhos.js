/* WattCerto: catálogo dos aparelhos que a pessoa pode adicionar na calculadora.

   Os quatro aparelhos que quase toda casa tem (chuveiro, geladeira, máquina de
   lavar e iluminação) já estão escritos direto no calculadora.html. Os demais
   ficam aqui e aparecem na lista do botão "Adicionar aparelho".

   Cada aparelho declara QUAL regra de cálculo usa (campo "tipo") e os valores
   de partida que aparecem nos campos. A pessoa pode alterar tudo.

   Tipos de cálculo (mesmas regras do motor de cálculo do projeto):
     tempo         potência × horas por dia × quantidade × 30 ÷ 1000
     standby       (potência × horas de uso + potência em espera × horas parado)
                   × quantidade × 30 ÷ 1000
     evento        potência × (minutos por uso ÷ 60) × usos no mês ÷ 1000
     climatizacao  potência média × horas por dia × quantidade × 30 ÷ 1000
                   × (meses de uso por ano ÷ 12): a média de um mês do ano.
                   O padrão é 12 meses, que reproduz a tabela da Procel;
                   quem só liga no calor informa menos meses.
     ciclo         consumo da etiqueta Inmetro (kWh/mês) × quantidade

   Campo "fonte":
     "procel"    valor medido na tabela de consumo da Procel/Eletrobras
     "derivado"  calculado por nós a partir da tabela da Procel (conta na nota)
     "tipico"    potência típica de mercado; confirmar na etiqueta do aparelho

   Nunca mude um número aqui sem anotar a fonte. */

var GRUPOS_APARELHOS = ["Climatização", "Cozinha", "Eletrônicos", "Casa e cuidados"];

var CATALOGO_APARELHOS = [
  /* ---------- Climatização ---------- */
  {
    id: "ar_janela_9000",
    nome: "Ar-condicionado de janela 9.000 BTU",
    grupo: "Climatização",
    tipo: "climatizacao",
    valores: { potencia: 537, horas: 8, meses: 12, quantidade: 1 },
    fonte: "derivado",
    nota: "Procel: 128,8 kWh/mês com 8 h por dia. 128,8 ÷ 240 h = 537 W médios."
  },
  {
    id: "ar_split_9000",
    nome: "Ar-condicionado split 9.000 BTU",
    grupo: "Climatização",
    tipo: "climatizacao",
    valores: { potencia: 593, horas: 8, meses: 12, quantidade: 1 },
    fonte: "derivado",
    nota: "Procel: 142,3 kWh/mês com 8 h por dia. 142,3 ÷ 240 h = 593 W médios."
  },
  {
    id: "ar_split_12000",
    nome: "Ar-condicionado split 12.000 BTU",
    grupo: "Climatização",
    tipo: "climatizacao",
    valores: { potencia: 790, horas: 8, meses: 12, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "ventilador",
    nome: "Ventilador",
    grupo: "Climatização",
    tipo: "climatizacao",
    valores: { potencia: 100, horas: 8, meses: 12, quantidade: 1 },
    fonte: "tipico"
  },

  /* ---------- Cozinha ---------- */
  {
    id: "micro_ondas",
    nome: "Micro-ondas",
    grupo: "Cozinha",
    tipo: "evento",
    valores: { potencia: 1200, minutos: 8, usos: 30 },
    fonte: "tipico"
  },
  {
    id: "air_fryer",
    nome: "Air fryer",
    grupo: "Cozinha",
    tipo: "evento",
    valores: { potencia: 1500, minutos: 20, usos: 16 },
    fonte: "tipico"
  },
  {
    id: "lava_loucas",
    nome: "Lava-louças",
    grupo: "Cozinha",
    tipo: "evento",
    valores: { potencia: 1200, minutos: 90, usos: 12 },
    fonte: "tipico"
  },
  {
    id: "freezer",
    nome: "Freezer horizontal",
    grupo: "Cozinha",
    tipo: "ciclo",
    potenciaW: 220,
    valores: { etiqueta: 62, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "bebedouro",
    nome: "Bebedouro elétrico",
    grupo: "Cozinha",
    tipo: "ciclo",
    potenciaW: 100,
    valores: { etiqueta: 25, quantidade: 1 },
    fonte: "tipico"
  },

  /* ---------- Eletrônicos ---------- */
  {
    id: "tv",
    nome: "Televisão",
    grupo: "Eletrônicos",
    tipo: "standby",
    valores: { potencia: 80, horas: 5, espera: 0.5, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "computador",
    nome: "Computador de mesa",
    grupo: "Eletrônicos",
    tipo: "tempo",
    valores: { potencia: 150, horas: 4, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "notebook",
    nome: "Notebook",
    grupo: "Eletrônicos",
    tipo: "tempo",
    valores: { potencia: 60, horas: 4, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "roteador",
    nome: "Roteador de internet",
    grupo: "Eletrônicos",
    tipo: "standby",
    valores: { potencia: 10, horas: 24, espera: 10, quantidade: 1 },
    fonte: "tipico",
    nota: "Fica ligado o mês inteiro: 10 W por 24 h dão 7,2 kWh/mês."
  },
  {
    id: "videogame",
    nome: "Videogame",
    grupo: "Eletrônicos",
    tipo: "standby",
    valores: { potencia: 160, horas: 2, espera: 1, quantidade: 1 },
    fonte: "tipico"
  },

  /* ---------- Casa e cuidados ---------- */
  {
    id: "ferro",
    nome: "Ferro de passar",
    grupo: "Casa e cuidados",
    tipo: "evento",
    valores: { potencia: 1000, minutos: 60, usos: 8 },
    fonte: "tipico"
  },
  {
    id: "secador",
    nome: "Secador de cabelo",
    grupo: "Casa e cuidados",
    tipo: "evento",
    valores: { potencia: 1500, minutos: 10, usos: 30 },
    fonte: "tipico"
  },
  {
    id: "bomba_agua",
    nome: "Bomba d'água",
    grupo: "Casa e cuidados",
    tipo: "tempo",
    valores: { potencia: 370, horas: 0.5, quantidade: 1 },
    fonte: "tipico"
  },
  {
    id: "lampada_incandescente",
    nome: "Lâmpadas incandescentes",
    grupo: "Casa e cuidados",
    tipo: "tempo",
    valores: { potencia: 60, horas: 5, quantidade: 10 },
    rotulos: { potencia: "Potência de cada lâmpada (W)", quantidade: "Quantidade de lâmpadas" },
    fonte: "procel",
    nota: "Procel: uma lâmpada de 60 W acesa 5 h por dia gasta 9 kWh/mês."
  }
];
