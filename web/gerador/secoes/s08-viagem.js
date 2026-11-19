const { icon, c } = require("../lib");

const passo = (n, onde, oque, i) =>
  `<div class="vp"><div class="vp-n">${n}</div><div class="vp-ic">${icon(i)}</div><div><h4>${onde}</h4><p>${oque}</p></div></div>`;

module.exports = [
  { tipo: "secao", num: "08", titulo: "A viagem de um clique", sub: "Formulário · API · Banco",
    notas: "Juntamos tudo: o que acontece, camada por camada, quando o usuário cadastra um aluno." },
  {
    tipo: "conteudo",
    titulo: "Cadastrar um aluno em 10 passos",
    sub: "Do botão “Salvar” até a tabela redesenhada",
    corpo: `<div class="viagem">
      ${passo(1, "Usuário", "Preenche o formulário e clica em “Salvar”", "LuMousePointerClick")}
      ${passo(2, "FormularioAluno.tsx", `Chama ${c("salvarAluno(dados)")}`, "LuAppWindow")}
      ${passo(3, "servicos/api.ts", `${c("fetch")} POST /api/alunos com o corpo em JSON`, "LuSend")}
      ${passo(4, "Vite (proxy)", "Repassa o pedido de :5173 para :3333", "LuArrowRightLeft")}
      ${passo(5, "api/src/index.ts", `“POST /api/alunos” é com ${c("alunos.criar")}`, "LuMap")}
      ${passo(6, "rotas/alunos.ts", `Confere os obrigatórios e executa ${c("INSERT INTO alunos")}`, "LuRoute")}
      ${passo(7, "SQLite", `Grava no arquivo ${c("academico.sqlite")}`, "LuDatabase")}
      ${passo(8, "rotas/alunos.ts", "Devolve o aluno criado com status 201", "LuCircleCheck")}
      ${passo(9, "FormularioAluno.tsx", "Mostra “Aluno cadastrado.” e fecha a janela", "LuBell")}
      ${passo(10, "PaginaAlunos.tsx", "Busca a lista de novo e a tabela é redesenhada", "LuRefreshCw")}
    </div>`,
    notas: "Faça a demonstração com a aba Rede (Network) do navegador aberta: o pedido POST e a resposta 201 aparecem lá.",
  },
  {
    tipo: "conteudo",
    titulo: "E quando dá erro?",
    sub: "Exemplo: tentar cadastrar um aluno com um CPF que já existe",
    corpo: `<div class="erro-trilha">
      <div class="et"><div class="et-ic">${icon("LuDatabase")}</div><h4>SQLite recusa</h4><p>A regra ${c("UNIQUE")} da coluna cpf dispara: <i>UNIQUE constraint failed</i></p></div>
      <div class="et"><div class="et-ic">${icon("LuShieldCheck")}</div><h4>error() captura</h4><p>A função ${c("error")} do index.ts pega o erro e chama ${c("traduzirErroDoBanco")}</p></div>
      <div class="et"><div class="et-ic">${icon("LuSend")}</div><h4>API responde 400</h4><p>${c('{ "erro": "Já existe um cadastro com esses dados..." }')}</p></div>
      <div class="et"><div class="et-ic">${icon("LuCircleAlert")}</div><h4>Site avisa</h4><p>${c("servicos/api.ts")} vê ${c("!resposta.ok")} e mostra o <b>aviso vermelho</b></p></div>
    </div>
    <div class="toast-demo">${icon("LuCircleX")}<span>Já existe um cadastro com esses dados (CPF, matrícula, ou o aluno já está nesta disciplina neste semestre).</span></div>`,
    notas: "O mesmo caminho vale para excluir um aluno com matrículas (FOREIGN KEY) e para nota fora de 0 a 10 (CHECK).",
  },
];
