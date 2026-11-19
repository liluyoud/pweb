# 📈 paginas/relatorios: relatórios em tela

| Arquivo | O que faz | Dados da API |
| --- | --- | --- |
| [PaginaRelatorios.tsx](PaginaRelatorios.tsx) | A página com as **abas** (Tabs) | |
| [RelatorioBoletim.tsx](RelatorioBoletim.tsx) | Escolha um aluno e veja todas as suas notas | `GET /api/matriculas?aluno_id=X` |
| [RelatorioDisciplinas.tsx](RelatorioDisciplinas.tsx) | Aprovados, reprovados e média por disciplina/semestre | `GET /api/relatorios/disciplinas` |
| [RelatorioProfessores.tsx](RelatorioProfessores.tsx) | Turmas de cada professor, com total de alunos e média | `GET /api/relatorios/professores` |

## Por que cada aba é um arquivo separado?

Cada relatório tem **seus próprios dados e estados**. Separando em arquivos, cada um
fica pequeno e fácil de entender. A `PaginaRelatorios` só organiza as abas:

```tsx
<Tabs defaultValue="boletim">
  <TabsList>
    <TabsTrigger value="boletim">Boletim do aluno</TabsTrigger>
    ...
  </TabsList>
  <TabsContent value="boletim"><RelatorioBoletim /></TabsContent>
  ...
</Tabs>
```

## Reaproveitando a API

O boletim **não precisou de uma rota nova**: ele usa a listagem de matrículas com
o filtro `?aluno_id=`. Reaproveitar o que já existe é sempre uma boa ideia.

Já os relatórios por disciplina e por professor usam rotas próprias, porque precisam
de **resumos** (`GROUP BY`) que a listagem comum não faz. Veja o SQL em
[api/src/rotas/relatorios.ts](../../../../api/src/rotas/relatorios.ts).

## Como adicionar um relatório novo

1. Escreva o SQL e crie a função em `api/src/rotas/relatorios.ts`.
2. Registre o endereço em `api/src/index.ts`.
3. Crie o tipo da linha em `packages/tipos/index.ts`.
4. Crie a função em `web/src/servicos/api.ts`.
5. Crie `RelatorioXxx.tsx` aqui e adicione uma aba em `PaginaRelatorios.tsx`.
