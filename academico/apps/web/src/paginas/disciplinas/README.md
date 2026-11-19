# 📚 paginas/disciplinas: cadastro de disciplinas

| Arquivo | O que faz |
| --- | --- |
| [PaginaDisciplinas.tsx](PaginaDisciplinas.tsx) | Lista, busca (por nome ou curso), editar e excluir |
| [FormularioDisciplina.tsx](FormularioDisciplina.tsx) | Janela de cadastro/edição (o formulário mais simples do sistema) |

Funciona como a página de alunos (leia o [README de alunos](../alunos/README.md)).

## O que tem de diferente?

### Campo numérico

A carga horária é um **número**, mas tudo o que se digita em um `<input>` chega como
**texto**. Por isso convertemos com `Number(...)`:

```tsx
<Input
  type="number"
  min={1}
  value={dados.carga_horaria}
  onChange={(e) => setDados({ ...dados, carga_horaria: Number(e.target.value) })}
/>
```

### Sem foto

Disciplinas não têm foto, então não usamos `CampoFoto` nem `FotoPerfil`.

## 💡 Bom primeiro exercício

Por ser a página mais simples, é a melhor para praticar. Tente acrescentar um campo
**"período"** (1º, 2º, 3º...): banco → tipos → API → formulário → tabela.
