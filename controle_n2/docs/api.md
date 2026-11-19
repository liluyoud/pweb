# API do Controle N2

A interface e a API usam `http://127.0.0.1:3400`. A documentação interativa está em [`/docs`](http://127.0.0.1:3400/docs) e a especificação OpenAPI em [`/api/openapi.json`](http://127.0.0.1:3400/api/openapi.json).

O catálogo pode ser consultado sem login e é a operação disponível para teste no Scalar. As alterações de grupo e de repositório são feitas pela interface. O servidor fornece a `APP_KEY` internamente e confere a origem, a sessão e as permissões. A chave fica no `.env` local.

| Método e rota | Corpo | Resultado |
| --- | --- | --- |
| `GET /api/grupos` | — | `200` com projetos, ocupação e repositórios, sem dados pessoais |
| `POST /api/sessao` | `{ "matricula": "2610001", "nascimento": "2006-03-14" }` | `200`, cookie de sessão e painel do aluno ou professor |
| `GET /api/painel` | — | `200` com o painel do perfil autenticado |
| `PUT /app/meu-grupo` | `{ "grupoId": 2 }` | `200` com o painel atualizado pela interface |
| `PUT /app/meu-grupo/repositorio` | `{ "grupoId": 2, "link": "https://github.com/turma/projeto" }` | `200` com o painel atualizado após salvar ou substituir o link pela interface |
| `PUT /app/professor/sorteio` | — | `200` com o grupo sorteado no painel do professor |
| `PUT /app/professor/avaliacao` | `{ "grupoId": 2 }` | `200` com a avaliação iniciada para o grupo sorteado |
| `PUT /app/professor/dupla` | `{ "grupoId": 2 }` | `200` com a dupla da avaliação ativa |
| `DELETE /api/sessao` | — | `200` com encerramento da sessão e limpeza do cookie |

O painel do aluno devolve `perfil: "aluno"`, `nome`, `grupoAtual` (número ou `null`) e `grupos`. Cada grupo traz `id`, `nome`, `titulo`, `descricao`, `detalhes`, `ocupacao`, `limite` e `integrantes`. A lista de integrantes contém os nomes formatados, em ordem alfabética. A sessão tem validade de oito horas.

O painel do professor devolve `perfil: "professor"`, `grupos`, `auditoria` (com os eventos mais recentes primeiro) e `alunosSemGrupo` (nome e matrícula de quem ainda não tem grupo). A matrícula e a data de nascimento de acesso do professor são configuradas no `.env`.

O campo `avaliacaoAtual` é `null` antes do primeiro sorteio. Uma seleção contém `grupoId` e `estado` (`sorteado` ou `em_avaliacao`). O sorteio retorna `409` quando não há grupos disponíveis com integrantes. Iniciar exige o grupo sorteado e retorna `409` se a seleção não estiver disponível.

Após iniciar a avaliação, `avaliacaoAlunos` contém `integrantes`, com os nomes e matrículas dos alunos do grupo, e `dupla`, com `principal` e `assistente`. Antes do sorteio, `dupla` é `null`. Em um grupo com um único integrante, `assistente` é `null`. O sorteio usa os integrantes registrados no início e conserva a dupla em chamadas repetidas.

O campo `colegasDoGrupo` traz os nomes dos demais integrantes do grupo atual, em ordem alfabética. A lista fica vazia se o aluno estiver sem grupo ou for o único integrante.

Os erros devolvem `{ "erro": "mensagem" }`. A API devolve `400` para dados inválidos, `401` para credenciais ou sessão inválidas, `403` para origem inválida ou perfil sem permissão, `404` para rota inexistente, `409` se o grupo estiver cheio ou o aluno não pertencer ao grupo indicado e `429` após várias tentativas de acesso.

Cada item de `grupos` traz `repositorioGithub` para todos os alunos autenticados. O valor é `null` até que um integrante envie o link. No nível principal do painel, `repositorioGithub` continua indicando o link do grupo atual. Para gravar, a API exige o endereço HTTPS da página do repositório no GitHub (`400` se inválido) e que o aluno pertença ao grupo indicado (`409` se não pertencer).

Use o painel **Rede** do navegador para estudar as requisições com a lista fictícia. Veja o [guia de APIs HTTP](../../docs/api.md).
