import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { createRoot } from "react-dom/client";
import type { Grupo, Painel, PainelProfessor, PainelSessao } from "../tipos";
import {
  consultarPainel, consultarSessao, entrar, ErroDaApi, escolherGrupo, enviarRepositorio,
  iniciarAvaliacao, sair, sortearDupla, sortearGrupo,
} from "./api";
import { Button, Card, Input } from "./componentes/ui";
import { AmbienteProfessor } from "./professor";

function descreverErro(erro: unknown) {
  return erro instanceof ErroDaApi ? erro.message : "Não foi possível acessar o sistema. Tente novamente.";
}

const numeroGrupo = (id: number) => String(id).padStart(2, "0");

function Cabecalho({ aoSair, ocupado }: { aoSair?: () => void; ocupado?: boolean }) {
  return (
    <header className="barra">
      <div className="marca"><span aria-hidden="true">N2</span> Controle N2</div>
      {aoSair && <Button type="button" variant="outline" disabled={ocupado} onClick={aoSair}>Sair</Button>}
    </header>
  );
}

function Acesso({ aoEntrar }: { aoEntrar: (painel: PainelSessao) => void }) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    setOcupado(true);
    setErro("");
    try {
      aoEntrar(await entrar(String(campos.get("matricula")), String(campos.get("nascimento"))));
    } catch (problema) {
      setErro(descreverErro(problema));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <Cabecalho />
      <main className="acesso">
        <section className="apresentacao">
          <p className="rotulo">Programação Web</p>
          <h1>Escolha o seu grupo da N2</h1>
          <p>Conheça os dez projetos da turma e escolha qual deles você quer desenvolver.</p>
        </section>
        <section className="formulario" aria-labelledby="titulo-acesso">
          <h2 id="titulo-acesso">Acesso ao Controle N2</h2>
          <p>Use sua matrícula e sua data de nascimento.</p>
          <form onSubmit={enviar}>
            <label htmlFor="matricula">Matrícula</label>
            <Input id="matricula" name="matricula" inputMode="numeric" autoComplete="username"
              pattern="[0-9]+" placeholder="Digite sua matrícula" required />
            <label htmlFor="nascimento">Data de nascimento</label>
            <Input id="nascimento" name="nascimento" type="date" autoComplete="bday" required />
            {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
            <Button type="submit" disabled={ocupado}>{ocupado ? "Entrando…" : "Entrar"}</Button>
          </form>
        </section>
      </main>
    </>
  );
}

// Os enunciados só usam código em linha. O React escapa todos os trechos.
function Texto({ valor }: { valor: string }) {
  return valor.split("`").map((trecho, indice) =>
    indice % 2 === 1 ? <code key={indice}>{trecho}</code> : trecho);
}

function Detalhes({ grupo, atual, ocupado, erro, aoFechar, aoConfirmar }: {
  grupo: Grupo;
  atual: boolean;
  ocupado: boolean;
  erro: string;
  aoFechar: () => void;
  aoConfirmar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  return (
    <dialog ref={dialogo} onClose={aoFechar}
      onCancel={(evento) => { if (ocupado) evento.preventDefault(); }}
      aria-labelledby="titulo-projeto">
      <div className="dialogo-conteudo">
        <div className="dialogo-topo">
          <p className="rotulo">Grupo {numeroGrupo(grupo.id)} · {grupo.nome}</p>
          <Button type="button" variant="outline" disabled={ocupado}
            onClick={() => dialogo.current?.close()}>Fechar</Button>
        </div>
        <h2 id="titulo-projeto">{grupo.titulo}</h2>
        <p><Texto valor={grupo.descricao} /></p>
        <dl>
          {grupo.detalhes.map(({ titulo, texto }) => (
            <div key={titulo}><dt>{titulo}</dt><dd><Texto valor={texto} /></dd></div>
          ))}
        </dl>
        <section className="integrantes" aria-labelledby="titulo-integrantes">
          <h3 id="titulo-integrantes">Integrantes do grupo</h3>
          {grupo.integrantes.length === 0 ? (
            <p>{grupo.ocupacao === 0 ? "Ainda não há integrantes." : "Nenhum nome disponível."}</p>
          ) : (
            <ul>{grupo.integrantes.map((nome, indice) => <li key={indice}>{nome}</li>)}</ul>
          )}
        </section>
        {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
        <div className="dialogo-rodape">
          <span>{grupo.ocupacao} de {grupo.limite} vagas ocupadas</span>
          {atual ? <strong>Seu grupo atual</strong> : (
            <Button type="button" disabled={ocupado || grupo.ocupacao >= grupo.limite} onClick={aoConfirmar}>
              {ocupado ? "Salvando…" : grupo.ocupacao >= grupo.limite ? "Grupo cheio" : "Entrar neste grupo"}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  );
}

function PaginaGrupos({ painel, atualizar, encerrar }: {
  painel: Painel;
  atualizar: (painel: Painel) => void;
  encerrar: () => void;
}) {
  const [visualizando, setVisualizando] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [erroPainel, setErroPainel] = useState("");
  const grupoAtual = painel.grupos.find(({ id }) => id === painel.grupoAtual);
  const projeto = painel.grupos.find(({ id }) => id === visualizando);

  async function abrirProjeto(grupoId: number) {
    setOcupado(true);
    setErro("");
    setErroPainel("");
    try {
      atualizar(await consultarPainel());
      setVisualizando(grupoId);
    } catch (problema) {
      if (problema instanceof ErroDaApi && problema.status === 401) {
        encerrar();
      } else {
        setErroPainel(descreverErro(problema));
      }
    } finally {
      setOcupado(false);
    }
  }

  async function confirmar(grupo: Grupo) {
    setOcupado(true);
    setErro("");
    try {
      atualizar(await escolherGrupo(grupo.id));
      setVisualizando(null);
      setAviso("Você entrou no grupo " + grupo.nome + ".");
    } catch (problema) {
      if (problema instanceof ErroDaApi && problema.status === 401) {
        encerrar();
      } else {
        setErro(descreverErro(problema));
        if (problema instanceof ErroDaApi && problema.status === 409) {
          await consultarPainel().then(atualizar).catch(() => {});
        }
      }
    } finally {
      setOcupado(false);
    }
  }

  async function desconectar() {
    setOcupado(true);
    setErroPainel("");
    try {
      await sair();
      encerrar();
    } catch (problema) {
      setErroPainel(descreverErro(problema));
    } finally {
      setOcupado(false);
    }
  }

  async function salvarRepositorio(evento: SubmitEvent<HTMLFormElement>, grupoId: number) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    setOcupado(true);
    setErroPainel("");
    setAviso("");
    try {
      atualizar(await enviarRepositorio(grupoId, String(campos.get("link"))));
      setAviso("Link do repositório salvo.");
    } catch (problema) {
      if (problema instanceof ErroDaApi && problema.status === 401) {
        encerrar();
      } else {
        setErroPainel(descreverErro(problema));
        if (problema instanceof ErroDaApi && problema.status === 409) {
          await consultarPainel().then(atualizar).catch(() => {});
        }
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <Cabecalho ocupado={ocupado} aoSair={() => void desconectar()} />
      <main className="painel">
        <section className="resumo" aria-labelledby="titulo-painel">
          <div className="resumo-identidade">
            <p className="rotulo">
              {grupoAtual ? "Grupo " + numeroGrupo(grupoAtual.id) + ": " + grupoAtual.nome : "Atividade N2"}
            </p>
            <h1 id="titulo-painel">
              {grupoAtual ? grupoAtual.titulo : "Grupos da turma"}
            </h1>
            {!grupoAtual && <p className="resumo-projeto">{painel.nome}</p>}
          </div>
          <div className="meu-grupo">
            <h2 className="rotulo">Meu grupo</h2>
            {grupoAtual ? (
              <ul className="colegas-do-grupo">
                <li><strong>{painel.nome} (Eu)</strong></li>
                {painel.colegasDoGrupo.map((nome, indice) => <li key={indice}>{nome}</li>)}
              </ul>
            ) : (
              <p>Nenhum grupo escolhido</p>
            )}
          </div>
        </section>
        {erroPainel && <p role="alert" className="mensagem-erro">{erroPainel}</p>}
        <p role="status" className={aviso ? "confirmacao" : "somente-leitor"}>{aviso}</p>
        {grupoAtual && (
          <section className="cartao repositorio" aria-labelledby="titulo-repositorio">
            <h2 id="titulo-repositorio">Repositório do meu grupo</h2>
            {painel.repositorioGithub && (
              <p><a href={painel.repositorioGithub} target="_blank" rel="noopener noreferrer">Abrir no GitHub</a></p>
            )}
            <form key={grupoAtual.id + ":" + painel.repositorioGithub}
              onSubmit={(evento) => void salvarRepositorio(evento, grupoAtual.id)}>
              <label htmlFor="link-repositorio">Link do GitHub</label>
              <div className="linha-repositorio">
                <Input id="link-repositorio" name="link" type="url" required maxLength={300}
                  defaultValue={painel.repositorioGithub ?? ""} placeholder="https://github.com/usuario/projeto" />
                <Button type="submit" disabled={ocupado}>Salvar link</Button>
              </div>
            </form>
          </section>
        )}
        <section aria-labelledby="lista-grupos">
          <div className="introducao">
            <h2 id="lista-grupos">Projetos disponíveis</h2>
            <p>Consulte os enunciados antes de escolher. Você pode trocar de grupo enquanto houver vaga no destino.</p>
          </div>
          <div className="grade">
            {painel.grupos.map((grupo) => {
              const atual = painel.grupoAtual === grupo.id;
              return (
                <Card key={grupo.id} className={atual ? "grupo-atual" : ""}>
                  <div className="cartao-topo">
                    <p className="rotulo">Grupo {numeroGrupo(grupo.id)}</p>
                    {atual && <span className="etiqueta">Seu grupo</span>}
                  </div>
                  <h3>{grupo.nome}</h3>
                  <p>{grupo.titulo}</p>
                  {grupo.repositorioGithub && (
                    <p>
                      <a className="link-github" href={grupo.repositorioGithub} target="_blank" rel="noopener noreferrer"
                        aria-label={"Abrir repositório de " + grupo.nome + " no GitHub em nova aba"}>Abrir no GitHub</a>
                    </p>
                  )}
                  <div className="cartao-rodape">
                    <span>{grupo.ocupacao}/{grupo.limite} integrantes</span>
                    <Button type="button" variant="outline" disabled={ocupado}
                      aria-label={"Ver projeto do grupo " + grupo.nome}
                      onClick={() => void abrirProjeto(grupo.id)}>Ver projeto</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      {projeto && <Detalhes grupo={projeto} atual={painel.grupoAtual === projeto.id}
        ocupado={ocupado} erro={erro} aoFechar={() => setVisualizando(null)}
        aoConfirmar={() => void confirmar(projeto)} />}
    </>
  );
}

function PaginaProfessor({ painel, atualizar, encerrar }: {
  painel: PainelProfessor;
  atualizar: (novo: PainelSessao) => void;
  encerrar: () => void;
}) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  async function executar(acao: () => Promise<void>) {
    setOcupado(true);
    setErro("");
    try {
      await acao();
    } catch (problema) {
      if (problema instanceof ErroDaApi && problema.status === 401) encerrar();
      else setErro(descreverErro(problema));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <Cabecalho ocupado={ocupado} aoSair={() => void executar(async () => { await sair(); encerrar(); })} />
      <main className="painel">
        {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
        <AmbienteProfessor painel={painel} ocupado={ocupado}
          atualizar={() => void executar(async () => atualizar(await consultarSessao()))}
          aoSortear={() => void executar(async () => atualizar(await sortearGrupo()))}
          aoIniciar={(grupoId) => void executar(async () => {
            atualizar(await iniciarAvaliacao(grupoId));
            window.location.hash = "professor/avaliacao";
          })}
          aoSortearDupla={(grupoId) => void executar(async () => atualizar(await sortearDupla(grupoId)))} />
      </main>
    </>
  );
}

function App() {
  const [painel, setPainel] = useState<PainelSessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    consultarSessao().then(setPainel).catch(() => {}).finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="carregando" role="status">Carregando Controle N2…</p>;
  if (!painel) return <Acesso aoEntrar={setPainel} />;
  if (painel.perfil === "professor") {
    return <PaginaProfessor painel={painel} atualizar={setPainel} encerrar={() => setPainel(null)} />;
  }
  return <PaginaGrupos painel={painel} atualizar={setPainel} encerrar={() => setPainel(null)} />;
}

createRoot(document.getElementById("raiz")!).render(<App />);
