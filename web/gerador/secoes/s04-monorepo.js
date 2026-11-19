const { icon, card, c, codigo, fluxo, esc } = require("../lib");

// Árvore de pastas estilizada
const arvore = (linhas) =>
  `<div class="arvore">${linhas
    .map(([txt, nota, nivel = 0, tipo = "dir"]) =>
      `<div class="no" style="padding-left:${nivel * 34}px"><span class="no-nome ${tipo}">${icon(tipo === "dir" ? "LuFolder" : "LuFileText", "ic")} ${esc(txt)}</span>${nota ? `<span class="no-nota">${nota}</span>` : ""}</div>`)
    .join("")}</div>`;

module.exports = [
  { tipo: "secao", num: "04", titulo: "Arquitetura e monorepo", sub: "Pastas · Camadas · Workspaces",
    notas: "Arquitetura é a planta da casa: antes de olhar cada tijolo, vale entender onde ficam os cômodos." },
  {
    tipo: "conteudo",
    titulo: "O que é um monorepo",
    sub: "“Mono” = um só: vários projetos morando no mesmo repositório",
    corpo: `
      <div class="colunas c46">
        <div class="pilha centro-v">
          <div class="card vertical destaque" style="text-align:center;align-items:center">
            <div style="font-size:90px;color:#ce0058;line-height:0;margin:20px 0 6px">${icon("LuFolderTree")}</div>
            <h3>Um repositório, três partes</h3>
            <p><code>apps/api</code> · <code>apps/web</code> · <code>packages/tipos</code></p>
          </div>
        </div>
        <div class="pilha">
          ${card({ i: "LuTerminal", t: "Um único bun install", d: "Instala as dependências de todos os projetos de uma vez.", cls: "compacto" })}
          ${card({ i: "LuPlay", t: "Um único bun run dev", d: "Liga a API <b>e</b> o site ao mesmo tempo.", cls: "compacto" })}
          ${card({ i: "LuShieldCheck", t: "Tipos compartilhados", d: "Mudou um campo? API e site “ficam sabendo” na hora, e o TypeScript aponta o que ajustar.", cls: "compacto" })}
        </div>
      </div>`,
    notas: "Repositório é a pasta onde fica o código de um projeto (normalmente versionada com Git).",
  },
  {
    tipo: "conteudo",
    titulo: "A estrutura de pastas",
    sub: "pweb/academico: cada pasta tem o seu próprio README.md",
    corpo: `<div class="colunas c64">
      ${arvore([
        ["academico/", ""],
        ["apps/", "os PROGRAMAS que rodam", 1],
        ["api/", "o servidor: recebe pedidos e fala com o banco (Bun + SQLite)", 2],
        ["web/", "o site: as telas que o usuário vê (React + shadcn)", 2],
        ["packages/", "código COMPARTILHADO", 1],
        ["tipos/", "o formato de cada dado (Aluno, Professor...)", 2],
        ["docs/", "referência das rotas, do banco e exercícios", 1],
        ["package.json", "configura o monorepo e os comandos", 1, "arq"],
        ["README.md", "visão geral e como rodar", 1, "arq"],
        ["arquitetura.md", "como tudo se conecta", 1, "arq"],
        ["tutorial.md", "como construir do zero", 1, "arq"],
      ])}
      <div class="pilha centro-v">
        <div class="aviso">${icon("LuBookOpen")}<div><b>Ordem de leitura:</b> README → arquitetura → tutorial → docs → glossário</div></div>
        <div class="aviso azul">${icon("LuInfo")}<div>O banco ${c("academico.sqlite")} é criado em ${c("apps/api")} e fica fora do Git (${c(".gitignore")}).</div></div>
      </div>
    </div>`,
    notas: "Abra a pasta no VS Code e navegue junto com a turma, lendo os READMEs.",
  },
  {
    tipo: "conteudo",
    titulo: "As três partes e como se ligam",
    sub: "Dois programas que conversam por HTTP e um pacote que os dois importam",
    corpo: `
      <div class="diagrama3">
        <div class="caixa">${icon("LuMonitor")}<h3>apps/web</h3><p>React + shadcn</p><span class="tag">porta 5173</span></div>
        <div class="ligacao"><span>HTTP + JSON</span><div class="setas">${icon("LuArrowRightLeft")}</div><span class="peq">pedidos e respostas</span></div>
        <div class="caixa">${icon("LuServer")}<h3>apps/api</h3><p>Bun.serve + SQLite</p><span class="tag">porta 3333</span></div>
        <div class="caixa tipos">${icon("LuBox")}<h3>packages/tipos</h3><p>Aluno, Professor, Disciplina, Matricula...</p><span class="tag vinho">biblioteca: não roda sozinha</span></div>
        <div class="imp imp-e">web importa os tipos ${icon("LuArrowDownRight")}</div>
        <div class="imp imp-d">${icon("LuArrowDownLeft")} api importa os tipos</div>
      </div>`,
    notas: "packages/tipos não depende de nada; a API depende dos tipos; o site depende dos tipos e da API funcionando.",
  },
  {
    tipo: "conteudo",
    titulo: "O package.json da raiz",
    sub: "Liga o monorepo e cria os atalhos de comando",
    corpo: `<div class="colunas c64">
      ${codigo(`{
  "name": "controle-academico",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --filter \\"@academico/*\\" dev",
    "dev:api": "bun run --filter @academico/api dev",
    "dev:web": "bun run --filter @academico/web dev",
    "banco:popular": "bun run --filter @academico/api banco:popular",
    "build": "bun run --filter @academico/web build"
  }
}`, { lang: "json", arquivo: "academico/package.json", cls: "mini" })}
      <div class="pilha centro-v">
        ${card({ i: "LuBox", t: '"workspaces"', d: "Cada pasta dentro de apps/ e packages/ é um projeto do monorepo.", cls: "compacto" })}
        ${card({ i: "LuTerminal", t: '"scripts"', d: `Atalhos: ${c("bun run dev")} executa o script dev de <b>todos</b> os projetos ${c("@academico/*")}.`, cls: "compacto" })}
        ${card({ i: "LuFilter", t: "--filter", d: `Escolhe em qual projeto rodar. Nos projetos, ${c('"workspace:*"')} pega o pacote daqui.`, cls: "compacto" })}
      </div>
    </div>`,
    notas: "Mostre também apps/api/package.json: dependência \"@academico/tipos\": \"workspace:*\".",
  },
  {
    tipo: "conteudo",
    titulo: "packages/tipos: o cardápio",
    sub: "Um arquivo, index.ts, descreve o formato de cada informação do sistema",
    corpo: `<div class="grade g3" style="gap:22px">
      ${card({ i: "LuUsers", t: "Aluno", d: "id, nome, cpf, matricula, email, telefone, foto", cls: "compacto" })}
      ${card({ i: "LuUserRound", t: "Professor", d: "id, nome, cpf, titulacao, graduacao, email, telefone, foto", cls: "compacto" })}
      ${card({ i: "LuBookMarked", t: "Disciplina", d: "id, nome, curso, carga_horaria", cls: "compacto" })}
      ${card({ i: "LuClipboardList", t: "Matricula", d: "aluno_id, professor_id, disciplina_id, semestre, n1, n2, pf, status", cls: "compacto" })}
      ${card({ i: "LuLink", t: "MatriculaDetalhada", d: `Matricula ${c("&")} nomes do aluno, professor e disciplina (vindos do JOIN)`, cls: "compacto" })}
      ${card({ i: "LuPlus", t: "NovoAluno, NovaMatricula...", d: "Os mesmos tipos <b>sem o id</b>, usados nos formulários", cls: "compacto" })}
    </div>
    <div class="aviso" style="margin-top:24px">${icon("LuChartBar")}<div>Também ficam aqui os tipos do <b>Dashboard</b> e das linhas dos <b>relatórios</b>.</div></div>`,
    notas: "Exercício de demonstração: renomeie um campo do tipo Aluno e veja o TypeScript apontar erros na API e no site.",
  },
  {
    tipo: "conteudo",
    titulo: "apps/api: organizada em camadas",
    sub: "Cada camada só conversa com a de baixo",
    corpo: `<div class="colunas c55">
      <div class="camadas">
        <div class="camada">${icon("LuDoorOpen")}<div><h4>index.ts</h4><p>Porta de entrada: liga o servidor e lista as rotas</p></div></div>
        <div class="camada">${icon("LuRoute")}<div><h4>rotas/</h4><p>Recebem o pedido, validam e devolvem a resposta</p></div></div>
        <div class="camada">${icon("LuScale")}<div><h4>regras/</h4><p>Regras de negócio: o cálculo das notas</p></div></div>
        <div class="camada">${icon("LuDatabase")}<div><h4>banco/</h4><p>Conexão, criação das tabelas e dados de exemplo</p></div></div>
        <div class="camada lado">${icon("LuBookText")}<div><h4>documentacao/</h4><p>Descrição OpenAPI exibida pelo Scalar</p></div></div>
      </div>
      <div class="pilha centro-v">
        ${card({ i: "LuLightbulb", t: "Por que separar?", d: "Cada arquivo fica <b>pequeno</b> e com <b>uma única responsabilidade</b>." })}
        ${card({ i: "LuWrench", t: "Manutenção fácil", d: "Mudou a regra de aprovação? Só ${c}. Mudou uma tabela? banco/ e as rotas dela.".replace("${c}", "<code>regras/</code>") })}
      </div>
    </div>`,
    notas: "Siga o caminho de um pedido: index.ts → rotas/alunos.ts → banco/conexao.ts → resposta JSON.",
  },
  {
    tipo: "conteudo",
    titulo: "apps/web: organização do site",
    sub: "Do ponto de entrada até as peças reaproveitáveis",
    corpo: `<div class="grade g3" style="gap:22px">
      ${card({ i: "LuDoorOpen", t: "main.tsx", d: "Liga o React dentro do index.html", cls: "compacto" })}
      ${card({ i: "LuRoute", t: "App.tsx", d: "Diz qual página aparece em cada endereço", cls: "compacto" })}
      ${card({ i: "LuMonitor", t: "paginas/", d: "As TELAS: uma pasta por assunto", cls: "compacto" })}
      ${card({ i: "LuPuzzle", t: "components/", d: "Peças nossas: menu, foto, botão excluir... <br><code>ui/</code> = peças do shadcn", cls: "compacto" })}
      ${card({ i: "LuPlug", t: "servicos/api.ts", d: "O <b>único</b> lugar que conversa com a API", cls: "compacto" })}
      ${card({ i: "LuWrench", t: "lib/", d: "Funções de ajuda: formatar nota, iniciais do nome...", cls: "compacto" })}
    </div>`,
    notas: "O alias @/ aponta para src/. Por isso os imports são como '@/components/Layout'.",
  },
  {
    tipo: "conteudo",
    titulo: "Como uma tela é montada",
    sub: "Componentes dentro de componentes: a árvore da página de alunos",
    corpo: `<div class="colunas c55">
      ${arvore([
        ["main.tsx", "", 0, "arq"],
        ["App.tsx", "rotas", 1, "arq"],
        ["Layout", "menu lateral + conteúdo", 2, "arq"],
        ["PaginaAlunos", "a página", 3, "arq"],
        ["CabecalhoPagina", "componente nosso", 4, "arq"],
        ["Table, Button, Card", "shadcn (ui/)", 4, "arq"],
        ["FotoPerfil", "componente nosso", 4, "arq"],
        ["FormularioAluno", "janela de cadastro/edição", 4, "arq"],
      ])}
      <div class="pilha centro-v">
        <div class="aviso">${icon("LuLightbulb")}<div><b>PaginaAlunos</b> é a página modelo: professores e disciplinas funcionam do mesmo jeito.</div></div>
        <div class="aviso azul">${icon("LuPlus")}<div>Página nova = componente em ${c("paginas/")} + uma ${c("<Route>")} no App.tsx + um item no menu do Layout.</div></div>
      </div>
    </div>`,
    notas: "Use as React DevTools (extensão do navegador) para mostrar essa árvore ao vivo.",
  },
];
