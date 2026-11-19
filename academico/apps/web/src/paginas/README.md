# 📄 apps/web/src/paginas: as telas do sistema

Cada pasta é **um assunto** do sistema e corresponde a um item do menu.

| Pasta | Endereço | O que tem |
| --- | --- | --- |
| [dashboard/](dashboard/README.md) | `/` | Painel geral com números e gráficos |
| [alunos/](alunos/README.md) | `/alunos` | Lista + formulário de alunos (**a página modelo**) |
| [professores/](professores/README.md) | `/professores` | Lista + formulário de professores |
| [disciplinas/](disciplinas/README.md) | `/disciplinas` | Lista + formulário de disciplinas |
| [matriculas/](matriculas/README.md) | `/matriculas` | Lista + formulário de matrículas (com notas) |
| [relatorios/](relatorios/README.md) | `/relatorios` | Três relatórios em abas |

## Por que uma pasta por assunto?

Porque tudo o que é de "alunos" fica **junto**: a página e o formulário. Quando você
for mexer em alunos, abre uma pasta só.

## Padrão de nomes

| Nome | O que é |
| --- | --- |
| `PaginaXxx.tsx` | A tela inteira, ligada a um endereço no `App.tsx` |
| `FormularioXxx.tsx` | A janela de cadastro/edição |
| `RelatorioXxx.tsx` | Uma aba de relatório |

## Como criar uma página nova

1. Crie a pasta e o arquivo, ex.: `paginas/cursos/PaginaCursos.tsx`.
2. Registre o endereço em [App.tsx](../App.tsx):
   ```tsx
   <Route path="/cursos" element={<PaginaCursos />} />
   ```
3. Adicione o item no menu em [components/Layout.tsx](../components/Layout.tsx):
   ```ts
   { endereco: "/cursos", texto: "Cursos", icone: School },
   ```
