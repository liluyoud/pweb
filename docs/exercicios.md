# Exercícios de programação web

Use dados fictícios e siga os exercícios na ordem abaixo. Os exemplos dos guias usam um pequeno cadastro de atividades. Para praticar em um projeto, escolha uma entidade já prevista na especificação dele.

| Exercício | Por onde começar | Como conferir |
| --- | --- | --- |
| 1. Tipar um cadastro | No [guia de TypeScript](typescript-basico.md), descreva o registro salvo e derive o tipo de criação com `Omit` | O editor aceita o cadastro sem `id` e acusa um título numérico |
| 2. Buscar em uma lista | No [guia de React](react-basico.md), acrescente registros fictícios e use `startsWith` para buscar pelo começo do título | Texto vazio mostra todos. Uma busca sem correspondência mostra uma mensagem |
| 3. Escrever uma consulta | No [guia de SQLite](banco-de-dados.md), insira duas atividades e consulte pelo `id` com um parâmetro | Cada identificador devolve a atividade correspondente. Um ID ausente devolve `null` |
| 4. Testar uma rota | No [guia de API](api.md), faça um `GET` com a API local ligada | Registre o status e o corpo de uma rota existente e de uma rota ausente |
| 5. Salvar da tela até o banco | Ligue um formulário React a uma rota `POST`. Valide na API antes de executar o `INSERT` | Um cadastro válido permanece após reiniciar a API. Um título vazio gera um erro e nenhuma linha nova |
| 6. Documentar o contrato | No [guia do Scalar](scalar.md), descreva a rota e experimente seus exemplos | A documentação mostra os mesmos campos e códigos HTTP que a API devolve |
| 7. Evoluir o esquema | Adicione uma coluna opcional com uma migração e exponha o campo pela API | Um registro antigo continua acessível e um cadastro novo pode preencher a coluna |

## Entrega sugerida

Para cada exercício, anote os arquivos modificados, o caso de sucesso e o caso de erro que você verificou. Se o resultado não sair como esperado, registre em qual camada ele mudou. Comece pelo painel Rede do navegador, confira o corpo enviado à API e compare a resposta com os dados do SQLite.

- [Exercícios do Controle Acadêmico](../academico/docs/exercicios.md)
- [Exercícios do Controle N2](../controle_n2/docs/exercicios.md)
