import type { AcaoAvaliacao, AvaliacaoAlunos, Grupo, RodadaAvaliacao } from "../tipos";
import { Button } from "./componentes/ui";

function DadosDaRodada({ rodada }: { rodada: RodadaAvaliacao }) {
  return (
    <dl>
      <div><dt>Principal</dt><dd>{rodada.principal.nome}</dd></div>
      <div><dt>Assistente</dt><dd>{rodada.assistente?.nome ?? "O principal responde sozinho."}</dd></div>
      {rodada.voluntario && <div><dt>Integrante chamado</dt><dd>{rodada.voluntario.nome}</dd></div>}
    </dl>
  );
}

export function PaginaAvaliacao({ grupo, avaliacao, ocupado, aoSortear, aoAtualizar, finalizada = false }: {
  grupo: Grupo;
  avaliacao: AvaliacaoAlunos;
  ocupado: boolean;
  aoSortear: () => void;
  aoAtualizar: (acao: AcaoAvaliacao) => void;
  finalizada?: boolean;
}) {
  const { integrantes, dupla, rodadasFinalizadas } = avaliacao;
  const avaliados = new Set(rodadasFinalizadas.flatMap(
    ({ principal, assistente, voluntario }) => [principal.matricula, assistente?.matricula, voluntario?.matricula],
  ));
  const participantes = new Set([...rodadasFinalizadas, ...(dupla ? [dupla] : [])].flatMap(
    ({ principal, assistente, voluntario }) => [principal.matricula, assistente?.matricula, voluntario?.matricula],
  ));
  const disponiveis = integrantes.filter(({ matricula }) => !participantes.has(matricula));

  function confirmar(mensagem: string, acao: AcaoAvaliacao) {
    if (!finalizada && !ocupado && window.confirm(mensagem)) aoAtualizar(acao);
  }

  return (
    <>
      <div className="introducao">
        <a href="#professor/grupos">Voltar para Grupos e repositórios</a>
        <h1>Avaliação do grupo</h1>
        <p>Grupo {String(grupo.id).padStart(2, "0")} · {grupo.nome} · {grupo.titulo}</p>
        {finalizada && <p className="confirmacao" role="status"><span aria-hidden="true">✓</span> Avaliação finalizada</p>}
      </div>
      <div className="avaliacao-layout">
        <aside className="cartao avaliacao-lateral" aria-labelledby="titulo-integrantes">
          <h2 id="titulo-integrantes">Integrantes do grupo</h2>
          {!finalizada && <Button type="button" onClick={aoSortear}
            disabled={ocupado || disponiveis.length === 0 || dupla !== null}>
            Escolher dupla
          </Button>}
          <div className="avaliacao-alunos" role="region" aria-label="Lista de alunos" tabIndex={0}>
            {integrantes.length ? (
              <ul className="avaliacao-lista">
                {integrantes.map(({ matricula, nome }) => {
                  const avaliado = avaliados.has(matricula);
                  return (
                    <li key={matricula} className={avaliado ? "avaliacao-concluida" : undefined}
                      aria-disabled={avaliado || undefined}>
                      <span className="avaliacao-integrante-nome">
                        <span>{nome}</span>
                        {avaliado && (
                          <>
                            <span className="avaliacao-check" aria-hidden="true">✓</span>
                            <span className="somente-leitor">Avaliação concluída</span>
                          </>
                        )}
                      </span>
                      <small>{matricula}</small>
                    </li>
                  );
                })}
              </ul>
            ) : <p>Não há integrantes para sortear.</p>}
          </div>
        </aside>
        <section className="cartao avaliacao-dupla" aria-labelledby="titulo-dupla">
          <h2 id="titulo-dupla">{finalizada ? "Registro da avaliação" : "Dupla sorteada"}</h2>
          <div role="status">
            {finalizada ? <p>Consulte as duplas avaliadas e os integrantes que participaram.</p> : dupla ? (
              <DadosDaRodada rodada={dupla} />
            ) : <p>{rodadasFinalizadas.length > 0
              ? disponiveis.length > 0
                ? "Avaliação da dupla finalizada. Escolha outra dupla ou finalize a avaliação do grupo."
                : "Todos os integrantes já participaram. Finalize a avaliação do grupo."
              : "Nenhuma dupla sorteada."}</p>}
          </div>
          {!finalizada && (dupla || rodadasFinalizadas.length > 0) && (
            <div className="acoes-avaliacao" role="group" aria-label="Opções da avaliação">
              {dupla && (
                <>
                  <Button type="button" disabled={ocupado}
                    onClick={() => confirmar("Finalizar a avaliação desta dupla?", {
                      tipo: "finalizar-dupla", rodadaId: dupla.id,
                    })}>
                    Finalizar avaliação da dupla
                  </Button>
                  <Button type="button" variant="outline"
                    disabled={ocupado || dupla.aberta || disponiveis.length === 0}
                    onClick={() => confirmar("Chamar outro integrante para responder à pergunta desta dupla?", {
                      tipo: "abrir-pergunta", rodadaId: dupla.id,
                    })}>
                    Chamar outro integrante
                  </Button>
                </>
              )}
              <Button type="button" variant="outline" disabled={ocupado}
                onClick={() => confirmar("Finalizar a avaliação de todo o grupo?", {
                  tipo: "finalizar-avaliacao", rodadaId: dupla?.id ?? null,
                })}>
                Finalizar avaliação do grupo
              </Button>
            </div>
          )}
          {!finalizada && dupla && !dupla.voluntario && disponiveis.length === 0 && (
            <p>Não há outro integrante disponível para chamar.</p>
          )}
          {!finalizada && dupla?.aberta && !dupla.voluntario && disponiveis.length > 0 && (
            <section aria-labelledby="titulo-chamar-integrante">
              <h3 id="titulo-chamar-integrante">Escolha o integrante para responder</h3>
              <ul className="avaliacao-lista">
                {disponiveis.map(({ matricula, nome }) => (
                  <li key={matricula}>
                    <Button type="button" variant="outline" disabled={ocupado}
                      onClick={() => confirmar("Confirmar a chamada de " + nome + "?", {
                        tipo: "escolher-voluntario", rodadaId: dupla.id, matricula,
                      })}>
                      {nome}
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {rodadasFinalizadas.length > 0 && (
            <section className="avaliacao-historico" aria-labelledby="titulo-historico">
              <h3 id="titulo-historico">Duplas avaliadas</h3>
              {rodadasFinalizadas.map((rodada, indice) => (
                <article key={rodada.id} className="avaliacao-rodada">
                  <h4>Dupla {indice + 1}</h4>
                  <DadosDaRodada rodada={rodada} />
                </article>
              ))}
            </section>
          )}
        </section>
      </div>
    </>
  );
}
