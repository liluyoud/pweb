# 🛠️ Tutorial: construindo o projeto do zero

Este tutorial mostra, **em ordem**, todos os comandos e passos para chegar ao projeto
que está neste repositório. Ele é dividido em **etapas**. No fim de cada etapa existe
um ✅ **Teste**, para você conferir se está tudo certo antes de seguir.

> 📌 **Sobre o código:** os arquivos de **configuração** aparecem completos aqui.
> Os arquivos de **código** (rotas, telas...) são longos e **bem comentados**. Para eles,
> o tutorial explica o que fazem e indica o arquivo do projeto de referência para você
> copiar ou, melhor ainda, **digitar** lendo os comentários.

> 💻 Os comandos funcionam no **PowerShell** (Windows) e no **terminal** (Linux/macOS).
> Quando forem diferentes, as duas versões aparecem.

---

## Etapa 0: Preparar o computador

### 0.1 Instalar o Bun

```powershell
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

```bash
# Linux / macOS
curl -fsSL https://bun.sh/install | bash
```

**Feche e abra o terminal** e confira:

```bash
bun --version
```

### 0.2 Editor de código

Recomendado: **VS Code** (https://code.visualstudio.com), com as extensões:

- *Tailwind CSS IntelliSense* (sugere as classes do Tailwind)
- *SQLite Viewer* (permite abrir o arquivo do banco e ver as tabelas)

✅ **Teste:** `bun --version` mostra um número (ex.: `1.3.12`).

---

## Etapa 1: Criar o monorepo

### 1.1 Criar a pasta do projeto

Para reproduzir a estrutura deste material, comece em uma pasta `pweb`. Crie
`academico/` dentro dela e, dentro de `academico/`, crie as pastas `apps/`,
`packages/` e `docs/`. Execute os comandos de instalação e desenvolvimento
deste tutorial a partir de `pweb/academico`, salvo quando a etapa indicar outra pasta.

### 1.2 Criar o `package.json` da raiz

Crie o arquivo `package.json` com este conteúdo:

```json
{
  "name": "controle-academico",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --filter \"@academico/*\" dev",
    "dev:api": "bun run --filter @academico/api dev",
    "dev:web": "bun run --filter @academico/web dev",
    "banco:popular": "bun run --filter @academico/api banco:popular",
    "build": "bun run --filter @academico/web build"
  }
}
```

**Entendendo:**

- `"workspaces"`: avisa ao Bun que cada pasta dentro de `apps/` e `packages/` é um
  projeto do monorepo.
- `"scripts"`: são **atalhos**. `bun run dev` executa o script `dev` de **todos** os
  projetos cujo nome começa com `@academico/` (API e site juntos).
- `--filter`: escolhe em qual projeto rodar o comando.

### 1.3 Preparar o `.gitignore` compartilhado

O [`.gitignore` de `pweb`](../.gitignore) já serve aos dois projetos. Se estiver
refazendo a estrutura em outra pasta, crie o arquivo em `pweb/.gitignore` com
as regras abaixo.

```gitignore
node_modules
dist
*.sqlite
*.sqlite-*
.DS_Store
*.log
/controle_n2/docs/alunos.md
```

### 1.4 (Opcional) Iniciar o Git

Ao criar um repositório novo, execute o comando abaixo na pasta `pweb`.

```bash
git init
```

Volte para `pweb/academico` antes da próxima etapa.

✅ **Teste:** `pweb/academico` contém `apps/`, `packages/`, `docs/` e
`package.json`. O `.gitignore` fica em `pweb`.

---

## Etapa 2: Pacote de tipos compartilhados

### 2.1 Criar a pasta

```bash
mkdir packages/tipos
```

### 2.2 Criar `packages/tipos/package.json`

```json
{
  "name": "@academico/tipos",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "types": "index.ts"
}
```

O **nome** `@academico/tipos` é como os outros projetos vão importar este pacote.

### 2.3 Criar `packages/tipos/index.ts`

📄 Copie de [packages/tipos/index.ts](packages/tipos/index.ts).

Ele define os `type` de **Aluno**, **Professor**, **Disciplina**, **Matricula**,
**MatriculaDetalhada**, os tipos "Novo..." (sem `id`, usados nos formulários) e os
tipos do **Dashboard** e dos **relatórios**.

✅ **Teste:** o arquivo existe e não tem sublinhado vermelho no VS Code.

---

## Etapa 3: A API (Bun + SQLite)

### 3.1 Criar as pastas

```bash
mkdir apps/api
mkdir apps/api/src
mkdir apps/api/src/banco apps/api/src/rotas apps/api/src/regras
```

### 3.2 Criar `apps/api/package.json`

```json
{
  "name": "@academico/api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "banco:popular": "bun src/banco/popular.ts"
  },
  "dependencies": {
    "@academico/tipos": "workspace:*"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

- `"workspace:*"`: "pegue o pacote `@academico/tipos` **daqui do monorepo**".
- `bun --watch`: reinicia a API sozinho sempre que você salvar um arquivo.
- `@types/bun`: ensina ao TypeScript as funções do Bun (`Bun.serve`, `bun:sqlite`...).

### 3.3 Criar `apps/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "types": ["bun"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src"]
}
```

Este arquivo configura o TypeScript. Você não precisa decorar nada dele.

### 3.4 Instalar as dependências

Volte para a **raiz** do projeto e rode:

```bash
cd ../..          # se você estiver dentro de apps/api
bun install
```

### 3.5 Banco de dados

Crie, nesta ordem:

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/banco/criar-tabelas.ts` | `CREATE TABLE` das 4 tabelas | [link](apps/api/src/banco/criar-tabelas.ts) |
| `src/banco/conexao.ts` | Abre o arquivo `academico.sqlite` e cria as tabelas | [link](apps/api/src/banco/conexao.ts) |

### 3.6 Regra de notas

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/regras/notas.ts` | Função `calcularStatus(n1, n2, pf)` | [link](apps/api/src/regras/notas.ts) |

### 3.7 Rotas

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/rotas/ajudantes.ts` | Funções de apoio: `erro`, `verificarObrigatorios`, `paraNota`, `traduzirErroDoBanco` | [link](apps/api/src/rotas/ajudantes.ts) |
| `src/rotas/alunos.ts` | CRUD de alunos (**leia este com calma, é o modelo**) | [link](apps/api/src/rotas/alunos.ts) |
| `src/rotas/professores.ts` | CRUD de professores | [link](apps/api/src/rotas/professores.ts) |
| `src/rotas/disciplinas.ts` | CRUD de disciplinas | [link](apps/api/src/rotas/disciplinas.ts) |
| `src/rotas/matriculas.ts` | CRUD de matrículas (com `JOIN` e cálculo de status) | [link](apps/api/src/rotas/matriculas.ts) |
| `src/rotas/relatorios.ts` | Dashboard e relatórios (com `GROUP BY`) | [link](apps/api/src/rotas/relatorios.ts) |

> 💡 **Dica didática:** faça primeiro **só** `ajudantes.ts` e `alunos.ts`, monte o
> `index.ts` (próximo passo) apenas com as rotas de alunos e teste. Depois volte e
> acrescente o resto.

### 3.8 Ponto de entrada

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/index.ts` | Liga o servidor na porta 3333 e lista todas as rotas | [link](apps/api/src/index.ts) |

### 3.9 Dados de exemplo

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/banco/popular.ts` | Apaga tudo e insere alunos, professores, disciplinas e matrículas de exemplo | [link](apps/api/src/banco/popular.ts) |

### 3.10 Rodar a API

Na raiz do projeto:

```bash
bun run banco:popular
bun run dev:api
```

Deve aparecer: `✅ API rodando em http://localhost:3333/api`

✅ **Teste:** abra no navegador:

- http://localhost:3333/api/alunos → lista de alunos em JSON
- http://localhost:3333/api/dashboard → números do dashboard
- http://localhost:3333/api/qualquer-coisa → `{"erro":"Rota não encontrada."}`

Teste também um **cadastro** pelo terminal (deixe a API ligada e abra **outro** terminal):

```bash
# Linux / macOS / Git Bash
curl -X POST http://localhost:3333/api/disciplinas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Redes","curso":"Ciência da Computação","carga_horaria":60}'
```

```powershell
# Windows (PowerShell)
Invoke-RestMethod -Method Post -Uri http://localhost:3333/api/disciplinas `
  -ContentType "application/json" `
  -Body '{"nome":"Redes","curso":"Ciência da Computação","carga_horaria":60}'
```

Aperte `Ctrl + C` para desligar a API.

### 3.11 Documentação interativa com o Scalar

O **Scalar** gera uma página que mostra e permite testar todos os endereços da API.
Ele lê uma descrição da API escrita no padrão **OpenAPI**.
Consulte o [guia de Scalar e OpenAPI](../docs/scalar.md).

**Instale o pacote**, dentro de `apps/api`:

```bash
cd apps/api
bun add @scalar/client-side-rendering
cd ../..
```

**Crie a pasta e os arquivos:**

```bash
mkdir apps/api/src/documentacao
```

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/documentacao/openapi.ts` | A descrição da API no formato OpenAPI | [link](apps/api/src/documentacao/openapi.ts) |
| `src/rotas/documentacao.ts` | Rotas que entregam o JSON e a página do Scalar | [link](apps/api/src/rotas/documentacao.ts) |

**Registre as rotas** em `src/index.ts`. Acrescente o import:

```ts
import * as documentacao from "./rotas/documentacao";
```

e, dentro de `routes`, as duas linhas:

```ts
"/api/openapi.json": { GET: documentacao.openapi },
"/api/docs": { GET: documentacao.paginaDocumentacao },
```

✅ **Teste:** ligue a API (`bun run dev:api`) e abra **http://localhost:3333/api/docs**.
Clique em **Alunos → Listar alunos → Test Request**. A lista de alunos deve aparecer.

> ⚠️ A página do Scalar precisa de **internet**, pois a interface é baixada de um CDN.

---

## Etapa 4: O site (React + Vite)

### 4.1 Criar o projeto React com o Vite

```bash
cd apps
bun create vite web --template react-ts --no-interactive
cd ..
```

Isso cria a pasta `apps/web` com um projeto React + TypeScript de exemplo.

### 4.2 Limpar o exemplo

Apague os arquivos de demonstração que não vamos usar:

```bash
# Linux / macOS / Git Bash
rm -rf apps/web/src/App.css apps/web/src/assets apps/web/public/icons.svg apps/web/README.md apps/web/.oxlintrc.json
```

```powershell
# Windows (PowerShell)
Remove-Item -Recurse -Force apps/web/src/App.css, apps/web/src/assets, apps/web/public/icons.svg, apps/web/README.md, apps/web/.oxlintrc.json
```

### 4.3 Ajustar `apps/web/package.json`

Abra o arquivo e faça **três** mudanças:

1. Troque o nome para `"name": "@academico/web"`.
2. Em `"scripts"`, remova a linha do `"lint"`.
3. Em `"dependencies"`, acrescente: `"@academico/tipos": "workspace:*"`.
   Em `"devDependencies"`, remova a linha do `"oxlint"`.

Depois, na raiz:

```bash
bun install
```

### 4.4 Instalar Tailwind CSS e React Router

```bash
cd apps/web
bun add tailwindcss @tailwindcss/vite react-router
```

- **tailwindcss**: as classes de estilo (`p-4`, `flex`, `text-sm`...).
- **react-router**: permite ter várias "páginas" (`/alunos`, `/professores`...).

### 4.5 Configurar o Vite

Substitua `apps/web/vite.config.ts` por:

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    // Atalho: "@/" significa "a pasta src/".
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    // Garante uma única cópia do React (evita página em branco).
    dedupe: ["react", "react-dom"],
  },

  server: {
    port: 5173,
    // Se a 5173 estiver ocupada, para com um aviso (em vez de abrir na 5174).
    strictPort: true,
    // Tudo que começar com /api é repassado para a API.
    proxy: {
      "/api": "http://localhost:3333",
    },
  },
});
```

### 4.6 Configurar o atalho `@/` no TypeScript

Em `apps/web/tsconfig.json`, acrescente o bloco `compilerOptions`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

E em `apps/web/tsconfig.app.json`, dentro de `"compilerOptions"`, acrescente:

```json
    "paths": {
      "@/*": ["./src/*"]
    },
```

### 4.7 Importar o Tailwind

Substitua todo o conteúdo de `apps/web/src/index.css` por:

```css
@import "tailwindcss";
```

✅ **Teste:** `bun run dev` (dentro de `apps/web`) abre o site em http://localhost:5173
sem erros no terminal. Desligue com `Ctrl + C`.

---

## Etapa 5: Instalar o shadcn/ui

O shadcn **não é instalado como uma biblioteca comum**: ele **copia** o código dos
componentes para dentro do seu projeto (pasta `src/components/ui`). Assim você pode
ler e alterar tudo.

### 5.1 Inicializar

Ainda dentro de `apps/web`:

```bash
bunx --bun shadcn@latest init -t vite -b radix -p nova --no-monorepo
```

- `-t vite`: nosso projeto usa Vite.
- `-b radix`: base dos componentes (Radix UI).
- `-p nova`: o "estilo" visual (preset Nova).
- `--no-monorepo`: o shadcn tem um modo monorepo próprio, mas aqui ele só cuida do site.

Ele cria `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`
e atualiza o `src/index.css` com as cores do tema.

### 5.2 Adicionar os componentes que vamos usar

```bash
bunx --bun shadcn@latest add card table dialog alert-dialog input label select badge avatar tabs sonner separator
```

| Componente | Usado para |
| --- | --- |
| `card` | Caixas brancas com borda (cartões do dashboard, tabelas) |
| `table` | Tabelas de listagem |
| `dialog` | Janela do formulário de cadastro/edição |
| `alert-dialog` | Janela "Tem certeza que deseja excluir?" |
| `input`, `label`, `select` | Campos de formulário |
| `badge` | Etiquetas (status, titulação) |
| `avatar` | Foto redonda (ou iniciais) |
| `tabs` | Abas da página de relatórios |
| `sonner` | Avisos de sucesso/erro no canto da tela |

Volte para a raiz:

```bash
cd ../..
```

---

## Etapa 6: O código do site

Crie os arquivos **nesta ordem** (do mais simples para o mais completo):

### 6.1 Base

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `index.html` | Página HTML com a `<div id="root">` (troque `lang` e `<title>`) | [link](apps/web/index.html) |
| `public/favicon.svg` | Ícone da aba do navegador | [link](apps/web/public/favicon.svg) |
| `src/servicos/api.ts` | **Único** arquivo que conversa com a API | [link](apps/web/src/servicos/api.ts) |
| `src/lib/formatar.ts` | `formatarNota`, `calcularMedia`, `iniciais` | [link](apps/web/src/lib/formatar.ts) |

### 6.2 Componentes reaproveitáveis

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/components/Layout.tsx` | Menu lateral + área de conteúdo | [link](apps/web/src/components/Layout.tsx) |
| `src/components/CabecalhoPagina.tsx` | Título e descrição de cada tela | [link](apps/web/src/components/CabecalhoPagina.tsx) |
| `src/components/Campo.tsx` | Rótulo + campo de formulário | [link](apps/web/src/components/Campo.tsx) |
| `src/components/FotoPerfil.tsx` | Foto redonda ou iniciais | [link](apps/web/src/components/FotoPerfil.tsx) |
| `src/components/CampoFoto.tsx` | Escolher foto no formulário | [link](apps/web/src/components/CampoFoto.tsx) |
| `src/components/SeloStatus.tsx` | Etiqueta colorida de status | [link](apps/web/src/components/SeloStatus.tsx) |
| `src/components/BotaoExcluir.tsx` | Lixeira com confirmação | [link](apps/web/src/components/BotaoExcluir.tsx) |
| `src/components/GraficoBarras.tsx` | Gráfico de barras feito só com CSS | [link](apps/web/src/components/GraficoBarras.tsx) |

### 6.3 Páginas

| Arquivo | Copiar de |
| --- | --- |
| `src/paginas/alunos/PaginaAlunos.tsx` (**a página modelo, leia com calma**) | [link](apps/web/src/paginas/alunos/PaginaAlunos.tsx) |
| `src/paginas/alunos/FormularioAluno.tsx` | [link](apps/web/src/paginas/alunos/FormularioAluno.tsx) |
| `src/paginas/professores/PaginaProfessores.tsx` | [link](apps/web/src/paginas/professores/PaginaProfessores.tsx) |
| `src/paginas/professores/FormularioProfessor.tsx` | [link](apps/web/src/paginas/professores/FormularioProfessor.tsx) |
| `src/paginas/disciplinas/PaginaDisciplinas.tsx` | [link](apps/web/src/paginas/disciplinas/PaginaDisciplinas.tsx) |
| `src/paginas/disciplinas/FormularioDisciplina.tsx` | [link](apps/web/src/paginas/disciplinas/FormularioDisciplina.tsx) |
| `src/paginas/matriculas/PaginaMatriculas.tsx` | [link](apps/web/src/paginas/matriculas/PaginaMatriculas.tsx) |
| `src/paginas/matriculas/FormularioMatricula.tsx` | [link](apps/web/src/paginas/matriculas/FormularioMatricula.tsx) |
| `src/paginas/dashboard/PaginaDashboard.tsx` | [link](apps/web/src/paginas/dashboard/PaginaDashboard.tsx) |
| `src/paginas/relatorios/PaginaRelatorios.tsx` | [link](apps/web/src/paginas/relatorios/PaginaRelatorios.tsx) |
| `src/paginas/relatorios/RelatorioBoletim.tsx` | [link](apps/web/src/paginas/relatorios/RelatorioBoletim.tsx) |
| `src/paginas/relatorios/RelatorioDisciplinas.tsx` | [link](apps/web/src/paginas/relatorios/RelatorioDisciplinas.tsx) |
| `src/paginas/relatorios/RelatorioProfessores.tsx` | [link](apps/web/src/paginas/relatorios/RelatorioProfessores.tsx) |

### 6.4 Juntando tudo

| Arquivo | O que faz | Copiar de |
| --- | --- | --- |
| `src/App.tsx` | Liga cada endereço a uma página | [link](apps/web/src/App.tsx) |
| `src/main.tsx` | Liga o React e o roteador | [link](apps/web/src/main.tsx) |

> 💡 **Dica didática:** assim como na API, comece só com **Layout + Alunos**.
> No `App.tsx`, deixe só a rota `/alunos`. Quando funcionar, acrescente as outras.

---

## Etapa 7: Rodar tudo junto 🎉

Na **raiz** do projeto:

```bash
bun install
bun run banco:popular
bun run dev
```

Abra **http://localhost:5173**.

✅ **Teste final:**

- [ ] O dashboard mostra os números e os gráficos.
- [ ] Cadastre um aluno **com foto**.
- [ ] Tente cadastrar outro aluno com o **mesmo CPF** → deve aparecer um aviso vermelho.
- [ ] Tente excluir um aluno que tem matrículas → o sistema não deixa.
- [ ] Crie uma matrícula com N1 = 5 e N2 = 6 → status **Cursando** (falta a PF).
- [ ] Edite e coloque PF = 7 → status **Aprovado** ((5,5 + 7) / 2 = 6,25).
- [ ] Veja o boletim do aluno na página **Relatórios**.
- [ ] Abra http://localhost:3333/api/docs e teste um endereço pelo Scalar.

### Gerar a versão final do site

```bash
bun run build
```

Os arquivos ficam em `apps/web/dist/`.

---

## Problemas comuns

| Problema | Solução |
| --- | --- |
| `bun: command not found` | Feche e abra o terminal depois de instalar o Bun |
| Site abre, mas as listas ficam vazias e aparece erro | A API está ligada? Use `bun run dev` na **raiz** (liga os dois) |
| `Port 3333 is already in use` | Já existe uma API rodando em outro terminal. Feche-a |
| `Port 5173 is already in use` | Já existe um site rodando em outro terminal (um `bun run dev` esquecido). Feche-o com `Ctrl + C` |
| Site abre em branco (sem erro no terminal) | Abra o console do navegador (`F12`). Se aparecer *Invalid hook call*, confira o `dedupe` no `vite.config.ts`, apague a pasta `apps/web/node_modules/.vite` e rode `bun run dev` de novo |
| `Cannot find module '@academico/tipos'` | Rode `bun install` na **raiz** do projeto |
| Quero começar o banco do zero | Apague `apps/api/academico.sqlite` e rode `bun run banco:popular` |
| A página `/api/docs` fica em branco | Ela precisa de internet (a interface do Scalar vem de um CDN) |
| Criei uma rota e ela não aparece no Scalar | Documente-a em `src/documentacao/openapi.ts` (veja o [guia do Scalar](../docs/scalar.md)) |
| Mudei uma tabela em `criar-tabelas.ts` e nada mudou | `CREATE TABLE IF NOT EXISTS` não altera tabela existente. Apague o `.sqlite` |
