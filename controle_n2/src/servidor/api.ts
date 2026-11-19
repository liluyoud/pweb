import { timingSafeEqual } from "node:crypto";
import type { Server } from "bun";
import { LIMITE_ARQUIVO_ALUNOS, type AcaoAvaliacao, type AvaliacaoAlunos, type Grupo, type PainelSessao, type Projeto } from "../tipos";
import type { abrirBanco } from "./banco";
import type { Configuracao } from "./configuracao";
import { lerAlunos } from "./documentos";

const LIMITE = 10;
const DURACAO_SESSAO = 8 * 60 * 60;
const JANELA_TENTATIVAS = 5 * 60 * 1000;
export const COOKIE_SESSAO = "controle_n2_sessao_web";

function resposta(dados: unknown, status = 200, cookie?: string) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (cookie) headers.set("Set-Cookie", cookie);
  return Response.json(dados, { status, headers });
}

function erro(mensagem: string, status: number) {
  return resposta({ erro: mensagem }, status);
}

// Atrás de um proxy (Traefik → nginx), o servidor recebe HTTP mesmo quando o
// navegador usa HTTPS. Com confiarProxy, o protocolo vem de X-Forwarded-Proto.
function protocolo(requisicao: Request, confiarProxy = false) {
  const informado = requisicao.headers.get("X-Forwarded-Proto")?.split(",")[0].trim();
  if (confiarProxy && (informado === "https" || informado === "http")) return informado + ":";
  return new URL(requisicao.url).protocol;
}

function cookieSessao(requisicao: Request, token: string, duracao: number, confiarProxy = false) {
  const seguro = protocolo(requisicao, confiarProxy) === "https:" ? "; Secure" : "";
  return COOKIE_SESSAO + "=" + token + "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" + duracao + seguro;
}

async function lerCorpo(requisicao: Request): Promise<Record<string, unknown>> {
  const dados: unknown = await requisicao.json().catch(() => null);
  return dados && typeof dados === "object" && !Array.isArray(dados)
    ? dados as Record<string, unknown>
    : {};
}

function linkGithub(valor: unknown) {
  if (typeof valor !== "string" || valor.length > 300) return null;
  const partes = /^https:\/\/github\.com\/([a-z\d][a-z\d-]*)\/([\w.-]+)\/?$/i.exec(valor.trim());
  if (!partes || partes[2] === "." || partes[2] === "..") return null;
  return "https://github.com/" + partes[1] + "/" + partes[2];
}

function lerAcaoAvaliacao({ tipo, rodadaId, matricula }: Record<string, unknown>): AcaoAvaliacao | null {
  if (tipo === "finalizar-avaliacao" && rodadaId === null) return { tipo, rodadaId };
  if (typeof rodadaId !== "number" || !Number.isSafeInteger(rodadaId) || rodadaId < 1) return null;
  if (tipo === "finalizar-avaliacao" || tipo === "finalizar-dupla" || tipo === "abrir-pergunta") {
    return { tipo, rodadaId };
  }
  if (tipo === "escolher-voluntario" && typeof matricula === "string") return { tipo, rodadaId, matricula };
  return null;
}

export function criarApi(
  alunos: ReturnType<typeof lerAlunos>,
  projetos: Projeto[],
  banco: ReturnType<typeof abrirBanco>,
  configuracao: Configuracao,
) {
  // As sessões ficam em memória. Ao reiniciar, cada aluno faz login novamente.
  type Identidade = { perfil: "aluno" | "professor"; matricula: string };
  const sessoes = new Map<string, Identidade & { expira: number }>();
  const falhas = new Map<string, { total: number; expira: number }>();
  const grupos = new Set(projetos.map((projeto) => projeto.id));
  const matriculasValidas = new Set(alunos.keys());
  const chave = Buffer.from(configuracao.appKey);
  if (alunos.has(configuracao.professor.matricula)) {
    throw new Error("A matrícula do professor deve ser diferente das matrículas dos alunos.");
  }
  banco.importarAlunos(alunos);

  function consultarGrupos(escolhas = banco.listarEscolhas(), grupoAtual?: number | null, matricula?: string) {
    const colegasDoGrupo: string[] = [];
    const porGrupo = new Map<number, { ocupacao: number; integrantes: string[] }>();
    for (const escolha of escolhas) {
      const grupo = porGrupo.get(escolha.grupo_id) ?? { ocupacao: 0, integrantes: [] };
      const aluno = alunos.get(escolha.matricula);
      grupo.ocupacao++;
      if (aluno) {
        grupo.integrantes.push(aluno.nome);
        if (escolha.grupo_id === grupoAtual && escolha.matricula !== matricula) {
          colegasDoGrupo.push(aluno.nome);
        }
      }
      porGrupo.set(escolha.grupo_id, grupo);
    }

    const repositorios = banco.listarRepositorios();
    const lista: Grupo[] = projetos.map((projeto) => {
      const grupo = porGrupo.get(projeto.id);
      return {
        ...projeto,
        ocupacao: grupo?.ocupacao ?? 0,
        integrantes: grupo?.integrantes.sort((a, b) => a.localeCompare(b, "pt-BR")) ?? [],
        repositorioGithub: repositorios.get(projeto.id) ?? null,
        limite: LIMITE,
      };
    });
    return {
      lista,
      colegasDoGrupo: colegasDoGrupo.sort((a, b) => a.localeCompare(b, "pt-BR")),
    };
  }

  function painel({ perfil, matricula }: Identidade): PainelSessao {
    if (perfil === "professor") {
      const escolhas = banco.listarEscolhas();
      const matriculasComGrupo = new Set(escolhas
        .filter(({ grupo_id }) => grupos.has(grupo_id))
        .map(({ matricula }) => matricula));
      const alunosSemGrupo = Array.from(alunos)
        .filter(([matricula]) => !matriculasComGrupo.has(matricula))
        .map(([matricula, { nome }]) => ({ matricula, nome }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR") || a.matricula.localeCompare(b.matricula));
      const avaliacaoAtual = banco.avaliacaoAtual();
      const avaliacaoAlunos = avaliacaoAtual?.estado === "em_avaliacao"
        ? consultarAvaliacaoAlunos(avaliacaoAtual.grupoId)
        : null;
      return {
        perfil,
        grupos: consultarGrupos(escolhas).lista,
        avaliacaoAtual,
        avaliacaoAlunos,
        avaliacoesConcluidas: banco.avaliacoesConcluidas()
          .filter((grupoId) => grupos.has(grupoId))
          .map((grupoId) => ({ grupoId, ...consultarAvaliacaoAlunos(grupoId) })),
        alunosSemGrupo,
        auditoria: banco.listarAuditoria().reverse().map((evento) => ({
          ...evento,
          nome: alunos.get(evento.matricula)?.nome ?? null,
        })),
      };
    }
    const grupoAtual = banco.grupoAtual(matricula);
    const { lista, colegasDoGrupo } = consultarGrupos(banco.listarEscolhas(), grupoAtual, matricula);
    return {
      perfil,
      nome: alunos.get(matricula)!.nome,
      grupoAtual,
      colegasDoGrupo,
      repositorioGithub: lista.find(({ id }) => id === grupoAtual)?.repositorioGithub ?? null,
      grupos: lista,
    };
  }

  function consultarAvaliacaoAlunos(grupoId: number): AvaliacaoAlunos {
    const dadosDoAluno = (matricula: string) => ({
      matricula, nome: alunos.get(matricula)?.nome ?? matricula,
    });
    const integrantes = banco.integrantesDaAvaliacao(grupoId, matriculasValidas)
      .map(dadosDoAluno)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR") || a.matricula.localeCompare(b.matricula));
    const rodadas = banco.rodadasDaAvaliacao(grupoId).map((rodada) => ({
      id: rodada.id,
      principal: dadosDoAluno(rodada.principal),
      assistente: rodada.assistente === null ? null : dadosDoAluno(rodada.assistente),
      aberta: rodada.aberta === 1,
      voluntario: rodada.voluntario === null ? null : dadosDoAluno(rodada.voluntario),
      finalizada: rodada.finalizada === 1,
    }));
    return {
      integrantes,
      dupla: rodadas.find(({ finalizada }) => !finalizada) ?? null,
      rodadasFinalizadas: rodadas.filter(({ finalizada }) => finalizada),
    };
  }

  async function atender(requisicao: Request, servidor: Server<unknown>, chaveInterna?: string) {
    const url = new URL(requisicao.url);
    const { pathname } = url;
    const { method } = requisicao;
    const agora = Date.now();
    const token = new Bun.CookieMap(requisicao.headers.get("Cookie") ?? "").get(COOKIE_SESSAO) ?? "";
    const sessao = sessoes.get(token);

    const origem = requisicao.headers.get("Origin");
    const origemEsperada = protocolo(requisicao, configuracao.confiarProxy) + "//" + url.host;
    if (method !== "GET" && (origem !== null || chaveInterna !== undefined) && origem !== origemEsperada) {
      return erro("Origem da requisição inválida.", 403);
    }

    if (method === "GET" && pathname === "/api/grupos") {
      return resposta(consultarGrupos().lista.map(({ integrantes, ...grupo }) => grupo));
    }

    if (method === "POST" && pathname === "/api/sessao") {
      // Atrás do proxy, todos chegariam com o IP do proxy e dividiriam o mesmo limite.
      const ipDoProxy = configuracao.confiarProxy ? requisicao.headers.get("X-Real-IP")?.trim() : undefined;
      const ip = ipDoProxy || (servidor.requestIP(requisicao)?.address ?? "local");
      for (const [chave, registro] of falhas) {
        if (registro.expira <= agora) falhas.delete(chave);
      }
      for (const [chave, registro] of sessoes) {
        if (registro.expira <= agora) sessoes.delete(chave);
      }
      const tentativas = falhas.get(ip) ?? { total: 0, expira: agora + JANELA_TENTATIVAS };
      if (tentativas.total >= 20) return erro("Muitas tentativas. Aguarde alguns minutos.", 429);

      const { matricula, nascimento } = await lerCorpo(requisicao);
      const numero = typeof matricula === "string" ? matricula.trim() : "";
      const professor = numero === configuracao.professor.matricula;
      const dataEsperada = professor ? configuracao.professor.nascimento : alunos.get(numero)?.nascimento;
      if (!numero || typeof nascimento !== "string" || dataEsperada !== nascimento) {
        tentativas.total += 1;
        falhas.set(ip, tentativas);
        return erro("Matrícula ou data de nascimento inválida.", 401);
      }

      sessoes.delete(token);
      const novoToken = crypto.randomUUID();
      const novaSessao: Identidade & { expira: number } = {
        perfil: professor ? "professor" : "aluno", matricula: numero, expira: agora + DURACAO_SESSAO * 1000,
      };
      sessoes.set(novoToken, novaSessao);
      return resposta(painel(novaSessao), 200, cookieSessao(requisicao, novoToken, DURACAO_SESSAO, configuracao.confiarProxy));
    }

    if (method === "DELETE" && pathname === "/api/sessao") {
      sessoes.delete(token);
      return resposta({}, 200, cookieSessao(requisicao, "", 0, configuracao.confiarProxy));
    }

    if (!sessao || sessao.expira <= agora) {
      sessoes.delete(token);
      return erro("Entre para consultar seus grupos.", 401);
    }

    if (method === "GET" && pathname === "/api/painel") return resposta(painel(sessao));

    if (method === "PUT" && pathname.startsWith("/app/")) {
      const informada = Buffer.from(chaveInterna ?? "");
      if (informada.length !== chave.length || !timingSafeEqual(informada, chave)) {
        return erro("Não foi possível autorizar a operação no servidor.", 500);
      }
      const perfilExigido = pathname.startsWith("/app/professor/") ? "professor" : "aluno";
      if (sessao.perfil !== perfilExigido) return erro("Seu perfil não pode realizar esta operação.", 403);
    }

    if (method === "PUT" && pathname === "/app/professor/alunos") {
      const formulario = await requisicao.formData().catch(() => null);
      const arquivo = formulario?.get("arquivo");
      if (!(arquivo instanceof File) || formulario!.getAll("arquivo").length !== 1 || !/\.md$/i.test(arquivo.name)) {
        return erro("Selecione um arquivo Markdown (.md) com a tabela de alunos.", 400);
      }
      if (arquivo.size > LIMITE_ARQUIVO_ALUNOS) return erro("O arquivo de alunos deve ter no máximo 1 MiB.", 413);
      let importados: ReturnType<typeof lerAlunos>;
      try {
        const texto = new TextDecoder("utf-8", { fatal: true }).decode(await arquivo.arrayBuffer());
        importados = lerAlunos(texto);
      } catch (problema) {
        return erro(problema instanceof TypeError ? "Salve o arquivo Markdown com codificação UTF-8."
          : problema instanceof Error ? problema.message : "Arquivo de alunos inválido.", 400);
      }
      if (importados.has(configuracao.professor.matricula)) {
        return erro("A matrícula do professor não pode estar na lista de alunos.", 400);
      }
      const resultado = banco.importarAlunos(importados);
      for (const [matricula, aluno] of importados) {
        const anterior = alunos.get(matricula);
        if (anterior && (anterior.nome !== aluno.nome || anterior.nascimento !== aluno.nascimento)) {
          for (const [token, sessaoDoAluno] of sessoes) {
            if (sessaoDoAluno.perfil === "aluno" && sessaoDoAluno.matricula === matricula) sessoes.delete(token);
          }
        }
        alunos.set(matricula, aluno);
        matriculasValidas.add(matricula);
      }
      return resposta({ painel: painel(sessao), importacao: resultado });
    }

    if (method === "PUT" && pathname === "/app/professor/sorteio") {
      if (!banco.sortearGrupo(grupos, matriculasValidas)) {
        return erro("Não há grupos com integrantes e link do GitHub disponíveis para o sorteio.", 409);
      }
      return resposta(painel(sessao));
    }

    if (method === "PUT" && pathname === "/app/professor/avaliacao") {
      const { grupoId } = await lerCorpo(requisicao);
      if (typeof grupoId !== "number" || !grupos.has(grupoId)) return erro("Grupo inválido.", 400);
      if (!banco.iniciarAvaliacao(grupoId, matriculasValidas)) {
        return erro("O grupo precisa estar sorteado, ter integrantes e enviar o link do GitHub para iniciar a avaliação.", 409);
      }
      return resposta(painel(sessao));
    }

    if (method === "PUT" && pathname === "/app/professor/dupla") {
      const { grupoId } = await lerCorpo(requisicao);
      if (typeof grupoId !== "number" || !grupos.has(grupoId)) return erro("Grupo inválido.", 400);
      if (!banco.sortearDupla(grupoId, matriculasValidas)) {
        return erro("É preciso ter uma avaliação em andamento e integrantes disponíveis para o sorteio.", 409);
      }
      return resposta(painel(sessao));
    }

    if (method === "PUT" && pathname === "/app/professor/avaliacao/acoes") {
      const corpo = await lerCorpo(requisicao);
      const { grupoId } = corpo;
      if (typeof grupoId !== "number" || !grupos.has(grupoId)) return erro("Grupo inválido.", 400);
      const acao = lerAcaoAvaliacao(corpo);
      if (!acao) return erro("Ação de avaliação inválida.", 400);
      if (!banco.atualizarAvaliacao(grupoId, acao, matriculasValidas)) {
        return erro("A ação não está disponível para esta rodada. Consulte o estado atual da avaliação.", 409);
      }
      return resposta(painel(sessao));
    }

    if (method === "PUT" && pathname === "/app/meu-grupo/repositorio") {
      const { grupoId, link } = await lerCorpo(requisicao);
      const repositorio = linkGithub(link);
      if (!repositorio) return erro("Informe o link do repositório no formato https://github.com/usuario/projeto.", 400);
      if (typeof grupoId !== "number" || !grupos.has(grupoId)) return erro("Grupo inválido.", 400);
      if (!banco.salvarRepositorio(sessao.matricula, grupoId, repositorio)) {
        return erro("Você precisa fazer parte deste grupo para enviar o link.", 409);
      }
      return resposta(painel(sessao));
    }

    if (method === "PUT" && pathname === "/app/meu-grupo") {
      const { grupoId } = await lerCorpo(requisicao);
      if (typeof grupoId !== "number" || !grupos.has(grupoId)) return erro("Grupo inválido.", 400);
      if (!banco.escolher(sessao.matricula, grupoId, LIMITE)) {
        return erro("Este grupo está cheio. Sua escolha anterior foi mantida.", 409);
      }
      return resposta(painel(sessao));
    }

    return erro("Rota não encontrada.", 404);
  }

  // Só o servidor fornece a APP_KEY às operações da interface.
  const escreverPeloSistema = (req: Request, servidor: Server<unknown>) =>
    atender(req, servidor, configuracao.appKey);

  return {
    "/api/grupos": { GET: atender },
    "/api/sessao": { POST: atender, DELETE: atender },
    "/api/painel": { GET: atender },
    "/api/*": () => erro("Rota não encontrada. Alterações são feitas pelo sistema.", 404),
    "/app/meu-grupo": { PUT: escreverPeloSistema },
    "/app/meu-grupo/repositorio": { PUT: escreverPeloSistema },
    "/app/professor/sorteio": { PUT: escreverPeloSistema },
    "/app/professor/alunos": { PUT: escreverPeloSistema },
    "/app/professor/avaliacao": { PUT: escreverPeloSistema },
    "/app/professor/avaliacao/acoes": { PUT: escreverPeloSistema },
    "/app/professor/dupla": { PUT: escreverPeloSistema },
  };
}
