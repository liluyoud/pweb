/*
 * GRÁFICO DE BARRAS (bem simples, sem biblioteca)
 * -----------------------------------------------
 * Cada item vira uma linha: rótulo à esquerda, valor à direita
 * e uma barra cujo comprimento é proporcional ao valor.
 *
 * O "truque" é só CSS: a largura da barra é uma porcentagem.
 *   valor 8 com máximo 10  ->  width: 80%
 */
import type { ItemGrafico } from "@academico/tipos";

type Props = {
  itens: ItemGrafico[];
  maximo: number; // valor que representa a barra "cheia"
  formatarValor?: (valor: number) => string;
};

export function GraficoBarras({ itens, maximo, formatarValor = String }: Props) {
  if (itens.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Sem dados ainda.</p>;
  }

  return (
    <ul className="grid gap-4">
      {itens.map((item) => {
        const porcentagem = maximo > 0 ? (item.valor / maximo) * 100 : 0;
        return (
          <li key={item.rotulo}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
              <span className="truncate">{item.rotulo}</span>
              <span className="font-medium tabular-nums">{formatarValor(item.valor)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-foreground/80" style={{ width: porcentagem + "%" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
