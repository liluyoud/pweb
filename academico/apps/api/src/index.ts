/*
 * PONTO DE ENTRADA DA API
 * -----------------------
 * Este é o primeiro arquivo executado quando rodamos "bun run dev".
 * Ele liga um servidor web e diz qual função responde a cada endereço.
 *
 * Pense neste arquivo como o "cardápio" da API: ele lista tudo o que
 * a API sabe fazer. A "receita" de cada item fica na pasta rotas/.
 */
import * as alunos from "./rotas/alunos";
import * as professores from "./rotas/professores";
import * as disciplinas from "./rotas/disciplinas";
import * as matriculas from "./rotas/matriculas";
import * as relatorios from "./rotas/relatorios";
import * as documentacao from "./rotas/documentacao";
import { erro, traduzirErroDoBanco } from "./rotas/ajudantes";

const PORTA = 3333;

Bun.serve({
  port: PORTA,

  // MAPA DE ROTAS
  // Endereço  ->  { MÉTODO HTTP: função que responde }
  // O ":id" é uma parte variável do endereço (ex.: /api/alunos/7).
  routes: {
    "/api/alunos": { GET: alunos.listar, POST: alunos.criar },
    "/api/alunos/:id": { GET: alunos.buscar, PUT: alunos.atualizar, DELETE: alunos.excluir },

    "/api/professores": { GET: professores.listar, POST: professores.criar },
    "/api/professores/:id": { GET: professores.buscar, PUT: professores.atualizar, DELETE: professores.excluir },

    "/api/disciplinas": { GET: disciplinas.listar, POST: disciplinas.criar },
    "/api/disciplinas/:id": { GET: disciplinas.buscar, PUT: disciplinas.atualizar, DELETE: disciplinas.excluir },

    "/api/matriculas": { GET: matriculas.listar, POST: matriculas.criar },
    "/api/matriculas/:id": { GET: matriculas.buscar, PUT: matriculas.atualizar, DELETE: matriculas.excluir },

    "/api/dashboard": { GET: relatorios.dashboard },
    "/api/relatorios/disciplinas": { GET: relatorios.desempenhoPorDisciplina },
    "/api/relatorios/professores": { GET: relatorios.turmasPorProfessor },

    // Documentação interativa (Scalar). Abra /api/docs no navegador.
    "/api/openapi.json": { GET: documentacao.openapi },
    "/api/docs": { GET: documentacao.paginaDocumentacao },
  },

  // Chamado quando o endereço pedido não existe no mapa acima.
  fetch() {
    return erro("Rota não encontrada.", 404);
  },

  // Chamado quando alguma rota "quebra" (lança um erro).
  // Assim a API nunca cai: ela responde com uma mensagem amigável.
  error(problema) {
    console.error(problema);
    return erro(traduzirErroDoBanco(problema.message));
  },
});

console.log(`✅ API rodando em http://localhost:${PORTA}/api`);
console.log(`📖 Documentação em http://localhost:${PORTA}/api/docs`);
