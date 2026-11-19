const { icon, card, c, tabela } = require("../lib");

const ferramenta = (i, nome, papel, analogia) =>
  `<div class="card vertical" style="gap:12px"><div style="display:flex;gap:18px;align-items:center"><div class="card-ic">${icon(i)}</div><h3 style="font-size:32px">${nome}</h3></div><p>${papel}</p><p style="margin-top:auto"><span class="tag">${analogia}</span></p></div>`;

module.exports = [
  { tipo: "secao", num: "03", titulo: "A stack", sub: "Ferramentas · Analogias · Decisões",
    notas: "'Stack' é o conjunto de ferramentas usadas para construir um sistema." },
  {
    tipo: "conteudo",
    titulo: "Ferramentas do back-end",
    sub: "O que roda no servidor e guarda os dados",
    corpo: `<div class="grade g4" style="height:100%">
      ${ferramenta("LuZap", "Bun", "Roda JavaScript/TypeScript fora do navegador, instala pacotes, executa scripts e já traz o SQLite (<code>bun:sqlite</code>).", "o motor do projeto")}
      ${ferramenta("LuType", "TypeScript", "JavaScript com <b>tipos</b>: avisa erros antes de rodar o código.", "corretor ortográfico")}
      ${ferramenta("LuDatabase", "SQLite", "Banco de dados que fica todo em <b>um único arquivo</b>: <code>academico.sqlite</code>.", "um caderno de dados")}
      ${ferramenta("LuBookText", "Scalar", "Gera a documentação interativa da API a partir da descrição OpenAPI.", "manual de instruções")}
    </div>`,
    notas: "Destaque: com Bun não precisamos de Node + npm + driver de banco separados. Um só programa faz tudo.",
  },
  {
    tipo: "conteudo",
    titulo: "Ferramentas do front-end",
    sub: "O que roda no navegador e desenha as telas",
    corpo: `<div class="grade g4" style="height:100%">
      ${ferramenta("LuPuzzle", "React", "Biblioteca para construir telas a partir de peças (componentes).", "peças de LEGO")}
      ${ferramenta("LuFlame", "Vite", "Roda o site durante o desenvolvimento (com proxy) e gera a versão final.", "o forno")}
      ${ferramenta("LuPalette", "Tailwind CSS", "Estiliza com classes prontas: <code>p-4</code>, <code>flex</code>, <code>text-sm</code>...", "lápis de cor organizados")}
      ${ferramenta("LuSofa", "shadcn/ui", "Componentes prontos e bonitos (botões, tabelas, janelas) copiados para dentro do projeto.", "móveis prontos")}
    </div>`,
    notas: "Também usamos react-router (várias páginas), sonner (avisos) e lucide-react (ícones).",
  },
  {
    tipo: "conteudo",
    titulo: "Decisões de projeto (e por quê)",
    sub: "Cada escolha favorece o entendimento",
    corpo: tabela(["Decisão", "Por quê"], [
      [`API <b>sem framework</b> (só ${c("Bun.serve")})`, "Menos “mágica”: dá para ver exatamente como uma rota funciona"],
      ["<b>SQL puro</b> (sem ORM)", "Você aprende SQL de verdade, que serve para qualquer linguagem"],
      ["<b>SQLite</b>", "Não precisa instalar servidor de banco: é só um arquivo"],
      ["<b>Proxy do Vite</b>", "O site chama /api/... como se a API estivesse no mesmo endereço (sem CORS)"],
      ["<b>Status calculado na API</b>", "A regra fica num lugar só e ninguém “força” um status errado"],
      ["<b>Tipos compartilhados</b>", "API e site sempre concordam sobre o formato dos dados"],
      ["<b>Um formulário para criar e editar</b>", "Recebeu um registro? Edita. Não recebeu? Cria. Menos código repetido"],
    ], "peq"),
    notas: "Outras decisões: fotos em base64 (sem pasta de upload), Scalar por CDN (pacote leve) e nomes em português.",
  },
];
