/*
 * CRIAÇÃO DAS TABELAS
 * -------------------
 * Aqui escrevemos o SQL que cria a estrutura do banco.
 * "IF NOT EXISTS" faz o comando ser ignorado se a tabela já existir,
 * por isso podemos rodar este código toda vez que a API liga.
 */
import type { Database } from "bun:sqlite";

export function criarTabelas(banco: Database) {
  banco.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT NOT NULL,
      cpf       TEXT NOT NULL UNIQUE,
      matricula TEXT NOT NULL UNIQUE,
      email     TEXT NOT NULL,
      telefone  TEXT NOT NULL DEFAULT '',
      foto      TEXT
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS professores (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT NOT NULL,
      cpf       TEXT NOT NULL UNIQUE,
      titulacao TEXT NOT NULL,
      graduacao TEXT NOT NULL,
      email     TEXT NOT NULL,
      telefone  TEXT NOT NULL DEFAULT '',
      foto      TEXT
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS disciplinas (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      nome          TEXT NOT NULL,
      curso         TEXT NOT NULL,
      carga_horaria INTEGER NOT NULL CHECK (carga_horaria > 0)
    )
  `);

  // A tabela "matriculas" LIGA as outras três.
  // REFERENCES = chave estrangeira: o aluno_id precisa existir em "alunos".
  // O UNIQUE no final impede matricular o mesmo aluno duas vezes
  // na mesma disciplina e no mesmo semestre.
  banco.run(`
    CREATE TABLE IF NOT EXISTS matriculas (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id      INTEGER NOT NULL REFERENCES alunos(id),
      professor_id  INTEGER NOT NULL REFERENCES professores(id),
      disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id),
      semestre      TEXT NOT NULL,
      n1            REAL CHECK (n1 BETWEEN 0 AND 10),
      n2            REAL CHECK (n2 BETWEEN 0 AND 10),
      pf            REAL CHECK (pf BETWEEN 0 AND 10),
      status        TEXT NOT NULL DEFAULT 'cursando',
      UNIQUE (aluno_id, disciplina_id, semestre)
    )
  `);
}
