// Genera los favicon raster desde logo/favicon.svg (que a su vez sale de scripts/logo.py).
//
// No es parte de `npm run build`: se corre cuando cambia el logo y los archivos se commitean.
// Uso: npm run favicon
//
//   logo/favicon.ico           16, 32 y 48 px (PNG dentro de ICO), fondo transparente
//   logo/apple-touch-icon.png  180 px, fondo blanco y margen: iOS rellena de negro lo transparente
//   logo/icon-192.png          192 px, transparente (manifest de PWA)
//   logo/icon-512.png          512 px, transparente (manifest de PWA)
//
// Todos usan el isotipo tal cual, también a 16 px: se probó engrosar el trazo y no mejora la lectura.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = join(ROOT, "logo");
const svg = readFileSync(join(LOGO, "favicon.svg"), "utf8");

const png = (source, size) => new Resvg(source, { fitTo: { mode: "width", value: size } }).render().asPng();

// apple-touch-icon: el mismo cuadrado con 10% de margen por lado sobre brand-white.
const MARGIN = 0.1;
function onWhite(source) {
  const [x, y, w] = /viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) [\d.]+"/.exec(source).slice(1).map(Number);
  const m = +(w * MARGIN).toFixed(2);
  const box = [x - m, y - m, w + 2 * m, w + 2 * m].map((n) => +n.toFixed(2));
  return source
    .replace(/viewBox="[^"]*" width="[^"]*" height="[^"]*"/, `viewBox="${box.join(" ")}" width="${box[2]}" height="${box[3]}"`)
    .replace(/(<\/title>)/, `$1\n  <rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="#FFFFFF"/>`);
}

// ICO con PNG embebidos (Windows Vista+ y todos los navegadores actuales).
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // planos
    header.writeUInt16LE(32, e + 6); // bits por pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const out = {
  "favicon.ico": ico([16, 32, 48].map((size) => ({ size, data: png(svg, size) }))),
  "apple-touch-icon.png": png(onWhite(svg), 180),
  "icon-192.png": png(svg, 192),
  "icon-512.png": png(svg, 512),
};
for (const [name, data] of Object.entries(out)) {
  writeFileSync(join(LOGO, name), data);
  console.log(`  escrito logo/${name} (${data.length} bytes)`);
}
