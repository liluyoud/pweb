# 📦 packages/: código compartilhado

Aqui fica o código que **não roda sozinho**, mas é **usado** pelos programas de `apps/`.

| Pasta | O que é | Usado por |
| --- | --- | --- |
| [tipos/](tipos/README.md) | O formato de cada dado do sistema (Aluno, Professor...) | `api` e `web` |

## Por que isso é tão útil?

Sem o pacote compartilhado, a API e o site teriam **cada um a sua cópia** do tipo
`Aluno`. Se alguém acrescentasse um campo em um e esquecesse do outro... bug!

Com o pacote, existe **uma única definição**. Mude lá e o TypeScript vai apontar,
nos dois programas, todo lugar que precisa ser ajustado.

## Como um app usa um pacote daqui?

1. O pacote tem um **nome** no seu `package.json`: `"name": "@academico/tipos"`.
2. O app declara a dependência: `"@academico/tipos": "workspace:*"`.
3. O `bun install` liga os dois (o `workspace:*` diz "está aqui no monorepo").
4. O código importa normalmente:
   ```ts
   import type { Aluno } from "@academico/tipos";
   ```

## Ideias de outros pacotes

Em projetos maiores, é comum ter aqui também:

- `validacoes/`: funções para validar CPF, e-mail... (usadas na API **e** no site);
- `config/`: configurações compartilhadas de TypeScript ou de estilo.
