const { icon, card, c, codigo, terminal, tabela, fluxo } = require("../lib");

module.exports = [
  { tipo: "secao", num: "11", titulo: "Depurando o sistema", sub: "Encontrar · Entender · Corrigir",
    notas: "Depurar é investigar: descobrir EM QUAL camada o problema está antes de mexer no código." },
  {
    tipo: "conteudo",
    titulo: "Onde está o problema?",
    sub: "Siga o pedido camada por camada: cada uma tem a sua ferramenta",
    corpo: `${fluxo([
        { i: "LuMonitor", t: "Tela (React)", d: "Console e React DevTools" },
        { i: "LuSend", t: "Pedido HTTP", d: "Aba Rede (Network) do F12" },
        { i: "LuServer", t: "API (Bun)", d: "Terminal, console.log e depurador" },
        { i: "LuDatabase", t: "Banco", d: "SQLite Viewer no VS Code" },
      ])}
      <div class="grade g3" style="margin-top:30px;gap:22px">
        ${card({ i: "LuCircleHelp", t: "1 · O pedido saiu?", d: "Se não aparece na aba Rede, o problema está na tela.", cls: "compacto" })}
        ${card({ i: "LuCircleHelp", t: "2 · Qual o status?", d: "4xx/5xx: leia o corpo da resposta e o terminal da API.", cls: "compacto" })}
        ${card({ i: "LuCircleHelp", t: "3 · Gravou certo?", d: "Abra a tabela no banco e confira os dados.", cls: "compacto" })}
      </div>`,
    notas: "Estratégia de 'dividir para conquistar': cada pergunta elimina metade das suspeitas.",
  },
  {
    tipo: "conteudo",
    titulo: "DevTools do navegador (F12)",
    sub: "A principal ferramenta para depurar o site",
    corpo: `<div class="grade g2" style="gap:24px">
      ${card({ i: "LuSquareTerminal", t: "Console", d: `Erros em vermelho (ex.: <i>Invalid hook call</i>) e as mensagens de ${c("console.log(dados)")} que você colocar no código.`, cls: "compacto" })}
      ${card({ i: "LuNetwork", t: "Rede (Network)", d: `Cada pedido para ${c("/api/...")}: método, status, o corpo enviado (Payload) e a resposta (Response).`, cls: "compacto" })}
      ${card({ i: "LuCircleDot", t: "Fontes (Sources)", d: `Pontos de parada (breakpoints) no código .tsx. Ou escreva ${c("debugger;")} na linha: a execução pausa ali com o F12 aberto.`, cls: "compacto" })}
      ${card({ i: "LuListTree", t: "React DevTools", d: "Extensão do navegador: mostra a árvore de componentes, as props e o estado (useState) de cada um.", cls: "compacto" })}
    </div>`,
    notas: "Demonstração: abra a aba Rede, cadastre um aluno com CPF repetido e mostre o POST com status 400 e o corpo { erro: ... }.",
  },
  {
    tipo: "conteudo",
    titulo: "Depurando o site na prática",
    sub: "Coloque pistas no código e observe",
    corpo: `<div class="colunas c55">
      ${codigo(`async function carregarAlunos() {
  const lista = await listarAlunos();
  console.log("alunos recebidos:", lista);
  setAlunos(lista);
}

async function salvar() {
  debugger; // pausa aqui com o F12 aberto
  await salvarAluno(dados, aluno?.id);
}`, { lang: "ts", arquivo: "Exemplo em PaginaAlunos / FormularioAluno" })}
      <div class="pilha">
        ${card({ i: "LuPause", t: "Pausado no debugger", d: "Passe o mouse sobre as variáveis para ver os valores; use os botões para avançar linha a linha.", cls: "compacto" })}
        ${card({ i: "LuStepForward", t: "Passo a passo", d: "<b>F10</b> próxima linha · <b>F11</b> entra na função · <b>F8</b> continua.", cls: "compacto" })}
        <div class="aviso escuro">${icon("LuEraser")}<div>Terminou? <b style="color:#ff8ab8">Apague</b> os ${c("console.log")} e ${c("debugger")} antes de entregar.</div></div>
      </div>
    </div>`,
    notas: "O Vite gera source maps: no navegador você depura o .tsx original, não o JavaScript gerado.",
  },
  {
    tipo: "conteudo",
    titulo: "Depurando a API",
    sub: "O terminal do <code>bun run dev</code> é o “console” do servidor",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${codigo(`export async function criar(req: BunRequest) {
  const dados = (await req.json()) as NovoAluno;
  console.log("POST /api/alunos recebeu:", dados);
  // ...
}`, { lang: "ts", arquivo: "rotas/alunos.ts", cls: "peq" })}
        ${terminal(`cd apps/api
bun --inspect src/index.ts
# abre um link do depurador web do Bun (debug.bun.sh)`, { titulo: "Depurador do Bun", cls: "peq" })}
      </div>
      <div class="pilha">
        ${card({ i: "LuTerminal", t: "Logs no terminal", d: `${c("console.log")} da API aparece no <b>terminal</b>, não no navegador. A função ${c("error()")} do index.ts já faz ${c("console.error")} de toda falha.`, cls: "compacto" })}
        ${card({ i: "LuRefreshCw", t: "--watch", d: "Salvou o arquivo? A API reinicia sozinha: é só repetir o pedido.", cls: "compacto" })}
        ${card({ i: "LuCode", t: "No VS Code", d: `Com a extensão <b>Bun for Visual Studio Code</b>, clique na margem para criar breakpoints e rode a API em modo debug.`, cls: "compacto" })}
      </div>
    </div>`,
    notas: "Dica: rode dev:api e dev:web em terminais separados para não misturar os logs.",
  },
  {
    tipo: "conteudo",
    titulo: "Testando a API isolada",
    sub: "Tire o site da equação: o problema é da API ou da tela?",
    corpo: `<div class="grade g3" style="gap:24px;align-items:stretch">
      ${card({ i: "LuGlobe", t: "Navegador", d: `Pedidos GET: abra ${c("localhost:3333/api/alunos")} e veja o JSON cru.`, cls: "vertical" })}
      ${card({ i: "LuBookText", t: "Scalar", d: `${c("/api/docs")}: escolha o endereço, preencha o corpo e clique em <b>Test Request</b>. Funciona para POST, PUT e DELETE.`, cls: "vertical" })}
      ${card({ i: "LuSquareTerminal", t: "curl / Invoke-RestMethod", d: "Pedidos pelo terminal: bons para repetir o mesmo teste várias vezes.", cls: "vertical" })}
    </div>
    <div class="aviso" style="margin-top:28px">${icon("LuLightbulb")}<div>Funcionou no Scalar mas não no site? O problema está em ${c("servicos/api.ts")} ou na tela. Falhou no Scalar também? Está na API ou no banco.</div></div>`,
    notas: "Esse é o teste mais rápido para separar front-end de back-end.",
  },
  {
    tipo: "conteudo",
    titulo: "Olhando o banco de dados",
    sub: "Confira o que realmente foi gravado",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        ${card({ i: "LuDatabase", t: "SQLite Viewer", d: `Clique em ${c("apps/api/academico.sqlite")} no VS Code e navegue pelas tabelas.`, cls: "compacto" })}
        ${card({ i: "LuSprout", t: "Voltar ao início", d: `${c("bun run banco:popular")} substitui tudo pelos dados de exemplo.`, cls: "compacto" })}
        ${card({ i: "LuEraser", t: "Recriar do zero", d: `Apague o ${c(".sqlite")}: a API cria de novo, vazio, ao ligar.`, cls: "compacto" })}
      </div>
      <div class="pilha">
        <div class="aviso escuro">${icon("LuTriangleAlert")}<div>Mudou uma tabela em ${c("criar-tabelas.ts")} e nada mudou? ${c("CREATE TABLE IF NOT EXISTS")} <b style="color:#ff8ab8">não altera</b> tabela existente. Apague o ${c(".sqlite")} e rode ${c("banco:popular")}.</div></div>
        ${codigo(`-- Teste uma consulta antes de pôr no código
SELECT a.nome, m.n1, m.n2, m.status
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.semestre = '2026.1';`, { lang: "sql", arquivo: "consulta de teste", cls: "peq" })}
      </div>
    </div>`,
    notas: "Em projetos reais, mudanças de estrutura são feitas com migrações, sem apagar os dados.",
  },
  {
    tipo: "conteudo",
    titulo: "Problemas comuns (1/2)",
    sub: "Do academico/tutorial.md: sintoma → solução",
    corpo: tabela(["Problema", "Solução"], [
      [c("bun: command not found"), "Feche e abra o terminal depois de instalar o Bun"],
      ["Site abre, mas as listas ficam vazias e aparece erro", `A API está ligada? Use ${c("bun run dev")} na <b>raiz</b> (liga os dois)`],
      [c("Port 3333 is already in use"), "Já existe uma API rodando em outro terminal: feche-a"],
      [c("Port 5173 is already in use"), `Um ${c("bun run dev")} esquecido em outro terminal: feche com ${c("Ctrl + C")}`],
      [c("Cannot find module '@academico/tipos'"), `Rode ${c("bun install")} na <b>raiz</b> do projeto`],
    ]),
    notas: "Peça para os alunos lerem a coluna Problema em voz alta e tentarem adivinhar a solução antes de mostrar.",
  },
  {
    tipo: "conteudo",
    titulo: "Problemas comuns (2/2)",
    sub: "Página em branco, documentação e banco",
    corpo: tabela(["Problema", "Solução"], [
      ["Site em branco, sem erro no terminal", `F12 → Console. Se aparecer <i>Invalid hook call</i>: confira o ${c("dedupe")} no vite.config.ts, apague ${c("apps/web/node_modules/.vite")} e rode de novo`],
      [`A página ${c("/api/docs")} fica em branco`, "Ela precisa de internet: a interface do Scalar vem de um CDN"],
      ["Criei uma rota e ela não aparece no Scalar", `Documente-a em ${c("src/documentacao/openapi.ts")}`],
      ["Mudei uma tabela e nada mudou", `Apague o ${c(".sqlite")} e rode ${c("bun run banco:popular")}`],
      ["Quero começar o banco do zero", `Apague ${c("apps/api/academico.sqlite")} e rode ${c("bun run banco:popular")}`],
    ], "peq"),
    notas: "Esses problemas aparecem quase sempre nas primeiras aulas. Vale deixar este slide aberto durante a prática.",
  },
];
