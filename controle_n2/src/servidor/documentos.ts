import type { Projeto } from "../tipos";

type Aluno = { nome: string; nascimento: string };

const PARTICULAS = new Set(["a", "as", "o", "os", "e", "de", "da", "das", "do", "dos"]);

function normalizarNome(nome: string) {
  return nome.trim().toLocaleLowerCase("pt-BR").split(/\s+/).map((palavra, indice) => {
    if (indice > 0 && PARTICULAS.has(palavra)) return palavra;
    return palavra.replace(/(^|[-'’])\p{L}/gu, (inicio) => inicio.toLocaleUpperCase("pt-BR"));
  }).join(" ");
}

export function lerAlunos(markdown: string) {
  const alunos = new Map<string, Aluno>();

  for (const linha of markdown.split(/\r?\n/)) {
    const registro = linha.match(/^\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*(\d{2})\/(\d{2})\/(\d{4})\s*\|\s*$/);
    if (!registro) continue;

    const [, matricula, nomeOriginal, dia, mes, ano] = registro;
    const nome = normalizarNome(nomeOriginal);
    const nascimento = [ano, mes, dia].join("-");
    const anterior = alunos.get(matricula);
    if (anterior && (anterior.nome !== nome || anterior.nascimento !== nascimento)) {
      throw new Error("A lista de alunos contém dados conflitantes para uma matrícula.");
    }
    alunos.set(matricula, { nome, nascimento });
  }

  if (alunos.size === 0) throw new Error("A lista não contém alunos válidos.");
  return alunos;
}

export function lerProjetos(markdown: string): Projeto[] {
  const projetos = Array.from(markdown.matchAll(/^## Grupo (\d+): (.+)$/gm));
  // Separa o documento pelos títulos dos grupos, preservando os parágrafos.
  return projetos.map(({ 0: cabecalho, 1: numero, 2: nome, index }, indice) => {
    const inicio = index + cabecalho.length;
    const fim = projetos[indice + 1]?.index ?? markdown.length;
    const secao = markdown.slice(inicio, fim).trim();
    const [, titulo, descricao] = secao.match(/^### (.+)\r?\n+([\s\S]*?)(?=\r?\n- \*\*)/) ?? [];
    const detalhes = Array.from(secao.matchAll(/^- \*\*(.+?)\.\*\* (.+)$/gm),
      ([, titulo, texto]) => ({ titulo, texto }));
    if (!titulo || !descricao || detalhes.length === 0) {
      throw new Error("Confira a estrutura do enunciado do grupo " + numero + ".");
    }
    return { id: Number(numero), nome: nome.trim(), titulo: titulo.trim(), descricao: descricao.trim(), detalhes };
  });
}
