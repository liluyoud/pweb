# 📡 apps/web/src/servicos: conversa com a API

| Arquivo | O que faz |
| --- | --- |
| [api.ts](api.ts) | Todas as funções que buscam ou enviam dados para a API |

## Por que essa pasta existe?

Para que as **telas não precisem saber** como a API funciona por dentro.

Uma página só faz:

```ts
const lista = await listarAlunos();
```

Ela não sabe (nem precisa saber) que isso vira um `fetch("GET /api/alunos")`.
Se um dia o endereço da API mudar, mexemos **só neste arquivo**.

## A função base: `requisicao`

Todas as outras funções usam ela. Ela:

1. Faz o pedido com `fetch`.
2. Converte a resposta de JSON para objeto.
3. Se deu erro (status 400, 404...), **mostra um aviso vermelho** na tela e
   **lança um erro** (para quem chamou parar ali).

Por isso, nas páginas, o `try/catch` fica assim:

```ts
try {
  await salvarAluno(dados, aluno?.id);
  toast.success("Aluno cadastrado.");   // só chega aqui se deu certo
} catch {
  // a mensagem de erro já foi mostrada pelo servicos/api.ts
}
```

## As funções

| Assunto | Funções |
| --- | --- |
| Alunos | `listarAlunos`, `salvarAluno`, `excluirAluno` |
| Professores | `listarProfessores`, `salvarProfessor`, `excluirProfessor` |
| Disciplinas | `listarDisciplinas`, `salvarDisciplina`, `excluirDisciplina` |
| Matrículas | `listarMatriculas`, `salvarMatricula`, `excluirMatricula` |
| Painéis | `buscarDashboard`, `relatorioDisciplinas`, `relatorioProfessores` |

### Por que `salvar` e não `criar` + `atualizar`?

```ts
export function salvarAluno(dados: NovoAluno, id?: number) {
  if (id) {
    return requisicao("/alunos/" + id, "PUT", dados);   // tem id → atualiza
  }
  return requisicao("/alunos", "POST", dados);          // sem id → cria
}
```

Assim o formulário chama **sempre a mesma função**, tanto para criar quanto para editar.

## E o `Promise<Aluno[]>`?

```ts
export function listarAlunos(): Promise<Aluno[]> { ... }
```

Quer dizer: "esta função vai devolver, **no futuro**, uma lista de alunos".
Uma `Promise` é uma "promessa" de valor. Por isso usamos `await` para esperar por ele.
