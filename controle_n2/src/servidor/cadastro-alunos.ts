import type { abrirBanco } from "./banco";
import { lerAlunos } from "./documentos";

export async function carregarAlunos(
  banco: ReturnType<typeof abrirBanco>,
  matriculaProfessor = Bun.env.PROFESSOR_MATRICULA?.trim(),
  caminhoLista = new URL("../../docs/" + (Bun.env.CONTROLE_N2_DADOS_EXEMPLO === "1" ? "alunos.exemplo.md" : "alunos.md"), import.meta.url),
) {
  const cadastrados = banco.listarAlunos();
  if (cadastrados.size > 0) return cadastrados;

  const lista = Bun.file(caminhoLista);
  if (!await lista.exists()) return cadastrados;
  const alunos = lerAlunos(await lista.text());
  if (matriculaProfessor && alunos.has(matriculaProfessor)) {
    throw new Error("A matrícula do professor deve ser diferente das matrículas dos alunos.");
  }
  banco.importarAlunos(alunos);
  return alunos;
}
