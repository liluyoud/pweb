/*
 * SERVIÇO DA API
 * --------------
 * Este é o ÚNICO arquivo do site que conversa com a API.
 * As telas nunca chamam "fetch" diretamente: elas chamam as funções daqui.
 *
 * Vantagem: se o endereço da API mudar, mexemos só neste arquivo.
 */
import { toast } from "sonner";
import type {
  Aluno,
  Dashboard,
  Disciplina,
  LinhaDesempenhoDisciplina,
  LinhaTurmaProfessor,
  MatriculaDetalhada,
  NovaDisciplina,
  NovaMatricula,
  NovoAluno,
  NovoProfessor,
  Professor,
} from "@academico/tipos";

// Função base: faz o pedido para a API e devolve a resposta já convertida.
// Os pedidos para "/api/..." são repassados pelo Vite para a API
// (veja a parte "proxy" em vite.config.ts).
async function requisicao(caminho: string, metodo: string = "GET", dados?: object) {
  const resposta = await fetch("/api" + caminho, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    // JSON.stringify transforma o objeto em texto para enviar pela rede.
    body: dados ? JSON.stringify(dados) : undefined,
  });

  const corpo = await resposta.json();

  // resposta.ok é falso quando o status é de erro (400, 404, 500...).
  if (!resposta.ok) {
    const mensagem = corpo.erro ?? "Não foi possível falar com a API.";
    toast.error(mensagem); // mostra o aviso vermelho na tela
    throw new Error(mensagem); // interrompe quem chamou esta função
  }

  return corpo;
}

// ------------------------------------------------------------------
// Alunos
// ------------------------------------------------------------------
export function listarAlunos(): Promise<Aluno[]> {
  return requisicao("/alunos");
}

// Se recebe um id, ATUALIZA (PUT). Se não recebe, CRIA (POST).
export function salvarAluno(dados: NovoAluno, id?: number): Promise<Aluno> {
  if (id) {
    return requisicao("/alunos/" + id, "PUT", dados);
  }
  return requisicao("/alunos", "POST", dados);
}

export function excluirAluno(id: number) {
  return requisicao("/alunos/" + id, "DELETE");
}

// ------------------------------------------------------------------
// Professores
// ------------------------------------------------------------------
export function listarProfessores(): Promise<Professor[]> {
  return requisicao("/professores");
}

export function salvarProfessor(dados: NovoProfessor, id?: number): Promise<Professor> {
  if (id) {
    return requisicao("/professores/" + id, "PUT", dados);
  }
  return requisicao("/professores", "POST", dados);
}

export function excluirProfessor(id: number) {
  return requisicao("/professores/" + id, "DELETE");
}

// ------------------------------------------------------------------
// Disciplinas
// ------------------------------------------------------------------
export function listarDisciplinas(): Promise<Disciplina[]> {
  return requisicao("/disciplinas");
}

export function salvarDisciplina(dados: NovaDisciplina, id?: number): Promise<Disciplina> {
  if (id) {
    return requisicao("/disciplinas/" + id, "PUT", dados);
  }
  return requisicao("/disciplinas", "POST", dados);
}

export function excluirDisciplina(id: number) {
  return requisicao("/disciplinas/" + id, "DELETE");
}

// ------------------------------------------------------------------
// Matrículas
// ------------------------------------------------------------------

// alunoId é opcional: se vier, a API devolve só as matrículas daquele aluno.
export function listarMatriculas(alunoId?: number): Promise<MatriculaDetalhada[]> {
  if (alunoId) {
    return requisicao("/matriculas?aluno_id=" + alunoId);
  }
  return requisicao("/matriculas");
}

export function salvarMatricula(dados: NovaMatricula, id?: number): Promise<MatriculaDetalhada> {
  if (id) {
    return requisicao("/matriculas/" + id, "PUT", dados);
  }
  return requisicao("/matriculas", "POST", dados);
}

export function excluirMatricula(id: number) {
  return requisicao("/matriculas/" + id, "DELETE");
}

// ------------------------------------------------------------------
// Dashboard e relatórios
// ------------------------------------------------------------------
export function buscarDashboard(): Promise<Dashboard> {
  return requisicao("/dashboard");
}

export function relatorioDisciplinas(): Promise<LinhaDesempenhoDisciplina[]> {
  return requisicao("/relatorios/disciplinas");
}

export function relatorioProfessores(): Promise<LinhaTurmaProfessor[]> {
  return requisicao("/relatorios/professores");
}
