# Roteiro da aula: Controle Acadêmico (Bun + React + shadcn + SQLite)

Arquivo de controle do **site da aula** (`pweb/web`). Cada slide tem um tipo visual
(seguindo os 3 modelos Afya), o conteúdo e o status. Se a criação parar no meio, retome
a partir do primeiro slide com `[ ]`; para acrescentar um slide, inclua a linha aqui e
escreva o slide no arquivo da seção indicado (em `web/gerador/secoes/`).

## Padrão visual (modelos Afya)

| Tipo | Baseado em | Características |
| --- | --- | --- |
| **CAPA** | Slide 1 (Programação para Sistemas Web) | Fundo magenta em degradê, recorte diagonal com rede e telas em neon, título grande branco, logo Afya São Lucas embaixo à esquerda |
| **SEÇÃO** | Slide 2 (Unidade 02) | Fundo vinho, número gigante em contorno neon, rótulo "SEÇÃO" espaçado, título condensado em caixa alta, subtítulo "A · B · C", chip isométrico com o ícone da seção, logo no canto inferior direito |
| **CONTEÚDO** | Slide 3 (Tipos de seletores CSS) | Fundo branco com ondas magenta nos cantos, título magenta em negrito, subtítulo, selo (pílula), cartões com borda magenta fina, sombra e ícones de traço |

- Cores: magenta Afya `#CE0058` (predominante), vinho `#A50034` / `#5C0026`, azul `#0057B7` só como apoio.
- Fontes: Segoe UI (texto), Bahnschrift condensada (títulos das seções), Cascadia Code/Consolas (código).
- Palco 16:9 (1600 × 900) escalado para a janela. Todo slide tem notas do professor (tecla N).
- Fontes do conteúdo: `academico/README.md`, `arquitetura.md`, `tutorial.md`, `academico/docs/`, `pweb/docs/glossario.md` e o código-fonte.

## Slides (84)

### Abertura  (`../gerador/secoes/s00-abertura.js`)

- [x] **01 · CAPA** — Controle Acadêmico / Um sistema web completo, explicado passo a passo: do conceito à depuração.
- [x] **02 · CONTEÚDO** — O que vamos ver / 12 seções, do conceito ao sistema funcionando (e depurado)

### Seção 01 · O projeto  (`../gerador/secoes/s01-projeto.js`)

- [x] **03 · SEÇÃO** — O projeto / Cadastros · Notas · Relatórios
- [x] **04 · CONTEÚDO** — O que o sistema faz / Um mini sistema de controle acadêmico feito para aprender programação web
- [x] **05 · CONTEÚDO** — Simples de propósito / Nada que atrapalhe o entendimento de como as peças se conectam
- [x] **06 · CONTEÚDO** — Regra de aprovação / O status é calculado pela API: o usuário digita só as notas

### Seção 02 · Conceitos fundamentais  (`../gerador/secoes/s02-conceitos.js`)

- [x] **07 · SEÇÃO** — Conceitos fundamentais / Glossário · Web · Dados
- [x] **08 · CONTEÚDO** — Cliente e servidor / Quase todo sistema web é dividido em duas partes: a analogia do restaurante
- [x] **09 · CONTEÚDO** — HTTP: o idioma da web / Cada pedido do navegador para a API tem um método e um caminho
- [x] **10 · CONTEÚDO** — Status HTTP / O número que a API devolve dizendo como foi o pedido
- [x] **11 · CONTEÚDO** — JSON: o formato da conversa / Texto para trocar dados, parecido com um objeto JavaScript
- [x] **12 · CONTEÚDO** — API, endpoint e REST / O endereço diz o quê; o método diz a ação
- [x] **13 · CONTEÚDO** — CRUD / As quatro operações básicas de qualquer cadastro, em cada camada do sistema
- [x] **14 · CONTEÚDO** — Porta, proxy e CORS / Como o site (5173) conversa com a API (3333) sem configuração extra
- [x] **15 · CONTEÚDO** — Banco de dados, SQL e chaves / Informações guardadas de forma organizada, mesmo depois que o programa desliga
- [x] **16 · CONTEÚDO** — Componente, props e JSX / A tela é montada com peças reutilizáveis, como LEGO
- [x] **17 · CONTEÚDO** — Estado e hooks / Hooks são funções especiais do React que começam com use
- [x] **18 · CONTEÚDO** — Tipos no TypeScript / Um “corretor ortográfico” que avisa erros antes de rodar o código
- [x] **19 · CONTEÚDO** — Monorepo, workspace e pacotes / Como o projeto organiza o próprio código e o código de terceiros
- [x] **20 · CONTEÚDO** — OpenAPI, Scalar e CDN / A API se autodocumenta, e a documentação permite testar cada endereço
- [x] **21 · CONTEÚDO** — Mais termos do dia a dia / Palavras que aparecem no código, nos comandos e nos READMEs

### Seção 03 · A stack  (`../gerador/secoes/s03-stack.js`)

- [x] **22 · SEÇÃO** — A stack / Ferramentas · Analogias · Decisões
- [x] **23 · CONTEÚDO** — Ferramentas do back-end / O que roda no servidor e guarda os dados
- [x] **24 · CONTEÚDO** — Ferramentas do front-end / O que roda no navegador e desenha as telas
- [x] **25 · CONTEÚDO** — Decisões de projeto (e por quê) / Cada escolha favorece o entendimento

### Seção 04 · Arquitetura e monorepo  (`../gerador/secoes/s04-monorepo.js`)

- [x] **26 · SEÇÃO** — Arquitetura e monorepo / Pastas · Camadas · Workspaces
- [x] **27 · CONTEÚDO** — O que é um monorepo / “Mono” = um só: vários projetos morando no mesmo repositório
- [x] **28 · CONTEÚDO** — A estrutura de pastas / pweb/academico: cada pasta tem o seu próprio README.md
- [x] **29 · CONTEÚDO** — As três partes e como se ligam / Dois programas que conversam por HTTP e um pacote que os dois importam
- [x] **30 · CONTEÚDO** — O package.json da raiz / Liga o monorepo e cria os atalhos de comando
- [x] **31 · CONTEÚDO** — packages/tipos: o cardápio / Um arquivo, index.ts, descreve o formato de cada informação do sistema
- [x] **32 · CONTEÚDO** — apps/api: organizada em camadas / Cada camada só conversa com a de baixo
- [x] **33 · CONTEÚDO** — apps/web: organização do site / Do ponto de entrada até as peças reaproveitáveis
- [x] **34 · CONTEÚDO** — Como uma tela é montada / Componentes dentro de componentes: a árvore da página de alunos

### Seção 05 · Modelo de banco de dados  (`../gerador/secoes/s05-banco.js`)

- [x] **35 · SEÇÃO** — Modelo de banco de dados / Tabelas · Chaves · Restrições
- [x] **36 · CONTEÚDO** — O diagrama do banco / Quatro tabelas: matriculas liga as outras três
- [x] **37 · CONTEÚDO** — Criando a tabela de alunos / O SQL que define colunas, tipos e restrições
- [x] **38 · CONTEÚDO** — Disciplinas e matrículas / Restrições que protegem os dados mesmo se a API errar
- [x] **39 · CONTEÚDO** — Conexão com o SQLite / Sem instalar servidor: o próprio Bun lê e escreve no arquivo
- [x] **40 · CONTEÚDO** — Consultas com JOIN e GROUP BY / Juntar tabelas e agrupar linhas direto no SQL

### Seção 06 · A API por dentro  (`../gerador/secoes/s06-api.js`)

- [x] **41 · SEÇÃO** — A API por dentro / Rotas · Regras · Documentação
- [x] **42 · CONTEÚDO** — index.ts: o mapa de rotas / O “cardápio” da API: lista tudo o que ela sabe fazer
- [x] **43 · CONTEÚDO** — Os endpoints da API / Padrão REST repetido para os quatro cadastros
- [x] **44 · CONTEÚDO** — Anatomia de uma rota / alunos.criar: o modelo que todas as rotas de cadastro seguem
- [x] **45 · CONTEÚDO** — Ajudantes e erros amigáveis / Pequenas funções reaproveitadas por todas as rotas (rotas/ajudantes.ts)
- [x] **46 · CONTEÚDO** — A regra de negócio no código / calcularStatus(n1, n2, pf) em regras/notas.ts
- [x] **47 · CONTEÚDO** — Documentação com Scalar / Abra http://localhost:3333/api/docs e teste a API sem escrever código

### Seção 07 · O site por dentro  (`../gerador/secoes/s07-site.js`)

- [x] **48 · SEÇÃO** — O site por dentro / React · Rotas · Componentes
- [x] **49 · CONTEÚDO** — main.tsx e App.tsx / Do <div id="root"> até a página certa para cada endereço
- [x] **50 · CONTEÚDO** — servicos/api.ts / O único arquivo do site que conversa com a API
- [x] **51 · CONTEÚDO** — A página modelo: PaginaAlunos / Estado, efeito e filtro: o mesmo jeito de funcionar em todos os cadastros
- [x] **52 · CONTEÚDO** — Componentes do shadcn/ui / O código é copiado para components/ui: dá para ler e alterar tudo
- [x] **53 · CONTEÚDO** — Os nossos componentes / Peças criadas para o projeto, em src/components

### Seção 08 · A viagem de um clique  (`../gerador/secoes/s08-viagem.js`)

- [x] **54 · SEÇÃO** — A viagem de um clique / Formulário · API · Banco
- [x] **55 · CONTEÚDO** — Cadastrar um aluno em 10 passos / Do botão “Salvar” até a tabela redesenhada
- [x] **56 · CONTEÚDO** — E quando dá erro? / Exemplo: tentar cadastrar um aluno com um CPF que já existe

### Seção 09 · Criando do zero  (`../gerador/secoes/s09-criar.js`)

- [x] **57 · SEÇÃO** — Criando do zero / Etapas · Comandos · Testes
- [x] **58 · CONTEÚDO** — As 8 etapas / Cada etapa termina com um teste antes de seguir
- [x] **59 · CONTEÚDO** — Etapa 0: preparar o computador / Instale o Bun uma única vez e confira a versão
- [x] **60 · CONTEÚDO** — Etapas 1 e 2: monorepo e tipos / A casa e o cardápio, antes de qualquer programa
- [x] **61 · CONTEÚDO** — Etapa 3: a API / Pastas, configuração e a ordem de criação dos arquivos
- [x] **62 · CONTEÚDO** — Etapa 3: testando a API / Antes de existir o site, a API já funciona sozinha
- [x] **63 · CONTEÚDO** — Etapa 3.11: documentação com Scalar / Um pacote, dois arquivos e duas linhas no index.ts
- [x] **64 · CONTEÚDO** — Etapa 4: o site com Vite / Criar o projeto React, limpar o exemplo e instalar o essencial
- [x] **65 · CONTEÚDO** — Etapa 4: vite.config.ts / Plugins, atalho @/, porta fixa e o proxy para a API
- [x] **66 · CONTEÚDO** — Etapa 5: shadcn/ui / O shadcn copia o código dos componentes para dentro do projeto
- [x] **67 · CONTEÚDO** — Etapa 6: o código do site / Do mais simples para o mais completo

### Seção 10 · Executando o sistema  (`../gerador/secoes/s10-executar.js`)

- [x] **68 · SEÇÃO** — Executando o sistema / Instalar · Popular · Rodar
- [x] **69 · CONTEÚDO** — Rodar em 3 comandos / Na pasta raiz do projeto: pweb/academico
- [x] **70 · CONTEÚDO** — Comandos úteis / Os atalhos definidos no package.json da raiz
- [x] **71 · CONTEÚDO** — Teste final / Confira, com o sistema rodando, se tudo se conecta

### Seção 11 · Depurando o sistema  (`../gerador/secoes/s11-depurar.js`)

- [x] **72 · SEÇÃO** — Depurando o sistema / Encontrar · Entender · Corrigir
- [x] **73 · CONTEÚDO** — Onde está o problema? / Siga o pedido camada por camada: cada uma tem a sua ferramenta
- [x] **74 · CONTEÚDO** — DevTools do navegador (F12) / A principal ferramenta para depurar o site
- [x] **75 · CONTEÚDO** — Depurando o site na prática / Coloque pistas no código e observe
- [x] **76 · CONTEÚDO** — Depurando a API / O terminal do bun run dev é o “console” do servidor
- [x] **77 · CONTEÚDO** — Testando a API isolada / Tire o site da equação: o problema é da API ou da tela?
- [x] **78 · CONTEÚDO** — Olhando o banco de dados / Confira o que realmente foi gravado
- [x] **79 · CONTEÚDO** — Problemas comuns (1/2) / Do academico/tutorial.md: sintoma → solução
- [x] **80 · CONTEÚDO** — Problemas comuns (2/2) / Página em branco, documentação e banco

### Seção 12 · Próximos passos  (`../gerador/secoes/s12-proximos.js`)

- [x] **81 · SEÇÃO** — Próximos passos / Praticar · Evoluir · Criar
- [x] **82 · CONTEÚDO** — Exercícios por nível / Cada um tem uma dica de por onde começar (docs/exercicios.md)
- [x] **83 · CONTEÚDO** — Roteiro de estudo / Os três projetos da pasta pweb e por onde continuar
- [x] **84 · CAPA** — Bons estudos e bom código! / Dúvidas? Abra o projeto, rode, quebre, depure e conserte.

---

## Registro de progresso

| Data | O que foi feito |
| --- | --- |
| 2026-11-19 | Roteiro criado (83 slides planejados) |
| 2026-11-19 | Formato trocado de PowerPoint para site da aula em `pweb/web` |
| 2026-11-19 | Todas as 13 partes geradas (84 slides); incluído "Depurando o site na prática" |
| 2026-11-19 | Roteiro movido para `web/docs/` |
