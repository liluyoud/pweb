# API do Controle Acadêmico

O [guia de APIs HTTP](../../docs/api.md) explica métodos, códigos de status e como testar uma rota.

O servidor local fica em `http://localhost:3333`. Os caminhos das rotas começam com `/api`.

As rotas de dados respondem em **JSON**. Quando há um erro, a resposta tem o formato abaixo.

```json
{ "erro": "Mensagem explicando o problema." }
```

> 📖 **Documentação interativa:** com a API ligada, abra
> **http://localhost:3333/api/docs**. Lá dá para ver e **testar** todos os endereços
> desta página. Veja o [guia do Scalar](../../docs/scalar.md).

> 💡 Os pedidos `GET` também podem ser testados direto no navegador. Para os outros
> (`POST`, `PUT`, `DELETE`), use o Scalar, o terminal (`curl` / `Invoke-RestMethod`)
> ou uma extensão como **Thunder Client** ou **REST Client** no VS Code.

---

## Alunos

| Método | Endereço | Corpo (JSON) | Resposta |
| --- | --- | --- | --- |
| GET | `/api/alunos` | | Lista de alunos |
| GET | `/api/alunos/:id` | | Um aluno, ou 404 |
| POST | `/api/alunos` | Aluno sem `id` | Aluno criado (201) |
| PUT | `/api/alunos/:id` | Aluno sem `id` | Aluno atualizado |
| DELETE | `/api/alunos/:id` | | `{ "mensagem": "Aluno excluído." }` |

Exemplo de corpo:

```json
{
  "nome": "Ana Beatriz Souza",
  "cpf": "111.111.111-11",
  "matricula": "2026001",
  "email": "ana@email.com",
  "telefone": "(69) 99901-0001",
  "foto": null
}
```

Obrigatórios: `nome`, `cpf`, `matricula`, `email`.

---

## Professores

Mesmos endereços, trocando `alunos` por `professores`.

```json
{
  "nome": "Marcos Teixeira",
  "cpf": "123.456.789-01",
  "titulacao": "Doutor",
  "graduacao": "Ciência da Computação",
  "email": "marcos@faculdade.edu.br",
  "telefone": "(69) 98800-1001",
  "foto": null
}
```

Obrigatórios: `nome`, `cpf`, `titulacao`, `graduacao`, `email`.

---

## Disciplinas

Mesmos endereços, trocando por `disciplinas`.

```json
{ "nome": "Programação Web", "curso": "Ciência da Computação", "carga_horaria": 80 }
```

Obrigatórios: todos.

---

## Matrículas

Mesmos endereços, trocando por `matriculas`.

```json
{
  "aluno_id": 1,
  "professor_id": 2,
  "disciplina_id": 3,
  "semestre": "2026.1",
  "n1": 7.5,
  "n2": 8,
  "pf": null
}
```

- Obrigatórios: `aluno_id`, `professor_id`, `disciplina_id`, `semestre`.
- Notas podem ser `null` (ainda não lançadas).
- O `status` **não é enviado**: a API calcula.

A listagem aceita **filtros** na URL:

| Exemplo | Resultado |
| --- | --- |
| `/api/matriculas?aluno_id=1` | Só as matrículas do aluno 1 (boletim) |
| `/api/matriculas?semestre=2026.1` | Só as do semestre 2026.1 |

Cada matrícula da lista vem com os nomes já preenchidos:

```json
{
  "id": 11, "aluno_id": 1, "professor_id": 2, "disciplina_id": 2,
  "semestre": "2026.1", "n1": 9.5, "n2": 9, "pf": null, "status": "aprovado",
  "aluno_nome": "Ana Beatriz Souza",
  "professor_nome": "Patrícia Gomes Ribeiro",
  "disciplina_nome": "Programação Web"
}
```

---

## Dashboard e relatórios

| Método | Endereço | Resposta |
| --- | --- | --- |
| GET | `/api/dashboard` | Totais, média geral, taxa de aprovação, situação, matrículas por semestre, melhores disciplinas |
| GET | `/api/relatorios/disciplinas` | Por disciplina e semestre: total, aprovados, reprovados, cursando, média |
| GET | `/api/relatorios/professores` | Por professor, disciplina e semestre: total de alunos e média |

Exemplo de `/api/dashboard`:

```json
{
  "totais": { "alunos": 8, "professores": 4, "disciplinas": 6, "matriculas": 26 },
  "media_geral": 6.81,
  "taxa_aprovacao": 80,
  "situacao": [
    { "rotulo": "aprovado", "valor": 16 },
    { "rotulo": "cursando", "valor": 6 },
    { "rotulo": "reprovado", "valor": 4 }
  ],
  "matriculas_por_semestre": [{ "rotulo": "2025.2", "valor": 10 }],
  "melhores_disciplinas": [{ "rotulo": "Banco de Dados", "valor": 7.63 }]
}
```

---

## Documentação

| Método | Endereço | Resposta |
| --- | --- | --- |
| GET | `/api/docs` | Página HTML da documentação interativa (Scalar) |
| GET | `/api/openapi.json` | A descrição da API no formato OpenAPI |

---

## Erros comuns

| Situação | Status | Mensagem |
| --- | --- | --- |
| Campo obrigatório vazio | 400 | `O campo "nome" é obrigatório.` |
| CPF/matrícula repetidos | 400 | `Já existe um cadastro com esses dados...` |
| Excluir registro com matrículas | 400 | `Não é possível concluir: este registro está ligado...` |
| Nota fora de 0 a 10 | 400 | `Valor inválido: as notas devem ficar entre 0 e 10...` |
| `id` que não existe | 404 | `Aluno não encontrado.` |
| Endereço que não existe | 404 | `Rota não encontrada.` |
