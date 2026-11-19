# Roteiro da apresentação: Controle Acadêmico (Bun + React + shadcn + SQLite)

Arquivo de controle da criação do PowerPoint `academico-apresentacao.pptx`.
Cada slide tem um **tipo visual** (seguindo os 3 modelos Afya enviados), o conteúdo
que deve aparecer e o status. Se a geração parar no meio, retome a partir do
primeiro slide com `[ ]`.

## Padrão visual (modelos Afya)

| Tipo | Baseado em | Características |
| --- | --- | --- |
| **CAPA** | Slide 1 (Programação para Sistemas Web) | Fundo magenta escuro em degradê, recorte diagonal à direita com ilustração de rede/telas em neon, título grande branco à esquerda, logo Afya São Lucas embaixo à esquerda |
| **SEÇÃO** | Slide 2 (Unidade 02) | Fundo vinho escuro, número gigante em contorno neon à esquerda, rótulo "SEÇÃO" espaçado, título em caixa alta condensada, subtítulo "A · B · C", ilustração isométrica (chip + ícone) à direita, logo no canto inferior direito |
| **CONTEÚDO** | Slide 3 (Tipos de seletores CSS) | Fundo branco com ondas magenta no canto superior direito e inferior esquerdo, título magenta em negrito, subtítulo cinza escuro, selo (pílula magenta com ícone), cartões brancos com borda magenta fina, sombra e ícones de traço |

- Cores: magenta Afya `#CE0058` (predominante), vinho `#A50034` / `#5C0026`, azul `#0057B7` só como apoio.
- Fontes: Segoe UI (títulos e texto), Bahnschrift Condensed (títulos das seções), Consolas (código).
- Formato 16:9. Cada slide de conteúdo tem notas do apresentador.
- Fontes do conteúdo: `README.md`, `arquitetura.md`, `tutorial.md`, `docs/*.md` do projeto e `pweb/docs/glossario.md`, além do código-fonte.

---

## Slides

### Abertura

- [ ] **01 · CAPA** — "Controle Acadêmico" / subtítulo "Um sistema web completo, do conceito à depuração" / rodapé: Programação para Sistemas Web · Bun + React + shadcn/ui + SQLite.
- [ ] **02 · CONTEÚDO (agenda)** — "O que vamos ver": 12 seções numeradas em grade (O projeto, Conceitos, Stack, Monorepo, Banco de dados, API, Site, Viagem de um clique, Criar do zero, Executar, Depurar, Próximos passos).

### Seção 01 · O projeto

- [ ] **03 · SEÇÃO 01** — "O projeto" / "Cadastros · Notas · Relatórios".
- [ ] **04 · CONTEÚDO** — "O que o sistema faz": 6 cartões (Dashboard, Alunos, Professores, Disciplinas, Matrículas, Relatórios) + selo "6 telas + documentação da API".
- [ ] **05 · CONTEÚDO** — "Simples de propósito": sem login/senha, código todo em português, cada pasta tem README, foco em como as peças se conectam; aviso: nunca publicar assim na internet.
- [ ] **06 · CONTEÚDO** — "Regra de aprovação": fluxograma N1+N2 → média ≥ 7 aprovado; < 7 → PF; (média+PF)/2 ≥ 5 aprovado / < 5 reprovado; falta nota → cursando. Status calculado pela API (`regras/notas.ts`).

### Seção 02 · Conceitos fundamentais (glossário)

- [ ] **07 · SEÇÃO 02** — "Conceitos fundamentais" / "Glossário · Web · Dados".
- [ ] **08 · CONTEÚDO** — "Cliente e servidor": analogia do restaurante (Usuário → Site/garçom → API/cozinha → Banco/despensa); front-end x back-end.
- [ ] **09 · CONTEÚDO** — "HTTP: o idioma da web": métodos GET/POST/PUT/DELETE com significado e exemplo de rota.
- [ ] **10 · CONTEÚDO** — "Status HTTP": 200, 201, 204, 400, 404, 409, 500 agrupados (sucesso / erro do cliente / erro do servidor).
- [ ] **11 · CONTEÚDO** — "JSON: o formato da conversa": exemplo de aluno em JSON + `JSON.stringify` / `resposta.json()`.
- [ ] **12 · CONTEÚDO** — "API, endpoint e REST": endereço diz *o quê*, método diz *a ação*; exemplo `GET /api/alunos/7`; contrato.
- [ ] **13 · CONTEÚDO** — "CRUD": Create/Read/Update/Delete ↔ POST/GET/PUT/DELETE ↔ INSERT/SELECT/UPDATE/DELETE.
- [ ] **14 · CONTEÚDO** — "Porta, proxy e CORS": 5173 (site), 3333 (API); proxy do Vite repassa `/api`; CORS e origem (protocolo+host+porta).
- [ ] **15 · CONTEÚDO** — "Banco de dados, SQL e chaves": tabela, linha, coluna; SQL; PK e FK com exemplo `aluno_id`.
- [ ] **16 · CONTEÚDO** — "Componente, props e JSX": `<FotoPerfil nome="Ana" foto={null} />`; .tsx = TypeScript + JSX.
- [ ] **17 · CONTEÚDO** — "Estado e hooks": `useState` (guarda e redesenha), `useEffect` (roda ao abrir a tela).
- [ ] **18 · CONTEÚDO** — "Tipos no TypeScript": `type Aluno = {...}`; corretor ortográfico do código.
- [ ] **19 · CONTEÚDO** — "Monorepo, workspace e pacotes": dependência, `node_modules`, `bun install`, workspace.
- [ ] **20 · CONTEÚDO** — "OpenAPI, Scalar e CDN": descrição → JSON → página interativa.
- [ ] **21 · CONTEÚDO** — "Mais termos do dia a dia": Build, Seed, Migração, Base64, Validação, Regra de negócio (6 cartões).

### Seção 03 · A stack

- [ ] **22 · SEÇÃO 03** — "A stack" / "Ferramentas · Analogias · Decisões".
- [ ] **23 · CONTEÚDO** — "Ferramentas do back-end": Bun (motor), TypeScript (corretor), SQLite (caderno), Scalar (manual).
- [ ] **24 · CONTEÚDO** — "Ferramentas do front-end": React (LEGO), Vite (forno), Tailwind (lápis de cor), shadcn/ui (móveis prontos).
- [ ] **25 · CONTEÚDO** — "Decisões de projeto (e por quê)": sem framework na API, SQL puro, SQLite, proxy do Vite, status na API, tipos compartilhados, fotos em base64.

### Seção 04 · Arquitetura e monorepo

- [ ] **26 · SEÇÃO 04** — "Arquitetura e monorepo" / "Pastas · Camadas · Workspaces".
- [ ] **27 · CONTEÚDO** — "O que é um monorepo": vários projetos no mesmo repositório; 3 vantagens (um install, um dev, tipos compartilhados).
- [ ] **28 · CONTEÚDO** — "A estrutura de pastas": árvore `apps/api`, `apps/web`, `packages/tipos`, `docs`, `package.json`, `README.md`, `arquitetura.md`, `tutorial.md`.
- [ ] **29 · CONTEÚDO** — "As três partes e como se ligam": diagrama web ⇄ api (HTTP+JSON), ambos importam `packages/tipos`; portas.
- [ ] **30 · CONTEÚDO** — "package.json da raiz": código com workspaces e scripts; explicação de `--filter` e `workspace:*`.
- [ ] **31 · CONTEÚDO** — "packages/tipos: o cardápio": Aluno, Professor, Disciplina, Matricula, StatusMatricula, MatriculaDetalhada, tipos "Novo...".
- [ ] **32 · CONTEÚDO** — "apps/api: camadas": index.ts → rotas/ → regras/ → banco/ + documentacao/.
- [ ] **33 · CONTEÚDO** — "apps/web: organização": main.tsx, App.tsx, paginas/, components/, components/ui/, servicos/api.ts, lib/.
- [ ] **34 · CONTEÚDO** — "Como uma tela é montada": árvore main → App → Layout → PaginaAlunos → CabecalhoPagina, Table/Button, FotoPerfil, FormularioAluno.

### Seção 05 · Modelo de banco de dados

- [ ] **35 · SEÇÃO 05** — "Modelo de banco de dados" / "Tabelas · Chaves · Restrições".
- [ ] **36 · CONTEÚDO** — "Diagrama do banco": 4 tabelas com campos; matriculas no centro com FKs para alunos, professores e disciplinas.
- [ ] **37 · CONTEÚDO** — "Alunos e professores": colunas, tipos e restrições (NOT NULL, UNIQUE em cpf/matricula, foto base64).
- [ ] **38 · CONTEÚDO** — "Disciplinas e matrículas": CHECK carga_horaria > 0; notas 0–10; UNIQUE(aluno_id, disciplina_id, semestre); status padrão 'cursando'.
- [ ] **39 · CONTEÚDO** — "Conexão com o SQLite": código de `conexao.ts` (Database, create, PRAGMA foreign_keys = ON, criarTabelas) + `CREATE TABLE IF NOT EXISTS`.
- [ ] **40 · CONTEÚDO** — "Consultas com JOIN e GROUP BY": SQL das matrículas com nomes + agrupamento do dashboard.

### Seção 06 · A API por dentro

- [ ] **41 · SEÇÃO 06** — "A API por dentro" / "Rotas · Regras · Documentação".
- [ ] **42 · CONTEÚDO** — "index.ts: o mapa de rotas": código de `Bun.serve({ port, routes, fetch, error })`.
- [ ] **43 · CONTEÚDO** — "Os endpoints": tabela de rotas (CRUD de 4 recursos + dashboard + relatórios + docs).
- [ ] **44 · CONTEÚDO** — "Anatomia de uma rota: criar aluno": código de `alunos.criar` em 4 passos (ler JSON, validar, INSERT com ?, responder 201); SQL Injection.
- [ ] **45 · CONTEÚDO** — "Ajudantes e erros amigáveis": erro(), verificarObrigatorios(), paraNota(), traduzirErroDoBanco() (UNIQUE/FK/CHECK).
- [ ] **46 · CONTEÚDO** — "A regra de negócio no código": `calcularStatus(n1, n2, pf)`.
- [ ] **47 · CONTEÚDO** — "Documentação com Scalar": openapi.ts → /api/openapi.json → /api/docs; precisa de internet (CDN); rota nova = documentar.

### Seção 07 · O site por dentro

- [ ] **48 · SEÇÃO 07** — "O site por dentro" / "React · Rotas · Componentes".
- [ ] **49 · CONTEÚDO** — "main.tsx e App.tsx": createRoot + BrowserRouter; `<Route path="/alunos" ...>`; Toaster.
- [ ] **50 · CONTEÚDO** — "servicos/api.ts: o único que fala com a API": função `requisicao` + `salvarAluno` (POST x PUT).
- [ ] **51 · CONTEÚDO** — "Página modelo: PaginaAlunos": useState (alunos, busca, formulário, edição), useEffect com [], filtro de busca.
- [ ] **52 · CONTEÚDO** — "Componentes shadcn/ui": card, table, dialog, alert-dialog, input/label/select, badge, avatar, tabs, sonner.
- [ ] **53 · CONTEÚDO** — "Nossos componentes": Layout, CabecalhoPagina, Campo, FotoPerfil, CampoFoto, SeloStatus, BotaoExcluir, GraficoBarras.

### Seção 08 · A viagem de um clique

- [ ] **54 · SEÇÃO 08** — "A viagem de um clique" / "Formulário · API · Banco".
- [ ] **55 · CONTEÚDO** — "Cadastrar um aluno: 10 passos": linha do tempo do formulário até a tabela redesenhada.
- [ ] **56 · CONTEÚDO** — "E quando dá erro?": CPF repetido → UNIQUE → error() traduz → 400 + {erro} → toast vermelho.

### Seção 09 · Criando do zero

- [ ] **57 · SEÇÃO 09** — "Criando do zero" / "Etapas · Comandos · Testes".
- [ ] **58 · CONTEÚDO** — "As 8 etapas": 0 Preparar, 1 Monorepo, 2 Tipos, 3 API, 4 Site, 5 shadcn, 6 Código do site, 7 Rodar tudo.
- [ ] **59 · CONTEÚDO** — "Etapa 0: preparar o computador": instalar Bun (Windows/Linux), `bun --version`, VS Code + extensões.
- [ ] **60 · CONTEÚDO** — "Etapas 1 e 2: monorepo e tipos": pastas, package.json raiz, .gitignore, packages/tipos/package.json.
- [ ] **61 · CONTEÚDO** — "Etapa 3: a API": pastas, apps/api/package.json, ordem dos arquivos (banco → regras → rotas → index → popular).
- [ ] **62 · CONTEÚDO** — "Etapa 3: testando a API": `bun run banco:popular`, `bun run dev:api`, URLs de teste, curl / Invoke-RestMethod.
- [ ] **63 · CONTEÚDO** — "Etapa 3.11: documentação com Scalar": `bun add @scalar/client-side-rendering`, arquivos, registrar rotas, testar em /api/docs.
- [ ] **64 · CONTEÚDO** — "Etapa 4: o site com Vite": `bun create vite web --template react-ts`, limpar, ajustar package.json, Tailwind + React Router.
- [ ] **65 · CONTEÚDO** — "Etapa 4: vite.config.ts": código com alias @, dedupe, porta 5173 e proxy /api.
- [ ] **66 · CONTEÚDO** — "Etapa 5: shadcn/ui": `shadcn init` e `shadcn add ...`; shadcn copia o código para `components/ui`.
- [ ] **67 · CONTEÚDO** — "Etapa 6: o código do site": ordem base → componentes → páginas → App/main; dica de começar só com Alunos.

### Seção 10 · Executando

- [ ] **68 · SEÇÃO 10** — "Executando o sistema" / "Instalar · Popular · Rodar".
- [ ] **69 · CONTEÚDO** — "Rodar em 3 comandos": bun install, bun run banco:popular, bun run dev + endereços (5173, 3333/api/alunos, 3333/api/docs).
- [ ] **70 · CONTEÚDO** — "Comandos úteis": tabela dev, dev:api, dev:web, banco:popular, build; zerar banco.
- [ ] **71 · CONTEÚDO** — "Teste final": checklist das 8 verificações do tutorial.

### Seção 11 · Depurando

- [ ] **72 · SEÇÃO 11** — "Depurando o sistema" / "Encontrar · Entender · Corrigir".
- [ ] **73 · CONTEÚDO** — "Onde está o problema?": isolar a camada (navegador → proxy → API → banco) e a ferramenta de cada camada.
- [ ] **74 · CONTEÚDO** — "DevTools do navegador (F12)": Console (erros, console.log), Network/Rede (pedido, status, corpo), Sources (breakpoints, `debugger;`), React DevTools.
- [ ] **75 · CONTEÚDO** — "Depurando a API": terminal do `bun --watch`, `console.log`/`console.error` no `error()`, `bun --inspect src/index.ts`, extensão Bun do VS Code com breakpoints.
- [ ] **76 · CONTEÚDO** — "Testando a API isolada": Scalar (Test Request), curl/Invoke-RestMethod, abrir URL GET no navegador.
- [ ] **77 · CONTEÚDO** — "Olhando o banco": SQLite Viewer no VS Code, `academico.sqlite`, recriar banco, IF NOT EXISTS não altera tabela.
- [ ] **78 · CONTEÚDO** — "Problemas comuns (1/2)": bun not found, listas vazias, porta 3333/5173 ocupada.
- [ ] **79 · CONTEÚDO** — "Problemas comuns (2/2)": página em branco/Invalid hook call, módulo @academico/tipos, /api/docs em branco, rota fora do Scalar, tabela não muda.

### Seção 12 · Próximos passos

- [ ] **80 · SEÇÃO 12** — "Próximos passos" / "Praticar · Evoluir · Criar".
- [ ] **81 · CONTEÚDO** — "Exercícios por nível": Nível 1 (aquecimento), Nível 2 (uma camada), Nível 3 (sistema inteiro) com exemplos de `docs/exercicios.md`.
- [ ] **82 · CONTEÚDO** — "Roteiro de leitura": README → arquitetura → tutorial → docs → glossário; cada pasta tem README.
- [ ] **83 · CAPA (encerramento)** — "Bons estudos e bom código!" / "Dúvidas?".

---

## Registro de progresso

| Data | O que foi feito |
| --- | --- |
| 2026-11-19 | Roteiro criado (83 slides) |
