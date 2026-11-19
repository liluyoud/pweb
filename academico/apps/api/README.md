# 🍳 apps/api: o servidor

A API é a "cozinha" do sistema: recebe pedidos do site, busca ou grava no banco de
dados e devolve a resposta em **JSON**. Ela **não tem telas**.

Feita com:

- **Bun**: roda o servidor (`Bun.serve`) e fala com o banco (`bun:sqlite`).
- **SQLite**: banco de dados em um único arquivo.
- **Nenhum framework**: é de propósito, para você ver como tudo funciona por dentro.

## Estrutura

```
api/
├── src/                  ← todo o código (veja src/README.md)
│   ├── index.ts          ← liga o servidor e lista as rotas
│   ├── banco/            ← conexão, tabelas e dados de exemplo
│   ├── rotas/            ← o que cada endereço faz
│   ├── regras/           ← regras de negócio (cálculo de notas)
│   └── documentacao/     ← descrição da API (OpenAPI) para o Scalar
├── academico.sqlite      ← o banco (criado sozinho; não vai para o Git)
├── package.json          ← nome, scripts e dependências da API
└── tsconfig.json         ← configuração do TypeScript
```

## Comandos

Rode da **raiz** do monorepo:

| Comando | O que faz |
| --- | --- |
| `bun run dev:api` | Liga a API e **reinicia sozinha** quando você salva um arquivo |
| `bun run banco:popular` | Apaga tudo e coloca dados de exemplo |

Ou de **dentro** desta pasta: `bun run dev`, `bun run start`, `bun run banco:popular`.

## Testando no navegador

Com a API ligada, abra:

- http://localhost:3333/api/docs: **documentação interativa (Scalar)**. Lista todos
  os endereços e permite testá-los com o botão *Test Request*.
- http://localhost:3333/api/alunos
- http://localhost:3333/api/dashboard

Consulte a [referência da API](../../docs/api.md) e o [guia do Scalar](../../../docs/scalar.md).

## Dependências

| Pacote | Para que serve |
| --- | --- |
| `@academico/tipos` | Os tipos compartilhados do monorepo |
| `@scalar/client-side-rendering` | Gera a página de documentação `/api/docs` |
| `@types/bun` (dev) | Ensina ao TypeScript as funções do Bun |

O SQLite **não** aparece na lista porque já vem embutido no Bun (`bun:sqlite`).

## Por onde começar a ler o código?

1. [src/index.ts](src/index.ts): o "cardápio" de rotas.
2. [src/rotas/alunos.ts](src/rotas/alunos.ts): um CRUD completo, bem comentado.
3. [src/banco/criar-tabelas.ts](src/banco/criar-tabelas.ts): as tabelas.
4. [src/regras/notas.ts](src/regras/notas.ts): a regra de aprovação.
5. [src/documentacao/openapi.ts](src/documentacao/openapi.ts): a descrição da API para o Scalar.
