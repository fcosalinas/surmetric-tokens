# surmetric-tokens

Design tokens **Core** de Surmetric. Una sola fuente de verdad, `tokens/tokens.json`, y un build que genera todo lo demás:

| Archivo | Para qué |
|---|---|
| `tokens/tokens.json` | **Fuente de verdad.** Forma del tipo Design System de Claude: cada familia es `{"tokens": [{"name", "value", "usage"}]}`, color con `themes`. |
| `dist/tokens.css` | Custom properties `--sm-*` y bloque de tema oscuro. Para proyectos sin Tailwind. |
| `dist/tailwind.js` | Preset para Tailwind 3. Incluye las variables de tema, no necesita `tokens.css`. |
| `dist/theme.css` | Bloque `@theme` para Tailwind 4, con las variables de tema. |
| `dist/tokens.ts` · `tokens.js` · `tokens.d.ts` | Constantes y tipos para consumo desde TS/JS. |
| `dist/fonts.css` | `@font-face` de Montserrat y Geist Mono apuntando a `fonts/`. |
| `fonts/` | `.woff2` variables de Montserrat (normal e itálica, subset latin) y Geist Mono, con sus licencias OFL. |

## Instalación

Sin registry: se instala desde el tag de git.

```sh
npm install github:fcosalinas/surmetric-tokens#v0.1.0
```

El repo es privado. La máquina que instala (también la de CI o Vercel) necesita acceso de lectura a GitHub.

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
  <section class="bg-surface border border-border rounded-card hover:shadow-card-hover transition ease-out-expo">
    <p class="text-ink-muted">Texto secundario accesible</p>
    <a class="text-accent-strong">Enlace</a>
    <button class="bg-accent-strong text-on-accent">Acción</button>
    <span class="font-mono text-micro-11">ID-0042</span>
  </section>
</main>
```

### CSS sin Tailwind

```css
@import "surmetric-tokens/tokens.css";
body { background: var(--sm-color-canvas); color: var(--sm-color-ink); }
```

### TypeScript

```ts
import { colors, semanticColors, cssVar, type SemanticColorToken } from "surmetric-tokens";

colors["brand-teal"];            // "#00968E"
semanticColors["ink-muted"].dark; // "#8E9AA8"
cssVar.canvas;                  // "var(--sm-color-canvas)"
```

`surmetric-tokens/tokens.ts` está disponible si prefieres el fuente TS (requiere `transpilePackages` en Next).

## Tema oscuro

Es **opt-in**: se activa con `data-theme="dark"` o `class="dark"` en `<html>` o en cualquier contenedor. No sigue `prefers-color-scheme` por sí solo, para que adoptar el paquete no cambie de tema una app que hoy no lo soporta.

Solo cambian los tokens semánticos (`canvas`, `surface`, `ink`, `accent`…). Los `brand-*` son la paleta y valen lo mismo en ambos temas.

## Qué entra a Core y por qué

Criterio: valores compartidos por **3 repos o más** (según `INVENTARIO-DESIGN-TOKENS.md`, 2026-10-29), más los grupos de deriva aprobados:

- **Compartidos por 3+**: `#00968E`, `#00766F`, `#E6F5F3`, `#1B1F2A`, `#F4F7FA`, `#E1E8F0`, `#B8C2CC`, `#8E9AA8`, `#FFFFFF`, `#DC2626`, `#D97706`, y los micro-tamaños 10px/11px.
- **Deriva aprobada**: `#2D3140` (dark-soft), fondos de estado `#FDECEC` / `#FEF3E2`, info `#2563EB`, teal luminoso `#00B2AC`, curva `cubic-bezier(0.16, 1, 0.3, 1)`, sombra de tarjeta de yolotengo y radio de tarjeta 14px.
- **Tipografía**: Montserrat + Geist Mono (generación de songal/yolotengo).

**Fuera de Core**: lo semántico de cada producto (semáforo de lex, capas de mapa de piatio, escalas de cobranza y salud de Surdat), la identidad navy de lex-semaforo (C1), el color de "éxito" (C2, sin decidir: ni `success` ni `success-soft` existen todavía), la generación Inter / JetBrains Mono (C5), eyebrow y tracking de titulares, y las escalas por defecto de Tailwind (espaciado, tamaños), que se siguen usando tal cual.

### Contraste de `#8E9AA8`

`#8E9AA8` no pasaba AA en ningún tamaño de texto sobre fondos claros (2.86:1 sobre blanco). Se corrige en la raíz:

- **`brand-gray-500` ahora es `#5D6978`**: mismo tono y saturación, menor luminosidad. Pasa AA sobre `#FFFFFF` (5.59), `#F4F7FA` (5.20) y `#E1E8F0` (4.53). Quien migre `text-brand-gray-500` recibe el valor accesible sin cambiar clases.
- **`brand-gray-500-legacy` = `#8E9AA8`**: se conserva para compatibilidad. Es el `ink-muted` del tema oscuro, donde sí pasa (5.75:1 sobre `#1B1F2A`).
- El build **falla** si un par texto/fondo prometido baja del mínimo (tabla al final).

Pares que siguen fallando y quedan anotados en su `usage`: texto blanco sobre `accent` (3.65:1, solo texto grande; para botones con texto chico usa `bg-accent-strong`), `warning` como texto sobre fondos claros, y `danger` / `warning` sobre su propio `*-soft`.

## Desarrollo y versiones

```sh
npm install        # trae las fuentes de origen (devDependencies)
npm run build      # regenera dist/, fonts/ y la tabla de este README
npm run check      # falla si algo generado no está al día con tokens.json
```

`dist/` y `fonts/` se commitean: así `npm install github:…` no necesita build.

Publicar una versión:

1. Editar `tokens/tokens.json` (nunca `dist/`).
2. `npm run build` y revisar el diff.
3. Subir `version` en `package.json` (semver: renombrar o quitar un token es **mayor**) y volver a correr `npm run build`.
4. `git commit`, `git tag vX.Y.Z`, `git push --follow-tags`.

## Tokens

<!-- tokens:start -->
<!-- Generado por scripts/build.mjs. No editar a mano. -->

### Color — paleta (igual en ambos temas)

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `brand-teal` | `#00968E` | `bg-brand-teal` | Acento de marca: íconos, rellenos, bordes de foco, logo. 3.65:1 sobre blanco: solo texto ≥24px (o ≥18.66px bold) y elementos no-texto. |
| `brand-teal-dark` | `#00766F` | `bg-brand-teal-dark` | Hover del acento y acento como texto sobre fondos claros (5.50:1 sobre blanco, 5.11:1 sobre brand-gray-50). |
| `brand-teal-light` | `#E6F5F3` | `bg-brand-teal-light` | Fondo suave del acento (chips, filas seleccionadas). El texto encima va en brand-dark o brand-teal-dark. |
| `brand-teal-bright` | `#00B2AC` | `bg-brand-teal-bright` | Teal luminoso del cubo del logo Surdat. Acento como texto en tema oscuro (6.24:1 sobre brand-dark). No usar como texto sobre fondos claros. |
| `brand-dark` | `#1B1F2A` | `bg-brand-dark` | Texto principal en tema claro y fondo de página en tema oscuro. |
| `brand-dark-soft` | `#2D3140` | `bg-brand-dark-soft` | Superficie elevada sobre brand-dark (tarjetas, paneles) y bordes en tema oscuro. |
| `brand-gray-50` | `#F4F7FA` | `bg-brand-gray-50` | Superficie clara: fondos de sección y tarjetas sobre blanco. Texto principal en tema oscuro. |
| `brand-gray-100` | `#E1E8F0` | `bg-brand-gray-100` | Bordes y divisores en tema claro; track de anillos y barras de progreso. |
| `brand-gray-300` | `#B8C2CC` | `bg-brand-gray-300` | Gris medio para estados deshabilitados y elementos decorativos. No es color de texto: 1.81:1 sobre blanco. |
| `brand-gray-500` | `#5D6978` | `bg-brand-gray-500` | Texto secundario accesible. Corrige a #8E9AA8: mismo tono, pasa AA sobre blanco (5.59:1), brand-gray-50 (5.20:1) y brand-gray-100 (4.53:1). |
| `brand-gray-500-legacy` | `#8E9AA8` | `bg-brand-gray-500-legacy` | Gris de marca original, solo por compatibilidad y como texto secundario en tema oscuro (5.75:1 sobre brand-dark). Sobre fondos claros falla AA (2.86:1 sobre blanco): no usar como texto ahí. |
| `brand-white` | `#FFFFFF` | `bg-brand-white` | Base: fondo de página en tema claro y texto sobre el acento. |
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
| `accent` | `#00968E` | `#00968E` | `bg-accent` | Relleno de botones primarios, íconos activos, anillos de foco. No-texto: ≥3.54:1 sobre canvas y surface en ambos temas. |
| `accent-strong` | `#00766F` | `#00B2AC` | `bg-accent-strong` | Acento como texto (enlaces) y hover del acento. ≥4.90:1 sobre canvas y surface en ambos temas. |
| `accent-soft` | `#E6F5F3` | `#17323A` | `bg-accent-soft` | Fondo suave del acento. Valor oscuro = brand-teal al 16% sobre brand-dark. El texto encima va en ink. |
| `on-accent` | `#FFFFFF` | `#FFFFFF` | `bg-on-accent` | Texto sobre accent. Solo 3.65:1: texto ≥18.66px bold o ≥24px. Para botones con texto chico, rellenar con accent-strong (5.50:1 en claro). |
| `danger-soft` | `#FDECEC` | `#3A2029` | `bg-danger-soft` | Fondo de alertas de error. Valor oscuro = danger al 16% sobre brand-dark. Texto encima en ink. |
| `warning-soft` | `#FEF3E2` | `#392D24` | `bg-warning-soft` | Fondo de alertas de advertencia. Valor oscuro = warning al 16% sobre brand-dark. Texto encima en ink (warning sobre warning-soft da 2.90:1). |

### Tipografía

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `font-sans` | `"Montserrat", "Helvetica Neue", Arial, sans-serif` | `font-sans` | Familia sans. |
| `font-display` | `"Montserrat", "Helvetica Neue", Arial, sans-serif` | `font-display` | Familia display. |
| `font-mono` | `"Geist Mono", ui-monospace, monospace` | `font-mono` | Familia mono. |
| `micro-11` | `11px` | `text-micro-11` | Rótulos de gráficos, metadatos de tablas densas. Compartido por symdat, lex y piatio. |
| `micro-10` | `10px` | `text-micro-10` | Rótulos mínimos (ejes, leyendas de anillos). Compartido por symdat, lex, IAnsurance y piatio. No usar para texto que se lee de corrido. |

### Forma y movimiento

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| `radius-card` | `14px` | `rounded-card` | Tarjetas y paneles (yolotengo --radius-card). |
| `shadow-card-hover` | `0 8px 24px -12px rgba(27, 31, 42, 0.25)` | `shadow-card-hover` | Elevación de una tarjeta en hover. Color base brand-dark. |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `ease-out-expo` | Curva de entrada para transiciones y animaciones de aparición (songal, yolotengo). |

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

<!-- tokens:end -->
