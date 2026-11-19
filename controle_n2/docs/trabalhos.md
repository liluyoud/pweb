# Trabalhos em grupo da N2

A turma terá **10 grupos de até 10 integrantes**. Cada grupo desenvolverá a aplicação descrita no seu enunciado. Os projetos usam o Controle Acadêmico como referência para montar telas de cadastro, organizar a API e persistir dados no SQLite.

## O que todos os grupos devem entregar

- Uma interface em **React com TypeScript**. Use componentes do **shadcn/ui** para montar os formulários, as tabelas e os botões.
- Uma **API em Bun** que recebe os pedidos da interface, valida os dados e grava no **SQLite**. Os registros precisam continuar disponíveis após reiniciar o servidor.
- Uma tela principal com lista, formulário e o filtro indicado no enunciado. Os dados auxiliares usados nos formulários podem vir de uma segunda tela de cadastro ou de um conjunto de dados fictícios já incluído no banco.
- Mensagens claras para lista vazia, operação concluída e erro de validação. Use português do Brasil nos textos da interface e nos nomes do domínio, como `emprestimo` e `data_retirada`.
- Um `README.md` com o objetivo da aplicação, os nomes dos integrantes, como criar ou popular o banco com exemplos e os comandos para rodar a API e a interface.

Na apresentação, demonstrem um cadastro válido, o filtro, uma operação rejeitada pela API e a recuperação dos registros após reiniciar o servidor.

Consulte os [critérios de avaliação da N2](criterios-de-avaliacao.md) para ver como o projeto, a demonstração coletiva e as respostas individuais valem pontos.

Para começar, consultem o [tutorial do Controle Acadêmico](../../academico/tutorial.md) e o [material de estudo compartilhado](../../docs/README.md).

## Grupo 01: Boto Cor de Rosa

### Empréstimos da biblioteca

A biblioteca da turma precisa saber quais exemplares estão disponíveis e com quem estão os exemplares emprestados. A aplicação registra a retirada e a devolução de cada exemplar.

- **Dados.** Cada exemplar tem código único, título e autor. Cada empréstimo guarda o exemplar, o nome fictício de quem retirou o livro, a data de retirada e a data de devolução, preenchida quando o livro retorna.
- **Tela.** Registre uma retirada escolhendo um exemplar. Liste os empréstimos com o título do livro e filtre por situação, em aberto ou devolvido. Ofereça uma ação para registrar a devolução.
- **Regra.** Um exemplar pode ter apenas um empréstimo em aberto por vez. A data de devolução deve ser igual ou posterior à de retirada.
- **Teste.** Empreste o exemplar `B001` e tente emprestá-lo novamente. Depois de registrar a devolução, confira se o exemplar pode ser emprestado a outra pessoa.

## Grupo 02: Pirarucu

### Estoque de materiais de laboratório

O laboratório precisa acompanhar o saldo de materiais de consumo, como cabos e pilhas. A aplicação registra cada entrada ou saída e mostra quanto resta de cada item.

- **Dados.** Cada material tem nome e unidade de medida, como unidade ou caixa. Cada movimentação guarda o material, o tipo (entrada ou saída), a quantidade inteira e a data.
- **Tela.** Selecione o material e registre uma movimentação. Mostre o saldo atual por material e liste o histórico com filtro por material.
- **Regra.** O saldo é a soma das entradas menos a soma das saídas. A quantidade precisa ser maior que zero e uma saída só pode ser registrada quando houver saldo suficiente.
- **Teste.** Registre uma entrada de 10 unidades e uma saída de 3. Confira o saldo de 7 e confirme que uma tentativa de retirar 8 mantém o saldo em 7.

## Grupo 03: Dourado

### Reserva de salas de estudo

Uma unidade da faculdade oferece salas de estudo com reservas de uma hora. A aplicação ajuda a equipe a consultar a agenda e evitar que duas pessoas reservem a mesma sala no mesmo horário.

- **Dados.** Cada sala tem nome e capacidade. Cada reserva guarda a sala, o nome fictício de quem reservou, a data e a hora de início, sempre em hora cheia.
- **Tela.** Cadastre uma reserva, filtre a agenda por sala e data e ofereça uma ação para cancelar uma reserva existente.
- **Regra.** Para a mesma sala, só pode existir uma reserva em cada combinação de data e hora. Salas diferentes podem ser reservadas no mesmo horário.
- **Teste.** Reserve a Sala 1 às 14h e tente repetir o horário na mesma data. Faça uma reserva para a Sala 2 no mesmo horário. Cancele a primeira e confira se o horário da Sala 1 voltou a ficar disponível.

## Grupo 04: Tambaqui

### Pedidos da cantina

A cantina quer organizar os pedidos do balcão. Para manter a aplicação simples, cada pedido contém um único item do cardápio, que pode ser solicitado em várias unidades.

- **Dados.** Cada item tem nome e preço unitário em centavos. Cada pedido guarda o item, a quantidade inteira, a data, o preço unitário no momento do pedido e a situação.
- **Tela.** Escolha um item e informe a quantidade. Exiba o total em reais e liste os pedidos com filtro por situação. Permita avançar de `recebido` para `em preparo` e depois para `pronto`. Inclua um formulário simples para alterar o preço de um item.
- **Regra.** A quantidade deve ser maior que zero. O total é a quantidade multiplicada pelo preço registrado no pedido. Alterar o preço do cardápio vale para pedidos novos.
- **Teste.** Tente registrar um pedido com zero unidades. Depois, registre três sanduíches a R$ 8,50. Confira o total de R$ 25,50, altere o preço do sanduíche e verifique se o pedido antigo conserva seu total.

## Grupo 05: Tucunaré

### Inscrições em oficinas

A semana acadêmica oferece oficinas com vagas limitadas. A aplicação registra inscrições e informa quantas vagas estão disponíveis em cada oficina.

- **Dados.** Cada oficina tem título, data e número de vagas. Cada inscrição guarda a oficina, o nome e a matrícula fictícia da pessoa inscrita.
- **Tela.** Selecione uma oficina, cadastre ou cancele uma inscrição e filtre a lista de inscrições por oficina. Mostre quantas vagas estão disponíveis.
- **Regra.** Uma matrícula só pode ser inscrita uma vez em cada oficina. Ao atingir o limite de vagas, a API deve recusar novas inscrições nessa oficina.
- **Teste.** Em uma oficina de duas vagas, tente inscrever a mesma matrícula duas vezes. Inscreva uma segunda matrícula e confirme que a terceira é rejeitada. Cancele uma inscrição e confira se uma vaga foi liberada.

## Grupo 06: Peixe-boi-da-amazônia

### Diário da horta do campus

A equipe da horta precisa registrar as regas para saber quando cada canteiro foi cuidado. A aplicação mantém um diário que pode ser consultado por canteiro.

- **Dados.** Cada canteiro tem nome e cultura plantada. Cada registro de rega guarda o canteiro, a data, o nome fictício de quem fez a rega e uma observação opcional.
- **Tela.** Cadastre e edite registros de rega. Liste os registros do mais recente para o mais antigo, com filtro por canteiro. Mostre a data da última rega de cada canteiro.
- **Regra.** A data da rega deve ser igual ou anterior à data de hoje. Para este diário, há um registro por canteiro por dia.
- **Teste.** Registre regas em dois dias para o mesmo canteiro. Confira a data mais recente e tente registrar outra rega no mesmo dia. Cadastre uma rega de outro canteiro nesse dia.

## Grupo 07: Arara-vermelha

### Achados e perdidos

A recepção precisa organizar os objetos encontrados no campus. A aplicação registra onde cada objeto foi encontrado e permite acompanhar se ele ainda está guardado ou já foi devolvido.

- **Dados.** Cada local tem nome, como Biblioteca ou Bloco A. Cada item guarda descrição, categoria, local, data em que foi encontrado e uma data de devolução opcional.
- **Tela.** Cadastre e edite itens, busque pela descrição e filtre por situação, guardado ou devolvido. Ofereça uma ação para registrar a devolução.
- **Regra.** Um item começa como guardado. A data de devolução precisa ser igual ou posterior à data em que ele foi encontrado. A situação é devolvido quando há uma data de devolução válida.
- **Teste.** Cadastre um guarda-chuva encontrado na Biblioteca. Busque por parte da descrição, tente registrar uma devolução anterior à data do achado e depois registre uma data válida.

## Grupo 08: Onça-pintada

### Chamados de manutenção

A equipe de manutenção quer acompanhar problemas do campus, como uma lâmpada queimada em uma sala. A aplicação registra os chamados e mostra o que ainda precisa de atendimento.

- **Dados.** Cada ambiente tem nome. Cada chamado guarda o ambiente, um título, uma descrição, a prioridade (`baixa`, `media` ou `alta`) e a situação.
- **Tela.** Cadastre chamados, filtre por situação e mostre quantos ainda precisam de atendimento. Permita iniciar e concluir o atendimento de cada chamado.
- **Regra.** Todo chamado começa como `aberto` e segue para `em atendimento` antes de chegar a `concluido`. Prioridade e situação devem ter valores previstos pelo sistema.
- **Teste.** Abra um chamado e tente concluí-lo diretamente. Inicie o atendimento, conclua e verifique se o chamado sai da contagem de pendências.

## Grupo 09: Sucuri

### Quiz de revisão de programação web

A turma quer revisar conceitos de programação web com perguntas curtas de múltipla escolha. A aplicação permite cadastrar perguntas e responder a um quiz por tema.

- **Dados.** Cada tema tem nome, como React ou SQLite. Cada pergunta guarda o tema, o enunciado, três alternativas e a posição da alternativa correta.
- **Tela.** Cadastre e edite perguntas, filtre a listagem por tema e ofereça uma tela para responder às perguntas de um tema. Ao terminar, mostre o total de acertos.
- **Regra.** Cada pergunta tem três alternativas preenchidas e uma única alternativa correta. A pontuação corresponde à quantidade de respostas corretas conferidas pela API. Entregue a alternativa correta à tela de quiz somente após o envio das respostas.
- **Teste.** Tente cadastrar uma pergunta com uma alternativa vazia e confirme que a API a rejeita. Depois, cadastre três perguntas válidas de um tema. Responda duas corretamente e uma incorretamente. Confira se o resultado mostra 2 acertos de 3.

## Grupo 10: Jacaré-açu

### Registro de coleta seletiva

O projeto de coleta seletiva quer descobrir quanto material cada ponto do campus recebe. A aplicação registra as entregas e soma o peso por ponto e por período.

- **Dados.** Cada ponto de coleta tem nome e localização. Cada entrega guarda o ponto, a data, o tipo de material (papel, plástico ou metal) e o peso em quilogramas.
- **Tela.** Cadastre e corrija registros de entrega. Filtre a lista por ponto e por intervalo de datas, com início e fim incluídos. Mostre o peso total das entregas exibidas.
- **Regra.** O peso deve ser maior que zero e pode ter casas decimais. Quando houver duas datas no filtro, a data inicial deve ser igual ou anterior à final. Aceite data inicial ou final em branco para consultar sem aquele limite.
- **Teste.** Registre duas entregas de 1,5 kg e 2 kg no mesmo ponto e outra em um ponto diferente. Filtre pelo primeiro ponto e pelo período que inclui as três datas. Confira se o total é 3,5 kg.
