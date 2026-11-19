# API do Controle Acadêmico. O site é compilado e servido pelo gateway (gateway/Dockerfile).
FROM oven/bun:1.4.4
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/tipos/package.json packages/tipos/
RUN bun install --frozen-lockfile --production
COPY packages ./packages
COPY apps/api ./apps/api

# O banco fica em um volume para sobreviver aos deploys.
RUN mkdir -p /dados && chown bun:bun /dados
USER bun
ENV ACADEMICO_BANCO=/dados/academico.sqlite
WORKDIR /app/apps/api
EXPOSE 3333

# No primeiro início (banco ainda inexistente), coloca os dados de exemplo.
CMD ["sh", "-c", "[ -f \"$ACADEMICO_BANCO\" ] || bun src/banco/popular.ts; exec bun src/index.ts"]
