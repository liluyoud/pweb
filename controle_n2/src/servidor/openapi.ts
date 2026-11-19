import { renderApiReference } from "@scalar/client-side-rendering";

const texto = { type: "string" };
const inteiro = { type: "integer" };
const ref = (nome: string) => ({ $ref: "#/components/schemas/" + nome });
const lista = (items: object) => ({ type: "array", items });
const objeto = (properties: Record<string, object>) => ({
  type: "object", properties, required: Object.keys(properties),
});
const json = (schema: object) => ({ "application/json": { schema } });
const resposta = (description: string, schema: object) => ({ description, content: json(schema) });
const repositorioGithub = { type: ["string", "null"], format: "uri" };
const grupoId = { type: "integer", minimum: 1, maximum: 10 };
const grupoPublico = {
  id: grupoId, nome: texto, titulo: texto, descricao: texto,
  detalhes: lista(objeto({ titulo: texto, texto })), ocupacao: inteiro,
  limite: inteiro, repositorioGithub,
};

export const especificacao = {
  openapi: "3.1.0",
  info: {
    title: "Controle N2",
    version: "0.1.0",
    description: "Consulte os projetos, vagas e repositórios da turma. Para entrar ou trocar de grupo e enviar o link do GitHub, use o painel do aluno no sistema.",
  },
  paths: {
    "/api/grupos": {
      get: {
        summary: "Consultar os grupos e projetos publicamente",
        responses: { "200": resposta("Catálogo sem dados pessoais.", lista(ref("GrupoPublico"))) },
      },
    },
  },
  components: {
    schemas: {
      GrupoPublico: objeto(grupoPublico),
    },
  },
};

export function paginaDocumentacao() {
  const html = renderApiReference({
    pageTitle: "API · Controle N2",
    config: { url: "/api/openapi.json" },
  });
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
