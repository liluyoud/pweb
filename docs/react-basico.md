# React básico

React organiza uma interface em componentes. Neste guia, vamos montar um pequeno cadastro fictício de atividades para aprender a receber dados, responder a eventos e buscar informações em uma API. Os exemplos usam TypeScript. Se a sintaxe for nova para você, consulte o [guia de TypeScript](typescript-basico.md).

## 1. Componentes e JSX

Um componente é uma função que descreve um trecho da interface. Seu nome começa com letra maiúscula, como `CartaoAtividade`. O resultado costuma ser escrito em JSX, uma sintaxe que permite escrever marcação junto com expressões JavaScript. Arquivos com JSX e TypeScript usam a extensão `.tsx`.

```tsx
type CartaoAtividadeProps = {
  titulo: string;
  concluida: boolean;
};

export function CartaoAtividade({ titulo, concluida }: CartaoAtividadeProps) {
  return (
    <article className="rounded-lg border p-4">
      <h2>{titulo}</h2>
      <p>{concluida ? "Concluída" : "Pendente"}</p>
    </article>
  );
}
```

Use `<CartaoAtividade titulo="Revisar SQL" concluida={false} />` para passar as **props** ao componente. As chaves `{}` inserem uma expressão JavaScript no JSX. A propriedade `className` recebe classes CSS. Feche cada tag, como `<input />`. Para agrupar elementos sem adicionar um contêiner ao HTML, use um fragmento `<>...</>`.

## 2. Eventos e estado

Um evento representa uma ação, como digitar (`onChange`), clicar (`onClick`) ou enviar um formulário (`onSubmit`). Passe a função ao React com `onClick={alternar}`. O React chama essa função quando o evento acontece.

O `useState` guarda um valor entre renderizações e fornece uma função para atualizá-lo. A atualização agenda outra renderização. Dentro do evento atual, o valor lido ainda é o da renderização que criou aquele evento. Quando a próxima alteração depende do estado anterior, passe uma função ao setter.

```tsx
import { useState } from "react";

export function BotaoConclusao() {
  const [concluida, setConcluida] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setConcluida((anterior) => !anterior)}
    >
      {concluida ? "Reabrir atividade" : "Concluir atividade"}
    </button>
  );
}
```

Chame hooks no início do componente, antes dos retornos condicionais. Assim a ordem das chamadas permanece a mesma a cada renderização. Para atualizar um objeto ou uma lista, crie outro valor com `{ ...anterior, campo: novoValor }`, `[...anterior, novoItem]` ou operações como `map` e `filter`.

## 3. Um cadastro em memória

Copie o exemplo para `App.tsx` em um projeto React com TypeScript. O `FormularioAtividade` controla o campo de texto com `value` e `onChange`. Ao enviar, o formulário avisa o componente pai por meio de `aoAdicionar`. O pai guarda a lista porque ela alimenta a busca, a contagem e a renderização.

```tsx
import { useState, type SubmitEvent } from "react";

type AtividadeLocal = { id: string; titulo: string };

type FormularioAtividadeProps = {
  aoAdicionar: (titulo: string) => void;
};

function FormularioAtividade({ aoAdicionar }: FormularioAtividadeProps) {
  const [titulo, setTitulo] = useState("");

  function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    const tituloLimpo = titulo.trim();

    if (tituloLimpo.length === 0) {
      return;
    }

    aoAdicionar(tituloLimpo);
    setTitulo("");
  }

  return (
    <form onSubmit={enviar}>
      <label htmlFor="titulo">Nova atividade</label>
      <input
        id="titulo"
        value={titulo}
        onChange={(evento) => setTitulo(evento.currentTarget.value)}
        required
      />
      <button type="submit" disabled={titulo.trim() === ""}>
        Adicionar
      </button>
    </form>
  );
}

export default function App() {
  const [atividades, setAtividades] = useState<AtividadeLocal[]>([]);
  const [busca, setBusca] = useState("");

  const buscaNormalizada = busca.trim().toLocaleLowerCase("pt-BR");
  const atividadesVisiveis = atividades.filter((atividade) =>
    atividade.titulo.toLocaleLowerCase("pt-BR").includes(buscaNormalizada),
  );

  function adicionar(titulo: string) {
    const novaAtividade = { id: crypto.randomUUID(), titulo };
    setAtividades((anteriores) => [...anteriores, novaAtividade]);
  }

  return (
    <main>
      <h1>Atividades</h1>
      <FormularioAtividade aoAdicionar={adicionar} />

      <label htmlFor="busca">Buscar por título</label>
      <input
        id="busca"
        value={busca}
        onChange={(evento) => setBusca(evento.currentTarget.value)}
      />

      {atividadesVisiveis.length === 0 ? (
        <p>Nenhuma atividade encontrada.</p>
      ) : (
        <>
          <p>Total exibido: {atividadesVisiveis.length}</p>
          <ul>
            {atividadesVisiveis.map((atividade) => (
              <li key={atividade.id}>{atividade.titulo}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
```

- `preventDefault()` evita a navegação padrão disparada pelo envio do formulário.
- `atividadesVisiveis` é calculada a partir da lista e da busca em cada renderização. Guardar só os dados de origem evita que a lista e o filtro fiquem fora de sincronia.
- `key` associa cada elemento da lista ao mesmo registro mesmo depois de filtrar ou reordenar. O exemplo gera o identificador ao criar o item. Com um banco, use o identificador retornado pela API.
- Os rótulos ligados aos campos por `htmlFor` e `id` permitem identificar os campos e selecionar cada um pelo rótulo. Teste o formulário usando Tab e Enter.

Cadastre duas atividades, busque por uma delas e limpe a busca. Ao recarregar a página, a lista volta ao estado inicial. Na próxima etapa, a API pode carregar dados persistidos no SQLite.

## 4. Buscar dados da API com `useEffect`

Use um efeito para sincronizar a interface com algo externo ao React. Um exemplo é carregar a lista quando a página é montada. Aplique o filtro local durante a renderização. Dispare gravações em resposta ao envio do formulário.

O exemplo abaixo usa o serviço `listarAtividades` do [guia de TypeScript](typescript-basico.md) e a rota do [guia de API](api.md). Coloque `atividades.ts` e `PaginaAtividades.tsx` na mesma pasta. Importe `PaginaAtividades` em `App.tsx` e renderize `<PaginaAtividades />`.

Se estiver usando Vite, inclua `server: { proxy: { "/api": "http://127.0.0.1:3000" } }` no objeto de configuração de `vite.config.ts` e reinicie o servidor da interface. Isso faz a requisição de `/api/atividades` chegar ao Bun.

```tsx
import { useEffect, useState } from "react";
import { listarAtividades, type Atividade } from "./atividades";

type EstadoDaLista =
  | { situacao: "carregando" }
  | { situacao: "pronta"; atividades: Atividade[] }
  | { situacao: "erro"; mensagem: string };

export function PaginaAtividades() {
  const [estado, setEstado] = useState<EstadoDaLista>({
    situacao: "carregando",
  });

  useEffect(() => {
    const controlador = new AbortController();

    async function carregar() {
      try {
        const atividades = await listarAtividades(controlador.signal);
        if (!controlador.signal.aborted) {
          setEstado({ situacao: "pronta", atividades });
        }
      } catch (erro) {
        if (!controlador.signal.aborted) {
          const mensagem = erro instanceof Error
            ? erro.message
            : "Não foi possível carregar as atividades.";
          setEstado({ situacao: "erro", mensagem });
        }
      }
    }

    void carregar();
    return () => controlador.abort();
  }, []);

  if (estado.situacao === "carregando") {
    return <p role="status">Carregando atividades…</p>;
  }

  if (estado.situacao === "erro") {
    return <p role="alert">{estado.mensagem}</p>;
  }

  if (estado.atividades.length === 0) {
    return <p>Nenhuma atividade cadastrada.</p>;
  }

  return (
    <ul>
      {estado.atividades.map((atividade) => (
        <li key={atividade.id}>{atividade.titulo}</li>
      ))}
    </ul>
  );
}
```

Neste efeito, `[]` indica que a busca independe de props e de estado. Se a busca passar a depender de um filtro recebido pela página, inclua esse filtro na lista de dependências. A função de limpeza cancela a busca quando o componente sai da tela ou antes de o efeito voltar a rodar. Em desenvolvimento, `StrictMode` pode executar um ciclo adicional de preparação e limpeza. Você pode ver uma requisição cancelada no painel **Rede**.

## 5. Componentes de interface e navegação

O shadcn/ui adiciona componentes ao código do projeto. Por exemplo, o botão instalado aceita `type` e opções de estilo como `variant`. Um formulário pode manter a lógica do exemplo e usar `<Button type="submit">Adicionar</Button>` no lugar do botão HTML. Preserve os rótulos e tipos dos botões ao trocar os componentes.

Tailwind CSS aplica estilos por classes. Em `className="grid gap-4 p-4 md:grid-cols-2"`, o contêiner é uma grade com espaçamento interno e entre itens. A partir do tamanho `md`, a grade usa duas colunas.

Para uma aplicação com várias telas, use a configuração de rotas do projeto. No Acadêmico, o React Router monta a página correspondente à URL. `<NavLink to="/alunos">Alunos</NavLink>` leva à tela e indica se o link está ativo.

## 6. Pratique no projeto

1. Abra a página de alunos do Acadêmico e localize quais valores são estado e quais são calculados na renderização.
2. Mostre quantas atividades existem no total e quantas correspondem à busca. Confira se só o total exibido muda enquanto você digita.
3. Ligue a página de consulta à API de exemplo. Pare a API e recarregue a página para observar como a mensagem de erro é exibida.

- [Página de alunos do Acadêmico](../academico/apps/web/src/paginas/alunos/PaginaAlunos.tsx)
- [Formulário de alunos do Acadêmico](../academico/apps/web/src/paginas/alunos/FormularioAluno.tsx)
- [Rotas da interface do Acadêmico](../academico/apps/web/src/App.tsx)
- [Trilha de exercícios](exercicios.md)
