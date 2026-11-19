/*
 * ROTAS DE RELATÓRIOS E DASHBOARD
 * -------------------------------
 *   GET /api/dashboard                 -> números gerais para a tela inicial
 *   GET /api/relatorios/disciplinas    -> desempenho de cada disciplina
 *   GET /api/relatorios/professores    -> turmas de cada professor
 *
 * Aqui quase todo o trabalho é feito pelo SQL, com funções de resumo:
 *   COUNT(*)  -> conta linhas
 *   AVG(x)    -> média
 *   SUM(x)    -> soma
 *   ROUND(x, 2) -> arredonda com 2 casas
 *   GROUP BY  -> "agrupe as linhas que têm este valor em comum"
 */
import { banco } from "../banco/conexao";

// Função pequena para contar as linhas de uma tabela.
function contar(tabela: string): number {
  const linha = banco.query(`SELECT COUNT(*) AS total FROM ${tabela}`).get() as { total: number };
  return linha.total;
}

export function dashboard() {
  // 1) Totais de cada cadastro
  const totais = {
    alunos: contar("alunos"),
    professores: contar("professores"),
    disciplinas: contar("disciplinas"),
    matriculas: contar("matriculas"),
  };

  // 2) Média geral: média de (N1 + N2) / 2, só de quem já tem as duas notas
  const media = banco
    .query(
      `SELECT ROUND(AVG((n1 + n2) / 2), 2) AS valor
       FROM matriculas
       WHERE n1 IS NOT NULL AND n2 IS NOT NULL`
    )
    .get() as { valor: number | null };

  // 3) Quantas matrículas em cada situação
  const situacao = banco
    .query(
      `SELECT status AS rotulo, COUNT(*) AS valor
       FROM matriculas
       GROUP BY status
       ORDER BY valor DESC`
    )
    .all() as { rotulo: string; valor: number }[];

  // 4) Taxa de aprovação = aprovados / (aprovados + reprovados)
  let aprovados = 0;
  let reprovados = 0;
  for (const item of situacao) {
    if (item.rotulo === "aprovado") aprovados = item.valor;
    if (item.rotulo === "reprovado") reprovados = item.valor;
  }
  const concluidas = aprovados + reprovados;
  const taxaAprovacao = concluidas > 0 ? Math.round((aprovados / concluidas) * 100) : null;

  // 5) Quantidade de matrículas por semestre
  const matriculasPorSemestre = banco
    .query(
      `SELECT semestre AS rotulo, COUNT(*) AS valor
       FROM matriculas
       GROUP BY semestre
       ORDER BY semestre`
    )
    .all();

  // 6) As 5 disciplinas com maior média
  const melhoresDisciplinas = banco
    .query(
      `SELECT d.nome AS rotulo, ROUND(AVG((m.n1 + m.n2) / 2), 2) AS valor
       FROM matriculas m
       JOIN disciplinas d ON d.id = m.disciplina_id
       WHERE m.n1 IS NOT NULL AND m.n2 IS NOT NULL
       GROUP BY d.id
       ORDER BY valor DESC
       LIMIT 5`
    )
    .all();

  return Response.json({
    totais: totais,
    media_geral: media.valor,
    taxa_aprovacao: taxaAprovacao,
    situacao: situacao,
    matriculas_por_semestre: matriculasPorSemestre,
    melhores_disciplinas: melhoresDisciplinas,
  });
}

export function desempenhoPorDisciplina() {
  // CASE WHEN ... THEN 1 ELSE 0 END  ->  vale 1 quando a condição é verdadeira.
  // Somando esses "1", contamos quantos aprovados, reprovados etc.
  const linhas = banco
    .query(
      `SELECT
         d.nome  AS disciplina,
         d.curso AS curso,
         m.semestre AS semestre,
         COUNT(*) AS total,
         SUM(CASE WHEN m.status = 'aprovado'  THEN 1 ELSE 0 END) AS aprovados,
         SUM(CASE WHEN m.status = 'reprovado' THEN 1 ELSE 0 END) AS reprovados,
         SUM(CASE WHEN m.status = 'cursando'  THEN 1 ELSE 0 END) AS cursando,
         ROUND(AVG((m.n1 + m.n2) / 2), 2) AS media
       FROM matriculas m
       JOIN disciplinas d ON d.id = m.disciplina_id
       GROUP BY d.id, m.semestre
       ORDER BY m.semestre DESC, d.nome`
    )
    .all();

  return Response.json(linhas);
}

export function turmasPorProfessor() {
  const linhas = banco
    .query(
      `SELECT
         p.nome      AS professor,
         p.titulacao AS titulacao,
         d.nome      AS disciplina,
         m.semestre  AS semestre,
         COUNT(*)    AS total_alunos,
         ROUND(AVG((m.n1 + m.n2) / 2), 2) AS media
       FROM matriculas m
       JOIN professores p ON p.id = m.professor_id
       JOIN disciplinas d ON d.id = m.disciplina_id
       GROUP BY p.id, d.id, m.semestre
       ORDER BY p.nome, m.semestre DESC`
    )
    .all();

  return Response.json(linhas);
}
