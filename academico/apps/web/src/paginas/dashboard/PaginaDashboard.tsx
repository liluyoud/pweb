/*
 * DASHBOARD (painel geral)
 * ------------------------
 * A tela inicial do sistema. Busca um resumo na API (GET /api/dashboard)
 * e mostra os números principais e alguns gráficos simples.
 */
import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import type { Dashboard } from "@academico/tipos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { GraficoBarras } from "@/components/GraficoBarras";
import { formatarNota } from "@/lib/formatar";
import { buscarDashboard } from "@/servicos/api";

// Cores de cada situação (as mesmas do SeloStatus).
const CORES_SITUACAO: Record<string, string> = {
  aprovado: "bg-emerald-500",
  reprovado: "bg-red-500",
  cursando: "bg-amber-400",
};

export function PaginaDashboard() {
  // Começa como null: os dados ainda não chegaram da API.
  const [dados, setDados] = useState<Dashboard | null>(null);

  useEffect(() => {
    buscarDashboard().then(setDados);
  }, []);

  // Enquanto os dados não chegam, mostramos um aviso simples.
  if (!dados) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  const cartoes = [
    { titulo: "Alunos", valor: dados.totais.alunos, icone: Users },
    { titulo: "Professores", valor: dados.totais.professores, icone: GraduationCap },
    { titulo: "Disciplinas", valor: dados.totais.disciplinas, icone: BookOpen },
    { titulo: "Matrículas", valor: dados.totais.matriculas, icone: ClipboardList },
  ];

  const totalMatriculas = dados.totais.matriculas;
  const maiorSemestre = Math.max(0, ...dados.matriculas_por_semestre.map((item) => item.valor));

  return (
    <>
      <CabecalhoPagina titulo="Dashboard" descricao="Visão geral do controle acadêmico." />

      {/* LINHA 1: totais */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cartoes.map((cartao) => (
          <Card key={cartao.titulo}>
            <CardContent>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm">{cartao.titulo}</span>
                <cartao.icone className="size-4" />
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums">{cartao.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LINHA 2: indicadores */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Média geral</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {formatarNota(dados.media_geral)}
              <span className="ml-1 text-base font-normal text-muted-foreground">/ 10</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Média de (N1 + N2) / 2 de todas as matrículas com notas lançadas.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Taxa de aprovação</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {dados.taxa_aprovacao === null ? "—" : dados.taxa_aprovacao + "%"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: (dados.taxa_aprovacao ?? 0) + "%" }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Entre as matrículas já encerradas.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Situação das matrículas</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Barra dividida em partes, uma para cada situação */}
            <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-muted">
              {dados.situacao.map((item) => (
                <div
                  key={item.rotulo}
                  className={CORES_SITUACAO[item.rotulo]}
                  style={{ width: (item.valor / totalMatriculas) * 100 + "%" }}
                />
              ))}
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              {dados.situacao.map((item) => (
                <li key={item.rotulo} className="flex items-center gap-2">
                  <span className={"size-2.5 rounded-full " + CORES_SITUACAO[item.rotulo]} />
                  <span className="capitalize">{item.rotulo}</span>
                  <span className="ml-auto font-medium tabular-nums">{item.valor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* LINHA 3: gráficos */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Matrículas por semestre</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Colunas verticais: a altura é proporcional ao valor */}
            <div className="flex h-48 items-end gap-4">
              {dados.matriculas_por_semestre.map((item) => (
                <div key={item.rotulo} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-sm font-medium tabular-nums">{item.valor}</span>
                  <div
                    className="w-full max-w-16 rounded-t-md bg-foreground/80"
                    style={{ height: (item.valor / maiorSemestre) * 140 + "px" }}
                  />
                  <span className="text-xs text-muted-foreground">{item.rotulo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Disciplinas com maior média</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoBarras itens={dados.melhores_disciplinas} maximo={10} formatarValor={formatarNota} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
