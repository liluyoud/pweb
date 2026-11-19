const { icon, card, c, codigo, terminal, tabela } = require("../lib");

const etapa = (n, t, d, i) =>
  `<div class="etapa"><div class="etapa-n">${n}</div><div class="etapa-ic">${icon(i)}</div><h4>${t}</h4><p>${d}</p></div>`;

const teste = (txt) => `<div class="aviso teste">${icon("LuCircleCheck")}<div><b>Teste:</b> ${txt}</div></div>`;

module.exports = [
  { tipo: "secao", num: "09", titulo: "Criando do zero", sub: "Etapas · Comandos · Testes",
    notas: "Esta seção segue o academico/tutorial.md. Os arquivos de configuração aparecem completos; os de código são copiados (ou, melhor, digitados) a partir do projeto de referência." },
  {
    tipo: "conteudo",
    titulo: "As 8 etapas",
    sub: "Cada etapa termina com um <b style='color:#a50034'>teste</b> antes de seguir",
    corpo: `<div class="etapas">
      ${etapa(0, "Preparar", "Bun e VS Code", "LuLaptop")}
      ${etapa(1, "Monorepo", "pastas e package.json", "LuFolderTree")}
      ${etapa(2, "Tipos", "packages/tipos", "LuBox")}
      ${etapa(3, "API", "Bun + SQLite + Scalar", "LuServer")}
      ${etapa(4, "Site", "Vite + React + Tailwind", "LuMonitor")}
      ${etapa(5, "shadcn/ui", "componentes prontos", "LuSofa")}
      ${etapa(6, "Código do site", "serviços, peças, páginas", "LuFileCode")}
      ${etapa(7, "Rodar tudo", "teste final", "LuRocket")}
    </div>
    <div class="aviso azul" style="margin-top:34px">${icon("LuTerminal")}<div>Os comandos funcionam no <b>PowerShell</b> (Windows) e no <b>terminal</b> (Linux/macOS). Quando forem diferentes, as duas versões aparecem.</div></div>`,
    notas: "Dica didática do tutorial: em cada camada, comece só com Alunos, teste, e depois acrescente o resto.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 0: preparar o computador",
    sub: "Instale o Bun uma única vez e confira a versão",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${terminal(`# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"`, { titulo: "PowerShell", lang: "bash" })}
        ${terminal(`# Linux / macOS
curl -fsSL https://bun.sh/install | bash`, { titulo: "Terminal", lang: "bash" })}
        ${terminal(`bun --version`, { titulo: "Feche e abra o terminal, depois:", lang: "bash" })}
      </div>
      <div class="pilha">
        ${card({ i: "LuCode", t: "VS Code", d: "Editor recomendado (code.visualstudio.com)", cls: "compacto" })}
        ${card({ i: "LuPalette", t: "Tailwind CSS IntelliSense", d: "Sugere as classes do Tailwind enquanto digita", cls: "compacto" })}
        ${card({ i: "LuDatabase", t: "SQLite Viewer", d: "Abre o arquivo do banco e mostra as tabelas", cls: "compacto" })}
        ${teste(`${c("bun --version")} mostra um número (ex.: 1.3.12).`)}
      </div>
    </div>`,
    notas: "Se aparecer 'bun: command not found', é só fechar e abrir o terminal.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapas 1 e 2: monorepo e tipos",
    sub: "A casa e o cardápio, antes de qualquer programa",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuFolderTree")} Etapa 1: o monorepo</h3>
        <ul class="lista peq">
          <li>${icon("LuFolder")}<span>Em ${c("pweb/academico")}, crie ${c("apps/")}, ${c("packages/")} e ${c("docs/")}</span></li>
          <li>${icon("LuFileCode")}<span>Crie o ${c("package.json")} da raiz com <b>workspaces</b> e <b>scripts</b> (seção 04)</span></li>
          <li>${icon("LuEyeOff")}<span>O ${c(".gitignore")} em ${c("pweb")} ignora ${c("node_modules")}, ${c("dist")} e ${c("*.sqlite")}</span></li>
          <li>${icon("LuGitBranch")}<span>(Opcional) ${c("git init")} na pasta ${c("pweb")}</span></li>
        </ul>
      </div>
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuBox")} Etapa 2: o pacote de tipos</h3>
        ${codigo(`{
  "name": "@academico/tipos",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "types": "index.ts"
}`, { lang: "json", arquivo: "packages/tipos/package.json", cls: "peq" })}
        ${teste(`${c("packages/tipos/index.ts")} existe e não tem sublinhado vermelho.`)}
      </div>
    </div>`,
    notas: "O nome @academico/tipos é como os outros projetos vão importar este pacote.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 3: a API",
    sub: "Pastas, configuração e a ordem de criação dos arquivos",
    corpo: `<div class="colunas c46">
      ${codigo(`{
  "name": "@academico/api",
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "banco:popular": "bun src/banco/popular.ts"
  },
  "dependencies": {
    "@academico/tipos": "workspace:*"
  },
  "devDependencies": { "@types/bun": "latest" }
}`, { lang: "json", arquivo: "apps/api/package.json", cls: "mini" })}
      ${tabela(["#", "Arquivo", "Papel"], [
        ["1", c("banco/criar-tabelas.ts"), "CREATE TABLE das 4 tabelas"],
        ["2", c("banco/conexao.ts"), "Abre o .sqlite e cria as tabelas"],
        ["3", c("regras/notas.ts"), "calcularStatus"],
        ["4", c("rotas/ajudantes.ts"), "erro, validação, tradução"],
        ["5", c("rotas/alunos.ts"), "<b>O modelo:</b> leia com calma"],
        ["6", c("rotas/*.ts"), "professores, disciplinas, matrículas, relatórios"],
        ["7", c("index.ts"), "Liga o servidor na 3333"],
        ["8", c("banco/popular.ts"), "Dados de exemplo"],
      ], "peq")}
    </div>`,
    notas: "bun --watch reinicia a API sozinho sempre que você salvar um arquivo. @types/bun ensina ao TypeScript as funções do Bun. Depois do package.json: bun install na raiz.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 3: testando a API",
    sub: "Antes de existir o site, a API já funciona sozinha",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${terminal(`bun run banco:popular
bun run dev:api
# ✅ API rodando em http://localhost:3333/api`, { titulo: "Na raiz do projeto" })}
        ${tabela(["Abra no navegador", "Resultado"], [
          [c("localhost:3333/api/alunos"), "lista em JSON"],
          [c("localhost:3333/api/dashboard"), "números do dashboard"],
          [c("localhost:3333/api/xyz"), `${c('{"erro":"Rota não encontrada."}')}`],
        ], "peq")}
      </div>
      <div class="pilha">
        ${terminal(`curl -X POST http://localhost:3333/api/disciplinas \\
  -H "Content-Type: application/json" \\
  -d '{"nome":"Redes","curso":"Computação","carga_horaria":60}'`, { titulo: "Outro terminal · Linux / macOS / Git Bash", cls: "mini" })}
        ${terminal(`Invoke-RestMethod -Method Post \`
  -Uri http://localhost:3333/api/disciplinas \`
  -ContentType "application/json" \`
  -Body '{"nome":"Redes","curso":"Computação","carga_horaria":60}'`, { titulo: "Outro terminal · Windows PowerShell", cls: "mini" })}
      </div>
    </div>`,
    notas: "Deixe a API ligada e use OUTRO terminal para o curl. Ctrl + C desliga a API.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 3.11: documentação com Scalar",
    sub: "Um pacote, dois arquivos e duas linhas no index.ts",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${terminal(`cd apps/api
bun add @scalar/client-side-rendering
cd ../..
mkdir apps/api/src/documentacao`, { titulo: "Instalar e criar a pasta" })}
        ${tabela(["Arquivo", "O que faz"], [
          [c("documentacao/openapi.ts"), "A descrição da API (OpenAPI)"],
          [c("rotas/documentacao.ts"), "Entrega o JSON e a página do Scalar"],
        ], "peq")}
      </div>
      <div class="pilha">
        ${codigo(`import * as documentacao from "./rotas/documentacao";

// dentro de routes:
"/api/openapi.json": { GET: documentacao.openapi },
"/api/docs": { GET: documentacao.paginaDocumentacao },`, { lang: "ts", arquivo: "apps/api/src/index.ts", cls: "peq" })}
        ${teste(`abra ${c("localhost:3333/api/docs")} → Alunos → Listar alunos → <b>Test Request</b>.`)}
      </div>
    </div>`,
    notas: "A página do Scalar precisa de internet, pois a interface é baixada de um CDN.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 4: o site com Vite",
    sub: "Criar o projeto React, limpar o exemplo e instalar o essencial",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${terminal(`cd apps
bun create vite web --template react-ts --no-interactive
cd ..`, { titulo: "4.1 · Criar o projeto", cls: "peq" })}
        ${terminal(`Remove-Item -Recurse -Force apps/web/src/App.css, apps/web/src/assets, \`
  apps/web/public/icons.svg, apps/web/README.md, apps/web/.oxlintrc.json`, { titulo: "4.2 · Limpar o exemplo (PowerShell)", cls: "mini" })}
        ${terminal(`cd apps/web
bun add tailwindcss @tailwindcss/vite react-router`, { titulo: "4.4 · Tailwind e React Router", cls: "peq" })}
      </div>
      <div class="pilha">
        <h3 class="mini-tit">${icon("LuPencil")} 4.3 · Ajustar apps/web/package.json</h3>
        <ul class="lista peq">
          <li>${icon("LuTag")}<span>Nome: ${c('"@academico/web"')}</span></li>
          <li>${icon("LuTrash2")}<span>Remover o script ${c("lint")} e a dependência ${c("oxlint")}</span></li>
          <li>${icon("LuLink")}<span>Acrescentar ${c('"@academico/tipos": "workspace:*"')}</span></li>
          <li>${icon("LuTerminal")}<span>Rodar ${c("bun install")} na raiz</span></li>
        </ul>
        <div class="aviso azul">${icon("LuPalette")}<div>Em ${c("src/index.css")}, troque tudo por ${c('@import "tailwindcss";')}</div></div>
      </div>
    </div>`,
    notas: "No Linux/macOS a limpeza é: rm -rf apps/web/src/App.css apps/web/src/assets apps/web/public/icons.svg apps/web/README.md apps/web/.oxlintrc.json",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 4: vite.config.ts",
    sub: "Plugins, atalho @/, porta fixa e o proxy para a API",
    corpo: `<div class="colunas c64">
      ${codigo(`export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Atalho: "@/" significa "a pasta src/"
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
    // Uma única cópia do React (evita página em branco)
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    strictPort: true, // ocupada? para com aviso
    // Tudo que começar com /api vai para a API
    proxy: { "/api": "http://localhost:3333" },
  },
});`, { lang: "ts", arquivo: "apps/web/vite.config.ts", cls: "peq" })}
      <div class="pilha">
        ${card({ i: "LuLink", t: "Atalho @/", d: `Configure também em ${c("tsconfig.json")} e ${c("tsconfig.app.json")}: ${c('"paths": { "@/*": ["./src/*"] }')}`, cls: "compacto" })}
        ${teste(`${c("bun run dev")} dentro de ${c("apps/web")} abre ${c("localhost:5173")} sem erros.`)}
      </div>
    </div>`,
    notas: "O dedupe resolve o erro 'Invalid hook call' que aparece quando há duas cópias do React no monorepo.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 5: shadcn/ui",
    sub: "O shadcn <b style='color:#a50034'>copia</b> o código dos componentes para dentro do projeto",
    corpo: `<div class="pilha">
      ${terminal(`bunx --bun shadcn@latest init -t vite -b radix -p nova --no-monorepo`, { titulo: "5.1 · Inicializar (dentro de apps/web)" })}
      ${terminal(`bunx --bun shadcn@latest add card table dialog alert-dialog input label select badge avatar tabs sonner separator`, { titulo: "5.2 · Adicionar os componentes usados", cls: "peq" })}
      <div class="grade g4" style="gap:18px">
        ${card({ i: "LuFlame", t: "-t vite", d: "Projeto usa Vite", cls: "compacto vertical" })}
        ${card({ i: "LuLayers", t: "-b radix", d: "Base: Radix UI", cls: "compacto vertical" })}
        ${card({ i: "LuPalette", t: "-p nova", d: "Estilo visual Nova", cls: "compacto vertical" })}
        ${card({ i: "LuFolder", t: "--no-monorepo", d: "Cuida só do site", cls: "compacto vertical" })}
      </div>
    </div>`,
    notas: "O init cria components.json, src/lib/utils.ts, components/ui/button.tsx e atualiza as cores do tema no index.css. Depois: cd ../.. para voltar à raiz.",
  },
  {
    tipo: "conteudo",
    titulo: "Etapa 6: o código do site",
    sub: "Do mais simples para o mais completo",
    corpo: `${fluxo_etapa6()}
    <div class="aviso" style="margin-top:30px">${icon("LuLightbulb")}<div><b>Dica didática:</b> comece só com <b>Layout + Alunos</b>. No App.tsx, deixe só a rota ${c("/alunos")}. Funcionou? Acrescente as outras.</div></div>`,
    notas: "As páginas de professores e disciplinas são quase cópias da de alunos: é proposital, para cada página ser fácil de ler sozinha.",
  },
];

function fluxo_etapa6() {
  const col = (i, t, itens) =>
    `<div class="card vertical compacto" style="gap:10px"><div style="display:flex;gap:14px;align-items:center"><div class="card-ic" style="font-size:44px">${icon(i)}</div><h3>${t}</h3></div><ul class="lista-arq">${itens.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
  return `<div class="grade g4" style="gap:20px;align-items:stretch">
    ${col("LuFoundation" in require("react-icons/lu") ? "LuFoundation" : "LuLayers", "6.1 Base", ["index.html", "public/favicon.svg", "servicos/api.ts", "lib/formatar.ts"])}
    ${col("LuPuzzle", "6.2 Componentes", ["Layout", "CabecalhoPagina", "Campo", "FotoPerfil · CampoFoto", "SeloStatus", "BotaoExcluir", "GraficoBarras"])}
    ${col("LuMonitor", "6.3 Páginas", ["alunos/ (o modelo)", "professores/", "disciplinas/", "matriculas/", "dashboard/", "relatorios/"])}
    ${col("LuPlug", "6.4 Juntar", ["App.tsx", "main.tsx"])}
  </div>`;
}
