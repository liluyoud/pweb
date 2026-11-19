/*
 * RELATÓRIO: TURMAS POR PROFESSOR
 * -------------------------------
 * Quais disciplinas cada professor deu, em qual semestre,
 * quantos alunos e a média da turma.
 */
import { useEffect, useState } from "react";
import type { LinhaTurmaProfessor } from "@academico/tipos";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarNota } from "@/lib/formatar";
import { relatorioProfessores } from "@/servicos/api";

export function RelatorioProfessores() {
  const [linhas, setLinhas] = useState<LinhaTurmaProfessor[]>([]);

  useEffect(() => {
    relatorioProfessores().then(setLinhas);
  }, []);

  return (
    <Card className="gap-0 p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Professor</TableHead>
            <TableHead>Disciplina</TableHead>
            <TableHead>Semestre</TableHead>
            <TableHead className="text-right">Alunos</TableHead>
            <TableHead className="pr-4 text-right">Média da turma</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((linha) => (
            <TableRow key={linha.professor + linha.disciplina + linha.semestre}>
              <TableCell className="pl-4">
                <span className="font-medium">{linha.professor}</span>
                <Badge variant="secondary" className="ml-2">
                  {linha.titulacao}
                </Badge>
              </TableCell>
              <TableCell>{linha.disciplina}</TableCell>
              <TableCell className="text-muted-foreground">{linha.semestre}</TableCell>
              <TableCell className="text-right tabular-nums">{linha.total_alunos}</TableCell>
              <TableCell className="pr-4 text-right font-medium tabular-nums">{formatarNota(linha.media)}</TableCell>
            </TableRow>
          ))}

          {linhas.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                Nenhuma matrícula cadastrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
