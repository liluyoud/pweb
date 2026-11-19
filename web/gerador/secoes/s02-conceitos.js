const { icon, card, selo, c, fluxo, tabela, codigo, terminal } = require("../lib");

module.exports = [
  { tipo: "secao", num: "02", titulo: "Conceitos fundamentais", sub: "Glossário · Web · Dados",
    notas: "Esta seção usa o glossário compartilhado (pweb/docs/glossario.md) como referência. Cada slide traz um ou dois termos com um exemplo do próprio projeto." },

  {
    tipo: "conteudo",
    titulo: "Cliente e servidor",
    sub: "Quase todo sistema web é dividido em duas partes: a analogia do restaurante",
    corpo: `
      ${fluxo([
        { i: "LuUsers", t: "Usuário", d: "O cliente no salão faz o pedido: “quero ver os alunos”" },
        { i: "LuMonitor", t: "Site (web)", d: "O <b>garçom</b>: anota e leva o pedido. Não cozinha!" },
        { i: "LuChefHat", t: "API (Bun)", d: "A <b>cozinha</b>: prepara a resposta" },
        { i: "LuDatabase", t: "Banco SQLite", d: "A <b>despensa</b>: onde tudo fica guardado" },
      ])}
      <div class="grade g2" style="margin-top:34px">
        <div class="aviso">${icon("LuMonitor")}<div><b>Front-end</b> roda no navegador e apresenta a interface. Aqui: ${c("apps/web")}</div></div>
        <div class="aviso">${icon("LuServer")}<div><b>Back-end</b> roda no servidor e cuida das regras e dos dados. Aqui: ${c("apps/api")}</div></div>
      </div>`,
    notas: "E o cardápio que todos consultam? É o pacote packages/tipos, que define o formato de cada 'prato' (Aluno, Professor...).",
  },

  {
    tipo: "conteudo",
    titulo: "HTTP: o idioma da web",
    sub: "Cada pedido do navegador para a API tem um <b style='color:#a50034'>método</b> e um <b style='color:#a50034'>caminho</b>",
    corpo: `
      <div class="grade g4">
        ${card({ i: "LuSearch", t: "GET", d: "Buscar dados", extra: `<div class="chips"><code>GET /api/alunos</code></div>`, cls: "vertical" })}
        ${card({ i: "LuPlus", t: "POST", d: "Criar um registro", extra: `<div class="chips"><code>POST /api/alunos</code></div>`, cls: "vertical" })}
        ${card({ i: "LuPencil", t: "PUT", d: "Atualizar um registro", extra: `<div class="chips"><code>PUT /api/alunos/7</code></div>`, cls: "vertical" })}
        ${card({ i: "LuTrash2", t: "DELETE", d: "Excluir um registro", extra: `<div class="chips"><code>DELETE /api/alunos/7</code></div>`, cls: "vertical" })}
      </div>
      <div class="aviso azul" style="margin-top:34px">${icon("LuGlobe")}<div><b>HTTP</b> é o “idioma” que o navegador e a API usam para conversar. O pedido vai com método, caminho e (às vezes) um corpo em JSON; a resposta volta com um <b>status</b> e um corpo.</div></div>`,
    notas: "Mostre no navegador: abrir http://localhost:3333/api/alunos é um GET. Para POST, PUT e DELETE precisamos de um formulário, do Scalar ou do curl.",
  },

  {
    tipo: "conteudo",
    titulo: "Status HTTP",
    sub: "O número que a API devolve dizendo como foi o pedido",
    corpo: `
      <div class="grade g3" style="align-items:start">
        <div class="card vertical" style="border-color:#9fd8b6"><div class="card-ic" style="color:#1f8a4c">${icon("LuCircleCheck")}</div><h3 style="color:#1f8a4c">2xx · deu certo</h3>
          <p><b style="color:#1f8a4c">200</b> Deu certo</p><p><b style="color:#1f8a4c">201</b> Criado com sucesso</p><p><b style="color:#1f8a4c">204</b> Concluído, corpo vazio</p></div>
        <div class="card vertical"><div class="card-ic">${icon("LuMessageSquareWarning")}</div><h3>4xx · problema no pedido</h3>
          <p><b>400</b> Pedido com problema (ex.: campo faltando)</p><p><b>404</b> Não encontrado</p><p><b>409</b> Conflito com o estado atual</p></div>
        <div class="card vertical escuro"><div class="card-ic">${icon("LuCircleX")}</div><h3>5xx · erro no servidor</h3>
          <p><b style="color:#ff8ab8">500</b> Algo quebrou dentro da API</p><p>No Acadêmico, a função ${c("error()")} do ${c("index.ts")} captura o erro e responde com uma mensagem amigável.</p></div>
      </div>`,
    notas: "Exemplos do projeto: criar aluno → 201; buscar aluno com id inexistente → 404; CPF repetido → 400 com a mensagem traduzida.",
  },

  {
    tipo: "conteudo",
    titulo: "JSON: o formato da conversa",
    sub: "Texto para trocar dados, parecido com um objeto JavaScript",
    corpo: `
      <div class="colunas c55">
        ${codigo(`{
  "id": 1,
  "nome": "Ana Souza",
  "cpf": "111.222.333-44",
  "matricula": "2026001",
  "email": "ana@exemplo.com",
  "telefone": "(69) 99999-0000",
  "foto": null
}`, { lang: "json", arquivo: "GET /api/alunos/1 → resposta" })}
        <div class="pilha centro-v">
          ${card({ i: "LuArrowRightLeft", t: "Ida: objeto → texto", d: `${c("JSON.stringify(dados)")} transforma o objeto em texto para enviar pela rede` })}
          ${card({ i: "LuBraces", t: "Volta: texto → objeto", d: `${c("await resposta.json()")} no site e ${c("await req.json()")} na API` })}
        </div>
      </div>`,
    notas: "As duas pontas (site e API) falam JSON. Por isso o tipo Aluno do pacote de tipos descreve exatamente esse formato.",
  },

  {
    tipo: "conteudo",
    titulo: "API, endpoint e REST",
    sub: "O <b style='color:#a50034'>endereço</b> diz <i>o quê</i>; o <b style='color:#a50034'>método</b> diz <i>a ação</i>",
    corpo: `
      <div class="colunas c46">
        <div class="pilha">
          ${card({ i: "LuPlug", t: "API", d: "<i>Application Programming Interface</i>: o conjunto de operações que um cliente pode chamar pela rede. Métodos e caminhos formam o <b>contrato</b>.", cls: "compacto" })}
          ${card({ i: "LuLink", t: "Endpoint / rota", d: `Uma operação identificada por método + caminho, como ${c("GET /api/alunos")}.`, cls: "compacto" })}
        </div>
        <div class="pilha centro-v">
          <div class="card vertical destaque" style="align-items:center;text-align:center;padding:30px">
            <div style="font-family:var(--fonte-mono);font-size:44px;font-weight:700"><span style="color:#0057b7">GET</span> <span style="color:#a50034">/api/alunos/</span><span style="color:#ce0058;background:#fbe6ef;border-radius:8px;padding:0 10px">7</span></div>
            <div class="grade g3" style="width:100%;gap:14px;margin-top:6px">
              <p style="font-size:20px"><b style="color:#0057b7">método</b><br>a ação: buscar</p>
              <p style="font-size:20px"><b>recurso</b><br>a coleção de alunos</p>
              <p style="font-size:20px"><b>:id</b><br>qual aluno (parte variável)</p>
            </div>
          </div>
          <div class="aviso azul">${icon("LuInfo")}<div>Esse padrão de endereços se chama <b>REST</b>. O mesmo vale para professores, disciplinas e matrículas.</div></div>
        </div>
      </div>`,
    notas: "No index.ts, o ':id' do caminho chega na rota como req.params.id.",
  },

  {
    tipo: "conteudo",
    titulo: "CRUD",
    sub: "As quatro operações básicas de qualquer cadastro, em cada camada do sistema",
    corpo: tabela(
      ["Operação", "Significado", "HTTP (API)", "SQL (banco)", "No site"],
      [
        ["<b>C</b>reate", "Criar", c("POST"), c("INSERT INTO"), "Botão “Novo aluno”"],
        ["<b>R</b>ead", "Ler", c("GET"), c("SELECT"), "Tabela da listagem"],
        ["<b>U</b>pdate", "Atualizar", c("PUT"), c("UPDATE"), "Ícone de lápis"],
        ["<b>D</b>elete", "Excluir", c("DELETE"), c("DELETE FROM"), "Lixeira com confirmação"],
      ]
    ) + `<div class="aviso" style="margin-top:30px">${icon("LuLightbulb")}<div>Percebeu? Uma única ação do usuário atravessa as três colunas: <b>tela → HTTP → SQL</b>.</div></div>`,
    notas: "Peça para a turma achar, no código, onde cada linha da tabela acontece: PaginaAlunos.tsx, servicos/api.ts, rotas/alunos.ts.",
  },

  {
    tipo: "conteudo",
    titulo: "Porta, proxy e CORS",
    sub: "Como o site (5173) conversa com a API (3333) sem configuração extra",
    corpo: `
      ${fluxo([
        { i: "LuGlobe", t: "Navegador", d: `pede ${c("/api/alunos")} a <b>localhost:5173</b>` },
        { i: "LuArrowRightLeft", t: "Vite (proxy)", d: `repassa tudo que começa com ${c("/api")}` },
        { i: "LuServer", t: "API Bun", d: "responde em <b>localhost:3333</b>" },
      ])}
      <div class="grade g3" style="margin-top:30px">
        ${card({ i: "LuDoorOpen", t: "Porta", d: "Número que diz qual serviço recebe a conexão: 5173 (site) e 3333 (API).", cls: "compacto vertical" })}
        ${card({ i: "LuNetwork", t: "Proxy", d: "Intermediário que encaminha pedidos. O Vite faz isso durante o desenvolvimento.", cls: "compacto vertical" })}
        ${card({ i: "LuLock", t: "CORS", d: "Regra do navegador entre <b>origens</b> diferentes (protocolo + host + porta). Com o proxy, tudo parece ter a mesma origem.", cls: "compacto vertical" })}
      </div>`,
    notas: "Sem o proxy, o site em :5173 chamando :3333 seria outra origem, e a API precisaria liberar CORS.",
  },

  {
    tipo: "conteudo",
    titulo: "Banco de dados, SQL e chaves",
    sub: "Informações guardadas de forma organizada, mesmo depois que o programa desliga",
    corpo: `
      <div class="colunas c55">
        <div class="pilha">
          ${card({ i: "LuTable", t: "Tabela, linha e coluna", d: "Cada tabela guarda um assunto (alunos). Cada linha é um registro; cada coluna, um campo.", cls: "compacto" })}
          ${card({ i: "LuCode", t: "SQL", d: `A linguagem do banco: ${c("SELECT")}, ${c("INSERT")}, ${c("UPDATE")}, ${c("DELETE")}, ${c("CREATE TABLE")}...`, cls: "compacto" })}
          ${card({ i: "LuKey", t: "PK e FK", d: `<b>PK</b> identifica cada linha (o ${c("id")}). <b>FK</b> aponta para a PK de outra tabela (ex.: ${c("aluno_id")}).`, cls: "compacto" })}
        </div>
        ${tabela(["id (PK)", "aluno_id (FK)", "disciplina_id (FK)", "semestre"], [
          ["1", "<b>3</b> → Ana", "2 → Web", "2026.1"],
          ["2", "<b>3</b> → Ana", "5 → BD", "2026.1"],
          ["3", "<b>8</b> → Caio", "2 → Web", "2026.1"],
        ], "peq centro-v")}
      </div>`,
    notas: "A tabela à direita é um pedaço da tabela matriculas: os números das FKs apontam para linhas de outras tabelas.",
  },

  {
    tipo: "conteudo",
    titulo: "Componente, props e JSX",
    sub: "A tela é montada com peças reutilizáveis, como LEGO",
    corpo: `
      <div class="colunas c55">
        ${codigo(`type Props = {
  nome: string;
  foto: string | null;
};

export function FotoPerfil({ nome, foto }: Props) {
  return (
    <Avatar>
      {foto && <AvatarImage src={foto} />}
      <AvatarFallback>{iniciais(nome)}</AvatarFallback>
    </Avatar>
  );
}`, { lang: "tsx", arquivo: "components/FotoPerfil.tsx (resumido)", cls: "peq" })}
        <div class="pilha centro-v">
          ${card({ i: "LuComponent", t: "Componente", d: "Uma função que descreve o que aparecer na tela.", cls: "compacto" })}
          ${card({ i: "LuSquareStack", t: "Props", d: `O que o componente <b>recebe</b>: ${c('<FotoPerfil nome="Ana" foto={null} />')}`, cls: "compacto" })}
          ${card({ i: "LuFileCode", t: "JSX / TSX", d: `Marcação parecida com HTML dentro do código. ${c(".tsx")} = TypeScript + JSX.`, cls: "compacto" })}
        </div>
      </div>`,
    notas: "Sem foto, o componente mostra as iniciais do nome. O mesmo FotoPerfil é usado em alunos e professores.",
  },

  {
    tipo: "conteudo",
    titulo: "Estado e hooks",
    sub: "Hooks são funções especiais do React que começam com <b style='color:#a50034'>use</b>",
    corpo: `
      <div class="colunas c55">
        ${codigo(`// Lista de alunos que veio da API
const [alunos, setAlunos] = useState<Aluno[]>([]);

async function carregarAlunos() {
  const lista = await listarAlunos();
  setAlunos(lista); // muda o estado → redesenha
}

// [] = "rode só uma vez, quando a página abrir"
useEffect(() => {
  carregarAlunos();
}, []);`, { lang: "ts", arquivo: "paginas/alunos/PaginaAlunos.tsx", cls: "peq" })}
        <div class="pilha centro-v">
          ${card({ i: "LuRefreshCw", t: "useState", d: "Guarda uma informação entre renderizações e devolve a função para alterá-la. Mudou o estado, a tela é redesenhada." })}
          ${card({ i: "LuZap", t: "useEffect", d: "Executa algo quando a tela aparece. Aqui: buscar os dados na API." })}
        </div>
      </div>`,
    notas: "Erro comum: alterar a variável diretamente (alunos.push) em vez de chamar setAlunos. A tela não é redesenhada.",
  },

  {
    tipo: "conteudo",
    titulo: "Tipos no TypeScript",
    sub: "Um “corretor ortográfico” que avisa erros antes de rodar o código",
    corpo: `
      <div class="colunas c55">
        ${codigo(`export type Aluno = {
  id: number;
  nome: string;
  cpf: string;
  matricula: string;
  email: string;
  telefone: string;
  foto: string | null; // base64 ou null
};

// Só estes três textos são aceitos
export type StatusMatricula =
  "aprovado" | "reprovado" | "cursando";`, { lang: "ts", arquivo: "packages/tipos/index.ts" })}
        <div class="pilha centro-v">
          ${card({ i: "LuType", t: "Tipo = formato do dado", d: "Quais campos existem e de que tipo é cada um: texto, número, nulo..." })}
          ${card({ i: "LuShieldCheck", t: "Erro antes de rodar", d: `Escreveu ${c("aluno.nme")}? O editor sublinha em vermelho na hora.` })}
          <div class="aviso">${icon("LuLightbulb")}<div>O <b>mesmo</b> tipo é usado pela API e pelo site.</div></div>
        </div>
      </div>`,
    notas: "O 'string | null' significa: texto OU nulo. O '|' cria uma união de possibilidades.",
  },

  {
    tipo: "conteudo",
    titulo: "Monorepo, workspace e pacotes",
    sub: "Como o projeto organiza o próprio código e o código de terceiros",
    corpo: `
      <div class="grade g2">
        ${card({ i: "LuFolderTree", t: "Monorepo", d: "Vários projetos ou pacotes no <b>mesmo</b> repositório: aqui, a API, o site e os tipos." })}
        ${card({ i: "LuBox", t: "Workspace", d: `Pacote registrado na configuração do monorepo. ${c("@academico/tipos")} é uma pasta local, não um pacote da internet.` })}
        ${card({ i: "LuPackage", t: "Dependência / pacote", d: `Código feito por outras pessoas que o projeto usa. Fica listado no ${c("package.json")}.` })}
        ${card({ i: "LuTerminal", t: "bun install", d: `Baixa as dependências para a pasta ${c("node_modules")} e liga os workspaces.` })}
      </div>`,
    notas: "Na seção 04 veremos o monorepo em detalhes: pastas, package.json da raiz e o pacote de tipos.",
  },

  {
    tipo: "conteudo",
    titulo: "OpenAPI, Scalar e CDN",
    sub: "A API se autodocumenta, e a documentação permite testar cada endereço",
    corpo: `
      ${fluxo([
        { i: "LuFileCode", t: "openapi.ts", d: "Descreve a API no padrão <b>OpenAPI</b>: endereços, o que recebem e devolvem" },
        { i: "LuFileJson", t: "/api/openapi.json", d: "A mesma descrição, entregue em JSON" },
        { i: "LuBookText", t: "/api/docs", d: "O <b>Scalar</b> lê o JSON e desenha uma página interativa" },
      ])}
      <div class="grade g2" style="margin-top:30px">
        <div class="aviso">${icon("LuCloud")}<div><b>CDN</b>: servidores que entregam arquivos prontos. A interface do Scalar vem de um CDN, por isso ${c("/api/docs")} precisa de internet.</div></div>
        <div class="aviso azul">${icon("LuInfo")}<div>A descrição <b>não controla</b> a API, só a descreve. Criou uma rota? Documente também.</div></div>
      </div>`,
    notas: "Na seção 06 abrimos o Scalar e usamos o botão Test Request.",
  },

  {
    tipo: "conteudo",
    titulo: "Mais termos do dia a dia",
    sub: "Palavras que aparecem no código, nos comandos e nos READMEs",
    corpo: `
      <div class="grade g3" style="gap:22px">
        ${card({ i: "LuHammer", t: "Build", d: `Prepara os arquivos para publicação. ${c("bun run build")} confere tipos e gera o site.`, cls: "compacto" })}
        ${card({ i: "LuSprout", t: "Seed (popular)", d: `Coloca dados de exemplo: ${c("bun run banco:popular")}.`, cls: "compacto" })}
        ${card({ i: "LuGitBranch", t: "Migração", d: "Mudança versionada na estrutura do banco, como acrescentar uma coluna.", cls: "compacto" })}
        ${card({ i: "LuBinary", t: "Base64", d: "Representa dados binários como texto. Usado para as fotos no SQLite.", cls: "compacto" })}
        ${card({ i: "LuShieldCheck", t: "Validação", d: "Verificação feita ao rodar: a API recusa campo obrigatório em branco.", cls: "compacto" })}
        ${card({ i: "LuScale", t: "Regra de negócio", d: "Condição do mundo real que o software aplica: média 7 aprova.", cls: "compacto" })}
      </div>`,
    notas: "O glossário completo está em pweb/docs/glossario.md. Vale deixar aberto durante as aulas.",
  },
];
