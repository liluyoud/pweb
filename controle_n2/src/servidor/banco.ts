import { Database } from "bun:sqlite";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import type { AvaliacaoGrupo, EventoAuditoria } from "../tipos";

export function caminhoBanco() {
  const arquivo = Bun.env.CONTROLE_N2_DADOS_EXEMPLO === "1" ? "exemplo.sqlite" : "controle_n2.sqlite";
  return fileURLToPath(new URL("../../" + arquivo, import.meta.url));
}

export function abrirBanco(caminho: string) {
  const banco = new Database(caminho);

  banco.exec(`
    CREATE TABLE IF NOT EXISTS escolhas (matricula TEXT PRIMARY KEY, grupo_id INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS escolhas_grupo ON escolhas (grupo_id);
    CREATE TABLE IF NOT EXISTS repositorios (grupo_id INTEGER PRIMARY KEY, url TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS auditoria (
      id INTEGER PRIMARY KEY,
      data_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      acao TEXT NOT NULL CHECK (
        acao IN ('entrada_grupo', 'troca_grupo', 'envio_repositorio', 'alteracao_repositorio')
      ),
      matricula TEXT NOT NULL,
      grupo_anterior_id INTEGER,
      grupo_id INTEGER NOT NULL,
      link_anterior TEXT,
      link_novo TEXT
    );
    CREATE TABLE IF NOT EXISTS avaliacoes_grupos (
      grupo_id INTEGER PRIMARY KEY,
      estado TEXT NOT NULL CHECK (estado IN ('sorteado', 'em_avaliacao', 'concluida'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uma_avaliacao_ativa
      ON avaliacoes_grupos ((1)) WHERE estado IN ('sorteado', 'em_avaliacao');
    CREATE TABLE IF NOT EXISTS avaliacao_integrantes (
      grupo_id INTEGER NOT NULL,
      matricula TEXT NOT NULL,
      PRIMARY KEY (grupo_id, matricula)
    );
    CREATE TABLE IF NOT EXISTS avaliacao_duplas (
      grupo_id INTEGER PRIMARY KEY,
      principal TEXT NOT NULL,
      assistente TEXT CHECK (assistente <> principal)
    );
  `);

  const consultaGrupo = banco.query<{ grupo_id: number }, [string]>(
    "SELECT grupo_id FROM escolhas WHERE matricula = ?",
  );
  const escolhas = banco.query<{ grupo_id: number; matricula: string }, []>(
    "SELECT grupo_id, matricula FROM escolhas",
  );
  const ocupacao = banco.query<{ total: number }, [number]>(
    "SELECT COUNT(*) AS total FROM escolhas WHERE grupo_id = ?",
  );
  const gravar = banco.query(
    "INSERT INTO escolhas (matricula, grupo_id) VALUES (?, ?) " +
    "ON CONFLICT (matricula) DO UPDATE SET grupo_id = excluded.grupo_id",
  );
  const repositorios = banco.query<{ grupo_id: number; url: string }, []>(
    "SELECT grupo_id, url FROM repositorios",
  );
  const consultarRepositorio = banco.query<{ url: string }, [number]>(
    "SELECT url FROM repositorios WHERE grupo_id = ?",
  );
  const gravarRepositorio = banco.query(
    "INSERT INTO repositorios (grupo_id, url) VALUES (?, ?) " +
    "ON CONFLICT (grupo_id) DO UPDATE SET url = excluded.url",
  );
  const registrarAuditoria = banco.query<unknown, [
    EventoAuditoria["acao"], string, number | null, number, string | null, string | null,
  ]>(`
    INSERT INTO auditoria (acao, matricula, grupo_anterior_id, grupo_id, link_anterior, link_novo)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const historico = banco.query<EventoAuditoria, []>("SELECT * FROM auditoria ORDER BY id");
  const consultaAvaliacaoAtual = banco.query<AvaliacaoGrupo, []>(`
    SELECT grupo_id AS grupoId, estado FROM avaliacoes_grupos
    WHERE estado IN ('sorteado', 'em_avaliacao')
  `);
  const avaliacoesConcluidas = banco.query<{ grupo_id: number }, []>(
    "SELECT grupo_id FROM avaliacoes_grupos WHERE estado = 'concluida'",
  );
  const gravarSorteio = banco.query("INSERT INTO avaliacoes_grupos (grupo_id, estado) VALUES (?, 'sorteado')");
  const removerSorteioVazio = banco.query("DELETE FROM avaliacoes_grupos WHERE grupo_id = ? AND estado = 'sorteado'");
  const gravarInicio = banco.query("UPDATE avaliacoes_grupos SET estado = 'em_avaliacao' WHERE grupo_id = ?");
  const membrosDoGrupo = banco.query<{ matricula: string }, [number]>(
    "SELECT matricula FROM escolhas WHERE grupo_id = ? ORDER BY matricula",
  );
  const integrantesRegistrados = banco.query<{ matricula: string }, [number]>(
    "SELECT matricula FROM avaliacao_integrantes WHERE grupo_id = ? ORDER BY matricula",
  );
  const guardarIntegrante = banco.query("INSERT INTO avaliacao_integrantes (grupo_id, matricula) VALUES (?, ?)");
  const consultaDupla = banco.query<{ principal: string; assistente: string | null }, [number]>(
    "SELECT principal, assistente FROM avaliacao_duplas WHERE grupo_id = ?",
  );
  const gravarDupla = banco.query("INSERT INTO avaliacao_duplas (grupo_id, principal, assistente) VALUES (?, ?, ?)");

  function membrosValidos(grupo: number, alunos: ReadonlySet<string>) {
    return membrosDoGrupo.all(grupo).map(({ matricula }) => matricula).filter((matricula) => alunos.has(matricula));
  }

  function integrantesDaAvaliacao(grupo: number, alunos: ReadonlySet<string>) {
    const registrados = integrantesRegistrados.all(grupo);
    return registrados.length > 0 ? registrados.map(({ matricula }) => matricula) : membrosValidos(grupo, alunos);
  }

  function gruposComAlunos(matriculasValidas: ReadonlySet<string>) {
    return new Set(escolhas.all()
      .filter(({ matricula }) => matriculasValidas.has(matricula))
      .map(({ grupo_id }) => grupo_id));
  }

  const sortearGrupo = banco.transaction((grupos: ReadonlySet<number>, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    const ocupados = gruposComAlunos(alunos);
    if (atual?.estado === "em_avaliacao" || (atual && ocupados.has(atual.grupoId))) return true;

    const concluidos = new Set(avaliacoesConcluidas.all().map(({ grupo_id }) => grupo_id));
    const candidatos = [...grupos].filter((id) => ocupados.has(id) && !concluidos.has(id));
    if (candidatos.length === 0) return false;
    if (atual) removerSorteioVazio.run(atual.grupoId);
    gravarSorteio.run(candidatos[randomInt(candidatos.length)]);
    return true;
  });

  const iniciarAvaliacao = banco.transaction((id: number, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    if (!atual || atual.grupoId !== id) return false;
    if (atual.estado === "em_avaliacao") return true;
    const membros = membrosValidos(id, alunos);
    if (membros.length === 0) return false;
    gravarInicio.run(id);
    for (const matricula of membros) guardarIntegrante.run(id, matricula);
    return true;
  });

  const sortearDupla = banco.transaction((id: number, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    if (atual?.grupoId !== id || atual.estado !== "em_avaliacao") return false;
    if (consultaDupla.get(id)) return true;

    // Avaliações iniciadas antes desta versão registram o grupo no primeiro sorteio.
    const registrados = integrantesRegistrados.all(id);
    const candidatos = registrados.length > 0
      ? registrados.map(({ matricula }) => matricula)
      : membrosValidos(id, alunos);
    if (candidatos.length === 0) return false;
    if (registrados.length === 0) {
      for (const matricula of candidatos) guardarIntegrante.run(id, matricula);
    }
    const [principal] = candidatos.splice(randomInt(candidatos.length), 1);
    const assistente = candidatos.length > 0 ? candidatos[randomInt(candidatos.length)] : null;
    gravarDupla.run(id, principal, assistente);
    return true;
  });

  const escolher = banco.transaction((matricula: string, grupo: number, limite: number) => {
    const anterior = consultaGrupo.get(matricula)?.grupo_id ?? null;
    if (anterior === grupo) return true;
    if (ocupacao.get(grupo)!.total >= limite) return false;
    gravar.run(matricula, grupo);
    registrarAuditoria.run(anterior === null ? "entrada_grupo" : "troca_grupo",
      matricula, anterior, grupo, null, null);
    return true;
  });

  const salvarRepositorio = banco.transaction((matricula: string, grupo: number, url: string) => {
    if (consultaGrupo.get(matricula)?.grupo_id !== grupo) return false;
    const anterior = consultarRepositorio.get(grupo)?.url ?? null;
    if (anterior === url) return true;
    gravarRepositorio.run(grupo, url);
    registrarAuditoria.run(anterior === null ? "envio_repositorio" : "alteracao_repositorio",
      matricula, null, grupo, anterior, url);
    return true;
  });

  return {
    grupoAtual: (matricula: string) => consultaGrupo.get(matricula)?.grupo_id ?? null,
    listarEscolhas: () => escolhas.all(),
    listarRepositorios: () => new Map(repositorios.all().map(({ grupo_id, url }) => [grupo_id, url])),
    listarAuditoria: () => historico.all(),
    avaliacaoAtual: () => consultaAvaliacaoAtual.get(),
    sortearGrupo: sortearGrupo.immediate,
    iniciarAvaliacao: iniciarAvaliacao.immediate,
    integrantesDaAvaliacao,
    duplaDaAvaliacao: (grupo: number) => consultaDupla.get(grupo),
    sortearDupla: sortearDupla.immediate,
    salvarRepositorio: salvarRepositorio.immediate,
    escolher: escolher.immediate,
    fechar: () => banco.close(),
  };
}
