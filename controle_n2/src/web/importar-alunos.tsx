import type { SubmitEvent } from "react";
import type { ResultadoImportacaoAlunos } from "../tipos";
import { Button, Input } from "./componentes/ui";

export function FormularioImportacaoAlunos({ ocupado, resultado, aoImportar }: {
  ocupado: boolean;
  resultado?: ResultadoImportacaoAlunos | null;
  aoImportar: (arquivo: File) => void;
}) {
  function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado) return;
    const arquivo = new FormData(evento.currentTarget).get("arquivo");
    if (arquivo instanceof File) aoImportar(arquivo);
  }

  return (
    <>
      <div className="introducao">
        <h2 id="titulo-importar-alunos">Importar alunos</h2>
        <p>Envie alunos.md com a tabela de matrículas, nomes e datas de nascimento.</p>
      </div>
      <div className="cartao importacao-alunos">
        <p>Novas matrículas serão cadastradas. As existentes terão nome e nascimento atualizados.
          Alunos que não estiverem no arquivo permanecem cadastrados, com seus grupos e avaliações.</p>
        <form onSubmit={enviar} aria-labelledby="titulo-importar-alunos">
          <label htmlFor="arquivo-alunos">Arquivo de alunos (.md)</label>
          <Input id="arquivo-alunos" name="arquivo" type="file" accept=".md,text/markdown,text/plain"
            required disabled={ocupado} aria-describedby="ajuda-arquivo-alunos" />
          <p id="ajuda-arquivo-alunos">Use UTF-8, nascimento em DD/MM/AAAA e arquivo de até 1 MiB.</p>
          <Button type="submit" disabled={ocupado}>{ocupado ? "Importando…" : "Importar alunos"}</Button>
        </form>
        <details>
          <summary>Ver modelo da tabela</summary>
          <pre><code>{"| Matrícula | Nome | Data de Nascimento |\n| --- | --- | --- |\n| 2610001 | ALANA BEATRIZ COSTA NOGUEIRA | 14/03/2006 |"}</code></pre>
        </details>
        {resultado && (
          <p role="status" className="confirmacao">
            Importação concluída: {resultado.adicionados} adicionado(s), {resultado.atualizados} atualizado(s)
            {" e "}{resultado.inalterados} sem alteração. Total de alunos cadastrados: {resultado.totalCadastrados}.
          </p>
        )}
      </div>
    </>
  );
}
