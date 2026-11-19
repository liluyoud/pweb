# Guia de uso do Controle N2

Para instalar e testar em casa, siga o [tutorial](../tutorial.md). Este guia explica as telas e as regras. Os dados e as ações disponíveis dependem do perfil usado no login.

## 1. Entrar e sair

Na página inicial, informe matrícula e data de nascimento. O aluno usa os dados da lista selecionada; o professor usa a configuração local do `.env`.

No modo fictício, um exemplo é matrícula `2610001`, nascimento `14/03/2006`. O campo de data envia `2006-03-14` ao servidor. Para testar outra conta no mesmo navegador, use **Sair** primeiro. As abas do mesmo perfil de navegador compartilham a sessão.

A sessão dura oito horas e termina quando o servidor reinicia. Os vínculos e avaliações permanecem no SQLite. Ao receber um erro de acesso, confira a data e o modo de dados; depois de muitas tentativas incorretas, aguarde o bloqueio temporário.

## 2. Área do aluno

### Conhecer os projetos

Os cartões apresentam nome do grupo, título, ocupação e, quando enviado, o link do GitHub. **Ver projeto** abre o enunciado, os detalhes e os nomes dos integrantes atuais. Use **Fechar** para voltar.

### Escolher ou trocar de grupo

Em **Ver projeto**, clique em **Entrar neste grupo**. O painel passa a destacar o grupo atual, o próprio nome e os colegas. Cada aluno tem um único vínculo e pode trocar enquanto houver vaga no destino.

Se outra pessoa preencher a última vaga antes da confirmação da operação, o servidor recusa a entrada e mantém o vínculo anterior. Um grupo cheio não aceita a décima primeira inscrição. Clicar novamente no grupo atual mantém a escolha.

### Enviar o repositório

Depois de entrar em um grupo, preencha **Repositório do meu grupo** com a página HTTPS do repositório, por exemplo `https://github.com/turma/projeto`, e clique em **Salvar link**.

Qualquer integrante atual pode salvar ou substituir o link. Ele pertence ao grupo, por isso não acompanha o aluno em uma troca. Os cartões disponibilizam **Abrir no GitHub** em outra aba.

Use o endereço da página do repositório, sem caminho de arquivo, parâmetros ou endereço SSH. A aplicação valida o formato; a verificação do código entregue é feita pelo professor.

## 3. Grupos e repositórios do professor

O painel oferece três páginas no menu: **Grupos e repositórios**, **Auditoria** e **Alunos sem grupo**. O botão de atualização consulta novamente os dados. O envio de link por outra sessão aparece depois dessa atualização ou do recarregamento da página.

| Estado do cartão | Indicação e ações |
| --- | --- |
| Pendente | Exibe projeto, integrantes, ocupação e link enviado, quando houver |
| Sorteado | Cartão destacado, indicação **Grupo sorteado** e **Iniciar avaliação** |
| Em avaliação | Indicação **Avaliação em andamento** e **Abrir avaliação** |
| Finalizado | Cartão verde, ✓, **Grupo finalizado** e **Visualizar avaliação** |

**Escolher grupo** sorteia entre os grupos com integrantes e link do GitHub enviado que ainda não foram concluídos. Enquanto nenhum grupo atender às duas condições, o botão fica desabilitado. Só há um sorteio ou avaliação ativa por vez. Repetir a seleção conserva o grupo válido. Se o grupo sorteado ficar vazio, outro pode ser escolhido.

### Condição para iniciar

O início exige o grupo sorteado, pelo menos um integrante e link do GitHub enviado. Sem link, **Iniciar avaliação** fica desabilitado e aparece uma mensagem de espera. Peça a um integrante para salvar o link e use **Atualizar painel**. A mesma condição é conferida no servidor.

## 4. Avaliar os integrantes

**Iniciar avaliação** abre a tela do grupo. A barra lateral lista as matrículas e nomes registrados naquele momento. Essa lista continua associada à avaliação mesmo se alguém trocar de grupo depois.

Clique em **Escolher dupla** para sortear principal e assistente entre os disponíveis. Eles são pessoas diferentes; se sobrar apenas uma, ela responde sozinha. A dupla ativa é salva para retomar a avaliação após entrar novamente.

### As três opções

| Opção | O que acontece depois da confirmação |
| --- | --- |
| **Finalizar avaliação da dupla** | Encerra a rodada, mantém seu histórico e permite escolher outra dupla |
| **Chamar outro integrante** | Abre uma lista de pessoas ainda disponíveis para responder à mesma pergunta |
| **Finalizar avaliação do grupo** | Encerra a rodada ativa, quando houver, e conclui o grupo |

Todas pedem confirmação. **Cancelar** conserva o estado. Durante o envio, os controles ficam bloqueados para aguardar a resposta.

### Chamar outra pessoa

Depois de confirmar **Chamar outro integrante**, escolha um nome na lista e confirme a pessoa. Ela aparece como **Integrante chamado**. Cada rodada admite uma pessoa chamada. Quem já participou de uma rodada ou está na dupla ativa não aparece como candidato.

Se não houver outra pessoa disponível, o botão fica desabilitado. Depois de abrir a pergunta, a seleção permanece disponível ao retomar a página, até escolher alguém ou encerrar a rodada.

### Concluir uma rodada

Após confirmar **Finalizar avaliação da dupla**, principal, assistente e integrante chamado, quando houver, ficam desabilitados com ✓ na lista. A marcação continua nas próximas rodadas e ao consultar o histórico.

Use **Escolher dupla** para continuar. O sorteio exclui quem já participou. Se todos tiverem participado, a seleção de dupla fica desabilitada e a tela orienta encerrar o grupo. O histórico mostra as duplas na ordem em que foram registradas e os papéis de cada pessoa.

### Concluir o grupo

É possível finalizar durante uma rodada ou entre rodadas, depois de registrar pelo menos uma. O professor confirma **Finalizar avaliação do grupo** e retorna para **Grupos e repositórios**. O cartão passa a verde com ✓ e **Grupo finalizado**.

Use **Visualizar avaliação** para consultar o histórico. A consulta preserva os checks de quem participou e não oferece sorteios ou alterações. Também pode ser aberta enquanto outro grupo está em avaliação.

O sistema não exige participação de todos para aceitar o encerramento; cabe ao professor seguir os [critérios da atividade](criterios-de-avaliacao.md). Pessoas sem rodada finalizada ficam sem check. O lançamento de notas numéricas é externo à aplicação atual.

Para continuar as apresentações, clique em **Escolher grupo** no painel. Os concluídos ficam fora dos próximos sorteios.

## 5. Auditoria

A página mostra quem entrou ou trocou de grupo e quem enviou ou alterou um repositório, com os eventos mais recentes primeiro. A data é exibida no fuso do navegador. Os dados do banco estão em UTC.

Repetições da mesma escolha ou do mesmo link não criam outro evento. Tentativas rejeitadas não entram nesse histórico. A avaliação tem suas próprias tabelas de histórico e não aparece como evento de inscrição ou repositório.

## 6. Alunos sem grupo

A página apresenta o total de alunos da lista atual ainda sem um grupo válido, em ordem alfabética, com nome e matrícula. Se todos estiverem inscritos, informa que todos já têm grupo.

## 7. Endereços úteis

| Endereço na aplicação | Uso |
| --- | --- |
| `/#professor/grupos` | Painel de grupos do professor |
| `/#professor/auditoria` | Histórico de inscrições e links |
| `/#professor/alunos-sem-grupo` | Lista de pendências de inscrição |
| `/#professor/avaliacao/1` | Avaliação do grupo 1, se estiver em andamento ou concluída |
| `/api/grupos` | Catálogo público sem nomes de integrantes |
| `/docs` | Documentação interativa da consulta pública |

As páginas do professor continuam exigindo login do professor. O trecho após `#` seleciona a tela no navegador; as ações reais são validadas pela API.

Veja também a [arquitetura](../arquitetura.md), a [API](api.md) e o [banco de dados](banco-de-dados.md).
