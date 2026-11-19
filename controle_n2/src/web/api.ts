import type { Painel, PainelProfessor, PainelSessao } from "../tipos";

export class ErroDaApi extends Error {
  constructor(mensagem: string, public status: number) {
    super(mensagem);
  }
}

async function pedir<T>(caminho: string, metodo = "GET", dados?: object): Promise<T> {
  const resposta = await fetch(caminho, {
    method: metodo,
    headers: dados ? { "Content-Type": "application/json" } : undefined,
    body: dados ? JSON.stringify(dados) : undefined,
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
