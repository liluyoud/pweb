/*
 * TIPOS COMPARTILHADOS
 * --------------------
 * Este arquivo descreve o "formato" de cada informação do sistema.
 * Ele é usado TANTO pela API quanto pelo site (web).
 *
 * Pense em um "type" como um formulário em branco: ele diz quais campos
 * existem e que tipo de valor cada campo aceita (texto, número...).
 *
 * Por que deixar aqui, num pacote separado?
 * Porque assim, se mudarmos um campo, a API e o site enxergam a mudança
 * ao mesmo tempo. Essa é uma das grandes vantagens de um monorepo.
 */

// ------------------------------------------------------------------
// Aluno
// ------------------------------------------------------------------
export type Aluno = {
  id: number;
  nome: string;
  cpf: string;
  matricula: string; // número de matrícula do aluno na instituição
  email: string;
  telefone: string;
  foto: string | null; // imagem em base64 (ou null quando não há foto)
};

// ------------------------------------------------------------------
// Professor
// ------------------------------------------------------------------
export type Professor = {
  id: number;
  nome: string;
  cpf: string;
  titulacao: string; // Especialista, Mestre, Doutor...
  graduacao: string; // curso em que o professor se formou
  email: string;
  telefone: string;
  foto: string | null;
};

// ------------------------------------------------------------------
// Disciplina
// ------------------------------------------------------------------
export type Disciplina = {
  id: number;
  nome: string;
  curso: string;
  carga_horaria: number; // em horas
};

// ------------------------------------------------------------------
// Matrícula (liga Aluno + Professor + Disciplina em um semestre)
// ------------------------------------------------------------------

// O status só pode ser um destes três textos (e nenhum outro).
export type StatusMatricula = "aprovado" | "reprovado" | "cursando";

export type Matricula = {
  id: number;
  aluno_id: number;
  professor_id: number;
  disciplina_id: number;
  semestre: string; // exemplo: "2026.1"
  n1: number | null; // null = nota ainda não lançada
  n2: number | null;
  pf: number | null; // prova final (só para quem não passou direto)
  status: StatusMatricula;
};

// Quando listamos as matrículas, a API também devolve os NOMES
// do aluno, do professor e da disciplina (para mostrar na tela).
// O "&" junta dois tipos em um só.
export type MatriculaDetalhada = Matricula & {
  aluno_nome: string;
  professor_nome: string;
  disciplina_nome: string;
};

// ------------------------------------------------------------------
// Dados que o formulário envia (sem o "id", que o banco cria sozinho)
// Omit<Tipo, "campo"> = "o mesmo Tipo, mas sem esse campo".
// ------------------------------------------------------------------
export type NovoAluno = Omit<Aluno, "id">;
export type NovoProfessor = Omit<Professor, "id">;
export type NovaDisciplina = Omit<Disciplina, "id">;
export type NovaMatricula = Omit<Matricula, "id" | "status">;

// ------------------------------------------------------------------
// Dashboard e relatórios
// ------------------------------------------------------------------
export type ItemGrafico = {
  rotulo: string;
  valor: number;
};

export type Dashboard = {
  totais: {
    alunos: number;
    professores: number;
    disciplinas: number;
    matriculas: number;
  };
  media_geral: number | null;
  taxa_aprovacao: number | null; // porcentagem (0 a 100)
  situacao: ItemGrafico[]; // quantos aprovados, reprovados, cursando
  matriculas_por_semestre: ItemGrafico[];
  melhores_disciplinas: ItemGrafico[]; // maiores médias
};

export type LinhaDesempenhoDisciplina = {
  disciplina: string;
  curso: string;
  semestre: string;
  total: number;
  aprovados: number;
  reprovados: number;
  cursando: number;
  media: number | null;
};

export type LinhaTurmaProfessor = {
  professor: string;
  titulacao: string;
  disciplina: string;
  semestre: string;
  total_alunos: number;
  media: number | null;
};
