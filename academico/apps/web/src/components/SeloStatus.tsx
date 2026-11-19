/*
 * SELO DE STATUS
 * Uma etiqueta colorida para a situação da matrícula:
 *   verde = aprovado | vermelho = reprovado | âmbar = cursando
 */
import type { StatusMatricula } from "@academico/tipos";
import { Badge } from "@/components/ui/badge";

// Para cada status, guardamos o texto e as cores (classes do Tailwind).
const APARENCIA = {
  aprovado: { texto: "Aprovado", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reprovado: { texto: "Reprovado", classes: "bg-red-50 text-red-700 border-red-200" },
  cursando: { texto: "Cursando", classes: "bg-amber-50 text-amber-700 border-amber-200" },
};

export function SeloStatus({ status }: { status: StatusMatricula }) {
  const aparencia = APARENCIA[status];
  return (
    <Badge variant="outline" className={aparencia.classes}>
      {aparencia.texto}
    </Badge>
  );
}
