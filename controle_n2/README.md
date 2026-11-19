# Controle N2

Aplicação didática de Programação Web para organizar os grupos da N2, receber os links dos projetos no GitHub e acompanhar as rodadas de avaliação. O código usa nomes em português e permite estudar um fluxo completo: **React → requisição HTTP → regras no servidor → SQLite → atualização da tela**.

A turma tem dez projetos, com até dez integrantes por grupo. Os [enunciados](docs/trabalhos.md) e os [critérios da atividade](docs/criterios-de-avaliacao.md) fazem parte deste material.

## Por onde começar

| Ordem | Leitura | O que você aprende |
| --- | --- | --- |
| 1 | Este README | Objetivo, ferramentas e primeira execução |
| 2 | [Tutorial](tutorial.md) | Instalar, configurar, testar em casa e acompanhar a construção |
| 3 | [Arquitetura](arquitetura.md) | Responsabilidades, fluxo dos dados e decisões de implementação |
| 4 | [Guia de uso](docs/uso.md) | Passo a passo das telas de aluno e professor |
| 5 | [API](docs/api.md) e [banco de dados](docs/banco-de-dados.md) | Requisições, respostas, tabelas e transações |
| 6 | [Testes e exercícios](docs/exercicios.md) | Verificar o comportamento e praticar alterações |

As pastas [src](src/README.md), [servidor](src/servidor/README.md), [web](src/web/README.md), [componentes](src/web/componentes/README.md) e [docs](docs/README.md) também têm seus próprios guias. Para revisar conceitos, consulte o [material compartilhado](../docs/README.md).

## Ferramentas utilizadas

| Ferramenta | Papel nesta aplicação |
| --- | --- |
| Bun | Executa TypeScript, instala dependências, entrega a interface, atende HTTP e executa testes |
| TypeScript | Define os formatos dos dados e verifica os tipos do servidor e da interface |
| React e React DOM | Montam as telas, os formulários e as listas no navegador |
| SQLite, por `bun:sqlite` | Guarda inscrições, repositórios, auditoria e avaliações em um arquivo |
| CSS local | Define cores, cartões, estados dos botões e adaptação para telas pequenas |
| `class-variance-authority` | Organiza variantes do botão; os componentes locais seguem o padrão shadcn/ui |
| OpenAPI e Scalar | Descrevem e exibem a consulta pública dos projetos |

O projeto usa um único processo e a porta **3400**. O Bun prepara os arquivos HTML, TSX e CSS da interface. Todas as dependências e versões estão no [package.json](package.json); o [bun.lock](bun.lock) registra a instalação. A documentação foi verificada com **Bun 1.4.4**.

## Como rodar

Tenha o Bun instalado e uma cópia deste repositório. As instruções para Windows, Linux e macOS estão no [tutorial](tutorial.md#1-preparar-o-computador).

No PowerShell, a partir da pasta `pweb`:

```powershell
cd controle_n2
bun install --frozen-lockfile
Copy-Item .env.example .env
bun -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copie a chave gerada para `APP_KEY` no `.env`. Use credenciais inventadas para o professor, por exemplo:

```dotenv
PROFESSOR_MATRICULA=9999999
PROFESSOR_DATA_NASCIMENTO=1980-01-01
APP_KEY=COLE_AQUI_A_CHAVE_GERADA_COM_64_CARACTERES_HEXADECIMAIS
CONTROLE_N2_DADOS_EXEMPLO=1
```

A última variável seleciona os **15 alunos fictícios** de [alunos.exemplo.md](docs/alunos.exemplo.md) e o banco **exemplo.sqlite**. Assim, você consegue testar sem `docs/alunos.md`. Substitua o texto ilustrativo de `APP_KEY` pela chave gerada. Se já houver um `.env`, ajuste-o sem sobrescrever suas configurações.

Inicie:

```powershell
bun run dev
```

| Recurso | Endereço |
| --- | --- |
| Aplicação | [http://127.0.0.1:3400](http://127.0.0.1:3400) |
| Catálogo público em JSON | [http://127.0.0.1:3400/api/grupos](http://127.0.0.1:3400/api/grupos) |
| Documentação interativa | [http://127.0.0.1:3400/docs](http://127.0.0.1:3400/docs) |
| Especificação OpenAPI | [http://127.0.0.1:3400/api/openapi.json](http://127.0.0.1:3400/api/openapi.json) |

Para entrar como aluna de exemplo, use matrícula **2610001** e nascimento **14/03/2006**. No campo de data, selecione esse dia; a interface envia `2006-03-14`. Para entrar como professor, use os valores que você definiu no `.env`.

Pare com `Ctrl+C`. Em desenvolvimento, alterações podem reiniciar o servidor; entre novamente e atualize a página. As sessões ficam em memória e os dados gravados continuam no SQLite.

## O que cada perfil faz

| Perfil | Funcionalidades |
| --- | --- |
| Visitante | Consulta projetos, ocupação e links pelo catálogo público, sem os nomes dos integrantes |
| Aluno | Entra com matrícula e nascimento, lê enunciados, escolhe ou troca de grupo e salva o repositório do próprio grupo |
| Professor | Consulta grupos, links, alunos sem grupo e auditoria; sorteia grupos e duplas; encerra rodadas e consulta avaliações finalizadas |

A avaliação só inicia quando o grupo sorteado tem integrantes e enviou o link do GitHub. Cada dupla pode incluir um principal, um assistente e um integrante chamado. As três opções de avaliação pedem confirmação. Quem concluiu uma rodada aparece desabilitado com um check na lista e fica fora dos próximos sorteios. O grupo encerrado aparece em verde com ✓ e **Visualizar avaliação** no painel do professor.

O sistema guarda **participações e estados da avaliação**. As notas numéricas e o texto das perguntas não são lançados pela aplicação; a rubrica está nos [critérios da atividade](docs/criterios-de-avaliacao.md). Para sortear o próximo grupo, o professor clica novamente em **Escolher grupo**.

## Comandos disponíveis

Execute na pasta `controle_n2`:

| Comando | Resultado |
| --- | --- |
| `bun install --frozen-lockfile` | Instala as versões registradas no arquivo de dependências |
| `bun run dev` | Inicia o servidor com observação de alterações |
| `bun run start` | Inicia o mesmo servidor sem observar alterações |
| `bun run verificar` | Confere os tipos com `tsc --noEmit` |
| `bun test` | Executa os testes automatizados com dados fictícios |
| `bun run iniciar-grupos` | Completa inscrições aleatórias até aproximadamente 80% da turma |
| `bun run auditoria` | Mostra os eventos de inscrição e repositório no terminal |

`iniciar-grupos` preserva inscrições existentes, respeita dez vagas por grupo e registra os novos vínculos na auditoria. Com os 15 alunos fictícios e o banco vazio, inscreve **12** e deixa **3** sem grupo. Ele usa o modo de dados selecionado no ambiente e não é executado automaticamente.

## Onde os dados ficam

| Arquivo | Uso |
| --- | --- |
| `docs/alunos.exemplo.md` | Cadastros fictícios versionados para estudar |
| `docs/alunos.md` | Lista local da turma, usada quando o modo de exemplo está desativado |
| `docs/trabalhos.md` | Fonte dos dez enunciados carregados pelo servidor |
| `.env` | Configuração local e credenciais do professor |
| `exemplo.sqlite` | Persistência do modo de exemplo |
| `controle_n2.sqlite` | Persistência do modo normal |

O [`.gitignore` compartilhado](../.gitignore) exclui a lista real, o `.env` e os bancos. A `APP_KEY` fica no servidor; o navegador usa o cookie de sessão. As tabelas são criadas automaticamente. Para recomeçar um teste com o banco de exemplo vazio, siga o procedimento de [backup e reinício](tutorial.md#7-reiniciar-ou-guardar-os-testes).

## Organização do projeto

```text
controle_n2/
├── src/
│   ├── tipos.ts              # Contratos de dados compartilhados
│   ├── servidor/             # HTTP, regras, Markdown, SQLite e comandos
│   └── web/                  # Interface React e componentes locais
├── docs/                     # Referência, enunciados, uso e exercícios
├── .env.example              # Modelo de configuração
├── package.json              # Scripts e dependências
├── bun.lock                  # Versões resolvidas
├── tsconfig.json             # Regras do TypeScript
├── arquitetura.md            # Como a aplicação foi organizada
└── tutorial.md               # Execução e roteiro de construção
```

O [tutorial](tutorial.md) inclui um teste completo com os dois perfis, inspeção das requisições e resolução de problemas. Para executar também o Acadêmico, use outro terminal e siga o [README dele](../academico/README.md): são aplicações com dependências e comandos próprios.
