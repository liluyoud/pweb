/*
 * FORMULÁRIO DE ALUNO
 * -------------------
 * Janela (Dialog) usada tanto para CADASTRAR quanto para EDITAR.
 *   - Se receber um aluno -> modo edição (campos já preenchidos)
 *   - Se receber null     -> modo cadastro (campos vazios)
 *
 * "Props" são as informações que a página "mãe" passa para este componente.
 */
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Aluno, NovoAluno } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Campo } from "@/components/Campo";
import { CampoFoto } from "@/components/CampoFoto";
import { salvarAluno } from "@/servicos/api";

type Props = {
  aluno: Aluno | null;
  aoFechar: () => void; // função chamada para fechar a janela
  aoSalvar: () => void; // função chamada depois de salvar (para recarregar a lista)
};

const ALUNO_VAZIO: NovoAluno = {
  nome: "",
  cpf: "",
  matricula: "",
  email: "",
  telefone: "",
  foto: null,
};

export function FormularioAluno({ aluno, aoFechar, aoSalvar }: Props) {
  // Os dados do formulário começam com o aluno recebido (edição) ou vazios (novo).
  const [dados, setDados] = useState<NovoAluno>(aluno ?? ALUNO_VAZIO);

  // Chamado quando o formulário é enviado (botão Salvar ou tecla Enter).
  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault(); // impede o navegador de recarregar a página

    try {
      await salvarAluno(dados, aluno?.id);
      toast.success(aluno ? "Aluno atualizado." : "Aluno cadastrado.");
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
          <DialogTitle>{aluno ? "Editar aluno" : "Novo aluno"}</DialogTitle>
          <DialogDescription>Preencha os dados do aluno.</DialogDescription>
        </DialogHeader>

        <form onSubmit={aoEnviar} className="grid gap-4">
          <CampoFoto nome={dados.nome} foto={dados.foto} aoMudar={(foto) => setDados({ ...dados, foto: foto })} />

          {/* "...dados" copia todos os campos e depois trocamos só um deles */}
          <Campo rotulo="Nome completo">
            <Input required value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Matrícula">
              <Input
                required
                value={dados.matricula}
                onChange={(e) => setDados({ ...dados, matricula: e.target.value })}
              />
            </Campo>
            <Campo rotulo="CPF">
              <Input
                required
                placeholder="000.000.000-00"
                value={dados.cpf}
                onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
              />
            </Campo>
          </div>

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
