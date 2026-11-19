# 👨‍🏫 paginas/professores: cadastro de professores

| Arquivo | O que faz |
| --- | --- |
| [PaginaProfessores.tsx](PaginaProfessores.tsx) | Lista, busca, editar e excluir |
| [FormularioProfessor.tsx](FormularioProfessor.tsx) | Janela de cadastro/edição |

Funciona **exatamente** como a página de alunos (leia o
[README de alunos](../alunos/README.md) primeiro).

## O que tem de diferente?

### Campo de seleção (Select) para a titulação

Em vez de digitar, o usuário **escolhe** em uma lista. Isso evita variações como
"doutor", "Dr.", "Doutor(a)":

```tsx
const TITULACOES = ["Graduado", "Especialista", "Mestre", "Doutor", "Pós-Doutor"];

<Select value={dados.titulacao} onValueChange={(valor) => setDados({ ...dados, titulacao: valor })}>
  ...
  {TITULACOES.map((titulacao) => (
    <SelectItem key={titulacao} value={titulacao}>{titulacao}</SelectItem>
  ))}
</Select>
```

Para incluir uma nova titulação, basta acrescentar na lista `TITULACOES`.

### Badge na tabela

A titulação aparece como uma etiqueta (`<Badge>`) para destacar visualmente.
