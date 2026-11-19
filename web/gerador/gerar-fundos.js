// Gera as imagens de fundo (capa, seções e conteúdo) no padrão visual Afya.
// Os números das seções usam a fonte "Anton"; sem ela, o sistema usa outra fonte.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const React = require("react");
const RDS = require("react-dom/server");
const lu = require("react-icons/lu");

const OUT = path.join(__dirname, "..", "assets");
fs.mkdirSync(OUT, { recursive: true });
const W = 2400, H = 1350;

function iconSvg(name, color, size, strokeWidth = 2) {
  const Comp = lu[name];
  let s = RDS.renderToStaticMarkup(React.createElement(Comp, { color, size, strokeWidth }));
  return s;
}
function nested(name, color, x, y, size, sw = 2) {
  return iconSvg(name, color, size, sw).replace("<svg", `<svg x="${x}" y="${y}"`);
}

// Pseudo-random determinístico
let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

// ---------------------------------------------------------------- CAPA
function capaSvg() {
  seed = 11;
  // nós de rede na metade direita
  const nodes = [];
  for (let i = 0; i < 34; i++) {
    const x = 1150 + rnd() * 1250, y = 280 + rnd() * 1070;
    // só dentro da área do recorte diagonal (direita da linha)
    const lineX = 1950 - (y / H) * 1000;
    if (x > lineX - 80) nodes.push([x, y, 2 + rnd() * 5]);
  }
  let links = "";
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d < 330) links += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FF3D86" stroke-opacity="${0.35 - d / 1400}" stroke-width="1.6"/>`;
    });
  });
  const dots = nodes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF8AB8" filter="url(#glow)"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#fff"/>`).join("");
  let fine = "";
  for (let i = 0; i < 14; i++) fine += `<line x1="${-100 + i * 14}" y1="0" x2="${-500 + i * 14}" y2="420" stroke="#FF6FA5" stroke-opacity="0.18" stroke-width="2"/>`;
  let fine2 = "";
  for (let i = 0; i < 12; i++) fine2 += `<path d="M ${780 + i * 16} 1350 C ${980 + i * 16} 1080, ${1150 + i * 14} 1040, ${1400 + i * 10} 1060" stroke="#FF3D86" stroke-opacity="0.16" fill="none" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="#D3034E"/><stop offset="0.45" stop-color="#9A003C"/><stop offset="1" stop-color="#3A0127"/>
    </linearGradient>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4A0430"/><stop offset="0.6" stop-color="#22062E"/><stop offset="1" stop-color="#060A30"/>
    </linearGradient>
    <radialGradient id="glowTL" cx="0" cy="0" r="0.6"><stop offset="0" stop-color="#FF1E6E" stop-opacity="0.55"/><stop offset="1" stop-color="#FF1E6E" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="blur10"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glowTL)"/>
  <path d="M 520 1350 L 1180 170 L 1280 170 L 1720 1350 Z" fill="#FFFFFF" fill-opacity="0.035"/>
  ${fine}
  <polygon points="1950,0 ${W},0 ${W},${H} 950,${H}" fill="url(#d)"/>
  ${fine2}
  ${links}${dots}
  <g transform="translate(1640,180) skewY(-12)" opacity="0.95">
    <rect x="0" y="0" width="620" height="560" rx="26" fill="#7A0A45" fill-opacity="0.35" stroke="#FF4F93" stroke-opacity="0.55" stroke-width="3"/>
    <circle cx="40" cy="40" r="9" fill="#FF7FB0"/><circle cx="70" cy="40" r="9" fill="#FF7FB0"/><circle cx="100" cy="40" r="9" fill="#FF7FB0"/>
    <rect x="110" y="120" width="300" height="300" rx="18" fill="#B0135D" fill-opacity="0.7" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
    <circle cx="170" cy="190" r="34" fill="#E0306F"/>
    <rect x="225" y="170" width="150" height="16" rx="8" fill="#E0306F"/><rect x="225" y="200" width="110" height="14" rx="7" fill="#E0306F" opacity="0.8"/>
    <rect x="150" y="270" width="220" height="14" rx="7" fill="#E0306F" opacity="0.7"/><rect x="150" y="300" width="190" height="14" rx="7" fill="#E0306F" opacity="0.6"/>
    <rect x="-20" y="440" width="380" height="80" rx="16" fill="#A3104F" fill-opacity="0.85" stroke="#FF6FA5" stroke-opacity="0.5" stroke-width="2"/>
  </g>
  <path d="M 1330 1350 C 1650 1150, 1880 820, 2050 760 C 2160 720, 2230 900, 2290 1130 L 2340 1350" fill="none" stroke="#FF3D86" stroke-width="16" filter="url(#blur10)" opacity="0.7"/>
  <path d="M 1330 1350 C 1650 1150, 1880 820, 2050 760 C 2160 720, 2230 900, 2290 1130 L 2340 1350" fill="none" stroke="#FFC2DA" stroke-width="4"/>
  <path d="M 1500 1350 C 1760 1180, 1950 1000, 2080 1010 C 2180 1020, 2230 1150, 2260 1350" fill="none" stroke="#FF3D86" stroke-width="3" opacity="0.8"/>
</svg>`;
}

// ---------------------------------------------------------------- SEÇÃO
function secaoSvg(num, icon) {
  seed = 31 + Number(num);
  let dotsBL = "", dotsTR = "";
  for (let i = 0; i < 16; i++) for (let j = 0; j < 12; j++) {
    const x = 30 + i * 22, y = 1050 + j * 22;
    const o = Math.max(0, 0.5 - (i / 16) * 0.4 - (1 - j / 12) * 0.35);
    if (o > 0.03) dotsBL += `<circle cx="${x}" cy="${y}" r="3.2" fill="#FF2E78" fill-opacity="${o}"/>`;
  }
  for (let i = 0; i < 14; i++) for (let j = 0; j < 10; j++) {
    const x = 1980 + i * 22, y = 40 + j * 22;
    const o = Math.max(0, 0.35 - ((14 - i) / 14) * 0.25 - (j / 10) * 0.25);
    if (o > 0.03) dotsTR += `<circle cx="${x}" cy="${y}" r="3" fill="#FF2E78" fill-opacity="${o}"/>`;
  }
  // ilustração isométrica (chip + cartão com ícone + janela)
  const cx = 1990, cy = 960;
  const iso = (x, y, z = 0) => [cx + (x - y) * 0.866, cy + (x + y) * 0.5 - z];
  const poly = (pts) => pts.map((p) => p.join(",")).join(" ");
  const s = 250; // meio lado
  const top = poly([iso(-s, -s, 60), iso(s, -s, 60), iso(s, s, 60), iso(-s, s, 60)]);
  const left = poly([iso(-s, s, 60), iso(s, s, 60), iso(s, s, 0), iso(-s, s, 0)]);
  const right = poly([iso(s, -s, 60), iso(s, s, 60), iso(s, s, 0), iso(s, -s, 0)]);
  let pins = "";
  for (let k = -s + 40; k < s; k += 38) {
    const a = iso(k, s, 10), b = iso(k, s + 40, 0);
    pins += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FF4F93" stroke-width="9" stroke-linecap="round"/>`;
    const c = iso(s, k, 10), d = iso(s + 40, k, 0);
    pins += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#E0306F" stroke-width="9" stroke-linecap="round"/>`;
  }
  let rings = "";
  [190, 145, 100, 60].forEach((r, i) => {
    rings += `<polygon points="${poly([iso(-r, -r, 62), iso(r, -r, 62), iso(r, r, 62), iso(-r, r, 62)])}" fill="none" stroke="#FF3D86" stroke-opacity="${0.25 + i * 0.15}" stroke-width="3"/>`;
  });
  // cubo central com o ícone
  const b = 110, hz = 130;
  const ctop = poly([iso(-b, -b, 60 + hz + 120), iso(b, -b, 60 + hz + 120), iso(b, b, 60 + hz + 120), iso(-b, b, 60 + hz + 120)]);
  const cleft = poly([iso(-b, b, 60 + hz + 120), iso(b, b, 60 + hz + 120), iso(b, b, 60 + 120), iso(-b, b, 60 + 120)]);
  const cright = poly([iso(b, -b, 60 + hz + 120), iso(b, b, 60 + hz + 120), iso(b, b, 60 + 120), iso(b, -b, 60 + 120)]);
  const topCenter = iso(0, 0, 60 + hz + 120);
  const beam = `<line x1="${cx}" y1="${cy - 60}" x2="${cx}" y2="${cy - 180}" stroke="#FF7FB0" stroke-width="5" stroke-dasharray="10 10"/>`;
  let floaters = "";
  for (let i = 0; i < 9; i++) {
    const fx = 1620 + rnd() * 760, fy = 300 + rnd() * 600, fs = 12 + rnd() * 14;
    floaters += `<rect x="${fx}" y="${fy}" width="${fs}" height="${fs}" transform="rotate(30 ${fx} ${fy})" fill="#FF4F93" fill-opacity="${0.4 + rnd() * 0.5}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bg" cx="0.55" cy="0.35" r="0.85"><stop offset="0" stop-color="#9A0030"/><stop offset="0.55" stop-color="#5A0020"/><stop offset="1" stop-color="#26000E"/></radialGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8004A" stop-opacity="0.35"/><stop offset="1" stop-color="#C8004A" stop-opacity="0"/></linearGradient>
    <linearGradient id="topf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E0A3A"/><stop offset="1" stop-color="#3A0420"/></linearGradient>
    <linearGradient id="ctop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D21A72"/><stop offset="1" stop-color="#8E0E58"/></linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="glowS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <polygon points="1100,0 1500,0 2400,800 2400,1150" fill="url(#band)"/>
  <polygon points="0,700 0,1350 600,1350" fill="#C8004A" fill-opacity="0.12"/>
  <polygon points="2400,700 2400,1350 1700,1350" fill="#E0004E" fill-opacity="0.25"/>
  ${dotsBL}${dotsTR}
  <text x="60" y="880" font-family="Anton" font-size="600" fill="none" stroke="#FF1E6E" stroke-width="14" filter="url(#glow)" opacity="0.8">${num}</text>
  <text x="60" y="880" font-family="Anton" font-size="600" fill="#2A000F" fill-opacity="0.35" stroke="#FF3D86" stroke-width="6">${num}</text>
  <g>
    <g transform="translate(1700,110) skewY(-14) scale(0.88)" opacity="0.9">
      <rect width="720" height="470" rx="24" fill="#5E0A33" fill-opacity="0.55" stroke="#FF4F93" stroke-opacity="0.7" stroke-width="3"/>
      <circle cx="36" cy="34" r="9" fill="#FF7FB0"/><circle cx="64" cy="34" r="9" fill="#FF7FB0"/><circle cx="92" cy="34" r="9" fill="#FF7FB0"/>
      <rect x="130" y="24" width="540" height="20" rx="10" fill="#FF4F93" fill-opacity="0.3"/>
      <rect x="40" y="80" width="300" height="180" rx="10" fill="#C0145F" fill-opacity="0.45" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="380" y="80" width="300" height="20" rx="10" fill="#FF6FA5" fill-opacity="0.45"/>
      <rect x="380" y="120" width="240" height="16" rx="8" fill="#FF6FA5" fill-opacity="0.35"/>
      <rect x="380" y="150" width="270" height="16" rx="8" fill="#FF6FA5" fill-opacity="0.35"/>
      <rect x="40" y="300" width="140" height="120" rx="10" fill="none" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="210" y="300" width="140" height="120" rx="10" fill="none" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="380" y="300" width="140" height="120" rx="10" fill="none" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="550" y="300" width="130" height="120" rx="10" fill="none" stroke="#FF6FA5" stroke-opacity="0.6" stroke-width="2"/>
    </g>
    ${floaters}
    <polygon points="${top}" fill="#FF1E6E" filter="url(#glow)" opacity="0.5"/>
    ${pins}
    <polygon points="${left}" fill="#3A0420" stroke="#FF4F93" stroke-width="3"/>
    <polygon points="${right}" fill="#2A0318" stroke="#FF4F93" stroke-width="3"/>
    <polygon points="${top}" fill="url(#topf)" stroke="#FF4F93" stroke-width="4"/>
    ${rings}
    <polygon points="${poly([iso(-40, -40, 62), iso(40, -40, 62), iso(40, 40, 62), iso(-40, 40, 62)])}" fill="#FF7FB0" filter="url(#glowS)"/>
    ${beam}
    <polygon points="${ctop}" fill="#FF1E6E" filter="url(#glow)" opacity="0.6"/>
    <polygon points="${cleft}" fill="#7A0D45" stroke="#FF8AB8" stroke-width="3"/>
    <polygon points="${cright}" fill="#5A0833" stroke="#FF8AB8" stroke-width="3"/>
    <polygon points="${ctop}" fill="url(#ctop)" stroke="#FFC2DA" stroke-width="4"/>
    <g transform="translate(${topCenter[0]},${topCenter[1]}) matrix(0.866,0.5,-0.866,0.5,0,0)">
      ${nested(icon, "#FFFFFF", -80, -80, 160, 2)}
    </g>
  </g>
  <path d="M 1900 1350 L 1960 1250 Q 1975 1225 2005 1225 L 2400 1225 L 2400 1350 Z" fill="#1E0010" fill-opacity="0.85"/>
</svg>`;
}

// ---------------------------------------------------------------- CONTEÚDO
function conteudoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E0005A"/><stop offset="1" stop-color="#9A0038"/></linearGradient>
    <linearGradient id="m2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A0038"/><stop offset="1" stop-color="#D4004F"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <path d="M 1500 0 C 1750 40, 1900 60, 2050 110 C 2200 160, 2300 210, 2400 260 L 2400 0 Z" fill="#EFEFF1"/>
  <path d="M 1820 0 C 1980 30, 2130 70, 2250 120 C 2320 150, 2370 175, 2400 190 L 2400 0 Z" fill="url(#m)"/>
  <path d="M 1820 0 C 1980 30, 2130 70, 2250 120 C 2320 150, 2370 175, 2400 190" fill="none" stroke="#FF6FA5" stroke-width="3" opacity="0.7"/>
  <path d="M 0 1180 C 250 1210, 600 1290, 900 1350 L 0 1350 Z" fill="#EFEFF1"/>
  <path d="M 0 1240 C 200 1260, 420 1300, 620 1350 L 0 1350 Z" fill="url(#m2)"/>
  <path d="M 0 1240 C 200 1260, 420 1300, 620 1350" fill="none" stroke="#FF6FA5" stroke-width="3" opacity="0.7"/>
</svg>`;
}

const SECOES = [
  ["01", "LuGraduationCap"], ["02", "LuBookOpen"], ["03", "LuLayers"], ["04", "LuFolderTree"],
  ["05", "LuDatabase"], ["06", "LuServer"], ["07", "LuMonitor"], ["08", "LuRoute"],
  ["09", "LuHammer"], ["10", "LuPlay"], ["11", "LuBug"], ["12", "LuRocket"],
];

(async () => {
  await sharp(Buffer.from(capaSvg())).resize(1920, 1080).jpeg({ quality: 86 }).toFile(path.join(OUT, "bg_capa.jpg"));
  await sharp(Buffer.from(conteudoSvg())).resize(1920, 1080).jpeg({ quality: 86 }).toFile(path.join(OUT, "bg_conteudo.jpg"));
  for (const [n, ic] of SECOES) {
    await sharp(Buffer.from(secaoSvg(n, ic))).resize(1920, 1080).jpeg({ quality: 86 }).toFile(path.join(OUT, `bg_secao_${n}.jpg`));
  }
  console.log("ok");
})();

module.exports = { iconSvg };
