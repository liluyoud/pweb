# 📏 apps/api/src/regras: regras de negócio

**Regra de negócio** é uma regra que vem do **mundo real** (da faculdade), e não
da programação. Exemplo: *"quem tira média 7 é aprovado direto"*.

| Arquivo | Regra |
| --- | --- |
| [notas.ts](notas.ts) | Como calcular o status da matrícula: `aprovado`, `reprovado` ou `cursando` |

## Por que essa pasta existe?

Regras de negócio **mudam** (a faculdade pode mudar a média amanhã). Deixando a regra
em **um único lugar**:

- fica fácil de **encontrar**;
- fica fácil de **mudar** (mexe em um arquivo só);
- fica fácil de **testar** (é uma função simples: entra nota, sai status).

Repare que `calcularStatus` **não sabe nada** de banco de dados nem de HTTP. Ela só
recebe números e devolve um texto. Isso é proposital: é o tipo de código mais fácil
de entender e de testar.

## A regra atual

```
Média = (N1 + N2) / 2

Faltou N1 ou N2?            → cursando
Média ≥ 7?                  → aprovado
Ainda não fez a PF?         → cursando
(Média + PF) / 2 ≥ 5?       → aprovado
Senão                       → reprovado
```

## Quem usa esta regra?

- [rotas/matriculas.ts](../rotas/matriculas.ts): ao criar e ao atualizar uma matrícula.
- [banco/popular.ts](../banco/popular.ts): ao gerar os dados de exemplo.

> 🧪 Desafio: crie um arquivo `notas.test.ts` e teste a regra com `bun test`
> (veja o exercício 17 em [docs/exercicios.md](../../../../docs/exercicios.md)).
