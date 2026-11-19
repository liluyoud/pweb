# Exercícios do Controle Acadêmico

Para praticar os mesmos conceitos em outro projeto, consulte a [trilha compartilhada](../../docs/exercicios.md).

Desafios para praticar, do mais fácil ao mais difícil. Para cada um, há uma
**dica** de por onde começar.

---

## 🟢 Nível 1: aquecimento

**1. Mude a cor do menu ativo.**
Dica: `classesDoLink` em `apps/web/src/components/Layout.tsx`.

**2. Mude a média de aprovação para 6.**
Dica: `apps/api/src/regras/notas.ts`. Em um banco de exercícios, atualize uma matrícula fictícia com média entre 6 e 7 para que a API recalcule a situação. Confira o resultado no dashboard e atualize o texto de ajuda em `FormularioMatricula.tsx`.

**3. Adicione mais um aluno e uma disciplina nos dados de exemplo.**
Dica: `apps/api/src/banco/popular.ts`.

**4. Adicione a titulação "Livre-Docente" na lista de opções.**
Dica: `TITULACOES` em `FormularioProfessor.tsx`.

---

## 🟡 Nível 2: mexendo em uma camada

**5. Mostre a quantidade de registros abaixo de cada tabela.**
Ex.: "8 alunos". Dica: `alunosFiltrados.length`.

**6. Busca por CPF.**
Na página de alunos, faça a busca também encontrar pelo CPF.
Dica: o `.filter` em `PaginaAlunos.tsx`.

**7. Novo cartão no dashboard: "Alunos sem matrícula".**
Dica: na API, use
`SELECT COUNT(*) FROM alunos WHERE id NOT IN (SELECT aluno_id FROM matriculas)`.
Depois acrescente o campo no tipo `Dashboard` em `packages/tipos/index.ts`.
Repare como o TypeScript aponta onde ajustar!

**8. Coluna "Média final" nas matrículas.**
Quando houver PF, mostre `(média + PF) / 2`. Dica: crie uma função em `lib/formatar.ts`.

**9. Filtro por disciplina na API.**
Já existe `?aluno_id=`. Crie também `?disciplina_id=`.
Dica: `listar` em `apps/api/src/rotas/matriculas.ts`. Documente o novo filtro em
`FILTROS_MATRICULAS` (`apps/api/src/documentacao/openapi.ts`) e confira no Scalar.

**9b. Melhore a documentação.**
No `openapi.ts`, acrescente uma `description` em cada grupo (`tags`) e um exemplo de
erro 404. Recarregue http://localhost:3333/api/docs e veja o resultado.

---

## 🟠 Nível 3: atravessando o sistema inteiro

Estes exercícios exigem mexer no **banco**, na **API**, nos **tipos** e no **site**.

**10. Campo "data de nascimento" no aluno.**
Passos: `criar-tabelas.ts` → `packages/tipos/index.ts` → `rotas/alunos.ts` (INSERT e UPDATE)
→ `FormularioAluno.tsx` (use `<Input type="date" />`) → tabela da `PaginaAlunos.tsx`.
Para um banco já criado, aplique uma migração em uma cópia de exercícios e confira que os registros anteriores continuam acessíveis. Veja o [guia de SQLite](../../docs/banco-de-dados.md).

**11. Relatório "Ranking de alunos".**
Lista de alunos ordenada pela média geral de cada um.
Passos: nova rota em `relatorios.ts` → registrar em `index.ts` → novo tipo →
nova função em `servicos/api.ts` → nova aba em `PaginaRelatorios.tsx` →
documentar em `documentacao/openapi.ts`. Use o exemplo do [guia do Scalar](../../docs/scalar.md).

**12. Validação de CPF.**
Na API, recuse CPFs que não tenham 11 dígitos (ignorando pontos e traço).
Dica: `cpf.replace(/\D/g, "")` remove tudo que não é número.

**13. Nova entidade: Cursos.**
Hoje o curso é um texto livre na disciplina. Crie a tabela `cursos` (id, nome) e
troque `disciplinas.curso` por `curso_id`. É o exercício mais completo: CRUD inteiro,
do banco à tela.

---

## 🔴 Nível 4: para quem quer ir além

**14. Paginação.** Faça a API devolver 10 alunos por vez (`?pagina=2`) usando
`LIMIT` e `OFFSET`, e coloque botões "Anterior/Próxima" na tela.

**15. Modo escuro.** O tema do shadcn já tem as cores escuras (classe `.dark` no
`index.css`). Crie um botão no menu que liga/desliga a classe `dark` no `<html>`.

**16. Exportar boletim.** Na aba "Boletim do aluno", crie um botão que chama
`window.print()` e use as classes `print:hidden` do Tailwind para esconder o menu
na impressão.

**17. Testes automáticos.** Crie `apps/api/src/regras/notas.test.ts` testando a
função `calcularStatus` e rode com `bun test`. Exemplo:

```ts
import { expect, test } from "bun:test";
import { calcularStatus } from "./notas";

test("média 7 aprova direto", () => {
  expect(calcularStatus(7, 7, null)).toBe("aprovado");
});
```
