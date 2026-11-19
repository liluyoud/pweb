# SQLite com Bun

SQLite guarda os dados em um arquivo. O servidor pode ler e gravar esse arquivo com `bun:sqlite`. Para aprender ou testar, também dá para abrir um banco `:memory:`, que dura só enquanto a conexão existe.

## Transformar regras em tabelas

Identifique quais informações precisam ser guardadas. Em um cadastro didático de atividades, precisamos de um identificador estável, um título e uma indicação de conclusão. O SQLite representa esse último campo com `0` ou `1`. Uma chave permite relacionar observações a cada atividade.

```sql
CREATE TABLE IF NOT EXISTS atividades (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL CHECK (length(trim(titulo)) > 0),
  concluida INTEGER NOT NULL DEFAULT 0 CHECK (concluida IN (0, 1))
);

CREATE TABLE IF NOT EXISTS observacoes (
  id INTEGER PRIMARY KEY,
  atividade_id INTEGER NOT NULL REFERENCES atividades(id),
  texto TEXT NOT NULL
);
```

| Restrição | O que o banco verifica |
| --- | --- |
| `PRIMARY KEY` | Identifica cada linha |
| `NOT NULL` | Exige um valor diferente de `NULL` |
| `UNIQUE` | Impede repetições, inclusive de uma combinação de colunas |
| `CHECK` | Exige uma condição, como aceitar somente `0` ou `1` |
| `REFERENCES` | Exige que a linha apontada exista quando as chaves estrangeiras estão ativas |

Ative `PRAGMA foreign_keys = ON` em cada conexão, antes de iniciar uma transação. A API também valida a entrada para dar mensagens úteis. Por exemplo, `NOT NULL` aceita uma string vazia e o `CHECK` do título rejeita o texto vazio ou preenchido apenas com espaços comuns.

## Gravar e consultar com parâmetros

Salve o primeiro bloco SQL em `esquema.sql`. Na mesma pasta, crie `exemplo.ts` com o trecho abaixo e rode `bun exemplo.ts`. O banco em memória permite repetir a prática sem alterar dados de outro projeto.

```ts
import { Database } from "bun:sqlite";

const banco = new Database(":memory:");
banco.run("PRAGMA foreign_keys = ON");
banco.exec(await Bun.file(new URL("./esquema.sql", import.meta.url)).text());

const resultado = banco.query(
  "INSERT INTO atividades (titulo) VALUES (?)",
).run("Revisar uma consulta SQL");

const atividade = banco.query(
  "SELECT id, titulo, concluida FROM atividades WHERE id = ?",
).get(resultado.lastInsertRowid);

console.log(atividade);
banco.close();
```

Os `?` recebem valores na ordem em que foram escritos. Passe os valores como argumentos da consulta para manter os dados separados da instrução SQL.

| Método | Usar para |
| --- | --- |
| `.all(...)` | Buscar todas as linhas de uma consulta |
| `.get(...)` | Buscar uma linha. Retorna `null` quando nenhuma é encontrada |
| `.run(...)` | Executar `INSERT`, `UPDATE` ou `DELETE` e consultar o resultado da alteração |

## Consultar dados relacionados

`JOIN` combina linhas de tabelas a partir de uma relação. `COUNT` e `GROUP BY` ajudam a montar resumos. A consulta abaixo conta observações por atividade. O `LEFT JOIN` mantém atividades sem observações e `COUNT(o.id)` retorna zero para elas.

```sql
SELECT a.id, a.titulo, COUNT(o.id) AS total_observacoes
FROM atividades AS a
LEFT JOIN observacoes AS o ON o.atividade_id = a.id
GROUP BY a.id, a.titulo
ORDER BY a.titulo;
```

## Evoluir um banco existente

`CREATE TABLE IF NOT EXISTS` cria uma tabela ausente. Para acrescentar uma coluna em uma tabela já criada, escreva uma migração, por exemplo `ALTER TABLE atividades ADD COLUMN descricao TEXT`. Registre a ordem das migrações para que cada uma seja aplicada uma vez. Teste com um banco novo e com uma cópia de um banco antigo que já tenha registros.

Quando duas operações precisam funcionar como uma só, use uma transação. Pratique criando uma atividade e uma observação dentro da mesma transação. Force um erro na segunda gravação e verifique se a primeira foi desfeita.

- [Banco de dados do Controle Acadêmico](../academico/docs/banco-de-dados.md)
- [Banco de dados do Controle N2](../controle_n2/docs/banco-de-dados.md)
