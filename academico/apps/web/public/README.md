# 📁 apps/web/public: arquivos públicos

Arquivos colocados aqui são entregues ao navegador **exatamente como estão**,
sem nenhum processamento.

| Arquivo | O que é |
| --- | --- |
| `favicon.svg` | O ícone que aparece na **aba** do navegador |

## Quando usar esta pasta?

Para arquivos que precisam de um endereço fixo. Por exemplo, `public/favicon.svg`
fica disponível em `http://localhost:5173/favicon.svg`, e o `index.html` aponta
para ele:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Imagens usadas **dentro dos componentes** normalmente ficam em `src/` e são
importadas no código. Neste projeto não precisamos disso.
