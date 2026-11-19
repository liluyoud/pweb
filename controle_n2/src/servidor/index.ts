import entrada from "../web/index.html";
import { criarApi } from "./api";
import { abrirBanco, caminhoBanco } from "./banco";
import { lerConfiguracao } from "./configuracao";
import { lerAlunos, lerProjetos } from "./documentos";
import { especificacao, paginaDocumentacao } from "./openapi";

const configuracao = lerConfiguracao(Bun.env);

const documento = (nome: string) => Bun.file(new URL("../../docs/" + nome, import.meta.url));
const lista = documento(Bun.env.CONTROLE_N2_DADOS_EXEMPLO === "1" ? "alunos.exemplo.md" : "alunos.md");
if (!await lista.exists()) {
  throw new Error("Arquivo de alunos ausente. Consulte a seção Como rodar do README.");
}

const alunos = lerAlunos(await lista.text());
const projetos = lerProjetos(await documento("trabalhos.md").text());
if (projetos.length !== 10 || projetos.some((projeto, indice) => projeto.id !== indice + 1)) {
  throw new Error("O documento de trabalhos deve definir os grupos de 01 a 10.");
}

const banco = abrirBanco(caminhoBanco());
const rotas = criarApi(alunos, projetos, banco, configuracao);

const servidor = Bun.serve({
  hostname: "127.0.0.1",
  port: 3400,
  development: { hmr: false, console: false },
  maxRequestBodySize: 4096,
  routes: {
    "/": entrada,
    "/docs": { GET: paginaDocumentacao },
    "/api/openapi.json": { GET: () => Response.json(especificacao) },
    ...rotas,
  },
  fetch: () => new Response("Página não encontrada.", { status: 404 }),
  error: () => Response.json({ erro: "Ocorreu um erro no servidor." }, { status: 500 }),
});

console.log("Controle N2 em " + servidor.url);
