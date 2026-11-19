/*
 * PÁGINA DE DISCIPLINAS
 * ---------------------
 * Funciona igual à página de alunos (leia PaginaAlunos.tsx primeiro).
 */
import { useEffect, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Disciplina } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { excluirDisciplina, listarDisciplinas } from "@/servicos/api";
import { FormularioDisciplina } from "./FormularioDisciplina";

export function PaginaDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [busca, setBusca] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [disciplinaEmEdicao, setDisciplinaEmEdicao] = useState<Disciplina | null>(null);

  async function carregarDisciplinas() {
    const lista = await listarDisciplinas();
    setDisciplinas(lista);
  }

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  function abrirNovo() {
    setDisciplinaEmEdicao(null);
    setFormularioAberto(true);
  }

  function abrirEdicao(disciplina: Disciplina) {
    setDisciplinaEmEdicao(disciplina);
    setFormularioAberto(true);
  }

  async function excluir(disciplina: Disciplina) {
    try {
      await excluirDisciplina(disciplina.id);
      toast.success("Disciplina excluída.");
      carregarDisciplinas();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  const termo = busca.toLowerCase();
  const disciplinasFiltradas = disciplinas.filter(
    (disciplina) =>
      disciplina.nome.toLowerCase().includes(termo) || disciplina.curso.toLowerCase().includes(termo)
  );

  return (
    <>
      <CabecalhoPagina titulo="Disciplinas" descricao="Disciplinas oferecidas em cada curso.">
        <Button onClick={abrirNovo}>
          <Plus /> Nova disciplina
        </Button>
      </CabecalhoPagina>

      <Card className="gap-0 p-0">
        <div className="relative border-b p-4">
          <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="max-w-sm pl-9"
            placeholder="Buscar por nome ou curso..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Disciplina</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead className="text-right">Carga horária</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinasFiltradas.map((disciplina) => (
              <TableRow key={disciplina.id}>
                <TableCell className="pl-4 font-medium">{disciplina.nome}</TableCell>
                <TableCell className="text-muted-foreground">{disciplina.curso}</TableCell>
                <TableCell className="text-right tabular-nums">{disciplina.carga_horaria} h</TableCell>
                <TableCell className="pr-4 text-right">
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => abrirEdicao(disciplina)}>
                    <Pencil className="text-muted-foreground" />
                  </Button>
                  <BotaoExcluir
                    descricao={"a disciplina " + disciplina.nome}
                    aoConfirmar={() => excluir(disciplina)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {disciplinasFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  Nenhuma disciplina encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {formularioAberto && (
        <FormularioDisciplina
          disciplina={disciplinaEmEdicao}
          aoFechar={() => setFormularioAberto(false)}
          aoSalvar={carregarDisciplinas}
        />
      )}
    </>
  );
}
