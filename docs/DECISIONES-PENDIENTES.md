# Decisiones pendientes — Surmetric Core

Registro de la Fase A, 2026-10-29. No se editó `tokens/tokens.json` ni ningún repo de aplicación.

**Fuentes**: `docs/INVENTARIO-DESIGN-TOKENS.md` (el inventario) y lecturas nuevas, de solo lectura, sobre **los mismos commits auditados** (`git show` / `git grep` contra el commit, sin tocar el working tree):

| Repo | Commit | De dónde se leyó |
|---|---|---|
| sitio-web-songal | `d85e38a` | clon local `CascadeProjects/surmetric-web` |
| symdat | `f2b5e2e` | clon local `CascadeProjects/symdat` |
| lex-semaforo | `a838a0b` | clon nuevo, sin checkout, en el scratchpad de la sesión (no había clon local) |
| IAnsurance | `cb9283b` | clon local `CascadeProjects/IAnsurance` |
| piatio | `c4ee412` | clon local `CascadeProjects/piatio` |
| yolotengo | `bbf0a5d` | clon local `CascadeProjects/yolohago` |

Los colores de los logos PNG, que el inventario dejó como "no determinados", se midieron ahora decodificando los PNG con un script propio (§10).

---

## Resolución (2026-10-29) — aplicada en v0.2.0

| # | Respuesta | Qué quedó |
|---|---|---|
| 1 | De acuerdo con la propuesta | `brand-gray-500-legacy` → `brand-gray-400` (`#8E9AA8`). `brand-gray-500` = `#5D6978`. La skill y la preferencia guardada se actualizan fuera del repo: ver `CHANGELOG.md`. |
| 2 | Crearlos | `action` / `action-hover` / `on-action`; `on-accent` deprecado |
| 3 | Opt-in | Se mantiene, marcado "sin consumidores" en el README |
| 8b | Pesos con tracking | `display`, `title-1`…`title-4` según la tabla de §8b. `eyebrow` aplicado en una segunda ronda (2026-10-29): 0.75rem / 1rem / 600 / 0.1em, con `uppercase text-ink-muted` en la receta. |
| 9 | 6px | `radius-button` = `radius-control` = 6px; `radius-pill` 9999px |
| 10 | No hay vectorial: armarlo | `logo/` con 6 SVG construidos sobre el raster de songal. Ver `docs/LOGO.md`. |
| 4-7, 8a, 11, 12 | Sin veto | Aplicadas como estaban propuestas |

Sobre §11, ahora verificado: el formato del tipo Design System (su `format.md`) no tiene familia de movimiento ("No motion family"). `easing` se queda en `tokens.json` porque el build la emite, pero la proyección en Claude puede no mostrarla.

El resto de este documento es el registro original de la Fase A, sin cambios.

---

## Qué necesito de ti antes de la Fase B

| # | Decisión | Mi recomendación | Quién decide |
|---|---|---|---|
| **1** | Gris secundario | `#8E9AA8` pasa a llamarse `brand-gray-400` (gris de identidad, no se usa para texto). `brand-gray-500` = `#5D6978` queda como texto secundario. Hay que actualizar la skill y la preferencia guardada. | **Tú** |
| **2** | Relleno del botón primario | Tokens nuevos `action` / `action-hover` / `on-action`. En claro: `#00766F` / `#1B1F2A` / `#FFFFFF` | **Tú** |
| **3** | Tema oscuro | Ninguna app lo tiene. Lo mantendría como opt-in marcado "sin consumidores" | **Tú** |
| **8b** | Peso y tracking de títulos | 900 / 900 / 800 / 700 / 700 con tracking −0.025 / −0.025 / −0.02 / −0.01 / 0 em | **Tú** |
| **9** | Forma del botón | 6px, igual que los inputs, en vez de pill | **Tú** |
| **10** | Logo | No hay ningún maestro vectorial. ¿Existe un archivo fuente? | **Tú** |
| 4 | Componentes en Core | No. Solo tokens y recetas | Cerrada por mí |
| 5 | Series de gráfico | No entran: Recharts lo usa un solo repo | Cerrada por mí |
| 6 | Set de íconos | No entra. Lucide queda como recomendación en la documentación | Cerrada por mí |
| 7 | Prefijo | Sin prefijo en los nombres de Tailwind; `--sm-` se mantiene en las variables crudas | Cerrada por mí |
| 8a | Escalas de tamaño y espaciado | Pasos de Tailwind con base 4px más `micro-10`/`micro-11` y el paso feo de 56px | Cerrada por mí |
| 11 | Easing | Se queda en `tokens.json`. El README ya lo muestra, porque se genera desde ahí | Cerrada por mí |
| 12 | Versionado | Semver con la regla "cambiar un valor es breaking". Orden de adopción: yolotengo → songal → IAnsurance → piatio → lex → symdat | Cerrada por mí (puedes reordenar) |

"Cerrada por mí" quiere decir que la Fase B la aplica tal cual salvo que la vetes.

### Tres supuestos del encargo que no calzan con el código

1. **Las variables CSS ya tienen namespace.** `dist/tokens.css` emite `--sm-color-accent`, `--sm-color-ink`, etc. Lo que no tiene prefijo son los nombres del tema de Tailwind (`--color-accent` en el `@theme` de v4, `colors.accent` en el preset de v3) y, con ellos, las clases (`bg-accent`, `text-ink`). Ver §7.
2. **symdat no es Next.js.** Es Create React App (`react-scripts` 5.0.1) con React 18. Ver §4.
3. **Recharts no está en "varios repos".** Está solo en symdat. Ver §5.

---

## 1. El gris secundario `#8E9AA8`

**Quién decide: tú.**

### Usos reales por repo (producción, commits auditados)

| Repo | Dónde se define | Usos como texto | Usos no-texto | Qué toca la migración |
|---|---|---|---|---|
| sitio-web-songal | `--color-brand-gray-500: #8e9aa8` (`app/globals.css:13`) | **8** `text-brand-gray-500`, incluido el `h1` del hero "No al revés." (`components/Hero.tsx:23`) | 0 | 1 línea: borrar la definición local y heredar la de Core. Las 8 clases no cambian. |
| IAnsurance | `--color-surmetric-gray-500` (`web/app/globals.css:13`) | **20** `text-surmetric-gray-500` | 0 | 1 línea (cambiar el valor), o 20 clases si además se renombra a `brand-gray-500` |
| piatio | `brand.gray-500` (`apps/web/tailwind.config.ts:17`) y `--brand-gray-500` (`src/app/globals.css:14`) | **74**: 63 `text-brand-gray-500` + 11 `color:#8E9AA8` inline en los popups de Leaflet (`components/YardEditor.tsx`) | **1**: `fillColor: '#8E9AA8'`, capa "planta nueva" del mapa (`YardEditor.tsx:320`) | 2 definiciones + 11 literales inline. **El `fillColor` no debe cambiar**: es color de dominio. |
| yolotengo | `--color-muted` (`apps/web/src/app/theme.css:17`) | **80**: 78 `text-muted` + 1 `placeholder:text-muted` + `.eyebrow` (`globals.css:30`) | 0 | 1 línea, o 80 sitios si se renombra `muted` → `ink-muted` |
| symdat | — | **1**: `text-[#8E9AA8]` (`components/SurmetricFooter.js:7`) | **6** rellenos dentro de los 3 SVG del logo Surdat (`public/favicon.svg`, `src/assets/surdat-lockup.svg`, `surdat-lockup-navbar.svg`, 2 caras del cubo por archivo) | 1 literal. Los SVG no se tocan. |
| lex-semaforo | — (usa `muted: #5A6B7B`) | 0 | 0 | Nada |
| **Total** | | **183** | **7** | |

El inventario daba 182 porque no contaba la regla `.eyebrow` de yolotengo, que es CSS y no una clase.

Fuera de los repos:
- **La skill `surmetric-branding`** declara `brand-gray-500 = #8E9AA8` para "Texto secundario, placeholders, bordes, metadatos" (`SKILL.md:30`), y su estilo "Small/meta" usa ese mismo gris (`SKILL.md:67`).
- **Los logos PNG de songal**: las caras grises del cubo miden ≈`#8898AA` y ≈`#AFBDCB` (raster con antialiasing, no son valores exactos; ver §10). En el SVG de Surdat son exactamente `#8E9AA8` y `#B8C2CC`. **`#8E9AA8` es un color del logo.**

### Qué significa migrar

Si cada app hereda `brand-gray-500` de Core, los 183 usos como texto pasan de `#8E9AA8` a `#5D6978` sin cambiar ninguna clase. Solo cambian las líneas de definición, más 12 literales inline (11 de piatio y 1 de symdat). El efecto visual es real: el texto secundario se oscurece bastante (luminancia de 0.317 a 0.107; contraste sobre blanco de 2.86:1 a 5.59:1). La jerarquía frente a `ink` (16.46:1) se mantiene.

El `h1` gris del hero de songal no puede quedar como excepción por ser texto grande: `#8E9AA8` da 2.86:1 y el mínimo para texto grande es 3:1.

### Recomendación: cómo queda la marca declarada

Dos grises con dos roles, ninguno "legacy":

| Token | Valor | Rol |
|---|---|---|
| `brand-gray-400` (hoy `brand-gray-500-legacy`) | `#8E9AA8` | **Gris de identidad**: caras del isotipo, ilustración, elementos decorativos. Texto secundario solo sobre fondos oscuros (5.75:1 sobre `#1B1F2A`). No es texto sobre fondos claros, y tampoco sirve como borde de un control: da 2.86:1 y los componentes de UI necesitan 3:1. |
| `brand-gray-500` | `#5D6978` | **Texto secundario** sobre fondos claros: metadatos, ayudas, placeholders. |

La escala queda monótona: 50 `#F4F7FA` → 100 `#E1E8F0` → 300 `#B8C2CC` → 400 `#8E9AA8` → 500 `#5D6978`.

Al aceptar esto hay que cambiar también: `SKILL.md:30` y `:67`, y `assets/palette.json` de la skill, y tu preferencia guardada en Claude ("el secundario es `#8E9AA8`" pasa a "el gris de identidad es `#8E9AA8`; el texto secundario es `#5D6978`").

### Qué cuesta el otro camino

- **Mantener `#8E9AA8` como el secundario canónico** deja la situación de hoy: 183 textos que fallan AA, y cada app tiene que recordar no usar el gris "oficial" para texto. Es el problema que Core vino a cerrar.
- **Mantener el nombre `brand-gray-500-legacy`** evita un renombre (breaking), pero llama "legacy" a un color que sigue vivo en el logo. Hoy el renombre es gratis: ningún `package.json` auditado depende de `surmetric-tokens`.

---

## 2. El token de relleno del botón primario

**Quién decide: tú.**

### Qué usa cada repo hoy

| Repo | Relleno del primario | Hover | Texto | ¿Pasa AA? |
|---|---|---|---|---|
| sitio-web-songal | `bg-brand-teal` **y** `bg-brand-dark`, según el CTA | intercambian: teal → dark y dark → teal | `text-sm` / `text-base`, blanco | teal: **no** (3.65:1); dark: sí |
| yolotengo | **`bg-ink`** (`#1B1F2A`): el primario no es teal (`components/ui.tsx:7`) | `hover:bg-accent-strong` (`#007A73`) | `text-sm` 600, blanco | sí (16.46:1) |
| IAnsurance | `bg-surmetric-teal` (`#00968E`) | `hover:bg-surmetric-teal-dark` (`#00766F`) | `text-xs`, blanco | **no** (3.65:1) |
| piatio | `bg-brand-teal` en `text-xs`, `text-sm`, `text-[11px]` y `text-[10px]`; 8 botones inline `#00968E` con `font-size:12px` en `YardEditor.tsx` | `hover:bg-brand-teal-dark` o `-light` | blanco | **no** (3.65:1) |
| lex-semaforo | `.btn-primary` = `bg-navy` (`#142F4C`) (`app/globals.css:52-53`) | `bg-navy-hover` | blanco | sí (13.63:1). Identidad propia (C1). |
| symdat | `bg-blue-600` | `hover:bg-blue-700` | blanco | sí |

Contraste del texto del botón (WCAG, calculado):

| Texto sobre relleno | Ratio | Texto normal (4.5:1) |
|---|---|---|
| `#FFFFFF` sobre `#00968E` (accent) | 3.65:1 | No |
| `#FFFFFF` sobre `#00766F` (brand-teal-dark) | 5.50:1 | Sí |
| `#FFFFFF` sobre `#1B1F2A` (brand-dark) | 16.46:1 | Sí |
| `#FFFFFF` sobre `#00B2AC` (brand-teal-bright) | 2.64:1 | No |
| `#1B1F2A` sobre `#00B2AC` | 6.24:1 | Sí |
| `#1B1F2A` sobre `#00968E` | 4.51:1 | Sí (al límite) |

### Recomendación

Tres tokens semánticos nuevos para que ninguna app tenga que elegir:

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `action` | `{brand-teal-dark}` `#00766F` | `{brand-teal-bright}` `#00B2AC` | Relleno del botón primario |
| `action-hover` | `{brand-dark}` `#1B1F2A` | `{brand-teal}` `#00968E` | Hover / pressed del primario |
| `on-action` | `{brand-white}` `#FFFFFF` | `{brand-dark}` `#1B1F2A` | Texto e ícono sobre `action` y `action-hover` |

- En claro, el texto del botón da 5.50:1 en reposo y 16.46:1 en hover. En oscuro, 6.24:1 y 4.51:1. El build agregaría estos cuatro pares a la verificación de contraste.
- Se mantiene la identidad: el botón sigue siendo teal.
- El hover a `brand-dark` es el patrón que ya usan songal (teal ↔ dark) y yolotengo (dark ↔ teal). En la paleta no hay un teal más oscuro que `#00766F`, y crear uno sería inventar un color de marca.
- `accent` (`#00968E`) queda para lo que no es texto: anillos de foco, íconos activos, bordes de selección.
- `on-accent` quedaría deprecado, porque induce a poner texto chico sobre `accent`. Se quitaría en la siguiente versión breaking.

Costo de migrar: yolotengo cambia 1 línea (`variants.primary` en `ui.tsx:7`); songal, 2 o 3 CTAs; IAnsurance, el par fill/hover; piatio, los botones con `bg-brand-teal` (~12 líneas encontradas) y los 8 inline.

### Qué cuesta el otro camino

- **`accent` como relleno**: obliga a que todo botón primario lleve texto ≥18.66px en bold. Ningún repo tiene botones de ese tamaño (son `text-xs` y `text-sm`). En la práctica, falla AA en todas partes.
- **`ink` como relleno (lo que hace yolotengo)**: pasa con holgura, pero el color de acción deja de ser el de marca y se confunde con el del texto. Además, tres de las cuatro apps con marca teal tendrían que cambiar de color sus botones.
- **No decidir**: cada app elige distinto. Ya pasa hoy: hay cuatro respuestas diferentes en seis repos.

---

## 3. Tema oscuro: ¿real o especulativo?

**Quién decide: tú.**

| Repo | Dark mode en producción | Evidencia |
|---|---|---|
| sitio-web-songal | **No** | Ni `dark:`, ni `prefers-color-scheme`, ni `data-theme` en `app/` |
| symdat | **No** (hay código muerto) | `src/index.css:38-287` define `body.bg-gray-900 …` y `components/ThemeSelector.js` lo activa, pero ningún archivo importa `ThemeSelector` (re-verificado con `git grep`: el único archivo que lo nombra es él mismo) |
| lex-semaforo | **No, y lo declara**: `color-scheme: light` (`app/globals.css:6`) | |
| IAnsurance | **No** | Sin señales |
| piatio | **No en la app** | Solo un documento HTML (`docs/guia-cabezal-zona1-casa-black.html:18-33`) tiene paleta oscura con `prefers-color-scheme` + `data-theme`. No es producción. |
| yolotengo | **No** | Sin señales |

**0 de 6.** El tema oscuro de Core es especulativo.

### Recomendación

Mantener los valores oscuros en `tokens.json` (ya están verificados por el build y son opt-in: no cambian nada en una app que no los active), pero:
- marcarlos en el README y en la proyección del sistema de diseño en Claude como **"sin consumidores"**, para que nadie lo lea como un tema soportado;
- no frenar decisiones por el tema oscuro: un token nuevo lleva valor oscuro solo si sale de la paleta existente, como `action` en §2.

### Qué cuesta el otro camino

- **Quitar el tema oscuro**: `tokens.json` se simplifica (los 11 semánticos pasan a tener un solo valor), la tabla de contraste del README queda a la mitad, y la proyección en Claude deja de mostrar un tema que nadie usa. El costo es rediseñarlo si algún día una app lo pide; los valores quedan en el historial de git.
- **Tratarlo como real**: cada token nuevo exige valor oscuro y verificación, por un tema que ninguna app activa.

---

## 4. ¿Core lleva componentes?

**Cerrada por mí: no. Solo tokens, más recetas en el README.**

| Repo | Framework | React | Tailwind (rango → lock) |
|---|---|---|---|
| sitio-web-songal | Next 16.2.2 | 19.2.4 | `^4` → 4.2.2 |
| symdat | **Create React App** (`react-scripts` 5.0.1) | `^18.2.0` | `^3.3.0` → 3.4.19 |
| lex-semaforo | Next `^16.2.10` | 19.0.0 | `^3.4.17` → 3.4.19 |
| IAnsurance | Next `^15.1.0` | `^19.0.0` | `^4.0.0` → 4.2.4 |
| piatio | Next `^14.2.5` | `^18.3.1` | `^3.4.10` → 3.4.19 |
| yolotengo | Next `^16.3.6` | `^19.3.0` | `^4.3.3` → 4.3.3 |

- Hay dos majors de React (18 y 19), dos de Tailwind (3 y 4) y un repo que no es Next.
- **Ningún repo usa librería de componentes** (radix, shadcn, cva, clsx, tailwind-merge: cero en los seis `package.json`).
- Lo más parecido a componentes propios: `yolotengo/apps/web/src/components/ui.tsx` (Button, Card, Badge, Input, Alert…), `.btn` / `.card` / `.eyebrow` en `lex/app/globals.css:49-63`, y clases `@apply` en `symdat/src/index.css`.

**Qué hace Core en su lugar**: tokens de componente (`action`, `radius-button`, `radius-control`, `radius-pill`) y una sección "Recetas" en el README con la cadena de clases de botón primario/secundario, input, chip y tarjeta. Cada app copia la receta en su propio Button.

**Qué cuesta ir por componentes**: un paquete React tendría que soportar React 18 y 19 como peer; Tailwind 3 (agregar la ruta del paquete a `content`) y 4 (`@source`); y CRA, que no transpila dependencias, así que habría que publicar JS compilado. Eso exige bundler, tests y su propio ciclo de versiones: es un segundo producto. **Reabrir cuando haya ≥3 apps adoptando Core con el mismo major de Tailwind.**

---

## 5. Colores de series de gráfico

**Cerrada por mí: no entran a Core.**

| Repo | Gráficos | Librería |
|---|---|---|
| symdat | Sí, muchos | **`recharts ^2.7.2`** (lock 2.15.4) |
| lex-semaforo | Un anillo de score dibujado a mano (`components/informe/ScoreCircle.tsx:19`) | Ninguna |
| IAnsurance | El mismo anillo, también a mano (`web/app/page.tsx:309-329`) | Ninguna |
| piatio | Mapas (Leaflet), no gráficos | — |
| sitio-web-songal, yolotengo | No | — |

**Recharts está en 1 repo de 6.** No cumple ningún criterio de "compartido". Las ≥8 paletas de series de symdat (inventario §8) son limpieza interna de Surdat.

Lo que un gráfico necesita de Core ya existe: grilla y track en `border` (`#E1E8F0`), rótulos de ejes en `micro-10`/`micro-11` con `ink-muted`, tooltip en `surface` con `shadow-card-hover`.

Candidato a futuro, pero como componente y no como token: el anillo de score está duplicado en lex e IAnsurance con la misma geometría y deriva en color y tipografía (inventario D6).

---

## 6. Set de íconos

**Cerrada por mí: Core no lleva íconos. Queda una recomendación en la documentación.**

| Repo | Qué usa |
|---|---|
| sitio-web-songal | 12 SVG inline en 6 archivos. Íconos de línea dibujados a mano (`stroke="currentColor"`, `strokeWidth="1.5"`, viewBox 40/28/24) en `Services.tsx`, `ValueProps.tsx`, `Portfolio.tsx` y `Header.tsx`, más el glifo de WhatsApp (`Contact.tsx:102`, `WhatsAppFloating.tsx:39`) |
| symdat | **`lucide-react ^0.263.1`** (lock 0.263.1), importado en 39 archivos. Además, 9 SVG inline: 2 logos, 4 chevrons de dropdown, 1 spinner y 2 sparklines (`VentasNewDashboard.js:60,79`) |
| lex-semaforo | Ningún ícono (su único SVG es el anillo de score) |
| IAnsurance | Ningún ícono (su único SVG es el anillo de score) |
| piatio | Ningún ícono propio. Los controles del mapa vienen de `leaflet-geoman` |
| yolotengo | Ninguno |

Un solo repo usa una librería de íconos, así que no hay nada compartido que meter a Core. Recomendación para código nuevo, solo en el README: **Lucide** (es la que ya está en uso), con `strokeWidth={1.5}` para calzar con los íconos de línea de songal. Eso último es una preferencia de estilo y se puede quitar.

---

## 7. Prefijo de los tokens

**Cerrada por mí: sin prefijo en los nombres de Tailwind; `--sm-` se mantiene en las variables crudas.**

### Qué tiene prefijo hoy y qué no

- `dist/tokens.css`: **todo con `--sm-`** (`--sm-color-accent`, `--sm-radius-card`…).
- `dist/theme.css` (Tailwind 4): `@theme { --color-accent: …; --radius-card: … }`, con los semánticos puenteados a `var(--sm-color-*)`. Sin prefijo, porque así Tailwind genera `bg-accent`.
- `dist/tailwind.js` (Tailwind 3): `colors.accent`, `borderRadius.card`… También sin prefijo.

### Colisiones reales (commits auditados)

| Repo | Nombres que ya define y que Core también define | Diferencias de valor |
|---|---|---|
| yolotengo | `--color-ink`, `accent`, `accent-strong`, `accent-soft`, `surface`, `danger`, `danger-soft`, `warning`, `warning-soft`, `--radius-card`, `--ease-out-expo`, `--font-sans`, `--font-mono` (`theme.css:8-25`) | Iguales: `ink`, `accent`, `surface`, `radius-card`, `ease-out-expo`. **Distintas**: `accent-strong` `#007A73`≠`#00766F`, `accent-soft` `#E0F2F1`≠`#E6F5F3`, `danger` `#B42318`≠`#DC2626`, `danger-soft` `#FDECEA`≠`#FDECEC`, `warning` `#8A5A00`≠`#D97706`, `warning-soft` `#FFF4E0`≠`#FEF3E2`, `font-sans` "Montserrat Variable"≠"Montserrat" |
| sitio-web-songal | 10 `--color-brand-*` y `--font-sans/display/mono` (`globals.css:5-19`) | `brand-gray-500` `#8E9AA8`≠`#5D6978`. Las fuentes vienen de variables de `next/font`. |
| piatio | TW3 `brand.*` (7 nombres, `tailwind.config.ts:11-18`) y `fontFamily.sans/display/mono` | `gray-500` distinto; fuentes Inter≠Montserrat |
| lex-semaforo | TW3 `colors.ink` y `fontFamily.sans` | `ink` `#0E1F33`≠`#1B1F2A` (C1) |
| IAnsurance | `--font-sans/display/mono` (sus colores son `surmetric-*`) | Inter≠Montserrat |
| symdat | Ninguno (`extend: {}`) | — |

**Dependencias de terceros**: ninguna de las seis apps tiene un kit de UI ni una librería de theming. Las que traen CSS propio (leaflet, leaflet-geoman, recharts) usan clases con su propio prefijo (`.leaflet-*`, `.recharts-*`). No revisé `node_modules` porque no hay dependencias instaladas, así que no puedo descartar al 100% que alguna defina `--accent` global; nada en sus nombres lo sugiere.

**El riesgo real no es la colisión con dependencias: es la sobreescritura silenciosa con el tema propio de cada app.** En Tailwind 4 gana el `@theme` que se importa último; en Tailwind 3, el `extend` de la app le gana al preset. Ejemplo: si lex adopta el preset sin borrar su `ink`, sigue con `#0E1F33` sin ningún aviso.

### Por qué no prefijar

Con un prefijo, las clases pasan a `bg-sm-accent` / `text-sm-ink`. Eso obliga a tocar todas las clases de todas las apps, incluido yolotengo, que ya usa exactamente estos nombres. A cambio protege contra un riesgo que no se observa.

**Regla de adopción** (va al README en la Fase B): el mismo PR que instala Core borra las definiciones locales con los nombres de la tabla de arriba.

---

## 8. Escala tipográfica y escala de espaciado

### 8a. Tamaños — cerrada por mí

**Decisión de diseño**: los pasos de Core son los de Tailwind entre 12px y 60px, más los dos micro que ya existen. Una escala modular de razón 1.25 desde 16px (12.8 / 20 / 25 / 31.25 / 39) solo coincide con lo existente en 20px y movería unos 1,900 usos. **Los pasos feos que se conservan**: 11px (entre 10 y 12), 18px y 30px (rompen cualquier razón entre 16 y 24, y entre 24 y 36).

Conteo: clases de tamaño por repo (inventario, alcance producción) más valores inline y CSS que caen en cada paso.

| Token Core | Valor | Interlineado | Colapsan (clases: songal / symdat / lex / IAnsurance / piatio / yolotengo) | Inline y CSS que caen aquí |
|---|---|---|---|---|
| `micro-10` | 10px | hereda (como hoy) | `text-[10px]` 0 / 33 / 1 / 1 / 4 / 0 = **39** | inline 10: symdat ×15, piatio ×8. **Se mueven +1px**: `text-[9px]` symdat ×3 e inline 9 symdat ×8 |
| `micro-11` | 11px | hereda | `text-[11px]` 0 / 57 / 7 / 0 / 4 / 0 = **68** | inline 11: symdat ×33, piatio ×3, correo de lex ×1 |
| `xs` | 0.75rem (12px) | 1rem (16px) | 1 / 482 / 59 / 11 / 63 / 52 = **668** | inline 12: symdat ×26, piatio ×21, correo de lex ×3; `.marker-num` de songal (0.75rem). **Se mueve +0.48px**: `.eyebrow` de yolotengo (0.72rem) |
| `sm` | 0.875rem (14px) | 1.25rem | 13 / 462 / 133 / 21 / 32 / 84 = **745** | correo de lex 14 ×2. **Se mueve −0.4px**: tabla de IAnsurance 0.9rem (`globals.css:63`) |
| `base` | 1rem (16px) | 1.5rem | 5 / 8 / 6 / 0 / 3 / 7 = **29** | inline 16: piatio ×2. **Se mueve −0.8px**: `.prose-report h3` de IAnsurance 1.05rem (`globals.css:39`) |
| `lg` | 1.125rem (18px) | 1.75rem | 5 / 121 / 10 / 3 / 1 / 5 = **145** | `body { font-size: 18px }` de symdat (`index.css:23`); correo de lex 18 mono |
| `xl` | 1.25rem (20px) | 1.75rem | 7 / 29 / 6 / 1 / 0 / 5 = **48** | `.prose-report h2` de IAnsurance 1.25rem, exacto |
| `2xl` | 1.5rem (24px) | 2rem | 3 / 47 / 19 / 3 / 7 / 6 = **85** | — |
| `3xl` | 1.875rem (30px) | 2.25rem | 2 / 14 / 13 / 1 / 0 / 9 = **39** | correo de lex 30 mono |
| `4xl` | 2.25rem (36px) | 2.5rem | 7 / 6 / 1 / 2 / 1 / 4 = **21** | — |
| `5xl` | 3rem (48px) | 1 | 7 / 2 / 1 / 2 / 1 / 0 = **13** | — |
| `6xl` | 3.75rem (60px) | 1 | 4 / 0 / 0 / 0 / 0 / 1 = **5** | — |

**No colapsan en ningún paso:**
- **13px**: correo de lex ×4 (`lib/correo/plantillas.ts:59,64,96,121`) y piatio inline ×1. El correo es HTML de email, sin variables CSS, así que queda fuera de Core por diseño. El uso de piatio lo decide quien migre (12 o 14). La skill de branding declara "Small/meta 13px" (`SKILL.md:67`): se tendría que corregir a 12px o 14px.
- **72px y 96px**: solo el hero de songal (`lg:text-7xl` ×1, `xl:text-8xl` ×1). Siguen funcionando con el tema por defecto de Tailwind, fuera de Core.
- **15px**: solo el doc HTML de piatio, que no es producción.

**Resultado**: de 1,910 usos de tamaño por clase, **1,905 caen exactos** en un paso de Core. Mover los 3 de `9px` toca una sola app (symdat).

**Cómo se emite** (Fase B): los pasos de `xs` a `6xl` en **rem** con el interlineado por defecto de Tailwind, es decir, los mismos valores, así que no hay ningún cambio de render ni de escalado con la fuente del navegador. Los micro siguen en **px** y **sin interlineado**: hoy heredan el del contenedor en 107 sitios, y fijar uno movería layouts. Las clases quedan igual (`text-sm`, `text-micro-11`).

### 8b. Títulos en Montserrat — necesita tu respuesta (peso y tracking)

**Tracking que usa hoy cada repo:**

| Repo | Tracking en títulos | Peso en títulos |
|---|---|---|
| sitio-web-songal | `tracking-tight` (−0.025em) ×7, todos en titulares `font-display` (`Hero.tsx:18`, `Contact.tsx:23`, `Portfolio.tsx:89`, `privacidad/page.tsx:15`…) | No fija ninguno: se renderiza en 600 (inferido, inventario §2) |
| yolotengo | `h1, h2, h3 { letter-spacing: -0.02em }` (`globals.css:13-17`); `tracking-tight` solo en el logo (`business-logo.tsx:31`, `site-chrome.tsx:15`) | `font-black` (900) ×12, `font-extrabold` (800) ×9 |
| IAnsurance | `tracking-tight` ×2: texto del logo (`layout.tsx:27`) y hero (`page.tsx:93`) | 700 en Inter Tight |
| lex-semaforo | `tracking-tight` ×1, solo en el logo (`Logo.tsx:15`); los títulos serif van sin tracking | 700 serif |
| piatio | Ninguno en títulos (`tracking-wider`/`-widest` solo en rótulos mono) | 600 (Inter Tight, que no se carga) |
| symdat | Ninguno en títulos (`tracking-wider`/`-wide` en rótulos) | 900 / 700 con fuente de sistema |
| Skill `surmetric-branding` | Hero −0.03em, H2 −0.02em, H3 −0.01em (`SKILL.md:62-64`) | 900 / 800 / 700; "en UI densa no pasar de 700" (`:69-70`). **No está implementado en ningún repo.** |

**Propuesta: roles compuestos, opt-in.** No reemplazan los tamaños: un `text-2xl` sigue siendo un `text-2xl`.

| Rol | Tamaño / interlineado | Peso | Tracking | Qué colapsa | Qué cambia |
|---|---|---|---|---|---|
| `display` | 3rem / 1.05 | 900 | −0.025em | Hero de songal (`leading-[1.05] tracking-tight`, ×4), hero de yolotengo (`leading-[1.05] font-black`). El tamaño responsive (48→96px) sigue siendo de cada app. | `leading-[1.1]` de songal ×2 y lex ×1 → 1.05 (≈2px por línea a 48px). Songal pasa de 600 inferido a 900. |
| `title-1` | 1.875rem / 2.25rem (30/36) | 900 | −0.025em | yolotengo `text-3xl font-black` ×6 (+3 con `sm:text-4xl`) | symdat `text-3xl font-bold` ×12 → 900 |
| `title-2` | 1.5rem / 2rem (24/32) | 800 | −0.02em | yolotengo `text-2xl font-extrabold` ×2. −0.02em es el valor actual de yolotengo y el H2 de la skill | yolotengo `text-2xl font-bold` ×3 → 800 |
| `title-3` | 1.25rem / 1.75rem (20/28) | 700 | −0.01em | IAnsurance `text-xl font-bold font-display` ×1, lex `text-xl font-bold font-serif` ×4, symdat `text-xl font-bold` ×10 | yolotengo `text-xl font-extrabold` ×3 → 700 (regla de la skill: UI ≤700) |
| `title-4` | 1.125rem / 1.75rem (18/28) | 700 | 0 | symdat `text-lg font-bold` ×35, lex `text-lg font-bold font-serif` ×4, yolotengo `text-lg font-bold` ×1 | symdat `text-lg font-semibold` ×44 y `font-black` ×39, yolotengo `text-lg font-extrabold` ×2 |
| `eyebrow` (opcional) | 0.75rem / 1rem, mayúsculas | 600 | 0.1em | Skill (12-13 / 600 / 0.1em) | lex `.eyebrow` 0.14em → 0.1em; yolotengo `.eyebrow` 0.72rem/700 → 12px/600. Quedan fuera por ser otro rol: `.metric-label` y `.kpi-title` de symdat (14px, 0.05em) y `.marker-num` mono de songal |

- Uso −0.025em y no el −0.03em de la skill porque −0.025em ya es una clase de Tailwind (`tracking-tight`) y está en 4 repos. −0.03em no está en ninguno.
- La diferencia entre −0.02em (yolotengo hoy) y −0.025em es de 0.18px a 36px: invisible. Por eso no la uso para separar roles.

**Lo que necesito que confirmes**: los pesos 900 / 900 / 800 / 700 / 700 y el tracking escalonado. Son voz de marca. Si prefieres lo literal de la skill (−0.03em en display), es un cambio de un valor.

### 8c. Espaciado — cerrada por mí

**Decisión de diseño**: base **4px** (0.25rem), que es la de todos los repos (Tailwind por defecto). Core no inventa nombres nuevos: cualquier escala con nombre propio (`space-sm`, `space-md`…) obligaría a reescribir 4,511 clases. Lo que define Core es **qué múltiplos son pasos oficiales**.

Usos por paso (clases de padding, margin, gap, space e inset; sin `0` ni `auto`):

| Paso | px | songal | symdat | lex | IAns | piatio | yolo | Total |
|---|---|---|---|---|---|---|---|---|
| 0.5 | 2 | 1 | 53 | 13 | 3 | 2 | 4 | 76 |
| 1 | 4 | 12 | 356 | 36 | 7 | 40 | 25 | 476 |
| 1.5 | 6 | 4 | 166 | 20 | 2 | 20 | 14 | 226 |
| 2 | 8 | 16 | 1031 | 107 | 29 | 110 | 46 | 1339 |
| 2.5 | 10 | 2 | 7 | 12 | 3 | 4 | 4 | 32 |
| 3 | 12 | 20 | 583 | 142 | 13 | 72 | 108 | 938 |
| 4 | 16 | 21 | 408 | 78 | 14 | 19 | 119 | 659 |
| 5 | 20 | 13 | 28 | 57 | 6 | 1 | 22 | 127 |
| 6 | 24 | 28 | 261 | 50 | 21 | 4 | 30 | 394 |
| 8 | 32 | 24 | 45 | 30 | 0 | 2 | 12 | 113 |
| 10 | 40 | 6 | 2 | 9 | 1 | 9 | 13 | 40 |
| 12 | 48 | 6 | 4 | 15 | 3 | 2 | 2 | 32 |
| **14** | **56** | 2 | 0 | 1 | 0 | 0 | 3 | **6** — el paso feo: entre 48 y 64, pero está en 3 repos |
| 16 | 64 | 8 | 0 | 11 | 1 | 0 | 0 | 20 |
| 20 | 80 | 7 | 0 | 1 | 0 | 0 | 0 | 8 |
| 24 | 96 | 7 | 0 | 2 | 0 | 1 | 1 | 11 |
| 32 | 128 | 8 | 0 | 1 | 0 | 0 | 0 | 9 |

Los correos de lex (32 / 16 / `12px 20px`) y el inline `4px 8px` ×9 de piatio también caen en la escala.

**No colapsan:**
- `3.5` (14px): yolotengo `px-3.5` ×1 (input, `ui.tsx:69`).
- `7` (28px): songal `px-7` ×2, symdat `pl-7` ×1.
- `40` (160px): songal `lg:pt-40` ×1.
- Arbitrarios: symdat `gap-[2px]` ×1 y `ml-[7.75rem]` ×1; lex `p-[5px]` ×1, `-left-[5px]` ×1 y `gap-px` ×1.
- Inline: piatio `padding: 3px 6px` ×16 (3px queda fuera de la base 4).

**Resultado**: 4,506 de 4,511 clases numéricas caen en un paso, más 5 arbitrarias y 16 inline fuera.

**Cómo se emite** (Fase B): en Tailwind 4, `--spacing: 0.25rem` (igual al valor por defecto, así que no cambia nada). En Tailwind 3 no se toca la escala: reemplazarla rompería las clases fuera de escala. En `tokens.css`, una variable por paso para quien no use Tailwind. Los nombres no pueden llevar punto (`--sm-space-0.5` es inválido sin escape), así que propongo `space-0_5`, `space-1_5`, `space-2_5`. Las clases fuera de escala se tratan en revisión de código, no las bloquea el build.

---

## 9. Radios

**Cerrada por mí, salvo la forma del botón, que decides tú.**

Evidencia (clases `rounded-*` en `<button>` / `<input>` / chips y en las clases CSS de componente):

| Repo | Botones | Inputs | Chips / badges | Tarjetas |
|---|---|---|---|---|
| sitio-web-songal | `rounded-full` (CTAs) | no tiene formularios | `rounded-full` ×1 | `rounded-2xl` / `rounded-xl` |
| symdat | mezcla: `rounded-lg` ×13, `rounded` ×13, `rounded-md` ×7 | `rounded` ×11, `rounded-lg` ×8, `rounded-md` ×5 | `rounded-full` ×44 (incluye `.status-badge`, `index.css:418`); rectangulares ×8 | `rounded-xl` (12px), `.glass-card` 16px |
| lex-semaforo | `.btn` `rounded-md` (`globals.css:50`) | `rounded-md` ×10 | `rounded-full` ×7; rectangulares ×2 | `.card` `rounded-lg` |
| IAnsurance | `rounded-md` y `rounded` | 1 input, sin radio detectado | rectangulares ×2 | `rounded-lg` / `rounded-xl` |
| piatio | `rounded-md` (6px), más `border-radius: 6px` inline ×9 | `rounded-md` ×4 | rectangular ×1 | — |
| yolotengo | `rounded-full` (`buttonClass`, `ui.tsx:14`) | `rounded-xl` (`ui.tsx:69`) | `rounded-full` ×10 (`Badge`, `ui.tsx:64`) | `--radius-card` 14px |

**Propuesta:**

| Token | Valor | Colapsan | Se mueven |
|---|---|---|---|
| `radius-control` (input, select, textarea) | **6px** | lex ×10, piatio ×4, symdat `rounded-md` ×5 | symdat `rounded` (4px) ×11 y `rounded-lg` (8px) ×8; yolotengo `rounded-xl` (12px), 1 línea en `ui.tsx:69` |
| `radius-button` | **6px** (recomendado) o **9999px** (pill) | Con 6px: piatio, lex `.btn`, IAnsurance, parte de symdat. Con pill: songal, yolotengo. | Con 6px: yolotengo 1 línea (`ui.tsx:14`) y songal ~3 CTAs. Con pill: piatio (≥12 líneas), lex `.btn`, IAnsurance (≥3) y ~30 botones de symdat. |
| `radius-pill` (chips, badges, avatares, toggles) | **9999px** | Chips `rounded-full`: symdat ×44, yolotengo ×10, lex ×7, songal ×1 | 13 chips rectangulares (symdat 8, lex 2, IAnsurance 2, piatio 1) |
| `radius-card` | 14px (ya existe) | — | — |

**Chip y pill son lo mismo en la evidencia**: el 82% de los chips ya es `rounded-full`. Propongo un solo token, `radius-pill`, y documentar que el chip lo usa. Si quieres los dos nombres, `radius-chip` sería un alias con el mismo valor.

**Botón: tu decisión.** Recomiendo **6px**:
- es la migración más corta (unas 4 líneas contra decenas);
- en un formulario, botón e input quedan con la misma forma.

El argumento a favor de pill es de marca: es la forma de las dos apps más nuevas (songal y yolotengo), que también son las que ya usan Montserrat.

---

## 10. Logo

**Quién decide: tú.** Solo inventario. No se dibujó ni se reconstruyó nada.

### Archivos en `sitio-web-songal/public/` (commit `d85e38a`)

Medido sobre los archivos: dimensiones del encabezado PNG y colores contando los píxeles opacos.

| Archivo | Formato | Tamaño | Bytes | Fondo | Variante | ¿Se usa en el código? |
|---|---|---|---|---|---|---|
| `logo-lockup-full.png` | PNG RGBA | 1857×280 | 178,338 | transparente | Isotipo a color + wordmark oscuro | Sí: `Header.tsx:36` y JSON-LD `layout.tsx:74` |
| `logo-lockup-white.png` | PNG RGBA | 1857×280 | 161,627 | transparente | Wordmark blanco; isotipo a color con contorno blanco | Sí: `Footer.tsx:18` |
| `logo-lockup-mono.png` | PNG RGBA | 700×168 | 47,105 | **blanco opaco** (76.4% de los píxeles) | Escala de grises | No |
| `logo-isotipo.png` | PNG RGBA | 184×168 | 21,950 | **blanco opaco** (68.9%) | Isotipo a color | No |
| `logo-isotipo-white.png` | PNG RGBA | 184×168 | 17,309 | **blanco opaco** | Isotipo claro | No |
| `favicon.ico` | ICO, 1 imagen | — | 562 | — | — | Sí: `layout.tsx:43` |
| `favicon-16x16.png` / `favicon-32x32.png` | PNG RGBA | 16×16 / 32×32 | 540 / 1,612 | — | — | Sí: `layout.tsx:44-45` |
| `apple-touch-icon.png` | PNG RGBA | 180×180 | 18,608 | blanco | — | Sí: `layout.tsx:47` |
| `android-chrome-192x192.png` / `-512x512.png` / `-maskable-512x512.png` | PNG RGBA | 192 / 512 / 512 | 24,875 / 126,087 / 96,594 | blanco | — | Sí: `site.webmanifest` |

### Hallazgos

1. **No hay ningún archivo vectorial del logo Surmetric**: ni SVG, ni AI, ni PDF. No está en los 6 repos ni en ninguna parte de `CascadeProjects/` (búsqueda por nombre `*isotipo*`, `*lockup*`, `*surmetric*`). Los únicos SVG de logo son los de **Surdat**, en symdat, y son de producto, no de Surmetric.
2. **Hay dos archivos distintos con el nombre `logo-lockup-full.png`**:
   - el de songal: PNG de 1857×280 con transparencia;
   - otro que en realidad es **un JPEG (JFIF) con extensión `.png`**: 700×168, sin transparencia, 10,412 bytes. Este último es el que usa IAnsurance (`web/public/brand/logo-surmetric.png`, en `layout.tsx:25`) y **el que trae la skill `surmetric-branding`** como "versión principal" (`assets/logo-lockup-full.png`). También está copiado en `akili/` y `salmones-aysen/`.
3. **El recorte del isotipo está mal**: `logo-isotipo.png` y `logo-isotipo-white.png` incluyen un fragmento de la "S" del wordmark en el borde derecho (se ve a simple vista). El mismo archivo está en IAnsurance (`web/public/brand/isotipo-surmetric.png`, sin referencias) y en la skill.
4. **El wordmark no es `#1B1F2A`**: el color opaco dominante de `logo-lockup-full.png` es **`#131F28`** (38.4% de los píxeles opacos). Los grises del cubo miden ≈`#8898AA`, ≈`#AFBDCB` y ≈`#E1E7EE`. El archivo tiene unos 12,700 colores distintos: es un raster con antialiasing, no una exportación de vector con colores planos.
5. **`android-chrome-512x512.png` se ve pixelado**: es un ampliado de un original más chico.
6. **El wordmark de `logo-lockup-mono.png` no coincide a la vista con el de `logo-lockup-full.png`**: proporciones y grosores distintos. Esto es solo observado, no medido.
7. `site.webmanifest` declara `"name": "Symdat - Business Intelligence"`. Ya estaba en el inventario.

### Recomendación

Ningún archivo actual debería entrar a Core como **maestro**. Core debería tener `logo/` con SVG del lockup (color, blanco, mono) y del isotipo, y los PNG/ICO derivados en el build. Mientras no haya vector:
- **Mínimo provisional**, si hace falta: `logo-lockup-full.png` y `logo-lockup-white.png` de songal (los únicos transparentes y de alta resolución), marcados como "raster provisional".
- **No** entran el isotipo (recorte roto), el mono (wordmark distinto), los PNG con fondo blanco ni el JPEG disfrazado.

**Pregunta**: ¿existe el archivo fuente vectorial del logo (SVG, AI, PDF o Figma) fuera de estos repos? Si no existe, hay que encargar el redibujo a diseño. No lo hago yo, tal como pediste.

---

## 11. La familia `easing` con `cubic-bezier()`

**Cerrada por mí: se queda en `tokens.json`, y el README ya la muestra.**

- `tokens.json` es la fuente de verdad del build: de ahí salen `--sm-ease-out-expo` (`tokens.css`), `--ease-out-expo` (`theme.css`), `transitionTimingFunction` (`tailwind.js`) y la tabla del README. Si se saca de `tokens.json`, el build deja de emitirla.
- El README ya la muestra, porque su tabla se genera desde `tokens.json` (fila `ease-out-expo`). "Moverla al README" no agrega nada.
- **No puedo verificar desde aquí** si el tipo Design System de Claude interpreta un valor `cubic-bezier()`: en esta sesión no tengo acceso a su esquema. Si no lo interpreta, la proyección lo omite o lo muestra como texto. Como el repo manda, eso no es un problema.
- En la Fase B: agregar al `usage` los cuatro puntos de control legibles ("x1 0.16, y1 1, x2 0.3, y2 1"), para que sobrevivan aunque la proyección trate el valor como texto opaco.

---

## 12. Política de versionado

**Cerrada por mí. El orden de adopción lo puedes cambiar.**

Hoy: `package.json` en `0.1.0`, `private`, instalación por tag de git (`github:fcosalinas/surmetric-tokens#v0.1.0`). Ningún `package.json` auditado depende del paquete.

### Qué cuenta como breaking

| Cambio | Tipo |
|---|---|
| Quitar o renombrar un token, una clase, una variable CSS o una ruta de `exports` | **Breaking** |
| **Cambiar el valor de un token existente** (color, tamaño, radio, sombra). Cualquier app fijada al tag vería un cambio visual al subir de versión. | **Breaking** |
| Cambiar cómo se activa un tema (`data-theme`, `.dark`) o dejar de soportar un major de Tailwind | **Breaking** |
| Agregar tokens, salidas o valores de tema a tokens que no los tenían | Aditivo |
| Docs, textos de `usage`, arreglos del build que no cambian `dist/` | Parche |

Mientras sea 0.x, un breaking sube el minor (`0.1.x` → `0.2.0`) y lo aditivo o un parche sube el patch (`0.2.0` → `0.2.1`). **Se pasa a `1.0.0` cuando dos apps usen Core en producción.** Desde ahí: breaking = major, aditivo = minor, parche = patch.

### Cómo se tagea

1. `npm run check` en verde sobre `main`.
2. Una entrada en `CHANGELOG.md` (se crea en la Fase B) con, por cada repo, qué tiene que cambiar.
3. Tag anotado `vX.Y.Z` en `main` y `git push --follow-tags`. Un tag publicado nunca se mueve.
4. Actualizar la proyección del sistema de diseño en Claude desde ese tag.

Cada app fija un tag exacto. Subir de versión es un PR explícito en la app.

### Orden de adopción

Por costo (inventario §7) y por colisiones (§7 de este documento):

1. **yolotengo**: 14 literales y ya usa los mismos nombres semánticos. Solo hay que borrar `theme.css` y aceptar las diferencias de valor de §7.
2. **sitio-web-songal**: 31 literales.
3. **IAnsurance**: 34, más el cambio de familia Inter → Montserrat (C5).
4. **piatio**: 269, pero 146 son colores de dominio en `YardEditor.tsx`. Además, hoy no carga ninguna fuente.
5. **lex-semaforo**: 93. Adopta tipografía, espaciado y radios. Los colores de marca solo si decides cambiar su identidad propia (C1).
6. **symdat**: 3,366. Es un proyecto propio.

La Fase B saldría como **`v0.2.0`**: incluye un breaking (`brand-gray-500-legacy` → `brand-gray-400`) más lo aditivo.

---

## Preguntas para cerrar la Fase A

1. **Gris** (§1): ¿aceptas `#8E9AA8` = `brand-gray-400` como gris de identidad y `#5D6978` = `brand-gray-500` como texto secundario, con el cambio correspondiente en la skill y en tu preferencia guardada?
2. **Botón** (§2): ¿`action` `#00766F` con hover `#1B1F2A` y texto blanco? ¿O prefieres otro hover, sabiendo que un teal más oscuro sería un color nuevo de marca?
3. **Tema oscuro** (§3): ¿lo mantengo como opt-in "sin consumidores" o lo quito?
4. **Títulos** (§8b): ¿pesos 900 / 900 / 800 / 700 / 700 con tracking −0.025 / −0.025 / −0.02 / −0.01 / 0 em? ¿Incluyo `eyebrow`?
5. **Forma del botón** (§9): ¿6px o pill?
6. **Logo** (§10): ¿existe un archivo vectorial fuente? ¿Entran mientras tanto los dos lockups PNG de songal como provisionales, o Core espera al vector?
