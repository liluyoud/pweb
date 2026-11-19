# 🖥️ apps/web: o site

O site é a parte que o usuário **vê e usa**: telas, botões, formulários e gráficos.
Ele roda no **navegador** e busca os dados na API.

Feito com:

| Ferramenta | Papel |
| --- | --- |
| **React** | Monta as telas a partir de componentes |
| **Vite** | Roda o site em desenvolvimento e gera a versão final |
| **Tailwind CSS** | Estilos com classes prontas (`p-4`, `text-sm`...) |
| **shadcn/ui** | Componentes visuais prontos (botão, tabela, janela...) |
| **React Router** | Várias páginas (`/alunos`, `/professores`...) sem recarregar |
| **lucide-react** | Ícones |
| **sonner** | Avisos de sucesso e erro no canto da tela |

## Estrutura

```
web/
├── public/             ← arquivos servidos como estão (ícone da aba)
├── src/                ← todo o código do site (veja src/README.md)
├── index.html          ← a única página HTML; o React desenha tudo dentro dela
├── components.json     ← configuração do shadcn/ui
├── vite.config.ts      ← configuração do Vite (atalho @/ e proxy da API)
├── tsconfig*.json      ← configuração do TypeScript
└── package.json        ← nome, scripts e dependências do site
```

## Comandos

Da **raiz** do monorepo:

| Comando | O que faz |
| --- | --- |
| `bun run dev` | Liga o site **e** a API |
| `bun run dev:web` | Liga só o site |
| `bun run build` | Gera a versão final em `dist/` |

## Detalhes importantes do `vite.config.ts`

### 1. O atalho `@/`

```ts
import { Button } from "@/components/ui/button";
```

`@/` significa **`src/`**. Sem ele, teríamos caminhos como `../../components/ui/button`.

### 2. O proxy

```ts
proxy: { "/api": "http://localhost:3333" }
```

Quando o site pede `/api/alunos`, o Vite **repassa** o pedido para a API.
Assim o site e a API parecem estar no mesmo endereço e evitamos o erro de **CORS**
(uma proteção do navegador contra pedidos para outros endereços).

### 3. Uma única cópia do React (`dedupe`)

```ts
dedupe: ["react", "react-dom"]
```

Ao ligar, o Vite "pré-empacota" as bibliotecas (React, ícones, shadcn...) e guarda o
resultado na pasta `node_modules/.vite`. Com o jeito que o Bun organiza os pacotes,
algumas bibliotecas acabavam recebendo uma **segunda cópia** do React. Duas cópias do
React não funcionam juntas: a página fica **em branco** e o console do navegador
mostra *Invalid hook call*. O `dedupe` obriga todo mundo a usar a mesma cópia.

### 4. Porta fixa (`strictPort`)

```ts
strictPort: true
```

Sem isso, se a porta 5173 estiver ocupada (por um `bun run dev` esquecido em outro
terminal), o Vite abre **silenciosamente** outra cópia do site na 5174. Com
`strictPort`, ele para e avisa: *Port 5173 is already in use*.

> 💡 **Página em branco?** Aperte `F12` e olhe a aba *Console* do navegador.
> Erros de JavaScript aparecem lá, e não no terminal.

## Adicionando novos componentes do shadcn

Dentro de `apps/web`:

```bash
bunx --bun shadcn@latest add nome-do-componente
```

Lista de componentes: https://ui.shadcn.com/docs/components
