# Controle N2

O Controle N2 é um projeto didático de Programação Web. O objetivo é acompanhar os grupos que farão a atividade que vale a nota N2.

A atividade prevê 10 grupos de até 10 integrantes, cada um com um projeto em React. Consulte os [trabalhos da N2](docs/trabalhos.md).

## O que o aluno pode fazer

Entrar com matrícula e data de nascimento, consultar os dez projetos e escolher um grupo. O painel destaca o grupo atual e mostra as vagas. Em **Ver projeto**, o aluno pode ler o enunciado e consultar a lista atual de integrantes antes de escolher. O aluno pode trocar quantas vezes quiser, desde que haja vaga no destino. A troca libera a vaga anterior.

Depois de escolher um grupo, qualquer integrante pode salvar ou atualizar o endereço em **Repositório do meu grupo**. Todos os alunos autenticados podem abrir os links nos cartões dos grupos, em outra aba. Use o link HTTPS do repositório, como `https://github.com/usuario/projeto`. O link fica associado ao grupo quando um aluno troca de grupo.

## Arquitetura

| Camada | Papel |
| --- | --- |
| Interface em React com shadcn/ui | Exibir as telas e receber as ações de quem usa o sistema |
| API em TypeScript executada pelo Bun | Receber requisições, aplicar as regras da atividade e consultar o banco |
| Banco SQLite | Guardar os dados do sistema |

O Bun entrega a página React e a API no mesmo endereço. A API valida os dados e inicia a sessão com um cookie. O SQLite guarda a escolha de cada aluno.

## Como rodar

O servidor carrega o arquivo `.env` na raiz do Controle N2. Em uma cópia nova do projeto, copie [`.env.example`](.env.example) para `.env` e preencha `PROFESSOR_MATRICULA`, `PROFESSOR_DATA_NASCIMENTO` (formato `AAAA-MM-DD`) e `APP_KEY`. Use uma matrícula diferente das matrículas dos alunos. Para gerar uma chave de 32 bytes em hexadecimal, rode:

```powershell
bun -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

O `.env` está no `.gitignore`. A `APP_KEY` fica no servidor. Para mudar de grupo ou salvar um link, o navegador envia apenas a sessão e os dados do formulário. O servidor fornece a chave à operação interna e valida a sessão, a origem e as permissões.

Com o Bun instalado, rode estes comandos a partir de `pweb`.

```powershell
cd controle_n2
bun install
bun run dev
```

Abra [http://127.0.0.1:3400](http://127.0.0.1:3400). O servidor lê `docs/alunos.md` a cada inicialização. Use uma matrícula e a data de nascimento correspondente para entrar. Na primeira execução, o servidor cria `controle_n2.sqlite`. A lista real e os bancos locais são ignorados pelo Git.

Para rodar os dois sistemas juntos, abra outro terminal, entre em `pweb/academico`, instale as dependências de lá e rode `bun run dev`. O Acadêmico usa **5173** para a interface e **3333** para a API.

Para praticar com a lista fictícia, pare o servidor e rode no PowerShell.

```powershell
$env:CONTROLE_N2_DADOS_EXEMPLO = "1"
bun run dev
```

Nesse modo, o servidor usa `docs/alunos.exemplo.md` e grava as escolhas em `exemplo.sqlite`. Para voltar aos dados reais, pare o servidor e execute `Remove-Item Env:CONTROLE_N2_DADOS_EXEMPLO` antes de iniciá-lo novamente.

## Ambiente do professor

Entre pela mesma página que os alunos usando a matrícula e a data de nascimento do `.env`. No menu do topo, escolha **Grupos e repositórios**, **Auditoria** ou **Alunos sem grupo**. O relatório de alunos sem grupo lista nomes e matrículas em ordem alfabética e mostra o total. Use o ícone **Atualizar painel**, no canto superior direito, para consultar as alterações mais recentes.

Em **Grupos e repositórios**, clique em **Escolher grupo** para sortear um grupo com integrantes. O cartão sorteado ganha destaque e mostra **Iniciar avaliação**. A escolha e o início da avaliação ficam registrados no SQLite.

**Iniciar avaliação** abre a página **Avaliação do grupo**. A barra lateral lista os integrantes do grupo em avaliação. **Escolher dupla** sorteia o principal e o assistente entre esses integrantes. Se houver um só integrante, ele responde sozinho. A dupla fica salva para retomar a avaliação.

O catálogo público em [`/api/grupos`](http://127.0.0.1:3400/api/grupos) apresenta projetos, ocupação e links do GitHub. Os nomes dos integrantes e o painel exigem login. A auditoria no navegador exige o perfil de professor.

A [documentação interativa em `/docs`](http://127.0.0.1:3400/docs) permite testar as consultas públicas. A interface do Scalar é carregada de um CDN e precisa de internet.

## Como estudar o código

1. Leia `src/servidor/documentos.ts` para ver como a aplicação lê os registros e enunciados dos documentos Markdown.
2. Em `src/servidor/banco.ts`, acompanhe a transação que confere a lotação e grava a escolha.
3. Em `src/servidor/api.ts`, identifique como a sessão informa quem está trocando de grupo.
4. Abra `src/web/principal.tsx` para seguir o formulário de acesso, a lista e os detalhes. A interface usa componentes no padrão shadcn/ui adaptados para CSS local.

Rode `bun run verificar` para checar os tipos e `bun test` para testar o fluxo com alunos fictícios.

## Consultar a auditoria

Na pasta `controle_n2`, execute `bun run auditoria` para ver o histórico em ordem de registro. Cada evento mostra a data e a hora em UTC, a matrícula de quem fez a alteração e os valores anteriores e novos aplicáveis. O comando usa o mesmo banco selecionado para o servidor, inclusive quando `CONTROLE_N2_DADOS_EXEMPLO` está ativado. Veja os [campos da auditoria](docs/banco-de-dados.md#auditoria).

- [Documentação do Controle N2](docs/README.md)
- [Material de estudo compartilhado](../docs/README.md)
