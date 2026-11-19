import { useEffect, useState } from "react";
import type { AcaoAvaliacao, EventoAuditoria, Grupo, PainelProfessor, ResultadoImportacaoAlunos } from "../tipos";
import { PaginaAvaliacao } from "./avaliacao";
import { Button, Card } from "./componentes/ui";
import { FormularioImportacaoAlunos } from "./importar-alunos";

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
  { id: "importar-alunos", nome: "Importar alunos" },
] as const;

function paginaAtual(rota: string) {
  if (/^#professor\/avaliacao(?:\/\d+)?$/.test(rota)) return "avaliacao";
  return paginas.find(({ id }) => rota === "#professor/" + id)?.id ?? "grupos";
}

export function AmbienteProfessor({ painel, ocupado, atualizar, aoSortear, aoIniciar, aoSortearDupla, aoAtualizarAvaliacao, aoImportarAlunos, resultadoImportacao }: {
  painel: PainelProfessor;
  ocupado: boolean;
  atualizar: () => void;
  aoSortear: () => void;
  aoIniciar: (grupoId: number) => void;
  aoSortearDupla: (grupoId: number) => void;
  aoAtualizarAvaliacao: (grupoId: number, acao: AcaoAvaliacao) => void;
  aoImportarAlunos: (arquivo: File) => void;
  resultadoImportacao?: ResultadoImportacaoAlunos | null;
}) {
  const [rota, setRota] = useState(() => window.location.hash);
  useEffect(() => {
    const sincronizarPagina = () => setRota(window.location.hash);
    window.addEventListener("hashchange", sincronizarPagina);
    return () => window.removeEventListener("hashchange", sincronizarPagina);
  }, []);

  const pagina = paginaAtual(rota);
  const totalSemGrupo = painel.alunosSemGrupo.length;
  const avaliacao = painel.avaliacaoAtual;
  const concluidas = new Map(painel.avaliacoesConcluidas.map((item) => [item.grupoId, item]));
  const escolhido = painel.grupos.find(({ id }) => id === avaliacao?.grupoId);
  const idNaRota = /^#professor\/avaliacao\/(\d+)$/.exec(rota)?.[1];
  const grupoId = idNaRota ? Number(idNaRota) : avaliacao?.grupoId;
  const grupoDaAvaliacao = painel.grupos.find(({ id }) => id === grupoId);
  const concluida = grupoId === undefined ? undefined : concluidas.get(grupoId);
  const dadosAvaliacao = concluida ?? (avaliacao?.grupoId === grupoId ? painel.avaliacaoAlunos : null);
  if (pagina === "avaliacao" && grupoDaAvaliacao && dadosAvaliacao) {
    return <PaginaAvaliacao grupo={grupoDaAvaliacao} avaliacao={dadosAvaliacao} finalizada={!!concluida}
      ocupado={ocupado} aoSortear={() => aoSortearDupla(grupoDaAvaliacao.id)}
      aoAtualizar={(acao) => aoAtualizarAvaliacao(grupoDaAvaliacao.id, acao)} />;
  }
  const paginaVisivel = pagina === "avaliacao" ? "grupos" : pagina;
  const elegivel = (grupo?: Grupo) => !!grupo && grupo.integrantes.length > 0 && !!grupo.repositorioGithub;
  const podeSortear = (!avaliacao || (avaliacao.estado === "sorteado" && !elegivel(escolhido)))
    && painel.grupos.some((grupo) => elegivel(grupo) && !concluidas.has(grupo.id));
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
            <Card key={grupo.id} className={concluidas.has(grupo.id) ? "grupo-finalizado"
              : escolhido?.id === grupo.id ? "grupo-sorteado" : undefined}>
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
              {concluidas.has(grupo.id) && (
                <div className="acoes-avaliacao">
                  <strong className="grupo-finalizado-status"><span aria-hidden="true">✓</span> Grupo finalizado</strong>
                  <a href={"#professor/avaliacao/" + grupo.id}>Visualizar avaliação</a>
                </div>
              )}
              {avaliacao?.grupoId === grupo.id && (
                <div className="acoes-avaliacao">
                  {avaliacao.estado === "em_avaliacao" ? (
                    <>
                      <strong>Avaliação em andamento</strong>
                      <a href={"#professor/avaliacao/" + grupo.id}>Abrir avaliação</a>
                    </>
                  ) : (
                    <>
                      <strong>Grupo sorteado</strong>
                      <Button type="button" disabled={ocupado || grupo.integrantes.length === 0 || !grupo.repositorioGithub}
                        aria-describedby={!grupo.repositorioGithub ? "repositorio-pendente-" + grupo.id : undefined}
                        onClick={() => aoIniciar(grupo.id)}>
                        Iniciar avaliação
                      </Button>
                      {!grupo.repositorioGithub && (
                        <p id={"repositorio-pendente-" + grupo.id}>Aguardando o envio do link do GitHub para iniciar a avaliação.</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
      <section aria-labelledby="titulo-importar-alunos" hidden={pagina !== "importar-alunos"}>
        <FormularioImportacaoAlunos ocupado={ocupado} resultado={resultadoImportacao} aoImportar={aoImportarAlunos} />
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
