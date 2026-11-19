# Documentação interativa com Scalar e OpenAPI

OpenAPI descreve o contrato de uma API em um formato que pessoas e ferramentas conseguem ler. Scalar lê essa descrição e apresenta os caminhos, parâmetros e exemplos em uma página interativa que também pode enviar requisições.

```text
Descrição OpenAPI → rota que entrega o JSON → página do Scalar
```

## 1. O que existe em uma descrição OpenAPI?

- `info` identifica a API e sua versão.
- `paths` reúne os caminhos e os métodos, como `GET /api/atividades`.
- `parameters` descreve valores da URL. O `id` pode vir no caminho e o filtro `concluida` pode vir na consulta.
- `requestBody` descreve o corpo que a API recebe.
- `responses` descreve os códigos de status, tipos de conteúdo e formatos de resposta.
- `components.schemas` guarda esquemas que podem ser reutilizados com `$ref`.

Em OpenAPI, escreva `/api/atividades/{id}` e declare `id` como um parâmetro com `in: "path"` e `required: true`. O Bun usa `:id` no mapa de rotas e expõe o valor em `req.params.id`.

### Comparar o esquema com o tipo TypeScript

| TypeScript | Esquema OpenAPI 3.1 |
| --- | --- |
| `titulo: string` | `titulo: { type: "string" }` |
| `id: number`, com IDs inteiros | `id: { type: "integer" }` |
| `concluida: boolean` | `concluida: { type: "boolean" }` |
| `observacao: string \| null` | `observacao: { type: ["string", "null"] }` |
| `situacao: "pendente" \| "concluida"` | `situacao: { type: "string", enum: ["pendente", "concluida"] }` |

Liste em `required` os campos que precisam estar presentes em cada objeto. Separe o esquema de criação, com os campos que o cliente preenche, do esquema de resposta, que pode trazer um ID gerado pelo banco. A validação dos dados recebidos acontece no código da API.

## 2. Documentar a rota do exemplo

Ao lado do `servidor.ts` do [guia de API](api.md), crie `openapi.ts` com a descrição abaixo. Ela corresponde ao corpo devolvido por `GET /api/atividades`.

```ts
export const especificacao = {
  openapi: "3.1.0",
  info: { title: "API de Atividades", version: "1.0.0" },
  paths: {
    "/api/atividades": {
      get: {
        summary: "Listar atividades",
        responses: {
          "200": {
            description: "Lista de atividades",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Atividade" },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Atividade: {
        type: "object",
        required: ["id", "titulo", "concluida"],
        properties: {
          id: { type: "integer" },
          titulo: { type: "string" },
          concluida: { type: "boolean" },
        },
      },
    },
  },
};
```

## 3. Publicar a documentação no servidor Bun

Na pasta do servidor de exemplo, crie um `package.json` com `{ "private": true }` caso ainda não exista. Instale `@scalar/client-side-rendering` com `bun add @scalar/client-side-rendering`. No `servidor.ts`, acrescente os imports abaixo.

```ts
import { renderApiReference } from "@scalar/client-side-rendering";
import { especificacao } from "./openapi";
```

Acrescente as duas entradas abaixo ao mapa `routes`, junto com `/api/atividades`.

```ts
"/api/openapi.json": {
  GET: () => Response.json(especificacao),
},
"/api/docs": {
  GET: () => {
    const html = renderApiReference({
      pageTitle: "API de Atividades",
      config: { url: "/api/openapi.json" },
    });

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
},
```

Rode `bun servidor.ts` e abra `http://127.0.0.1:3000/api/openapi.json` para conferir o JSON. Depois, abra `http://127.0.0.1:3000/api/docs`. Escolha a operação de listagem e envie uma requisição a partir da página. Nesta configuração o navegador baixa a interface do Scalar de um CDN, por isso precisa de acesso à internet para exibi-la.

## 4. Manter a documentação junto com o código

Ao criar ou alterar uma rota, atualize o OpenAPI e a referência em Markdown. Teste os exemplos de sucesso e erro com dados fictícios. Compare o código HTTP e os campos da resposta com o que foi descrito.

No Acadêmico, rode `bun run dev:api` na pasta do projeto e abra `http://localhost:3333/api/docs`. A função `rotasDeCadastro` reutiliza o padrão de CRUD e a função `respostaLista` constrói o esquema de respostas que devolvem listas.

- [Especificação OpenAPI do Acadêmico](../academico/apps/api/src/documentacao/openapi.ts)
- [Rotas de documentação do Acadêmico](../academico/apps/api/src/rotas/documentacao.ts)
- [Roteiro da API do Controle N2](../controle_n2/docs/api.md)
