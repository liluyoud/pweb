# 📁 apps/: os programas

Aqui ficam os **programas que rodam**, aqueles que você liga com `bun run dev`.

| Pasta | O que é | Porta |
| --- | --- | --- |
| [api/](api/README.md) | O **servidor**: recebe pedidos, consulta o banco e devolve JSON | 3333 |
| [web/](web/README.md) | O **site**: as telas que o usuário vê no navegador | 5173 |

## Por que separar `apps/` de `packages/`?

É uma convenção muito usada em monorepos:

- **`apps/`**: coisas que **rodam sozinhas** (têm um comando `dev` ou `start`).
- **`packages/`**: código que **não roda sozinho**, só é **usado** pelos apps.

Assim, só de olhar a estrutura, qualquer pessoa entende o que é programa e o que é
biblioteca.

## Como os dois conversam?

```
 navegador ──► web (5173) ──/api/...──► api (3333) ──► academico.sqlite
```

O site **nunca** acessa o banco diretamente. Ele sempre pede à API. Essa separação
é importante: o banco fica protegido "atrás" da API.
