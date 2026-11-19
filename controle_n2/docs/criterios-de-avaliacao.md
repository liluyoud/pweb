# Critérios de avaliação da N2

A N2 vale **50 pontos por aluno**. O projeto vale **20 pontos** e a apresentação presencial vale **30 pontos**, sendo **10 pontos coletivos** e **20 pontos individuais**.

| Parte | Pontuação máxima | Como a nota é atribuída |
| --- | ---: | --- |
| Projeto entregue | 20 | Uma nota para o grupo, com base no código-fonte e na documentação |
| Apresentação presencial do projeto | 10 | Uma nota comum a todos os integrantes, com base na demonstração e na explicação |
| Resposta sobre o projeto | 20 | Uma nota registrada para cada aluno após a rodada de perguntas |

**Nota de cada aluno** = pontos do projeto + pontos da apresentação coletiva + pontos da resposta individual. Por exemplo, um grupo que ganha 18 no projeto e 8 na apresentação dá a todos os integrantes uma base de 26 pontos. Um aluno desse grupo que ganha 15 na resposta termina com **41 de 50 pontos**.

## Projeto entregue — 20 pontos

O professor avalia a versão entregue no repositório informado pelo grupo, usando o [enunciado do trabalho](trabalhos.md) como referência.

| Critério | Pontos | Para receber a pontuação integral |
| --- | ---: | --- |
| Funcionalidades do enunciado | 6 | As operações principais funcionam de ponta a ponta. A aplicação cumpre os fluxos e regras específicos do grupo, incluindo o filtro indicado. |
| Interface React | 4 | Os componentes organizam formulários e listas. Os campos têm rótulos claros, e a tela informa quando uma operação dá certo, falha ou não tem resultados. |
| API e banco SQLite | 4 | A API valida os dados antes de gravar, recusa operações inválidas e responde de modo que a interface possa mostrar o resultado. Os dados permanecem disponíveis após reiniciar o servidor. |
| Organização e legibilidade do código | 2 | Os nomes ajudam a entender o domínio. Os arquivos separam a interface, as rotas, as regras e o acesso ao banco de modo que outro aluno consiga acompanhar uma operação. |
| Documentação | 4 | O README explica o objetivo, identifica os integrantes e permite instalar, preparar dados de exemplo e rodar o projeto (**2 pontos**). A documentação descreve as rotas com exemplos de requisição e resposta (**1 ponto**) e as tabelas, seus relacionamentos e restrições (**1 ponto**). |
| **Total** | **20** | |

Em cada critério, o professor pode atribuir pontuação parcial pelo que estiver demonstrado no código ou na documentação. Um critério sem evidência recebe zero.

## Ordem de apresentação dos grupos

O sistema sorteia o primeiro grupo antes do início das apresentações. Quando o professor encerra a apresentação de um grupo, o sistema sorteia o próximo entre os que ainda não apresentaram. O sorteio continua até todos os grupos terem apresentado.

## Apresentação presencial coletiva — 10 pontos

O grupo apresenta a aplicação ao vivo. A nota desta parte é a mesma para todos os integrantes.

| Critério | Pontos | Para receber a pontuação integral |
| --- | ---: | --- |
| Demonstração da aplicação | 4 | Mostra o fluxo principal com dados de exemplo (**1 ponto**), usa o filtro do enunciado (**1 ponto**), demonstra uma operação rejeitada (**1 ponto**) e recupera os dados após reiniciar o servidor (**1 ponto**). |
| Explicação técnica | 3 | Explica o que a interface React envia (**1 ponto**), qual regra a API aplica (**1 ponto**) e como o SQLite guarda ou consulta os dados (**1 ponto**). Use um fluxo real da aplicação para ligar essas etapas. |
| Organização | 2 | Explica o problema que o projeto resolve (**1 ponto**) e apresenta as etapas em uma sequência que a turma consegue acompanhar (**1 ponto**). |
| Clareza da comunicação | 1 | Usa exemplos e termos precisos para que a turma entenda o que foi feito e por que a aplicação se comporta daquele modo. |
| **Total** | **10** | |

## Perguntas individuais — 20 pontos

Depois da apresentação coletiva, o professor faz rodadas de perguntas sobre o projeto daquele grupo. A pergunta pode tratar de um componente, uma rota, uma consulta, uma validação ou outra decisão que apareça no trabalho entregue.

### Como pontuar cada resposta

| Critério | Pontos | Para receber a pontuação integral |
| --- | ---: | --- |
| Correção técnica | 8 | Responde ao que foi perguntado e explica corretamente o conceito, a regra ou o comportamento envolvido. |
| Relação com o projeto | 6 | Identifica onde a decisão aparece no projeto e explica o papel dos componentes, funções, rotas ou tabelas envolvidos. |
| Raciocínio | 4 | Justifica a solução e explica como verificar o comportamento ou o que acontece no cenário proposto pelo professor. |
| Clareza | 2 | Apresenta a resposta com sequência, precisão e explicação suficiente para o professor acompanhar o raciocínio. |
| **Total** | **20** | |

### Como conduzir as rodadas

1. **Sortear a dupla.** O sistema sorteia aleatoriamente um aluno principal e um auxiliar entre os integrantes que ainda não têm nota individual. São dois alunos diferentes.
2. **Ouvir os dois.** O professor faz uma pergunta sobre o projeto. O principal responde primeiro. O auxiliar responde à mesma pergunta com a própria explicação e pode complementar o que foi dito.
3. **Registrar as notas.** Quando pelo menos um dos dois conseguir explicar o ponto central da pergunta, o professor avalia o que cada um demonstrou e registra uma nota individual de 0 a 20 para cada um. Quando nenhum dos dois conseguir responder suficientemente, o professor registra a **mesma nota de 0 a 20 para os dois**, considerando o que a dupla demonstrou pelos critérios da tabela. Se a dupla não demonstrar entendimento, a nota comum é zero.
4. **Abrir a pergunta, se for o caso.** Se nenhum dos sorteados conseguir responder, o professor pode oferecer a mesma pergunta aos demais integrantes ainda sem nota individual. Se um aluno se candidatar e responder, o professor avalia essa resposta e registra a nota individual do voluntário. Essa nota é dele. As notas da dupla permanecem registradas. O voluntário sai dos próximos sorteios assim que a nota dele é lançada.
5. **Repetir até avaliar todos.** Após cada rodada, o sistema sorteia uma nova dupla entre os alunos ainda sem nota. Principal e auxiliar também saem do sorteio assim que recebem suas notas. Se restar apenas um aluno, ele responde sozinho e recebe nota pelos mesmos critérios.
6. **Encerrar o grupo.** Quando todos os integrantes tiverem nota individual, o professor fecha a apresentação daquele grupo. Se ainda houver grupos pendentes, o sistema sorteia qual apresenta em seguida.
