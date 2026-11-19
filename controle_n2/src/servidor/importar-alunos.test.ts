import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { LIMITE_ARQUIVO_ALUNOS, type CadastroAluno, type Projeto } from "../tipos";
import { criarApi } from "./api";
import { abrirBanco } from "./banco";
import { carregarAlunos } from "./cadastro-alunos";
import { lerConfiguracao } from "./configuracao";

const projetos: Projeto[] = Array.from({ length: 10 }, (_, indice) => ({
  id: indice + 1, nome: "Grupo " + (indice + 1), titulo: "Projeto", descricao: "Exemplo", detalhes: [],
}));
const configuracao = lerConfiguracao({
  APP_KEY: "ab".repeat(32), PROFESSOR_MATRICULA: "999", PROFESSOR_DATA_NASCIMENTO: "1980-01-01",
});
const alunosIniciais = () => new Map<string, CadastroAluno>([
  ["001", { nome: "Ana", nascimento: "2005-02-01" }],
  ["002", { nome: "Bruno", nascimento: "2006-03-02" }],
]);

function ambiente(banco = abrirBanco(":memory:"), alunos = alunosIniciais()) {
  const servidor = Bun.serve({
    hostname: "127.0.0.1", port: 0,
    maxRequestBodySize: LIMITE_ARQUIVO_ALUNOS + 64 * 1024,
    routes: criarApi(alunos, projetos, banco, configuracao),
    error: () => Response.json({ erro: "Ocorreu um erro no servidor." }, { status: 500 }),
  });
  async function pedir(caminho: string, method = "GET", dados?: object | FormData, cookie = "", origem = servidor.url.origin) {
    const formulario = dados instanceof FormData;
    return fetch(new URL(caminho, servidor.url), {
      method,
      headers: { Origin: origem, Cookie: cookie, ...(!formulario && { "Content-Type": "application/json" }) },
      body: formulario ? dados : dados ? JSON.stringify(dados) : undefined,
    });
  }
  async function entrar(matricula = "999", nascimento = "1980-01-01") {
    const resposta = await pedir("/api/sessao", "POST", { matricula, nascimento });
    expect(resposta.status).toBe(200);
    return resposta.headers.get("Set-Cookie")!.split(";")[0];
  }
  function importar(texto: string | Uint8Array, cookie: string, nome = "alunos.md", origem?: string) {
    const formulario = new FormData();
    formulario.set("arquivo", new File([texto], nome, { type: "text/markdown" }));
    return pedir("/app/professor/alunos", "PUT", formulario, cookie, origem);
  }
  return { banco, pedir, entrar, importar, fechar: () => { servidor.stop(true); banco.fechar(); } };
}

test("o professor importa, atualiza e repete a lista sem perder grupos, repositórios ou avaliações", async () => {
  const app = ambiente();
  try {
    const professor = await app.entrar();
    const antiga = await app.entrar("001", "2005-02-01");
    const inalterada = await app.entrar("002", "2006-03-02");
    app.banco.escolher("001", 1, 10);
    app.banco.salvarRepositorio("001", 1, "https://github.com/turma/projeto");
    const matriculas = new Set(["001", "002"]);
    app.banco.sortearGrupo(new Set([1]), matriculas);
    app.banco.iniciarAvaliacao(1, matriculas);
    app.banco.sortearDupla(1, matriculas);
    app.banco.atualizarAvaliacao(1, { tipo: "finalizar-avaliacao", rodadaId: app.banco.duplaDaAvaliacao(1)!.id }, matriculas);
    const historico = app.banco.rodadasDaAvaliacao(1);
    const texto = "| Matrícula | Nome | Data de Nascimento |\n| --- | --- | --- |\n"
      + "| 001 | ANA ATUALIZADA | 03/04/2007 |\n| 003 | CARLA DE SOUSA | 05/06/2008 |\n"
      + "| 003 | CARLA DE SOUSA | 05/06/2008 |\n| 004 | DIEGO | 07/08/2009 |";
    const resposta = await app.importar(texto, professor);
    expect(resposta.status).toBe(200);
    const resultado = await resposta.json();
    expect(resultado.importacao).toEqual({ total: 3, adicionados: 2, atualizados: 1, inalterados: 0, totalCadastrados: 4 });
    expect(resultado.painel.alunosSemGrupo).toEqual([
      { matricula: "002", nome: "Bruno" }, { matricula: "003", nome: "Carla de Sousa" }, { matricula: "004", nome: "Diego" },
    ]);
    expect(resultado.painel).not.toHaveProperty("nascimento");
    expect(resultado.painel.alunosSemGrupo[1]).not.toHaveProperty("nascimento");
    expect(app.banco.grupoAtual("001")).toBe(1);
    expect(app.banco.listarRepositorios().get(1)).toBe("https://github.com/turma/projeto");
    expect(app.banco.rodadasDaAvaliacao(1)).toEqual(historico);
    expect(resultado.painel.avaliacoesConcluidas[0].rodadasFinalizadas[0].principal.nome).toBe("Ana Atualizada");
    expect((await app.pedir("/api/painel", "GET", undefined, antiga)).status).toBe(401);
    expect((await app.pedir("/api/painel", "GET", undefined, inalterada)).status).toBe(200);
    expect((await app.pedir("/api/sessao", "POST", { matricula: "001", nascimento: "2005-02-01" })).status).toBe(401);
    const atual = await app.entrar("001", "2007-04-03");
    const nova = await app.entrar("003", "2008-06-05");
    expect((await app.pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, nova)).status).toBe(200);
    const repetida = await app.importar(texto, professor);
    expect((await repetida.json()).importacao).toEqual({ total: 3, adicionados: 0, atualizados: 0, inalterados: 3, totalCadastrados: 4 });
    expect((await app.pedir("/api/painel", "GET", undefined, atual)).status).toBe(200);
    expect(app.banco.grupoAtual("003")).toBe(2);
    expect(app.banco.listarAlunos().get("003")).toEqual({ nome: "Carla de Sousa", nascimento: "2008-06-05" });
  } finally { app.fechar(); }
});

test("a importação exige professor e origem válida", async () => {
  const app = ambiente();
  try {
    const texto = "| 003 | CARLA | 05/06/2008 |";
    expect((await app.importar(texto, "")).status).toBe(401);
    expect((await app.importar(texto, await app.entrar("001", "2005-02-01"))).status).toBe(403);
    expect((await app.importar(texto, await app.entrar(), "alunos.md", "https://outro.exemplo")).status).toBe(403);
    expect(app.banco.listarAlunos().size).toBe(2);
  } finally { app.fechar(); }
});

test("arquivos inválidos são rejeitados integralmente, incluindo conflitos, datas e matrícula do professor", async () => {
  const app = ambiente();
  try {
    const professor = await app.entrar();
    const casos: [string | Uint8Array, string, number][] = [
      ["", "alunos.md", 400],
      ["Sem tabela", "alunos.md", 400],
      ["| 003 | CARLA | 05/06/2008 |", "alunos.txt", 400],
      ["| 003 | CARLA | 31/02/2008 |", "alunos.md", 400],
      ["| 003 | CARLA | 05/06/2008 |\n| inválida | NOME | 01/02/2005 |", "alunos.md", 400],
      ["| 003 | CARLA | 05/06/2008 |\n| 003 | OUTRO NOME | 05/06/2008 |", "alunos.md", 400],
      ["| 003 | CARLA | 05/06/2008 |\n| 999 | PROFESSOR | 01/01/1980 |", "alunos.md", 400],
      [new Uint8Array([0xff, 0xfe]), "alunos.md", 400],
      ["x".repeat(LIMITE_ARQUIVO_ALUNOS + 1), "alunos.md", 413],
    ];
    for (const [texto, nome, status] of casos) {
      expect((await app.importar(texto, professor, nome)).status).toBe(status);
      expect(app.banco.listarAlunos()).toEqual(alunosIniciais());
    }
    expect((await app.pedir("/app/professor/alunos", "PUT", { arquivo: "texto" }, professor)).status).toBe(400);
    const duplicado = new FormData();
    for (let indice = 0; indice < 2; indice++) duplicado.append("arquivo", new File(["| 003 | CARLA | 05/06/2008 |"], "alunos.md"));
    expect((await app.pedir("/app/professor/alunos", "PUT", duplicado, professor)).status).toBe(400);
    expect((await app.pedir("/api/sessao", "POST", { matricula: "003", nascimento: "2008-06-05" })).status).toBe(401);
    expect(app.banco.listarAlunos()).toEqual(alunosIniciais());
  } finally { app.fechar(); }
});

test("inicia sem arquivo local, conserva alunos importados ao reiniciar e reverte uma falha de gravação", async () => {
  const pasta = mkdtempSync(join(tmpdir(), "controle-n2-importacao-"));
  const caminho = join(pasta, "dados.sqlite");
  const lista = join(pasta, "alunos.md");
  let app: ReturnType<typeof ambiente> | undefined;
  try {
    const banco = abrirBanco(caminho);
    const iniciais = await carregarAlunos(banco, "999", pathToFileURL(lista));
    expect(iniciais.size).toBe(0);
    app = ambiente(banco, iniciais);
    expect((await app.importar("| 001 | ANA | 01/02/2005 |", await app.entrar())).status).toBe(200);
    app.fechar();
    app = undefined;
    writeFileSync(lista, "| 001 | NOME ANTIGO | 02/03/2006 |", "utf8");
    const reaberto = abrirBanco(caminho);
    const alunos = await carregarAlunos(reaberto, "999", pathToFileURL(lista));
    expect(alunos.get("001")).toEqual({ nome: "Ana", nascimento: "2005-02-01" });
    app = ambiente(reaberto, alunos);
    await app.entrar("001", "2005-02-01");
    const conexao = new Database(caminho);
    conexao.exec("CREATE TRIGGER impedir_aluno BEFORE INSERT ON alunos WHEN NEW.matricula = '003' BEGIN SELECT RAISE(ABORT, 'Falha simulada'); END;");
    conexao.close();
    const falha = await app.importar("| 001 | ANA ALTERADA | 01/02/2005 |\n| 003 | CARLA | 05/06/2008 |", await app.entrar());
    expect(falha.status).toBe(500);
    expect(app.banco.listarAlunos()).toEqual(new Map([["001", { nome: "Ana", nascimento: "2005-02-01" }]]));
    const painel = await (await app.pedir("/api/painel", "GET", undefined, await app.entrar("001", "2005-02-01"))).json();
    expect(painel.nome).toBe("Ana");
  } finally {
    app?.fechar();
    for (const arquivo of [lista, caminho]) if (await Bun.file(arquivo).exists()) unlinkSync(arquivo);
    rmdirSync(pasta);
  }
});
