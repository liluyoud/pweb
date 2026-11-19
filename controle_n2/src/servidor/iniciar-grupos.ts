import { abrirBanco, caminhoBanco } from "./banco";
import { carregarAlunos } from "./cadastro-alunos";
import { lerProjetos } from "./documentos";

const documento = (nome: string) => Bun.file(new URL("../../docs/" + nome, import.meta.url));
const projetos = lerProjetos(await documento("trabalhos.md").text());
if (projetos.length !== 10 || projetos.some((projeto, indice) => projeto.id !== indice + 1)) {
  throw new Error("O documento de trabalhos deve definir os grupos de 01 a 10.");
}

const caminho = caminhoBanco();
const banco = abrirBanco(caminho);
try {
  const alunos = await carregarAlunos(banco);
  if (alunos.size === 0) throw new Error("Nenhum aluno cadastrado. Importe alunos.md no ambiente do professor antes de iniciar os grupos.");
  const resultado = banco.iniciarGrupos(new Set(alunos.keys()), new Set(projetos.map(({ id }) => id)));
  console.log("Banco: " + caminho);
  console.log(`${resultado.novos} novas inscrições; ${resultado.inscritos} alunos inscritos; ${resultado.semGrupo} sem grupo.`);
  const escolhas = banco.listarEscolhas();
  console.table(projetos.map(({ id, nome }) => ({
    grupo: id, projeto: nome, integrantes: escolhas.filter(({ grupo_id }) => grupo_id === id).length,
  })));
} finally {
  banco.fechar();
}
