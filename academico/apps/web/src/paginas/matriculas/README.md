# 📝 paginas/matriculas: matrículas e notas

| Arquivo | O que faz |
| --- | --- |
| [PaginaMatriculas.tsx](PaginaMatriculas.tsx) | Lista com notas, média e status; busca e filtro por semestre |
| [FormularioMatricula.tsx](FormularioMatricula.tsx) | Escolhe aluno, disciplina, professor e semestre; lança as notas |

Segue o mesmo padrão da página de alunos, mas é a mais **completa**, porque a matrícula
**liga** três outras tabelas.

## O que tem de diferente?

### 1. O formulário busca três listas

Para preencher os Selects, o formulário pede à API os alunos, professores e
disciplinas assim que abre:

```tsx
useEffect(() => {
  async function carregarListas() {
    setAlunos(await listarAlunos());
    setProfessores(await listarProfessores());
    setDisciplinas(await listarDisciplinas());
  }
  carregarListas();
}, []);
```

### 2. Select trabalha com texto; o banco, com número

```tsx
value={String(dados.aluno_id)}                                     // número → texto
onValueChange={(valor) => setDados({ ...dados, aluno_id: Number(valor) })}  // texto → número
```

### 3. Nota vazia = `null`

Um campo de nota vazio significa "ainda não lançada". A função `lerNota` converte
`""` em `null`, e o campo mostra vazio com `value={dados.n1 ?? ""}`.

### 4. O status NÃO é digitado

O usuário só informa as notas. Quem decide se é aprovado, reprovado ou cursando é a
**API**, com a regra em [api/src/regras/notas.ts](../../../../api/src/regras/notas.ts).
Assim, ninguém consegue "forçar" um status errado.

### 5. A média é calculada na tela

A coluna "Média" usa `calcularMedia(n1, n2)` de `lib/formatar.ts`. Ela não é salva no
banco: é sempre calculada na hora a partir das notas.

### 6. Filtro por semestre

A lista de semestres do filtro é montada a partir dos dados, **sem repetição**:

```ts
const semestresExistentes = [...new Set(matriculas.map((m) => m.semestre))];
```

`new Set(...)` é uma estrutura que não aceita itens repetidos.
