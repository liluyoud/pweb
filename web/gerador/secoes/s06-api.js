const { icon, card, c, codigo, tabela, fluxo } = require("../lib");

module.exports = [
  { tipo: "secao", num: "06", titulo: "A API por dentro", sub: "Rotas · Regras · Documentação",
    notas: "A API é feita só com Bun.serve, sem framework: dá para ver exatamente como cada rota funciona." },
  {
    tipo: "conteudo",
    titulo: "index.ts: o mapa de rotas",
    sub: "O “cardápio” da API: lista tudo o que ela sabe fazer",
    corpo: `<div class="colunas c64">
      ${codigo(`Bun.serve({
  port: 3333,
  routes: {
    "/api/alunos":     { GET: alunos.listar, POST: alunos.criar },
    "/api/alunos/:id": { GET: alunos.buscar,
                         PUT: alunos.atualizar,
                         DELETE: alunos.excluir },
    // ... professores, disciplinas, matriculas
    "/api/dashboard":  { GET: relatorios.dashboard },
    "/api/docs":       { GET: documentacao.paginaDocumentacao },
  },
  // Endereço que não existe no mapa
  fetch() { return erro("Rota não encontrada.", 404); },
  // Alguma rota "quebrou": a API não cai
  error(problema) {
    console.error(problema);
    return erro(traduzirErroDoBanco(problema.message));
  },
});`, { lang: "ts", arquivo: "apps/api/src/index.ts (resumido)", cls: "mini" })}
      <div class="pilha">
        ${card({ i: "LuMap", t: "routes", d: `Liga cada endereço + método a uma função. ${c(":id")} é a parte variável.`, cls: "compacto" })}
        ${card({ i: "LuCircleX", t: "fetch", d: "Resposta padrão: 404 para rotas desconhecidas.", cls: "compacto" })}
        ${card({ i: "LuShieldCheck", t: "error", d: "Captura qualquer erro, mostra no terminal e responde com mensagem amigável.", cls: "compacto" })}
      </div>
    </div>`,
    notas: "O 'receituário' de cada item fica na pasta rotas/. O index.ts só diz quem atende cada pedido.",
  },
  {
    tipo: "conteudo",
    titulo: "Os endpoints da API",
    sub: "Padrão REST repetido para os quatro cadastros",
    corpo: `<div class="colunas c55">
      ${tabela(["Método", "Endereço", "Ação"], [
        [`<span class="tag azul">GET</span>`, c("/api/alunos"), "Lista todos"],
        [`<span class="tag azul">GET</span>`, c("/api/alunos/:id"), "Busca um"],
        [`<span class="tag verde">POST</span>`, c("/api/alunos"), "Cria"],
        [`<span class="tag">PUT</span>`, c("/api/alunos/:id"), "Atualiza"],
        [`<span class="tag vinho">DELETE</span>`, c("/api/alunos/:id"), "Exclui"],
      ], "peq")}
      <div class="pilha">
        ${card({ i: "LuRepeat", t: "Mesmo padrão", d: `${c("professores")}, ${c("disciplinas")} e ${c("matriculas")}`, cls: "compacto" })}
        ${card({ i: "LuChartBar", t: "Relatórios (só leitura)", d: `${c("GET /api/dashboard")}<br>${c("GET /api/relatorios/disciplinas")}<br>${c("GET /api/relatorios/professores")}`, cls: "compacto" })}
        ${card({ i: "LuFilter", t: "Filtros", d: `${c("/api/matriculas?aluno_id=3")} ou ${c("?semestre=2026.1")}`, cls: "compacto" })}
      </div>
    </div>`,
    notas: "Referência completa: academico/docs/api.md e a página do Scalar em /api/docs.",
  },
  {
    tipo: "conteudo",
    titulo: "Anatomia de uma rota",
    sub: "<code>alunos.criar</code>: o modelo que todas as rotas de cadastro seguem",
    corpo: `<div class="colunas c73">
      ${codigo(`export async function criar(req: BunRequest) {
  // 1. Ler o corpo do pedido (dados do formulário)
  const dados = (await req.json()) as NovoAluno;
  // 2. Validar os campos obrigatórios
  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) return erro(problema);
  // 3. Gravar: os "?" são preenchidos em ordem
  const resultado = banco
    .query(\`INSERT INTO alunos
            (nome, cpf, matricula, email, telefone, foto)
            VALUES (?, ?, ?, ?, ?, ?)\`)
    .run(dados.nome, dados.cpf, dados.matricula,
         dados.email, dados.telefone ?? "", dados.foto ?? null);
  // 4. Responder com o aluno criado (201)
  const alunoCriado = banco
    .query("SELECT * FROM alunos WHERE id = ?")
    .get(resultado.lastInsertRowid);
  return Response.json(alunoCriado, { status: 201 });
}`, { lang: "ts", arquivo: "apps/api/src/rotas/alunos.ts", cls: "mini" })}
      <div class="pilha">
        ${card({ i: "LuDatabase", t: "bun:sqlite", d: `${c(".all()")} todas as linhas · ${c(".get()")} uma linha · ${c(".run()")} INSERT, UPDATE, DELETE`, cls: "compacto" })}
        <div class="aviso escuro">${icon("LuShieldAlert")}<div>Nunca junte valores no texto do SQL: use ${c("?")}. Concatenar abre brecha para <b style="color:#ff8ab8">SQL Injection</b>.</div></div>
        ${card({ i: "LuHash", t: "lastInsertRowid", d: "O id que o banco acabou de gerar.", cls: "compacto" })}
      </div>
    </div>`,
    notas: "Peça para a turma comparar criar e atualizar: muda o SQL (UPDATE ... WHERE id = ?) e o teste de 'changes === 0' que devolve 404.",
  },
  {
    tipo: "conteudo",
    titulo: "Ajudantes e erros amigáveis",
    sub: "Pequenas funções reaproveitadas por todas as rotas (<code>rotas/ajudantes.ts</code>)",
    corpo: `<div class="grade g2" style="gap:22px">
      ${card({ i: "LuMessageSquareWarning", t: "erro(mensagem, status = 400)", d: `Devolve ${c('{ "erro": "mensagem" }')} com o status certo.`, cls: "compacto" })}
      ${card({ i: "LuListChecks", t: "verificarObrigatorios(dados, campos)", d: "Devolve a mensagem do primeiro campo vazio, ou null se estiver tudo certo.", cls: "compacto" })}
      ${card({ i: "LuHash", t: "paraNota(valor)", d: "Campo vazio vira null (nota ainda não lançada); o resto vira número.", cls: "compacto" })}
      ${card({ i: "LuLanguages", t: "traduzirErroDoBanco(msg)", d: "Troca as mensagens técnicas do SQLite, em inglês, por frases que o usuário entende.", cls: "compacto" })}
    </div>
    ${tabela(["O SQLite diz…", "A API responde…"], [
      [c("UNIQUE constraint failed"), "Já existe um cadastro com esses dados (CPF, matrícula...)"],
      [c("FOREIGN KEY constraint failed"), "Este registro está ligado a uma ou mais matrículas"],
      [c("CHECK constraint failed"), "Notas entre 0 e 10 e carga horária maior que zero"],
    ], "peq").replace('class="tabela', 'style="margin-top:24px" class="tabela')}`,
    notas: "É assim que o 'erro técnico' do banco vira o aviso vermelho que o usuário vê no site.",
  },
  {
    tipo: "conteudo",
    titulo: "A regra de negócio no código",
    sub: "<code>calcularStatus(n1, n2, pf)</code> em <code>regras/notas.ts</code>",
    corpo: `<div class="colunas c64">
      ${codigo(`export const MEDIA_PARA_APROVAR = 7;
export const MEDIA_FINAL_PARA_APROVAR = 5;

export function calcularStatus(n1, n2, pf) {
  if (n1 === null || n2 === null) return "cursando";

  const media = (n1 + n2) / 2;
  if (media >= MEDIA_PARA_APROVAR) return "aprovado";

  // Não passou direto: depende da prova final
  if (pf === null) return "cursando";

  const mediaFinal = (media + pf) / 2;
  if (mediaFinal >= MEDIA_FINAL_PARA_APROVAR) return "aprovado";

  return "reprovado";
}`, { lang: "ts", arquivo: "apps/api/src/regras/notas.ts (sem os tipos)", cls: "peq" })}
      <div class="pilha">
        ${tabela(["N1", "N2", "PF", "Status"], [
          ["8", "7", "–", `<span class="tag verde">aprovado</span>`],
          ["5", "6", "–", `<span class="tag cinza">cursando</span>`],
          ["5", "6", "7", `<span class="tag verde">aprovado</span> (6,25)`],
          ["3", "4", "5", `<span class="tag vinho">reprovado</span> (4,25)`],
        ], "peq")}
        <div class="aviso">${icon("LuLightbulb")}<div>As rotas de matrícula chamam esta função no <b>criar</b> e no <b>atualizar</b>. Ninguém digita o status.</div></div>
      </div>
    </div>`,
    notas: "Exercício nível 1: mudar a média para 6. Só este arquivo muda (e o texto de ajuda do formulário).",
  },
  {
    tipo: "conteudo",
    titulo: "Documentação com Scalar",
    sub: "Abra <code>http://localhost:3333/api/docs</code> e teste a API sem escrever código",
    corpo: `${fluxo([
        { i: "LuFileCode", t: "documentacao/openapi.ts", d: "Descrição escrita à mão no padrão OpenAPI" },
        { i: "LuFileJson", t: "GET /api/openapi.json", d: "Rota que devolve a descrição em JSON" },
        { i: "LuBookText", t: "GET /api/docs", d: "HTML que carrega o Scalar (CDN) e lê o JSON" },
        { i: "LuMousePointerClick", t: "Test Request", d: "Alunos → Listar alunos → a lista aparece" },
      ])}
      <div class="grade g2" style="margin-top:30px">
        <div class="aviso">${icon("LuWifiOff")}<div>A página precisa de <b>internet</b>: a interface do Scalar vem de um CDN.</div></div>
        <div class="aviso azul">${icon("LuPlus")}<div>Rota nova? Documente em ${c("openapi.ts")}, senão ela não aparece no Scalar.</div></div>
      </div>`,
    notas: "Demonstre um POST pelo Scalar e depois mostre o registro no site. Guia completo: pweb/docs/scalar.md.",
  },
];
