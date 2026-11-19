import { expect, test } from "bun:test";
import { abrirBanco } from "./banco";

const turma = (total: number) => new Set(Array.from({ length: total }, (_, indice) => String(indice + 1)));
const grupos = new Set(Array.from({ length: 10 }, (_, indice) => indice + 1));

test("distribui 80% da turma, equilibra os grupos e registra as inscrições na auditoria", () => {
  const banco = abrirBanco(":memory:");
  try {
    expect(banco.iniciarGrupos(turma(103), grupos)).toEqual({ inscritos: 82, novos: 82, semGrupo: 21 });
    const escolhas = banco.listarEscolhas();
    expect(new Set(escolhas.map(({ matricula }) => matricula)).size).toBe(82);
    expect(escolhas.every(({ matricula }) => turma(103).has(matricula))).toBe(true);
    const ocupacoes = [...grupos].map((id) => escolhas.filter(({ grupo_id }) => grupo_id === id).length);
    expect(Math.min(...ocupacoes)).toBe(8);
    expect(Math.max(...ocupacoes)).toBe(9);
    expect(banco.listarAuditoria()).toHaveLength(82);
    expect(banco.iniciarGrupos(turma(103), grupos)).toEqual({ inscritos: 82, novos: 0, semGrupo: 21 });
    expect(banco.listarEscolhas()).toEqual(escolhas);
    expect(banco.listarAuditoria()).toHaveLength(82);
  } finally {
    banco.fechar();
  }
});

test("preserva escolhas e repositórios existentes, mesmo quando a turma já ultrapassou a meta", () => {
  const banco = abrirBanco(":memory:");
  try {
    for (const matricula of turma(10)) banco.escolher(matricula, 1, 10);
    banco.salvarRepositorio("1", 1, "https://github.com/turma/projeto");
    expect(banco.iniciarGrupos(turma(20), grupos)).toEqual({ inscritos: 16, novos: 6, semGrupo: 4 });
    for (const matricula of turma(10)) expect(banco.grupoAtual(matricula)).toBe(1);
    expect(banco.listarRepositorios().get(1)).toBe("https://github.com/turma/projeto");
    const antes = banco.listarEscolhas();
    expect(banco.iniciarGrupos(turma(10), grupos)).toEqual({ inscritos: 10, novos: 0, semGrupo: 0 });
    expect(banco.listarEscolhas()).toEqual(antes);
  } finally {
    banco.fechar();
  }
});

test("recusa falta de vagas sem gravar inscrições nem auditoria parcial", () => {
  const banco = abrirBanco(":memory:");
  try {
    banco.escolher("fora-da-lista", 1, 10);
    const antes = banco.listarEscolhas();
    const auditoria = banco.listarAuditoria();
    expect(() => banco.iniciarGrupos(turma(125), grupos)).toThrow("Não há vagas");
    expect(banco.listarEscolhas()).toEqual(antes);
    expect(banco.listarAuditoria()).toEqual(auditoria);
  } finally {
    banco.fechar();
  }
});
