# Controle N2: um único servidor Bun entrega a página, os arquivos do navegador e a API.
FROM oven/bun:1.4.4
WORKDIR /app
COPY package.json bun.lock bunfig.toml tsconfig.json ./
RUN bun install --frozen-lockfile --production
COPY src ./src
COPY docs ./docs

# O banco fica em um volume para sobreviver aos deploys.
RUN mkdir -p /dados && chown bun:bun /dados
USER bun
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3400 CONTROLE_N2_BANCO=/dados/controle_n2.sqlite
EXPOSE 3400
CMD ["bun", "src/servidor/index.ts"]
