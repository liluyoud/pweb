# Servidor: HTTP, regras e persistência

Esta pasta roda no Bun. Ela lê configuração e documentos, identifica a sessão, confere as regras e persiste os dados.

## Mapa dos arquivos

| Arquivo | O que faz |
| --- | --- |
| [index.ts](index.ts) | Inicia o servidor local e registra aplicação, API e Scalar |
| [configuracao.ts](configuracao.ts) | Valida `APP_KEY` e dados de acesso do professor |
| [documentos.ts](documentos.ts) | Lê alunos e projetos do Markdown |
| [api.ts](api.ts) | Implementa autenticação, perfis, validação e respostas HTTP |
| [banco.ts](banco.ts) | Define esquema, consultas preparadas e transações |
| [openapi.ts](openapi.ts) | Descreve `GET /api/grupos` e entrega a página Scalar |
| [iniciar-grupos.ts](iniciar-grupos.ts) | Distribui inscrições até a meta aproximada de 80% |
| [auditoria.ts](auditoria.ts) | Consulta os eventos pelo terminal |
| [api.test.ts](api.test.ts) | Testa integração HTTP, regras e persistência |
| [iniciar-grupos.test.ts](iniciar-grupos.test.ts) | Testa a distribuição e a preservação de inscrições |

## O caminho de uma requisição

```text
index.ts registra as rotas
  → api.ts lê corpo, sessão e perfil
    → banco.ts confere estado e executa transação
      → api.ts monta o painel atualizado
        → o navegador recebe JSON
```

`criarApi` recebe alunos, projetos, banco e configuração como argumentos. Os testes podem fornecer documentos fictícios e banco em memória sem iniciar o ambiente real. As sessões ficam no fechamento da função, em um `Map`.

## Funções para estudar em `banco.ts`

| Função | Regra principal |
| --- | --- |
| `escolher` | Uma inscrição por pessoa, limite de vagas e auditoria atômica |
| `salvarRepositorio` | Só integrante atual do grupo salva o link |
| `sortearGrupo` | Um grupo ativo; candidatos com integrantes, link do GitHub e ainda não concluídos |
| `iniciarAvaliacao` | Grupo sorteado com integrantes e GitHub; registra a lista inicial |
| `sortearDupla` | Sorteia disponíveis sem repetir participantes |
| `atualizarAvaliacao` | Confere grupo e rodada antes de concluir ou chamar pessoa |
| `iniciarGrupos` | Completa a meta sem desfazer escolhas e sem gravação parcial |

Os comandos de terminal abrem o mesmo banco selecionado pela variável de exemplo. Eles usam `try/finally` para fechar a conexão. `iniciar-grupos` e `auditoria` não iniciam HTTP nem exigem um usuário logado.

## Rodar e verificar

Execute a partir da raiz de `controle_n2`:

```text
bun run dev
bun run verificar
bun test src/servidor
```

Execute a verificação e os testes em outro terminal, enquanto o servidor estiver ativo, ou depois de pará-lo. A aplicação HTTP escuta em `127.0.0.1:3400`. O tamanho máximo de corpo é 4096 bytes e erros inesperados devolvem mensagem genérica.

Ao acrescentar uma rota, revise validação, perfil, estado persistido e exemplos. A [referência HTTP](../../docs/api.md) documenta todas as operações; o Scalar descreve apenas o catálogo público. O [banco de dados](../../docs/banco-de-dados.md) explica as seis tabelas.
