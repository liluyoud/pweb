# 📊 paginas/dashboard: painel geral

| Arquivo | O que faz |
| --- | --- |
| [PaginaDashboard.tsx](PaginaDashboard.tsx) | A tela inicial: números principais e gráficos |

## De onde vêm os dados?

De **um único pedido**: `GET /api/dashboard`. A API faz todas as contas com SQL
(`COUNT`, `AVG`, `GROUP BY`) e devolve tudo pronto. A tela só **mostra**.

> 💡 **Por que calcular na API e não na tela?** Porque o banco é muito mais rápido
> para contar e somar milhares de linhas. E a tela não precisa baixar todas as
> matrículas só para mostrar um número.

## O que aparece

| Bloco | Dado da API |
| --- | --- |
| 4 cartões de totais | `totais.alunos`, `totais.professores`... |
| Média geral | `media_geral` |
| Taxa de aprovação | `taxa_aprovacao` (aprovados ÷ (aprovados + reprovados)) |
| Situação das matrículas | `situacao` (barra dividida por cor) |
| Matrículas por semestre | `matriculas_por_semestre` (colunas verticais) |
| Disciplinas com maior média | `melhores_disciplinas` (componente `GraficoBarras`) |

## Gráficos sem biblioteca

Todos os gráficos são feitos com `div` e **CSS**. A barra tem a largura (ou altura)
proporcional ao valor:

```tsx
<div style={{ width: (item.valor / maximo) * 100 + "%" }} />
```

Para um projeto didático, isso é ótimo: não há "mágica", só matemática e CSS.

## "Carregando..."

Enquanto a resposta da API não chega, `dados` vale `null`, e a tela mostra
"Carregando...". Quando chega, `setDados` atualiza o estado e o React redesenha.
