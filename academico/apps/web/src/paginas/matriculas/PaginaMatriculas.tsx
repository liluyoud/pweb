/*
 * PÁGINA DE MATRÍCULAS
 * --------------------
 * Lista as matrículas (aluno + disciplina + professor + semestre)
 * com as notas e o status. Também permite filtrar por semestre.
 */
import { useEffect, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { MatriculaDetalhada } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { SeloStatus } from "@/components/SeloStatus";
import { calcularMedia, formatarNota } from "@/lib/formatar";
import { excluirMatricula, listarMatriculas } from "@/servicos/api";
import { FormularioMatricula } from "./FormularioMatricula";

const TODOS = "todos";

export function PaginaMatriculas() {
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([]);
  const [busca, setBusca] = useState("");
  const [semestre, setSemestre] = useState(TODOS);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [matriculaEmEdicao, setMatriculaEmEdicao] = useState<MatriculaDetalhada | null>(null);

  async function carregarMatriculas() {
    const lista = await listarMatriculas();
    setMatriculas(lista);
  }

  useEffect(() => {
    carregarMatriculas();
  }, []);

  function abrirNova() {
    setMatriculaEmEdicao(null);
    setFormularioAberto(true);
  }

  function abrirEdicao(matricula: MatriculaDetalhada) {
    setMatriculaEmEdicao(matricula);
    setFormularioAberto(true);
  }

  async function excluir(matricula: MatriculaDetalhada) {
    try {
      await excluirMatricula(matricula.id);
      toast.success("Matrícula excluída.");
      carregarMatriculas();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  // Lista de semestres SEM repetição, para o filtro.
  // "new Set(...)" remove os itens repetidos de uma lista.
  const semestresExistentes = [...new Set(matriculas.map((m) => m.semestre))];

  const termo = busca.toLowerCase();
  const matriculasFiltradas = matriculas.filter((m) => {
    const passaNaBusca =
      m.aluno_nome.toLowerCase().includes(termo) || m.disciplina_nome.toLowerCase().includes(termo);
    const passaNoSemestre = semestre === TODOS || m.semestre === semestre;
    return passaNaBusca && passaNoSemestre;
  });

  return (
    <>
      <CabecalhoPagina titulo="Matrículas" descricao="Alunos matriculados em disciplinas, com notas e situação.">
        <Button onClick={abrirNova}>
          <Plus /> Nova matrícula
        </Button>
      </CabecalhoPagina>

      <Card className="gap-0 p-0">
        <div className="flex flex-wrap gap-3 border-b p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por aluno ou disciplina..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <Select value={semestre} onValueChange={setSemestre}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os semestres</SelectItem>
              {semestresExistentes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Aluno</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead className="text-right">N1</TableHead>
              <TableHead className="text-right">N2</TableHead>
              <TableHead className="text-right">Média</TableHead>
              <TableHead className="text-right">PF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {matriculasFiltradas.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-4 font-medium">{m.aluno_nome}</TableCell>
                <TableCell>
                  <p>{m.disciplina_nome}</p>
                  <p className="text-xs text-muted-foreground">{m.professor_nome}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{m.semestre}</TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.n1)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.n2)}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatarNota(calcularMedia(m.n1, m.n2))}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatarNota(m.pf)}</TableCell>
                <TableCell>
                  <SeloStatus status={m.status} />
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => abrirEdicao(m)}>
                    <Pencil className="text-muted-foreground" />
                  </Button>
                  <BotaoExcluir
                    descricao={`a matrícula de ${m.aluno_nome} em ${m.disciplina_nome}`}
                    aoConfirmar={() => excluir(m)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {matriculasFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  Nenhuma matrícula encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {formularioAberto && (
        <FormularioMatricula
          matricula={matriculaEmEdicao}
          aoFechar={() => setFormularioAberto(false)}
          aoSalvar={carregarMatriculas}
        />
      )}
    </>
  );
}
