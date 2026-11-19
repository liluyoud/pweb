# 🗄️ apps/api/src/banco: o banco de dados

Tudo o que diz respeito a **guardar dados** fica aqui.

| Arquivo | O que faz |
| --- | --- |
| [conexao.ts](conexao.ts) | Abre o arquivo `academico.sqlite` e exporta a variável `banco`, usada por todas as rotas |
| [criar-tabelas.ts](criar-tabelas.ts) | O SQL `CREATE TABLE` das quatro tabelas. Roda toda vez que a API liga |
| [popular.ts](popular.ts) | Script que **apaga tudo** e insere dados de exemplo (`bun run banco:popular`) |

## Por que essa pasta existe?

Para **isolar** o banco do resto do código. As rotas só precisam fazer:

```ts
import { banco } from "../banco/conexao";
```

e já podem consultar. Se um dia trocarmos o SQLite por outro banco, a maior parte da
mudança fica concentrada aqui.

## Onde fica o arquivo do banco?

Em `apps/api/academico.sqlite`. Ele é criado **sozinho** na primeira vez que a API liga.

- Quer ver os dados? Use a extensão **SQLite Viewer** do VS Code.
- Quer recomeçar do zero? Apague o arquivo.
- O [`.gitignore` da raiz](../../../../../.gitignore) exclui o banco local do versionamento.

## Atenção: mudando uma tabela

`CREATE TABLE IF NOT EXISTS` cria tabelas ausentes. Para aplicar uma mudança a uma
tabela já existente e preservar seus dados, use uma migração. Veja o
[guia de SQLite](../../../../../docs/banco-de-dados.md).

Mais detalhes sobre as tabelas: [docs/banco-de-dados.md](../../../../docs/banco-de-dados.md).
