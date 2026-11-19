# 🎨 apps/web/src/components/ui: componentes do shadcn/ui

Estes arquivos foram **gerados automaticamente** pelo comando:

```bash
bunx --bun shadcn@latest add card table dialog ...
```

## O que é o shadcn/ui?

Uma coleção de componentes bonitos e acessíveis. A diferença para outras bibliotecas:
em vez de ficar escondido dentro de `node_modules`, o código é **copiado para o seu
projeto**. Você pode abrir, ler e até alterar.

## Componentes instalados

| Arquivo | Componente | Exemplo de uso |
| --- | --- | --- |
| `button.tsx` | Botão | `<Button variant="outline">Cancelar</Button>` |
| `card.tsx` | Cartão (caixa com borda) | `<Card><CardContent>...</CardContent></Card>` |
| `table.tsx` | Tabela | `<Table><TableRow><TableCell>...` |
| `dialog.tsx` | Janela sobre a tela | Formulários de cadastro |
| `alert-dialog.tsx` | Janela de confirmação | "Tem certeza que deseja excluir?" |
| `input.tsx` | Campo de texto | `<Input value={...} onChange={...} />` |
| `label.tsx` | Rótulo de campo | `<Label>Nome</Label>` |
| `select.tsx` | Lista de opções | Escolher aluno, titulação, semestre |
| `badge.tsx` | Etiqueta | Status, titulação |
| `avatar.tsx` | Foto redonda | `FotoPerfil` |
| `tabs.tsx` | Abas | Página de relatórios |
| `sonner.tsx` | Avisos (toasts) | "Aluno cadastrado." |
| `separator.tsx` | Linha divisória | |

## ⚠️ Preciso entender esses arquivos?

**Não.** Eles usam TypeScript **avançado** e é normal estranhar. Use-os como peças
prontas, consultando a documentação:

👉 https://ui.shadcn.com/docs/components

## Variantes

Muitos componentes aceitam a prop `variant` para mudar a aparência:

```tsx
<Button>Salvar</Button>                        // padrão (escuro)
<Button variant="outline">Cancelar</Button>    // só com borda
<Button variant="ghost">Editar</Button>        // sem fundo
<Button variant="destructive">Excluir</Button> // vermelho
```

## Regra prática

> **Não edite** os arquivos desta pasta, a não ser que tenha um bom motivo.
> Se quiser um componente "personalizado", crie um novo em `components/`
> que **use** o do `ui/` (como fizemos com o `BotaoExcluir`).
