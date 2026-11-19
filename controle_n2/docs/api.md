# API do Controle N2

A interface e a API usam `http://127.0.0.1:3400`. Os contratos são implementados em [servidor/api.ts](../src/servidor/api.ts); os tipos compartilhados ficam em [tipos.ts](../src/tipos.ts) e as funções de chamada em [web/api.ts](../src/web/api.ts).

## 1. Convenções

As requisições com corpo usam JSON e `Content-Type: application/json`. Matrículas são strings, identificadores de grupo são números de 1 a 10 e o nascimento usa `AAAA-MM-DD`.

Um sucesso de consulta ou alteração retorna `200`. As alterações respondem com o painel completo atualizado, para a interface redesenhar os dados. A saída usa `Cache-Control: no-store` nas respostas montadas pela API.

```json
{ "erro": "Este grupo está cheio. Sua escolha anterior foi mantida." }
```

Esse é o formato dos erros da API. O status HTTP informa a categoria; a mensagem explica a situação.

## 2. Rotas e permissões

| Método | Rota | Quem usa | Corpo | Resposta |
| --- | --- | --- | --- | --- |
| `GET` | `/api/grupos` | Público | — | Dez projetos sem nomes de integrantes |
| `POST` | `/api/sessao` | Público | `matricula`, `nascimento` | Cookie e painel do perfil autenticado |
| `GET` | `/api/painel` | Sessão válida | — | Painel de aluno ou professor |
| `DELETE` | `/api/sessao` | Qualquer cliente | — | `{}` e cookie removido |
| `PUT` | `/app/meu-grupo` | Aluno | `grupoId` | Painel do aluno atualizado |
| `PUT` | `/app/meu-grupo/repositorio` | Aluno | `grupoId`, `link` | Painel após salvar ou substituir link |
| `PUT` | `/app/professor/sorteio` | Professor | — | Painel com grupo sorteado |
| `PUT` | `/app/professor/avaliacao` | Professor | `grupoId` | Painel com avaliação iniciada |
| `PUT` | `/app/professor/dupla` | Professor | `grupoId` | Painel com principal e assistente |
| `PUT` | `/app/professor/avaliacao/acoes` | Professor | `grupoId`, `tipo`, `rodadaId`, eventualmente `matricula` | Painel após ação na avaliação |
| `GET` | `/docs` | Público | — | Página HTML do Scalar |
| `GET` | `/api/openapi.json` | Público | — | Especificação OpenAPI |

A especificação exibida pelo Scalar descreve **somente `GET /api/grupos`**, que pode ser testada sem login. A tabela acima documenta também as operações usadas pela própria interface.

Os manipuladores de `/app/...` fornecem a `APP_KEY` internamente. Ela não é enviada pelo JavaScript do navegador nem funciona como substituta da sessão. Nas chamadas de alteração da interface, o cabeçalho `Origin` precisa coincidir com a origem da aplicação. Um cabeçalho de chave fornecido pelo cliente não concede o perfil de professor.

## 3. Catálogo público

`GET /api/grupos` devolve uma lista. Cada item possui:

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | Número | Identificador do grupo |
| `nome` | Texto | Nome do grupo, lido do Markdown |
| `titulo` | Texto | Título do projeto |
| `descricao` | Texto | Enunciado introdutório |
| `detalhes` | Lista de `{ titulo, texto }` | Dados, tela, regra e teste do projeto |
| `ocupacao` | Número | Quantidade de inscrições no grupo |
| `limite` | Número | Dez integrantes |
| `repositorioGithub` | Texto ou `null` | Link salvo para o grupo |

Trecho de um item, com os campos do enunciado omitidos para facilitar a leitura:

```json
{
  "id": 1,
  "nome": "Boto Cor de Rosa",
  "titulo": "Empréstimos da biblioteca",
  "ocupacao": 3,
  "limite": 10,
  "repositorioGithub": "https://github.com/turma/biblioteca"
}
```

Os nomes e matrículas dos integrantes não estão nessa resposta pública. Nos painéis autenticados, os grupos também incluem `integrantes`, uma lista de nomes em ordem alfabética.

## 4. Login e sessão

Exemplo com uma aluna fictícia:

```http
POST /api/sessao
Content-Type: application/json

{ "matricula": "2610001", "nascimento": "2006-03-14" }
```

O servidor compara os dados, gera um token aleatório e responde com o painel. O cookie chama-se `controle_n2_sessao_web`, usa `HttpOnly`, `SameSite=Strict`, caminho `/` e duração de oito horas. O atributo `Secure` é acrescentado quando a requisição usa HTTPS.

O professor entra pela mesma rota usando a configuração local. Sua matrícula não pode estar na lista de alunos. As sessões ficam em memória: reiniciar o processo exige novo login. Ao entrar em outra conta no mesmo perfil do navegador, a sessão anterior é substituída.

Depois de 20 falhas de login por IP dentro da janela de cinco minutos, tentativas seguintes recebem `429`. Encerrar com `DELETE /api/sessao` invalida o token e expira o cookie, retornando `{}`.

### Painel do aluno

| Campo | Conteúdo |
| --- | --- |
| `perfil` | `"aluno"` |
| `nome` | Nome formatado do aluno autenticado |
| `grupoAtual` | Identificador do grupo ou `null` |
| `colegasDoGrupo` | Nomes dos demais integrantes, sem o próprio aluno |
| `repositorioGithub` | Link do grupo atual ou `null` |
| `grupos` | Os dez grupos com enunciados, ocupações, nomes e links |

### Painel do professor

| Campo | Conteúdo |
| --- | --- |
| `perfil` | `"professor"` |
| `grupos` | Os dez grupos com integrantes e links |
| `avaliacaoAtual` | `{ grupoId, estado }` ou `null`; estados ativos: `sorteado` e `em_avaliacao` |
| `avaliacaoAlunos` | Dados da avaliação em andamento ou `null` |
| `avaliacoesConcluidas` | Lista com `grupoId` e dados da avaliação de cada grupo concluído |
| `alunosSemGrupo` | Matrícula e nome, ordenados por nome e matrícula |
| `auditoria` | Eventos mais recentes primeiro, com nome do aluno quando encontrado |

Não há rota separada para abrir uma avaliação concluída: seus dados já estão no painel do professor. A interface seleciona o grupo pelo fragmento da URL.

## 5. Escolher ou trocar de grupo

```json
{ "grupoId": 2 }
```

Esse é o corpo de `PUT /app/meu-grupo`. A matrícula vem da sessão. O servidor confere se o grupo existe e se há vaga. A escolha é única por aluno: trocar atualiza o vínculo e libera a vaga anterior. Repetir o mesmo grupo mantém o estado sem criar outro evento de auditoria.

Um destino cheio gera `409` e preserva a escolha anterior. O perfil do professor recebe `403` nessa operação.

## 6. Salvar o repositório

Corpo de `PUT /app/meu-grupo/repositorio`:

```json
{
  "grupoId": 2,
  "link": "https://github.com/turma/projeto"
}
```

Qualquer integrante atual pode salvar ou substituir o link do próprio grupo. O link pertence ao grupo, permanecendo nele quando uma pessoa troca de grupo.

A validação aceita a página HTTPS de um repositório em `github.com`, sem parâmetros nem caminhos adicionais, com até 300 caracteres. Uma barra final é removida. O servidor valida o formato, sem fazer consulta ao GitHub. Um link inválido gera `400`; um aluno de outro grupo recebe `409`. Repetir o link salvo não duplica a auditoria.

## 7. Escolher grupo e iniciar avaliação

`PUT /app/professor/sorteio` sorteia entre grupos com integrantes válidos, link do GitHub enviado e ainda não concluídos. A resposta contém `avaliacaoAtual`. Se já existe uma seleção válida ou avaliação em andamento, conserva o estado atual. Uma seleção sorteada que deixou de ser elegível pode ser substituída. Sem candidatos, responde `409`.

`PUT /app/professor/avaliacao` recebe `{ "grupoId": 2 }`. Exige que o grupo esteja sorteado, tenha integrantes e tenha enviado o link do GitHub. O início registra a lista de matrículas da avaliação, protegendo-a de mudanças posteriores de inscrição. Repetir o início do grupo em andamento conserva a avaliação. Sem as condições necessárias, responde `409`.

## 8. Duplas e histórico

`PUT /app/professor/dupla` recebe `{ "grupoId": 2 }` e exige uma avaliação em andamento. Sorteia duas pessoas diferentes entre quem ainda não participou. Se restar somente uma, `assistente` é `null`. Uma rodada já aberta é preservada em chamadas repetidas.

Os dados de avaliação incluem:

| Campo | Conteúdo |
| --- | --- |
| `integrantes` | Lista registrada no início, com objetos `{ matricula, nome }` |
| `dupla` | Rodada ativa ou `null` |
| `rodadasFinalizadas` | Rodadas concluídas, em ordem de identificador |

Exemplo de uma rodada ativa:

```json
{
  "id": 7,
  "principal": { "matricula": "2610001", "nome": "Alana Beatriz Costa Nogueira" },
  "assistente": { "matricula": "2610002", "nome": "Bruno Henrique Alves Tavares" },
  "aberta": false,
  "voluntario": null,
  "finalizada": false
}
```

O servidor também devolve o indicador `finalizada` nas rodadas: falso na ativa e verdadeiro nas concluídas. O campo `aberta` informa se foi permitida a chamada de outro integrante; `voluntario` é um objeto de aluno ou `null`.

O sorteio exclui principal, assistente e voluntário de qualquer rodada, incluindo a ativa. Não há gravação de notas numéricas ou texto da pergunta nesses dados.

## 9. Ações da avaliação

Todas usam `PUT /app/professor/avaliacao/acoes`. O `grupoId` precisa identificar a avaliação em andamento. O `rodadaId` deve corresponder à rodada ativa, para uma ação antiga não atingir uma nova dupla.

| `tipo` | `rodadaId` | Campo adicional | Efeito |
| --- | --- | --- | --- |
| `finalizar-dupla` | Número da rodada ativa | — | Encerra a rodada e mantém o grupo em avaliação |
| `abrir-pergunta` | Número da rodada ativa | — | Permite chamar outro integrante |
| `escolher-voluntario` | Número da rodada ativa | `matricula` | Registra uma pessoa disponível na pergunta aberta |
| `finalizar-avaliacao` | Número da rodada ativa ou `null` entre rodadas | — | Encerra o grupo, finalizando a rodada ativa se houver |

Exemplos de corpos completos:

```json
{ "grupoId": 2, "tipo": "finalizar-dupla", "rodadaId": 7 }
```

```json
{ "grupoId": 2, "tipo": "abrir-pergunta", "rodadaId": 7 }
```

```json
{ "grupoId": 2, "tipo": "escolher-voluntario", "rodadaId": 7, "matricula": "2610003" }
```

```json
{ "grupoId": 2, "tipo": "finalizar-avaliacao", "rodadaId": null }
```

A escolha de voluntário exige pergunta aberta, vaga de voluntário ainda livre e pessoa que não participou. Repetir a mesma pessoa já registrada mantém o estado. Há no máximo um voluntário por rodada.

O encerramento entre rodadas exige que exista pelo menos uma rodada registrada. Encerrar o grupo não depende de todos terem participado. Depois do encerramento, `avaliacaoAtual` e `avaliacaoAlunos` ficam `null`, e o histórico passa a constar em `avaliacoesConcluidas`. Alterações em um grupo concluído são rejeitadas.

As confirmações das três opções e da pessoa chamada são feitas na interface antes de enviar a ação. O servidor valida o estado e as permissões; não recebe um campo de confirmação.

## 10. Exemplos no navegador

Use a aplicação aberta no endereço local e dados fictícios. Na aba **Console** das ferramentas do desenvolvedor:

```js
const resposta = await fetch('/api/grupos');
const grupos = await resposta.json();
console.table(grupos.map(({ id, nome, ocupacao, limite }) => ({ id, nome, ocupacao, limite })));
```

Para estudar uma sessão de aluno:

```js
const login = await fetch('/api/sessao', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ matricula: '2610001', nascimento: '2006-03-14' }),
});
console.log(login.status, await login.json());
```

O navegador guarda o cookie. Uma alteração na mesma origem pode ser observada assim:

```js
const escolha = await fetch('/app/meu-grupo', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ grupoId: 1 }),
});
console.log(escolha.status, await escolha.json());
```

Esses exemplos alteram a sessão e a inscrição do aluno fictício. Recarregue a página para sincronizar a interface após executá-los. Para estudar todas as ações com suas confirmações, use os botões e a aba **Rede/Network**.

## 11. Erros e limites

| Status | Situações |
| --- | --- |
| `400` | Grupo, link ou ação inválida; `rodadaId` malformado |
| `401` | Credenciais inválidas, sessão ausente ou expirada |
| `403` | Perfil sem permissão ou origem inválida |
| `404` | Rota não encontrada; a raiz do servidor pode devolver texto para páginas inexistentes |
| `409` | Grupo cheio, vínculo incorreto, início sem condições, falta de candidatos ou ação incompatível com a rodada |
| `429` | Muitas tentativas de login |
| `500` | Erro inesperado no servidor ou falha de autorização interna |

O servidor limita o corpo das requisições a 4096 bytes. Tamanhos maiores podem ser recusados pelo próprio Bun antes da execução da rota. Erros inesperados usam mensagem genérica na resposta; o detalhe deve ser investigado no ambiente local.

Continue no [banco de dados](banco-de-dados.md), na [arquitetura](../arquitetura.md) e no [guia compartilhado de APIs](../../docs/api.md).
