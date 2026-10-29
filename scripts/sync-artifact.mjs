// Proyecta el repo en el sistema de diseño "Surmetric Core" (artifact de Claude).
//
// Este script NO lee ni publica el artifact: es privado y solo se escribe con la herramienta
// Artifact de Claude Code (no hay API ni token). El comando /sync-artifact de Claude Code
// (.claude/commands/sync-artifact.md) baja lo que el artifact sirve hoy, corre este script,
// sube y publica. El proceso completo y el registro de blobs huérfanos: docs/ARTIFACT.md.
//
//   node scripts/sync-artifact.mjs plan  --served <dir> --out <dir>
//     Compara el repo contra <dir> (lo que el artifact sirve, bajado recién) y deja en <out>
//     los archivos a publicar (<out>/project/...) y plan.json. Sin diferencias: lo dice y no
//     deja nada que publicar.
//   node scripts/sync-artifact.mjs check --served <dir>
//     Igual que plan, pero solo informa: sale con 1 si la proyección está desfasada.
//   node scripts/sync-artifact.mjs index --served-index <archivo> --out <dir> [--uploads <json>]
//     Después de subir los SVG: escribe <out>/project/design-system.json a partir del índice
//     leído justo antes, con los registros nuevos de Logos y lastChange. Anota en
//     docs/ARTIFACT.md los blobs que quedaron huérfanos.
//
// <dir> de --served tiene la forma que deja la herramienta Artifact al leer con out_dir:
// project/<ruta> para cada archivo, y <id>.<ext> para cada blob de Logos leído por su id.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACT_URL = "https://claude.ai/artifact/FbjoeVnhJvjSkRV1y67Fta";
const GROUP = "Logos";
// Orden de las tiles: lockups antes que isotipos; color, blanco, mono.
const LOGO_ORDER = ["lockup", "isotipo"].flatMap((k) => ["", "-white", "-mono"].map((v) => `surmetric-${k}${v}.svg`));
const BY = "Francisco";

// ---------- argumentos ----------

const [mode, ...rest] = process.argv.slice(2);
const args = {};
for (let i = 0; i < rest.length; i += 2) {
  if (!rest[i]?.startsWith("--")) fail(`Argumento inesperado: ${rest[i]}`);
  args[rest[i].slice(2)] = rest[i + 1];
}

function fail(msg) {
  console.error(`sync-artifact: ${msg}`);
  process.exit(2);
}

const NEEDS_SERVED = `Falta --served <dir>: la copia de lo que ${ARTIFACT_URL} sirve hoy.
Este script no puede bajarla (el artifact es privado y no hay API). Corre /sync-artifact en
Claude Code, que la baja con la herramienta Artifact y llama a este script.`;

// ---------- lo que el repo proyecta ----------

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
// El almacén de assets reescribe los SVG al guardarlos (`<polygon …/>` pasa a `<polygon …></polygon>`),
// así que sus bytes nunca coinciden con los del repo. Se comparan en una forma normal que deshace
// solo eso: etiquetas autocerradas expandidas y sin espacio entre etiquetas. Cualquier otra
// diferencia (un atributo, un color, algo que el almacén quite) sigue contando como cambio.
const svgNorm = (buf) => buf.toString("utf8").replace(/<([A-Za-z][\w:-]*)([^<>]*?)\s*\/>/g, "<$1$2></$1>").replace(/>\s+</g, "><").trim();
// La página agrega al README servido una sección generada ("Consuming this system" + índice de
// cards). Se compara sin ella; al publicar, la página la vuelve a agregar.
const GENERATED_TAIL = /\r?\n-{3}\r?\n\r?\n## Consuming this system \(generated[\s\S]*$/;
const asReadme = (buf) => Buffer.from(buf.toString("utf8").replace(GENERATED_TAIL, "").trimEnd() + "\n");
const rel = (p) => p.replaceAll("\\", "/");

function repoTag() {
  const git = (...a) => execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8" }).trim();
  let tag;
  try {
    tag = git("describe", "--tags", "--exact-match", "HEAD");
  } catch {
    tag = git("describe", "--tags", "--always");
  }
  const dirty = git("status", "--porcelain") !== "";
  return { tag: dirty ? `${tag}+cambios` : tag, exact: /^v\d+\.\d+\.\d+$/.test(tag) && !dirty };
}

function desired() {
  const tokens = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.json"), "utf8"));
  const files = new Map([
    ["project/tokens.json", "tokens/tokens.json"],
    ["project/README.md", "docs/SISTEMA.md"],
    [`project/assets/${GROUP}/README.md`, "logo/README.md"],
  ]);
  // Solo las fuentes que tokens.json declara: el formato ignora (y marca) las que no.
  for (const f of tokens.type.fonts) {
    const path = f.file.includes("/") ? f.file : `fonts/${f.file}`;
    files.set(`project/${path}`, `fonts/${basename(path)}`);
  }
  for (const src of files.values()) if (!existsSync(join(ROOT, src))) fail(`No existe ${src} en el repo.`);

  // Solo las variantes de marca (surmetric-*.svg). favicon.svg y sus PNG/ICO no van al grupo Logos.
  const onDisk = readdirSync(join(ROOT, "logo")).filter((f) => f.startsWith("surmetric-") && f.endsWith(".svg"));
  const extra = onDisk.filter((f) => !LOGO_ORDER.includes(f));
  if (extra.length) fail(`logo/ tiene SVG fuera del orden conocido (${extra.join(", ")}): agrégalos a LOGO_ORDER.`);
  const assets = LOGO_ORDER.filter((n) => onDisk.includes(n)).map((name) => {
    const bytes = readFileSync(join(ROOT, "logo", name));
    return { name, src: `logo/${name}`, norm: svgNorm(bytes) };
  });
  return { tokens, files, assets };
}

// ---------- lo que el artifact sirve ----------

function readIndex(path) {
  if (!existsSync(path)) fail(`No está el índice en ${path}. Bájalo con la herramienta Artifact (path project/design-system.json).`);
  const idx = JSON.parse(readFileSync(path, "utf8"));
  if (!idx.createdOnFiles && !idx.convertedFrom) fail("project/design-system.json no tiene marcador (createdOnFiles/convertedFrom): no es un índice. No se escribe nada encima.");
  if (idx.editing === "code") fail('El índice tiene "editing": "code": el sistema lo mantiene /design-sync, no este script.');
  return idx;
}

function findBlob(dir, id) {
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) stack.push(p);
      else if (e.startsWith(id)) return p;
    }
  }
  return null;
}

// ---------- comparar ----------

function compare(served) {
  const { tokens, files, assets } = desired();
  const idx = readIndex(join(served, "project/design-system.json"));
  const changed = [];
  for (const [path, src] of files) {
    const local = readFileSync(join(ROOT, src));
    const there = join(served, path);
    if (!existsSync(there)) changed.push({ path, src, why: "no está en la copia servida" });
    else {
      const readme = path === "project/README.md";
      const served = readFileSync(there);
      if (sha(readme ? asReadme(served) : served) !== sha(readme ? asReadme(local) : local)) changed.push({ path, src, why: "distinto" });
    }
  }

  const group = idx.assetGroups?.[GROUP];
  const uploads = [];
  const indexIssues = [];
  for (const a of assets) {
    const rec = group?.files?.[a.name];
    if (!rec) {
      uploads.push({ ...a, why: "sin registro en el índice", oldBlob: null });
      continue;
    }
    const blob = findBlob(served, rec.blob);
    if (!blob) fail(`Falta bajar el blob ${rec.blob} (${a.name}): léelo con la herramienta Artifact usando el id como path.`);
    if (svgNorm(readFileSync(blob)) !== a.norm) uploads.push({ ...a, why: "contenido distinto", oldBlob: rec.blob });
    else if (rec.size !== statSync(blob).size || rec.type !== "image/svg+xml" || rec.name !== a.name)
      indexIssues.push(`${a.name}: registro con name/size/type distinto del blob servido`);
  }
  // El orden de las tiles es de la página (se puede reordenar ahí): solo se exige que estén todas.
  const wantOrder = assets.map((a) => a.name);
  const order = group?.order ?? [];
  const missing = wantOrder.filter((n) => !order.includes(n));
  if (missing.length) indexIssues.push(`faltan en el orden de ${GROUP}: ${missing.join(", ")}`);
  if (!(idx.groups ?? []).includes(GROUP)) indexIssues.push(`"${GROUP}" no está en groups`);
  const notInRepo = Object.keys(group?.files ?? {}).filter((n) => !wantOrder.includes(n));

  return { tokens, idx, changed, uploads, indexIssues, notInRepo, servedTokens: readJSON(join(served, "project/tokens.json")) };
}

function readJSON(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

// La portada se escribe a mano y no se regenera en cada sync: solo avisa si cambió algo que
// ella dibuja (nombre, paleta o escalas).
function coverReview(repo, servedTokens) {
  if (!servedTokens) return [];
  const pick = {
    nombre: (t) => t.name,
    paleta: (t) => t.color?.tokens?.map((c) => [c.name, c.value]),
    "escala tipográfica": (t) => t.type?.groups?.map((g) => g.styles.map((s) => [s.name, s.fontSize, s.lineHeight, s.fontWeight, s.letterSpacing])),
    espaciado: (t) => t.spacing?.tokens?.map((s) => [s.name, s.value]),
    radios: (t) => t.radius?.tokens?.map((s) => [s.name, s.value]),
  };
  return Object.entries(pick)
    .filter(([, f]) => JSON.stringify(f(repo)) !== JSON.stringify(f(servedTokens)))
    .map(([k]) => k);
}

// ---------- qué no muestra la página (según format.md del tipo) ----------

const SHOWN = new Set(["color", "type", "spacing", "radius", "shadow"]);
const MOTION = new Set(["easing", "motion", "duration", "transition", "animation"]);
const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const LENGTH = /^(-?\d*\.?\d+(px|rem|em|%)|0)$/;
const COLOR = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\)|\{[^{}]+\})$/i;

function gaps(t) {
  const out = [];
  for (const [k, v] of Object.entries(t)) {
    if (k === "name" || k === "version" || SHOWN.has(k)) continue;
    if (MOTION.has(k)) out.push(`familia "${k}": viaja en tokens.json pero la página no la muestra ("No motion family").`);
    else if (v && Array.isArray(v.tokens)) out.push(`familia "${k}": se muestra como sección genérica, sin vista propia.`);
    else out.push(`clave "${k}": la página la guarda pero no la lee.`);
  }
  const styles = t.type.groups.flatMap((g) => g.styles);
  const withTracking = styles.filter((s) => s.letterSpacing !== undefined).map((s) => s.name);
  if (withTracking.length)
    out.push(`letterSpacing de ${withTracking.join(", ")}: va en la clase que compila la página, pero la vista de Tipografía solo lee tamaño, peso e interlineado.`);
  const noLeading = styles.filter((s) => s.lineHeight === undefined).map((s) => s.name);
  if (noLeading.length) out.push(`${noLeading.join(", ")}: sin interlineado (heredan el del contenedor, a propósito).`);

  // Lo que el formato descartaría: no debería haber nada.
  const drops = [];
  const names = new Map();
  const colorNames = new Set(t.color.tokens.map((c) => c.name));
  for (const [k, v] of Object.entries(t)) {
    if (k === "type" || !v || !Array.isArray(v.tokens)) continue;
    if (k !== "color" && v.tokens.length > 60) drops.push(`${k}: ${v.tokens.length} tokens (máx. 60)`);
    for (const tok of v.tokens) {
      if (!NAME.test(tok.name)) drops.push(`${k}/${tok.name}: nombre inválido`);
      if (names.has(tok.name)) drops.push(`${tok.name}: nombre repetido en ${names.get(tok.name)} y ${k}`);
      names.set(tok.name, k);
      if (k === "color")
        for (const val of typeof tok.value === "string" ? [tok.value] : Object.values(tok.value)) {
          if (!COLOR.test(val)) drops.push(`color/${tok.name}: valor ${val} no legible`);
          const alias = /^\{(.+)\}$/.exec(val)?.[1];
          if (alias && !colorNames.has(alias)) drops.push(`color/${tok.name}: alias a ${alias}, que no existe`);
        }
      if ((k === "spacing" || k === "radius") && !LENGTH.test(String(tok.value))) drops.push(`${k}/${tok.name}: largo ${tok.value} no legible`);
    }
  }
  if (styles.length > 80) drops.push(`type: ${styles.length} estilos (máx. 80)`);
  if (t.type.groups.length > 12) drops.push(`type: ${t.type.groups.length} grupos (máx. 12)`);
  for (const s of styles) {
    if (!NAME.test(s.name)) drops.push(`type/${s.name}: nombre inválido`);
    if (!LENGTH.test(String(s.fontSize))) drops.push(`type/${s.name}: fontSize ${s.fontSize} no legible (el estilo se descarta)`);
  }
  return { out, drops };
}

// ---------- modos ----------

function report(r, tag) {
  const lines = [];
  for (const c of r.changed) lines.push(`  archivo  ${c.path}  ← ${c.src}  (${c.why})`);
  for (const u of r.uploads) lines.push(`  asset    ${GROUP}/${u.name}  ← ${u.src}  (${u.why}${u.oldBlob ? `; reemplaza blob ${u.oldBlob}` : ""})`);
  for (const i of r.indexIssues) lines.push(`  índice   ${i}`);
  const dirty = !tag.exact ? `\nAviso: HEAD no es un tag limpio (${tag.tag}). La proyección debería salir de un tag.` : "";
  return { pending: lines.length > 0, text: lines.join("\n") + dirty };
}

function printGaps(t) {
  const { out, drops } = gaps(t);
  console.log("\nQué queda fuera de la vista (no es un error):");
  for (const g of out) console.log(`  - ${g}`);
  if (drops.length) {
    console.log("\nLo que la página DESCARTARÍA según format.md:");
    for (const d of drops) console.log(`  ! ${d}`);
  }
  return drops.length;
}

if (mode === "plan" || mode === "check") {
  if (!args.served) fail(NEEDS_SERVED);
  const served = resolve(args.served);
  const tag = repoTag();
  const r = compare(served);
  const rep = report(r, tag);
  const cover = coverReview(r.tokens, r.servedTokens);

  if (!rep.pending) console.log(`Sin cambios: ${ARTIFACT_URL} ya proyecta surmetric-tokens@${tag.tag}. No hay nada que publicar.`);
  else console.log(`${mode === "check" ? "Proyección DESFASADA" : "Por publicar"} (surmetric-tokens@${tag.tag}):\n${rep.text}`);
  if (r.notInRepo.length) console.log(`\nEn el grupo ${GROUP} del artifact pero no en logo/: ${r.notInRepo.join(", ")}. No se tocan; decide si se quitan.`);
  if (cover.length) console.log(`\nLa portada (project/components/Cover/preview.html) dibuja datos que cambiaron: ${cover.join(", ")}. Revísala a mano; este script no la regenera.`);
  const drops = printGaps(r.tokens);

  if (mode === "plan") {
    if (!args.out) fail("Falta --out <dir>.");
    const out = resolve(args.out);
    for (const c of r.changed) {
      mkdirSync(dirname(join(out, c.path)), { recursive: true });
      copyFileSync(join(ROOT, c.src), join(out, c.path));
    }
    const plan = {
      url: ARTIFACT_URL,
      tag: tag.tag,
      publish: rep.pending,
      files: r.changed.map((c) => c.path),
      uploads: r.uploads.map((u) => ({ name: u.name, file: join(ROOT, u.src), oldBlob: u.oldBlob })),
      indexIssues: r.indexIssues,
      cover,
    };
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "plan.json"), JSON.stringify(plan, null, 2) + "\n");
    if (rep.pending) console.log(`\nPlan en ${rel(join(out, "plan.json"))}; archivos a publicar bajo ${rel(join(out, "project"))}.`);
  }
  process.exit(mode === "check" && (rep.pending || drops) ? 1 : 0);
}

if (mode === "index") {
  if (!args["served-index"] || !args.out) fail("Uso: index --served-index <archivo> --out <dir> [--uploads <json>]");
  const out = resolve(args.out);
  const plan = readJSON(join(out, "plan.json"));
  if (!plan) fail(`No hay plan.json en ${out}: corre plan primero.`);
  const { assets } = desired();
  const idx = readIndex(resolve(args["served-index"]));
  const uploaded = args.uploads ? JSON.parse(readFileSync(resolve(args.uploads), "utf8")) : {};
  for (const u of plan.uploads) if (!uploaded[u.name]) fail(`Falta el blob subido de ${u.name} en --uploads.`);

  // Solo cambian el grupo Logos, groups y lastChange; todo lo demás del índice queda como se leyó.
  const group = idx.assetGroups?.[GROUP] ?? { name: GROUP, tile: "l", order: [], files: {} };
  const files = { ...group.files };
  const orphans = [];
  for (const a of assets) {
    const up = uploaded[a.name];
    if (up) {
      const old = files[a.name]?.blob;
      if (old && old !== up.blob) orphans.push({ name: a.name, blob: old });
      if (!Number.isInteger(up.size)) fail(`Falta el size de ${a.name} en --uploads: el que devolvió la subida (el almacén reescribe el SVG).`);
      files[a.name] = { name: a.name, blob: up.blob, size: up.size, type: "image/svg+xml" };
    } else if (files[a.name]) files[a.name] = { ...files[a.name], name: a.name, type: "image/svg+xml" };
    else fail(`${a.name} no tiene registro ni subida.`);
  }
  const names = assets.map((a) => a.name);
  const order = group.order ?? [];
  idx.assetGroups = { ...idx.assetGroups, [GROUP]: { ...group, files, order: [...order, ...names.filter((n) => !order.includes(n))] } };
  if (!(idx.groups ?? []).includes(GROUP)) idx.groups = [...(idx.groups ?? []), GROUP];

  const what = [...plan.files.map((p) => p.replace(/^project\//, "")), plan.uploads.length ? `${plan.uploads.length} logo(s)` : null].filter(Boolean);
  idx.lastChange = {
    by: BY,
    at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    via: `Claude Code · surmetric-tokens@${plan.tag}`,
    note: args.note ?? `Sync desde surmetric-tokens@${plan.tag}: ${what.length ? what.join(", ") : "registros del índice"}.`,
  };
  mkdirSync(join(out, "project"), { recursive: true });
  writeFileSync(join(out, "project/design-system.json"), JSON.stringify(idx, null, 2) + "\n");

  if (orphans.length) {
    const doc = join(ROOT, "docs/ARTIFACT.md");
    const day = idx.lastChange.at.slice(0, 10);
    const rows = orphans.map((o) => `| ${day} | ${plan.tag} | \`${o.name}\` | \`${o.blob}\` |`).join("\n");
    writeFileSync(doc, readFileSync(doc, "utf8").replace(/(<!-- huerfanos:end -->)/, `${rows}\n$1`));
    console.log(`Blobs huérfanos anotados en docs/ARTIFACT.md (no se borran): ${orphans.map((o) => o.blob).join(", ")}`);
  }
  console.log(`Índice listo: ${rel(join(out, "project/design-system.json"))}. Va en la ÚLTIMA llamada de publish.`);
  process.exit(0);
}

fail(`Modo desconocido "${mode ?? ""}". Usa plan, check o index.`);
