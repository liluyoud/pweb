# Banco de dados do Controle Acadêmico

O [guia de SQLite](../../docs/banco-de-dados.md) apresenta os conceitos usados nesta referência.

Usamos o **SQLite**: um banco de dados que fica **inteiro em um arquivo**
(`apps/api/academico.sqlite`). Não precisa instalar nada; o Bun já sabe usá-lo.

Com o arquivo criado, você pode abrir `academico.sqlite` em um visualizador de SQLite
para consultar as tabelas e os dados.

---

## 1. As tabelas

### `alunos`

| Coluna | Tipo | Regras |
| --- | --- | --- |
| `id` | INTEGER | Chave primária, criada automaticamente |
| `nome` | TEXT | Obrigatório |
| `cpf` | TEXT | Obrigatório, **único** |
| `matricula` | TEXT | Obrigatório, **único** |
| `email` | TEXT | Obrigatório |
| `telefone` | TEXT | Padrão: vazio |
| `foto` | TEXT | Imagem em base64 ou `NULL` |

### `professores`

| Coluna | Tipo | Regras |
| --- | --- | --- |
| `id` | INTEGER | Chave primária |
| `nome` | TEXT | Obrigatório |
| `cpf` | TEXT | Obrigatório, **único** |
| `titulacao` | TEXT | Obrigatório (Especialista, Mestre, Doutor...) |
| `graduacao` | TEXT | Obrigatório (curso de formação) |
| `email` | TEXT | Obrigatório |
| `telefone` | TEXT | Padrão: vazio |
| `foto` | TEXT | Imagem em base64 ou `NULL` |

### `disciplinas`

| Coluna | Tipo | Regras |
| --- | --- | --- |
| `id` | INTEGER | Chave primária |
| `nome` | TEXT | Obrigatório |
| `curso` | TEXT | Obrigatório |
| `carga_horaria` | INTEGER | Obrigatório, maior que zero |

### `matriculas` (tabela de ligação)

| Coluna | Tipo | Regras |
| --- | --- | --- |
| `id` | INTEGER | Chave primária |
| `aluno_id` | INTEGER | **FK** → `alunos.id` |
| `professor_id` | INTEGER | **FK** → `professores.id` |
| `disciplina_id` | INTEGER | **FK** → `disciplinas.id` |
| `semestre` | TEXT | Ex.: `2026.1` |
| `n1`, `n2`, `pf` | REAL | Entre 0 e 10 (podem ficar vazias) |
| `status` | TEXT | Calculado pela API. O valor padrão no banco é `cursando` |
| | | **Único:** (`aluno_id`, `disciplina_id`, `semestre`) |

---

## 2. Relacionamentos

```
alunos      1 ──── N  matriculas
professores 1 ──── N  matriculas
disciplinas 1 ──── N  matriculas
```

Lê-se: "um aluno pode ter **muitas** (N) matrículas; cada matrícula pertence a **um** aluno".

A tabela `matriculas` é o que liga **aluno × professor × disciplina**.

---

## 3. Regras que o próprio banco garante

| Regra no SQL | O que impede |
| --- | --- |
| `NOT NULL` | Salvar `NULL` em um campo obrigatório |
| `UNIQUE` | Dois alunos com o mesmo CPF; o mesmo aluno duas vezes na mesma disciplina e semestre |
| `CHECK (n1 BETWEEN 0 AND 10)` | Nota 11 ou -1 |
| `REFERENCES` (chave estrangeira) | Matricular um aluno que não existe; excluir um aluno que tem matrículas |

> ⚠️ No SQLite, as chaves estrangeiras vêm **desligadas**. Por isso o arquivo
> `conexao.ts` roda `PRAGMA foreign_keys = ON`.

---

## 4. O SQL usado no projeto

### Criar tabela

```sql
CREATE TABLE IF NOT EXISTS disciplinas (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nome          TEXT NOT NULL,
  curso         TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria > 0)
);
```

### CRUD

```sql
-- Listar
SELECT * FROM alunos ORDER BY nome;

-- Buscar um
SELECT * FROM alunos WHERE id = ?;

-- Criar
INSERT INTO alunos (nome, cpf, matricula, email) VALUES (?, ?, ?, ?);

-- Atualizar
UPDATE alunos SET nome = ?, email = ? WHERE id = ?;

-- Excluir
DELETE FROM alunos WHERE id = ?;
```

### Os `?` (parâmetros)

Os `?` são **lugares reservados** que o Bun preenche, em ordem, com os valores:

```ts
banco.query("SELECT * FROM alunos WHERE id = ?").get(7);
```

Use parâmetros para todos os valores recebidos pela API. Assim o SQLite trata
o conteúdo recebido como dado e mantém a estrutura da consulta.

### JOIN: juntar tabelas

Para mostrar o **nome** do aluno na lista de matrículas (e não só o `aluno_id`):

```sql
SELECT m.*, a.nome AS aluno_nome
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id;
```

📍 [apps/api/src/rotas/matriculas.ts](../apps/api/src/rotas/matriculas.ts)

### GROUP BY: resumir

Quantas matrículas em cada semestre?

```sql
SELECT semestre, COUNT(*) AS total
FROM matriculas
GROUP BY semestre;
```

Contar aprovados dentro de um grupo:

```sql
SUM(CASE WHEN status = 'aprovado' THEN 1 ELSE 0 END) AS aprovados
```

📍 [apps/api/src/rotas/relatorios.ts](../apps/api/src/rotas/relatorios.ts)

---

## 5. Comandos do Bun para SQLite

| Código | O que faz |
| --- | --- |
| `new Database("arquivo.sqlite")` | Abre (ou cria) o banco |
| `banco.run("SQL")` | Executa um comando sem parâmetros |
| `banco.query("SQL").all(...)` | Devolve **todas** as linhas |
| `banco.query("SQL").get(...)` | Devolve **uma** linha (ou `null`) |
| `banco.query("SQL").run(...)` | Executa INSERT/UPDATE/DELETE. Devolve `lastInsertRowid` e `changes` |

