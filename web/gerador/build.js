// Gera web/index.html a partir dos arquivos src/secoes/*.js (um por seção do roteiro).
// Uso (dentro de web/gerador): bun install && bun build.js
const fs = require("fs");
const path = require("path");
const { esc } = require("./lib");

// Saída: ../web/index.html (ambiente de criação) ou ../index.html (quando está em web/gerador)
const SAIDA = fs.existsSync(path.join(__dirname, "..", "web", "estilo.css"))
  ? path.join(__dirname, "..", "web", "index.html")
  : path.join(__dirname, "..", "index.html");
const DIR_SECOES = path.join(__dirname, "secoes");
const arquivos = fs.readdirSync(DIR_SECOES).filter((f) => f.endsWith(".js")).sort();

const slides = [];
for (const f of arquivos) slides.push(...require(path.join(DIR_SECOES, f)));

const LOGO_B = "assets/logo_branco.png";

function render(s, n) {
  const notas = s.notas ? `<aside class="notas">${s.notas}</aside>` : "";
  const titPlano = s.titulo.replace(/<[^>]+>/g, "");
  const attrs = `data-titulo="${esc(titPlano)}" id="s${n}"`;
  if (s.tipo === "capa") {
    return `<section class="slide capa" ${attrs}>
  <div class="capa-tx">${s.pre ? `<p class="capa-pre">${s.pre}</p>` : ""}<h1>${s.titulo}</h1>${s.sub ? `<p class="capa-sub">${s.sub}</p>` : ""}${
      s.tags ? `<div class="capa-tags">${s.tags.map((t) => `<span>${t}</span>`).join("")}</div>` : ""
    }</div>
  <img class="logo-capa" src="${LOGO_B}" alt="Afya Centro Universitário São Lucas, RO">${notas}
</section>`;
  }
  if (s.tipo === "secao") {
    return `<section class="slide secao" ${attrs} style="background-image:url(assets/bg_secao_${s.num}.jpg)">
  <div class="secao-tx"><span class="rotulo">SEÇÃO ${s.num}</span><h1>${s.titulo}</h1><p class="secao-sub">${s.sub}</p></div>
  <img class="logo-secao" src="${LOGO_B}" alt="Afya Centro Universitário São Lucas, RO">${notas}
</section>`;
  }
  return `<section class="slide conteudo ${s.cls || ""}" ${attrs}>
  <header><h2>${s.titulo}</h2>${s.sub ? `<p class="sub">${s.sub}</p>` : ""}</header>
  <div class="corpo">${s.corpo}</div>
  <div class="rodape">Controle Acadêmico · ${n}</div>${notas}
</section>`;
}

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Controle Acadêmico · Aula</title>
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="estilo.css">
</head>
<body>
<main id="palco">
${slides.map((s, i) => render(s, i + 1)).join("\n")}
</main>
<div id="painel-notas"></div>
<div id="barra"></div>
<div id="ajuda">← → navegar · N notas · G visão geral · F tela cheia</div>
<script src="apresentacao.js"></script>
</body>
</html>
`;

fs.writeFileSync(SAIDA, html);
console.log(`${slides.length} slides gerados em ${SAIDA}`);
