/*
 * ROTAS DE ALUNOS  ->  /api/alunos
 * --------------------------------
 * Cada função abaixo responde a um tipo de pedido (CRUD):
 *   listar    -> GET    /api/alunos        (lista todos)
 *   buscar    -> GET    /api/alunos/:id    (mostra um)
 *   criar     -> POST   /api/alunos        (cadastra)
 *   atualizar -> PUT    /api/alunos/:id    (altera)
 *   excluir   -> DELETE /api/alunos/:id    (apaga)
 *
 * Padrão do bun:sqlite:
 *   banco.query("SQL")  -> prepara o comando
 *   .all()  -> devolve TODAS as linhas (uma lista)
 *   .get()  -> devolve UMA linha (ou null)
 *   .run()  -> executa INSERT, UPDATE ou DELETE
 *   Os "?" do SQL são preenchidos, em ordem, pelos valores passados.
 *   (Nunca junte valores direto no texto do SQL: isso abre brecha
 *    para um ataque chamado "SQL Injection".)
 */
import type { BunRequest } from "bun";
import type { NovoAluno } from "@academico/tipos";
import { banco } from "../banco/conexao";
import { erro, verificarObrigatorios } from "./ajudantes";

const CAMPOS_OBRIGATORIOS = ["nome", "cpf", "matricula", "email"];

export function listar() {
  const alunos = banco.query("SELECT * FROM alunos ORDER BY nome").all();
  return Response.json(alunos);
}

export function buscar(req: BunRequest) {
  const aluno = banco.query("SELECT * FROM alunos WHERE id = ?").get(req.params.id);

  if (!aluno) {
    return erro("Aluno não encontrado.", 404);
  }
  return Response.json(aluno);
}

export async function criar(req: BunRequest) {
  // req.json() lê o corpo do pedido (os dados do formulário).
  // "as NovoAluno" avisa ao TypeScript qual é o formato esperado.
  const dados = (await req.json()) as NovoAluno;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query("INSERT INTO alunos (nome, cpf, matricula, email, telefone, foto) VALUES (?, ?, ?, ?, ?, ?)")
    .run(dados.nome, dados.cpf, dados.matricula, dados.email, dados.telefone ?? "", dados.foto ?? null);

  // lastInsertRowid = o id que o banco acabou de gerar.
  const alunoCriado = banco.query("SELECT * FROM alunos WHERE id = ?").get(resultado.lastInsertRowid);

  // 201 = "criado com sucesso"
  return Response.json(alunoCriado, { status: 201 });
}

export async function atualizar(req: BunRequest) {
  const dados = (await req.json()) as NovoAluno;

  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);
  }

  const resultado = banco
    .query("UPDATE alunos SET nome = ?, cpf = ?, matricula = ?, email = ?, telefone = ?, foto = ? WHERE id = ?")
    .run(
      dados.nome,
      dados.cpf,
      dados.matricula,
      dados.email,
      dados.telefone ?? "",
      dados.foto ?? null,
      req.params.id
    );

  // changes = quantas linhas foram alteradas. Zero = esse id não existe.
  if (resultado.changes === 0) {
    return erro("Aluno não encontrado.", 404);
  }

  const alunoAtualizado = banco.query("SELECT * FROM alunos WHERE id = ?").get(req.params.id);
  return Response.json(alunoAtualizado);
}

export function excluir(req: BunRequest) {
  const resultado = banco.query("DELETE FROM alunos WHERE id = ?").run(req.params.id);

  if (resultado.changes === 0) {
    return erro("Aluno não encontrado.", 404);
  }
  return Response.json({ mensagem: "Aluno excluído." });
}
