# Componentes locais de interface

[ui.tsx](ui.tsx) reúne três componentes reutilizáveis, no padrão de composição e propriedades do shadcn/ui, adaptados ao CSS da aplicação.

| Componente | Elemento HTML | Uso |
| --- | --- | --- |
| `Button` | `button` | Ações com variantes `default` e `outline` |
| `Input` | `input` | Campos de matrícula, data e URL |
| `Card` | `article` | Cartões de grupos e conteúdo |

`ComponentProps` do React conserva as propriedades dos elementos nativos. O operador `...props` repassa, por exemplo, `disabled`, `type`, `onClick` e `aria-label`. `className` permite acrescentar um estado visual sem reimplementar o componente.

```tsx
<Button type="button" variant="outline" disabled={ocupado} onClick={atualizar}>
  Atualizar painel
</Button>
```

`cva`, de `class-variance-authority`, escolhe as classes da variante de botão. Os estilos reais estão em [estilos.css](../estilos.css). O atributo `data-slot` identifica o componente no HTML, mas não define sua aparência sozinho.

As regras de grupo, sessão e avaliação ficam nas telas e no servidor. Um botão desabilitado melhora a interação; a regra correspondente continua sendo validada na API.

Volte ao [guia da interface](../README.md) ou à [arquitetura](../../../arquitetura.md).
