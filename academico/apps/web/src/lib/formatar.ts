/*
 * FUNÇÕES DE FORMATAÇÃO
 * Pequenas funções para mostrar valores de um jeito bonito na tela.
 */

// 7.5 -> "7,5"   |   null -> "—"
export function formatarNota(nota: number | null) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// Média simples entre N1 e N2 (ou null se faltar alguma nota).
export function calcularMedia(n1: number | null, n2: number | null) {
  if (n1 === null || n2 === null) {
    return null;
  }
  return (n1 + n2) / 2;
}

// "Ana Beatriz Souza" -> "AS"  (usado quando a pessoa não tem foto)
export function iniciais(nome: string) {
  const partes = nome.trim().split(" ");
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
