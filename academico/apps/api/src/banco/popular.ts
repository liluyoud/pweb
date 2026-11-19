/*
 * POPULAR O BANCO (dados de exemplo)
 * ----------------------------------
 * Rode com:  bun run banco:popular
 *
 * Este script APAGA tudo e coloca dados de exemplo no banco.
 * Serve para o sistema não começar vazio (o dashboard fica mais bonito!).
 * Em inglês, esse tipo de script costuma se chamar "seed" (semente).
 */
import { banco } from "./conexao";
import { calcularStatus } from "../regras/notas";

console.log("🧹 Limpando dados antigos...");
// A ordem importa: primeiro as matrículas, que dependem das outras tabelas.
banco.run("DELETE FROM matriculas");
banco.run("DELETE FROM alunos");
banco.run("DELETE FROM professores");
banco.run("DELETE FROM disciplinas");
// Faz os ids voltarem a começar do 1.
banco.run("DELETE FROM sqlite_sequence");

// ------------------------------------------------------------------
// Alunos
// ------------------------------------------------------------------
console.log("🎓 Cadastrando alunos...");
const alunos = [
  ["Ana Beatriz Souza", "111.111.111-11", "2026001", "ana.souza@email.com", "(69) 99901-0001"],
  ["Bruno Henrique Lima", "222.222.222-22", "2026002", "bruno.lima@email.com", "(69) 99901-0002"],
  ["Carla Mendes Rocha", "333.333.333-33", "2026003", "carla.rocha@email.com", "(69) 99901-0003"],
  ["Daniel Oliveira Costa", "444.444.444-44", "2026004", "daniel.costa@email.com", "(69) 99901-0004"],
  ["Eduarda Martins Alves", "555.555.555-55", "2026005", "eduarda.alves@email.com", "(69) 99901-0005"],
  ["Felipe Araújo Santos", "666.666.666-66", "2026006", "felipe.santos@email.com", "(69) 99901-0006"],
  ["Gabriela Nunes Pereira", "777.777.777-77", "2026007", "gabriela.pereira@email.com", "(69) 99901-0007"],
  ["Henrique Barbosa Dias", "888.888.888-88", "2026008", "henrique.dias@email.com", "(69) 99901-0008"],
];
for (const aluno of alunos) {
  banco
    .query("INSERT INTO alunos (nome, cpf, matricula, email, telefone) VALUES (?, ?, ?, ?, ?)")
    .run(aluno[0], aluno[1], aluno[2], aluno[3], aluno[4]);
}

// ------------------------------------------------------------------
// Professores
// ------------------------------------------------------------------
console.log("👩‍🏫 Cadastrando professores...");
const professores = [
  ["Marcos Vinícius Teixeira", "123.456.789-01", "Doutor", "Ciência da Computação", "marcos.teixeira@faculdade.edu.br", "(69) 98800-1001"],
  ["Patrícia Gomes Ribeiro", "123.456.789-02", "Mestre", "Sistemas de Informação", "patricia.ribeiro@faculdade.edu.br", "(69) 98800-1002"],
  ["Roberto Carlos Freitas", "123.456.789-03", "Especialista", "Engenharia de Software", "roberto.freitas@faculdade.edu.br", "(69) 98800-1003"],
  ["Juliana Castro Moreira", "123.456.789-04", "Doutor", "Matemática", "juliana.moreira@faculdade.edu.br", "(69) 98800-1004"],
];
for (const professor of professores) {
  banco
    .query("INSERT INTO professores (nome, cpf, titulacao, graduacao, email, telefone) VALUES (?, ?, ?, ?, ?, ?)")
    .run(professor[0], professor[1], professor[2], professor[3], professor[4], professor[5]);
}

// ------------------------------------------------------------------
// Disciplinas
// ------------------------------------------------------------------
console.log("📚 Cadastrando disciplinas...");
const disciplinas = [
  ["Algoritmos e Lógica de Programação", "Ciência da Computação", 80],
  ["Programação Web", "Ciência da Computação", 80],
  ["Banco de Dados", "Ciência da Computação", 60],
  ["Cálculo I", "Ciência da Computação", 80],
  ["Engenharia de Software", "Sistemas de Informação", 60],
  ["Estruturas de Dados", "Ciência da Computação", 80],
];
for (const disciplina of disciplinas) {
  banco
    .query("INSERT INTO disciplinas (nome, curso, carga_horaria) VALUES (?, ?, ?)")
    .run(disciplina[0], disciplina[1], disciplina[2]);
}

// ------------------------------------------------------------------
// Matrículas
// Esta função cadastra UMA matrícula, já calculando o status.
// ------------------------------------------------------------------
function matricular(
  alunoId: number,
  professorId: number,
  disciplinaId: number,
  semestre: string,
  n1: number | null,
  n2: number | null,
  pf: number | null
) {
  const status = calcularStatus(n1, n2, pf);
  banco
    .query(
      `INSERT INTO matriculas (aluno_id, professor_id, disciplina_id, semestre, n1, n2, pf, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(alunoId, professorId, disciplinaId, semestre, n1, n2, pf, status);
}

console.log("📝 Cadastrando matrículas...");
//         aluno, professor, disciplina, semestre, n1, n2, pf

// 2025.2 — semestre encerrado
matricular(1, 1, 1, "2025.2", 8.5, 9.0, null);
matricular(2, 1, 1, "2025.2", 6.0, 5.5, 7.0);
matricular(3, 1, 1, "2025.2", 4.0, 3.5, 3.0);
matricular(4, 1, 1, "2025.2", 7.5, 8.0, null);
matricular(5, 4, 4, "2025.2", 9.0, 8.5, null);
matricular(6, 4, 4, "2025.2", 5.0, 4.0, 4.5);
matricular(7, 4, 4, "2025.2", 6.5, 7.5, null);
matricular(8, 4, 4, "2025.2", 3.0, 5.0, 6.5);
matricular(1, 3, 5, "2025.2", 7.0, 7.5, null);
matricular(2, 3, 5, "2025.2", 8.0, 6.0, null);

// 2026.1 — semestre encerrado
matricular(1, 2, 2, "2026.1", 9.5, 9.0, null);
matricular(2, 2, 2, "2026.1", 7.0, 8.0, null);
matricular(3, 2, 2, "2026.1", 6.0, 6.5, 5.5);
matricular(4, 2, 2, "2026.1", 5.5, 4.0, 3.5);
matricular(5, 2, 2, "2026.1", 8.0, 9.5, null);
matricular(6, 1, 3, "2026.1", 7.0, 6.0, 6.0);
matricular(7, 1, 3, "2026.1", 9.0, 9.5, null);
matricular(8, 1, 3, "2026.1", 6.5, 8.0, null);
matricular(3, 1, 3, "2026.1", 8.0, 7.0, null);
matricular(4, 3, 5, "2026.1", 4.5, 5.0, 2.0);

// 2026.2 — semestre em andamento (notas incompletas = "cursando")
matricular(1, 1, 6, "2026.2", 8.0, null, null);
matricular(2, 1, 6, "2026.2", 6.5, null, null);
matricular(5, 1, 6, "2026.2", 9.0, null, null);
matricular(6, 2, 2, "2026.2", 7.5, null, null);
matricular(7, 3, 5, "2026.2", null, null, null);
matricular(8, 2, 2, "2026.2", 5.0, null, null);

console.log("✅ Pronto! Banco populado com dados de exemplo.");
