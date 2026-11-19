# Imagem do gateway: nginx com a página inicial, o site do Acadêmico já compilado
# e o roteamento para as duas APIs. O contexto do build é a raiz do repositório.

# 1) Compila o site do Acadêmico para o subcaminho /avaliacao/.
FROM oven/bun:1.4.4 AS academico-web
WORKDIR /app
COPY academico/package.json academico/bun.lock ./
COPY academico/apps/api/package.json apps/api/
COPY academico/apps/web/package.json apps/web/
COPY academico/packages/tipos/package.json packages/tipos/
RUN bun install --frozen-lockfile
COPY academico/ ./
ENV CAMINHO_BASE=/avaliacao/
RUN bun run build

# 2) Servidor final.
FROM nginx:1.27-alpine
COPY gateway/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
# Aula (slides em HTML): só os arquivos usados pelo navegador, sem gerador/ e docs/.
COPY web/index.html web/estilo.css web/apresentacao.js /usr/share/nginx/html/web/
COPY web/assets /usr/share/nginx/html/web/assets
COPY --from=academico-web /app/apps/web/dist /usr/share/nginx/html/avaliacao
