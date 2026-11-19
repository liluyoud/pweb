# Material de estudo de Programação Web

Esta pasta reúne os guias que servem ao Controle Acadêmico e ao Controle N2. Os exemplos usam um cadastro fictício de atividades para demonstrar como a interface, a API e o banco conversam.

```text
Navegador (React + shadcn/ui) → API HTTP (Bun + TypeScript) → SQLite
Navegador recebe JSON        ← API monta a resposta       ← SQLite devolve dados
```

## Ordem de estudo

| Ordem | Guia | O que você vai praticar |
| --- | --- | --- |
| 1 | [Glossário](glossario.md) | Consultar os termos usados nos guias |
| 2 | [TypeScript básico](typescript-basico.md) | Modelar dados, escrever funções e validar respostas |
| 3 | [React básico](react-basico.md) | Montar componentes, formulários, listas e telas com dados da API |
| 4 | [SQLite com Bun](banco-de-dados.md) | Criar tabelas, consultar dados e evoluir o esquema |
| 5 | [APIs HTTP com Bun](api.md) | Montar uma rota local e entender requisições e respostas |
| 6 | [Scalar e OpenAPI](scalar.md) | Descrever o contrato da API e testar operações no navegador |
| 7 | [Exercícios](exercicios.md) | Praticar em cada camada e ligar a tela ao banco |

Você pode fazer o cadastro em memória no guia de React e voltar à parte de integração depois de subir a API. Para rodar os exemplos de servidor e banco, tenha o Bun instalado. O exemplo de interface pode ser copiado para um projeto React com TypeScript.

## Documentação dos projetos

- [Controle Acadêmico](../academico/docs/README.md) reúne a referência da aplicação existente, com suas rotas, tabelas e exercícios.
- [Publicação no Dokploy](dokploy.md) explica como subir os dois sistemas em `pweb.computacao.cloud/avaliacao` e `/n2` com Docker Compose.
- [Controle N2](../controle_n2/docs/README.md) reúne tutorial para testar em casa, arquitetura, guia de uso, API, banco de dados e exercícios do sistema de grupos e avaliações da N2.
