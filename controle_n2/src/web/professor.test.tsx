import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { AvaliacaoAlunos, Grupo, PainelProfessor } from "../tipos";
import { AmbienteProfessor } from "./professor";

const integrantes = [
  { matricula: "1", nome: "Ana" },
  { matricula: "2", nome: "Bruno" },
  { matricula: "3", nome: "Carla" },
];
const grupo: Grupo = {
  id: 1, nome: "Grupo um", titulo: "Projeto um", descricao: "", detalhes: [],
  ocupacao: 3, limite: 10, integrantes: integrantes.map(({ nome }) => nome),
  repositorioGithub: "https://github.com/turma/um",
};
const concluida: AvaliacaoAlunos & { grupoId: number } = {
  grupoId: 1, integrantes, dupla: null,
  rodadasFinalizadas: [{ id: 1, principal: integrantes[0], assistente: integrantes[1], aberta: true, voluntario: integrantes[2] }],
};
const painel: PainelProfessor = {
  perfil: "professor", grupos: [grupo, { ...grupo, id: 2, nome: "Grupo dois" }],
  avaliacaoAtual: { grupoId: 2, estado: "em_avaliacao" },
  avaliacaoAlunos: {
    integrantes: [{ matricula: "4", nome: "Daniel" }],
    dupla: { id: 2, principal: { matricula: "4", nome: "Daniel" }, assistente: null, aberta: false, voluntario: null },
    rodadasFinalizadas: [],
  },
  avaliacoesConcluidas: [concluida], alunosSemGrupo: [], auditoria: [],
};

function renderizar(rota: string, dados = painel) {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { hash: rota } } });
  try {
    return renderToStaticMarkup(<AmbienteProfessor painel={dados} ocupado={false}
      atualizar={() => {}} aoSortear={() => {}} aoIniciar={() => {}}
      aoSortearDupla={() => {}} aoAtualizarAvaliacao={() => {}} aoImportarAlunos={() => {}} />);
  } finally {
    if (anterior) Object.defineProperty(globalThis, "window", anterior);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("o cartão do grupo finalizado tem check e acesso à avaliação, separado do grupo em andamento", () => {
  const cartoes = renderizar("#professor/grupos").match(/<article\b[^>]*>[\s\S]*?<\/article>/g)!;
  expect(cartoes).toHaveLength(2);
  expect(cartoes[0]).toContain("grupo-finalizado");
  expect(cartoes[0]).toContain("✓");
  expect(cartoes[0]).toContain("Grupo finalizado");
  expect(cartoes[0]).toContain('href="#professor/avaliacao/1">Visualizar avaliação</a>');
  expect(cartoes[0]).not.toContain("Iniciar avaliação");
  expect(cartoes[1]).not.toContain("grupo-finalizado");
  expect(cartoes[1]).toContain('href="#professor/avaliacao/2">Abrir avaliação</a>');
});

test("a rota da avaliação concluída mostra o histórico em consulta mesmo com outro grupo em avaliação", () => {
  for (const dados of [painel, { ...painel, avaliacaoAtual: null, avaliacaoAlunos: null }]) {
    const html = renderizar("#professor/avaliacao/1", dados);
    expect(html).toContain("Avaliação finalizada");
    expect(html).toContain("Duplas avaliadas");
    expect(html).toContain("Dupla 1");
    expect(html).toContain("Principal</dt><dd>Ana");
    expect(html).toContain("Assistente</dt><dd>Bruno");
    expect(html).toContain("Integrante chamado</dt><dd>Carla");
    expect(html).not.toContain("Daniel");
    expect(html).not.toContain("Escolher dupla");
    expect(html).not.toContain("Finalizar avaliação");
    expect(html).not.toContain("Chamar outro integrante");
    expect(html).toContain('href="#professor/grupos"');
  }
});

test("as rotas da avaliação em andamento preservam as opções e uma rota inexistente volta aos grupos", () => {
  for (const rota of ["#professor/avaliacao", "#professor/avaliacao/2"]) {
    const html = renderizar(rota);
    expect(html).toContain("Daniel");
    expect(html).toContain("Finalizar avaliação da dupla");
    expect(html).not.toContain("Avaliação finalizada");
  }
  const inexistente = renderizar("#professor/avaliacao/99");
  expect(inexistente).toContain("Grupos e repositórios</h2>");
  expect(inexistente).not.toContain("Dupla sorteada");
});

test("o início da avaliação fica bloqueado sem link do GitHub e habilitado após o envio", () => {
  for (const repositorioGithub of [null, "https://github.com/turma/dois"]) {
    const html = renderizar("#professor/grupos", {
      ...painel, avaliacaoAtual: { grupoId: 2, estado: "sorteado" }, avaliacaoAlunos: null,
      grupos: [grupo, { ...grupo, id: 2, repositorioGithub }],
    });
    const botao = html.match(/<button\b[^>]*>Iniciar avaliação<\/button>/)![0];
    if (repositorioGithub) {
      expect(botao).not.toContain("disabled");
      expect(html).not.toContain("Aguardando o envio do link do GitHub");
    } else {
      expect(botao).toContain("disabled");
      expect(html).toContain("Aguardando o envio do link do GitHub");
    }
  }
});

test("escolher grupo só fica disponível quando há grupo com integrantes e link do GitHub", () => {
  const botaoEscolher = (grupos: Grupo[]) => renderizar("#professor/grupos", {
    ...painel, avaliacaoAtual: null, avaliacaoAlunos: null, avaliacoesConcluidas: [],
    grupos: grupos.map((dados, indice) => ({ ...dados, id: indice + 1 })),
  }).match(/<button\b[^>]*>Escolher grupo<\/button>/)![0];
  const semIntegrantes = { ...grupo, ocupacao: 0, integrantes: [] };
  const semLink = { ...grupo, repositorioGithub: null };
  expect(botaoEscolher([semIntegrantes, semLink])).toContain("disabled");
  expect(botaoEscolher([semIntegrantes, semLink, grupo])).not.toContain("disabled");
});

test("o professor tem uma página para importar alunos por arquivo Markdown", () => {
  const html = renderizar("#professor/importar-alunos");
  expect(html).toContain('href="#professor/importar-alunos" aria-current="page"');
  expect(html).toContain('type="file"');
  expect(html).toContain('accept=".md,text/markdown,text/plain"');
  expect(html).toContain('name="arquivo"');
  expect(html).toContain("Importar alunos</button>");
  expect(html).toContain("DD/MM/AAAA");
  expect(html).toContain("permanecem cadastrados");
});
