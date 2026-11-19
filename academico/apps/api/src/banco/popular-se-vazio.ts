/*
 * POPULAR SOMENTE SE O BANCO ESTIVER VAZIO
 * ----------------------------------------
 * Rode com:  bun run banco:popular-se-vazio
 *
 * Usado ao iniciar o contêiner (veja academico/Dockerfile). Diferente de
 * "banco:popular", este script NÃO apaga nada: só coloca os dados de exemplo
 * quando não existe nenhum aluno, professor, disciplina ou matrícula.
 * Assim os dados cadastrados no site continuam lá depois de cada deploy.
 */
import { banco } from "./conexao";

const tabelas = ["alunos", "professores", "disciplinas", "matriculas"];
const total = tabelas.reduce((soma, tabela) => {
  const { quantidade } = banco.query(`SELECT COUNT(*) AS quantidade FROM ${tabela}`).get() as { quantidade: number };
  return soma + quantidade;
}, 0);

if (total === 0) {
  console.log("📭 Banco vazio: colocando dados de exemplo.");
  await import("./popular");
} else {
  console.log(`📚 Banco já tem ${total} registros: dados de exemplo não foram inseridos.`);
}
