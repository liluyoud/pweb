const { icon, card, selo, c, fluxo } = require("../lib");

module.exports = [
  { tipo: "secao", num: "01", titulo: "O projeto", sub: "Cadastros · Notas · Relatórios",
    notas: "Primeiro entendemos O QUE o sistema faz, antes de ver COMO ele é feito." },
  {
    tipo: "conteudo",
    titulo: "O que o sistema faz",
    sub: "Um mini sistema de controle acadêmico feito para aprender programação web",
    corpo: `
      <div style="margin-bottom:28px">${selo("6 telas + documentação interativa da API", "LuStar")}</div>
      <div class="grade g3" style="gap:22px">
        ${card({ i: "LuLayoutDashboard", t: "Dashboard", d: "Totais, média geral, taxa de aprovação e gráficos simples", cls: "compacto" })}
        ${card({ i: "LuUsers", t: "Alunos", d: "Nome, CPF, matrícula, e-mail, telefone e foto; busca, edição e exclusão", cls: "compacto" })}
        ${card({ i: "LuUserRound", t: "Professores", d: "Nome, CPF, titulação, graduação, e-mail, telefone e foto", cls: "compacto" })}
        ${card({ i: "LuBookMarked", t: "Disciplinas", d: "Nome, curso e carga horária", cls: "compacto" })}
        ${card({ i: "LuClipboardList", t: "Matrículas", d: "Liga aluno + professor + disciplina em um semestre, com notas N1, N2 e PF", cls: "compacto" })}
        ${card({ i: "LuChartBar", t: "Relatórios", d: "Boletim do aluno, desempenho por disciplina e turmas por professor", cls: "compacto" })}
      </div>`,
    notas: "Se possível, mostre o sistema rodando enquanto passa por este slide. A documentação da API (Scalar) é a 7ª 'tela', servida pela própria API em /api/docs.",
  },
  {
    tipo: "conteudo",
    titulo: "Simples de propósito",
    sub: "Nada que atrapalhe o entendimento de como as peças se conectam",
    corpo: `
      <div class="colunas c64">
        <div class="grade g2" style="align-content:start">
          ${card({ i: "LuShieldOff", t: "Sem login e senha", d: "Nenhuma camada de segurança para esconder o essencial", cls: "vertical" })}
          ${card({ i: "LuLanguages", t: "Tudo em português", d: "Variáveis, funções, pastas e comentários: foco na lógica", cls: "vertical" })}
          ${card({ i: "LuFileText", t: "Um README por pasta", d: "Cada pasta explica o que existe nela e por quê", cls: "vertical" })}
          ${card({ i: "LuPuzzle", t: "Peças conectadas", d: "Site, API, banco e tipos: cada um com uma responsabilidade", cls: "vertical" })}
        </div>
        <div class="pilha centro-v">
          <div class="aviso escuro">${icon("LuTriangleAlert")}<div><b style="color:#ff8ab8">Nunca</b> publique um sistema assim na internet: ele não tem login, senha nem permissões.</div></div>
          <div class="aviso">${icon("LuImage")}<div>As fotos ficam <b>dentro do banco</b> como texto (base64). É simples, mas sistemas reais costumam guardar imagens em outro lugar.</div></div>
        </div>
      </div>`,
    notas: "Reforce que a simplicidade é uma decisão didática. Segurança é um tema para outra unidade.",
  },
  {
    tipo: "conteudo",
    titulo: "Regra de aprovação",
    sub: `O status é <b style="color:#a50034">calculado pela API</b>: o usuário digita só as notas`,
    corpo: `
      ${fluxo([
        { i: "LuNotebookPen", t: "Lançar notas", d: "N1 e N2 (de 0 a 10)" },
        { i: "LuScale", t: "Média", d: "(N1 + N2) / 2" },
        { i: "LuCircleCheck", t: "≥ 7", d: "<span class='tag verde'>aprovado</span> direto" },
        { i: "LuFileText", t: "< 7", d: "faz a Prova Final (PF)" },
        { i: "LuTarget", t: "(média + PF) / 2", d: "≥ 5 <span class='tag verde'>aprovado</span><br>< 5 <span class='tag vinho'>reprovado</span>" },
      ])}
      <div class="colunas c55" style="height:auto;margin-top:34px">
        <div class="aviso azul">${icon("LuInfo")}<div>Enquanto falta alguma nota necessária, o status é <span class="tag cinza">cursando</span>.</div></div>
        <div class="aviso">${icon("LuFileCode")}<div>A regra mora em um lugar só: ${c("apps/api/src/regras/notas.ts")}</div></div>
      </div>`,
    notas: "Exemplo: N1 = 5 e N2 = 6 → média 5,5 → cursando até lançar a PF. PF = 7 → (5,5 + 7) / 2 = 6,25 → aprovado.",
  },
];
