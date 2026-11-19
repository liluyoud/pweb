# 🛣️ apps/api/src/rotas: o que cada endereço faz

Cada arquivo cuida de **um assunto**. Dentro dele, cada função atende a **uma ação**.

| Arquivo | Endereços | Funções |
| --- | --- | --- |
| [alunos.ts](alunos.ts) | `/api/alunos` | `listar`, `buscar`, `criar`, `atualizar`, `excluir` |
| [professores.ts](professores.ts) | `/api/professores` | idem |
| [disciplinas.ts](disciplinas.ts) | `/api/disciplinas` | idem |
| [matriculas.ts](matriculas.ts) | `/api/matriculas` | idem (com `JOIN` e cálculo de status) |
| [relatorios.ts](relatorios.ts) | `/api/dashboard`, `/api/relatorios/...` | `dashboard`, `desempenhoPorDisciplina`, `turmasPorProfessor` |
| [documentacao.ts](documentacao.ts) | `/api/openapi.json`, `/api/docs` | `openapi`, `paginaDocumentacao` (Scalar) |
| [ajudantes.ts](ajudantes.ts) | (nenhum) | Funções de apoio usadas por todas as rotas |

## 👉 Comece por `alunos.ts`

Ele é o **modelo**. `professores.ts` e `disciplinas.ts` são praticamente cópias dele,
trocando os campos. Entendeu um, entendeu os três.

## A receita de uma rota

Toda função de rota segue os mesmos passos:

```ts
export async function criar(req: BunRequest) {
  // 1. Ler os dados enviados
  const dados = (await req.json()) as NovoAluno;

  // 2. Validar
  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) {
    return erro(problema);            // responde 400 e para aqui
  }

  // 3. Executar o SQL
  const resultado = banco.query("INSERT INTO ...").run(...);

  // 4. Responder
  return Response.json(alunoCriado, { status: 201 });
}
```

## Por que as funções têm nomes iguais em todos os arquivos?

Porque no `index.ts` importamos assim:

```ts
import * as alunos from "./rotas/alunos";
import * as professores from "./rotas/professores";
```

E aí fica bem legível: `alunos.listar`, `professores.listar`, `disciplinas.criar`...

## E o `documentacao.ts`?

É a única rota que responde **HTML** em vez de JSON: ela entrega a página do
**Scalar** (`/api/docs`). Lembre: **criou uma rota nova? Documente também** em
[../documentacao/openapi.ts](../documentacao/openapi.ts). Veja
[guia do Scalar](../../../../../docs/scalar.md).

## E o `ajudantes.ts`?

Funções pequenas que **todas** as rotas usam. Assim não repetimos código:

| Função | Para que serve |
| --- | --- |
| `erro(mensagem, status)` | Monta uma resposta de erro `{ "erro": "..." }` |
| `verificarObrigatorios(dados, campos)` | Confere se os campos vieram preenchidos |
| `paraNota(valor)` | Converte o valor do formulário em número ou `null` |
| `traduzirErroDoBanco(mensagem)` | Traduz erros do SQLite para português |
