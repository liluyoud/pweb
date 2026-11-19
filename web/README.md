# 🌐 Site da aula: Controle Acadêmico passo a passo

Apresentação em formato de **página web** que explica o projeto [`academico`](../academico/README.md):
conceitos (com base no [glossário](../docs/glossario.md)), stack, monorepo, banco de dados,
API, site, como criar do zero, como executar e como depurar.

São **84 slides** no padrão visual Afya, todos em uma página.

## Como abrir

Dê dois cliques em **`index.html`**. Não precisa de servidor nem de internet.

## Atalhos

| Tecla | Ação |
| --- | --- |
| `→` `Espaço` `PageDown` | Próximo slide |
| `←` `PageUp` | Slide anterior |
| `Home` / `End` | Primeiro / último slide |
| `N` | Mostra/esconde as **notas do professor** |
| `G` | **Visão geral** em grade (clique em um slide para abrir) |
| `F` | Tela cheia |

Clicar na metade direita avança e na metade esquerda volta. No celular, arraste para os lados.
O número do slide fica no endereço (`index.html#36`), então dá para abrir um slide direto.

> 🖨️ Para gerar um PDF: `Ctrl + P` → *Salvar como PDF* (um slide por página).

## Pastas

```
web/
├── index.html          ← a apresentação (gerada pelo gerador)
├── estilo.css          ← visual: capa, seções e slides de conteúdo
├── apresentacao.js     ← navegação (teclado, notas, visão geral)
├── assets/             ← fundos, logo e ícone da aba
├── docs/
│   └── roteiro-slides.md ← o que vai em cada slide (e o que já foi feito)
└── gerador/            ← código que monta o index.html
    ├── secoes/         ← um arquivo por seção do roteiro (s00 a s12)
    ├── lib.js          ← ajudantes: cartões, código, tabelas, ícones
    ├── build.js        ← junta as seções e escreve o index.html
    └── gerar-fundos.js ← recria as imagens de fundo
```

## Como alterar um slide

1. Edite o arquivo da seção em `gerador/secoes/` (ex.: `s05-banco.js`).
2. Gere de novo:

```bash
cd web/gerador
bun install      # só na primeira vez
bun build.js
```

3. Recarregue o `index.html` no navegador.

Não edite o `index.html` à mão: ele é sobrescrito a cada geração.
