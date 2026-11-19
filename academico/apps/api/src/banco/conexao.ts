/*
 * CONEXÃO COM O BANCO DE DADOS
 * ----------------------------
 * O SQLite guarda o banco inteiro em UM ÚNICO ARQUIVO no computador.
 * Não precisa instalar nenhum servidor de banco: o próprio Bun já sabe
 * ler e escrever nesse arquivo (através do módulo "bun:sqlite").
 */
import { Database } from "bun:sqlite";
import { criarTabelas } from "./criar-tabelas";

// import.meta.dir = pasta onde ESTE arquivo está (src/banco).
// Subimos duas pastas para salvar o arquivo na raiz da API (apps/api).
const caminhoDoArquivo = import.meta.dir + "/../../academico.sqlite";

// Abre o arquivo (e cria, se ainda não existir).
export const banco = new Database(caminhoDoArquivo, { create: true });

// Liga a checagem de chaves estrangeiras (relacionamentos entre tabelas).
// No SQLite ela vem DESLIGADA por padrão!
banco.run("PRAGMA foreign_keys = ON");

// Garante que as tabelas existem antes de qualquer consulta.
criarTabelas(banco);
