/*
 * FORMULÁRIO DE PROFESSOR
 * -----------------------
 * Igual ao formulário de aluno, com um campo de seleção (Select)
 * para a titulação.
 */
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { NovoProfessor, Professor } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campo } from "@/components/Campo";
import { CampoFoto } from "@/components/CampoFoto";
import { salvarProfessor } from "@/servicos/api";

const TITULACOES = ["Graduado", "Especialista", "Mestre", "Doutor", "Pós-Doutor"];

type Props = {
  professor: Professor | null;
  aoFechar: () => void;
  aoSalvar: () => void;
};

const PROFESSOR_VAZIO: NovoProfessor = {
  nome: "",
  cpf: "",
  titulacao: "",
  graduacao: "",
  email: "",
  telefone: "",
  foto: null,
};

export function FormularioProfessor({ professor, aoFechar, aoSalvar }: Props) {
  const [dados, setDados] = useState<NovoProfessor>(professor ?? PROFESSOR_VAZIO);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();

    try {
      await salvarProfessor(dados, professor?.id);
      toast.success(professor ? "Professor atualizado." : "Professor cadastrado.");
      aoSalvar();
      aoFechar();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  return (
    <Dialog open onOpenChange={aoFechar}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{professor ? "Editar professor" : "Novo professor"}</DialogTitle>
          <DialogDescription>Preencha os dados do professor.</DialogDescription>
        </DialogHeader>

        <form onSubmit={aoEnviar} className="grid gap-4">
          <CampoFoto nome={dados.nome} foto={dados.foto} aoMudar={(foto) => setDados({ ...dados, foto: foto })} />

          <Campo rotulo="Nome completo">
            <Input required value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="CPF">
              <Input
                required
                placeholder="000.000.000-00"
                value={dados.cpf}
                onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
              />
            </Campo>
            <Campo rotulo="Titulação">
              <Select
                required
                value={dados.titulacao}
                onValueChange={(valor) => setDados({ ...dados, titulacao: valor })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {TITULACOES.map((titulacao) => (
                    <SelectItem key={titulacao} value={titulacao}>
                      {titulacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Campo>
          </div>

          <Campo rotulo="Graduação (curso de formação)">
            <Input
              required
              value={dados.graduacao}
              onChange={(e) => setDados({ ...dados, graduacao: e.target.value })}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="E-mail">
              <Input
                required
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
              />
            </Campo>
            <Campo rotulo="Telefone">
              <Input
                placeholder="(00) 00000-0000"
                value={dados.telefone}
                onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
              />
            </Campo>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
