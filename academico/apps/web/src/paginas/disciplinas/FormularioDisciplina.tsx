/*
 * FORMULÁRIO DE DISCIPLINA
 * ------------------------
 * O formulário mais simples do sistema: só três campos.
 */
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Disciplina, NovaDisciplina } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Campo } from "@/components/Campo";
import { salvarDisciplina } from "@/servicos/api";

type Props = {
  disciplina: Disciplina | null;
  aoFechar: () => void;
  aoSalvar: () => void;
};

const DISCIPLINA_VAZIA: NovaDisciplina = {
  nome: "",
  curso: "",
  carga_horaria: 60,
};

export function FormularioDisciplina({ disciplina, aoFechar, aoSalvar }: Props) {
  const [dados, setDados] = useState<NovaDisciplina>(disciplina ?? DISCIPLINA_VAZIA);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();

    try {
      await salvarDisciplina(dados, disciplina?.id);
      toast.success(disciplina ? "Disciplina atualizada." : "Disciplina cadastrada.");
      aoSalvar();
      aoFechar();
    } catch {
      // A mensagem de erro já foi mostrada por servicos/api.ts
    }
  }

  return (
    <Dialog open onOpenChange={aoFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{disciplina ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
          <DialogDescription>Preencha os dados da disciplina.</DialogDescription>
        </DialogHeader>

        <form onSubmit={aoEnviar} className="grid gap-4">
          <Campo rotulo="Nome da disciplina">
            <Input required value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} />
          </Campo>

          <Campo rotulo="Curso">
            <Input required value={dados.curso} onChange={(e) => setDados({ ...dados, curso: e.target.value })} />
          </Campo>

          <Campo rotulo="Carga horária (horas)">
            {/* Number(...) converte o texto digitado em número */}
            <Input
              required
              type="number"
              min={1}
              value={dados.carga_horaria}
              onChange={(e) => setDados({ ...dados, carga_horaria: Number(e.target.value) })}
            />
          </Campo>

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
