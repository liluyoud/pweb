/*
 * ROTAS DE PROFESSORES  ->  /api/professores
 * ------------------------------------------
 * Mesmo padrão do arquivo alunos.ts (leia aquele primeiro!).
 */
import type { BunRequest } from "bun";
import type { NovoProfessor } from "@academico/tipos";
import { banco } from "../banco/conexao";
import { erro, verificarObrigatorios } from "./ajudantes";

const CAMPOS_OBRIGATORIOS = ["nome", "cpf", "titulacao", "graduacao", "email"];

export function listar() {
  const professores = banco.query("SELECT * FROM professores ORDER BY nome").all();
  return Response.json(professores);
}

export function buscar(req: BunRequest) {
  const professor = banco.query("SELECT * FROM professores WHERE id = ?").get(req.params.id);

  if (!professor) {
    return erro("Professor não encontrado.", 404);
  }
  return Response.json(professor);
}

export async function criar(req: BunRequest) {
  const dados = (await req.json()) as NovoProfessor;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query(
      "INSERT INTO professores (nome, cpf, titulacao, graduacao, email, telefone, foto) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      dados.nome,
      dados.cpf,
      dados.titulacao,
      dados.graduacao,
      dados.email,
      dados.telefone ?? "",
      dados.foto ?? null
    );

  const professorCriado = banco.query("SELECT * FROM professores WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(professorCriado, { status: 201 });
}

export async function atualizar(req: BunRequest) {
  const dados = (await req.json()) as NovoProfessor;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query(
      "UPDATE professores SET nome = ?, cpf = ?, titulacao = ?, graduacao = ?, email = ?, telefone = ?, foto = ? WHERE id = ?"
    )
    .run(
      dados.nome,
      dados.cpf,
      dados.titulacao,
      dados.graduacao,
      dados.email,
      dados.telefone ?? "",
      dados.foto ?? null,
      req.params.id
    );

  if (resultado.changes === 0) {
    return erro("Professor não encontrado.", 404);
  }

  const professorAtualizado = banco.query("SELECT * FROM professores WHERE id = ?").get(req.params.id);
  return Response.json(professorAtualizado);
}

export function excluir(req: BunRequest) {
  const resultado = banco.query("DELETE FROM professores WHERE id = ?").run(req.params.id);

  if (resultado.changes === 0) {
    return erro("Professor não encontrado.", 404);
  }
  return Response.json({ mensagem: "Professor excluído." });
}
