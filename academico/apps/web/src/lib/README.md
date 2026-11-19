# 🧰 apps/web/src/lib: funções de ajuda

Funções pequenas, que **não são telas** e **não falam com a API**. Só recebem um valor
e devolvem outro.

| Arquivo | O que tem |
| --- | --- |
| [formatar.ts](formatar.ts) | `formatarNota` (7.5 → "7,5"), `calcularMedia`, `iniciais` ("Ana Souza" → "AS") |
| [utils.ts](utils.ts) | Função `cn`, criada pelo **shadcn**, que junta classes do Tailwind |

## Por que separar essas funções?

- Várias telas usam `formatarNota`. Se estivesse copiada em cada página e
  quiséssemos mudar o formato, teríamos que mudar em todas.
- Funções que só recebem e devolvem valores são as **mais fáceis de testar**.

## A função `cn` (do shadcn)

Ela junta classes CSS, ignorando as vazias e resolvendo conflitos:

```ts
cn("p-2 text-sm", ativo && "bg-black", "p-4")
// → "text-sm bg-black p-4"   (o p-4 venceu o p-2)
```

Você vai ver ela bastante dentro de `components/ui/`. Não é obrigatório usá-la
no seu código.
