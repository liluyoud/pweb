/*
 * ESPECIFICAÇÃO OPENAPI
 * ---------------------
 * OpenAPI é um formato padrão (usado no mundo todo) para DESCREVER uma API:
 * quais endereços existem, o que cada um recebe e o que devolve.
 *
 * Este arquivo é só um grande objeto JavaScript com essa descrição.
 * O Scalar lê este objeto e desenha uma página de documentação bonita
 * e interativa (dá até para testar a API por lá).
 *
 * Veja o resultado em:  http://localhost:3333/api/docs
 * Veja o objeto "cru":  http://localhost:3333/api/openapi.json
 *
 * ⚠️ IMPORTANTE: este arquivo NÃO controla a API. Ele só a DESCREVE.
 * Se você criar uma rota nova em index.ts, lembre de documentá-la aqui também.
 */

// ------------------------------------------------------------------
// Pedaços reaproveitados em vários lugares
// ------------------------------------------------------------------

// O "id" que aparece no endereço, como em /api/alunos/{id}
const PARAMETRO_ID = {
  name: "id",
  in: "path",
  required: true,
  description: "Número que identifica o registro",
  schema: { type: "integer", example: 1 },
};

// Resposta de erro padrão da nossa API: { "erro": "mensagem" }
function respostaDeErro(descricao: string) {
  return {
    description: descricao,
    content: { "application/json": { schema: { $ref: "#/components/schemas/Erro" } } },
  };
}

// Resposta que devolve UM registro de um esquema
function respostaUm(descricao: string, esquema: string) {
  return {
    description: descricao,
    content: { "application/json": { schema: { $ref: "#/components/schemas/" + esquema } } },
  };
}

// Resposta que devolve uma LISTA de registros de um esquema
function respostaLista(descricao: string, esquema: string) {
  return {
    description: descricao,
    content: {
      "application/json": {
        schema: { type: "array", items: { $ref: "#/components/schemas/" + esquema } },
      },
    },
  };
}

// Os dados enviados no corpo do pedido (POST e PUT)
function corpoDoPedido(esquema: string) {
  return {
    required: true,
    content: { "application/json": { schema: { $ref: "#/components/schemas/" + esquema } } },
  };
}

// ------------------------------------------------------------------
// As 5 rotas de um cadastro (CRUD) seguem sempre o mesmo padrão.
// Esta função monta a documentação delas para não repetirmos tudo
// quatro vezes (alunos, professores, disciplinas e matrículas).
//
// Exemplo: rotasDeCadastro("alunos", "aluno", "Aluno", "NovoAluno", "Alunos")
// ------------------------------------------------------------------
function rotasDeCadastro(
  recurso: string, // parte do endereço: "alunos"
  singular: string, // nome de um registro: "aluno"
  esquema: string, // esquema do registro completo: "Aluno"
  esquemaNovo: string, // esquema do formulário (sem id): "NovoAluno"
  grupo: string, // nome do grupo na documentação: "Alunos"
  filtros: object[] = [] // filtros opcionais da listagem (?campo=valor)
) {
  const listaEPost = {
    get: {
      tags: [grupo],
      summary: "Listar " + recurso,
      parameters: filtros,
      responses: { 200: respostaLista("Lista de " + recurso, esquema) },
    },
    post: {
      tags: [grupo],
      summary: "Cadastrar " + singular,
      requestBody: corpoDoPedido(esquemaNovo),
      responses: {
        201: respostaUm("Registro criado", esquema),
        400: respostaDeErro("Campo obrigatório vazio ou dado repetido"),
      },
    },
  };

  const comId = {
    parameters: [PARAMETRO_ID],
    get: {
      tags: [grupo],
      summary: "Buscar " + singular,
      responses: {
        200: respostaUm("Registro encontrado", esquema),
        404: respostaDeErro("Não encontrado"),
      },
    },
    put: {
      tags: [grupo],
      summary: "Atualizar " + singular,
      requestBody: corpoDoPedido(esquemaNovo),
      responses: {
        200: respostaUm("Registro atualizado", esquema),
        400: respostaDeErro("Campo obrigatório vazio ou dado repetido"),
        404: respostaDeErro("Não encontrado"),
      },
    },
    delete: {
      tags: [grupo],
      summary: "Excluir " + singular,
      responses: {
        200: {
          description: "Registro excluído",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } },
        },
        400: respostaDeErro("O registro está ligado a matrículas"),
        404: respostaDeErro("Não encontrado"),
      },
    },
  };

  // Devolve um objeto com os dois endereços como chaves.
  return {
    ["/api/" + recurso]: listaEPost,
    ["/api/" + recurso + "/{id}"]: comId,
  };
}

// ------------------------------------------------------------------
// Filtros que só a listagem de matrículas aceita
// (ex.: /api/matriculas?aluno_id=1&semestre=2026.1)
// ------------------------------------------------------------------
const FILTROS_MATRICULAS = [
  {
    name: "aluno_id",
    in: "query",
    required: false,
    description: "Mostra só as matrículas deste aluno (boletim)",
    schema: { type: "integer", example: 1 },
  },
  {
    name: "semestre",
    in: "query",
    required: false,
    description: "Mostra só as matrículas deste semestre",
    schema: { type: "string", example: "2026.1" },
  },
];

// ------------------------------------------------------------------
// A ESPECIFICAÇÃO COMPLETA
// ------------------------------------------------------------------
export const especificacao = {
  openapi: "3.1.0",

  info: {
    title: "API · Controle Acadêmico",
    version: "1.0.0",
    description:
      "API didática de um mini controle acadêmico: alunos, professores, disciplinas e matrículas.\n\n" +
      "Todas as respostas são em **JSON**. Em caso de erro, a resposta tem o formato `{ \"erro\": \"mensagem\" }`.\n\n" +
      "O **status** da matrícula (`aprovado`, `reprovado` ou `cursando`) é calculado pela API a partir das notas.",
  },

  // Onde a API está rodando (usado pelo botão "Test Request")
  servers: [{ url: "http://localhost:3333", description: "API local" }],

  // Grupos que aparecem no menu lateral da documentação
  tags: [
    { name: "Alunos" },
    { name: "Professores" },
    { name: "Disciplinas" },
    { name: "Matrículas", description: "Liga aluno + professor + disciplina em um semestre, com as notas." },
    { name: "Relatórios", description: "Dashboard e relatórios calculados com SQL." },
  ],

  // "..." espalha os endereços gerados pela função dentro deste objeto
  paths: {
    ...rotasDeCadastro("alunos", "aluno", "Aluno", "NovoAluno", "Alunos"),
    ...rotasDeCadastro("professores", "professor", "Professor", "NovoProfessor", "Professores"),
    ...rotasDeCadastro("disciplinas", "disciplina", "Disciplina", "NovaDisciplina", "Disciplinas"),
    ...rotasDeCadastro("matriculas", "matrícula", "Matricula", "NovaMatricula", "Matrículas", FILTROS_MATRICULAS),

    "/api/dashboard": {
      get: {
        tags: ["Relatórios"],
        summary: "Números do dashboard",
        responses: { 200: respostaUm("Resumo geral", "Dashboard") },
      },
    },
    "/api/relatorios/disciplinas": {
      get: {
        tags: ["Relatórios"],
        summary: "Desempenho por disciplina",
        responses: { 200: respostaLista("Uma linha por disciplina e semestre", "LinhaDesempenhoDisciplina") },
      },
    },
    "/api/relatorios/professores": {
      get: {
        tags: ["Relatórios"],
        summary: "Turmas por professor",
        responses: { 200: respostaLista("Uma linha por professor, disciplina e semestre", "LinhaTurmaProfessor") },
      },
    },
  },

  // ----------------------------------------------------------------
  // ESQUEMAS: o formato de cada dado.
  // São o equivalente, em OpenAPI, aos "type" de packages/tipos.
  // "allOf" = junta dois esquemas (como o "&" do TypeScript).
  // ["string", "null"] = pode ser texto ou null.
  // ----------------------------------------------------------------
  components: {
    schemas: {
      Erro: {
        type: "object",
        properties: { erro: { type: "string", example: "O campo \"nome\" é obrigatório." } },
      },
      Mensagem: {
        type: "object",
        properties: { mensagem: { type: "string", example: "Registro excluído." } },
      },
      Id: {
        type: "object",
        properties: { id: { type: "integer", example: 1 } },
      },

      NovoAluno: {
        type: "object",
        required: ["nome", "cpf", "matricula", "email"],
        properties: {
          nome: { type: "string", example: "Ana Beatriz Souza" },
          cpf: { type: "string", example: "111.111.111-11" },
          matricula: { type: "string", example: "2026001" },
          email: { type: "string", format: "email", example: "ana.souza@email.com" },
          telefone: { type: "string", example: "(69) 99901-0001" },
          foto: { type: ["string", "null"], description: "Imagem em base64", example: null },
        },
      },
      Aluno: { allOf: [{ $ref: "#/components/schemas/Id" }, { $ref: "#/components/schemas/NovoAluno" }] },

      NovoProfessor: {
        type: "object",
        required: ["nome", "cpf", "titulacao", "graduacao", "email"],
        properties: {
          nome: { type: "string", example: "Marcos Vinícius Teixeira" },
          cpf: { type: "string", example: "123.456.789-01" },
          titulacao: {
            type: "string",
            enum: ["Graduado", "Especialista", "Mestre", "Doutor", "Pós-Doutor"],
            example: "Doutor",
          },
          graduacao: { type: "string", example: "Ciência da Computação" },
          email: { type: "string", format: "email", example: "marcos.teixeira@faculdade.edu.br" },
          telefone: { type: "string", example: "(69) 98800-1001" },
          foto: { type: ["string", "null"], description: "Imagem em base64", example: null },
        },
      },
      Professor: { allOf: [{ $ref: "#/components/schemas/Id" }, { $ref: "#/components/schemas/NovoProfessor" }] },

      NovaDisciplina: {
        type: "object",
        required: ["nome", "curso", "carga_horaria"],
        properties: {
          nome: { type: "string", example: "Programação Web" },
          curso: { type: "string", example: "Ciência da Computação" },
          carga_horaria: { type: "integer", minimum: 1, example: 80 },
        },
      },
      Disciplina: {
        allOf: [{ $ref: "#/components/schemas/Id" }, { $ref: "#/components/schemas/NovaDisciplina" }],
      },

      NovaMatricula: {
        type: "object",
        required: ["aluno_id", "professor_id", "disciplina_id", "semestre"],
        properties: {
          aluno_id: { type: "integer", example: 1 },
          professor_id: { type: "integer", example: 2 },
          disciplina_id: { type: "integer", example: 2 },
          semestre: { type: "string", example: "2026.2" },
          n1: { type: ["number", "null"], minimum: 0, maximum: 10, example: 7.5 },
          n2: { type: ["number", "null"], minimum: 0, maximum: 10, example: 8 },
          pf: { type: ["number", "null"], minimum: 0, maximum: 10, example: null },
        },
      },
      Matricula: {
        allOf: [
          { $ref: "#/components/schemas/Id" },
          { $ref: "#/components/schemas/NovaMatricula" },
          {
            type: "object",
            properties: {
              status: { type: "string", enum: ["aprovado", "reprovado", "cursando"], example: "aprovado" },
              aluno_nome: { type: "string", example: "Ana Beatriz Souza" },
              professor_nome: { type: "string", example: "Patrícia Gomes Ribeiro" },
              disciplina_nome: { type: "string", example: "Programação Web" },
            },
          },
        ],
      },

      ItemGrafico: {
        type: "object",
        properties: {
          rotulo: { type: "string", example: "2026.1" },
          valor: { type: "number", example: 10 },
        },
      },
      Dashboard: {
        type: "object",
        properties: {
          totais: {
            type: "object",
            properties: {
              alunos: { type: "integer", example: 8 },
              professores: { type: "integer", example: 4 },
              disciplinas: { type: "integer", example: 6 },
              matriculas: { type: "integer", example: 26 },
            },
          },
          media_geral: { type: ["number", "null"], example: 6.81 },
          taxa_aprovacao: { type: ["integer", "null"], description: "Porcentagem (0 a 100)", example: 80 },
          situacao: { type: "array", items: { $ref: "#/components/schemas/ItemGrafico" } },
          matriculas_por_semestre: { type: "array", items: { $ref: "#/components/schemas/ItemGrafico" } },
          melhores_disciplinas: { type: "array", items: { $ref: "#/components/schemas/ItemGrafico" } },
        },
      },
      LinhaDesempenhoDisciplina: {
        type: "object",
        properties: {
          disciplina: { type: "string", example: "Programação Web" },
          curso: { type: "string", example: "Ciência da Computação" },
          semestre: { type: "string", example: "2026.1" },
          total: { type: "integer", example: 5 },
          aprovados: { type: "integer", example: 4 },
          reprovados: { type: "integer", example: 1 },
          cursando: { type: "integer", example: 0 },
          media: { type: ["number", "null"], example: 7.3 },
        },
      },
      LinhaTurmaProfessor: {
        type: "object",
        properties: {
          professor: { type: "string", example: "Patrícia Gomes Ribeiro" },
          titulacao: { type: "string", example: "Mestre" },
          disciplina: { type: "string", example: "Programação Web" },
          semestre: { type: "string", example: "2026.1" },
          total_alunos: { type: "integer", example: 5 },
          media: { type: ["number", "null"], example: 7.3 },
        },
      },
    },
  },
};
