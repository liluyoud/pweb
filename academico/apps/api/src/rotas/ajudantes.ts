/*
 * AJUDANTES
 * ---------
 * Pequenas funções reaproveitadas por todas as rotas.
 * Assim evitamos repetir o mesmo código em vários arquivos.
 */

// Devolve uma resposta de erro no formato { "erro": "mensagem" }.
// Status 400 = "o pedido veio com problema" (padrão).
// Status 404 = "não encontrado".
export function erro(mensagem: string, status: number = 400) {
  return Response.json({ erro: mensagem }, { status: status });
}

// Confere se os campos obrigatórios vieram preenchidos.
// Devolve uma mensagem de erro, ou null se estiver tudo certo.
// Obs.: "any" diz ao TypeScript "aceite qualquer coisa aqui".
export function verificarObrigatorios(dados: any, campos: string[]) {
  for (const campo of campos) {
    const valor = dados[campo];
    if (valor === undefined || valor === null || String(valor).trim() === "") {
      return `O campo "${campo}" é obrigatório.`;
    }
  }
  return null;
}

// Converte o valor de uma nota vindo do formulário.
// Campo vazio vira null (nota ainda não lançada).
export function paraNota(valor: any): number | null {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }
  return Number(valor);
}

// O SQLite devolve mensagens em inglês e bem técnicas.
// Aqui traduzimos as mais comuns para algo que o usuário entenda.
export function traduzirErroDoBanco(mensagemOriginal: string) {
  if (mensagemOriginal.includes("UNIQUE constraint failed")) {
    return "Já existe um cadastro com esses dados (CPF, matrícula, ou o aluno já está nesta disciplina neste semestre).";
  }
  if (mensagemOriginal.includes("FOREIGN KEY constraint failed")) {
    return "Não é possível concluir: este registro está ligado a uma ou mais matrículas.";
  }
  if (mensagemOriginal.includes("CHECK constraint failed")) {
    return "Valor inválido: as notas devem ficar entre 0 e 10 e a carga horária deve ser maior que zero.";
  }
  return "Erro inesperado: " + mensagemOriginal;
}
