# Código-fonte do Controle N2

O projeto separa os contratos, o servidor e a interface. Um processo Bun inicia HTTP e entrega os arquivos da aplicação.

```text
src/
├── tipos.ts       # Formato dos dados compartilhados
├── servidor/      # HTTP, autenticação, regras e SQLite
└── web/           # React, chamadas HTTP e apresentação
```

## Por onde ler

| Ordem | Arquivo ou guia | Pergunta que responde |
| --- | --- | --- |
| 1 | [tipos.ts](tipos.ts) | Que dados existem e como se relacionam? |
| 2 | [servidor/index.ts](servidor/index.ts) | O que é carregado e como o servidor inicia? |
| 3 | [Guia do servidor](servidor/README.md) | Onde estão as regras, rotas e gravações? |
| 4 | [Guia da interface](web/README.md) | Como as telas recebem e alteram dados? |
| 5 | [Componentes locais](web/componentes/README.md) | Como botão, campo e cartão são reaproveitados? |

## Os contratos compartilhados

| Tipo | Representa |
| --- | --- |
| `Projeto` | Enunciado obtido do Markdown |
| `Grupo` | Projeto com ocupação, limite, integrantes e repositório |
| `Painel` | Dados disponíveis para o aluno autenticado |
| `PainelProfessor` | Grupos, auditoria, pendências e avaliações do professor |
| `PainelSessao` | União dos dois painéis, distinguida por `perfil` |
| `AvaliacaoGrupo` | Grupo selecionado e estado ativo |
| `AlunoDaAvaliacao` | Matrícula e nome de um participante |
| `RodadaAvaliacao` | Principal, assistente, pergunta aberta e voluntário |
| `AvaliacaoAlunos` | Integrantes, dupla ativa e rodadas finalizadas |
| `AcaoAvaliacao` | Ações aceitas para alterar uma avaliação |
| `EventoAuditoria` | Registro de inscrição ou alteração de repositório |

Uma união como `PainelSessao` permite ao TypeScript restringir os campos depois de `painel.perfil === "professor"`. Esses tipos não validam automaticamente o JSON recebido: a API faz a validação em execução.

Consulte a [arquitetura](../arquitetura.md) para seguir um clique de ponta a ponta e o [tutorial](../tutorial.md) para rodar os exemplos.
