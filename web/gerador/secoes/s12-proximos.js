const { icon, card, c } = require("../lib");

const nivel = (cor, titulo, sub, itens) =>
  `<div class="card vertical nivel" style="border-color:${cor}"><div class="nivel-cab" style="background:${cor}">${titulo}<small>${sub}</small></div><ul class="lista peq">${itens
    .map((x) => `<li>${icon("LuSquareCheck")}<span>${x}</span></li>`)
    .join("")}</ul></div>`;

module.exports = [
  { tipo: "secao", num: "12", titulo: "Próximos passos", sub: "Praticar · Evoluir · Criar",
    notas: "Agora é praticar: os exercícios estão em academico/docs/exercicios.md, do mais fácil ao mais difícil." },
  {
    tipo: "conteudo",
    titulo: "Exercícios por nível",
    sub: "Cada um tem uma dica de por onde começar (<code>docs/exercicios.md</code>)",
    corpo: `<div class="grade g3" style="gap:24px;align-items:stretch">
      ${nivel("#1f8a4c", "Nível 1", "aquecimento", [
        `Mudar a média de aprovação para 6 (${c("regras/notas.ts")})`,
        `Mais um aluno e uma disciplina nos dados de exemplo (${c("popular.ts")})`,
        "Titulação “Livre-Docente” no formulário de professor",
      ])}
      ${nivel("#d98a00", "Nível 2", "mexendo em uma camada", [
        "Quantidade de registros abaixo de cada tabela",
        "Busca de alunos também por CPF",
        `Filtro ${c("?disciplina_id=")} nas matrículas (e documentar no Scalar)`,
      ])}
      ${nivel("#ce0058", "Nível 3", "atravessando o sistema", [
        "Campo “data de nascimento” no aluno",
        `Passos: ${c("criar-tabelas.ts")} → tipos → rotas (INSERT e UPDATE) → formulário e tabela`,
        "Repare como o TypeScript aponta o que ajustar",
      ])}
    </div>`,
    notas: "O nível 3 é o melhor resumo da aula: uma mudança atravessa banco, API, tipos e site.",
  },
  {
    tipo: "conteudo",
    titulo: "Roteiro de estudo",
    sub: "Os três projetos da pasta <code>pweb</code> e por onde continuar",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${card({ i: "LuGraduationCap", t: "academico/", d: "O sistema exemplo desta aula.", cls: "compacto" })}
        ${card({ i: "LuUsers", t: "controle_n2/", d: "Sistema exemplo e controle dos grupos e apresentações.", cls: "compacto" })}
        ${card({ i: "LuMonitorPlay", t: "web/", d: "Este site da aula, explicando o Acadêmico passo a passo.", cls: "compacto" })}
      </div>
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuListOrdered")} Ordem de leitura</h3>
        <ol class="ordem">
          <li><b>README.md</b> · visão geral e como rodar</li>
          <li><b>arquitetura.md</b> · como as partes conversam</li>
          <li><b>tutorial.md</b> · construir do zero</li>
          <li><b>docs/</b> · rotas, banco e exercícios</li>
          <li><b>pweb/docs/</b> · glossário, TypeScript, React, SQLite, API e Scalar</li>
        </ol>
      </div>
    </div>`,
    notas: "Lembre: cada pasta do projeto tem o seu próprio README.md. Vá navegando e lendo!",
  },
  {
    tipo: "capa",
    pre: "Programação para Sistemas Web",
    titulo: "Bons estudos<br>e bom código!",
    sub: "Dúvidas? Abra o projeto, rode, quebre, depure e conserte.",
    tags: ["pweb/academico", "pweb/web"],
    notas: "Encerramento. Abra espaço para perguntas e, se houver tempo, comece o exercício 2 (média 6) ao vivo.",
  },
];
