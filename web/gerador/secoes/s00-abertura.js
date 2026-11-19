const { icon } = require("../lib");

const agenda = [
  ["01", "O projeto", "LuGraduationCap"],
  ["02", "Conceitos fundamentais", "LuBookOpen"],
  ["03", "A stack", "LuLayers"],
  ["04", "Arquitetura e monorepo", "LuFolderTree"],
  ["05", "Banco de dados", "LuDatabase"],
  ["06", "A API por dentro", "LuServer"],
  ["07", "O site por dentro", "LuMonitor"],
  ["08", "A viagem de um clique", "LuRoute"],
  ["09", "Criando do zero", "LuHammer"],
  ["10", "Executando", "LuPlay"],
  ["11", "Depurando", "LuBug"],
  ["12", "Próximos passos", "LuRocket"],
];

module.exports = [
  {
    tipo: "capa",
    pre: "Programação para Sistemas Web",
    titulo: "Controle<br>Acadêmico",
    sub: "Um sistema web completo, explicado passo a passo: do conceito à depuração.",
    tags: ["Bun", "TypeScript", "React", "shadcn/ui", "SQLite"],
    notas:
      "Apresente o objetivo da aula: entender como as peças de um sistema web se conectam usando o projeto <b>academico</b> como exemplo. O código está todo em português e cada pasta tem um README.",
  },
  {
    tipo: "conteudo",
    titulo: "O que vamos ver",
    sub: "12 seções, do conceito ao sistema funcionando (e depurado)",
    corpo: `<div class="grade g4" style="gap:20px">${agenda
      .map(
        ([n, t, i]) =>
          `<div class="card compacto" style="align-items:center;padding:20px 22px;min-height:168px"><div class="card-ic" style="font-size:42px">${icon(i)}</div><div class="card-tx"><div style="font-size:19px;font-weight:700;color:#ce0058;letter-spacing:2px">${n}</div><h3 style="font-size:25px">${t}</h3></div></div>`
      )
      .join("")}</div>`,
    notas:
      "Mapa da aula. As seções 02 a 08 explicam o sistema pronto; a 09 mostra como construí-lo do zero; 10 e 11 tratam de executar e depurar.",
  },
];
