# 📖 apps/api/src/documentacao: a descrição da API (OpenAPI)

| Arquivo | O que faz |
| --- | --- |
| [openapi.ts](openapi.ts) | Descreve **todos os endereços** da API no formato **OpenAPI** |

Esse objeto é lido pelo **Scalar**, que desenha a página de documentação em
**http://localhost:3333/api/docs**.

## Por que essa pasta existe?

A documentação **não é código que faz a API funcionar**: ela só descreve a API.
Por isso fica separada de `rotas/` (que faz o trabalho de verdade).

As rotas que **entregam** a documentação (`/api/openapi.json` e `/api/docs`) ficam,
como todas as outras, em [rotas/documentacao.ts](../rotas/documentacao.ts).

## Como o arquivo está organizado

```
openapi.ts
├── funções de ajuda       ← respostaUm, respostaLista, respostaDeErro, corpoDoPedido
├── rotasDeCadastro(...)   ← monta os 5 endereços de um CRUD de uma vez
├── FILTROS_MATRICULAS     ← filtros ?aluno_id= e ?semestre=
└── especificacao
    ├── info               ← título, versão e descrição da API
    ├── servers            ← onde a API roda (http://localhost:3333)
    ├── tags               ← grupos do menu lateral
    ├── paths              ← OS ENDEREÇOS (a parte principal)
    └── components.schemas ← O FORMATO DOS DADOS (Aluno, Professor...)
```

## ⚠️ Lembre-se

Criou ou mudou uma rota? **Atualize este arquivo também.** A documentação não se
atualiza sozinha.

O passo a passo está no [guia do Scalar](../../../../../docs/scalar.md).
