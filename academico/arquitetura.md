# 🏛️ Arquitetura do projeto

"Arquitetura" é o **desenho geral** do sistema: quais são as partes, o que cada uma
faz e como elas conversam. É como a planta de uma casa: antes de olhar cada tijolo,
vale entender onde ficam os cômodos.

---

## 1. A ideia central: cliente e servidor

Quase todo sistema web é dividido em duas partes:

| Parte | Neste projeto | Onde roda | O que faz |
| --- | --- | --- | --- |
| **Cliente** (front-end) | `apps/web` | No **navegador** do usuário | Mostra as telas e reage aos cliques |
| **Servidor** (back-end) | `apps/api` | No **computador/servidor** | Guarda e busca os dados no banco |

### 🍽️ A analogia do restaurante

```
  CLIENTE NO SALÃO          GARÇOM                 COZINHA              DESPENSA
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐     ┌──────────────┐
 │   Usuário    │ ───► │  Site (web)  │ ───► │  API (Bun)   │ ──► │ Banco SQLite │
 │ (navegador)  │ ◄─── │    React     │ ◄─── │   rotas/     │ ◄── │ academico.   │
 └──────────────┘      └──────────────┘      └──────────────┘     │    sqlite    │
                                                                    └──────────────┘
```

- O **usuário** faz um pedido ("quero ver os alunos").
- O **site** (garçom) anota e leva o pedido para a cozinha. Ele **não cozinha**.
- A **API** (cozinha) prepara a resposta, buscando os ingredientes na despensa.
- O **banco de dados** (despensa) é onde tudo fica guardado.

E o **cardápio** que todos consultam para saber o que existe? É o pacote
`packages/tipos`: ele define o formato de cada prato (Aluno, Professor...).

---

## 2. As três partes do monorepo

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          MONOREPO (uma pasta só)                           │
│                                                                           │
│   ┌─────────────────────┐   HTTP + JSON    ┌─────────────────────────┐    │
│   │      apps/web       │ ───────────────► │        apps/api         │    │
│   │  React + shadcn     │ ◄─────────────── │   Bun.serve + SQLite    │    │
│   │  porta 5173         │                  │   porta 3333            │    │
│   └─────────┬───────────┘                  └────────────┬────────────┘    │
│             │  importa                        importa   │                 │
│             └──────────────►┌──────────────┐◄───────────┘                 │
│                             │packages/tipos│                              │
│                             │ (Aluno, ...) │                              │
│                             └──────────────┘                              │
└───────────────────────────────────────────────────────────────────────────┘
```

| Pasta | Tipo | Depende de |
| --- | --- | --- |
| `packages/tipos` | Biblioteca (não roda sozinha) | nada |
| `apps/api` | Programa (servidor) | `tipos` |
| `apps/web` | Programa (site) | `tipos` (e da API funcionando) |

A ligação entre eles é feita pelos **workspaces** do Bun, configurados no
`package.json` da raiz:

```json
"workspaces": ["apps/*", "packages/*"]
```

Isso faz o Bun entender que `@academico/tipos` não é um pacote da internet, e sim
uma pasta **aqui mesmo** no projeto.

---

## 3. Como a API está organizada (camadas)

```
apps/api/src/
├── index.ts          ← 1. PORTA DE ENTRADA: liga o servidor e lista as rotas
├── rotas/            ← 2. ROTAS: recebem o pedido e devolvem a resposta
├── regras/           ← 3. REGRAS DE NEGÓCIO: cálculos do "mundo real" (notas)
├── banco/            ← 4. BANCO: conexão, criação das tabelas e dados de exemplo
└── documentacao/     ← 5. DESCRIÇÃO DA API (OpenAPI), exibida pelo Scalar
```

Cada camada só conversa com a de baixo:

```
 pedido HTTP
     │
     ▼
 index.ts  ──── "esse endereço é com a função alunos.listar"
     │
     ▼
 rotas/alunos.ts ──── valida os dados, monta o SQL
     │         └──── (se precisar) usa regras/notas.ts para calcular o status
     ▼
 banco/conexao.ts ──── executa o SQL no arquivo academico.sqlite
     │
     ▼
 resposta em JSON
```

**Por que separar assim?** Porque cada arquivo fica **pequeno** e com **uma única
responsabilidade**. Se a regra de aprovação mudar, você mexe só em `regras/`.
Se uma tabela mudar, você mexe em `banco/` e nas rotas daquela tabela.

### Rotas da API (os "endereços")

Seguimos o padrão **REST**: o **endereço** diz *o quê*; o **método HTTP** diz *a ação*.

| Método | Endereço | Ação |
| --- | --- | --- |
| `GET` | `/api/alunos` | Lista todos |
| `GET` | `/api/alunos/:id` | Busca um |
| `POST` | `/api/alunos` | Cria |
| `PUT` | `/api/alunos/:id` | Atualiza |
| `DELETE` | `/api/alunos/:id` | Exclui |

O mesmo vale para `professores`, `disciplinas` e `matriculas`. Além delas:
`GET /api/dashboard`, `GET /api/relatorios/disciplinas` e `GET /api/relatorios/professores`.

Referência completa: [docs/api.md](docs/api.md).

### Documentação interativa (Scalar)

A API também se **autodocumenta**:

```
 documentacao/openapi.ts ──► GET /api/openapi.json ──► GET /api/docs (Scalar)
   descrição da API            a descrição em JSON        página interativa
```

- `documentacao/openapi.ts` descreve todos os endereços no formato **OpenAPI** (um
  padrão mundial para descrever APIs).
- A rota `/api/docs` entrega uma página HTML que carrega o **Scalar**. O Scalar lê o
  `/api/openapi.json` e desenha a documentação, com botão para testar cada endereço.
- A descrição **não controla** a API, só a descreve. Rota nova = documentar também.

Veja o [guia de Scalar e OpenAPI](../docs/scalar.md).

---

## 4. Como o site está organizado

```
apps/web/src/
├── main.tsx          ← 1. liga o React dentro do index.html
├── App.tsx           ← 2. diz qual página aparece em cada endereço
├── paginas/          ← 3. as TELAS (uma pasta por assunto)
├── components/       ← 4. PEÇAS reaproveitáveis (menu, foto, botão excluir...)
│   └── ui/           ←    peças prontas do shadcn (botão, tabela, janela...)
├── servicos/api.ts   ← 5. o ÚNICO lugar que conversa com a API
└── lib/              ← 6. funções de ajuda (formatar nota, iniciais do nome...)
```

### Montagem de uma tela

```
 main.tsx
   └── App.tsx
         └── Layout  (menu lateral + área de conteúdo)
               └── PaginaAlunos            ← página
                     ├── CabecalhoPagina   ← componente nosso
                     ├── Table, Button...  ← componentes shadcn (ui/)
                     ├── FotoPerfil        ← componente nosso
                     └── FormularioAluno   ← janela de cadastro/edição
```

---

## 5. A viagem completa de um clique

Vamos acompanhar o que acontece quando o usuário **cadastra um aluno**:

```
 1. Usuário preenche o formulário e clica em "Salvar"
        │
 2. FormularioAluno.tsx  →  chama salvarAluno(dados)
        │
 3. servicos/api.ts      →  fetch("POST /api/alunos", { corpo em JSON })
        │
 4. Vite (proxy)         →  repassa o pedido de :5173 para :3333
        │
 5. api/src/index.ts     →  "POST /api/alunos" é com alunos.criar
        │
 6. rotas/alunos.ts      →  confere campos obrigatórios
        │                    executa INSERT INTO alunos ...
        │
 7. SQLite               →  grava no arquivo academico.sqlite
        │
 8. rotas/alunos.ts      →  devolve o aluno criado (status 201)
        │
 9. FormularioAluno.tsx  →  mostra "Aluno cadastrado." e fecha a janela
        │
10. PaginaAlunos.tsx     →  busca a lista de novo e a tabela é redesenhada
```

E se der erro (CPF repetido, por exemplo)?

- O SQLite recusa (regra `UNIQUE` da tabela).
- A função `error` do `index.ts` captura e **traduz** a mensagem.
- A API responde com status `400` e `{ "erro": "Já existe um cadastro..." }`.
- O `servicos/api.ts` percebe o erro e mostra um **aviso vermelho** na tela.

---

## 6. O banco de dados

```
┌──────────────┐                                  ┌──────────────┐
│   alunos     │                                  │ professores  │
├──────────────┤                                  ├──────────────┤
│ id (PK)      │◄──┐                         ┌───►│ id (PK)      │
│ nome         │   │                         │    │ nome         │
│ cpf (único)  │   │    ┌────────────────┐   │    │ cpf (único)  │
│ matricula    │   │    │   matriculas   │   │    │ titulacao    │
│ email        │   │    ├────────────────┤   │    │ graduacao    │
│ telefone     │   └────┤ aluno_id (FK)  │   │    │ email        │
│ foto         │        │ professor_id ──┼───┘    │ telefone     │
└──────────────┘        │ disciplina_id ─┼───┐    │ foto         │
                        │ semestre       │   │    └──────────────┘
                        │ n1, n2, pf     │   │
                        │ status         │   │    ┌──────────────┐
                        └────────────────┘   │    │ disciplinas  │
                                             │    ├──────────────┤
                                             └───►│ id (PK)      │
                                                  │ nome         │
                                                  │ curso        │
                                                  │ carga_horaria│
                                                  └──────────────┘
```

- **PK** (chave primária) = o número que identifica cada linha (`id`).
- **FK** (chave estrangeira) = um campo que **aponta** para a PK de outra tabela.
- `matriculas` é uma **tabela de ligação**: um aluno pode ter várias matrículas,
  e cada matrícula aponta para **um** aluno, **um** professor e **uma** disciplina.
- Não dá para matricular o mesmo aluno **duas vezes** na mesma disciplina e semestre.
- Não dá para excluir um aluno que tem matrículas (o banco impede).

Detalhes: [docs/banco-de-dados.md](docs/banco-de-dados.md).

---

## 7. Decisões de projeto (e por quê)

| Decisão | Por quê |
| --- | --- |
| API **sem framework** (só `Bun.serve`) | Menos "mágica": dá para ver exatamente como uma rota funciona |
| **SQL puro** (sem ORM) | Você aprende SQL de verdade, que serve para qualquer linguagem |
| **SQLite** | Não precisa instalar servidor de banco; é só um arquivo |
| **Proxy do Vite** | O site chama `/api/...` como se a API estivesse no mesmo endereço (evita configurar CORS) |
| **Status calculado na API** | A regra fica num lugar só e ninguém consegue "forçar" um status errado |
| **Tipos compartilhados** | API e site sempre concordam sobre o formato dos dados |
| **Fotos em base64 no banco** | Simples: não precisa de pasta de upload |
| **Documentação com Scalar + OpenAPI escrito à mão** | Os alunos aprendem o padrão OpenAPI de verdade e ganham uma página para testar a API |
| **Scalar carregado por CDN** (`@scalar/client-side-rendering`) | Pacote leve; a interface completa teria centenas de dependências |
| **Um formulário para criar e editar** | Menos código repetido: se recebe um registro, edita; se não, cria |
| **Nomes em português** | O foco é a lógica, não a tradução |
| **Código repetido entre as páginas de cadastro** | Cada página é fácil de ler sozinha. Abstrair demais atrapalha quem está aprendendo |
