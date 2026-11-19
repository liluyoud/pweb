import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync, rmdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { abrirBanco } from "./banco";
import { criarApi } from "./api";
import { lerConfiguracao } from "./configuracao";
import { lerAlunos, lerProjetos } from "./documentos";

test("o aluno entra, consulta todos os projetos e troca de grupo sem ultrapassar a lotação", async () => {
  const linhas = Array.from({ length: 11 }, (_, indice) =>
    "| " + (indice + 1) + " | PESSOA FICTÍCIA " + (indice + 1) + " | 01/02/2005 |");
  linhas[1] = "| 2 | PESSOA FICTÍCIA 1 | 01/02/2005 |";
  linhas[10] = "| 11 | ÁLVARO  DA SILVA E DOS  SANTOS-LIMA | 01/02/2005 |";
  linhas.push("| 12 | ZÉLIA DOS ANJOS | 01/02/2005 |", "| 13 | ANDRÉ DE SOUSA | 01/02/2005 |");
  const alunos = lerAlunos([...linhas, linhas[0]].join("\n"));
  expect(alunos.size).toBe(13);

  const projetos = lerProjetos(await Bun.file(new URL("../../docs/trabalhos.md", import.meta.url)).text());
  expect(projetos).toHaveLength(10);
  expect(projetos.every((projeto) => projeto.detalhes.length === 4)).toBe(true);
  const banco = abrirBanco(":memory:");
  const configuracao = lerConfiguracao({
    APP_KEY: "ab".repeat(32),
    PROFESSOR_MATRICULA: "999",
    PROFESSOR_DATA_NASCIMENTO: "1985-01-02",
  });
  const servidor = Bun.serve({
    hostname: "127.0.0.1", port: 0,
    routes: criarApi(alunos, projetos, banco, configuracao),
  });

  async function pedir(caminho: string, method = "GET", dados?: object, cookie = "",
    chave = "", origem = servidor.url.origin) {
    const rota = caminho.startsWith("/") ? caminho : "/api/" + caminho;
    return fetch(new URL(rota, servidor.url), {
      method,
      headers: {
        Origin: origem, "Content-Type": "application/json", Cookie: cookie,
        ...(chave && { "X-App-Key": chave }),
      },
      body: dados ? JSON.stringify(dados) : undefined,
    });
  }

  async function entrar(matricula: string) {
    const resposta = await pedir("sessao", "POST", { matricula, nascimento: "2005-02-01" });
    expect(resposta.status).toBe(200);
    return resposta.headers.get("Set-Cookie")!.split(";")[0];
  }

  try {
    const publico = await (await pedir("grupos", "GET", undefined, "", "")).json();
    expect(publico).toHaveLength(10);
    expect(publico[0]).not.toHaveProperty("integrantes");
    expect(JSON.stringify(publico)).not.toContain("André de Sousa");
    expect((await pedir("painel")).status).toBe(401);
    expect((await pedir("sessao", "POST", { matricula: "11", nascimento: "2005-01-02" })).status).toBe(401);
    const cookie = await entrar("11");
    expect((await pedir("meu-grupo", "PUT", { grupoId: 2 }, cookie)).status).toBe(404);
    expect((await pedir("meu-grupo", "PUT", { grupoId: 2 }, cookie, configuracao.appKey)).status).toBe(404);
    expect((await pedir("meu-grupo/repositorio", "PUT", {
      grupoId: 2, link: "https://github.com/turma/projeto",
    }, cookie, configuracao.appKey)).status).toBe(404);
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, cookie, "", "http://outra-origem.test")).status).toBe(403);
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, "", "")).status).toBe(401);
    const inicial = await (await pedir("painel", "GET", undefined, cookie)).json();
    expect(inicial.grupoAtual).toBeNull();
    expect(inicial.perfil).toBe("aluno");
    expect(inicial).not.toHaveProperty("avaliacaoAtual");
    expect(inicial).not.toHaveProperty("avaliacaoAlunos");
    expect((await pedir("/app/professor/sorteio", "PUT", undefined, cookie)).status).toBe(403);
    expect((await pedir("/app/professor/avaliacao", "PUT", { grupoId: 1 }, cookie)).status).toBe(403);
    expect((await pedir("/app/professor/dupla", "PUT", { grupoId: 1 }, cookie)).status).toBe(403);
    expect(inicial).not.toHaveProperty("auditoria");
    expect(inicial).not.toHaveProperty("alunosSemGrupo");
    expect(inicial.colegasDoGrupo).toEqual([]);
    expect(inicial.grupos).toHaveLength(10);
    expect(inicial.nome).toBe("Álvaro da Silva e dos Santos-Lima");
    expect(inicial.grupos[0].integrantes).toEqual([]);
    expect(inicial.grupos[0].repositorioGithub).toBeNull();
    expect(inicial).not.toHaveProperty("nascimento");
    expect(inicial).not.toHaveProperty("matricula");

    for (let indice = 1; indice <= 10; indice++) {
      expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 1 }, await entrar(String(indice)))).status).toBe(200);
    }

    const antesDaEscolha = await (await pedir("painel", "GET", undefined, cookie)).json();
    expect(antesDaEscolha.grupoAtual).toBeNull();
    expect(antesDaEscolha.grupos[0].integrantes).toHaveLength(10);
    expect(antesDaEscolha.grupos[0].integrantes[0]).toBe("Pessoa Fictícia 1");

    const rotaRepositorio = "/app/meu-grupo/repositorio";
    const link = "https://github.com/turma/projeto-n2";
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link })).status).toBe(401);
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link }, cookie)).status).toBe(409);
    const integranteUm = await entrar("1");
    const integranteDois = await entrar("2");
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link: "https://github.com.exemplo.org/turma/projeto" }, integranteUm)).status).toBe(400);
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link: link + "/" }, integranteUm)).status).toBe(200);
    const painelDoIntegrante = await (await pedir("painel", "GET", undefined, integranteDois)).json();
    expect(painelDoIntegrante.repositorioGithub).toBe(link);
    expect(painelDoIntegrante.colegasDoGrupo).toEqual(
      [1, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => "Pessoa Fictícia " + numero)
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    );
    const novoLink = "https://github.com/turma/projeto-atualizado";
    const atualizacao = await pedir(rotaRepositorio, "PUT", { grupoId: 1, link: novoLink }, integranteDois);
    expect(atualizacao.status).toBe(200);
    expect((await atualizacao.json()).repositorioGithub).toBe(novoLink);
    const painelSemGrupo = await (await pedir("painel", "GET", undefined, cookie)).json();
    expect(painelSemGrupo.repositorioGithub).toBeNull();
    expect(painelSemGrupo.grupos[0].repositorioGithub).toBe(novoLink);

    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, cookie, "")).status).toBe(200);
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link }, cookie)).status).toBe(409);
    const painelDeOutroGrupo = await (await pedir("painel", "GET", undefined, cookie)).json();
    expect(painelDeOutroGrupo.grupoAtual).toBe(2);
    expect(painelDeOutroGrupo.grupos[0].repositorioGithub).toBe(novoLink);
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 1 }, cookie)).status).toBe(409);
    expect(banco.grupoAtual("11")).toBe(2);
    const troca = await (await pedir("/app/meu-grupo", "PUT", { grupoId: 3 }, cookie)).json();
    expect(troca.grupoAtual).toBe(3);
    expect(troca.colegasDoGrupo).toEqual([]);
    expect(troca.grupos.map((grupo: { ocupacao: number }) => grupo.ocupacao).slice(0, 3)).toEqual([10, 0, 1]);
    expect(troca.grupos[1].integrantes).toEqual([]);
    expect(troca.grupos[2].integrantes).toEqual(["Álvaro da Silva e dos Santos-Lima"]);
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 3 }, cookie)).status).toBe(200);
    expect((await pedir(rotaRepositorio, "PUT", { grupoId: 1, link: novoLink }, integranteDois)).status).toBe(200);

    const eventos = banco.listarAuditoria();
    expect(eventos).toHaveLength(14);
    expect(eventos.every(({ data_utc }) => new Date(data_utc).toISOString() === data_utc)).toBe(true);
    expect(eventos.slice(10).map(({ id, data_utc, ...evento }) => evento)).toEqual([
      { acao: "envio_repositorio", matricula: "1", grupo_anterior_id: null, grupo_id: 1, link_anterior: null, link_novo: link },
      { acao: "alteracao_repositorio", matricula: "2", grupo_anterior_id: null, grupo_id: 1, link_anterior: link, link_novo: novoLink },
      { acao: "entrada_grupo", matricula: "11", grupo_anterior_id: null, grupo_id: 2, link_anterior: null, link_novo: null },
      { acao: "troca_grupo", matricula: "11", grupo_anterior_id: 2, grupo_id: 3, link_anterior: null, link_novo: null },
    ]);

    expect((await pedir("sessao", "DELETE", undefined, cookie)).status).toBe(200);
    expect((await pedir("painel", "GET", undefined, cookie)).status).toBe(401);
    const novaSessao = await entrar("11");
    expect((await (await pedir("painel", "GET", undefined, novaSessao)).json()).grupoAtual).toBe(3);

    const loginProfessor = await pedir("sessao", "POST", { matricula: "999", nascimento: "1985-01-02" }, "", "");
    expect(loginProfessor.status).toBe(200);
    const cookieProfessor = loginProfessor.headers.get("Set-Cookie")!.split(";")[0];
    const professor = await (await pedir("painel", "GET", undefined, cookieProfessor, "")).json();
    expect(professor.perfil).toBe("professor");
    expect(professor.avaliacaoAtual).toBeNull();
    expect(professor.avaliacaoAlunos).toBeNull();
    expect(professor.grupos[0].integrantes).toHaveLength(10);
    expect(professor.alunosSemGrupo).toEqual([
      { matricula: "13", nome: "André de Sousa" },
      { matricula: "12", nome: "Zélia dos Anjos" },
    ]);
    expect(professor.auditoria[0]).toMatchObject({ acao: "troca_grupo", matricula: "11", nome: "Álvaro da Silva e dos Santos-Lima" });
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, cookieProfessor)).status).toBe(403);
    expect((await pedir("/app/meu-grupo", "PUT", { grupoId: 2 }, await entrar("13"))).status).toBe(200);
    const atualizado = await (await pedir("painel", "GET", undefined, cookieProfessor)).json();
    expect(atualizado.alunosSemGrupo).toEqual([{ matricula: "12", nome: "Zélia dos Anjos" }]);

    expect((await pedir("/app/professor/avaliacao", "PUT", { grupoId: 1 }, cookieProfessor)).status).toBe(409);
    const sorteio = await pedir("/app/professor/sorteio", "PUT", undefined, cookieProfessor);
    expect(sorteio.status).toBe(200);
    const sorteado = (await sorteio.json()).avaliacaoAtual;
    expect([1, 2, 3]).toContain(sorteado.grupoId);
    expect(sorteado.estado).toBe("sorteado");
    expect((await pedir("/app/professor/dupla", "PUT", { grupoId: sorteado.grupoId }, cookieProfessor)).status).toBe(409);
    const repetido = await pedir("/app/professor/sorteio", "PUT", undefined, cookieProfessor);
    expect((await repetido.json()).avaliacaoAtual).toEqual(sorteado);
    expect((await pedir("/app/professor/avaliacao", "PUT", { grupoId: 10 }, cookieProfessor)).status).toBe(409);
    const inicio = await pedir("/app/professor/avaliacao", "PUT", { grupoId: sorteado.grupoId }, cookieProfessor);
    expect(inicio.status).toBe(200);
    const iniciado = await inicio.json();
    expect(iniciado.avaliacaoAtual).toEqual({ grupoId: sorteado.grupoId, estado: "em_avaliacao" });
    expect(iniciado.avaliacaoAlunos.dupla).toBeNull();
    const integrantesDoGrupo = banco.listarEscolhas()
      .filter(({ grupo_id }) => grupo_id === sorteado.grupoId).map(({ matricula }) => matricula);
    expect(iniciado.avaliacaoAlunos.integrantes.map(({ matricula }: { matricula: string }) => matricula).sort())
      .toEqual(integrantesDoGrupo.sort());
    const corpoDupla = { grupoId: sorteado.grupoId };
    const respostaDupla = await pedir("/app/professor/dupla", "PUT", corpoDupla, cookieProfessor);
    expect(respostaDupla.status).toBe(200);
    const dupla = (await respostaDupla.json()).avaliacaoAlunos.dupla;
    expect(integrantesDoGrupo).toContain(dupla.principal.matricula);
    if (integrantesDoGrupo.length === 1) {
      expect(dupla.assistente).toBeNull();
    } else {
      expect(integrantesDoGrupo).toContain(dupla.assistente.matricula);
      expect(dupla.assistente.matricula).not.toBe(dupla.principal.matricula);
    }
    const novaConsulta = await (await pedir("painel", "GET", undefined, cookieProfessor)).json();
    expect(novaConsulta.avaliacaoAlunos.dupla).toEqual(dupla);
  } finally {
    servidor.stop(true);
    banco.fechar();
  }
});

test("a dupla usa os integrantes registrados no início, mesmo após uma troca de grupo", () => {
  const banco = abrirBanco(":memory:");
  const alunos = new Set(["001", "002", "003"]);
  try {
    banco.escolher("001", 1, 10);
    banco.escolher("002", 1, 10);
    banco.escolher("003", 2, 10);
    expect(banco.sortearGrupo(new Set([1]), alunos)).toBe(true);
    expect(banco.iniciarAvaliacao(1, alunos)).toBe(true);
    banco.escolher("001", 2, 10);
    banco.escolher("003", 1, 10);
    expect(banco.integrantesDaAvaliacao(1, alunos)).toEqual(["001", "002"]);
    expect(banco.sortearDupla(1, alunos)).toBe(true);
    const dupla = banco.duplaDaAvaliacao(1)!;
    expect([dupla.principal, dupla.assistente].sort()).toEqual(["001", "002"]);
    expect(banco.sortearDupla(1, alunos)).toBe(true);
    expect(banco.duplaDaAvaliacao(1)).toEqual(dupla);
  } finally {
    banco.fechar();
  }
});

test("a escolha, o link e a auditoria persistem e as alterações são revertidas se o registro falhar", () => {
  const pasta = mkdtempSync(join(tmpdir(), "controle-n2-teste-"));
  const caminho = join(pasta, "grupo.sqlite");
  try {
    const banco = abrirBanco(caminho);
    try {
      expect(banco.sortearGrupo(new Set([1, 2]), new Set(["0001"]))).toBe(false);
      expect(banco.escolher("0001", 2, 10)).toBe(true);
      expect(banco.salvarRepositorio("0001", 2, "https://github.com/turma/projeto")).toBe(true);
      expect(banco.sortearGrupo(new Set([1, 2]), new Set(["0001"]))).toBe(true);
      expect(banco.avaliacaoAtual()).toEqual({ grupoId: 2, estado: "sorteado" });
    } finally {
      banco.fechar();
    }
    const reaberto = abrirBanco(caminho);
    try {
      expect(reaberto.grupoAtual("0001")).toBe(2);
      expect(reaberto.avaliacaoAtual()).toEqual({ grupoId: 2, estado: "sorteado" });
      expect(reaberto.listarRepositorios().get(2)).toBe("https://github.com/turma/projeto");
      expect(reaberto.listarAuditoria().map(({ acao }) => acao)).toEqual(["entrada_grupo", "envio_repositorio"]);

      const conexaoDeTeste = new Database(caminho);
      try {
        conexaoDeTeste.exec(`
          CREATE TRIGGER impedir_auditoria BEFORE INSERT ON auditoria
          BEGIN
            SELECT RAISE(ABORT, 'Falha simulada na auditoria');
          END;
        `);
      } finally {
        conexaoDeTeste.close();
      }

      expect(() => reaberto.escolher("0001", 3, 10)).toThrow("Falha simulada");
      expect(() => reaberto.salvarRepositorio("0001", 2, "https://github.com/turma/novo")).toThrow("Falha simulada");
      expect(reaberto.grupoAtual("0001")).toBe(2);
      expect(reaberto.listarRepositorios().get(2)).toBe("https://github.com/turma/projeto");
      expect(reaberto.listarAuditoria()).toHaveLength(2);
    } finally {
      reaberto.fechar();
    }
  } finally {
    if (Bun.file(caminho).size) unlinkSync(caminho);
    rmdirSync(pasta);
  }
});
