# Contraste das cores do site

Calculado pela fórmula do WCAG 2.2 (luminância relativa), com as cores do `css/style.css`. Mínimos do nível AA: 4,5:1 para texto normal, 3:1 para texto grande (títulos) e para contornos e ícones.

| Combinação | Texto | Fundo | Contraste | Mínimo AA | Resultado |
|---|---|---|---|---|---|
| Texto principal (--ink) sobre o bege (--bg) | `#14261d` | `#faf6ee` | 14,7:1 | 4,5:1 | Passa |
| Texto de apoio (--muted) sobre o bege | `#455a4f` | `#faf6ee` | 6,9:1 | 4,5:1 | Passa |
| Texto de apoio (--muted) sobre o branco | `#455a4f` | `#ffffff` | 7,4:1 | 4,5:1 | Passa |
| Títulos verde-escuro (--verde-900) sobre o bege | `#11392b` | `#faf6ee` | 11,9:1 | 3,0:1 | Passa |
| Frase laranja acima dos títulos (#b34c08) sobre o bege | `#b34c08` | `#faf6ee` | 4,9:1 | 4,5:1 | Passa |
| Frase laranja acima dos títulos (#b34c08) sobre o branco | `#b34c08` | `#ffffff` | 5,3:1 | 4,5:1 | Passa |
| Links verdes (--verde-700) sobre o bege | `#1b5e43` | `#faf6ee` | 7,1:1 | 4,5:1 | Passa |
| Texto claro (#eaf4ee) sobre a faixa verde (--verde-900) | `#eaf4ee` | `#11392b` | 11,4:1 | 4,5:1 | Passa |
| Texto de apoio (#cfe3d6) sobre a faixa verde | `#cfe3d6` | `#11392b` | 9,5:1 | 4,5:1 | Passa |
| Amarelo (--sol-400) sobre a faixa verde | `#f4c04e` | `#11392b` | 7,6:1 | 4,5:1 | Passa |
| Branco sobre o botão verde (--verde-700) | `#ffffff` | `#1b5e43` | 7,7:1 | 4,5:1 | Passa |
| Consumo alto (--nivel-alto-texto) sobre o fundo rosado | `#a63a2e` | `#f9e4e1` | 5,3:1 | 4,5:1 | Passa |
| Consumo médio (--nivel-medio-texto) sobre o fundo creme | `#8a4b00` | `#fcedda` | 5,9:1 | 4,5:1 | Passa |
| Contorno de foco (--foco) sobre o bege | `#1d4ed8` | `#faf6ee` | 6,2:1 | 3,0:1 | Passa |

Teste automático complementar: axe-core 4 (regras WCAG 2.0, 2.1 e 2.2 nível AA) nas 11 páginas, 0 problemas de contraste (`acessibilidade-axe.json`).
