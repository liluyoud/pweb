/*
 * REGRAS DE NOTAS
 * ---------------
 * "Regra de negócio" é uma regra que vem do mundo real (da faculdade),
 * e não da programação. Deixamos ela isolada aqui para ficar fácil de
 * encontrar e de mudar. Se a faculdade mudar a média, mexemos só aqui.
 *
 * Regra adotada neste projeto:
 *   1. Média = (N1 + N2) / 2
 *   2. Média >= 7  -> APROVADO direto
 *   3. Média < 7   -> faz a Prova Final (PF)
 *   4. (Média + PF) / 2 >= 5 -> APROVADO, senão REPROVADO
 *   5. Enquanto faltar alguma nota necessária -> CURSANDO
 */
import type { StatusMatricula } from "@academico/tipos";

export const MEDIA_PARA_APROVAR = 7;
export const MEDIA_FINAL_PARA_APROVAR = 5;

export function calcularStatus(
  n1: number | null,
  n2: number | null,
  pf: number | null
): StatusMatricula {
  // Se ainda falta N1 ou N2, o aluno está cursando.
  if (n1 === null || n2 === null) {
    return "cursando";
  }

  const media = (n1 + n2) / 2;

  if (media >= MEDIA_PARA_APROVAR) {
    return "aprovado";
  }

  // Não passou direto: depende da prova final.
  if (pf === null) {
    return "cursando";
  }

  const mediaFinal = (media + pf) / 2;

  if (mediaFinal >= MEDIA_FINAL_PARA_APROVAR) {
    return "aprovado";
  }

  return "reprovado";
}
