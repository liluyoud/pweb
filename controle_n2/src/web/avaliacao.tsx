import type { AvaliacaoAlunos, Grupo } from "../tipos";
import { Button } from "./componentes/ui";

export function PaginaAvaliacao({ grupo, avaliacao, ocupado, aoSortear }: {
  grupo: Grupo;
  avaliacao: AvaliacaoAlunos;
  ocupado: boolean;
  aoSortear: () => void;
}) {
  const { integrantes } = avaliacao;

  return (
    <>
      <div className="introducao">
        <a href="#professor/grupos">Voltar para Grupos e repositórios</a>
        <h1>Avaliação do grupo</h1>
        <p>Grupo {String(grupo.id).padStart(2, "0")} · {grupo.nome} · {grupo.titulo}</p>
      </div>
      <div className="avaliacao-layout">
        <aside className="cartao avaliacao-lateral" aria-labelledby="titulo-integrantes">
          <h2 id="titulo-integrantes">Integrantes do grupo</h2>
          <Button type="button" onClick={aoSortear}
            disabled={ocupado || integrantes.length === 0 || avaliacao.dupla !== null}>
            Escolher dupla
          </Button>
          <div className="avaliacao-alunos" role="region" aria-label="Lista de alunos" tabIndex={0}>
            {integrantes.length ? (
              <ul className="avaliacao-lista">
                {integrantes.map(({ matricula, nome }) => (
                  <li key={matricula}>
                    <span>{nome}</span>
                    <small>{matricula}</small>
                  </li>
                ))}
              </ul>
            ) : <p>Não há integrantes para sortear.</p>}
          </div>
        </aside>
        <section className="cartao avaliacao-dupla" aria-labelledby="titulo-dupla">
          <h2 id="titulo-dupla">Dupla sorteada</h2>
          <div role="status">
            {avaliacao.dupla ? (
              <dl>
                <div><dt>Principal</dt><dd>{avaliacao.dupla.principal.nome}</dd></div>
                <div>
                  <dt>Assistente</dt>
                  <dd>{avaliacao.dupla.assistente?.nome ?? "O principal responde sozinho."}</dd>
                </div>
              </dl>
            ) : <p>Nenhuma dupla sorteada.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
