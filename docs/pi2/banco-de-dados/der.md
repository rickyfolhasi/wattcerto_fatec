# DER | WattCerto

Diagrama: `der.png` (imagem) e `der.svg` (vetor, para ampliar sem perder qualidade). Fonte editável: `der.mmd` (Mermaid).

Notação pé de galinha: `||` exatamente um, `|o` zero ou um, `o{` zero ou muitos, `|{` um ou muitos.

## Relacionamentos e cardinalidades

| Relacionamento | Cardinalidade | Leitura |
|---|---|---|
| grupo_aparelho agrupa aparelho | 1 : 0..N | Todo aparelho está em exatamente um grupo. Um grupo pode ter nenhum ou vários aparelhos. |
| tipo_calculo define o cálculo de aparelho | 1 : 0..N | Todo aparelho usa exatamente uma regra de cálculo. Uma regra pode servir a vários aparelhos. |
| fonte comprova o valor de aparelho | 0..1 : 0..N | Aparelho com valor típico de mercado não tem fonte; com valor da Procel ou derivado, tem exatamente uma (regra garantida pelo CHECK `ck_aparelho_fonte`). |
| distribuidora cobra tarifa | 1 : 0..N | Cada tarifa é de uma distribuidora. Uma distribuidora tem o histórico de várias tarifas, uma por período. |
| fonte comprova tarifa | 1 : 0..N | Toda tarifa tem fonte. |
| fonte comprova bandeira | 1 : 0..N | Todo acréscimo de bandeira tem fonte (ANEEL). |
| bandeira vale em bandeira_mes | 1 : 0..N | Cada mês tem exatamente uma bandeira. A mesma bandeira pode valer em vários meses. |
| fonte anuncia bandeira_mes | 1 : 0..N | O anúncio da bandeira do mês tem fonte. |
| noticia cita fonte (via noticia_fonte) | N : N | Uma notícia cita uma ou mais fontes; uma fonte pode ser citada por várias notícias. A tabela associativa `noticia_fonte` tem chave primária composta (id_noticia, id_fonte). "Pelo menos uma fonte por notícia" é regra do programa (o banco sozinho não consegue exigir). |

`mensagem_contato` fica **sem relacionamento de propósito**: é o único dado pessoal do sistema e não precisa estar ligado a mais nada. Isolar o dado pessoal facilita apagar no prazo e responder a um pedido de exclusão (LGPD).
