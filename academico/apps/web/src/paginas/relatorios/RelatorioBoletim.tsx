/*
 * RELATÓRIO: BOLETIM DO ALUNO
 * ---------------------------
 * Escolha um aluno e veja todas as disciplinas que ele cursou,
 * com notas, média e situação.
 */
import { useEffect, useState } from "react";
import type { Aluno, MatriculaDetalhada } from "@academico/tipos";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FotoPerfil } from "@/components/FotoPerfil";
import { SeloStatus } from "@/components/SeloStatus";
import { calcularMedia, formatarNota } from "@/lib/formatar";
import { listarAlunos, listarMatriculas } from "@/servicos/api";

export function RelatorioBoletim() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoEscolhido, setAlunoEscolhido] = useState<Aluno | null>(null);
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([]);

  useEffect(() => {
    listarAlunos().then(setAlunos);
  }, []);

  async function escolherAluno(id: string) {
    // .find procura na lista o primeiro item que satisfaz a condição
    const aluno = alunos.find((a) => a.id === Number(id)) ?? null;
    setAlunoEscolhido(aluno);
    setMatriculas(await listarMatriculas(Number(id)));
  }

  const aprovacoes = matriculas.filter((m) => m.status === "aprovado").length;

  return (
    <Card className="gap-0 p-0">
      <div className="flex flex-wrap items-center gap-6 border-b p-4">
        <Select onValueChange={escolherAluno}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Escolha um aluno..." />
          </SelectTrigger>
          <SelectContent>
            {alunos.map((aluno) => (
              <SelectItem key={aluno.id} value={String(aluno.id)}>
                {aluno.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {alunoEscolhido && (
          <div className="flex items-center gap-3">
            <FotoPerfil nome={alunoEscolhido.nome} foto={alunoEscolhido.foto} />
            <div className="text-sm">
              <p className="font-medium">{alunoEscolhido.nome}</p>
              <p className="text-muted-foreground">
                Matrícula {alunoEscolhido.matricula} · {aprovacoes} de {matriculas.length} disciplinas aprovadas
              </p>
            </div>
          </div>
        )}
      </div>

      {!alunoEscolhido ? (
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Selecione um aluno para ver o boletim.
        </CardContent>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Semestre</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead className="text-right">N1</TableHead>
              <TableHead className="text-right">N2</TableHead>
              <TableHead className="text-right">Média</TableHead>
              <TableHead className="text-right">PF</TableHead>
              <TableHead className="pr-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matriculas.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-4 text-muted-foreground">{m.semestre}</TableCell>
                <TableCell className="font-medium">{m.disciplina_nome}</TableCell>
                <TableCell className="text-muted-foreground">{m.professor_nome}</TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.n1)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.n2)}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatarNota(calcularMedia(m.n1, m.n2))}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.pf)}</TableCell>
                <TableCell className="pr-4">
                  <SeloStatus status={m.status} />
                </TableCell>
              </TableRow>
            ))}

            {matriculas.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Este aluno ainda não tem matrículas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
