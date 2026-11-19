/*
 * PÁGINA DE ALUNOS
 * ----------------
 * Mostra a lista de alunos e permite criar, editar e excluir.
 * Esta é a página "modelo": as páginas de professores e disciplinas
 * seguem exatamente o mesmo jeito de funcionar.
 *
 * Conceitos de React usados aqui:
 *   useState  -> guarda informações que, quando mudam, redesenham a tela
 *   useEffect -> executa algo quando a tela aparece (aqui: buscar os dados)
 */
import { useEffect, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Aluno } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { FotoPerfil } from "@/components/FotoPerfil";
import { excluirAluno, listarAlunos } from "@/servicos/api";
import { FormularioAluno } from "./FormularioAluno";

export function PaginaAlunos() {
  // Lista de alunos que veio da API
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  // Texto digitado na caixa de busca
  const [busca, setBusca] = useState("");
  // O formulário está aberto?
  const [formularioAberto, setFormularioAberto] = useState(false);
  // Aluno sendo editado (null = cadastrando um aluno novo)
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);

  async function carregarAlunos() {
    const lista = await listarAlunos();
    setAlunos(lista);
  }

  // [] no final = "rode só uma vez, quando a página abrir".
  useEffect(() => {
    carregarAlunos();
  }, []);

  function abrirNovo() {
    setAlunoEmEdicao(null);
    setFormularioAberto(true);
  }

  function abrirEdicao(aluno: Aluno) {
    setAlunoEmEdicao(aluno);
    setFormularioAberto(true);
  }

  async function excluir(aluno: Aluno) {
    try {
      await excluirAluno(aluno.id);
      toast.success("Aluno excluído.");
      carregarAlunos();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  // Filtra a lista conforme o texto da busca (por nome ou matrícula).
  const termo = busca.toLowerCase();
  const alunosFiltrados = alunos.filter(
    (aluno) => aluno.nome.toLowerCase().includes(termo) || aluno.matricula.includes(termo)
  );

  return (
    <>
      <CabecalhoPagina titulo="Alunos" descricao="Cadastro dos alunos da instituição.">
        <Button onClick={abrirNovo}>
          <Plus /> Novo aluno
        </Button>
      </CabecalhoPagina>

      <Card className="gap-0 p-0">
        <div className="relative border-b p-4">
          <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="max-w-sm pl-9"
            placeholder="Buscar por nome ou matrícula..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Aluno</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunosFiltrados.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <FotoPerfil nome={aluno.nome} foto={aluno.foto} />
                    <div>
                      <p className="font-medium">{aluno.nome}</p>
                      <p className="text-xs text-muted-foreground">{aluno.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{aluno.matricula}</TableCell>
                <TableCell className="text-muted-foreground">{aluno.cpf}</TableCell>
                <TableCell className="text-muted-foreground">{aluno.telefone}</TableCell>
                <TableCell className="pr-4 text-right">
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => abrirEdicao(aluno)}>
                    <Pencil className="text-muted-foreground" />
                  </Button>
                  <BotaoExcluir descricao={"o aluno " + aluno.nome} aoConfirmar={() => excluir(aluno)} />
                </TableCell>
              </TableRow>
            ))}

            {alunosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* O formulário só existe na tela enquanto estiver aberto */}
      {formularioAberto && (
        <FormularioAluno
          aluno={alunoEmEdicao}
          aoFechar={() => setFormularioAberto(false)}
          aoSalvar={carregarAlunos}
        />
      )}
    </>
  );
}
