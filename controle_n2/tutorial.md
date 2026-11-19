# Tutorial: executar e entender o Controle N2

Este roteiro permite testar a aplicação em casa com dados fictícios e acompanhar como ela foi construída. Os comandos partem de uma cópia nova; se você já configurou o projeto, preserve seu `.env` e seu banco.

## 1. Preparar o computador

Você precisa de um navegador, um editor de código e do Bun. O Git permite baixar o repositório pelo terminal; baixar o ZIP no GitHub também funciona.

Instale o Bun conforme a [documentação oficial](https://bun.sh/docs/installation).

Windows, no PowerShell:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Linux ou macOS:

```bash
curl -fsSL https://bun.com/install | bash
```

Abra outro terminal após a instalação e confira:

```text
bun --version
git --version
```

A versão usada para verificar este material foi Bun **1.4.4**. O SQLite já é acessado pelo módulo `bun:sqlite`; os comandos desta aplicação usam o Bun diretamente.

Baixe e entre na aplicação:

```text
git clone https://github.com/liluyoud/pweb.git
cd pweb/controle_n2
bun install --frozen-lockfile
```

Se usou o ZIP, extraia-o e abra o terminal na pasta que contém o `package.json` do Controle N2. O projeto `academico` tem sua própria instalação; não é necessário iniciá-lo para usar o Controle N2.

## 2. Criar a configuração local

Copie o modelo. No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Gere uma chave local:

```text
bun -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Abra o `.env` no editor. Preencha as quatro variáveis:

```dotenv
PROFESSOR_MATRICULA=9999999
PROFESSOR_DATA_NASCIMENTO=1980-01-01
APP_KEY=COLE_AQUI_A_CHAVE_GERADA_COM_64_CARACTERES_HEXADECIMAIS
CONTROLE_N2_DADOS_EXEMPLO=1
```

O valor ilustrativo de `APP_KEY` precisa ser substituído pela saída do comando. A matrícula e a data acima são inventadas para este tutorial. A matrícula do professor deve ser numérica e diferente das matrículas dos alunos.

| Variável | Formato e efeito |
| --- | --- |
| `PROFESSOR_MATRICULA` | Texto com dígitos; identifica o perfil do professor |
| `PROFESSOR_DATA_NASCIMENTO` | Data válida em `AAAA-MM-DD` |
| `APP_KEY` | 32 bytes aleatórios representados por 64 caracteres hexadecimais |
| `CONTROLE_N2_DADOS_EXEMPLO` | `1` usa alunos fictícios e `exemplo.sqlite`; ausente ou outro valor usa lista local e `controle_n2.sqlite` |

O Bun carrega o `.env` ao executar na pasta da aplicação. Uma variável já definida no terminal pode prevalecer sobre o arquivo. No PowerShell, `Get-Item Env:CONTROLE_N2_DADOS_EXEMPLO -ErrorAction SilentlyContinue` permite conferir somente o seletor de dados.

## 3. Iniciar e fazer a primeira consulta

```text
bun run dev
```

O terminal deve informar o endereço `http://127.0.0.1:3400/`. Abra a aplicação. Em outra aba, acesse:

- [Catálogo JSON](http://127.0.0.1:3400/api/grupos): dez projetos com ocupação e repositório.
- [Scalar](http://127.0.0.1:3400/docs): consulta pública com documentação interativa.
- [OpenAPI](http://127.0.0.1:3400/api/openapi.json): descrição da operação em JSON.

A página Scalar carrega recursos pela internet. A aplicação e o catálogo funcionam localmente após instalar as dependências.

O arquivo `exemplo.sqlite` é criado automaticamente na raiz de `controle_n2`. O modo de exemplo usa [alunos.exemplo.md](docs/alunos.exemplo.md), sem exigir a lista real da turma.

Para parar, use `Ctrl+C`. `bun run start` inicia sem observar alterações. Os dois scripts usam o mesmo endereço e as mesmas regras; use um deles por vez.

## 4. Testar os dois perfis do começo ao fim

Este teste funciona de forma previsível em um banco de exemplo vazio. Se você já fez outros testes, use um novo banco conforme a seção 7 ou adapte o grupo escolhido.

### 4.1 Entrar como aluno

1. Use matrícula **2610001** e nascimento **14/03/2006**.
2. Abra **Ver projeto** do grupo 01, leia o enunciado e escolha **Entrar neste grupo**.
3. Confira o destaque do grupo e o próprio nome em **Meu grupo**.
4. Em **Repositório do meu grupo**, salve o endereço de um repositório seu, como `https://github.com/seu-usuario/seu-projeto`.
5. Use **Sair**.

O servidor valida o formato da URL. Ele não consulta o GitHub para verificar o conteúdo. Para testar a abertura do link, informe um repositório existente.

### 4.2 Acrescentar integrantes ao mesmo grupo

Repita o login e a escolha do grupo 01 com:

| Matrícula | Nome | Nascimento |
| --- | --- | --- |
| `2610002` | Bruno Henrique Alves Tavares | `22/07/2005` |
| `2610003` | Camila Fernanda Ribeiro Sousa | `09/11/2007` |

Saia de uma conta antes de entrar na outra. Os dados completos de exemplo estão no Markdown. Cada perfil de navegador compartilha sua sessão entre as abas; abrir outra aba não cria um usuário independente.

### 4.3 Entrar como professor e avaliar

1. Entre com matrícula **9999999** e nascimento **01/01/1980**, se usou a configuração deste tutorial.
2. Em **Grupos e repositórios**, clique em **Escolher grupo**. Com somente o grupo 01 ocupado, ele será selecionado.
3. Clique em **Iniciar avaliação**. Se o link estiver ausente, o botão ficará desabilitado; volte como aluno, salve o link e atualize o painel do professor.
4. Clique em **Escolher dupla**. Duas pessoas diferentes aparecem como principal e assistente.
5. Clique em **Chamar outro integrante**, confirme e selecione a pessoa restante. Confirme também a pessoa escolhida.
6. Clique em **Finalizar avaliação da dupla** e confirme. Os três participantes passam a aparecer desabilitados com ✓.
7. Clique em **Finalizar avaliação do grupo** e confirme.
8. O painel volta para **Grupos e repositórios**. O cartão fica verde com ✓ e **Grupo finalizado**.
9. Use **Visualizar avaliação**. Confira principal, assistente, integrante chamado e histórico. A consulta não oferece ações de alteração.

Para verificar o cancelamento, escolha uma ação e cancele a confirmação antes de confirmá-la. Cancelar não deve gravar nada. O aplicativo registra participação; a atribuição de notas numéricas segue o procedimento do professor fora da interface atual.

### 4.4 Conferir persistência e auditoria

Pare o servidor e inicie novamente. Entre como professor e confira o cartão finalizado e o histórico. Os dados permanecem; a sessão precisa ser refeita.

No painel **Auditoria**, confira as entradas no grupo e o envio do repositório. No terminal, na mesma pasta:

```text
bun run auditoria
```

Esse histórico registra inscrições e alterações de repositório. As rodadas e os encerramentos ficam nas tabelas de avaliação, não na tabela `auditoria`.

## 5. Preencher grupos automaticamente

Para praticar uma turma distribuída, use o comando a partir de `controle_n2`:

```text
bun run iniciar-grupos
```

Com modo de exemplo ativo e banco vazio, ele distribui 12 dos 15 alunos, deixando 3 sem grupo. O sorteio de pessoas e o desempate de grupos usam aleatoriedade; as matrículas escolhidas podem mudar entre bancos novos.

Se já houver inscrições, apenas completa a meta. Não move quem já escolheu, não remove ninguém se a meta tiver sido ultrapassada e não altera repositórios. O limite é de dez integrantes por grupo. Sem vagas suficientes, toda a operação é rejeitada.

O comando não envia links do GitHub nem inicia avaliações. Os integrantes precisam enviar os links antes do início de cada avaliação.

## 6. Verificar os tipos e executar testes

Em outro terminal, na pasta `controle_n2`:

```text
bun run verificar
bun test
```

`verificar` analisa os arquivos TypeScript e TSX sem gerar arquivos JavaScript. `bun test` usa bancos em memória ou temporários e dados fictícios. Os testes não exigem a lista real nem o `.env` preenchido, pois criam as configurações de teste no código.

Para executar um conjunto específico:

```text
bun test src/servidor/api.test.ts
bun test src/servidor/iniciar-grupos.test.ts
bun test src/web/avaliacao.test.tsx
bun test src/web/professor.test.tsx
```

Confira a cobertura de cenários e as atividades em [testes e exercícios](docs/exercicios.md). O teste manual no navegador complementa os testes de funções e renderização.

## 7. Reiniciar ou guardar os testes

Para começar outra turma fictícia sem perder o teste anterior, pare o servidor e os comandos que usam o banco. Na pasta `controle_n2`, renomeie apenas o arquivo de exemplo. No PowerShell:

```powershell
Rename-Item -LiteralPath .\exemplo.sqlite -NewName exemplo-anterior.sqlite
bun run dev
```

No Linux ou macOS:

```bash
mv exemplo.sqlite exemplo-anterior.sqlite
bun run dev
```

Use um nome de backup ainda inexistente. O próximo início cria outro `exemplo.sqlite` vazio. O `.env` deve continuar com `CONTROLE_N2_DADOS_EXEMPLO=1`.

Para guardar um ponto de recuperação sem começar do zero, com o servidor parado, copie `exemplo.sqlite` para um arquivo de backup. Guarde também a lista fictícia usada. Os nomes são resolvidos pelo Markdown, enquanto as matrículas e as participações ficam no banco.

## 8. Entender a construção por etapas

Esta é uma ordem para reconstruir a solução em uma pasta de estudo, usando os arquivos completos do repositório como referência. Os trechos abaixo destacam as decisões; a implementação completa está nos links.

### Etapa 1: preparar scripts, dependências e tipos

Examine [package.json](package.json) e [tsconfig.json](tsconfig.json). O projeto usa módulos ES, JSX do React e verificação estrita de tipos. `bun install --frozen-lockfile` instala o conjunto registrado em `bun.lock`.

Em [tipos.ts](src/tipos.ts), veja como os campos descrevem o domínio:

```ts
type AlunoDaAvaliacao = { matricula: string; nome: string };
type AvaliacaoGrupo = {
  grupoId: number;
  estado: "sorteado" | "em_avaliacao";
};
```

O tipo define o formato esperado durante o desenvolvimento. A API também valida os valores recebidos: um JSON vindo de fora pode desobedecer ao tipo.

### Etapa 2: transformar os documentos

Leia [documentos.ts](src/servidor/documentos.ts). Identifique a expressão regular que reconhece a tabela, a normalização do nome e o `Map` por matrícula. Depois acompanhe como `lerProjetos` transforma cada seção Markdown em `Projeto`.

### Etapa 3: persistir com SQLite

Leia [banco.ts](src/servidor/banco.ts) junto à [referência das tabelas](docs/banco-de-dados.md). Comece por `escolhas` e `repositorios`, depois passe à auditoria e à avaliação.

```ts
const consulta = banco.query<{ grupo_id: number }, [string]>(
  "SELECT grupo_id FROM escolhas WHERE matricula = ?",
);
const escolha = consulta.get("2610001");
```

O `?` recebe um parâmetro, separado do texto SQL. As funções de alteração agrupam leitura, regra e gravação em uma transação. Localize o retorno `false` quando falta vaga e observe que o vínculo anterior não é removido antes dessa conferência.

### Etapa 4: validar e responder por HTTP

Em [api.ts](src/servidor/api.ts), siga `POST /api/sessao`, `PUT /app/meu-grupo` e `painel`. Veja de onde sai a matrícula autenticada, como o perfil é conferido e por que um erro de regra resulta em `409`.

Em [index.ts](src/servidor/index.ts), observe a importação do HTML e o registro das rotas. O [OpenAPI](src/servidor/openapi.ts) descreve a consulta pública para o Scalar.

### Etapa 5: montar a interface

O [index.html](src/web/index.html) contém `div#raiz`. [principal.tsx](src/web/principal.tsx) liga o React nessa div e escolhe a tela a partir da sessão.

Leia [web/api.ts](src/web/api.ts): a função `pedir` faz `fetch`, interpreta JSON e lança `ErroDaApi` quando o status indica falha. As telas recebem o painel atualizado e o colocam no estado React.

Nos [componentes locais](src/web/componentes/ui.tsx), acompanhe como `Button` recebe `disabled`, `onClick`, `variant` e `children` e repassa propriedades para o botão HTML. Em [estilos.css](src/web/estilos.css), localize o estilo de grupo finalizado e a regra de tela pequena.

### Etapa 6: organizar o professor e a avaliação

[professor.tsx](src/web/professor.tsx) interpreta o fragmento `#professor/...` e mostra cartões e relatórios. [avaliacao.tsx](src/web/avaliacao.tsx) calcula quem já participou, mostra confirmações e encaminha ações com o identificador da rodada.

Siga o encerramento da dupla: ação confirmada → rota de ações → transação → `rodadasFinalizadas` na resposta → lista com ✓. Depois siga o encerramento do grupo e a abertura da avaliação concluída por seu identificador.

### Etapa 7: testar e documentar uma mudança

Leia um teste de cada camada. Faça uma mudança pequena, execute os testes relacionados e registre o comportamento esperado na documentação. Os [guias das pastas](src/README.md) indicam onde procurar cada assunto.

## 9. Inspecionar uma requisição no navegador

1. Abra as ferramentas do desenvolvedor (`F12`) e a aba **Rede/Network**.
2. Com dados fictícios, entre no sistema e faça uma escolha.
3. Selecione a chamada `PUT /app/meu-grupo` e confira o JSON `{ "grupoId": 1 }`.
4. Confira `200` e o painel na resposta; uma operação recusada traz `{ "erro": "..." }`.
5. Em **Aplicativo/Armazenamento**, localize o cookie de sessão. A chave `APP_KEY` não é enviada pela função cliente.

Requisições de alteração usam a origem exata da página. Use sempre `127.0.0.1:3400` durante o roteiro para manter endereço e cookie consistentes. A [referência da API](docs/api.md) inclui exemplos para o console da própria página.

## 10. Usar outra lista local

Para estudar com outra turma fictícia, copie a tabela de exemplo para `docs/alunos.md`, mantenha as colunas e preencha somente dados inventados. Remova `CONTROLE_N2_DADOS_EXEMPLO=1` do `.env` ou defina `0`; limpe também um eventual valor `1` definido no terminal.

No PowerShell, remova somente a variável de seleção do terminal:

```powershell
Remove-Item Env:CONTROLE_N2_DADOS_EXEMPLO -ErrorAction SilentlyContinue
```

No Bash:

```bash
unset CONTROLE_N2_DADOS_EXEMPLO
```

Reinicie. O modo normal usa `controle_n2.sqlite`, separado do exemplo. Confira a [estrutura dos documentos](docs/README.md) antes de mudar alunos ou enunciados.

## 11. Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| `bun` não é reconhecido | Reabra o terminal após instalar e confira `bun --version` |
| Falha de importação de pacote | Entre em `controle_n2` e execute `bun install --frozen-lockfile` |
| `APP_KEY` inválida | Gere outra chave e confira 64 caracteres hexadecimais, sem o texto ilustrativo |
| Erro nas credenciais do professor | Use matrícula numérica, data `AAAA-MM-DD` válida e matrícula diferente das dos alunos |
| Arquivo de alunos ausente | Ative `CONTROLE_N2_DADOS_EXEMPLO=1` no `.env` para estudar em casa |
| Lista sem alunos válidos | Preserve a tabela com matrícula, nome e data `DD/MM/AAAA` |
| Erro de estrutura dos trabalhos | Preserve grupos 01 a 10 e os cabeçalhos e itens esperados pelo leitor |
| Porta 3400 em uso | Pare outra instância que você iniciou; o endereço está definido em `src/servidor/index.ts` |
| Login falha ou recebe `429` | Confira a data da lista fictícia e aguarde a janela de bloqueio se houve muitas falhas |
| Iniciar avaliação está desabilitado | O grupo deve ter integrantes e enviar o link do GitHub; atualize o painel após o envio |
| Não há grupo para sortear | Confira se há grupos com integrantes e link do GitHub que ainda não foram finalizados |
| Não há outra dupla disponível | Todos os integrantes já participaram; encerre o grupo |
| Saiu da conta após editar código | O servidor reiniciou e suas sessões eram mantidas em memória; entre novamente |
| A tela mostra dados antigos | Atualize o painel ou recarregue; a interface não sincroniza automaticamente todas as sessões |
| Alteração recebe `403` | Use o perfil correto e a origem da aplicação, sem enviar a chamada a partir de outro site |
| Scalar não carrega | Confira a conexão com a internet; consulte o JSON OpenAPI local ou o Markdown da API |

Continue na [arquitetura](arquitetura.md), no [guia de uso](docs/uso.md) e nos [exercícios](docs/exercicios.md).
