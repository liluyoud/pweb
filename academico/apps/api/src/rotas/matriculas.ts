/*
 * ROTAS DE MATRÍCULAS  ->  /api/matriculas
 * ----------------------------------------
 * A matrícula liga um ALUNO a uma DISCIPLINA, com um PROFESSOR,
 * em um SEMESTRE. Ela também guarda as notas (N1, N2 e PF).
 *
 * O status (aprovado / reprovado / cursando) NÃO vem do formulário:
 * ele é CALCULADO pela API, usando a regra de src/regras/notas.ts.
 */
import type { BunRequest } from "bun";
import type { NovaMatricula } from "@academico/tipos";
import { banco } from "../banco/conexao";
import { calcularStatus } from "../regras/notas";
import { erro, paraNota, verificarObrigatorios } from "./ajudantes";

const CAMPOS_OBRIGATORIOS = ["aluno_id", "professor_id", "disciplina_id", "semestre"];

// JOIN = "junte com outra tabela". Assim trazemos, junto da matrícula,
// o nome do aluno, do professor e da disciplina.
const SQL_MATRICULAS_COM_NOMES = `
  SELECT
    m.*,
    a.nome AS aluno_nome,
    p.nome AS professor_nome,
    d.nome AS disciplina_nome
  FROM matriculas m
  JOIN alunos      a ON a.id = m.aluno_id
  JOIN professores p ON p.id = m.professor_id
  JOIN disciplinas d ON d.id = m.disciplina_id
`;

// GET /api/matriculas
// Aceita filtros opcionais na URL, por exemplo:
//   /api/matriculas?aluno_id=3
//   /api/matriculas?semestre=2026.1
export function listar(req: BunRequest) {
  const url = new URL(req.url);
  const alunoId = url.searchParams.get("aluno_id");
  const semestre = url.searchParams.get("semestre");

  // Montamos o SQL aos poucos, conforme os filtros recebidos.
  // "WHERE 1 = 1" é sempre verdadeiro: serve só para podermos
  // ir acrescentando "AND ..." sem nos preocupar com quem vem primeiro.
  let sql = SQL_MATRICULAS_COM_NOMES + " WHERE 1 = 1";
  const valores: string[] = [];

  if (alunoId) {
    sql = sql + " AND m.aluno_id = ?";
    valores.push(alunoId);
  }
  if (semestre) {
    sql = sql + " AND m.semestre = ?";
    valores.push(semestre);
  }

  sql = sql + " ORDER BY m.semestre DESC, a.nome";

  const matriculas = banco.query(sql).all(...valores);
  return Response.json(matriculas);
}

export function buscar(req: BunRequest) {
  const matricula = banco.query(SQL_MATRICULAS_COM_NOMES + " WHERE m.id = ?").get(req.params.id);

  if (!matricula) {
    return erro("Matrícula não encontrada.", 404);
  }
  return Response.json(matricula);
}

export async function criar(req: BunRequest) {
  const dados = (await req.json()) as NovaMatricula;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const n1 = paraNota(dados.n1);
  const n2 = paraNota(dados.n2);
  const pf = paraNota(dados.pf);
  const status = calcularStatus(n1, n2, pf);

  const resultado = banco
    .query(
      `INSERT INTO matriculas (aluno_id, professor_id, disciplina_id, semestre, n1, n2, pf, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(dados.aluno_id, dados.professor_id, dados.disciplina_id, dados.semestre, n1, n2, pf, status);

  const matriculaCriada = banco
    .query(SQL_MATRICULAS_COM_NOMES + " WHERE m.id = ?")
    .get(resultado.lastInsertRowid);
  return Response.json(matriculaCriada, { status: 201 });
}

export async function atualizar(req: BunRequest) {
  const dados = (await req.json()) as NovaMatricula;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const n1 = paraNota(dados.n1);
  const n2 = paraNota(dados.n2);
  const pf = paraNota(dados.pf);
  const status = calcularStatus(n1, n2, pf);

  const resultado = banco
    .query(
      `UPDATE matriculas
       SET aluno_id = ?, professor_id = ?, disciplina_id = ?, semestre = ?,
           n1 = ?, n2 = ?, pf = ?, status = ?
       WHERE id = ?`
    )
    .run(
      dados.aluno_id,
      dados.professor_id,
      dados.disciplina_id,
      dados.semestre,
      n1,
      n2,
      pf,
      status,
      req.params.id
    );

  if (resultado.changes === 0) {
    return erro("Matrícula não encontrada.", 404);
  }

  const matriculaAtualizada = banco.query(SQL_MATRICULAS_COM_NOMES + " WHERE m.id = ?").get(req.params.id);
  return Response.json(matriculaAtualizada);
}

export function excluir(req: BunRequest) {
  const resultado = banco.query("DELETE FROM matriculas WHERE id = ?").run(req.params.id);

  if (resultado.changes === 0) {
    return erro("Matrícula não encontrada.", 404);
  }
  return Response.json({ mensagem: "Matrícula excluída." });
}
