const { icon, card, c, codigo, tabela } = require("../lib");

// Caixa de tabela do diagrama ER
function ent(nome, x, y, campos, cls = "") {
  return `<div class="ent ${cls}" style="left:${x}px;top:${y}px"><div class="ent-cab">${icon("LuTable")} ${nome}</div>${campos
    .map(([f, t, k]) => `<div class="ent-l"><span>${k ? `<b class="k ${k.toLowerCase()}">${k}</b>` : ""}${f}</span><em>${t}</em></div>`)
    .join("")}</div>`;
}
const curva = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2;
  return `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" />`;
};

module.exports = [
  { tipo: "secao", num: "05", titulo: "Modelo de banco de dados", sub: "Tabelas · Chaves · Restrições",
    notas: "O banco é um único arquivo SQLite: apps/api/academico.sqlite. As tabelas são criadas em src/banco/criar-tabelas.ts." },
  {
    tipo: "conteudo",
    titulo: "O diagrama do banco",
    sub: "Quatro tabelas: <b style='color:#a50034'>matriculas</b> liga as outras três",
    corpo: `<div class="er">
      <svg class="er-linhas" viewBox="0 0 1440 560">${curva(550, 168, 345, 92)}${curva(890, 204, 1095, 72)}${curva(890, 240, 1095, 402)}</svg>
      ${ent("alunos", 0, 20, [["id", "INTEGER", "PK"], ["nome", "TEXT"], ["cpf", "TEXT único"], ["matricula", "TEXT único"], ["email", "TEXT"], ["telefone", "TEXT"], ["foto", "TEXT (base64)"]])}
      ${ent("matriculas", 550, 60, [["id", "INTEGER", "PK"], ["aluno_id", "INTEGER", "FK"], ["professor_id", "INTEGER", "FK"], ["disciplina_id", "INTEGER", "FK"], ["semestre", "TEXT"], ["n1, n2, pf", "REAL 0 a 10"], ["status", "TEXT"]], "centro")}
      ${ent("professores", 1100, 0, [["id", "INTEGER", "PK"], ["nome", "TEXT"], ["cpf", "TEXT único"], ["titulacao", "TEXT"], ["graduacao", "TEXT"], ["email · telefone", "TEXT"], ["foto", "TEXT (base64)"]])}
      ${ent("disciplinas", 1100, 330, [["id", "INTEGER", "PK"], ["nome", "TEXT"], ["curso", "TEXT"], ["carga_horaria", "INTEGER > 0"]])}
      <div class="er-nota" style="left:550px;top:390px;width:340px">${icon("LuInfo")} Um aluno pode ter <b>várias</b> matrículas; cada matrícula aponta para <b>um</b> aluno, <b>um</b> professor e <b>uma</b> disciplina.</div>
    </div>`,
    notas: "PK = chave primária (o id). FK = chave estrangeira: aponta para a PK de outra tabela. Relação 1 para N entre alunos e matrículas (o mesmo vale para professores e disciplinas).",
  },
  {
    tipo: "conteudo",
    titulo: "Criando a tabela de alunos",
    sub: "O SQL que define colunas, tipos e restrições",
    corpo: `<div class="colunas c55">
      ${codigo(`CREATE TABLE IF NOT EXISTS alunos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  cpf       TEXT NOT NULL UNIQUE,
  matricula TEXT NOT NULL UNIQUE,
  email     TEXT NOT NULL,
  telefone  TEXT NOT NULL DEFAULT '',
  foto      TEXT
)`, { lang: "sql", arquivo: "apps/api/src/banco/criar-tabelas.ts", cls: "peq" })}
      <div class="pilha">
        ${card({ i: "LuKey", t: "PRIMARY KEY AUTOINCREMENT", d: "O banco gera o id sozinho: 1, 2, 3...", cls: "compacto" })}
        ${card({ i: "LuCircleX", t: "NOT NULL", d: "Campo obrigatório: o banco recusa vazio (nulo).", cls: "compacto" })}
        ${card({ i: "LuFingerprint", t: "UNIQUE", d: "Não aceita repetido: dois alunos com o mesmo CPF ou matrícula.", cls: "compacto" })}
        ${card({ i: "LuImage", t: "foto TEXT", d: "Sem NOT NULL: aceita nulo quando não há foto.", cls: "compacto" })}
      </div>
    </div>`,
    notas: "A tabela professores segue o mesmo modelo, com titulacao e graduacao no lugar de matricula.",
  },
  {
    tipo: "conteudo",
    titulo: "Disciplinas e matrículas",
    sub: "Restrições que protegem os dados mesmo se a API errar",
    corpo: `<div class="colunas c64">
      ${codigo(`CREATE TABLE IF NOT EXISTS matriculas (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id      INTEGER NOT NULL REFERENCES alunos(id),
  professor_id  INTEGER NOT NULL REFERENCES professores(id),
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id),
  semestre      TEXT NOT NULL,
  n1  REAL CHECK (n1 BETWEEN 0 AND 10),
  n2  REAL CHECK (n2 BETWEEN 0 AND 10),
  pf  REAL CHECK (pf BETWEEN 0 AND 10),
  status TEXT NOT NULL DEFAULT 'cursando',
  UNIQUE (aluno_id, disciplina_id, semestre)
)`, { lang: "sql", arquivo: "criar-tabelas.ts", cls: "peq" })}
      <div class="pilha">
        ${card({ i: "LuLink", t: "REFERENCES", d: "Chave estrangeira: o aluno_id precisa existir em alunos.", cls: "compacto" })}
        ${card({ i: "LuShieldCheck", t: "CHECK", d: `Notas entre 0 e 10. Em disciplinas: ${c("carga_horaria > 0")}.`, cls: "compacto" })}
        ${card({ i: "LuCopy", t: "UNIQUE (aluno, disciplina, semestre)", d: "Impede matricular o mesmo aluno duas vezes na mesma disciplina e semestre.", cls: "compacto" })}
      </div>
    </div>`,
    notas: "Por causa das FKs, não dá para excluir um aluno que tem matrículas: o banco impede e a API traduz a mensagem.",
  },
  {
    tipo: "conteudo",
    titulo: "Conexão com o SQLite",
    sub: "Sem instalar servidor: o próprio Bun lê e escreve no arquivo",
    corpo: `<div class="colunas c64">
      ${codigo(`import { Database } from "bun:sqlite";
import { criarTabelas } from "./criar-tabelas";

// Sobe duas pastas: salva em apps/api
const caminhoDoArquivo = import.meta.dir + "/../../academico.sqlite";

// Abre o arquivo (e cria, se ainda não existir)
export const banco = new Database(caminhoDoArquivo, { create: true });

// No SQLite a checagem de FKs vem DESLIGADA!
banco.run("PRAGMA foreign_keys = ON");

// Garante que as tabelas existem
criarTabelas(banco);`, { lang: "ts", arquivo: "apps/api/src/banco/conexao.ts", cls: "mini" })}
      <div class="pilha">
        <div class="aviso escuro">${icon("LuTriangleAlert")}<div>Sem ${c("PRAGMA foreign_keys = ON")}, o SQLite aceitaria matrícula de aluno inexistente.</div></div>
        <div class="aviso">${icon("LuRefreshCw")}<div>${c("CREATE TABLE IF NOT EXISTS")} é ignorado se a tabela já existe: por isso roda toda vez que a API liga.</div></div>
        <div class="aviso azul">${icon("LuInfo")}<div>Por isso também: mudou uma tabela? Apague o ${c(".sqlite")} para recriar.</div></div>
      </div>
    </div>`,
    notas: "Mostre o arquivo academico.sqlite aparecendo em apps/api depois de ligar a API.",
  },
  {
    tipo: "conteudo",
    titulo: "Consultas com JOIN e GROUP BY",
    sub: "Juntar tabelas e agrupar linhas direto no SQL",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuLink")} JOIN: matrícula com os nomes</h3>
        ${codigo(`SELECT m.*,
  a.nome AS aluno_nome,
  p.nome AS professor_nome,
  d.nome AS disciplina_nome
FROM matriculas m
JOIN alunos      a ON a.id = m.aluno_id
JOIN professores p ON p.id = m.professor_id
JOIN disciplinas d ON d.id = m.disciplina_id`, { lang: "sql", arquivo: "rotas/matriculas.ts", cls: "peq" })}
      </div>
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuChartBar")} GROUP BY: situação no dashboard</h3>
        ${codigo(`SELECT status AS rotulo,
       COUNT(*) AS valor
FROM matriculas
GROUP BY status`, { lang: "sql", arquivo: "rotas/relatorios.ts", cls: "peq" })}
        ${tabela(["rotulo", "valor"], [["aprovado", "12"], ["cursando", "7"], ["reprovado", "3"]], "peq")}
      </div>
    </div>`,
    notas: "O resultado do JOIN é exatamente o tipo MatriculaDetalhada. Os números da tabela à direita são ilustrativos.",
  },
];
