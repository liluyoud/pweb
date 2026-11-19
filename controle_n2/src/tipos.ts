export type Projeto = {
  id: number;
  nome: string;
  titulo: string;
  descricao: string;
  detalhes: { titulo: string; texto: string }[];
};

export type Grupo = Projeto & {
  ocupacao: number;
  limite: number;
  integrantes: string[];
  repositorioGithub: string | null;
};

export type Painel = {
  perfil: "aluno";
  nome: string;
  grupoAtual: number | null;
  colegasDoGrupo: string[];
  repositorioGithub: string | null;
  grupos: Grupo[];
};

export type EventoAuditoria = {
  id: number;
  data_utc: string;
  acao: "entrada_grupo" | "troca_grupo" | "envio_repositorio" | "alteracao_repositorio";
  matricula: string;
  grupo_anterior_id: number | null;
  grupo_id: number;
  link_anterior: string | null;
  link_novo: string | null;
};

export type PainelProfessor = {
  perfil: "professor";
  grupos: Grupo[];
  avaliacaoAtual: AvaliacaoGrupo | null;
  avaliacaoAlunos: AvaliacaoAlunos | null;
  alunosSemGrupo: { matricula: string; nome: string }[];
  auditoria: (EventoAuditoria & { nome: string | null })[];
};

export type AvaliacaoGrupo = {
  grupoId: number;
  estado: "sorteado" | "em_avaliacao";
};

export type AlunoDaAvaliacao = { matricula: string; nome: string };

export type AvaliacaoAlunos = {
  integrantes: AlunoDaAvaliacao[];
  dupla: { principal: AlunoDaAvaliacao; assistente: AlunoDaAvaliacao | null } | null;
};

export type PainelSessao = Painel | PainelProfessor;
