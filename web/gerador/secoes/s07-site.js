const { icon, card, c, codigo, tabela } = require("../lib");

module.exports = [
  { tipo: "secao", num: "07", titulo: "O site por dentro", sub: "React · Rotas · Componentes",
    notas: "Agora o lado do navegador: apps/web, criado com Vite + React + TypeScript." },
  {
    tipo: "conteudo",
    titulo: "main.tsx e App.tsx",
    sub: "Do <code>&lt;div id=\"root\"&gt;</code> até a página certa para cada endereço",
    corpo: `<div class="colunas c55">
      ${codigo(`// main.tsx: liga o React dentro do index.html
const elementoRaiz = document.getElementById("root")!;

createRoot(elementoRaiz).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);`, { lang: "tsx", arquivo: "apps/web/src/main.tsx", cls: "mini" })}
      ${codigo(`// App.tsx: qual página em cada endereço
export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/alunos" element={<PaginaAlunos />} />
        {/* ... as outras páginas */}
      </Routes>
      <Toaster position="top-right" richColors />
    </Layout>
  );
}`, { lang: "tsx", arquivo: "apps/web/src/App.tsx (resumido)", cls: "mini" })}
    </div>
    <div class="aviso azul" style="margin-top:22px">${icon("LuInfo")}<div>${c("BrowserRouter")} troca de página <b>sem recarregar</b> o site. ${c("Toaster")} é a área onde aparecem os avisos de sucesso e erro.</div></div>`,
    notas: "O '!' depois de getElementById diz ao TypeScript: pode confiar, esse elemento existe.",
  },
  {
    tipo: "conteudo",
    titulo: "servicos/api.ts",
    sub: "O <b style='color:#a50034'>único</b> arquivo do site que conversa com a API",
    corpo: `<div class="colunas c64">
      ${codigo(`async function requisicao(caminho, metodo = "GET", dados?) {
  const resposta = await fetch("/api" + caminho, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: dados ? JSON.stringify(dados) : undefined,
  });
  const corpo = await resposta.json();
  if (!resposta.ok) {              // status 400, 404, 500...
    const mensagem = corpo.erro ?? "Não foi possível falar com a API.";
    toast.error(mensagem);         // aviso vermelho na tela
    throw new Error(mensagem);     // interrompe quem chamou
  }
  return corpo;
}
// Com id: ATUALIZA (PUT). Sem id: CRIA (POST).
export function salvarAluno(dados: NovoAluno, id?: number) {
  if (id) return requisicao("/alunos/" + id, "PUT", dados);
  return requisicao("/alunos", "POST", dados);
}`, { lang: "ts", arquivo: "apps/web/src/servicos/api.ts (resumido)", cls: "mini" })}
      <div class="pilha">
        ${card({ i: "LuPlug", t: "Um ponto de contato", d: "As telas nunca chamam fetch: chamam as funções daqui.", cls: "compacto" })}
        ${card({ i: "LuWrench", t: "Manutenção", d: "O endereço da API mudou? Mexemos só neste arquivo.", cls: "compacto" })}
        ${card({ i: "LuCircleAlert", t: "Erro tratado uma vez", d: "Toda falha vira um aviso vermelho com a mensagem da API.", cls: "compacto" })}
      </div>
    </div>`,
    notas: "O caminho começa com /api sem host nem porta: o proxy do Vite cuida de levar até a :3333.",
  },
  {
    tipo: "conteudo",
    titulo: "A página modelo: PaginaAlunos",
    sub: "Estado, efeito e filtro: o mesmo jeito de funcionar em todos os cadastros",
    corpo: `<div class="colunas c64">
      ${codigo(`const [alunos, setAlunos] = useState<Aluno[]>([]);
const [busca, setBusca] = useState("");
const [formularioAberto, setFormularioAberto] = useState(false);
// null = cadastrando um aluno novo
const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);

useEffect(() => { carregarAlunos(); }, []);

// Filtra pelo texto digitado (nome ou matrícula)
const termo = busca.toLowerCase();
const alunosFiltrados = alunos.filter((aluno) =>
  aluno.nome.toLowerCase().includes(termo) ||
  aluno.matricula.includes(termo)
);`, { lang: "ts", arquivo: "paginas/alunos/PaginaAlunos.tsx", cls: "mini" })}
      <div class="pilha">
        ${card({ i: "LuPlus", t: "Novo aluno", d: `${c("alunoEmEdicao = null")} e abre o formulário.`, cls: "compacto" })}
        ${card({ i: "LuPencil", t: "Editar", d: "Guarda o aluno clicado e abre o <b>mesmo</b> formulário.", cls: "compacto" })}
        ${card({ i: "LuTrash2", t: "Excluir", d: `${c("excluirAluno(id)")} → aviso de sucesso → recarrega a lista.`, cls: "compacto" })}
      </div>
    </div>`,
    notas: "A busca não chama a API: filtra a lista que já está na memória, a cada letra digitada.",
  },
  {
    tipo: "conteudo",
    titulo: "Componentes do shadcn/ui",
    sub: "O código é <b style='color:#a50034'>copiado</b> para <code>components/ui</code>: dá para ler e alterar tudo",
    corpo: `<div class="grade g4" style="gap:20px">
      ${card({ i: "LuSquareStack", t: "card", d: "Caixas com borda", cls: "compacto vertical" })}
      ${card({ i: "LuTable", t: "table", d: "Tabelas de listagem", cls: "compacto vertical" })}
      ${card({ i: "LuAppWindow", t: "dialog", d: "Janela do formulário", cls: "compacto vertical" })}
      ${card({ i: "LuTriangleAlert", t: "alert-dialog", d: "“Tem certeza que deseja excluir?”", cls: "compacto vertical" })}
      ${card({ i: "LuTextCursorInput", t: "input · label · select", d: "Campos de formulário", cls: "compacto vertical" })}
      ${card({ i: "LuTag", t: "badge", d: "Etiquetas de status e titulação", cls: "compacto vertical" })}
      ${card({ i: "LuUserRound", t: "avatar", d: "Foto redonda ou iniciais", cls: "compacto vertical" })}
      ${card({ i: "LuBell", t: "tabs · sonner", d: "Abas dos relatórios e avisos no canto", cls: "compacto vertical" })}
    </div>`,
    notas: "Diferente de uma biblioteca comum, o shadcn não fica escondido no node_modules. Abra components/ui/button.tsx e mostre.",
  },
  {
    tipo: "conteudo",
    titulo: "Os nossos componentes",
    sub: "Peças criadas para o projeto, em <code>src/components</code>",
    corpo: tabela(["Componente", "O que faz"], [
      [c("Layout"), "Menu lateral + área de conteúdo de todas as páginas"],
      [c("CabecalhoPagina"), "Título, descrição e botões no topo de cada tela"],
      [c("Campo"), "Rótulo + campo de formulário"],
      [`${c("FotoPerfil")} · ${c("CampoFoto")}`, "Mostra a foto (ou iniciais) · escolhe a foto no formulário"],
      [c("SeloStatus"), "Etiqueta colorida: aprovado, reprovado, cursando"],
      [c("BotaoExcluir"), "Lixeira com janela de confirmação"],
      [c("GraficoBarras"), "Gráfico de barras feito só com CSS (dashboard)"],
    ], "peq"),
    notas: "Esses componentes usam os do shadcn por dentro. Ex.: BotaoExcluir = Button + AlertDialog.",
  },
];
