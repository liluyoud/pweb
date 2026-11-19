const { icon, card, c, terminal, tabela } = require("../lib");

module.exports = [
  { tipo: "secao", num: "10", titulo: "Executando o sistema", sub: "Instalar · Popular · Rodar",
    notas: "Com o projeto pronto (ou baixado), estes são os comandos do dia a dia. Sempre na RAIZ: pweb/academico." },
  {
    tipo: "conteudo",
    titulo: "Rodar em 3 comandos",
    sub: "Na pasta raiz do projeto: <code>pweb/academico</code>",
    corpo: `<div class="colunas c55">
      <div class="pilha">
        <div class="cmd-passo"><span class="numero">1</span>${terminal("bun install", { titulo: "Instalar as dependências" })}</div>
        <div class="cmd-passo"><span class="numero">2</span>${terminal("bun run banco:popular", { titulo: "Dados de exemplo (recomendado)" })}</div>
        <div class="cmd-passo"><span class="numero">3</span>${terminal("bun run dev", { titulo: "Ligar API + site" })}</div>
      </div>
      <div class="pilha">
        ${tabela(["O que", "Endereço"], [
          ["Site (telas)", c("http://localhost:5173")],
          ["API (JSON)", c("http://localhost:3333/api/alunos")],
          ["Documentação", c("http://localhost:3333/api/docs")],
        ], "peq")}
        <div class="aviso">${icon("LuPower")}<div>Para desligar: ${c("Ctrl + C")} no terminal.</div></div>
      </div>
    </div>`,
    notas: "bun run dev usa o --filter para rodar o script dev da API e do site ao mesmo tempo, no mesmo terminal.",
  },
  {
    tipo: "conteudo",
    titulo: "Comandos úteis",
    sub: "Os atalhos definidos no package.json da raiz",
    corpo: `${tabela(["Comando", "O que faz"], [
        [c("bun run dev"), "Liga a API e o site ao mesmo tempo"],
        [c("bun run dev:api"), "Liga só a API (porta 3333)"],
        [c("bun run dev:web"), "Liga só o site (porta 5173)"],
        [c("bun run banco:popular"), "Apaga os dados e coloca dados de exemplo"],
        [c("bun run build"), `Confere os tipos e gera a versão final do site em ${c("apps/web/dist")}`],
      ])}
      <div class="aviso escuro" style="margin-top:28px">${icon("LuEraser")}<div>Quer zerar o banco? Apague ${c("apps/api/academico.sqlite")}. Ele é recriado (vazio) quando a API ligar.</div></div>`,
    notas: "dev:api e dev:web separados ajudam a depurar: cada um em um terminal, com os logs separados.",
  },
  {
    tipo: "conteudo",
    titulo: "Teste final",
    sub: "Confira, com o sistema rodando, se tudo se conecta",
    corpo: `<div class="checklist">
      ${[
        ["LuLayoutDashboard", "O dashboard mostra os números e os gráficos"],
        ["LuCamera", "Cadastre um aluno <b>com foto</b>"],
        ["LuCopy", "Mesmo CPF de novo → aparece um aviso vermelho"],
        ["LuTrash2", "Excluir aluno com matrículas → o sistema não deixa"],
        ["LuClipboardList", "Matrícula com N1 = 5 e N2 = 6 → <span class='tag cinza'>cursando</span>"],
        ["LuPencil", "Edite com PF = 7 → <span class='tag verde'>aprovado</span> (6,25)"],
        ["LuFileText", "Veja o boletim do aluno em <b>Relatórios</b>"],
        ["LuBookText", `Abra ${c("/api/docs")} e teste um endereço pelo Scalar`],
      ].map(([i, t], k) => `<div class="check"><span class="caixa-check">${icon("LuCheck")}</span>${icon(i)}<span>${t}</span></div>`).join("")}
    </div>`,
    notas: "Cada item testa uma camada diferente: UNIQUE e FK no banco, a regra de notas na API, os relatórios com JOIN/GROUP BY.",
  },
];
