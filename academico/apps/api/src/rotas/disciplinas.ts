/*
 * ROTAS DE DISCIPLINAS  ->  /api/disciplinas
 * ------------------------------------------
 * Mesmo padrão do arquivo alunos.ts (leia aquele primeiro!).
 */
import type { BunRequest } from "bun";
import type { NovaDisciplina } from "@academico/tipos";
import { banco } from "../banco/conexao";
import { erro, verificarObrigatorios } from "./ajudantes";

const CAMPOS_OBRIGATORIOS = ["nome", "curso", "carga_horaria"];

export function listar() {
  const disciplinas = banco.query("SELECT * FROM disciplinas ORDER BY nome").all();
  return Response.json(disciplinas);
}

export function buscar(req: BunRequest) {
  const disciplina = banco.query("SELECT * FROM disciplinas WHERE id = ?").get(req.params.id);

  if (!disciplina) {
    return erro("Disciplina não encontrada.", 404);
  }
  return Response.json(disciplina);
}

export async function criar(req: BunRequest) {
  const dados = (await req.json()) as NovaDisciplina;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query("INSERT INTO disciplinas (nome, curso, carga_horaria) VALUES (?, ?, ?)")
    .run(dados.nome, dados.curso, Number(dados.carga_horaria));

  const disciplinaCriada = banco.query("SELECT * FROM disciplinas WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(disciplinaCriada, { status: 201 });
}

export async function atualizar(req: BunRequest) {
  const dados = (await req.json()) as NovaDisciplina;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query("UPDATE disciplinas SET nome = ?, curso = ?, carga_horaria = ? WHERE id = ?")
    .run(dados.nome, dados.curso, Number(dados.carga_horaria), req.params.id);

  if (resultado.changes === 0) {
    return erro("Disciplina não encontrada.", 404);
  }

  const disciplinaAtualizada = banco.query("SELECT * FROM disciplinas WHERE id = ?").get(req.params.id);
  return Response.json(disciplinaAtualizada);
}

export function excluir(req: BunRequest) {
  const resultado = banco.query("DELETE FROM disciplinas WHERE id = ?").run(req.params.id);

  if (resultado.changes === 0) {
    return erro("Disciplina não encontrada.", 404);
  }
  return Response.json({ mensagem: "Disciplina excluída." });
}
