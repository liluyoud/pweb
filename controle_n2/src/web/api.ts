import { LIMITE_ARQUIVO_ALUNOS, type AcaoAvaliacao, type ImportacaoAlunos, type Painel, type PainelProfessor, type PainelSessao } from "../tipos";

export class ErroDaApi extends Error {
  constructor(mensagem: string, public status: number) {
    super(mensagem);
  }
}

async function pedir<T>(caminho: string, metodo = "GET", dados?: object | FormData): Promise<T> {
  const formulario = dados instanceof FormData;
  // "." torna o endereço relativo à página: /api/painel vira ./api/painel.
  // Isso permite publicar o sistema em um subcaminho, como /n2/.
  const resposta = await fetch("." + caminho, {
    method: metodo,
    headers: dados && !formulario ? { "Content-Type": "application/json" } : undefined,
    body: formulario ? dados : dados ? JSON.stringify(dados) : undefined,
  });
  const corpo = await resposta.json();
  if (!resposta.ok) throw new ErroDaApi(corpo.erro, resposta.status);
  return corpo;
}

export const consultarSessao = () => pedir<PainelSessao>("/api/painel");
export async function consultarPainel() {
  const painel = await consultarSessao();
  if (painel.perfil !== "aluno") throw new ErroDaApi("Sessão do aluno encerrada.", 401);
  return painel;
}
export const entrar = (matricula: string, nascimento: string) =>
  pedir<PainelSessao>("/api/sessao", "POST", { matricula, nascimento });
export const sair = () => pedir("/api/sessao", "DELETE");
export const escolherGrupo = (grupoId: number) => pedir<Painel>("/app/meu-grupo", "PUT", { grupoId });
export const enviarRepositorio = (grupoId: number, link: string) =>
  pedir<Painel>("/app/meu-grupo/repositorio", "PUT", { grupoId, link });
export const sortearGrupo = () => pedir<PainelProfessor>("/app/professor/sorteio", "PUT");
export const iniciarAvaliacao = (grupoId: number) =>
  pedir<PainelProfessor>("/app/professor/avaliacao", "PUT", { grupoId });
export const sortearDupla = (grupoId: number) =>
  pedir<PainelProfessor>("/app/professor/dupla", "PUT", { grupoId });
export const atualizarAvaliacao = (grupoId: number, acao: AcaoAvaliacao) =>
  pedir<PainelProfessor>("/app/professor/avaliacao/acoes", "PUT", { grupoId, ...acao });

export async function importarAlunos(arquivo: File) {
  if (arquivo.size > LIMITE_ARQUIVO_ALUNOS) throw new ErroDaApi("O arquivo de alunos deve ter no máximo 1 MiB.", 413);
  const formulario = new FormData();
  formulario.set("arquivo", arquivo);
  return pedir<ImportacaoAlunos>("/app/professor/alunos", "PUT", formulario);
}
