# APIs HTTP com Bun

Uma API HTTP recebe requisições e devolve respostas. Em uma aplicação web, o React pede os dados que precisa exibir. O servidor Bun escolhe a função que atende à requisição. Essa função pode validar dados, consultar o SQLite e devolver JSON.

## Ler uma requisição

Em `GET /api/atividades/4`, `GET` é o método e `/api/atividades/4` é o caminho. O `4` identifica o registro. Em `GET /api/atividades?concluida=false`, o que vem depois de `?` é um filtro. O caminho continua sendo `/api/atividades`.

O cadastro fictício abaixo mostra como descrever o contrato de uma API.

| Método e caminho | O que faz | Resposta de sucesso |
| --- | --- | --- |
| `GET /api/atividades` | Lista atividades | `200` e uma lista, que pode ser `[]` |
| `GET /api/atividades/4` | Busca a atividade 4 | `200` e o objeto |
| `POST /api/atividades` | Cria uma atividade a partir de um corpo JSON | `201` e o objeto criado |
| `PUT /api/atividades/4` | Substitui os campos editáveis da atividade 4 | `200` e o objeto atualizado |
| `DELETE /api/atividades/4` | Exclui a atividade 4 | `204` com corpo vazio, se esse for o contrato |

O trecho abaixo mostra o corpo de um `POST`. Use o cabeçalho `Content-Type: application/json` para informar o formato desse corpo. O servidor gera o `id` e o inclui na resposta.

```json
{ "titulo": "Revisar uma consulta SQL", "concluida": false }
```

## Ler a resposta

| Código | Quando usar |
| --- | --- |
| `200 OK` | Consulta ou alteração feita com sucesso |
| `201 Created` | Registro criado |
| `204 No Content` | Operação concluída com corpo vazio |
| `400 Bad Request` | JSON inválido ou campo fora do formato esperado |
| `404 Not Found` | Rota ou registro inexistente |
| `409 Conflict` | Operação conflitante com o estado atual, como uma duplicidade, quando previsto no contrato |
| `500 Internal Server Error` | Falha inesperada no servidor |

Defina um formato de erro que a interface possa ler, como `{ "erro": "Informe o título." }`. O `fetch` devolve uma resposta para códigos como `400` e `404`. Confira `resposta.ok` para identificar o erro HTTP. Uma falha de conexão pode rejeitar a promessa. Chame `resposta.json()` quando a resposta tiver corpo JSON. Para `204`, siga sem ler o corpo.

## Experimentar sua primeira rota

Crie `servidor.ts` em uma pasta de exercícios e rode `bun servidor.ts`. A rota usa dados em memória para facilitar o primeiro teste.

```ts
const atividades = [
  { id: 1, titulo: "Revisar uma consulta SQL", concluida: false },
];

const servidor = Bun.serve({
  hostname: "127.0.0.1",
  port: 3000,
  routes: {
    "/api/atividades": {
      GET: () => Response.json(atividades),
    },
  },
  fetch: () => Response.json({ erro: "Rota não encontrada." }, { status: 404 }),
});

console.log("API em " + servidor.url);
```

Em outra janela do terminal, teste uma rota existente e outra desconhecida. A opção `-i` exibe os cabeçalhos e o status antes do corpo. No PowerShell, use `curl.exe` para chamar o executável.

```powershell
curl.exe -i http://127.0.0.1:3000/api/atividades
curl.exe -i http://127.0.0.1:3000/api/inexistente
```

Você deve receber `200` e uma lista no primeiro pedido, e `404` e uma mensagem no segundo. Se fizer a mesma chamada a partir de uma tela servida em outra porta, ela estará em outra origem. Durante o desenvolvimento, um proxy do servidor da interface pode encaminhar `/api` para o Bun.

## Documentar uma operação

Registre método e caminho, parâmetros, corpo, campos obrigatórios, regras, códigos de status e exemplos. Documente cada erro que a interface precisa tratar e confira as respostas reais antes de atualizar a definição OpenAPI. Use o [guia do Scalar](scalar.md) para experimentar os pedidos na documentação interativa.

- [API do Controle Acadêmico](../academico/docs/api.md)
- [API do Controle N2](../controle_n2/docs/api.md)
