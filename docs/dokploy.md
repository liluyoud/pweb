# Publicação no Dokploy

Este guia publica os dois sistemas do repositório em um único domínio, usando um serviço **Docker Compose** do Dokploy:

| Endereço | O que abre | Origem no repositório |
| --- | --- | --- |
| `https://pweb.computacao.cloud/` | Página inicial com links para os sistemas | [index.html](../index.html) |
| `https://pweb.computacao.cloud/avaliacao/` | Controle Acadêmico (site + API em `/avaliacao/api`) | [academico/](../academico/) |
| `https://pweb.computacao.cloud/n2/` | Controle N2 (páginas + API em `/n2/api`) | [controle_n2/](../controle_n2/) |

## Como as peças se encaixam

```text
Navegador ──HTTPS──▶ Traefik (Dokploy) ──HTTP──▶ gateway (nginx :80)
                                                   ├── /              → index.html
                                                   ├── /avaliacao/    → site do Acadêmico (arquivos estáticos)
                                                   ├── /avaliacao/api → academico-api (Bun :3333)
                                                   └── /n2/           → controle-n2 (Bun :3400)
```

| Arquivo | Papel |
| --- | --- |
| [docker-compose.yml](../docker-compose.yml) | Declara os três serviços, a rede `interna` e os volumes dos bancos |
| [gateway/Dockerfile](../gateway/Dockerfile) | Compila o site do Acadêmico para `/avaliacao/` e monta o nginx |
| [gateway/nginx.conf](../gateway/nginx.conf) | Rotas por subcaminho; remove o prefixo antes de repassar às APIs |
| [academico/Dockerfile](../academico/Dockerfile) | API do Acadêmico; popula o banco com exemplos no primeiro início |
| [controle_n2/Dockerfile](../controle_n2/Dockerfile) | Servidor do Controle N2 em modo de produção |

Só o serviço `gateway` recebe domínio. Os outros dois não ficam expostos: o gateway fala com eles pela rede `interna`. Os bancos SQLite ficam nos volumes `academico-dados` e `controle-n2-dados`, que sobrevivem aos novos deploys.

## 1. Antes de começar

1. Tenha o Dokploy instalado em um servidor e acesse o painel dele.
2. No DNS de `computacao.cloud`, crie um registro **A** `pweb` apontando para o IP desse servidor. Confira com `nslookup pweb.computacao.cloud`.
3. Envie para o GitHub (branch `main`) os arquivos de publicação: `index.html`, `docker-compose.yml`, `.dockerignore`, a pasta `gateway/` e os `Dockerfile`/`.dockerignore` de `academico/` e `controle_n2/`, além das alterações nos dois projetos.
4. Gere a chave do Controle N2 (64 caracteres hexadecimais) em qualquer computador:

   ```bash
   openssl rand -hex 32
   # ou, com Bun:
   bun -e "console.log(crypto.getRandomValues(new Uint8Array(32)).reduce((t, b) => t + b.toString(16).padStart(2, '0'), ''))"
   ```

   Guarde o valor: ele vai para o Dokploy, nunca para o repositório.

## 2. Criar o serviço Compose

1. No Dokploy, abra **Projects** e crie um projeto, por exemplo `pweb`.
2. Dentro do projeto, clique em **Create Service** → **Compose**.
3. Dê um nome (por exemplo `pweb`) e escolha o tipo **Docker Compose** (não **Docker Stack**, que não aceita `build`).

## 3. Apontar para o repositório público

Na aba **General** do serviço, em **Provider**, escolha **Git** (repositório público não precisa de credenciais nem do GitHub App):

| Campo | Valor |
| --- | --- |
| Repository URL | `https://github.com/liluyoud/pweb.git` |
| Branch | `main` |
| Compose Path | `./docker-compose.yml` |

Clique em **Save**.

> Se preferir o provedor **GitHub**, é preciso conectar o GitHub App do Dokploy à conta; o resultado é o mesmo e habilita o deploy automático a cada push.

## 4. Variáveis de ambiente

Na aba **Environment**, cole e preencha:

```env
APP_KEY=cole_aqui_os_64_caracteres_gerados
PROFESSOR_MATRICULA=000000
PROFESSOR_DATA_NASCIMENTO=AAAA-MM-DD
```

Clique em **Save**. O Dokploy grava esses valores em um `.env` ao lado do `docker-compose.yml`, e o compose os usa por interpolação (`${APP_KEY}`). Se faltar algum, o deploy para com a mensagem “Defina … na aba Environment do Dokploy”.

As demais configurações já estão no compose:

| Variável | Serviço | Valor | Para que serve |
| --- | --- | --- | --- |
| `URL_PUBLICA_AVALIACAO` | academico-api | `https://pweb.computacao.cloud/avaliacao` (padrão) | Endereço usado pelo botão “Test Request” do Scalar |
| `CAMINHO_BASE` | controle-n2 | `/n2` | Endereço usado pelo Scalar em `/n2/docs` |
| `CONFIAR_PROXY` | controle-n2 | `1` | Lê HTTPS e IP do visitante dos cabeçalhos do proxy |
| `ACADEMICO_BANCO` / `CONTROLE_N2_BANCO` | ambos | `/dados/...sqlite` | Coloca os bancos nos volumes |

Se o domínio for outro, defina `URL_PUBLICA_AVALIACAO` também na aba **Environment**.

## 5. Domínio e HTTPS

Na aba **Domains**, clique em **Add Domain** e preencha:

| Campo | Valor |
| --- | --- |
| Service Name | `gateway` |
| Host | `pweb.computacao.cloud` |
| Path | `/` |
| Container Port | `80` |
| HTTPS | ativado |
| Certificate | Let's Encrypt |

Não ative a remoção de prefixo (*strip path*): os subcaminhos `/avaliacao` e `/n2` são tratados pelo nginx do gateway. O Dokploy adiciona os rótulos do Traefik e a rede `dokploy-network` somente ao `gateway`; por isso o compose coloca os três serviços na rede `interna`, mantendo o gateway ligado às APIs. Para conferir o arquivo final, use **Preview Compose**.

## 6. Fazer o deploy

1. Clique em **Deploy** e acompanhe a aba **Deployments** (logs do build).
2. O primeiro build leva alguns minutos: baixa as imagens `oven/bun` e `nginx`, instala dependências e compila o site do Acadêmico.
3. Ao final, os três contêineres devem aparecer em execução na aba **Logs** (selecione cada serviço). Mensagens esperadas:
   - `academico-api`: `✅ Pronto! Banco populado…` (só no primeiro início) e `✅ API rodando…`
   - `controle-n2`: `Controle N2 em http://0.0.0.0:3400/`

O certificado HTTPS pode levar até um minuto para ser emitido depois do primeiro acesso.

## 7. Conferir

| Abra | Esperado |
| --- | --- |
| `https://pweb.computacao.cloud/` | Página com os dois cartões |
| `https://pweb.computacao.cloud/avaliacao/` | Dashboard com dados de exemplo; recarregar em `/avaliacao/alunos` continua funcionando |
| `https://pweb.computacao.cloud/avaliacao/api/docs` | Documentação Scalar do Acadêmico |
| `https://pweb.computacao.cloud/n2/` | Tela de entrada do Controle N2 |
| `https://pweb.computacao.cloud/n2/docs` | Documentação Scalar do Controle N2 |

## 8. Carregar os alunos do Controle N2

A lista `controle_n2/docs/alunos.md` **não está no GitHub** (ela está no `.gitignore` por conter dados pessoais). Por isso o banco começa sem alunos:

1. Entre em `https://pweb.computacao.cloud/n2/` com a matrícula e a data de nascimento do professor.
2. Abra **Importar alunos** e envie o arquivo `alunos.md` do seu computador.
3. Os alunos ficam no volume `controle-n2-dados` e permanecem após os próximos deploys.

## 9. Atualizar

Depois de enviar alterações para a `main`, clique em **Deploy** novamente. Para deploy automático a cada push, copie a URL de webhook mostrada na aba **Deployments** e cadastre-a em **GitHub → Settings → Webhooks** do repositório (tipo `application/json`, evento *push*).

Os bancos não são apagados em novos deploys. Para recomeçar um deles do zero, pare o serviço e remova o volume correspondente na aba **Volumes**/**Advanced** (ou com `docker volume rm` no servidor). O Acadêmico volta a ser populado com exemplos no início seguinte.

Para cópias de segurança, use **Volume Backups** do Dokploy nos volumes `controle-n2-dados` e `academico-dados`.

## 10. Testar no próprio computador (opcional)

Com Docker instalado, crie na raiz um `.env` com as três variáveis da etapa 4 e um `docker-compose.override.yml`:

```yaml
services:
  gateway:
    ports:
      - "8080:80"
```

Depois rode `docker compose up --build` e abra `http://localhost:8080/`. Não envie esses dois arquivos ao GitHub.

## Problemas comuns

| Sintoma | Causa provável e solução |
| --- | --- |
| Deploy para com “Defina APP_KEY…” | Variável ausente na aba **Environment**; salve e faça o deploy de novo |
| `404 page not found` (texto do Traefik) | Domínio ausente ou ligado ao serviço errado; confira **Service Name** `gateway` e porta `80` |
| `502 Bad Gateway` (página do nginx) | Uma das APIs não iniciou; veja os logs de `academico-api` e `controle-n2` |
| Página em branco em `/avaliacao/` | O site foi compilado sem `CAMINHO_BASE`; refaça o deploy (o `gateway/Dockerfile` define `/avaliacao/`) |
| “Origem da requisição inválida” ao entrar no N2 | O proxy não enviou `X-Forwarded-Proto`; confira `CONFIAR_PROXY=1` e a configuração do nginx |
| “Muitas tentativas” para todos os alunos | O IP do visitante não chegou ao servidor; confira o cabeçalho `X-Real-IP` no `nginx.conf` |
| Certificado inválido | DNS ainda não propagou ou a porta 80/443 do servidor está bloqueada |

## Cuidados

- O **Controle Acadêmico não tem login**: qualquer pessoa com o endereço pode criar, alterar e excluir dados. Isso é proposital para o estudo, mas trate o conteúdo publicado como descartável e não cadastre dados reais.
- No Controle N2, a matrícula e a data de nascimento do professor dão acesso ao painel de avaliação. Mantenha-as apenas na aba **Environment**.
