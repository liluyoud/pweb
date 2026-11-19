import { expect, mock, test } from "bun:test";
import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { AcaoAvaliacao, AvaliacaoAlunos, Grupo } from "../tipos";
import { PaginaAvaliacao } from "./avaliacao";
import { Button } from "./componentes/ui";

const integrantes = Array.from({ length: 5 }, (_, indice) => ({
  matricula: String(indice + 1), nome: "Pessoa " + (indice + 1),
}));
const grupo: Grupo = {
  id: 1, nome: "Grupo 1", titulo: "Projeto", descricao: "", detalhes: [],
  ocupacao: 5, limite: 10, integrantes: integrantes.map(({ nome }) => nome), repositorioGithub: null,
};
const avaliacao: AvaliacaoAlunos = {
  integrantes,
  dupla: { id: 7, principal: integrantes[0], assistente: integrantes[1], aberta: false, voluntario: null },
  rodadasFinalizadas: [],
};

function botoes(no: ReactNode): ComponentProps<typeof Button>[] {
  return Children.toArray(no).flatMap((filho) => {
    if (!isValidElement<{ children?: ReactNode }>(filho)) return [];
    if (filho.type === Button) return [filho.props as ComponentProps<typeof Button>];
    return botoes(filho.props.children);
  });
}

function pagina(dados = avaliacao, ocupado = false) {
  const aoAtualizar = mock((_acao: AcaoAvaliacao) => {});
  const elemento = PaginaAvaliacao({ grupo, avaliacao: dados, ocupado, aoSortear: mock(() => {}), aoAtualizar });
  return {
    elemento, aoAtualizar,
    botao: (nome: string) => botoes(elemento).find(({ children }) => children === nome)!,
  };
}

function comConfirmacao(aceitar: boolean, verificar: (confirmar: ReturnType<typeof mock>) => void) {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, "window");
  const confirmar = mock(() => aceitar);
  Object.defineProperty(globalThis, "window", { configurable: true, value: { confirm: confirmar } });
  try {
    verificar(confirmar);
  } finally {
    if (anterior) Object.defineProperty(globalThis, "window", anterior);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("as três opções pedem confirmação e só executam a ação quando confirmadas", () => {
  const opcoes: [string, AcaoAvaliacao][] = [
    ["Finalizar avaliação da dupla", { tipo: "finalizar-dupla", rodadaId: 7 }],
    ["Chamar outro integrante", { tipo: "abrir-pergunta", rodadaId: 7 }],
    ["Finalizar avaliação do grupo", { tipo: "finalizar-avaliacao", rodadaId: 7 }],
  ];
  for (const [nome, acao] of opcoes) {
    for (const aceitar of [false, true]) {
      comConfirmacao(aceitar, (confirmar) => {
        const tela = pagina();
        expect(tela.botao(nome).disabled).toBe(false);
        tela.botao(nome).onClick!({} as never);
        expect(confirmar).toHaveBeenCalledTimes(1);
        expect(confirmar.mock.calls[0][0]).toBeString();
        if (aceitar) expect(tela.aoAtualizar).toHaveBeenCalledWith(acao);
        else expect(tela.aoAtualizar).not.toHaveBeenCalled();
      });
    }
  }
});

test("as opções aparecem depois do sorteio e ficam bloqueadas durante uma requisição", () => {
  const inicial = pagina({ ...avaliacao, dupla: null });
  expect(inicial.botao("Finalizar avaliação da dupla")).toBeUndefined();
  expect(inicial.botao("Chamar outro integrante")).toBeUndefined();
  expect(inicial.botao("Finalizar avaliação do grupo")).toBeUndefined();
  comConfirmacao(true, (confirmar) => {
    const tela = pagina(avaliacao, true);
    for (const botao of botoes(tela.elemento)) {
      expect(botao.disabled).toBe(true);
    }
    tela.botao("Finalizar avaliação do grupo").onClick!({} as never);
    expect(confirmar).not.toHaveBeenCalled();
    expect(tela.aoAtualizar).not.toHaveBeenCalled();
  });
});

test("a chamada lista apenas integrantes disponíveis e confirma a pessoa escolhida", () => {
  const dados: AvaliacaoAlunos = {
    ...avaliacao,
    dupla: { ...avaliacao.dupla!, aberta: true },
    rodadasFinalizadas: [{ id: 6, principal: integrantes[2], assistente: null, aberta: false, voluntario: integrantes[3] }],
  };
  for (const aceitar of [false, true]) {
    comConfirmacao(aceitar, (confirmar) => {
      const tela = pagina(dados);
      expect(tela.botao("Chamar outro integrante").disabled).toBe(true);
      for (const integrante of integrantes.slice(0, 4)) expect(tela.botao(integrante.nome)).toBeUndefined();
      tela.botao("Pessoa 5").onClick!({} as never);
      expect(confirmar).toHaveBeenCalledWith("Confirmar a chamada de Pessoa 5?");
      if (aceitar) expect(tela.aoAtualizar).toHaveBeenCalledWith({ tipo: "escolher-voluntario", rodadaId: 7, matricula: "5" });
      else expect(tela.aoAtualizar).not.toHaveBeenCalled();
    });
  }
  const chamada = pagina({ ...dados, dupla: { ...dados.dupla!, voluntario: integrantes[4] } });
  expect(chamada.botao("Pessoa 5")).toBeUndefined();
  expect(renderToStaticMarkup(chamada.elemento)).toContain("Integrante chamado");
});

test("é possível concluir o grupo depois da última dupla sem sortear participantes repetidos", () => {
  const tela = pagina({ integrantes: integrantes.slice(0, 2), dupla: null, rodadasFinalizadas: [avaliacao.dupla!] });
  expect(tela.botao("Escolher dupla").disabled).toBe(true);
  expect(renderToStaticMarkup(tela.elemento)).toContain("Todos os integrantes já participaram.");
  comConfirmacao(true, () => {
    tela.botao("Finalizar avaliação do grupo").onClick!({} as never);
    expect(tela.aoAtualizar).toHaveBeenCalledWith({ tipo: "finalizar-avaliacao", rodadaId: null });
  });
});

test("não permite chamar outro integrante quando todos já participaram", () => {
  const tela = pagina({ ...avaliacao, integrantes: integrantes.slice(0, 2) });
  expect(tela.botao("Chamar outro integrante").disabled).toBe(true);
  expect(renderToStaticMarkup(tela.elemento)).toContain("Não há outro integrante disponível para chamar.");
  expect(tela.botao("Finalizar avaliação da dupla").disabled).toBe(false);
  expect(tela.botao("Finalizar avaliação do grupo").disabled).toBe(false);
});

test("finalizar a dupla marca principal, assistente e integrante chamado, mantendo a marcação nas próximas duplas", () => {
  const rodada = { ...avaliacao.dupla!, aberta: true, voluntario: integrantes[2] };
  const emAndamento = pagina({ ...avaliacao, dupla: rodada });
  expect(renderToStaticMarkup(emAndamento.elemento)).not.toContain("Avaliação concluída");

  const finalizada: AvaliacaoAlunos = { ...avaliacao, dupla: null, rodadasFinalizadas: [rodada] };
  const proximaDupla = { id: 8, principal: integrantes[3], assistente: integrantes[4], aberta: false, voluntario: null };
  for (const dados of [finalizada, { ...finalizada, dupla: proximaDupla }]) {
    const html = renderToStaticMarkup(pagina(dados).elemento);
    const linhas = html.match(/<li\b[^>]*>[\s\S]*?<\/li>/g)!;
    expect(linhas).toHaveLength(5);
    for (const [indice, linha] of linhas.entries()) {
      expect(linha).toContain(integrantes[indice].nome);
      if (indice < 3) {
        expect(linha).toContain('aria-disabled="true"');
        expect(linha).toContain("✓");
        expect(linha).toContain("Avaliação concluída");
      } else {
        expect(linha).not.toContain("aria-disabled");
        expect(linha).not.toContain("✓");
        expect(linha).not.toContain("Avaliação concluída");
      }
    }
  }
});
