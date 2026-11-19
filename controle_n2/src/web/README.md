# Interface React do Controle N2

Esta pasta contém os arquivos executados no navegador. O servidor importa `index.html`, e o Bun prepara seus recursos TSX e CSS.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| [index.html](index.html) | Declara idioma, metadados, CSS, script e `div#raiz` |
| [principal.tsx](principal.tsx) | Inicia o React e coordena acesso, aluno e professor |
| [api.ts](api.ts) | Centraliza as chamadas `fetch` e `ErroDaApi` |
| [professor.tsx](professor.tsx) | Mostra menu, grupos, auditoria, pendências e seleção da avaliação |
| [avaliacao.tsx](avaliacao.tsx) | Mostra dupla, participantes, confirmações e histórico |
| [estilos.css](estilos.css) | Define cores, componentes, estados e adaptação a telas pequenas |
| [componentes/ui.tsx](componentes/ui.tsx) | Fornece os componentes locais de apresentação |
| [avaliacao.test.tsx](avaliacao.test.tsx) | Verifica confirmações, disponíveis e marcação de participação |
| [professor.test.tsx](professor.test.tsx) | Verifica cartões, rotas, histórico e condição do GitHub |

## Árvore principal de componentes

```text
App
├── Acesso                         # Sessão ausente
├── PaginaGrupos                    # Perfil aluno
│   ├── Cabecalho
│   ├── Meu grupo e repositório
│   ├── Cartões dos projetos
│   └── Detalhes                    # Janela nativa <dialog>
└── PaginaProfessor                 # Perfil professor
    ├── Cabecalho
    └── AmbienteProfessor
        ├── Grupos e repositórios
        ├── Auditoria
        ├── Alunos sem grupo
        └── PaginaAvaliacao         # Atual ou concluída
```

## Estado, propriedades e requisições

`App` mantém o painel da sessão. As operações chamam funções de `api.ts` e substituem o painel com a resposta do servidor. As telas usam `useState` para valores temporários como mensagens, modal aberto e estado de envio.

As propriedades, ou `props`, levam dados e funções de um componente para outro. Por exemplo, `PaginaAvaliacao` recebe `avaliacao`, `ocupado`, `aoSortear` e `aoAtualizar`. Ela decide a apresentação e pede uma ação; a coordenação em `principal.tsx` faz a requisição e atualiza o painel.

`pedir` interpreta JSON e lança `ErroDaApi` para status de erro. A camada de tela transforma a falha em uma mensagem. Quando a sessão expira, o fluxo volta ao acesso. Os botões são bloqueados durante o envio.

## Navegação do professor

O fragmento da URL escolhe a página, por exemplo `#professor/grupos` ou `#professor/avaliacao/1`. O componente observa `hashchange` e usa o identificador para procurar a avaliação correta.

Uma concluída é apresentada com `finalizada=true`. Nesse modo, as ações são ocultadas e o histórico permanece visível. Os participantes de rodadas encerradas recebem marcação com ✓, estilo desabilitado e descrição acessível.

## Formulários e apresentação

O acesso e o envio de repositório usam formulários HTML e `FormData`. A janela de projeto usa `<dialog>` com `showModal`. As ações de avaliação usam `window.confirm` antes de enviar qualquer mudança.

O React escapa os textos dos enunciados. O componente `Texto` trata trechos entre crases como código em linha, sem injetar HTML do Markdown. Links externos abrem em outra aba com `noopener noreferrer`.

A interface usa CSS local, componentes no padrão shadcn/ui e variantes de botão com `class-variance-authority`. A regra `@media` adapta as colunas para telas menores. O Bun está com HMR desativado: atualize a página após editar a interface.

Leia o [guia de componentes](componentes/README.md), o [guia de uso](../../docs/uso.md) e a [arquitetura](../../arquitetura.md).
