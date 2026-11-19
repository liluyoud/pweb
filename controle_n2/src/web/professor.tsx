import { useEffect, useState } from "react";
import type { EventoAuditoria, PainelProfessor } from "../tipos";
import { PaginaAvaliacao } from "./avaliacao";
import { Button, Card } from "./componentes/ui";

const nomesDasAcoes: Record<EventoAuditoria["acao"], string> = {
  entrada_grupo: "Entrada no grupo",
  troca_grupo: "Troca de grupo",
  envio_repositorio: "Envio do link",
  alteracao_repositorio: "Alteração do link",
};
const formatoData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" });
const numeroGrupo = (id: number) => String(id).padStart(2, "0");
const paginas = [
  { id: "grupos", nome: "Grupos e repositórios" },
  { id: "auditoria", nome: "Auditoria" },
  { id: "alunos-sem-grupo", nome: "Alunos sem grupo" },
] as const;

function paginaAtual() {
  if (window.location.hash === "#professor/avaliacao") return "avaliacao";
  return paginas.find(({ id }) => window.location.hash === "#professor/" + id)?.id ?? "grupos";
}

export function AmbienteProfessor({ painel, ocupado, atualizar, aoSortear, aoIniciar, aoSortearDupla }: {
  painel: PainelProfessor;
  ocupado: boolean;
  atualizar: () => void;
  aoSortear: () => void;
  aoIniciar: (grupoId: number) => void;
  aoSortearDupla: (grupoId: number) => void;
}) {
  const [pagina, setPagina] = useState(paginaAtual);
  useEffect(() => {
    const sincronizarPagina = () => setPagina(paginaAtual());
    window.addEventListener("hashchange", sincronizarPagina);
    return () => window.removeEventListener("hashchange", sincronizarPagina);
  }, []);

  const totalSemGrupo = painel.alunosSemGrupo.length;
  const avaliacao = painel.avaliacaoAtual;
  const escolhido = painel.grupos.find(({ id }) => id === avaliacao?.grupoId);
  if (pagina === "avaliacao" && escolhido && painel.avaliacaoAlunos) {
    return <PaginaAvaliacao grupo={escolhido} avaliacao={painel.avaliacaoAlunos}
      ocupado={ocupado} aoSortear={() => aoSortearDupla(escolhido.id)} />;
  }
  const paginaVisivel = pagina === "avaliacao" ? "grupos" : pagina;
  const podeSortear = (!avaliacao || (avaliacao.estado === "sorteado" && !escolhido?.integrantes.length))
    && painel.grupos.some(({ integrantes }) => integrantes.length > 0);
  const legendaGrupo = (id: number) =>
    numeroGrupo(id) + " · " + (painel.grupos.find((grupo) => grupo.id === id)?.nome ?? "Grupo");

  return (
    <>
      <section className="resumo resumo-professor" aria-labelledby="titulo-professor">
        <div className="resumo-identidade">
          <p className="rotulo">Controle N2</p>
          <h1 id="titulo-professor">Ambiente do professor</h1>
        </div>
        <nav className="menu-professor" aria-label="Páginas do professor">
          {paginas.map(({ id, nome }) => (
            <a key={id} href={"#professor/" + id} aria-current={paginaVisivel === id ? "page" : undefined}>
              {nome}
            </a>
          ))}
        </nav>
        <Button type="button" variant="outline" className="atualizar-professor" disabled={ocupado}
          aria-label="Atualizar painel" title="Atualizar painel" onClick={atualizar}>
          <span aria-hidden="true">↻</span>
        </Button>
      </section>
      <section id="pagina-grupos-professor" aria-labelledby="grupos-professor" hidden={paginaVisivel !== "grupos"}>
        <div className="introducao titulo-com-acao">
          <h2 id="grupos-professor">Grupos e repositórios</h2>
          <Button type="button" disabled={ocupado || !podeSortear} onClick={aoSortear}>Escolher grupo</Button>
        </div>
        <p className={escolhido ? "confirmacao sorteio-status" : "somente-leitor"} role="status">
          {escolhido && (avaliacao?.estado === "em_avaliacao"
            ? "Avaliação iniciada para " + escolhido.nome + "." : "Grupo sorteado: " + escolhido.nome + ".")}
        </p>
        <div className="grade">
          {painel.grupos.map((grupo) => (
            <Card key={grupo.id} className={escolhido?.id === grupo.id ? "grupo-sorteado" : undefined}>
              <div className="cartao-topo">
                <span className="rotulo">Grupo {numeroGrupo(grupo.id)}</span>
                <span>{grupo.ocupacao}/{grupo.limite}</span>
              </div>
              <h3>{grupo.nome}</h3>
              <p>{grupo.titulo}</p>
              {grupo.integrantes.length ? (
                <ul className="integrantes-professor">
                  {grupo.integrantes.map((nome, indice) => <li key={indice}>{nome}</li>)}
                </ul>
              ) : <p>Ainda não há integrantes.</p>}
              <div className="cartao-rodape">
                {grupo.repositorioGithub
                  ? <a className="link-github" href={grupo.repositorioGithub} target="_blank" rel="noopener noreferrer">Abrir no GitHub</a>
                  : <span>Link ainda não enviado</span>}
              </div>
              {avaliacao?.grupoId === grupo.id && (
                <div className="acoes-avaliacao">
                  {avaliacao.estado === "em_avaliacao" ? (
                    <>
                      <strong>Avaliação em andamento</strong>
                      <a href="#professor/avaliacao">Abrir avaliação</a>
                    </>
                  ) : (
                    <>
                      <strong>Grupo sorteado</strong>
                      <Button type="button" disabled={ocupado || grupo.integrantes.length === 0}
                        onClick={() => aoIniciar(grupo.id)}>
                        Iniciar avaliação
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
      <section id="pagina-alunos-sem-grupo" aria-labelledby="titulo-alunos-sem-grupo" hidden={pagina !== "alunos-sem-grupo"}>
        <div className="introducao">
          <h2 id="titulo-alunos-sem-grupo">Alunos sem grupo</h2>
          <p>{totalSemGrupo === 0 ? "Todos os alunos já têm grupo." :
            totalSemGrupo === 1 ? "1 aluno sem grupo." : totalSemGrupo + " alunos sem grupo."}</p>
        </div>
        {totalSemGrupo > 0 && (
          <div className="tabela-professor">
            <table aria-labelledby="titulo-alunos-sem-grupo">
              <thead>
                <tr><th scope="col">Nome</th><th scope="col">Matrícula</th></tr>
              </thead>
              <tbody>
                {painel.alunosSemGrupo.map(({ matricula, nome }) => (
                  <tr key={matricula}><td>{nome}</td><td>{matricula}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section id="pagina-auditoria-professor" aria-labelledby="auditoria-professor" hidden={pagina !== "auditoria"}>
        <div className="introducao">
          <h2 id="auditoria-professor">Auditoria</h2>
          <p>Alterações mais recentes primeiro. Horários exibidos no fuso do navegador.</p>
        </div>
        {painel.auditoria.length ? (
          <div className="tabela-professor tabela-auditoria" tabIndex={0} role="region" aria-labelledby="auditoria-professor">
            <table>
              <thead>
                <tr><th scope="col">Data e hora</th><th scope="col">Aluno</th><th scope="col">Ação</th><th scope="col">Grupo</th><th scope="col">Link do GitHub</th></tr>
              </thead>
              <tbody>
                {painel.auditoria.map((evento) => (
                  <tr key={evento.id}>
                    <td><time dateTime={evento.data_utc}>{formatoData.format(new Date(evento.data_utc))}</time></td>
                    <td>{evento.nome && <strong>{evento.nome}</strong>}<div>{evento.matricula}</div></td>
                    <td>{nomesDasAcoes[evento.acao]}</td>
                    <td>
                      {evento.grupo_anterior_id !== null && <div>Anterior: {legendaGrupo(evento.grupo_anterior_id)}</div>}
                      {legendaGrupo(evento.grupo_id)}
                    </td>
                    <td>
                      {evento.link_anterior && <div>Anterior: {evento.link_anterior}</div>}
                      {evento.link_novo ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>Ainda não há alterações registradas.</p>}
      </section>
    </>
  );
}
