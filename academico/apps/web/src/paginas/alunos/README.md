# 👩‍🎓 paginas/alunos: cadastro de alunos

> ⭐ **Esta é a página modelo.** As páginas de professores, disciplinas e
> matrículas funcionam do mesmo jeito. Leia esta com calma.

| Arquivo | O que faz |
| --- | --- |
| [PaginaAlunos.tsx](PaginaAlunos.tsx) | Lista os alunos, com busca, e os botões de novo/editar/excluir |
| [FormularioAluno.tsx](FormularioAluno.tsx) | Janela usada para **cadastrar** e para **editar** |

## Como a página funciona

```
Página abre
   │
   ├─► useEffect chama carregarAlunos()
   │        └─► listarAlunos() (servicos/api.ts) → GET /api/alunos
   │                 └─► setAlunos(lista) → a tabela aparece
   │
Usuário digita na busca
   └─► setBusca(texto) → a lista é filtrada → a tabela é redesenhada

Clica em "Novo aluno"         → abre o formulário VAZIO
Clica no lápis               → abre o formulário PREENCHIDO
Clica na lixeira → confirma  → excluirAluno(id) → recarrega a lista
```

## Os estados da página

| Estado | Guarda |
| --- | --- |
| `alunos` | A lista que veio da API |
| `busca` | O texto digitado na caixa de busca |
| `formularioAberto` | Se a janela do formulário está aberta |
| `alunoEmEdicao` | O aluno sendo editado (ou `null` se for um cadastro novo) |

## Um formulário para duas tarefas

O `FormularioAluno` recebe a prop `aluno`:

- `aluno = null` → título "Novo aluno", campos vazios, faz **POST**.
- `aluno = {...}` → título "Editar aluno", campos preenchidos, faz **PUT**.

Quem decide entre POST e PUT é a função `salvarAluno(dados, id)` em `servicos/api.ts`.

## A foto

O componente `CampoFoto` lê a imagem escolhida e a transforma em **texto base64**.
Esse texto vai junto com os outros dados para a API e é salvo no banco.
Limite: 500 KB por imagem.
