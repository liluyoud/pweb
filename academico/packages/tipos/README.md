# 🏷️ packages/tipos: os tipos compartilhados

Este pacote descreve o **formato de cada informação** do sistema. Ele é o "cardápio"
que a API (cozinha) e o site (garçom) consultam para falar a mesma língua.

| Arquivo | O que tem |
| --- | --- |
| [index.ts](index.ts) | Todos os tipos do sistema |
| `package.json` | Dá o nome `@academico/tipos` ao pacote |

## Os tipos

| Tipo | Representa |
| --- | --- |
| `Aluno`, `Professor`, `Disciplina` | Um registro de cada tabela |
| `Matricula` | Uma linha da tabela de matrículas |
| `MatriculaDetalhada` | Matrícula + nomes do aluno, professor e disciplina |
| `StatusMatricula` | `"aprovado"`, `"reprovado"` ou `"cursando"` |
| `NovoAluno`, `NovoProfessor`, `NovaDisciplina`, `NovaMatricula` | Os dados do formulário (sem `id`) |
| `Dashboard`, `ItemGrafico` | A resposta do dashboard |
| `LinhaDesempenhoDisciplina`, `LinhaTurmaProfessor` | Uma linha de cada relatório |

## Quem usa?

- **API** (`apps/api/src/rotas/*.ts`): para saber o formato dos dados que chegam.
- **Site** (`apps/web/src/...`): para os estados, as props e as funções de `servicos/api.ts`.

## Uma observação importante

Tipos **só existem enquanto você programa**. Quando o código roda, eles somem.
Por isso o TypeScript **não impede** a API de receber dados errados pela rede.
É por isso que a API ainda confere os campos com `verificarObrigatorios`.

> Os tipos protegem **você** (o programador) de errar.
> As validações protegem o **sistema** de dados errados.

## Recursos de TypeScript usados aqui

Este arquivo usa `|` (ou), `&` (juntar tipos) e `Omit<>` (tirar um campo).
Consulte o [guia de TypeScript](../../../docs/typescript-basico.md).
