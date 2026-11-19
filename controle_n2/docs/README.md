# Documentação do Controle N2

Esta documentação explica a aplicação existente, como executá-la em casa e como estudar sua implementação. Comece pelo [README](../README.md) e use o [tutorial](../tutorial.md) para testar com alunos fictícios.

## Mapa de leitura

| Documento | Conteúdo |
| --- | --- |
| [Tutorial](../tutorial.md) | Instalação, configuração, teste dos dois perfis, comandos e problemas comuns |
| [Arquitetura](../arquitetura.md) | Fluxos entre React, HTTP, Markdown e SQLite; decisões e limites |
| [Guia de uso](uso.md) | Telas, regras de grupo, envio do GitHub e avaliação |
| [API](api.md) | Todas as rotas, permissões, corpos, respostas e erros |
| [Banco de dados](banco-de-dados.md) | Seis tabelas, relacionamentos, índices, transações e consultas |
| [Testes e exercícios](exercicios.md) | Comandos de verificação, cenários e desafios de implementação |
| [Trabalhos da N2](trabalhos.md) | Enunciados dos dez projetos em grupos de até dez integrantes |
| [Critérios de avaliação](criterios-de-avaliacao.md) | Rubrica acadêmica dos 50 pontos e procedimento das perguntas |
| [Alunos fictícios](alunos.exemplo.md) | Quinze cadastros para testar sem a lista real |
| [Mapa do código](../src/README.md) | Guias das pastas de servidor, interface e componentes |

## Dados de entrada

O servidor lê Markdown na inicialização. A pasta guarda tanto material de estudo quanto documentos que a aplicação interpreta.

| Documento | Interpretado pelo servidor? | Finalidade |
| --- | --- | --- |
| `alunos.exemplo.md` | Sim, com `CONTROLE_N2_DADOS_EXEMPLO=1` | Cadastros fictícios para login |
| `alunos.md` | Sim, no modo normal | Lista local da turma, ignorada pelo Git |
| `trabalhos.md` | Sim | Fonte dos projetos e identificadores de grupo |
| Outros documentos | Não | Explicação técnica e orientações da atividade |

### Formato da lista de alunos

```markdown
| Matrícula | Nome | Data de Nascimento |
| --- | --- | --- |
| 2610001 | ALANA BEATRIZ COSTA NOGUEIRA | 14/03/2006 |
```

A matrícula é texto numérico e pode ter zeros à esquerda. A data na tabela usa `DD/MM/AAAA`; o login HTTP usa `AAAA-MM-DD`. O leitor formata os nomes. Matrículas repetidas com os mesmos dados são deduplicadas; dados diferentes para a mesma matrícula causam erro. Uma lista sem registros reconhecidos também causa erro.

### Formato de um projeto

```markdown
## Grupo 01: Nome do grupo

### Título do projeto

Descrição do problema que a aplicação resolve.

- **Dados.** Informações que serão armazenadas.
- **Tela.** Operações da interface.
- **Regra.** Validação que a API precisa cumprir.
- **Teste.** Situação para demonstrar o comportamento.
```

Mantenha os dez grupos, de 01 a 10 em ordem, o título, a descrição e os itens nesse formato. O leitor atual usa expressões regulares próprias, não um interpretador geral de Markdown. Veja [documentos.ts](../src/servidor/documentos.ts) e [index.ts](../src/servidor/index.ts).

## Separação dos ambientes de dados

| Modo | Lista | Banco |
| --- | --- | --- |
| Exemplo (`1`) | `alunos.exemplo.md` | `exemplo.sqlite` |
| Normal (variável ausente ou diferente de `1`) | `alunos.md` | `controle_n2.sqlite` |

A lista real, o `.env` e os bancos estão cobertos pelo [`.gitignore` da raiz](../../.gitignore). Use somente cadastros fictícios nos exercícios e materiais compartilhados. O tutorial permite testar sem obter dados pessoais da turma.

O [material compartilhado](../../docs/README.md) ensina os conceitos de TypeScript, React, APIs HTTP, SQLite e Scalar usados aqui.
