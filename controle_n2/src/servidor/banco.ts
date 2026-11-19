import { Database } from "bun:sqlite";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import type { AcaoAvaliacao, AvaliacaoGrupo, CadastroAluno, EventoAuditoria } from "../tipos";

type Rodada = {
  id: number;
  principal: string;
  assistente: string | null;
  aberta: number;
  voluntario: string | null;
  finalizada: number;
};

export function caminhoBanco() {
  // No contêiner, CONTROLE_N2_BANCO aponta para um volume que sobrevive aos deploys.
  if (Bun.env.CONTROLE_N2_BANCO?.trim()) return Bun.env.CONTROLE_N2_BANCO.trim();
  const arquivo = Bun.env.CONTROLE_N2_DADOS_EXEMPLO === "1" ? "exemplo.sqlite" : "controle_n2.sqlite";
  return fileURLToPath(new URL("../../" + arquivo, import.meta.url));
}

export function abrirBanco(caminho: string) {
  const banco = new Database(caminho);

  banco.exec(`
    CREATE TABLE IF NOT EXISTS alunos (
      matricula TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      nascimento TEXT NOT NULL
    );
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
    CREATE TABLE IF NOT EXISTS avaliacao_rodadas (
      id INTEGER PRIMARY KEY,
      grupo_id INTEGER NOT NULL,
      principal TEXT NOT NULL,
      assistente TEXT CHECK (assistente <> principal),
      aberta INTEGER NOT NULL DEFAULT 0,
      voluntario TEXT,
      finalizada INTEGER NOT NULL DEFAULT 0
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uma_rodada_ativa_por_grupo
      ON avaliacao_rodadas (grupo_id) WHERE finalizada = 0;
  `);

  banco.transaction(() => {
    if (!banco.query("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = 'avaliacao_duplas'").get()) return;
    banco.exec(`
      INSERT INTO avaliacao_rodadas (grupo_id, principal, assistente, finalizada)
      SELECT d.grupo_id, d.principal, d.assistente, CASE WHEN a.estado = 'concluida' THEN 1 ELSE 0 END
      FROM avaliacao_duplas d LEFT JOIN avaliacoes_grupos a USING (grupo_id);
      DROP TABLE avaliacao_duplas;
    `);
  }).immediate();

  const alunosCadastrados = banco.query<CadastroAluno & { matricula: string }, []>(
    "SELECT matricula, nome, nascimento FROM alunos ORDER BY matricula",
  );
  const gravarAluno = banco.query(`
    INSERT INTO alunos (matricula, nome, nascimento) VALUES (?, ?, ?)
    ON CONFLICT (matricula) DO UPDATE SET nome = excluded.nome, nascimento = excluded.nascimento
  `);
  function listarAlunos() {
    return new Map(alunosCadastrados.all().map(({ matricula, nome, nascimento }) => [matricula, { nome, nascimento }]));
  }
  const importarAlunos = banco.transaction((alunos: ReadonlyMap<string, CadastroAluno>) => {
    const anteriores = listarAlunos();
    let adicionados = 0;
    let atualizados = 0;
    let inalterados = 0;
    for (const [matricula, aluno] of alunos) {
      const anterior = anteriores.get(matricula);
      if (anterior?.nome === aluno.nome && anterior.nascimento === aluno.nascimento) {
        inalterados++;
        continue;
      }
      gravarAluno.run(matricula, aluno.nome, aluno.nascimento);
      if (anterior) atualizados++;
      else adicionados++;
    }
    return { total: alunos.size, adicionados, atualizados, inalterados, totalCadastrados: anteriores.size + adicionados };
  });

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
  const consultaDupla = banco.query<Rodada, [number]>(
    "SELECT * FROM avaliacao_rodadas WHERE grupo_id = ? AND finalizada = 0",
  );
  const consultarRodadas = banco.query<Rodada, [number]>(
    "SELECT * FROM avaliacao_rodadas WHERE grupo_id = ? ORDER BY id",
  );
  const gravarDupla = banco.query("INSERT INTO avaliacao_rodadas (grupo_id, principal, assistente) VALUES (?, ?, ?)");
  const concluirDupla = banco.query("UPDATE avaliacao_rodadas SET finalizada = 1 WHERE id = ?");
  const abrirPergunta = banco.query("UPDATE avaliacao_rodadas SET aberta = 1 WHERE id = ?");
  const gravarVoluntario = banco.query("UPDATE avaliacao_rodadas SET voluntario = ? WHERE id = ?");
  const concluirAvaliacao = banco.query("UPDATE avaliacoes_grupos SET estado = 'concluida' WHERE grupo_id = ?");

  function membrosValidos(grupo: number, alunos: ReadonlySet<string>) {
    return membrosDoGrupo.all(grupo).map(({ matricula }) => matricula).filter((matricula) => alunos.has(matricula));
  }

  function integrantesDaAvaliacao(grupo: number, alunos: ReadonlySet<string>) {
    const registrados = integrantesRegistrados.all(grupo);
    return registrados.length > 0 ? registrados.map(({ matricula }) => matricula) : membrosValidos(grupo, alunos);
  }

  function integrantesDisponiveis(grupo: number, integrantes: string[]) {
    const participantes = new Set(consultarRodadas.all(grupo).flatMap(
      ({ principal, assistente, voluntario }) => [principal, assistente, voluntario],
    ));
    return integrantes.filter((matricula) => !participantes.has(matricula));
  }

  function gruposComAlunos(matriculasValidas: ReadonlySet<string>) {
    return new Set(escolhas.all()
      .filter(({ matricula }) => matriculasValidas.has(matricula))
      .map(({ grupo_id }) => grupo_id));
  }

  // Só pode ser escolhido o grupo que tem integrantes e já enviou o link do GitHub.
  function gruposElegiveis(alunos: ReadonlySet<string>) {
    const ocupados = gruposComAlunos(alunos);
    const comRepositorio = new Set(repositorios.all()
      .filter(({ url }) => url.trim())
      .map(({ grupo_id }) => grupo_id));
    return new Set([...ocupados].filter((id) => comRepositorio.has(id)));
  }

  const sortearGrupo = banco.transaction((grupos: ReadonlySet<number>, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    const elegiveis = gruposElegiveis(alunos);
    if (atual?.estado === "em_avaliacao" || (atual && elegiveis.has(atual.grupoId))) return true;

    const concluidos = new Set(avaliacoesConcluidas.all().map(({ grupo_id }) => grupo_id));
    const candidatos = [...grupos].filter((id) => elegiveis.has(id) && !concluidos.has(id));
    if (candidatos.length === 0) return false;
    if (atual) removerSorteioVazio.run(atual.grupoId);
    gravarSorteio.run(candidatos[randomInt(candidatos.length)]);
    return true;
  });

  const iniciarAvaliacao = banco.transaction((id: number, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    if (!atual || atual.grupoId !== id) return false;
    if (atual.estado === "em_avaliacao") return true;
    if (!consultarRepositorio.get(id)?.url.trim()) return false;
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
    const integrantes = registrados.length > 0
      ? registrados.map(({ matricula }) => matricula)
      : membrosValidos(id, alunos);
    const candidatos = integrantesDisponiveis(id, integrantes);
    if (candidatos.length === 0) return false;
    if (registrados.length === 0) {
      for (const matricula of integrantes) guardarIntegrante.run(id, matricula);
    }
    const [principal] = candidatos.splice(randomInt(candidatos.length), 1);
    const assistente = candidatos.length > 0 ? candidatos[randomInt(candidatos.length)] : null;
    gravarDupla.run(id, principal, assistente);
    return true;
  });

  const atualizarAvaliacao = banco.transaction((id: number, acao: AcaoAvaliacao, alunos: ReadonlySet<string>) => {
    const atual = consultaAvaliacaoAtual.get();
    if (atual?.grupoId !== id || atual.estado !== "em_avaliacao") return false;
    const dupla = consultaDupla.get(id);
    if ((dupla?.id ?? null) !== acao.rodadaId) return false;

    if (acao.tipo === "finalizar-avaliacao") {
      if (dupla) concluirDupla.run(dupla.id);
      else if (consultarRodadas.all(id).length === 0) return false;
      concluirAvaliacao.run(id);
      return true;
    }
    if (!dupla) return false;
    if (acao.tipo === "finalizar-dupla") {
      concluirDupla.run(dupla.id);
      return true;
    }
    if (acao.tipo === "abrir-pergunta") {
      abrirPergunta.run(dupla.id);
      return true;
    }
    if (acao.tipo === "escolher-voluntario") {
      if (dupla.voluntario === acao.matricula) return true;
      const disponiveis = integrantesDisponiveis(id, integrantesDaAvaliacao(id, alunos));
      if (!dupla.aberta || dupla.voluntario || !disponiveis.includes(acao.matricula)) return false;
      gravarVoluntario.run(acao.matricula, dupla.id);
      return true;
    }
    return false;
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

  const iniciarGrupos = banco.transaction((alunos: ReadonlySet<string>, grupos: ReadonlySet<number>, limite = 10) => {
    if (!Number.isInteger(limite) || limite < 1) throw new Error("Limite de integrantes inválido.");
    const atuais = escolhas.all();
    const inscritos = new Set(atuais.map(({ matricula }) => matricula));
    const candidatos = [...alunos].filter((matricula) => !inscritos.has(matricula));
    const jaInscritos = alunos.size - candidatos.length;
    const quantidade = Math.max(0, alunos.size - Math.round(alunos.size * 0.2) - jaInscritos);
    const ocupacoes = new Map([...grupos].map((id) => [id, 0]));
    for (const { grupo_id } of atuais) {
      if (ocupacoes.has(grupo_id)) ocupacoes.set(grupo_id, ocupacoes.get(grupo_id)! + 1);
    }
    const vagas = [...ocupacoes.values()].reduce((total, ocupacao) => total + Math.max(0, limite - ocupacao), 0);
    if (quantidade > vagas) throw new Error("Não há vagas para inscrever cerca de 80% dos alunos. Nenhuma inscrição foi alterada.");

    // Fisher–Yates: sorteia também quem ficará sem inscrição.
    for (let indice = candidatos.length - 1; indice > 0; indice--) {
      const sorteado = randomInt(indice + 1);
      [candidatos[indice], candidatos[sorteado]] = [candidatos[sorteado], candidatos[indice]];
    }
    for (const matricula of candidatos.slice(0, quantidade)) {
      const menorOcupacao = Math.min(...[...ocupacoes.values()].filter((total) => total < limite));
      const disponiveis = [...ocupacoes].filter(([, total]) => total === menorOcupacao).map(([id]) => id);
      const grupo = disponiveis[randomInt(disponiveis.length)];
      gravar.run(matricula, grupo);
      registrarAuditoria.run("entrada_grupo", matricula, null, grupo, null, null);
      ocupacoes.set(grupo, ocupacoes.get(grupo)! + 1);
    }
    return { inscritos: jaInscritos + quantidade, novos: quantidade, semGrupo: candidatos.length - quantidade };
  });

  return {
    listarAlunos,
    importarAlunos: importarAlunos.immediate,
    grupoAtual: (matricula: string) => consultaGrupo.get(matricula)?.grupo_id ?? null,
    listarEscolhas: () => escolhas.all(),
    listarRepositorios: () => new Map(repositorios.all().map(({ grupo_id, url }) => [grupo_id, url])),
    listarAuditoria: () => historico.all(),
    avaliacaoAtual: () => consultaAvaliacaoAtual.get(),
    avaliacoesConcluidas: () => avaliacoesConcluidas.all().map(({ grupo_id }) => grupo_id),
    sortearGrupo: sortearGrupo.immediate,
    iniciarAvaliacao: iniciarAvaliacao.immediate,
    integrantesDaAvaliacao,
    duplaDaAvaliacao: (grupo: number) => consultaDupla.get(grupo),
    rodadasDaAvaliacao: (grupo: number) => consultarRodadas.all(grupo),
    sortearDupla: sortearDupla.immediate,
    atualizarAvaliacao: atualizarAvaliacao.immediate,
    salvarRepositorio: salvarRepositorio.immediate,
    escolher: escolher.immediate,
    iniciarGrupos: iniciarGrupos.immediate,
    fechar: () => banco.close(),
  };
}
