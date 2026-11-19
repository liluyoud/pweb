/*
 * PÁGINA DE RELATÓRIOS
 * --------------------
 * Três relatórios simples, separados em abas (Tabs).
 * Cada aba é um componente que fica em seu próprio arquivo.
 */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { RelatorioBoletim } from "./RelatorioBoletim";
import { RelatorioDisciplinas } from "./RelatorioDisciplinas";
import { RelatorioProfessores } from "./RelatorioProfessores";

export function PaginaRelatorios() {
  return (
    <>
      <CabecalhoPagina titulo="Relatórios" descricao="Consultas rápidas sobre o desempenho acadêmico." />

      <Tabs defaultValue="boletim">
        <TabsList>
          <TabsTrigger value="boletim">Boletim do aluno</TabsTrigger>
          <TabsTrigger value="disciplinas">Por disciplina</TabsTrigger>
          <TabsTrigger value="professores">Por professor</TabsTrigger>
        </TabsList>

        <TabsContent value="boletim" className="mt-4">
          <RelatorioBoletim />
        </TabsContent>
        <TabsContent value="disciplinas" className="mt-4">
          <RelatorioDisciplinas />
        </TabsContent>
        <TabsContent value="professores" className="mt-4">
          <RelatorioProfessores />
        </TabsContent>
      </Tabs>
    </>
  );
}
