/*
 * APP (componente principal)
 * --------------------------
 * Define QUAL página aparece para CADA endereço do navegador.
 *   http://localhost:5173/          -> Dashboard
 *   http://localhost:5173/alunos    -> Alunos
 *   ...
 * Para criar uma página nova: crie o componente em paginas/ e
 * adicione uma <Route> aqui (e um item no menu, em components/Layout.tsx).
 */
import { Route, Routes } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import { PaginaDashboard } from "@/paginas/dashboard/PaginaDashboard";
import { PaginaAlunos } from "@/paginas/alunos/PaginaAlunos";
import { PaginaProfessores } from "@/paginas/professores/PaginaProfessores";
import { PaginaDisciplinas } from "@/paginas/disciplinas/PaginaDisciplinas";
import { PaginaMatriculas } from "@/paginas/matriculas/PaginaMatriculas";
import { PaginaRelatorios } from "@/paginas/relatorios/PaginaRelatorios";

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/alunos" element={<PaginaAlunos />} />
        <Route path="/professores" element={<PaginaProfessores />} />
        <Route path="/disciplinas" element={<PaginaDisciplinas />} />
        <Route path="/matriculas" element={<PaginaMatriculas />} />
        <Route path="/relatorios" element={<PaginaRelatorios />} />
      </Routes>

      {/* Toaster = área onde aparecem os avisos (sucesso/erro) */}
      <Toaster position="top-right" richColors />
    </Layout>
  );
}
