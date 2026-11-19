# Testes e exercícios do Controle N2

Use o [tutorial](../tutorial.md) para preparar o modo fictício. As atividades abaixo relacionam as telas com a API e o banco. Faça alterações em uma cópia de estudo e use somente dados inventados.

## 1. Executar a verificação existente

Na pasta `controle_n2`:

```text
bun run verificar
bun test
```

A primeira chamada confere os tipos. A segunda executa os arquivos `*.test.ts` e `*.test.tsx`. As configurações de teste são criadas no código; os bancos são em memória ou temporários. Não é necessário obter a lista real de alunos nem configurar o professor real.

| Arquivo | Cenários verificados |
| --- | --- |
| [api.test.ts](../src/servidor/api.test.ts) | Login, catálogo, perfis, vagas, trocas, repositórios, auditoria, persistência, sorteio só de grupos com integrantes e GitHub, avaliação e bloqueio de início sem GitHub |
| [iniciar-grupos.test.ts](../src/servidor/iniciar-grupos.test.ts) | Meta aproximada de 80%, equilíbrio de ocupação, preservação de dados e recusa sem vagas |
| [avaliacao.test.tsx](../src/web/avaliacao.test.tsx) | Confirmar ou cancelar ações, bloqueio durante envio, lista de disponíveis, conclusão e checks dos participantes |
| [professor.test.tsx](../src/web/professor.test.tsx) | Cartão finalizado, consulta de histórico, seleção da avaliação pela rota e botão de início condicionado ao GitHub |

Os testes de interface verificam componentes e a renderização HTML no ambiente de teste. Eles não dirigem um navegador completo. Faça também o roteiro manual para conferir layout, navegação, diálogo nativo de confirmação e interação real.

## 2. Roteiro manual de conferência

| Ação | Resultado esperado |
| --- | --- |
| Abrir `/api/grupos` sem login | Dez projetos, sem nomes dos integrantes |
| Entrar com uma pessoa fictícia | Painel do aluno e cookie de sessão |
| Ler e escolher um projeto | Vínculo exibido no painel e ocupação atualizada |
| Trocar para grupo com vaga | Vaga liberada no anterior e novo vínculo salvo |
| Tentar entrar em grupo cheio | Erro, preservando o vínculo anterior |
| Salvar link inválido | Mensagem de validação, sem substituir o link salvo |
| Salvar link HTTPS de repositório | Link visível no painel e nos cartões |
| Tentar iniciar grupo sem link | Botão bloqueado e recusa também no servidor |
| Cancelar finalização da dupla ou grupo | Estado preservado |
| Chamar pessoa disponível | Nome registrado como integrante chamado |
| Finalizar dupla | Principal, assistente e chamado aparecem com ✓ e fora dos próximos sorteios |
| Finalizar grupo | Retorno ao painel, cartão verde com ✓ e consulta disponível |
| Abrir histórico durante avaliação de outro grupo | Dados do grupo escolhido, sem controles de alteração |
| Reiniciar servidor | Novo login obrigatório, mantendo vínculos, links e avaliações |

O passo a passo com três integrantes está no [tutorial](../tutorial.md#4-testar-os-dois-perfis-do-começo-ao-fim).

## 3. Exercício: acompanhar um clique

Escolha a operação **Entrar neste grupo** e localize:

1. O botão e o componente que o contém.
2. A função cliente que faz `fetch`.
3. A rota que lê `grupoId` e obtém a matrícula da sessão.
4. A transação que consulta a lotação.
5. O ponto em que escolha e auditoria são gravadas.
6. O estado React atualizado com a resposta.

Entregue um diagrama e uma explicação com os arquivos envolvidos. O objetivo é ligar as camadas, não apenas enumerar arquivos.

## 4. Exercício: entender os documentos

Use três linhas de [alunos.exemplo.md](alunos.exemplo.md). Acrescente uma matrícula fictícia com zero inicial e execute o leitor em uma cópia da tabela.

Verifique se a matrícula continua sendo texto, se espaços repetidos no nome são normalizados e como o nascimento muda de formato. Duplique uma linha idêntica e depois uma linha com dados conflitantes para a mesma matrícula. Explique a diferença entre deduplicar e rejeitar um conflito.

Leia [documentos.ts](../src/servidor/documentos.ts) e indique quais mudanças no Markdown poderiam fazer o leitor deixar de reconhecer uma linha.

## 5. Exercício: consulta e filtro de integrantes

Acrescente uma busca por nome na lista lateral da avaliação. Preserve o conjunto completo usado no cálculo de disponíveis e aplique o filtro apenas à exibição.

Critérios de conclusão: busca sem diferenciar maiúsculas e minúsculas, mensagem para nenhum resultado, recuperação da lista ao limpar o campo e manutenção dos checks. Explique por que filtrar a tela não deve alterar quem pode participar do sorteio.

## 6. Exercício: capacidade e transação

Em um banco de estudo, preencha um grupo com dez alunos fictícios. Tente transferir um décimo primeiro aluno que já tenha outro grupo.

Confira as duas ocupações e a auditoria antes e depois. O aluno deve permanecer no grupo anterior e a tentativa rejeitada não deve produzir um evento de troca. Localize a transação imediata e explique por que apagar a escolha anterior primeiro seria um erro.

## 7. Exercício: identidade e permissão

Use o painel de rede e observe que a troca envia apenas `{ "grupoId": ... }`. Responda:

- Por que a matrícula precisa vir da sessão?
- Por que o botão desabilitado precisa ser acompanhado de validação no servidor?
- Como a API distingue professor e aluno?
- Onde a `APP_KEY` entra no fluxo e por que não há um campo dela no formulário?
- O que acontece com a sessão e com os dados após reiniciar?

Demonstre uma operação rejeitada por perfil usando somente as contas fictícias da sua instalação.

## 8. Exercício: histórico e lista registrada

Inicie a avaliação de um grupo e depois troque um integrante para outro grupo em uma sessão de aluno. Confira que a lista da avaliação permanece a registrada no início.

Finalize uma rodada e abra a avaliação novamente. Explique como `avaliacao_integrantes`, `avaliacao_rodadas` e `escolhas` representam informações diferentes. Mostre uma consulta que liste os participantes e seus papéis, usando a [referência do banco](banco-de-dados.md).

## 9. Exercício: relatório de participação

Acrescente à consulta da avaliação concluída um total de integrantes avaliados e ainda sem participação. Conte matrículas únicas de principal, assistente e voluntário nas rodadas finalizadas.

Critérios de conclusão: grupo com uma pessoa, rodada sem voluntário, grupo encerrado antes de todos participarem e nenhum total negativo. Explique por que contar somente a quantidade de duplas e multiplicar por dois não resolve todos os casos.

## 10. Desafio: planejar o lançamento de notas

O sistema atual não lança notas. Proponha uma evolução para registrar notas individuais de 0 a 20 e as parcelas coletivas da rubrica.

Descreva os novos campos e tipos, a migração do banco, a rota, as permissões, as validações, o formulário e o histórico. Considere zero como nota válida e diferencie zero de nota ainda ausente. Escreva cenários de aceitação antes de implementar.

Use os [critérios de avaliação](criterios-de-avaliacao.md) para o domínio e a [arquitetura](../arquitetura.md) para distribuir as responsabilidades.

Continue na [trilha compartilhada de exercícios](../../docs/exercicios.md).
