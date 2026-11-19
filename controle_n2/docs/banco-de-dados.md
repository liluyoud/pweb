# Banco de dados do Controle N2

O Bun abre `controle_n2.sqlite` na raiz do projeto. No modo de exemplo, ele usa `exemplo.sqlite`. Os arquivos são criados na primeira execução.

| Coluna de `escolhas` | Tipo | Regra |
| --- | --- | --- |
| `matricula` | `TEXT` | Chave primária. Cada aluno pode ter uma escolha |
| `grupo_id` | `INTEGER` | Identificador obrigatório de um grupo definido em `trabalhos.md` |

A API confere se o grupo existe. Uma transação SQLite consulta a lotação do destino e grava a nova escolha. Se o destino já tem dez integrantes, a escolha anterior permanece. Um índice em `grupo_id` ajuda a consultar a ocupação.

As credenciais são lidas de `docs/alunos.md` e ficam na memória do servidor. Linhas repetidas com os mesmos dados representam um cadastro só. As sessões também ficam em memória. Após reiniciar o servidor, o aluno precisa entrar novamente e encontra sua escolha gravada.

## Repositório do projeto

A tabela `repositorios` guarda `grupo_id` como chave primária e `url` como texto obrigatório. Há um link por grupo. A transação confere o vínculo do aluno, grava o link e registra o evento de auditoria. A tabela é criada na inicialização, inclusive em bancos já existentes.

## Auditoria

A tabela `auditoria` guarda o histórico das alterações aprovadas.

| Campo | Conteúdo |
| --- | --- |
| `id` | Identificador que também indica a ordem de registro |
| `data_utc` | Data e hora em UTC |
| `acao` | `entrada_grupo`, `troca_grupo`, `envio_repositorio` ou `alteracao_repositorio` |
| `matricula` | Matrícula do aluno autenticado que fez a alteração |
| `grupo_anterior_id` e `grupo_id` | Grupo anterior, quando há troca, e grupo de destino ou afetado |
| `link_anterior` e `link_novo` | Endereços do GitHub nas operações de envio ou alteração |

Cada alteração é gravada na mesma transação do evento. Se a gravação da auditoria falhar, o SQLite reverte a mudança. Repetir o grupo ou o link já salvo mantém o estado e o histórico. Operações rejeitadas ficam fora deste histórico.

A tabela é criada automaticamente na abertura do banco. A auditoria começa com as novas alterações. Para consultar, execute `bun run auditoria` no terminal na pasta do Controle N2.

- [Código do banco](../src/servidor/banco.ts)
- [Guia de SQLite com Bun](../../docs/banco-de-dados.md)
