# TypeScript básico

TypeScript verifica se o código usa valores de acordo com os tipos declarados ou inferidos. O editor pode avisar que uma função pede um número quando você envia texto. Durante a execução, o JavaScript recebe os valores reais. Por isso, dados vindos de formulários, requisições e arquivos passam por validação.

## 1. Tipos básicos e inferência

```ts
const titulo = "Revisar SQL";
let tentativas = 0;
tentativas = 1;
```

O compilador infere que `tentativas` é um `number`. Se você tentar atribuir `"uma"`, ele aponta o erro. Anote tipos quando a intenção precisa ficar explícita, como nos parâmetros de uma função ou em uma lista que começa vazia.

| Tipo | Exemplo | Onde aparece |
| --- | --- | --- |
| `string` | `"Revisar SQL"` | Títulos, e-mails e identificadores que podem começar com zero |
| `number` | `8.5` | Notas, contagens e IDs numéricos |
| `boolean` | `false` | Valores verdadeiro ou falso |
| `null` | `null` | Ausência registrada, como uma nota ainda sem lançamento |
| `undefined` | `undefined` | Valor ausente, como um parâmetro omitido |
| `string[]` | `["SQL", "React"]` | Lista de textos |
| `Atividade[]` | `[atividade]` | Lista de objetos com o mesmo formato |
| `void` | `(): void => { }` | Função que termina sem devolver um valor utilizável |

## 2. Objetos, funções e campos opcionais

```ts
type Atividade = {
  id: number;
  titulo: string;
  concluida: boolean;
};

function formatarAtividade(atividade: Atividade): string {
  const situacao = atividade.concluida ? "concluída" : "pendente";
  return atividade.titulo + " (" + situacao + ")";
}

const exemplo: Atividade = { id: 1, titulo: "Revisar SQL", concluida: false };
console.log(formatarAtividade(exemplo));
```

Use `type` para dar um nome ao formato. `interface` também pode descrever objetos. Neste guia, usamos `type` para manter os exemplos consistentes.

Um campo opcional como `observacao?: string` pode ser omitido. Ao ler esse campo, o resultado pode ser `undefined`. Em `observacao: string | null`, o campo é obrigatório e `null` representa a ausência de texto.

```ts
function formatarNota(nota: number | null): string {
  if (nota === null) {
    return "Ainda não lançada";
  }

  return nota.toLocaleString("pt-BR");
}
```

`number | null` é uma **união**. O teste `nota === null` permite que o compilador saiba que, depois do `if`, `nota` é um número. Esse refinamento é chamado de *narrowing*. Use `typeof` para distinguir tipos simples e `instanceof` para reconhecer instâncias, como um objeto `Error`.

## 3. Reutilizar tipos

| Recurso | Exemplo | Significado |
| --- | --- | --- |
| `Omit` | `type NovaAtividade = Omit<Atividade, "id">` | Reaproveita os campos de `Atividade` sem o identificador gerado pelo servidor |
| `Pick` | `type Resumo = Pick<Atividade, "id" \| "titulo">` | Escolhe os campos usados em uma listagem resumida |
| `&` | `type AtividadeDetalhada = Atividade & { total_observacoes: number }` | Exige os campos de `Atividade` mais a contagem de observações |
| `Record` | `Record<"pendente" \| "concluida", string>` | Exige um texto para cada uma das chaves indicadas |
| `import type` | `import type { Atividade } from "./atividades"` | Importa uma declaração usada durante a checagem |
| `import * as` | `import * as atividades from "./atividades"` | Agrupa as exportações de um módulo, como `atividades.listarAtividades` |

Os sinais `< >` fornecem **parâmetros de tipo**. `Promise<Atividade[]>` indica que uma operação assíncrona, quando bem-sucedida, entrega uma lista. Em `useState<Atividade[]>([])`, o parâmetro diz o que pode entrar no estado que começa com `[]`. O [guia de React](react-basico.md) usa essa técnica para guardar listas.

## 4. Modelar os estados permitidos

Uma união de objetos pode expressar quais campos existem em cada situação. O exemplo abaixo usa `situacao` para distinguir os três formatos.

```ts
type EstadoDaLista =
  | { situacao: "carregando" }
  | { situacao: "pronta"; atividades: Atividade[] }
  | { situacao: "erro"; mensagem: string };

function resumir(estado: EstadoDaLista): string {
  if (estado.situacao === "pronta") {
    return String(estado.atividades.length) + " atividade(s)";
  }

  if (estado.situacao === "erro") {
    return estado.mensagem;
  }

  return "Carregando atividades…";
}
```

O TypeScript permite acessar `estado.atividades` dentro do teste `estado.situacao === "pronta"`. Use esse formato quando cada estado da interface tem informações próprias.

## 5. Conferir os dados recebidos

A anotação `as Atividade` informa ao compilador qual formato você espera. A afirmação `!` depois de uma expressão informa que ela deveria estar preenchida. Ambas são removidas ao transformar o código em JavaScript. Prefira verificar valores externos em execução. `any` desativa verificações de tipo naquele valor. `unknown` exige uma verificação antes de usar suas propriedades.

O exemplo abaixo consulta a API do [guia de API](api.md). Salve como `atividades.ts` para combinar com a página do [guia de React](react-basico.md). A rota de exemplo devolve uma lista com `id` numérico. Todos os itens passam por `ehAtividade` antes de chegarem à interface.

```ts
export type Atividade = {
  id: number;
  titulo: string;
  concluida: boolean;
};

function ehAtividade(valor: unknown): valor is Atividade {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  return (
    "id" in valor && typeof valor.id === "number" &&
    Number.isSafeInteger(valor.id) && valor.id > 0 &&
    "titulo" in valor && typeof valor.titulo === "string" &&
    "concluida" in valor && typeof valor.concluida === "boolean"
  );
}

export async function listarAtividades(
  sinal?: AbortSignal,
): Promise<Atividade[]> {
  const resposta = await fetch("/api/atividades", { signal: sinal });

  if (!resposta.ok) {
    throw new Error("Falha ao consultar atividades (HTTP " + resposta.status + ").");
  }

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados) || !dados.every(ehAtividade)) {
    throw new Error("A API devolveu uma lista em formato inválido.");
  }

  return dados;
}
```

O retorno `valor is Atividade` é um **predicado de tipo**. Ao retornar `true`, `ehAtividade` confirma o formato para o compilador. A API também deve validar os dados enviados pelo navegador antes de gravar. Receber `"false"`, por exemplo, é receber texto. Valide antes de converter ou gravar o valor.

## 6. Reconhecer JavaScript dentro do TypeScript

| Recurso | Exemplo | Para que serve |
| --- | --- | --- |
| Função de seta | `(atividade) => atividade.titulo` | Escreve uma função curta |
| Desestruturação | `const { titulo } = atividade` | Extrai um campo do objeto |
| Expansão de objeto | `{ ...atividade, concluida: true }` | Copia os campos e substitui `concluida` |
| Coalescência nula | `nota ?? "Pendente"` | Usa o valor alternativo se o primeiro for `null` ou `undefined`. Preserva a nota `0` |
| Encadeamento opcional | `atividade?.titulo` | Lê a propriedade quando o objeto existe |
| `async` / `await` | `await listarAtividades()` | Aguarda uma promessa dentro de uma função assíncrona |
| `map` / `filter` / `find` | `atividades.filter((item) => item.concluida)` | Transforma, filtra ou encontra o primeiro item que atende a uma condição |
| Parâmetro padrão | `function listar(pagina = 1) {}` | Usa `1` se a função for chamada sem valor para `pagina` |
| Chave calculada | `{ [caminho]: operacao }` | Usa o valor de uma variável como chave do objeto |

## 7. Conferir erros e praticar

1. No exemplo inicial, troque `id: 1` por `id: "1"` e leia a mensagem do editor. Restaure o número e teste a formatação.
2. Passe `null` e depois `0` para `formatarNota`. Compare as saídas.
3. Faça a API didática devolver `concluida: "false"` e confira o erro de formato da interface. Depois restaure `false`.
4. No Acadêmico, rode `bun run build` na raiz do projeto. O script do site executa a checagem de tipos antes de gerar o build.

Ao ler a interface do Acadêmico, comece pelos formulários e pelas props que eles passam aos componentes do shadcn/ui. Tipos mais gerais como `React.ComponentProps` e `VariantProps` ajudam esses componentes a aceitar propriedades e variantes de estilo com segurança.

- [Tipos compartilhados do Acadêmico](../academico/packages/tipos/index.ts)
- [Serviço de API do Acadêmico](../academico/apps/web/src/servicos/api.ts)
- [Trilha de exercícios](exercicios.md)
