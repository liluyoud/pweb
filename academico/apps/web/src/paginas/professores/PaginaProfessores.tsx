/*
 * PÁGINA DE PROFESSORES
 * ---------------------
 * Funciona igual à página de alunos (leia PaginaAlunos.tsx primeiro).
 */
import { useEffect, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Professor } from "@academico/tipos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { FotoPerfil } from "@/components/FotoPerfil";
import { excluirProfessor, listarProfessores } from "@/servicos/api";
import { FormularioProfessor } from "./FormularioProfessor";

export function PaginaProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [busca, setBusca] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [professorEmEdicao, setProfessorEmEdicao] = useState<Professor | null>(null);

  async function carregarProfessores() {
    const lista = await listarProfessores();
    setProfessores(lista);
  }

  useEffect(() => {
    carregarProfessores();
  }, []);

  function abrirNovo() {
    setProfessorEmEdicao(null);
    setFormularioAberto(true);
  }

  function abrirEdicao(professor: Professor) {
    setProfessorEmEdicao(professor);
    setFormularioAberto(true);
  }

  async function excluir(professor: Professor) {
    try {
      await excluirProfessor(professor.id);
      toast.success("Professor excluído.");
      carregarProfessores();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  const termo = busca.toLowerCase();
  const professoresFiltrados = professores.filter((professor) => professor.nome.toLowerCase().includes(termo));

  return (
    <>
      <CabecalhoPagina titulo="Professores" descricao="Cadastro do corpo docente.">
        <Button onClick={abrirNovo}>
          <Plus /> Novo professor
        </Button>
      </CabecalhoPagina>

      <Card className="gap-0 p-0">
        <div className="relative border-b p-4">
          <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="max-w-sm pl-9"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Professor</TableHead>
              <TableHead>Titulação</TableHead>
              <TableHead>Graduação</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {professoresFiltrados.map((professor) => (
              <TableRow key={professor.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <FotoPerfil nome={professor.nome} foto={professor.foto} />
                    <div>
                      <p className="font-medium">{professor.nome}</p>
                      <p className="text-xs text-muted-foreground">{professor.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{professor.titulacao}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{professor.graduacao}</TableCell>
                <TableCell className="text-muted-foreground">{professor.telefone}</TableCell>
                <TableCell className="pr-4 text-right">
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => abrirEdicao(professor)}>
                    <Pencil className="text-muted-foreground" />
                  </Button>
                  <BotaoExcluir
                    descricao={"o professor " + professor.nome}
                    aoConfirmar={() => excluir(professor)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {professoresFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum professor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {formularioAberto && (
        <FormularioProfessor
          professor={professorEmEdicao}
          aoFechar={() => setFormularioAberto(false)}
          aoSalvar={carregarProfessores}
        />
      )}
    </>
  );
}
