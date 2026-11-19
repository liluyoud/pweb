# 📁 apps/web/src: código do site

```
src/
├── main.tsx        ← 1º arquivo: liga o React dentro do index.html
├── App.tsx         ← diz qual página aparece em cada endereço
├── index.css       ← Tailwind + cores do tema (gerado pelo shadcn)
│
├── paginas/        ← as TELAS do sistema (uma pasta por assunto)
├── components/     ← PEÇAS reaproveitáveis usadas pelas páginas
│   └── ui/         ←   peças prontas do shadcn (não precisa mexer)
├── servicos/       ← conversa com a API (o único lugar que usa fetch)
└── lib/            ← funções de ajuda (formatar nota, iniciais do nome...)
```

## Quem chama quem?

```
main.tsx
  └── App.tsx  (rotas)
        └── components/Layout.tsx  (menu + conteúdo)
              └── paginas/...      (a tela atual)
                    ├── components/...      (nossas peças)
                    ├── components/ui/...   (peças do shadcn)
                    ├── servicos/api.ts     (busca/grava dados)
                    └── lib/formatar.ts     (formata valores)
```

**Regra de ouro:** as setas só vão **para baixo**. Uma página usa componentes, mas um
componente nunca usa uma página. O `servicos/api.ts` não sabe nada de telas.

## Qual a diferença entre `paginas/` e `components/`?

| `paginas/` | `components/` |
| --- | --- |
| Uma **tela inteira** | Um **pedaço** de tela |
| Tem um endereço (`/alunos`) | Não tem endereço |
| Busca dados na API | Normalmente só recebe dados por **props** |
| Usada **uma vez** | Usada em **vários** lugares |

## Por onde começar a ler?

1. [main.tsx](main.tsx) e [App.tsx](App.tsx): curtinhos.
2. [components/Layout.tsx](components/Layout.tsx): o menu.
3. [paginas/alunos/PaginaAlunos.tsx](paginas/alunos/PaginaAlunos.tsx): a página modelo.
4. [paginas/alunos/FormularioAluno.tsx](paginas/alunos/FormularioAluno.tsx): o formulário modelo.
5. [servicos/api.ts](servicos/api.ts): como o site fala com a API.
