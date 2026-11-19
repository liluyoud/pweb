# 📁 apps/api/src: código da API

```
src/
├── index.ts      ← PORTA DE ENTRADA: liga o servidor e diz qual função atende cada endereço
├── rotas/        ← o que acontece em cada endereço (listar, criar, atualizar, excluir...)
├── regras/       ← regras de negócio (ex.: como calcular aprovado/reprovado)
├── banco/        ← tudo sobre o banco: conexão, criação de tabelas e dados de exemplo
└── documentacao/ ← a descrição da API (OpenAPI), mostrada pelo Scalar em /api/docs
```

## Por que dividir assim?

Cada pasta tem **uma responsabilidade**:

| Pasta | Pergunta que ela responde |
| --- | --- |
| `index.ts` | *Quais endereços existem?* |
| `rotas/` | *O que fazer quando alguém acessa este endereço?* |
| `regras/` | *Quais são as regras da faculdade?* |
| `banco/` | *Como os dados são guardados?* |
| `documentacao/` | *Como explicar a API para quem vai usá-la?* |

Quando algo precisar mudar, você sabe **exatamente onde procurar**.

## O caminho de um pedido

```
GET /api/alunos
      │
      ▼
index.ts         →  "/api/alunos" + GET  =  alunos.listar
      │
      ▼
rotas/alunos.ts  →  banco.query("SELECT * FROM alunos").all()
      │
      ▼
banco/conexao.ts →  lê o arquivo academico.sqlite
      │
      ▼
Response.json([...])  →  volta para quem pediu
```

## O `index.ts` em detalhes

```ts
Bun.serve({
  port: 3333,
  routes: {
    "/api/alunos":     { GET: alunos.listar, POST: alunos.criar },
    "/api/alunos/:id": { GET: alunos.buscar, PUT: alunos.atualizar, DELETE: alunos.excluir },
    ...
  },
  fetch() { ... },   // endereço que não existe → 404
  error() { ... },   // alguma rota deu erro → mensagem amigável
});
```

- `:id` é uma parte **variável** do endereço. Em `/api/alunos/7`, o `id` vale `"7"`
  e é lido na rota com `req.params.id`.
- A função `error` é uma **rede de segurança**: se qualquer rota der erro (como um
  CPF repetido), a API não cai. Ela responde com uma mensagem em português.
