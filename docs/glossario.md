# 📒 Glossário

Termos usados no Controle Acadêmico, no Controle N2 e nos guias de programação web.

### API
*Application Programming Interface.* Em uma API HTTP, é o conjunto de operações
que um cliente pode chamar pela rede. Os métodos e caminhos fazem parte do
contrato. Veja o [guia de APIs](api.md).

### Back-end / Front-end
- **Front-end** é a parte que roda no navegador e apresenta a interface.
- **Back-end** é a parte que roda no servidor e cuida das regras e dos dados.

### Banco de dados
Lugar onde as informações ficam **guardadas de forma organizada** (em tabelas),
mesmo depois que o programa é desligado. Veja o [guia de SQLite](banco-de-dados.md).

### Base64
Uma codificação que representa dados binários em texto. No Acadêmico, ela
representa as fotos armazenadas no SQLite.

### Bun
Ambiente para executar JavaScript e TypeScript fora do navegador. Também instala
dependências, executa scripts e oferece acesso ao SQLite por `bun:sqlite`.

### Build
Processo de preparar os arquivos para execução ou publicação. No Acadêmico,
`bun run build` verifica os tipos e gera os arquivos do site.

### CDN
*Content Delivery Network.* Servidores na internet que entregam arquivos prontos
(bibliotecas, imagens...) de forma rápida. Na configuração do Acadêmico, o
navegador carrega a interface do Scalar de um CDN.

### Chave primária (PK) / Chave estrangeira (FK)
- **PK**: o campo que identifica cada linha de forma única (o `id`).
- **FK**: um campo que **aponta** para a PK de outra tabela (ex.: `aluno_id`).

### Componente
Uma parte reutilizável da interface. Em React, costuma ser uma função que
descreve o que renderizar usando JSX. Veja o [guia de React](react-basico.md).

### CORS
Mecanismo pelo qual um servidor indica ao navegador quais outras origens podem
ler suas respostas. A origem depende do protocolo, do host e da porta.

### CRUD
As quatro operações básicas de um cadastro:
**C**reate (criar), **R**ead (ler), **U**pdate (atualizar), **D**elete (excluir).

### Dependência / Pacote
Código feito por outras pessoas que o projeto usa. Fica listado no `package.json`
e é baixado para a pasta `node_modules` pelo comando `bun install`.

### Endpoint / Rota
Uma operação da API identificada por método e caminho, como `GET /api/alunos`.

### Hook
Funções especiais do React que começam com `use`: `useState`, `useEffect`...

### HTTP / Métodos HTTP
O "idioma" que o navegador e a API usam para conversar. Cada pedido tem um **método**:

| Método | Significado |
| --- | --- |
| `GET` | Buscar |
| `POST` | Criar |
| `PUT` | Atualizar |
| `DELETE` | Excluir |

### Status HTTP
Número que a API devolve dizendo como foi o pedido:

| Código | Significado |
| --- | --- |
| `200` | Deu certo |
| `201` | Criado com sucesso |
| `204` | Operação concluída com corpo vazio |
| `400` | O pedido veio com problema (ex.: campo faltando) |
| `404` | Não encontrado |
| `409` | Conflito com o estado atual do recurso |
| `500` | Erro no servidor |

### JSON
Formato de texto para trocar dados. Parece um objeto JavaScript:

```json
{ "nome": "Ana", "matricula": "2026001" }
```

### JSX / TSX
JSX é a sintaxe de marcação usada em componentes React. Arquivos `.tsx` são
TypeScript com JSX.

### Migração
Mudança versionada na estrutura do banco. Uma migração pode acrescentar uma
coluna a uma tabela já existente.

### Monorepo
Vários projetos ou pacotes mantidos no mesmo repositório.

### OpenAPI
Um **padrão** para descrever uma API: endereços, o que recebem e o que devolvem.
Veja o [guia de Scalar e OpenAPI](scalar.md).

### Porta
Número que identifica em qual serviço de rede a conexão deve chegar. No
Acadêmico, a API usa a porta `3333` e o servidor de desenvolvimento do site usa `5173`.

### Props
As informações que um componente **recebe** de quem o usa.
Ex.: `<FotoPerfil nome="Ana" foto={null} />` → `nome` e `foto` são props.

### Proxy
Intermediário que encaminha requisições. No Acadêmico, o Vite recebe as
requisições em `/api/...` e as encaminha para o Bun durante o desenvolvimento.

### Regra de negócio
Condição do domínio que o software precisa aplicar. No Acadêmico, média
7 aprova diretamente.

### Scalar
Ferramenta que transforma uma descrição **OpenAPI** numa página de documentação
interativa, onde dá para testar a API.

### Seed (popular o banco)
Script que coloca dados de exemplo no banco. No Acadêmico, `bun run banco:popular`
substitui os registros existentes pelos dados do script.

### shadcn/ui
Conjunto de componentes que podem ser adicionados ao código do projeto, como
botões, tabelas e diálogos.

### SQL
A linguagem usada para conversar com bancos de dados:
`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`...

### Estado (state)
Informação guardada entre renderizações. Em React, `useState` guarda o valor e
fornece a função para atualizá-lo.

### Validação
Verificação feita durante a execução do programa. Por exemplo, a API pode
recusar um título em branco antes de gravar no banco.

### Tipo (TypeScript)
Uma descrição do **formato** de um dado: quais campos ele tem e de que tipo
(texto, número...). Ver [typescript-basico.md](typescript-basico.md).

### Workspace
Pacote registrado na configuração de um monorepo. No Acadêmico, a API e o site
usam o workspace de tipos compartilhados.
