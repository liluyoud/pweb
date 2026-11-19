/*
 * FORMULÁRIO DE MATRÍCULA
 * -----------------------
 * Aqui escolhemos o aluno, o professor e a disciplina em listas (Select)
 * e digitamos as notas. O STATUS não é digitado: a API calcula sozinha.
 *
 * Detalhe importante: o componente Select trabalha com TEXTO,
 * mas os ids no banco são NÚMEROS. Por isso usamos:
 *   String(numero) -> para mostrar no Select
 *   Number(texto)  -> para guardar de volta nos dados
 */
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Aluno, Disciplina, Matricula, NovaMatricula, Professor } from "@academico/tipos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campo } from "@/components/Campo";
import { listarAlunos, listarDisciplinas, listarProfessores, salvarMatricula } from "@/servicos/api";

type Props = {
  matricula: Matricula | null;
  aoFechar: () => void;
  aoSalvar: () => void;
};

// Monta a lista de semestres: do ano passado até o ano que vem.
// Ex.: em 2026 -> 2025.1, 2025.2, 2026.1, 2026.2, 2027.1, 2027.2
function gerarSemestres() {
  const anoAtual = new Date().getFullYear();
  const semestres: string[] = [];
  for (let ano = anoAtual - 1; ano <= anoAtual + 1; ano++) {
    semestres.push(ano + ".1");
    semestres.push(ano + ".2");
  }
  return semestres;
}

// Converte o que foi digitado no campo de nota.
// Campo vazio -> null (nota ainda não lançada)
function lerNota(texto: string) {
  if (texto === "") {
    return null;
  }
  return Number(texto);
}

// id 0 = "nada escolhido ainda"
const MATRICULA_VAZIA: NovaMatricula = {
  aluno_id: 0,
  professor_id: 0,
  disciplina_id: 0,
  semestre: "",
  n1: null,
  n2: null,
  pf: null,
};

export function FormularioMatricula({ matricula, aoFechar, aoSalvar }: Props) {
  const [dados, setDados] = useState<NovaMatricula>(matricula ?? MATRICULA_VAZIA);

  // Listas para preencher os Selects
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  useEffect(() => {
    async function carregarListas() {
      setAlunos(await listarAlunos());
      setProfessores(await listarProfessores());
      setDisciplinas(await listarDisciplinas());
    }
    carregarListas();
  }, []);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();

    if (!dados.aluno_id || !dados.professor_id || !dados.disciplina_id || !dados.semestre) {
      toast.error("Escolha o aluno, o professor, a disciplina e o semestre.");
      return;
    }

    try {
      await salvarMatricula(dados, matricula?.id);
      toast.success(matricula ? "Matrícula atualizada." : "Matrícula cadastrada.");
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
          <DialogTitle>{matricula ? "Editar matrícula" : "Nova matrícula"}</DialogTitle>
          <DialogDescription>A situação (aprovado/reprovado) é calculada automaticamente.</DialogDescription>
        </DialogHeader>

        <form onSubmit={aoEnviar} className="grid gap-4">
          <Campo rotulo="Aluno">
            <Select
              value={dados.aluno_id ? String(dados.aluno_id) : ""}
              onValueChange={(valor) => setDados({ ...dados, aluno_id: Number(valor) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o aluno..." />
              </SelectTrigger>
              <SelectContent>
                {alunos.map((aluno) => (
                  <SelectItem key={aluno.id} value={String(aluno.id)}>
                    {aluno.nome} — {aluno.matricula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>

          <Campo rotulo="Disciplina">
            <Select
              value={dados.disciplina_id ? String(dados.disciplina_id) : ""}
              onValueChange={(valor) => setDados({ ...dados, disciplina_id: Number(valor) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a disciplina..." />
              </SelectTrigger>
              <SelectContent>
                {disciplinas.map((disciplina) => (
                  <SelectItem key={disciplina.id} value={String(disciplina.id)}>
                    {disciplina.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>

          <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
            <Campo rotulo="Professor">
              <Select
                value={dados.professor_id ? String(dados.professor_id) : ""}
                onValueChange={(valor) => setDados({ ...dados, professor_id: Number(valor) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o professor..." />
                </SelectTrigger>
                <SelectContent>
                  {professores.map((professor) => (
                    <SelectItem key={professor.id} value={String(professor.id)}>
                      {professor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Campo>

            <Campo rotulo="Semestre">
              <Select value={dados.semestre} onValueChange={(valor) => setDados({ ...dados, semestre: valor })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex.: 2026.1" />
                </SelectTrigger>
                <SelectContent>
                  {gerarSemestres().map((semestre) => (
                    <SelectItem key={semestre} value={semestre}>
                      {semestre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Campo>
          </div>

          {/* Notas: "?? ''" mostra o campo vazio quando a nota é null */}
          <div className="grid grid-cols-3 gap-4">
            <Campo rotulo="N1">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={dados.n1 ?? ""}
                onChange={(e) => setDados({ ...dados, n1: lerNota(e.target.value) })}
              />
            </Campo>
            <Campo rotulo="N2">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={dados.n2 ?? ""}
                onChange={(e) => setDados({ ...dados, n2: lerNota(e.target.value) })}
              />
            </Campo>
            <Campo rotulo="Prova final">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={dados.pf ?? ""}
                onChange={(e) => setDados({ ...dados, pf: lerNota(e.target.value) })}
              />
            </Campo>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Média (N1+N2)/2 ≥ 7 aprova direto. Abaixo disso, (média + PF)/2 ≥ 5 aprova.
          </p>

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
