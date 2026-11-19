import entrada from "../web/index.html";
import { LIMITE_ARQUIVO_ALUNOS } from "../tipos";
import { criarApi } from "./api";
import { abrirBanco, caminhoBanco } from "./banco";
import { carregarAlunos } from "./cadastro-alunos";
import { lerConfiguracao } from "./configuracao";
import { lerProjetos } from "./documentos";
import { especificacao, paginaDocumentacao } from "./openapi";

const configuracao = lerConfiguracao(Bun.env);

const documento = (nome: string) => Bun.file(new URL("../../docs/" + nome, import.meta.url));
const projetos = lerProjetos(await documento("trabalhos.md").text());
if (projetos.length !== 10 || projetos.some((projeto, indice) => projeto.id !== indice + 1)) {
  throw new Error("O documento de trabalhos deve definir os grupos de 01 a 10.");
}

const banco = abrirBanco(caminhoBanco());
const alunos = await carregarAlunos(banco, configuracao.professor.matricula);
const rotas = criarApi(alunos, projetos, banco, configuracao);

const servidor = Bun.serve({
  // No contêiner, HOST=0.0.0.0 permite que o proxy alcance o servidor.
  hostname: Bun.env.HOST?.trim() || "127.0.0.1",
  port: Number(Bun.env.PORT) || 3400,
  // Em produção o Bun entrega JS e CSS minificados.
  development: Bun.env.NODE_ENV === "production" ? false : { hmr: false, console: false },
  maxRequestBodySize: LIMITE_ARQUIVO_ALUNOS + 64 * 1024,
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
