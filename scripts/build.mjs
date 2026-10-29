// Genera dist/, fonts/ y la tabla del README desde tokens/tokens.json.
// Uso: node scripts/build.mjs           (escribe)
//      node scripts/build.mjs --check   (falla si algo generado no está al día)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const src = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.json"), "utf8"));

const HEADER = `Surmetric Core v${pkg.version} — generado desde tokens/tokens.json por scripts/build.mjs. No editar a mano.`;
const PREFIX = "sm";
const errors = [];
const stale = [];

// ---------- Validación de la forma (la que lee el tipo Design System) ----------

const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const ALIAS_RE = /^\{([^}]+)\}$/;
const FAMILIES = ["color", "spacing", "radius", "shadow", "easing"];
const themes = src.color.themes.map((t) => t.id);
const seen = new Set();

for (const fam of FAMILIES) {
  const list = src[fam]?.tokens;
  if (!Array.isArray(list)) { errors.push(`${fam}.tokens debe ser una lista`); continue; }
  for (const t of list) {
    if (!NAME_RE.test(t.name ?? "")) errors.push(`${fam}: nombre inválido ${JSON.stringify(t.name)}`);
    if (seen.has(t.name)) errors.push(`${fam}: nombre duplicado ${t.name}`);
    seen.add(t.name);
    if (typeof t.usage !== "string" || !t.usage.trim()) errors.push(`${fam}.${t.name}: falta usage`);
    if (t.value === undefined) errors.push(`${fam}.${t.name}: falta value`);
  }
}
for (const g of src.type.groups) for (const s of g.styles) {
  if (!NAME_RE.test(s.name)) errors.push(`type: nombre inválido ${s.name}`);
  if (!s.usage) errors.push(`type.${s.name}: falta usage`);
}
// Un "." en el nombre exige escape en una variable CSS (--sm-space-0\.5): se usa "_".
for (const t of src.spacing.tokens) if (t.name.includes(".")) errors.push(`spacing: usar "_" en vez de "." en ${t.name}`);

// ---------- Resolución de colores ----------

const colorByName = new Map(src.color.tokens.map((t) => [t.name, t]));
const isThemed = (t) => typeof t.value === "object";

function resolve(raw, trail = []) {
  const m = ALIAS_RE.exec(raw);
  if (!m) {
    if (!HEX_RE.test(raw)) errors.push(`color no hex: ${raw}`);
    return raw.toUpperCase();
  }
  const target = colorByName.get(m[1]);
  if (!target || trail.includes(m[1])) { errors.push(`alias roto: ${raw}`); return "#000000"; }
  if (isThemed(target)) { errors.push(`alias a token con tema: ${raw}`); return "#000000"; }
  return resolve(target.value, [...trail, m[1]]);
}

// valueIn(token, theme): valor hex final; un tema ausente hereda el primero.
const valueIn = (t, theme) =>
  resolve(isThemed(t) ? (t.value[theme] ?? t.value[themes[0]]) : t.value);

const primitives = src.color.tokens.filter((t) => !isThemed(t));
const semantic = src.color.tokens.filter(isThemed);
const fontSizes = src.type.groups.flatMap((g) => g.styles);
const spacing = src.spacing.tokens;
// Propiedades opcionales de un estilo de texto: clave en tokens.json, prefijo en tokens.css, sufijo en Tailwind 4.
const TYPE_PROPS = [
  ["lineHeight", "leading", "line-height"],
  ["fontWeight", "weight", "font-weight"],
  ["letterSpacing", "tracking", "letter-spacing"],
];
const typeExtras = (s) => TYPE_PROPS.filter(([k]) => s[k] !== undefined)
  .map(([k, css, tw4]) => ({ k, css, tw4, v: String(s[k]) }));
const radius = src.radius.tokens;
const shadow = src.shadow.tokens;
const easing = src.easing.tokens;

// ---------- Contraste (WCAG 2.x) ----------

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// Pares que el sistema promete en sus usage. Si uno cae, el build falla.
const CONTRAST_RULES = [
  ["ink", ["canvas", "surface"], 4.5],
  ["ink-muted", ["canvas", "surface"], 4.5],
  ["accent-strong", ["canvas", "surface"], 4.5],
  ["accent", ["canvas", "surface"], 3],
  ["ink", ["accent-soft", "danger-soft", "warning-soft"], 4.5],
  ["on-action", ["action", "action-hover"], 4.5],
];
const contrastReport = [];
for (const theme of themes) for (const [fg, grounds, min] of CONTRAST_RULES) for (const bg of grounds) {
  const r = ratio(valueIn(colorByName.get(fg), theme), valueIn(colorByName.get(bg), theme));
  contrastReport.push({ theme, fg, bg, r, min });
  if (r < min) errors.push(`contraste ${fg} sobre ${bg} (${theme}): ${r.toFixed(2)} < ${min}`);
}
for (const g of ["brand-white", "brand-gray-50", "brand-gray-100"]) {
  const r = ratio(valueIn(colorByName.get("brand-gray-500"), "light"), valueIn(colorByName.get(g), "light"));
  if (r < 4.5) errors.push(`brand-gray-500 sobre ${g}: ${r.toFixed(2)} < 4.5`);
}

if (errors.length) {
  console.error("tokens.json no es válido:\n  " + errors.join("\n  "));
  process.exit(1);
}

// ---------- Emisores ----------

const rgbChannels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
const strip = (name, prefix) => (name.startsWith(prefix + "-") ? name.slice(prefix.length + 1) : name);
const families = src.type.families;
const darkSelector = `[data-theme="dark"], .dark`;

function cssVarsBlock(indent) {
  const pad = " ".repeat(indent);
  const lines = [];
  for (const t of primitives) lines.push(`--${PREFIX}-color-${t.name}: ${valueIn(t, "light")};`);
  for (const t of semantic) lines.push(`--${PREFIX}-color-${t.name}: ${valueIn(t, "light")};`);
  for (const [k, v] of Object.entries(families)) lines.push(`--${PREFIX}-font-${k}: ${v};`);
  for (const s of fontSizes) {
    lines.push(`--${PREFIX}-text-${s.name}: ${s.fontSize};`);
    for (const x of typeExtras(s)) lines.push(`--${PREFIX}-${x.css}-${s.name}: ${x.v};`);
  }
  for (const t of spacing) lines.push(`--${PREFIX}-${t.name}: ${t.value};`);
  for (const t of radius) lines.push(`--${PREFIX}-${t.name}: ${t.value};`);
  for (const t of shadow) lines.push(`--${PREFIX}-${t.name}: ${t.value};`);
  for (const t of easing) lines.push(`--${PREFIX}-${t.name}: ${t.value};`);
  return lines.map((l) => pad + l).join("\n");
}
const darkVars = (indent, withRgb = false) =>
  semantic.flatMap((t) => {
    const v = valueIn(t, "dark");
    const out = [`--${PREFIX}-color-${t.name}: ${v};`];
    if (withRgb) out.push(`--${PREFIX}-rgb-${t.name}: ${rgbChannels(v)};`);
    return out;
  }).map((l) => " ".repeat(indent) + l).join("\n");

const tokensCss = `/* ${HEADER} */
/* Tema oscuro opt-in: data-theme="dark" o class="dark" en <html> o en cualquier contenedor. */

:root {
${cssVarsBlock(2)}
}

${darkSelector} {
${darkVars(2)}
}
`;

const themeCss = `/* ${HEADER} */
/* Tailwind 4: @import "tailwindcss"; @import "surmetric-tokens/theme.css"; */

@theme {
${primitives.map((t) => `  --color-${t.name}: ${valueIn(t, "light")};`).join("\n")}
${Object.entries(families).map(([k, v]) => `  --font-${k}: ${v};`).join("\n")}
${fontSizes.map((s) => [`  --text-${s.name}: ${s.fontSize};`,
  ...typeExtras(s).map((x) => `  --text-${s.name}--${x.tw4}: ${x.v};`)].join("\n")).join("\n")}
  --spacing: ${spacing.find((t) => t.name === "space-1").value}; /* = Tailwind por defecto: los pasos de Core son múltiplos de 4px */
${radius.map((t) => `  --${t.name}: ${t.value};`).join("\n")}
${shadow.map((t) => `  --${t.name}: ${t.value};`).join("\n")}
${easing.map((t) => `  --${t.name}: ${t.value};`).join("\n")}
}

/* Semánticos: inline para que el tema oscuro funcione también en un subárbol. */
@theme inline {
${semantic.map((t) => `  --color-${t.name}: var(--${PREFIX}-color-${t.name});`).join("\n")}
}

:root {
${semantic.map((t) => `  --${PREFIX}-color-${t.name}: ${valueIn(t, "light")};`).join("\n")}
}

${darkSelector} {
${darkVars(2)}
}
`;

const q = JSON.stringify;
const obj = (entries, indent) =>
  "{\n" + entries.map(([k, v]) => `${" ".repeat(indent + 2)}${q(k)}: ${v},`).join("\n") + `\n${" ".repeat(indent)}}`;

const tailwindJs = `// ${HEADER}
// Preset para Tailwind 3: presets: [require("surmetric-tokens/tailwind")]
module.exports = {
  theme: {
    extend: {
      colors: ${obj([
        ...primitives.map((t) => [t.name, q(valueIn(t, "light"))]),
        ...semantic.map((t) => [t.name, q(`rgb(var(--${PREFIX}-rgb-${t.name}) / <alpha-value>)`)]),
      ], 6)},
      fontFamily: ${obj(Object.entries(families).map(([k, v]) => [k, q(v)]), 6)},
      fontSize: ${obj(fontSizes.map((s) => {
        const x = typeExtras(s);
        return [s.name, x.length ? `[${q(s.fontSize)}, { ${x.map((e) => `${e.k}: ${q(e.v)}`).join(", ")} }]` : q(s.fontSize)];
      }), 6)},
      // Espaciado: la escala por defecto de Tailwind 3 ya es la de Core (base 4px); no se reemplaza.
      borderRadius: ${obj(radius.map((t) => [strip(t.name, "radius"), q(t.value)]), 6)},
      boxShadow: ${obj(shadow.map((t) => [strip(t.name, "shadow"), q(t.value)]), 6)},
      transitionTimingFunction: ${obj(easing.map((t) => [strip(t.name, "ease"), q(t.value)]), 6)},
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": ${obj(semantic.flatMap((t) => [
          [`--${PREFIX}-color-${t.name}`, q(valueIn(t, "light"))],
          [`--${PREFIX}-rgb-${t.name}`, q(rgbChannels(valueIn(t, "light")))],
        ]), 8)},
        ${q(darkSelector)}: ${obj(semantic.flatMap((t) => [
          [`--${PREFIX}-color-${t.name}`, q(valueIn(t, "dark"))],
          [`--${PREFIX}-rgb-${t.name}`, q(rgbChannels(valueIn(t, "dark")))],
        ]), 8)},
      });
    },
  ],
};
`;

const tsBody = (typed) => {
  const asConst = typed ? " as const" : "";
  const decl = (name, value) => typed ? `export const ${name} = ${value}${asConst};` : `exports.${name} = ${value};`;
  return [
    decl("themes", q(themes)),
    decl("colors", obj(primitives.map((t) => [t.name, q(valueIn(t, "light"))]), 0)),
    decl("semanticColors", obj(semantic.map((t) =>
      [t.name, `{ ${themes.map((th) => `${th}: ${q(valueIn(t, th))}`).join(", ")} }`]), 0)),
    decl("cssVar", obj(src.color.tokens.map((t) => [t.name, q(`var(--${PREFIX}-color-${t.name})`)]), 0)),
    decl("fontFamily", obj(Object.entries(families).map(([k, v]) => [k, q(v)]), 0)),
    decl("fontSize", obj(fontSizes.map((s) => [s.name, q(s.fontSize)]), 0)),
    decl("typeStyles", obj(fontSizes.map((s) => [s.name,
      `{ ${[["fontSize", s.fontSize], ...typeExtras(s).map((x) => [x.k, x.v])].map(([k, v]) => `${k}: ${q(v)}`).join(", ")} }`]), 0)),
    decl("spacing", obj(spacing.map((t) => [t.name, q(t.value)]), 0)),
    decl("radius", obj(radius.map((t) => [t.name, q(t.value)]), 0)),
    decl("shadow", obj(shadow.map((t) => [t.name, q(t.value)]), 0)),
    decl("easing", obj(easing.map((t) => [t.name, q(t.value)]), 0)),
  ].join("\n\n");
};
const TYPES = `export type Theme = (typeof themes)[number];
export type ColorToken = keyof typeof colors;
export type SemanticColorToken = keyof typeof semanticColors;`;

const tokensTs = `// ${HEADER}\n\n${tsBody(true)}\n\n${TYPES}\n`;
const tokensJs = `"use strict";\n// ${HEADER}\n\n${tsBody(false)}\n`;
const tokensDts = `// ${HEADER}\n\n${tsBody(true).replace(/export const (\w+) = /g, "export declare const $1: ")
  .replace(/ as const;/g, ";")}\n\n${TYPES}\n`;

// Las declaraciones usan tipos literales: `declare const x: { "a": "#FFF" }` es válido tal cual,
// salvo los arrays, que se marcan readonly.
const tokensDtsFixed = tokensDts.replace(/declare const themes: \[/, "declare const themes: readonly [");

// ---------- Fuentes ----------

const FONT_SOURCES = {
  "montserrat-latin-wght-normal.woff2": "@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  "montserrat-latin-wght-italic.woff2": "@fontsource-variable/montserrat/files/montserrat-latin-wght-italic.woff2",
  "GeistMono-Variable.woff2": "geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  "LICENSE-Montserrat.txt": "@fontsource-variable/montserrat/LICENSE",
  "LICENSE-GeistMono.txt": "geist/LICENSE.txt",
};
const LATIN_RANGE = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

const fontsCss = `/* ${HEADER} */
/* Opcional: carga Montserrat y Geist Mono desde fonts/ del paquete. */
${src.type.fonts.map((f) => `
@font-face {
  font-family: ${q(f.family)};
  font-style: ${f.style ?? "normal"};
  font-weight: ${f.weight};
  font-display: swap;
  src: url("../${f.file}") format("woff2");${f.file.includes("montserrat-latin") ? `\n  unicode-range: ${LATIN_RANGE};` : ""}
}`).join("\n")}
`;

for (const f of src.type.fonts) if (!(basename(f.file) in FONT_SOURCES)) {
  console.error(`type.fonts: ${f.file} no tiene origen en FONT_SOURCES`);
  process.exit(1);
}

// ---------- README: tabla de tokens ----------

const md = (s) => String(s).replace(/\|/g, "\\|");
const tableTokens = [
  "### Color — paleta (igual en ambos temas)",
  "",
  "| Token | Valor | Tailwind | Uso |",
  "|---|---|---|---|",
  ...primitives.map((t) => `| \`${t.name}\` | \`${valueIn(t, "light")}\` | \`bg-${t.name}\` | ${md(t.usage)} |`),
  "",
  "### Color — semánticos (cambian con el tema)",
  "",
  "| Token | Claro | Oscuro | Tailwind | Uso |",
  "|---|---|---|---|---|",
  ...semantic.map((t) => `| \`${t.name}\` | \`${valueIn(t, "light")}\` | \`${valueIn(t, "dark")}\` | \`bg-${t.name}\` | ${md(t.usage)} |`),
  "",
  "### Tipografía",
  "",
  "| Token | Valor | Tailwind | Uso |",
  "|---|---|---|---|",
  ...Object.entries(families).map(([k, v]) => `| \`font-${k}\` | \`${md(v)}\` | \`font-${k}\` | Familia ${k}. |`),
  "",
  "| Estilo | Tamaño | Interlineado | Peso | Tracking | Tailwind | Uso |",
  "|---|---|---|---|---|---|---|",
  ...fontSizes.map((s) => `| \`${s.name}\` | \`${s.fontSize}\` | ${s.lineHeight ?? "hereda"} | ${s.fontWeight ?? "—"} | ${s.letterSpacing ?? "—"} | \`text-${s.name}\` | ${md(s.usage)} |`),
  "",
  "### Espaciado",
  "",
  "| Token | Valor | Tailwind | Uso |",
  "|---|---|---|---|",
  ...spacing.map((t) => `| \`${t.name}\` | \`${t.value}\` | \`p-${strip(t.name, "space").replace("_", ".")}\` | ${md(t.usage)} |`),
  "",
  "### Forma y movimiento",
  "",
  "| Token | Valor | Tailwind | Uso |",
  "|---|---|---|---|",
  ...radius.map((t) => `| \`${t.name}\` | \`${t.value}\` | \`rounded-${strip(t.name, "radius")}\` | ${md(t.usage)} |`),
  ...shadow.map((t) => `| \`${t.name}\` | \`${t.value}\` | \`shadow-${strip(t.name, "shadow")}\` | ${md(t.usage)} |`),
  ...easing.map((t) => `| \`${t.name}\` | \`${t.value}\` | \`ease-${strip(t.name, "ease")}\` | ${md(t.usage)} |`),
  "",
  "### Contraste verificado en el build",
  "",
  "| Tema | Texto / elemento | Fondo | Ratio | Mínimo |",
  "|---|---|---|---|---|",
  ...contrastReport.map((c) => `| ${c.theme} | \`${c.fg}\` | \`${c.bg}\` | ${c.r.toFixed(2)}:1 | ${c.min}:1 |`),
].join("\n");

const readmePath = join(ROOT, "README.md");
const readme = readFileSync(readmePath, "utf8");
const START = "<!-- tokens:start -->";
const END = "<!-- tokens:end -->";
const readmeNext = readme.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  `${START}\n<!-- Generado por scripts/build.mjs. No editar a mano. -->\n\n${tableTokens}\n\n${END}`,
);

// ---------- Escritura ----------

function emit(rel, content) {
  const path = join(ROOT, rel);
  const current = existsSync(path) ? readFileSync(path) : null;
  const next = Buffer.isBuffer(content) ? content : Buffer.from(content);
  if (current && current.equals(next)) return;
  if (CHECK) { stale.push(rel); return; }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, next);
  console.log("  escrito", rel);
}

emit("dist/tokens.css", tokensCss);
emit("dist/theme.css", themeCss);
emit("dist/fonts.css", fontsCss);
emit("dist/tailwind.js", tailwindJs);
emit("dist/tokens.ts", tokensTs);
emit("dist/tokens.js", tokensJs);
emit("dist/tokens.d.ts", tokensDtsFixed);
emit("README.md", readmeNext);
for (const [file, from] of Object.entries(FONT_SOURCES)) emit(`fonts/${file}`, readFileSync(join(ROOT, "node_modules", from)));

if (stale.length) {
  console.error("Archivos generados desactualizados (corre npm run build):\n  " + stale.join("\n  "));
  process.exit(1);
}
console.log(CHECK ? "OK: dist/, fonts/ y README al día." : "Build listo.");
