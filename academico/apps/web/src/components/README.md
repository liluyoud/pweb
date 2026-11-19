# 🧩 apps/web/src/components: peças reaproveitáveis

Componentes são **pedaços de tela** que usamos em vários lugares. Em vez de copiar o
mesmo código em todas as páginas, criamos o componente **uma vez** e reutilizamos.

## Nossos componentes

| Componente | O que faz | Onde é usado |
| --- | --- | --- |
| [Layout.tsx](Layout.tsx) | Menu lateral + área de conteúdo | Em volta de todas as páginas (`App.tsx`) |
| [CabecalhoPagina.tsx](CabecalhoPagina.tsx) | Título, descrição e espaço para botões | Topo de todas as páginas |
| [Campo.tsx](Campo.tsx) | Rótulo + campo de formulário | Todos os formulários |
| [CampoFoto.tsx](CampoFoto.tsx) | Escolher, pré-visualizar e remover foto | Formulários de aluno e professor |
| [FotoPerfil.tsx](FotoPerfil.tsx) | Foto redonda (ou as iniciais do nome) | Listas e boletim |
| [SeloStatus.tsx](SeloStatus.tsx) | Etiqueta verde/vermelha/âmbar do status | Matrículas e boletim |
| [BotaoExcluir.tsx](BotaoExcluir.tsx) | Lixeira que pergunta "Tem certeza?" | Todas as listas |
| [GraficoBarras.tsx](GraficoBarras.tsx) | Gráfico de barras feito só com CSS | Dashboard |

## E a pasta `ui/`?

São os componentes **prontos do shadcn/ui** (botão, tabela, janela...).
Veja [ui/README.md](ui/README.md).

**Nossos componentes usam os do `ui/`**. Por exemplo, o `BotaoExcluir` é montado com
o `Button` e o `AlertDialog` do shadcn.

## Como criar um componente

```tsx
// 1. Descreva o que ele recebe (props)
type Props = {
  texto: string;
};

// 2. Crie a função (nome com letra MAIÚSCULA) e exporte
export function Aviso({ texto }: Props) {
  return <p className="rounded-lg bg-amber-50 p-3 text-sm">{texto}</p>;
}

// 3. Use em qualquer página
<Aviso texto="Notas do semestre ainda não lançadas." />
```

## Um exemplo de "por que componentizar"

O `GraficoBarras` não usa nenhuma biblioteca de gráficos. Cada barra é só uma `div`
cuja **largura é uma porcentagem**:

```tsx
<div style={{ width: (valor / maximo) * 100 + "%" }} />
```

Simples assim. E, por ser um componente, se quisermos melhorar o gráfico, mudamos
**um arquivo** e todas as telas que o usam melhoram juntas.
