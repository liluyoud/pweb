// Ajudantes para escrever os slides em HTML.
const React = require("react");
const RDS = require("react-dom/server");
const lu = require("react-icons/lu");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Ícone Lucide como SVG em linha (funciona offline).
function icon(nome, cls = "ic") {
  const C = lu[nome];
  if (!C) throw new Error("Ícone inexistente: " + nome);
  return RDS.renderToStaticMarkup(React.createElement(C, { className: cls, strokeWidth: 1.8 })).replace(
    /width="1em" height="1em"/,
    'aria-hidden="true"'
  );
}

// ---------------------------------------------------------------- realce de código
const KW = {
  ts: "import|from|export|const|let|var|function|return|if|else|for|of|in|async|await|type|new|throw|try|catch|as|default|true|false|null|undefined|number|string|boolean|any|void",
  sql: "SELECT|FROM|WHERE|JOIN|ON|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|IF|NOT|EXISTS|INTEGER|TEXT|REAL|PRIMARY|KEY|AUTOINCREMENT|NULL|UNIQUE|DEFAULT|REFERENCES|CHECK|BETWEEN|AND|OR|GROUP|BY|ORDER|COUNT|AVG|ROUND|PRAGMA",
  bash: "bun|bunx|cd|mkdir|curl|git|powershell|irm|iex|rm|Remove-Item|Invoke-RestMethod|run|install|add|create",
  json: "true|false|null",
};
function realce(src, lang = "ts") {
  const kw = lang === "tsx" ? KW.ts : KW[lang] || "";
  const flags = lang === "sql" ? "gi" : "g";
  const parts = [];
  if (lang === "sql") parts.push("(--[^\\n]*)");
  else if (lang === "bash" || lang === "ps") parts.push("(#[^\\n]*)");
  else if (lang === "json") parts.push("(\\u0000)");
  else parts.push("(//[^\\n]*|/\\*[\\s\\S]*?\\*/|\\{/\\*[\\s\\S]*?\\*/\\})");
  parts.push("(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`[^`]*`)");
  parts.push("(\\b\\d+(?:\\.\\d+)?\\b)");
  parts.push(kw ? `(\\b(?:${kw})\\b)` : "(\\u0000)");
  parts.push(lang === "tsx" ? "(</?[A-Za-z][\\w.]*|/?>)" : "(\\u0000)");
  const re = new RegExp(parts.join("|"), flags);
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "n" : m[4] ? "k" : m[5] ? "t" : "";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
    if (m[0].length === 0) re.lastIndex++;
  }
  out += esc(src.slice(last));
  return out;
}

// Bloco de código com "aba" de nome de arquivo.
function codigo(src, { lang = "ts", arquivo = "", cls = "" } = {}) {
  const linhas = src.replace(/^\n/, "").replace(/\s+$/, "");
  return `<figure class="codigo ${cls}">${arquivo ? `<figcaption>${icon("LuFileCode", "ic-sm")}${esc(arquivo)}</figcaption>` : ""}<pre><code>${realce(linhas, lang)}</code></pre></figure>`;
}

// Terminal (comandos).
function terminal(src, { titulo = "Terminal", lang = "bash", cls = "" } = {}) {
  const linhas = src.replace(/^\n/, "").replace(/\s+$/, "");
  return `<figure class="terminal ${cls}"><figcaption><span class="bolinhas"><i></i><i></i><i></i></span>${esc(titulo)}</figcaption><pre><code>${realce(linhas, lang)}</code></pre></figure>`;
}

// Cartão com ícone, título e texto.
function card({ i, t, d = "", extra = "", cls = "" }) {
  return `<div class="card ${cls}">${i ? `<div class="card-ic">${icon(i)}</div>` : ""}<div class="card-tx"><h3>${t}</h3>${d ? `<p>${d}</p>` : ""}${extra}</div></div>`;
}

// Selo (pílula magenta com ícone), como no modelo de conteúdo.
function selo(texto, i = "LuStar") {
  return `<div class="selo"><span class="selo-ic">${icon(i)}</span><span>${texto}</span></div>`;
}

// Etiquetas de código pequenas (como "p", "#titulo"...).
const chips = (lista) => `<div class="chips">${lista.map((x) => `<code>${esc(x)}</code>`).join("")}</div>`;

function tabela(cab, linhas, cls = "") {
  return `<table class="tabela ${cls}"><thead><tr>${cab.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${linhas
    .map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

// Fluxo horizontal de etapas com setas.
function fluxo(passos, cls = "") {
  return `<div class="fluxo ${cls}">${passos
    .map((p, k) => `${k ? `<div class="seta">${icon("LuArrowRight")}</div>` : ""}<div class="passo">${p.i ? `<div class="passo-ic">${icon(p.i)}</div>` : ""}<h4>${p.t}</h4>${p.d ? `<p>${p.d}</p>` : ""}</div>`)
    .join("")}</div>`;
}

const c = (s) => (String(s).length <= 26 ? `<code class="nw">${esc(s)}</code>` : `<code>${esc(s)}</code>`); // código em linha

module.exports = { icon, codigo, terminal, card, selo, chips, tabela, fluxo, c, esc, realce };
