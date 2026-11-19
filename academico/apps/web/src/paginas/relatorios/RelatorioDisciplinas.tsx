/*
 * RELATÓRIO: DESEMPENHO POR DISCIPLINA
 * ------------------------------------
 * Para cada disciplina e semestre: quantos alunos, aprovados,
 * reprovados, cursando e a média da turma.
 * Todo o cálculo é feito no SQL (veja api/src/rotas/relatorios.ts).
 */
import { useEffect, useState } from "react";
import type { LinhaDesempenhoDisciplina } from "@academico/tipos";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarNota } from "@/lib/formatar";
import { relatorioDisciplinas } from "@/servicos/api";

export function RelatorioDisciplinas() {
  const [linhas, setLinhas] = useState<LinhaDesempenhoDisciplina[]>([]);

  useEffect(() => {
    relatorioDisciplinas().then(setLinhas);
  }, []);

  return (
    <Card className="gap-0 p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Disciplina</TableHead>
            <TableHead>Semestre</TableHead>
            <TableHead className="text-right">Alunos</TableHead>
            <TableHead className="text-right">Aprovados</TableHead>
            <TableHead className="text-right">Reprovados</TableHead>
            <TableHead className="text-right">Cursando</TableHead>
            <TableHead className="pr-4 text-right">Média da turma</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((linha) => (
            <TableRow key={linha.disciplina + linha.semestre}>
              <TableCell className="pl-4">
                <p className="font-medium">{linha.disciplina}</p>
                <p className="text-xs text-muted-foreground">{linha.curso}</p>
              </TableCell>
              <TableCell className="text-muted-foreground">{linha.semestre}</TableCell>
              <TableCell className="text-right tabular-nums">{linha.total}</TableCell>
              <TableCell className="text-right text-emerald-700 tabular-nums">{linha.aprovados}</TableCell>
              <TableCell className="text-right text-red-700 tabular-nums">{linha.reprovados}</TableCell>
              <TableCell className="text-right text-amber-700 tabular-nums">{linha.cursando}</TableCell>
              <TableCell className="pr-4 text-right font-medium tabular-nums">{formatarNota(linha.media)}</TableCell>
            </TableRow>
          ))}

          {linhas.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                Nenhuma matrícula cadastrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
