# surmetric-tokens

Design tokens **Core** de Surmetric. Una sola fuente de verdad, `tokens/tokens.json`, y un build que genera todo lo demás:

| Archivo | Para qué |
|---|---|
| `tokens/tokens.json` | **Fuente de verdad.** Forma del tipo Design System de Claude: cada familia es `{"tokens": [{"name", "value", "usage"}]}`, color con `themes`, tipografía en `type.groups`. |
| `dist/tokens.css` | Custom properties `--sm-*` y bloque de tema oscuro. Para proyectos sin Tailwind. |
| `dist/tailwind.js` | Preset para Tailwind 3. Incluye las variables de tema, no necesita `tokens.css`. |
| `dist/theme.css` | Bloque `@theme` para Tailwind 4, con las variables de tema. |
| `dist/tokens.ts` · `tokens.js` · `tokens.d.ts` | Constantes y tipos para consumo desde TS/JS. |
| `dist/fonts.css` | `@font-face` de Montserrat y Geist Mono apuntando a `fonts/`. |
| `fonts/` | `.woff2` variables de Montserrat (normal e itálica, subset latin) y Geist Mono, con sus licencias OFL. |
| `logo/` | Logo Surmetric en SVG: lockup e isotipo, en color, blanco y mono. Ver [`docs/LOGO.md`](docs/LOGO.md). |

## Instalación

Sin registry: se instala desde el tag de git.

```sh
npm install github:fcosalinas/surmetric-tokens#v0.2.3
```

El repo es privado. La máquina que instala (también la de CI o Vercel) necesita acceso de lectura a GitHub.

**Regla de adopción**: en el mismo PR que instala Core, la app borra sus definiciones locales con los mismos nombres (`--color-ink`, `--color-accent*`, `--color-danger*`, `--color-warning*`, `--radius-card`, `--ease-out-expo`, `--font-sans`/`display`/`mono`, `brand.*` en Tailwind 3). Si no las borra, Tailwind usa la de la app sin avisar: en Tailwind 4 gana el último `@theme` importado y en Tailwind 3 el `extend` de la app le gana al preset. La lista por repo está en [`docs/DECISIONES-PENDIENTES.md`](docs/DECISIONES-PENDIENTES.md) §7.

## Consumo

### Tailwind 4

```css
/* app/globals.css */
@import "tailwindcss";
@import "surmetric-tokens/theme.css";

/* Opcional: que dark: siga al data-theme en vez de al sistema operativo */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *, .dark, .dark *));
```

```tsx
// app/layout.tsx: las fuentes se importan desde JS para que el bundler resuelva los url()
import "surmetric-tokens/fonts.css";
```

### Tailwind 3

```js
// tailwind.config.js
module.exports = {
  presets: [require("surmetric-tokens/tailwind")],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
```

```tsx
// layout / entry
import "surmetric-tokens/fonts.css";
```

En Tailwind 3 los semánticos aceptan opacidad (`bg-accent/10`), porque se exponen como canales RGB.

### Clases resultantes (iguales en v3 y v4)

```html
<main class="bg-canvas text-ink font-sans">
  <h1 class="font-display text-title-1">Título de página</h1>
  <section class="bg-surface border border-border rounded-card p-6 hover:shadow-card-hover transition ease-out-expo">
    <p class="text-sm text-ink-muted">Texto secundario accesible</p>
    <a class="text-accent-strong">Enlace</a>
    <span class="font-mono text-micro-11">ID-0042</span>
  </section>
</main>
```

### CSS sin Tailwind

```css
@import "surmetric-tokens/tokens.css";
body { background: var(--sm-color-canvas); color: var(--sm-color-ink); }
h1 {
  font: var(--sm-weight-title-1) var(--sm-text-title-1) / var(--sm-leading-title-1) var(--sm-font-display);
  letter-spacing: var(--sm-tracking-title-1);
}
.card { padding: var(--sm-space-6); border-radius: var(--sm-radius-card); }
```

### TypeScript

```ts
import { colors, semanticColors, cssVar, typeStyles, spacing } from "surmetric-tokens";

colors["brand-teal"];             // "#00968E"
semanticColors["ink-muted"].dark; // "#8E9AA8"
cssVar.action;                    // "var(--sm-color-action)"
typeStyles["title-2"];            // { fontSize: "1.5rem", lineHeight: "2rem", fontWeight: "800", letterSpacing: "-0.02em" }
spacing["space-4"];               // "1rem"
```

`surmetric-tokens/tokens.ts` está disponible si prefieres el fuente TS (requiere `transpilePackages` en Next).

## Recetas

Core no trae componentes: cada app tiene su `Button`, su `Input`, etc. Lo que sí define es con qué tokens se arman, para que todas las apps los hagan iguales. Copia la cadena de clases a tu componente.

| Pieza | Clases |
|---|---|
| Botón primario | `inline-flex items-center justify-center gap-2 rounded-button px-4 py-2.5 text-sm font-semibold bg-action text-on-action hover:bg-action-hover transition-colors` |
| Botón secundario | `inline-flex items-center justify-center gap-2 rounded-button px-4 py-2.5 text-sm font-semibold border border-border bg-canvas text-ink hover:bg-surface transition-colors` |
| Input / select | `w-full rounded-control border border-border bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30` |
| Chip / badge | `inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold bg-accent-soft text-ink` |
| Tarjeta | `rounded-card border border-border bg-canvas p-6` |
| Rótulo (eyebrow) | `text-eyebrow uppercase text-ink-muted` |
| Foco visible | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent` |

Notas:
- **El relleno del botón primario es `action`, no `accent`.** Texto blanco sobre `accent` da 3.65:1 y falla AA con texto chico. `on-accent` está deprecado.
- Botón e input comparten radio (6px) y padding vertical (`py-2.5`), así que calzan en altura en un formulario.
- Un título lleva siempre `font-display` junto a `text-display` / `text-title-*`: el tamaño trae peso, interlineado y tracking, pero no la familia. Un `font-bold` explícito le gana al peso del estilo.

## Escalas

- **Tamaños**: los pasos son los de Tailwind entre 12 y 60px, con los mismos valores, más `micro-10` y `micro-11`. Calzan exactos 1,905 de los 1,910 usos de tamaño de los seis repos. Las clases (`text-sm`, `text-2xl`…) no cambian. Los micro no tienen interlineado propio: heredan el del contenedor, como `text-[11px]` hoy.
- **Títulos** (`display`, `title-1` … `title-4`): peso 900 / 900 / 800 / 700 / 700 y tracking −0.025 / −0.025 / −0.02 / −0.01 / 0 em. Son opt-in: no cambian ningún `text-*` existente.
- **Rótulo** (`eyebrow`): 12/16, peso 600, tracking 0.1em. Va siempre con `uppercase text-ink-muted`, porque un token de tamaño no puede llevar la transformación ni el color.
- **Espaciado**: base 4px, la de Tailwind. Los pasos oficiales son los de la tabla de abajo, incluido el paso feo 14 (56px), que usan 3 repos. Tailwind no se restringe: `px-7`, `px-3.5` o `pt-40` siguen compilando, pero quedan fuera de escala y se corrigen en revisión de código.
- El porqué de cada paso, con los usos que colapsan en él: [`docs/DECISIONES-PENDIENTES.md`](docs/DECISIONES-PENDIENTES.md) §8.

## Tema oscuro

Es **opt-in** y hoy **no tiene consumidores**: ninguna de las seis apps implementa dark mode (lex declara `color-scheme: light`; el tema oscuro de symdat es código muerto). Los valores existen y el build verifica su contraste, pero no son un compromiso de producto.

Se activa con `data-theme="dark"` o `class="dark"` en `<html>` o en cualquier contenedor. No sigue `prefers-color-scheme` por sí solo, para que adoptar el paquete no cambie de tema una app que hoy no lo soporta.

Solo cambian los tokens semánticos (`canvas`, `surface`, `ink`, `action`…). Los `brand-*` son la paleta y valen lo mismo en ambos temas.

## Logo

`logo/` tiene el logo Surmetric en vector. Hasta ahora solo existía como PNG.

| Archivo | Uso |
|---|---|
| `surmetric-lockup.svg` | Versión principal, sobre fondos claros |
| `surmetric-lockup-white.svg` | Sobre `brand-dark` o fotos oscuras |
| `surmetric-lockup-mono.svg` | Escala de grises (impresión sin color) |
| `surmetric-isotipo.svg` · `-white` · `-mono` | Avatares y espacios chicos |
| `favicon.svg` · `favicon.ico` | Favicon: el isotipo de color en un cuadrado, fondo transparente. El ICO trae 16, 32 y 48 px. |
| `apple-touch-icon.png` | 180 px, fondo blanco con margen: iOS rellena de negro lo transparente |
| `icon-192.png` · `icon-512.png` | Íconos del manifest de PWA, transparentes |

```tsx
import logo from "surmetric-tokens/logo/surmetric-lockup.svg";
```

Los favicon no se sirven desde `node_modules`: cada app los copia una vez a su carpeta pública, y los vuelve a copiar cuando suba de versión si el logo cambió. En Next (App Router) basta con dejarlos con los nombres de la convención y Next arma los `<link>` solo:

```sh
cp node_modules/surmetric-tokens/logo/favicon.ico            app/favicon.ico
cp node_modules/surmetric-tokens/logo/favicon.svg            app/icon.svg
cp node_modules/surmetric-tokens/logo/apple-touch-icon.png   app/apple-icon.png
```

Sin Next, en `public/` y con estos `<link>`:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

A 16 px el isotipo se lee como silueta (bloque gris y cubo teal); se probó engrosar el trazo y no mejora. Las pantallas de alta densidad usan 32 px, donde se ve completo.

Cómo se construyó y qué tan fiel es al PNG original: [`docs/LOGO.md`](docs/LOGO.md).

## Qué entra a Core y por qué

Criterio de color: valores compartidos por **3 repos o más** (según `docs/INVENTARIO-DESIGN-TOKENS.md`, 2026-10-29), más los grupos de deriva aprobados. Las escalas siguen otro criterio, porque entre apps casi nunca coinciden: se diseñaron para que la migración de cada app sea corta (ver `docs/DECISIONES-PENDIENTES.md` §8).

- **Compartidos por 3+**: `#00968E`, `#00766F`, `#E6F5F3`, `#1B1F2A`, `#F4F7FA`, `#E1E8F0`, `#B8C2CC`, `#8E9AA8`, `#FFFFFF`, `#DC2626`, `#D97706`, y los micro-tamaños 10px/11px.
- **Deriva aprobada**: `#2D3140` (dark-soft), fondos de estado `#FDECEC` / `#FEF3E2`, info `#2563EB`, teal luminoso `#00B2AC`, curva `cubic-bezier(0.16, 1, 0.3, 1)`, sombra de tarjeta de yolotengo y radio de tarjeta 14px.
- **Decisiones de la Fase A (v0.2.0)**: `action` / `action-hover` / `on-action`, `brand-gray-400`, escala tipográfica, títulos y rótulo `eyebrow`, escala de espaciado, radios de control, botón y pill, logo vectorial.
- **Tipografía**: Montserrat + Geist Mono (generación de songal/yolotengo).

**Fuera de Core**:
- lo semántico de cada producto (semáforo de lex, capas de mapa de piatio, escalas de cobranza y salud de Surdat, series de gráfico);
- la identidad navy de lex-semaforo (C1);
- el color de "éxito" (C2, sin decidir: ni `success` ni `success-soft` existen todavía);
- la generación Inter / JetBrains Mono (C5);
- los tamaños 72/96px;
- los componentes y los íconos.

Para íconos nuevos se recomienda Lucide (`lucide-react`, ya en symdat) con `strokeWidth={1.5}`, para calzar con los íconos de línea de songal.

### Los dos grises

`#8E9AA8` no pasa AA en ningún tamaño de texto sobre fondos claros (2.86:1 sobre blanco). Por eso la marca tiene dos grises con dos roles:

- **`brand-gray-400` = `#8E9AA8`**: gris de identidad. Es la cara izquierda de los cubos del logo, y se usa en ilustración y elementos decorativos. Es el `ink-muted` del tema oscuro, donde sí pasa (5.75:1 sobre `#1B1F2A`). Hasta 0.1.0 se llamaba `brand-gray-500-legacy`.
- **`brand-gray-500` = `#5D6978`**: texto secundario. Mismo tono, más oscuro: pasa AA sobre `#FFFFFF` (5.59), `#F4F7FA` (5.20) y `#E1E8F0` (4.53). Quien migre `text-brand-gray-500` recibe el valor accesible sin cambiar clases.

El build **falla** si un par texto/fondo prometido baja del mínimo (tabla al final).

Pares que siguen fallando y quedan anotados en su `usage`: texto blanco sobre `accent` (por eso existe `action`), `warning` como texto sobre fondos claros, y `danger` / `warning` sobre su propio `*-soft`.

## Desarrollo y versiones

```sh
npm install        # trae las fuentes de origen (devDependencies)
npm run build      # regenera dist/, fonts/ y la tabla de este README
npm run check      # falla si algo generado no está al día con tokens.json
```

`dist/`, `fonts/` y `logo/` se commitean: así `npm install github:…` no necesita build. El logo no es parte de `npm run build`; se regenera con `python scripts/logo.py` (requiere `fonttools` y `brotli`) y después `npm run favicon`, que rasteriza `logo/favicon.svg` con `@resvg/resvg-js`.

### Qué cuenta como breaking

| Cambio | Tipo |
|---|---|
| Quitar o renombrar un token, una clase, una variable CSS o una ruta de `exports` | **Breaking** |
| Cambiar el valor de un token existente (cualquier app fijada al tag vería un cambio visual al subir) | **Breaking** |
| Cambiar cómo se activa un tema o dejar de soportar un major de Tailwind | **Breaking** |
| Agregar tokens, salidas o valores de tema a tokens que no los tenían | Aditivo |
| Docs, textos de `usage`, arreglos del build que no cambian `dist/` | Parche |

Mientras sea 0.x, un breaking sube el minor y lo aditivo o un parche sube el patch. Se pasa a `1.0.0` cuando dos apps usen Core en producción; desde ahí, semver normal.

### Publicar una versión

1. Editar `tokens/tokens.json` (nunca `dist/`).
2. `npm run build` y revisar el diff.
3. Subir `version` en `package.json`, volver a correr `npm run build` y anotar en `CHANGELOG.md` qué cambia y qué tiene que hacer cada app.
4. `npm run check` en verde, `git commit`, tag anotado `git tag -a vX.Y.Z` y `git push --follow-tags`. Un tag publicado nunca se mueve.
5. Actualizar la proyección del sistema de diseño en Claude desde ese tag: **`/sync-artifact`** en Claude Code. Sube y publica solo lo que cambió y termina con `npm run check:artifact` en verde. Antes del paso 1 conviene correr `/sync-artifact` una vez, para confirmar que la proyección no tiene cambios hechos en la página que el sync pisaría. Detalle y límites: [`docs/ARTIFACT.md`](docs/ARTIFACT.md).

Cada app fija un tag exacto, y subir de versión es un PR explícito en la app. Orden de adopción, por costo: yolotengo → sitio-web-songal → IAnsurance → piatio → lex-semaforo (sin colores de marca mientras rija C1) → symdat.

## Tokens

<!-- tokens:start -->
<!-- Generado por scripts/build.mjs. No editar a mano. -->

### Color — paleta (igual en ambos temas)

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `brand-teal` | `#00968E` | `bg-brand-teal` | Acento de marca: íconos, rellenos, bordes de foco, logo. 3.65:1 sobre blanco: solo texto ≥24px (o ≥18.66px bold) y elementos no-texto. |
| `brand-teal-dark` | `#00766F` | `bg-brand-teal-dark` | Acento como texto sobre fondos claros (5.50:1 sobre blanco, 5.11:1 sobre brand-gray-50) y relleno del botón primario (action). Cara izquierda del cubo teal del logo. |
| `brand-teal-light` | `#E6F5F3` | `bg-brand-teal-light` | Fondo suave del acento (chips, filas seleccionadas). El texto encima va en brand-dark o brand-teal-dark. |
| `brand-teal-bright` | `#00B2AC` | `bg-brand-teal-bright` | Cara superior del cubo teal del logo (Surmetric y Surdat). Acento como texto en tema oscuro (6.24:1 sobre brand-dark). No usar como texto sobre fondos claros. |
| `brand-dark` | `#1B1F2A` | `bg-brand-dark` | Texto principal en tema claro, fondo de página en tema oscuro, trazo y wordmark del logo. |
| `brand-dark-soft` | `#2D3140` | `bg-brand-dark-soft` | Superficie elevada sobre brand-dark (tarjetas, paneles) y bordes en tema oscuro. |
| `brand-gray-50` | `#F4F7FA` | `bg-brand-gray-50` | Superficie clara: fondos de sección y tarjetas sobre blanco. Texto principal en tema oscuro. |
| `brand-gray-100` | `#E1E8F0` | `bg-brand-gray-100` | Bordes y divisores en tema claro; track de anillos y barras de progreso; cara superior de los cubos grises del logo. |
| `brand-gray-300` | `#B8C2CC` | `bg-brand-gray-300` | Gris medio para estados deshabilitados y elementos decorativos; cara derecha de los cubos grises del logo. No es color de texto: 1.81:1 sobre blanco. |
| `brand-gray-400` | `#8E9AA8` | `bg-brand-gray-400` | Gris de identidad: cara izquierda de los cubos grises del logo, ilustración, elementos decorativos. Texto secundario solo sobre fondos oscuros (5.75:1 sobre brand-dark). Sobre fondos claros no es texto ni borde de control (2.86:1 sobre blanco). |
| `brand-gray-500` | `#5D6978` | `bg-brand-gray-500` | Texto secundario sobre fondos claros: metadatos, ayudas, placeholders. Mismo tono que brand-gray-400, más oscuro: 5.59:1 sobre blanco, 5.20:1 sobre brand-gray-50, 4.53:1 sobre brand-gray-100. |
| `brand-white` | `#FFFFFF` | `bg-brand-white` | Base: fondo de página en tema claro y texto sobre action. |
| `danger` | `#DC2626` | `bg-danger` | Estado de error: íconos, bordes, texto sobre canvas claro (4.83:1). Sobre danger-soft da 4.23:1 (falla AA en texto normal): ahí el texto va en ink. En oscuro solo no-texto sobre canvas (3.41:1). |
| `warning` | `#D97706` | `bg-warning` | Estado de advertencia: íconos y bordes. Como texto falla AA sobre fondos claros (3.19:1 sobre blanco); en oscuro pasa (5.17:1 sobre canvas). |
| `info` | `#2563EB` | `bg-info` | Información y acción secundaria. Texto sobre canvas claro (5.17:1). En oscuro solo no-texto sobre canvas (3.18:1). |

### Color — semánticos (cambian con el tema)

| Token | Claro | Oscuro | Tailwind | Uso |
|---|---|---|---|---|
| `canvas` | `#FFFFFF` | `#1B1F2A` | `bg-canvas` | Fondo de página. |
| `surface` | `#F4F7FA` | `#2D3140` | `bg-surface` | Superficie sobre canvas: secciones alternas, tarjetas, paneles. |
| `border` | `#E1E8F0` | `#2D3140` | `bg-border` | Bordes y divisores sobre canvas. En oscuro coincide con surface: una tarjeta surface en oscuro no necesita borde. |
| `ink` | `#1B1F2A` | `#F4F7FA` | `bg-ink` | Texto principal sobre canvas y surface (≥12.0:1 en ambos temas). |
| `ink-muted` | `#5D6978` | `#8E9AA8` | `bg-ink-muted` | Texto secundario sobre canvas y surface. Pasa AA en ambos temas (claro ≥5.20:1, oscuro ≥4.52:1). |
| `accent` | `#00968E` | `#00968E` | `bg-accent` | Acento no-texto: anillos de foco, íconos activos, bordes de selección. ≥3.39:1 sobre canvas y surface en ambos temas. No es el relleno del botón primario: ese es action. |
| `accent-strong` | `#00766F` | `#00B2AC` | `bg-accent-strong` | Acento como texto (enlaces). ≥4.90:1 sobre canvas y surface en ambos temas. |
| `accent-soft` | `#E6F5F3` | `#17323A` | `bg-accent-soft` | Fondo suave del acento. Valor oscuro = brand-teal al 16% sobre brand-dark. El texto encima va en ink. |
| `on-accent` | `#FFFFFF` | `#FFFFFF` | `bg-on-accent` | DEPRECADO desde 0.2.0, se quita en la próxima versión breaking: usar action + on-action. Texto sobre accent: solo 3.65:1, texto ≥18.66px bold o ≥24px. |
| `action` | `#00766F` | `#00B2AC` | `bg-action` | Relleno del botón primario y de toda acción principal. El texto encima va en on-action (5.50:1 en claro, 6.24:1 en oscuro). |
| `action-hover` | `#1B1F2A` | `#00968E` | `bg-action-hover` | Hover y pressed de action. Mismo patrón que songal (teal↔dark). on-action encima: 16.46:1 en claro, 4.51:1 en oscuro. |
| `on-action` | `#FFFFFF` | `#1B1F2A` | `bg-on-action` | Texto e íconos sobre action y action-hover. Pasa AA para texto de cualquier tamaño en ambos estados y temas. |
| `danger-soft` | `#FDECEC` | `#3A2029` | `bg-danger-soft` | Fondo de alertas de error. Valor oscuro = danger al 16% sobre brand-dark. Texto encima en ink. |
| `warning-soft` | `#FEF3E2` | `#392D24` | `bg-warning-soft` | Fondo de alertas de advertencia. Valor oscuro = warning al 16% sobre brand-dark. Texto encima en ink (warning sobre warning-soft da 2.90:1). |

### Tipografía

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `font-sans` | `"Montserrat", "Helvetica Neue", Arial, sans-serif` | `font-sans` | Familia sans. |
| `font-display` | `"Montserrat", "Helvetica Neue", Arial, sans-serif` | `font-display` | Familia display. |
| `font-mono` | `"Geist Mono", ui-monospace, monospace` | `font-mono` | Familia mono. |

| Estilo | Tamaño | Interlineado | Peso | Tracking | Tailwind | Uso |
|---|---|---|---|---|---|---|
| `display` | `3rem` | 1.05 | 900 | -0.025em | `text-display` | Titular de portada (48px). El tamaño responsive mayor (60-96px) lo fija cada app; peso, interlineado y tracking no. Calza con el hero de songal y yolotengo (leading 1.05). |
| `title-1` | `1.875rem` | 2.25rem | 900 | -0.025em | `text-title-1` | Título de página (30/36). Calza con yolotengo text-3xl font-black (×9). |
| `title-2` | `1.5rem` | 2rem | 800 | -0.02em | `text-title-2` | Título de sección (24/32). −0.02em es el tracking actual de yolotengo en h1-h3. |
| `title-3` | `1.25rem` | 1.75rem | 700 | -0.01em | `text-title-3` | Subtítulo y título de tarjeta grande (20/28). En UI densa no pasar de 700. |
| `title-4` | `1.125rem` | 1.75rem | 700 | 0 | `text-title-4` | Título de tarjeta, panel o modal (18/28). Sin tracking negativo a este tamaño. |
| `6xl` | `3.75rem` | 1 | — | — | `text-6xl` | 60px. 5 usos (songal, yolotengo). 72px y 96px quedan fuera de Core (solo el hero de songal). |
| `5xl` | `3rem` | 1 | — | — | `text-5xl` | 48px. 13 usos en 5 repos. |
| `4xl` | `2.25rem` | 2.5rem | — | — | `text-4xl` | 36px. 21 usos en los 6 repos. |
| `3xl` | `1.875rem` | 2.25rem | — | — | `text-3xl` | 30px: paso feo que se conserva. 39 usos en 5 repos. |
| `2xl` | `1.5rem` | 2rem | — | — | `text-2xl` | 24px. 85 usos en los 6 repos. |
| `xl` | `1.25rem` | 1.75rem | — | — | `text-xl` | 20px. 48 usos en 5 repos. |
| `lg` | `1.125rem` | 1.75rem | — | — | `text-lg` | 18px: paso feo que se conserva. 145 usos en los 6 repos. |
| `base` | `1rem` | 1.5rem | — | — | `text-base` | 16px. Texto de lectura. 29 usos por clase (es el tamaño por defecto del body). |
| `sm` | `0.875rem` | 1.25rem | — | — | `text-sm` | 14px. Texto de interfaz. 745 usos en los 6 repos. |
| `xs` | `0.75rem` | 1rem | — | — | `text-xs` | 12px. Metadatos, etiquetas, ayudas. 668 usos en los 6 repos. |
| `eyebrow` | `0.75rem` | 1rem | 600 | 0.1em | `text-eyebrow` | Rótulo en mayúsculas sobre un título o sección (12/16). Se usa con uppercase y text-ink-muted: el token no puede llevar la transformación ni el color. Unifica .eyebrow de lex (12px/600/0.14em) y de yolotengo (0.72rem/700/0.1em). |
| `micro-11` | `11px` | hereda | — | — | `text-micro-11` | Rótulos de gráficos, metadatos de tablas densas. Sin interlineado propio: hereda el del contenedor, como text-[11px] hoy. 68 usos (symdat, lex, piatio). |
| `micro-10` | `10px` | hereda | — | — | `text-micro-10` | Rótulos mínimos (ejes, leyendas de anillos). Hereda interlineado. No usar para texto que se lee de corrido. 39 usos (symdat, lex, IAnsurance, piatio); absorbe los 9px de symdat. |

### Espaciado

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `space-0_5` | `0.125rem` | `p-0.5` | 2px (Tailwind 0.5). 76 usos. |
| `space-1` | `0.25rem` | `p-1` | 4px (1). Unidad base de la escala. 476 usos. |
| `space-1_5` | `0.375rem` | `p-1.5` | 6px (1.5). 226 usos. |
| `space-2` | `0.5rem` | `p-2` | 8px (2). El paso más usado: 1339 usos. |
| `space-2_5` | `0.625rem` | `p-2.5` | 10px (2.5). Padding vertical de botones e inputs. 32 usos. |
| `space-3` | `0.75rem` | `p-3` | 12px (3). 938 usos. |
| `space-4` | `1rem` | `p-4` | 16px (4). 659 usos. |
| `space-5` | `1.25rem` | `p-5` | 20px (5). 127 usos. |
| `space-6` | `1.5rem` | `p-6` | 24px (6). Padding de tarjeta. 394 usos. |
| `space-8` | `2rem` | `p-8` | 32px (8). 113 usos. |
| `space-10` | `2.5rem` | `p-10` | 40px (10). 40 usos. |
| `space-12` | `3rem` | `p-12` | 48px (12). 32 usos. |
| `space-14` | `3.5rem` | `p-14` | 56px (14): paso feo entre 48 y 64, pero lo usan 3 repos (songal, lex, yolotengo). |
| `space-16` | `4rem` | `p-16` | 64px (16). Separación entre secciones. 20 usos. |
| `space-20` | `5rem` | `p-20` | 80px (20). 8 usos. |
| `space-24` | `6rem` | `p-24` | 96px (24). 11 usos. |
| `space-32` | `8rem` | `p-32` | 128px (32). Padding de sección en landing. 9 usos. |

### Forma y movimiento

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `radius-control` | `6px` | `rounded-control` | Inputs, selects, textareas (rounded-md hoy en lex, piatio y parte de symdat). |
| `radius-button` | `6px` | `rounded-button` | Botones de cualquier variante. Igual a radius-control para que botón e input calcen en un formulario. |
| `radius-pill` | `9999px` | `rounded-pill` | Chips, badges, avatares, toggles. Forma de 62 de los 75 chips de los repos. |
| `radius-card` | `14px` | `rounded-card` | Tarjetas y paneles (yolotengo --radius-card). |
| `shadow-card-hover` | `0 8px 24px -12px rgba(27, 31, 42, 0.25)` | `shadow-card-hover` | Elevación de una tarjeta en hover. Color base brand-dark. |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `ease-out-expo` | Curva de entrada para transiciones y animaciones de aparición (songal, yolotengo). Puntos de control: x1 0.16, y1 1, x2 0.3, y2 1. |

### Contraste verificado en el build

| Tema | Texto / elemento | Fondo | Ratio | Mínimo |
|---|---|---|---|---|
| light | `ink` | `canvas` | 16.46:1 | 4.5:1 |
| light | `ink` | `surface` | 15.31:1 | 4.5:1 |
| light | `ink-muted` | `canvas` | 5.59:1 | 4.5:1 |
| light | `ink-muted` | `surface` | 5.20:1 | 4.5:1 |
| light | `accent-strong` | `canvas` | 5.50:1 | 4.5:1 |
| light | `accent-strong` | `surface` | 5.11:1 | 4.5:1 |
| light | `accent` | `canvas` | 3.65:1 | 3:1 |
| light | `accent` | `surface` | 3.39:1 | 3:1 |
| light | `ink` | `accent-soft` | 14.67:1 | 4.5:1 |
| light | `ink` | `danger-soft` | 14.41:1 | 4.5:1 |
| light | `ink` | `warning-soft` | 14.99:1 | 4.5:1 |
| light | `on-action` | `action` | 5.50:1 | 4.5:1 |
| light | `on-action` | `action-hover` | 16.46:1 | 4.5:1 |
| dark | `ink` | `canvas` | 15.31:1 | 4.5:1 |
| dark | `ink` | `surface` | 12.02:1 | 4.5:1 |
| dark | `ink-muted` | `canvas` | 5.75:1 | 4.5:1 |
| dark | `ink-muted` | `surface` | 4.52:1 | 4.5:1 |
| dark | `accent-strong` | `canvas` | 6.24:1 | 4.5:1 |
| dark | `accent-strong` | `surface` | 4.90:1 | 4.5:1 |
| dark | `accent` | `canvas` | 4.51:1 | 3:1 |
| dark | `accent` | `surface` | 3.54:1 | 3:1 |
| dark | `ink` | `accent-soft` | 12.57:1 | 4.5:1 |
| dark | `ink` | `danger-soft` | 13.77:1 | 4.5:1 |
| dark | `ink` | `warning-soft` | 12.40:1 | 4.5:1 |
| dark | `on-action` | `action` | 6.24:1 | 4.5:1 |
| dark | `on-action` | `action-hover` | 4.51:1 | 4.5:1 |

<!-- tokens:end -->
