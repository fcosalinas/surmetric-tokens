# Inventario de design tokens — Surmetric SpA

Auditoría de solo lectura de 6 repos, hecha el 2026-10-29. No se editó ningún archivo de los repos. Este informe es el único archivo escrito.

| Repo | Rama | Commit auditado | Fecha del commit | Frontend auditado |
|---|---|---|---|---|
| `fcosalinas/sitio-web-songal` | main | `d85e38a` | 2026-10-20 | `app/`, `public/` |
| `fcosalinas/symdat` (producto **Surdat**) | main | `f2b5e2e` | 2026-10-23 | `frontend/src/`, `frontend/public/` |
| `fcosalinas/lex-semaforo` | main | `a838a0b` | 2026-08-25 | `app/`, `components/`, `lib/` |
| `fcosalinas/IAnsurance` | master | `cb9283b` | 2026-05-01 | `web/app/` |
| `fcosalinas/piatio` | main | `c4ee412` | 2026-10-11 | `apps/web/src/` |
| `fcosalinas/yolotengo` | main | `bbf0a5d` | 2026-10-22 | `apps/web/src/`, `packages/` |

## Método y límites (léelo antes de usar los números)

- **Colores**: un script recorre todos los archivos de texto de cada repo (excluye `.git`, `node_modules`, `.next`, lockfiles y `.md`) y extrae `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`, `oklab()` y `color-mix()`. **No hay ningún `oklch()`, `oklab()` ni `color-mix()` en los 6 repos.** Cada hallazgo se etiqueta por alcance: `produccion`, `test`, `backup`, `backend`, `config-huerfana`, `doc-mockup` y `compilado`. Los análisis y los conteos de costo usan **solo `produccion`**. El resto aparece en los apéndices para que quede registro.
- **Tipografía, espaciado, radios, sombras y transiciones**: un segundo script tokeniza cada literal de string (`"…"`, `'…'`, `` `…` ``) del código de producción, además de los `@apply` del CSS, y clasifica las utilidades Tailwind. Una "combinación tipográfica" es el conjunto de clases de tamaño, interlineado, peso, familia y tracking que aparecen **dentro de un mismo literal**. Límites conocidos:
  - si un `className` se arma juntando varios strings (`cn()`, ternarios), una combinación puede quedar partida en dos filas o mezclar ramas excluyentes (por ejemplo `text-base text-xs`, ver la nota de yolotengo);
  - los valores en px que asigno a cada clase (`text-sm` = 14px/20px, etc.) son los del tema por defecto de Tailwind, iguales en v3 y v4. **No los verifiqué contra `node_modules`**, porque no instalé dependencias;
  - el peso "— (hereda)" significa que el literal no fija el peso.
- **Estilos inline** (`fontSize:`, `font-size:`, `borderRadius:`, `box-shadow:`, `transition:`, etc.) se cuentan con regex sobre `.ts/.tsx/.js/.jsx`.
- **No se ejecutó ninguna app.** Todo lo que dependa de cómo se renderiza (cascada, pesos sintetizados) está marcado como **inferido**.
- **Colores de los logos PNG de songal: no determinados.** No había librería de imágenes disponible para leer píxeles. Solo se verificaron los colores de los logos en SVG (los de Surdat en symdat).

---

## 1. Resumen

1. **Hay un núcleo de marca real y consistente** en 4 repos (songal, IAnsurance, piatio, yolotengo): `#00968E`, `#1B1F2A`, `#E1E8F0`, `#8E9AA8`, `#FFFFFF`, más `#00766F`, `#E6F5F3`, `#F4F7FA` y `#B8C2CC` en la mayoría.
2. **Surdat (symdat) prácticamente no usa la marca en su UI.** La marca vive solo en el logo SVG, el footer y los meta tags. La interfaz se apoya en la paleta por defecto de Tailwind v3: 2745 usos de clases como `text-gray-500` o `bg-blue-600`, sin ningún token propio, porque `frontend/tailwind.config.js` tiene `extend: {}`. A eso se suma un tema morado heredado (`#667eea`→`#764ba2`) en `index.css`. Es, por lejos, el repo más caro de migrar.
3. **lex-semaforo tiene identidad propia deliberada**: navy `#142F4C`, neutros con sesgo navy, serif Georgia. No es deriva, está comentado en el código.
4. **Hay dos generaciones de tipografía**: Inter / Inter Tight / JetBrains Mono (IAnsurance, piatio) contra Montserrat / Geist Mono (songal, yolotengo). Además, **piatio declara Inter pero nunca la carga**.
5. **`#8E9AA8` no pasa WCAG AA en ningún tamaño de texto**, ni sobre `#FFFFFF` (2.8619:1) ni sobre `#F4F7FA` (2.6617:1). Se usa como color de texto en ≥182 lugares.
6. **Deriva fina en tonos de acento**: `#00766F` contra `#007A73`, `#E6F5F3` contra `#E0F2F1`, `#FDECEC` contra `#FDECEA`, `#FEF3E2` contra `#FFF4E0`.
7. **Mezcla de Tailwind v3 y v4**: las mismas clases (`shadow-sm`, `rounded-sm`) significan valores distintos según el repo.

---

## 2. Verificación de la referencia de marca declarada

| Regla declarada | Dónde se cumple | Dónde **no** se cumple |
|---|---|---|
| `#1B1F2A` texto y fondos oscuros | songal `app/globals.css:8,24`; IAnsurance `web/app/globals.css:8`; piatio `apps/web/tailwind.config.ts:15`, `src/app/globals.css:12`; yolotengo `apps/web/src/app/theme.css:11` | **symdat**: solo en logo SVG, `public/index.html:10` y `public/manifest.json:12`. El texto de la UI es `#111827` (`src/index.css:9`, `components/ThemeSelector.js:54,60`) y las clases `text-gray-900`×190, `text-gray-800`×66, `text-gray-700`×154. **lex-semaforo**: usa `ink: "#0E1F33"` (`tailwind.config.ts:13`). Los correos de lex usan `#1a1a1a` (`lib/correo/plantillas.ts:22,60`). |
| `#00968E` acento | songal, IAnsurance, piatio, yolotengo (definido como token y usado) | **symdat**: solo en `components/SurmetricFooter.js:14,23,28` y en los logos. El acento interactivo real de la UI es azul: `focus:ring-blue-500`×57, `text-blue-600`×73, `bg-blue-600`×18, `hover:bg-blue-700`×17. **lex-semaforo**: el acento es navy `#142F4C` (`tailwind.config.ts:18`). |
| `#F4F7FA` superficie | songal `globals.css:10`; IAnsurance `globals.css:10` (también fondo del `body`, `:25`); yolotengo `theme.css:15` | **piatio** no lo define: su `tailwind.config.ts` y `globals.css` no tienen gris 50 y el `body` es `#FFFFFF` (`globals.css:29`); el doc HTML usa `#f6f9fb`. **lex**: `ground: "#F7F9FB"` (`tailwind.config.ts:12`). **symdat**: `#f8fafc` (`index.css:8,33`) y `bg-gray-50` = `#F9FAFB` (×66). |
| `#E1E8F0` superficie | songal `globals.css:11`; IAnsurance `globals.css:11`; piatio `tailwind.config.ts:16`; yolotengo `theme.css:16` | **symdat**: solo en `App.js:75` (`border-[#E1E8F0]`) y en logos; el resto usa `#e5e7eb` (`index.css:11`) y `border-gray-200`×107. **lex**: `line: "#DCE3EA"` (`:15`) y `navy.soft: "#E7EDF3"` (`:20`). |
| `#8E9AA8` texto secundario | songal, IAnsurance, piatio, yolotengo, symdat (solo `SurmetricFooter.js:7`) | **lex**: `muted: "#5A6B7B"` (`tailwind.config.ts:14`). **symdat**: `#6b7280` (`index.css:10`) y `text-gray-500`×311 / `text-gray-600`×229. Además, **no cumple AA** (ver §3). |
| `#FFFFFF` base | todos | **symdat**: el `body` tiene `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (`src/index.css:21`). Si se ve o no depende de lo que monte encima cada layout; no lo verifiqué renderizando. |
| Montserrat para títulos | songal (`app/layout.tsx:2-16`, next/font/google); yolotengo (`apps/web/src/app/layout.tsx:1`, `@fontsource-variable/montserrat` 5.3.0; `theme.css:8`) | **IAnsurance**: Inter Tight (`globals.css:20`, Google Fonts en `layout.tsx:17`). **piatio**: Inter Tight declarada (`tailwind.config.ts:29`, `globals.css:23`) **y nunca cargada**: `src/app/layout.tsx` no tiene `<link>`, next/font ni @font-face, así que cae a `system-ui` salvo que el equipo la tenga instalada. **lex**: Georgia/Cambria serif (`tailwind.config.ts:37`; `font-serif`×39). **symdat**: stack de sistema (`index.css:16-18`). |
| …en peso 800/900 | yolotengo: `font-black`×12, `font-extrabold`×9 (también hay títulos en `font-bold`, p. ej. `text-2xl font-bold` en `cotizaciones/[id]/page.tsx:77`) | **songal**: ningún título fija peso. Las únicas clases de peso del repo son `font-medium`×12, y el `h1` del hero (`components/Hero.tsx:18`) solo tiene `font-display`. Con el preflight de Tailwind (`h1…h6 { font-weight: inherit }`) el peso pedido es 400, y la familia display solo carga 600/700/800/900 (`layout.tsx:14`). Por la regla de matching de fuentes CSS, **el título se renderizaría en 600** (inferido, no medido). **IAnsurance**: `font-bold` (700). **piatio**: `font-semibold` (600). **lex**: `font-bold` (700) en serif. **symdat**: `font-black` (900) con fuente de sistema. |
| …tracking tight | songal: `tracking-tight` (= -0.025em) en todos los titulares display | **yolotengo**: `h1,h2,h3 { letter-spacing: -0.02em }` (`globals.css:16`). Es otro valor (-0.02em frente a -0.025em). `tracking-tight` solo aparece en el logo (`business-logo.tsx:31`, `site-chrome.tsx:15`). |
| Geist Mono para datos e IDs | songal (`layout.tsx:18-21`; `.marker-num`, `globals.css:98-103`); yolotengo (`geist` 1.7.2 `GeistMono`, `layout.tsx:3,16`; `.num`×36) | **IAnsurance** y **piatio**: JetBrains Mono (`globals.css:21` / `:24`, `tailwind.config.ts:30`). piatio la usa también inline en el editor (`YardEditor.tsx:2456` y siguientes). **lex**: `ui-monospace` (correos, `plantillas.ts:58,62,95`) y `font-mono` de Tailwind por defecto. **symdat**: `font-mono` de Tailwind por defecto (×13). |
| Transiciones `cubic-bezier(0.16, 1, 0.3, 1)` | songal `globals.css:77,85,120`; yolotengo `theme.css:25` (`--ease-out-expo`), aplicada a todo por `globals.css:38-40` | **songal** también usa `0.3s ease` (`:111`), `0.4s ease` (`:121`), `ease-out` (`:81`) y `transition-colors`×21 con la curva por defecto de Tailwind. **IAnsurance**: `ease-out` (`globals.css:93`, `page.tsx:321`). **lex**: solo la curva por defecto de Tailwind (`transition-colors`). **piatio**: `transition`×5 por defecto. **symdat**: `* { transition: all 0.3s ease; }` (`index.css:485-487`) y `600ms ease-out` (`VentasNewDashboard.js:95`). |

Notas de verificación:
- **yolotengo `globals.css:38-40`** aplica `transition-timing-function` a `*` fuera de toda `@layer`. En Tailwind v4 los estilos sin capa ganan a las utilidades, así que **pisaría cualquier `ease-*` de clase**. Es inferido, no lo compilé.
- **songal `globals.css:17`**: `--font-display: var(--font-display), "Helvetica Neue", …` dentro de `@theme` es autorreferente. En `:root` la variable quedaría inválida y el fallback `"Helvetica Neue"` nunca aplica. Funciona porque next/font redefine `--font-display` en el `<body>` (`layout.tsx:102`). Inferido.

---

## 3. Contraste de `#8E9AA8`

Fórmula WCAG 2.x (luminancia relativa sRGB). Luminancias: `#8E9AA8` = 0.316891…, `#FFFFFF` = 1.0, `#F4F7FA` = 0.926568….

| Fondo | Ratio | Texto normal (necesita 4.5:1) | Texto grande ≥24px, o ≥18.66px con peso ≥700 (necesita 3:1) | Componentes UI / no-texto (necesita 3:1) |
|---|---|---|---|---|
| `#FFFFFF` | **2.8619:1** | No pasa | **No pasa** | No pasa |
| `#F4F7FA` | **2.6617:1** | No pasa | **No pasa** | No pasa |

**`#8E9AA8` no pasa AA en ningún tamaño de texto**, ni siquiera en el `h1` del hero de songal (`Hero.tsx:23`, "No al revés.", en `text-brand-gray-500` entre 48px y 96px).

Para que pasara AA en texto normal sobre blanco, el color necesitaría una luminancia ≤ 0.1833; para texto grande, ≤ 0.3000.

Uso de `#8E9AA8` como color de texto:

| Repo | Usos | Dónde |
|---|---|---|
| songal | 8 | `text-brand-gray-500` |
| IAnsurance | 20 | `text-surmetric-gray-500` |
| piatio | 74 | 63 `text-brand-gray-500` + 11 `color:#8E9AA8` inline en `YardEditor.tsx` |
| yolotengo | 79 | `text-muted` |
| symdat | 1 | `SurmetricFooter.js:7` |
| **Total** | **182** | |

Valores de "texto secundario" que ya existen en los repos, como referencia y sin resolver nada:

| Valor | Origen | Sobre `#FFFFFF` | Sobre `#F4F7FA` |
|---|---|---|---|
| `#5A6B7B` | lex | 5.4919:1 | 5.1078:1 |
| `#5E6A78` | doc HTML de piatio | 5.5136:1 | 5.1280:1 |
| `#6B7280` | symdat | 4.8345:1 | 4.4964:1 (falla por poco) |

Contrastes relacionados, mismo método:

| Combinación | Ratio | Resultado |
|---|---|---|
| `#00968E` sobre `#FFFFFF` | 3.6502:1 | Solo texto grande y no-texto |
| `#00968E` sobre `#F4F7FA` | 3.3949:1 | Solo texto grande y no-texto |
| Texto `#FFFFFF` sobre `#00968E` (botones) | 3.6502:1 | Igual. Los botones de piatio con texto de 11-12px sobre teal (`YardEditor.tsx:2488` y siguientes) no pasan AA |
| `#00766F` sobre `#FFFFFF` | 5.4961:1 | Pasa |
| `#007A73` sobre `#FFFFFF` | 5.2091:1 | Pasa |
| `#D97706` sobre `#FFFFFF` | 3.1858:1 | Solo texto grande |
| `#DC2626` sobre `#FFFFFF` | 4.8294:1 | Pasa |
| `#15803D` sobre `#FFFFFF` | 5.0156:1 | Pasa |
| `#8A5A00` sobre `#FFFFFF` | 5.9270:1 | Pasa |
| `#B42318` sobre `#FFFFFF` | 6.5743:1 | Pasa |
| `#B8C2CC` sobre `#FFFFFF` | 1.8062:1 | No pasa nada |

---

## 4. Deriva: colores casi idénticos con el mismo rol aparente

Solo se cuenta el alcance `produccion`. "Canónico propuesto" es mi propuesta; la decisión es tuya.

| # | Rol aparente | Valor → repos donde aparece | Canónico propuesto y por qué |
|---|---|---|---|
| D1 | Acento oscuro / hover | `#00766F` → songal `globals.css:6`, IAnsurance `globals.css:5`, piatio `tailwind.config.ts:13` + `globals.css:10`, symdat `SurmetricFooter.js:14` + cara oscura del logo Surdat (`assets/surdat-lockup.svg:1`). `#007A73` → yolotengo `theme.css:13` (`accent-strong`) y `docs/marca/logo.html:27`. | **`#00766F`**: está en 4 repos y en el logo. Ambos pasan AA. |
| D2 | Acento suave (fondo) | `#E6F5F3` → songal `:7`, IAnsurance `:6`, piatio `tailwind.config.ts:14` + `globals.css:11`. `#E0F2F1` → yolotengo `theme.css:14`. | **`#E6F5F3`**: 3 repos. |
| D3 | Acento luminoso (solo logos) | `#00B2AC` → cara clara del cubo de Surdat (`symdat/frontend/src/assets/surdat-lockup.svg:1`, `surdat-lockup-navbar.svg:1`, `public/favicon.svg:1`). `#00A89F` → gradiente del logo de yolotengo (`docs/marca/logo.html:27`, no productivo). | **Sin propuesta firme.** Solo vive dentro de logos y no pude leer los PNG de songal para comparar. Si hay que elegir, `#00B2AC`, porque es el que está en producción. |
| D4 | Superficie clara | `#F4F7FA` → songal, IAnsurance, yolotengo. `#F7F9FB` → lex `tailwind.config.ts:12`. `#F8FAFC` → symdat `index.css:8,33,291…` y `ThemeSelector.js:59`. `#F9FAFB` → symdat `ThemeSelector.js:53`, `index.css:68…` y `bg-gray-50`×66. | **`#F4F7FA`**. lex podría ser decisión propia, ver C1. |
| D5 | Borde / divisor | `#E1E8F0` → songal, IAnsurance, piatio, yolotengo, symdat `App.js:75`. `#E5E7EB` → symdat `index.css:11,92,292,298`, `CobranzaGraficos.js:23`, `ComexDashboard.js:266,331,353,425`, `PanelSalud.js:195,266`, `PanelActividad.js:193,211,227`, `InventarioDashboard.js:421,538`, `ThemeSelector.js:56,62`, `VentasNewDashboard.js:61` y `border-gray-200`×107. `#DCE3EA` → lex `:15`. `#EEF0F2` → symdat grilla de gráficos `CobranzaGraficos.js:215,264,304,357`. `#E5E3DE` → lex correos `plantillas.ts:23,27`. | **`#E1E8F0`**. |
| D6 | Track del anillo de score (mismo componente: `viewBox 120`, `r=52`, `strokeWidth 10`) | `#E1E8F0` → IAnsurance `page.tsx:309`. `#E7EDF3` → lex `ScoreCircle.tsx:20`. | **`#E1E8F0`**. El componente también deriva en tipografía: número `text-4xl font-bold font-display` (`page.tsx:326`) contra `text-3xl font-bold` (`ScoreCircle.tsx:34`); rótulo `text-[10px] tracking-wider` (`:329`) contra `text-[11px] tracking-wide` (`:35`); animación `1s ease-out` (`:321`) contra ninguna. |
| D7 | Texto principal | `#1B1F2A` → songal, IAnsurance, piatio, yolotengo. `#111827` → symdat `index.css:9,38,166,314`, `ThemeSelector.js:46,54,60`. `#1F2937` → symdat `cobranza/common.js:128`. `#1A1A1A` → lex correos `plantillas.ts:22,60`. `#0E1F33` → lex `:13`. | **`#1B1F2A`**. lex `#0E1F33` va a conflictos (C1). |
| D8 | Texto secundario | `#8E9AA8` → songal, IAnsurance, piatio, yolotengo, symdat footer. `#6B7280` → symdat `index.css:10,84`, `ThemeSelector.js:55,61`, `cobranza/common.js:124`, `TablaCartera.js:504`, `PanelSalud.js:197,198,203,267,268`, `salud.js:38`, `VentasNewDashboard.js:1897,1903`, `ComexDashboard.js:21`, `InventarioDashboard.js:19`. `#6B6B6B` → lex correos `plantillas.ts:24,28,64,67,96,121,155`. `#5A6B7B` → lex. | **`#8E9AA8`** como valor de marca (5 repos), **pero no sirve para texto** (§3). Si el rol "texto secundario" sigue usando este valor es un conflicto abierto (C3). |
| D9 | Gris medio / deshabilitado | `#B8C2CC` → songal `:12`, IAnsurance `:12`, symdat (solo dentro de los 3 SVG de logo). `#9CA3AF` → symdat `index.css:80,139`, `VentasNewDashboard.js:62`, `PanelSalud.js:202`, `PanelMetas.js:345`, `InventarioDashboard.js:23`. | **`#B8C2CC`**. |
| D10 | Peligro / error | `#DC2626` → lex `:23` + `ScoreCircle.tsx:4`, IAnsurance `:15`, piatio `tailwind.config.ts:22` + `globals.css:18` + `YardEditor.tsx:2167,2789`, symdat `index.css:436`, `VentasNewDashboard.js:68`, `PanelActividad.js:199`, `PanelAreasComerciales.js:24`, `bitacora/formato.js:65`. `#EF4444` → symdat ×12 (`index.css:284,379,436`, `TablaSKUExpandible.js:183`, `Contabilidad.js:116`, `ComexDashboard.js:17`, `InventarioDashboard.js:17,27`, `VentasNew.js:56,246`, `VentasNewSimple.js:154,737`) e IAnsurance `stroke-red-500` (`page.tsx:40`). `#B42318` → yolotengo `theme.css:19`. | **`#DC2626`**: 4 repos, pasa AA. yolotengo va a conflictos (C4). |
| D11 | Advertencia | `#D97706` → lex `:24` + `ScoreCircle.tsx:5`, IAnsurance `:16`, piatio `:21` + `globals.css:17` + `YardEditor.tsx:316`, symdat `index.css:430`, `PanelSalud.js:18`. `#F59E0B` → symdat ×15. `#CA8A04` → symdat `VentasNewDashboard.js:68`. `#8A5A00` → yolotengo `theme.css:21`. | **`#D97706`** como color de estado/ícono. Ojo: como texto da 3.1858:1 (C4). |
| D12 | Fondo suave de error | `#FDECEC` → lex `:23`. `#FDECEA` → yolotengo `:20`. `#FEE2E2` → symdat `VentasNewDashboard.js:69` y `bg-red-100`×31. `bg-red-50` (`#FEF2F2`) → IAnsurance `page.tsx:40`, symdat ×20. | **`#FDECEC`**. `#FDECEA` difiere en un solo canal (B: EC→EA): deriva pura. |
| D13 | Fondo suave de advertencia | `#FEF3E2` → lex `:24`. `#FFF4E0` → yolotengo `:22`. `#FEF9C3` → symdat `VentasNewDashboard.js:69`. `bg-amber-50` (`#FFFBEB`) → IAnsurance `page.tsx:41`, symdat ×19. | **`#FEF3E2`**. Contra `#FFF4E0` es deriva fina. |
| D14 | Fondo suave de éxito | `#E8F5EC` → lex `:25`. `#E6F5F3` (teal-light usado como fondo del estado verde) → IAnsurance `page.tsx:42`. `#DCFCE7` → symdat `VentasNewDashboard.js:69`. | Depende de C2: si éxito = acento, `#E6F5F3`; si éxito ≠ acento, `#E8F5EC`. |
| D15 | Azul info / acción secundaria | `#2563EB` → piatio `tailwind.config.ts:23` + `globals.css:19`; symdat `PanelActividad.js:200,215`, `PanelAreasComerciales.js:24` y `bg-blue-600`×18. `#3B82F6` → symdat ×23. | **`#2563EB`**: único valor que existe como token semántico (piatio `semantic.info`). |
| D16 | Navy de lex (dentro del mismo repo) | `#142F4C` → `tailwind.config.ts:18`. `#1E3A5F` → botón del correo (`lib/correo/plantillas.ts:37`). | **`#142F4C`**: el correo se desvió del token del propio repo. |
| D17 | Sombra hover de tarjeta | songal `0 16px 40px -12px rgba(27, 31, 42, 0.12)` (`globals.css:126`). yolotengo `0 8px 24px -12px rgb(27 31 42 / 0.25)` (`components/business-card.tsx:28`). | Mismo color base (`#1B1F2A`), geometría y alpha distintos. La de songal es de landing; propondría la de yolotengo para Core. |

### Deriva no cromática

- **Eyebrow / rótulo en mayúsculas**: mismo rol, 4 variantes en producción.

  | Repo | Clase | Tamaño | Peso | Tracking |
  |---|---|---|---|---|
  | lex | `.eyebrow` (`globals.css:58-60`) | 12px | 600 | 0.14em |
  | yolotengo | `.eyebrow` (`globals.css:25-31`) | 0.72rem | 700 | 0.1em |
  | songal | `.marker-num` (`globals.css:98-103`) | 0.75rem | 500 | 0.1em, mono |
  | symdat | `.metric-label` (`index.css:364-368`) | `text-sm` | 600 | 0.05em |
  | symdat | `.kpi-title` (`index.css:399-403`) | `text-sm` | 700 | 0.05em |

  Fuera de producción, el doc de piatio usa `.eyebrow` mono 0.75rem con 0.08em.
- **Tracking de titulares**: songal -0.025em (`tracking-tight`) contra yolotengo -0.02em (`globals.css:16`).
- **Radio de tarjeta**:

  | Repo | Radio | Dónde |
  |---|---|---|
  | yolotengo | 14px | `--radius-card`, `theme.css:24`, usado ×12 |
  | lex | `rounded-lg` (0.5rem) | `.card`, `globals.css:62` |
  | symdat | 16px | `.glass-card`, `index.css:471` |
  | symdat | `rounded-xl` (0.75rem) | `.metric-card` y `.kpi-card`, `index.css:345,383` |
  | symdat | `12px` | tooltips, `CompactChart.js:41` |
  | IAnsurance | 4px | blockquote, `globals.css:84` |
  | piatio | 6px | botones inline, `YardEditor.tsx:2488` y siguientes; equivale a `rounded-md`, que usa ×57 |

- **Tamaños de micro-texto fuera de la escala de Tailwind**, idénticos entre repos:

  | Valor | Repos | Usos |
  |---|---|---|
  | `text-[10px]` | symdat, lex, IAnsurance, piatio | 33, 1, 1, 4 |
  | `text-[11px]` | symdat, lex, piatio | 57, 7, 4 |
  | `text-[9px]` | symdat | 3 |

  En estilos inline también aparecen 9, 10, 11 y 12px (symdat en gráficos Recharts, piatio en popups de Leaflet).
- **Mismo nombre de clase, distinto valor entre v3 y v4**: `shadow-sm` en v3 (symdat ×83) es `0 1px 2px 0 rgb(0 0 0 / 0.05)`; en v4 (songal ×2, IAnsurance ×1, yolotengo ×1) es `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`. `rounded-sm` es 0.125rem en v3 y 0.25rem en v4 (solo symdat lo usa, ×3). Valores tomados del tema por defecto documentado de Tailwind, no verificados en `node_modules`.

---

## 5. Core sin discusión: valores idénticos en 3 o más repos (alcance producción)

| Valor | Repos | Advertencia |
|---|---|---|
| `#00968E` | 5: songal, IAnsurance, piatio, yolotengo, symdat | En symdat solo aparece en footer y logo |
| `#1B1F2A` | 5: songal, IAnsurance, piatio, yolotengo, symdat | En symdat solo en logo y meta |
| `#E1E8F0` | 5: songal, IAnsurance, piatio, yolotengo, symdat | En symdat, 1 uso en UI (`App.js:75`) + logo |
| `#8E9AA8` | 5: songal, IAnsurance, piatio, yolotengo, symdat | **Falla AA como texto** (§3) |
| `#FFFFFF` | 5: songal, lex, piatio, yolotengo, symdat | IAnsurance usa la palabra `white`/`bg-white`, no el literal |
| `#00766F` | 4: songal, IAnsurance, piatio, symdat | yolotengo usa `#007A73` (D1) |
| `#DC2626` | 4: lex, IAnsurance, piatio, symdat | En lex es color de **semáforo** (producto). Como color de estado genérico cumple el criterio |
| `#D97706` | 4: lex, IAnsurance, piatio, symdat | Igual que `#DC2626`; además falla AA como texto |
| `#E6F5F3` | 3: songal, IAnsurance, piatio | — |
| `#F4F7FA` | 3: songal, IAnsurance, yolotengo | — |
| `#B8C2CC` | 3: songal, IAnsurance, symdat | **En symdat solo existe dentro de los SVG del logo.** Sin contar logos, son 2 repos |

Fuera del color, nada cumple el criterio de 3 o más repos salvo la propia escala por defecto de Tailwind y los micro-tamaños `text-[10px]`/`text-[11px]`. La curva `cubic-bezier(0.16, 1, 0.3, 1)` solo aparece en 2 repos (songal, yolotengo). Montserrat y Geist Mono también aparecen solo en esos 2, igual que Inter / Inter Tight / JetBrains Mono (IAnsurance, piatio).

`#2D3140` (dark-soft) está en songal e IAnsurance, y además en `symdat/.claude/skills/analisis-macro-topreman/assets/build-pdf.js`, que no es producción de Surdat sino un skill de informes de Top Reman. Son 2 repos en producción.

---

## 6. Conflictos que parecen decisiones deliberadas (no resueltos)

| # | Conflicto | Por qué creo que es deliberado |
|---|---|---|
| C1 | **lex-semaforo tiene identidad propia**: navy `#142F4C` como marca, neutros `#0E1F33`/`#5A6B7B`/`#DCE3EA`/`#F7F9FB`, títulos en serif Georgia y sans de sistema. | Está escrito: `// Neutrales con sesgo navy (elegidos, no heredados)` (`tailwind.config.ts:11`) y `// Marca: navy legal (tomado del documento de negocio, #142F4C)` (`:16`). Todos los valores son coherentes entre sí; no es un desvío aislado. |
| C2 | **Qué color significa "éxito/verde"**: lex `#15803D` (verde, distinto del acento), contra IAnsurance `--color-status-green: #00968e` (`globals.css:17`) y piatio `success: '#00968E', // = brand-teal` (`tailwind.config.ts:24`). symdat usa verdes de Tailwind (`#10B981`, `#16A34A`, `#059669`). | Hay comentarios explícitos a ambos lados: lex dice `// Semáforo = color semántico del producto (no es un "accent" decorativo)` (`:22`) y piatio anota que el éxito es el acento. Son dos filosofías opuestas, no un error de tipeo. |
| C3 | **Texto secundario más oscuro que la marca**: lex `#5A6B7B` (5.4919:1) y el doc de piatio `#5E6A78` (5.5136:1) contra la marca `#8E9AA8` (2.8619:1). | La distancia es grande (luminancia 0.11 frente a 0.32), no un redondeo, y ambos valores alternativos caen justo en la zona que pasa AA. En lex es parte de C1. En piatio solo está en el doc HTML, no en la app, así que **no puedo afirmar intención** ahí. |
| C4 | **Estados de yolotengo más oscuros**: `danger #B42318` y `warning #8A5A00` contra `#DC2626`/`#D97706` en 4 repos. | `#D97706` como texto da 3.1858:1 (falla AA) y `#8A5A00` da 5.9270:1. Elegir un ámbar tan oscuro solo tiene sentido si es para texto legible: parece deliberado. Para danger no tengo evidencia: `#DC2626` ya pasa AA (4.8294:1). Además, `theme.css:1-6` dice que todos los tokens son **PROVISIONALES**, lo que debilita la idea de que sea una decisión firme. |
| C5 | **Dos generaciones de tipografía**: Inter / Inter Tight / JetBrains Mono (IAnsurance, piatio) contra Montserrat / Geist Mono (songal, yolotengo, referencia declarada). | Las tres familias son las mismas en IAnsurance y piatio. Display y mono son idénticas carácter por carácter; en sans, IAnsurance agrega `-apple-system` (`globals.css:19` contra piatio `globals.css:22`). Además vienen junto a tokens de color idénticos. Parece una versión anterior y coherente del sistema Surmetric, no una deriva repo a repo. Cuál vale hoy lo decides tú. |
| C6 | **symdat colorea por escala continua**: `colorSalud` usa `hsl(tono 0→130, 80%, 36%|42%)` (`modules/abastecimiento/salud.js:37-42`) y la cobranza mezcla RGB por monto (`components/cobranza/common.js:124-128`). | El comentario dice `Los tonos medios se oscurecen para leerse sobre blanco` (`salud.js:36`). Es un algoritmo de producto con intención explícita, no compatible con un set discreto de tokens. |

Lo que **no** clasifico como deliberado:

- **El tema morado de symdat** (`#667eea`/`#764ba2`, glassmorphism, `* { transition: all 0.3s ease }`, `index.css`). Tiene pinta de herencia anterior a la marca: convive con el logo y el footer nuevos sin integrarse. Además, el selector de temas `components/ThemeSelector.js` **no se importa desde ningún archivo** (verificado con grep). Sus 15 literales y el tema oscuro `body.bg-gray-900 …` (`index.css:42-287`) parecen código muerto. No lo confirmé ejecutando.
- **IAnsurance define `--color-status-red/yellow/green` (`globals.css:15-17`) y no los usa en ninguna parte.** El semáforo real usa `bg-red-50`/`stroke-red-500`/`text-red-700` y `amber-*` de la paleta por defecto (`page.tsx:40-41`). Es deriva dentro del propio repo.

---

## 7. Costo de adopción: literales a tocar por repo

**Un número por repo (alcance producción).** Desglose y criterio debajo.

| Repo | **Total** | Colores en código | …de ellos en definiciones de tema (CSS/config) | Meta (manifest, `theme-color`) | Clases de paleta por defecto de Tailwind | Valores arbitrarios en clases (`text-[11px]`, `leading-[1.05]`…) | Estilos inline (tipografía/radio/sombra/transición) |
|---|---|---|---|---|---|---|---|
| sitio-web-songal | **31** | 22 | 17 | 3 | 0 | 6 | 0 |
| symdat | **3366** | 424 | 150 | 3 | 2745 | 95 | 99 |
| lex-semaforo | **93** | 35 | 13 | 0 | 0 | 14 | 44 |
| IAnsurance | **34** | 13 | 12 | 0 | 19 | 1 | 1 |
| piatio | **269** | 169 | 21 | 0 | 0 | 8 | 92 |
| yolotengo | **14** | 13 | 12 | 0 | 0 | 1 | 0 |

Criterio:

- Se excluyen los logos SVG (symdat: 58 literales en 3 archivos), porque son el asset, no estilos. También se excluyen los 5 SVG de plantilla de Next en `songal/public/` (8 literales), que nada referencia.
- Se excluyen las clases que ya usan un token del repo (`bg-brand-teal`, `text-muted`, `rounded-[var(--radius-card)]`…).
- lex: se descontó el `#142F4C` que aparece en un comentario (`tailwind.config.ts:16`). 44 de sus 44 estilos inline y 18 de sus 35 colores están en `lib/correo/plantillas.ts`: HTML de correo, donde no hay variables CSS.
- symdat: los dos `shadow-[0_±1px_0_0_#e5e7eb]` se cuentan una sola vez. 2745 son clases como `text-gray-500`; aunque no sean literales de color, cada una hay que reemplazarla.
- piatio: 146 de sus 169 colores están en `components/YardEditor.tsx`, sobre todo HTML inline de popups de Leaflet y la tabla de estilos de capas del mapa (`:313-331`). Esos son colores de dominio, ver §8.
- Son conteos de ocurrencias, no de líneas: una línea con 3 colores cuenta 3.

---

## 8. Colores con rol semántico propio del producto (no candidatos a Core)

### lex-semaforo: semáforo legal
- `rojo` `#DC2626` / `soft` `#FDECEC`; `ambar` `#D97706` / `soft` `#FEF3E2`; `verde` `#15803D` / `soft` `#E8F5EC` (`tailwind.config.ts:23-25`). Usados como clases ×112 (`bg-rojo-soft`×14, `text-rojo`×17, etc.).
- `ScoreCircle`: `rojo`/`amarillo`/`verde` (`components/informe/ScoreCircle.tsx:4-6`). La clave del objeto es `amarillo` aunque el token se llame `ambar`.

### IAnsurance: semáforo de pólizas
- Tokens `--color-status-red #dc2626`, `--color-status-yellow #d97706`, `--color-status-green #00968e` (`web/app/globals.css:15-17`), sin uso.
- En uso, `SCORE_COLORS` (`web/app/page.tsx:39-43`):

  | Estado | Clases |
  |---|---|
  | red | `bg-red-50`, `stroke-red-500`, `text-red-700` |
  | yellow | `bg-amber-50`, `stroke-amber-500`, `text-amber-700` |
  | green | `bg-surmetric-teal-light`, `stroke-surmetric-teal`, `text-surmetric-teal-dark` |

### piatio: diseño de riego
- Estados: `semantic.warning #D97706`, `error #DC2626`, `info #2563EB`, `success #00968E` (`tailwind.config.ts:20-25`, `globals.css:17-20`). `ISSUE_RED = '#DC2626'` (`YardEditor.tsx:2167`).
- Capas del mapa (`YardEditor.tsx:313-331`):

  | Capa | Colores (trazo / relleno) |
  |---|---|
  | boundary | `#00968E` |
  | building | `#1B1F2A` |
  | lawn | `#16A34A` / `#22C55E` |
  | deck | `#92400E` / `#D97706` |
  | pool | `#1D4ED8` / `#60A5FA` |
  | garden bed | `#7C2D12` / `#A16207` |
  | árbol existente | `#166534` |
  | planta nueva | `#1B1F2A` / `#8E9AA8` |
  | seto | `#166534` |
  | bomba | `#1D4ED8` |
  | tronco de riego | `#0F766E` |
  | lateral | `#0EA5E9` |
  | manguera de goteo | `#BE185D` |
  | aspersor | `#1D4ED8` / `#60A5FA` |
  | emisor de goteo | `#BE185D` / `#EC4899` |
  | anillo | `#BE185D` / `#FBCFE8` |
  | válvula | `#7C3AED` / `#A78BFA` |
  | manifold | `#0F766E` / `#5EEAD4` |

- Sectores de riego: `hsl(h, 55%, 45%)` con `SECTOR_HUES = [180, 210, 30, 270, 120, 0, 330, 60, 240, 90]` (`lib/sector-color.ts:5-9`).

### symdat (Surdat): BI
- **Antigüedad de cartera de cobranza**, escala de 6 tramos (`components/cobranza/common.js:54-64`): En plazo `#0f9d76`, 0-30 `#8fbf3f`, 30-60 `#f0c419`, 60-90 `#f39c39` (solo en las claves "Vencido"), 90-120 `#e2703a`, +120 `#c0392b`. La celda de crédito es `#eef2ff`/`#4338ca` (`:86`).
- **Migración de cartera**: `['#1f7a8c', '#f0c419', '#e2703a', '#c0392b']` (`CobranzaGraficos.js:242`). Color base de KPI `#1f7a8c` (`:32`). Promedio `#c8a03c` / `#8a6d1f` (`:315-316`).
- **KPIs de cobranza**: vencida `#c0392b`, mora dura `#e2703a`, DSO `#7c5cbf`, cobranza `#0f9d76` (`modules/Cobranza.js:326-338`).
- **Salud de abastecimiento**: escala continua `hsl(0…130, 80%, 36%/42%)`, con `#6b7280` cuando no hay dato (`modules/abastecimiento/salud.js:37-42`). Constantes NARANJA `#ea580c`, AMBAR `#d97706`, INDIGO `#4f46e5`, VERDE `#059669` (`PanelSalud.js:17-20`).
- **Señales de bitácora**: riesgo `#dc2626`, competencia `#f97316`, oportunidad `#0d9488` (`modules/bitacora/formato.js:65`).
- **Cumplimiento de meta**: ≥80% `#16a34a`/`#dcfce7`, ≥50% `#ca8a04`/`#fef9c3`, <50% `#dc2626`/`#fee2e2` (`VentasNewDashboard.js:68-69`).
- **Estados genéricos**: `.status-good/-warning/-critical` como gradientes `#10b981→#059669`, `#f59e0b→#d97706`, `#ef4444→#dc2626` (`index.css:423-439`); versión oscura en `:271-287`. `TablaSKUExpandible.js:183`: alza `#10b981` / baja `#ef4444`.
- **Clasificación ABC de inventario**: A `#22C55E`, B `#3B82F6`, C `#9CA3AF` (`InventarioDashboard.js:21-23`).
- **Series de gráficos**, al menos 8 paletas distintas sin relación entre sí:

  | Paleta | Ubicación | Colores |
  |---|---|---|
  | `COLORS` | `CompactChart.js:83` | 5 (`#667eea`…`#4facfe`) |
  | `COLORS` | `ERPCliente.js:113` | 5, paleta de ejemplo de Recharts (`#0088FE`, `#00C49F`, `#FFBB28`, `#FF8042`, `#8884D8`) |
  | `COLORS` | `VentasNewDashboard.js:1827` | 10 |
  | — | `VentasNewSimple.js:154-157` | 20 |
  | — | `VentasNewSimple.js:737`, `:753`, `:769` | 5 cada una |
  | `COLORS` | `VentasNew.js:56` | 6 |
  | `CHART_COLORS` | `InventarioDashboard.js:27` | 8 |
  | `C` | `ComexDashboard.js:13-21` | 9, con nombre (azul, verde, ámbar…) |
  | `COLORES_SUGERIDOS` | `PanelAreasComerciales.js:24` | 8; además, el color de cada área comercial lo elige el usuario y se guarda en BD (default backend `#6b7280`, `backend/src/models/AreaComercial.js`) |

- **Series por métrica**: ingresos `#10b981`, costos `#ef4444`, utilidad `#3b82f6` (`Contabilidad.js:115-117`), entre otras repetidas por módulo.

### yolotengo
- No tiene colores de producto propios. `danger`/`warning` son estados genéricos (ver C4).

---

## 9. Inventario por repo: resumen estructural

| Repo | Tailwind (rango en `package.json` → versión en lockfile) | Forma de la config | Familias y carga | Archivos de fuente en el repo |
|---|---|---|---|---|
| sitio-web-songal | `^4` → **4.2.2** | **CSS-first**: `@theme` en `app/globals.css:3-20`; `@tailwindcss/postcss` | Montserrat ×2 vía `next/font/google`: `--font-sans` pesos 300-800 (`layout.tsx:5-9`) y `--font-display` 600-900 normal+italic (`:11-16`). Geist Mono vía `next/font/google` (`:18-21`). Fallbacks `"Helvetica Neue", Arial, sans-serif` / `ui-monospace, monospace` (`globals.css:17-19`) | Ninguno (next/font los descarga en build) |
| symdat | `^3.3.0` → **3.4.19** | **JS**: `frontend/tailwind.config.js`, con `theme.extend` **vacío**. Hay además un `tailwind.config.js` en la raíz con `primary/success/warning/danger` (azules, verdes, ámbar y rojos de Tailwind) que **parece huérfano**: el build de CRA (`react-scripts` 5.0.1) corre en `frontend/` y su `content` apunta a `./src/**`, que no existe en la raíz | Stack de sistema `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif` (`src/index.css:16-18`), `body { font-size: 18px }` (`:23`). Sin carga de webfonts | Ninguno |
| lex-semaforo | `^3.4.17` → **3.4.19** | **JS**: `tailwind.config.ts` | Sans de sistema `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif` (`tailwind.config.ts:28-36`); serif `Georgia, Cambria, Times New Roman, serif` (`:37`); correos con `-apple-system…` y `ui-monospace, SFMono-Regular, Menlo, monospace` (`plantillas.ts:22,58,95`). Sin webfonts | Ninguno |
| IAnsurance | `^4.0.0` → **4.2.4** | **CSS-first**: `@theme` en `web/app/globals.css:3-22` | Inter 400/500/600/700, Inter Tight 600/700 y JetBrains Mono 400/500 vía `<link>` a Google Fonts (`web/app/layout.tsx:14-19`) | Ninguno |
| piatio | `^3.4.10` → **3.4.19** (pnpm-lock) | **JS**: `apps/web/tailwind.config.ts`, duplicado como variables CSS en `src/app/globals.css:8-25` | Inter / Inter Tight / JetBrains Mono declaradas (`tailwind.config.ts:28-30`) **sin carga** en la app (`src/app/layout.tsx` no carga nada). Solo `docs/guia-cabezal-zona1-casa-black.html:2-3` las pide a Google Fonts | Ninguno |
| yolotengo | `^4.3.3` → **4.3.3** | **CSS-first**: `@theme` en `apps/web/src/app/theme.css:7-26`, importado desde `globals.css:2` | Montserrat Variable vía `@fontsource-variable/montserrat` 5.3.0 (`layout.tsx:1`, `theme.css:8`); Geist Mono vía `geist` 1.7.2 (`layout.tsx:3,16`, `theme.css:9`) | **`docs/marca/montserrat.woff2`** (37956 bytes), usado solo por `docs/marca/logo.html:6-10` (`@font-face`, `font-weight: 100 900`) |

**Archivos `.woff2/.woff/.ttf/.otf/.eot` en los 6 repos: uno solo**, `yolotengo/docs/marca/montserrat.woff2`.

### sitio-web-songal: qué sirve para Core y qué no

**Fuente válida para Core**:
- Los 10 tokens de color de `app/globals.css:5-14`: `#00968e`, `#00766f`, `#e6f5f3`, `#1b1f2a`, `#2d3140`, `#f4f7fa`, `#e1e8f0`, `#b8c2cc`, `#8e9aa8`, `#ffffff`.
- `themeColor "#00968E"` (`layout.tsx:55`).
- Los logos PNG en `public/`: `logo-isotipo.png`, `logo-isotipo-white.png`, `logo-lockup-full.png`, `logo-lockup-mono.png`, `logo-lockup-white.png`, más favicons e íconos android/apple. **Sus colores internos no fueron verificados.**
- Las familias Montserrat y Geist Mono y sus pesos cargados. No hay archivos de fuente en el repo.

**No es fuente para Core**:
- La escala tipográfica: titulares de 36px a 96px con `leading-[1.05]`/`leading-[1.1]`.
- El espaciado: `py-24`, `lg:py-32`, `pt-32`, `lg:pt-40`, etc. El detalle completo está en el apéndice, bajo el aviso correspondiente.
- El verde de WhatsApp `#25D366`/`#1ebe5d` (`components/Contact.tsx:42`, `WhatsAppFloating.tsx:33`), que es de un tercero.
- Los SVG `file/globe/next/vercel/window.svg`, que son de la plantilla de Next y no se referencian.

**Fuera de alcance, pero lo vi**: `public/site.webmanifest:2-4` declara `"name": "Symdat - Business Intelligence"`, `"short_name": "Symdat"`. El manifest del sitio de marketing tiene el nombre de otro producto.

### Otras observaciones de tipografía

- **yolotengo `text-base` es ambiguo**: el tema define `--color-base` (`theme.css:18`) y Tailwind también tiene el tamaño `text-base`. Aparece junto a `text-xs`/`text-sm` en `app/admin/page.tsx:102` y `components/site-chrome.tsx:36,57`, aparentemente como color blanco. **No puedo determinar sin compilar si genera color, tamaño o ambos**, ni cuál de los dos tamaños gana.
- **symdat `body { font-size: 18px }`** (`index.css:23`) no afecta a las clases `text-*`, porque son rem sobre `html` a 16px. Sí afecta al texto que no tiene clase.

---

## Apéndice: inventario detallado por repo

Generado por script a partir de los clones. "Ubicaciones" usa `archivo:línea1,línea2`. Para cada repo:

1. Colores literales por alcance, agrupados por valor normalizado.
2. Combinaciones tipográficas con su resolución a px/peso.
3. Listas completas de tamaños, interlineados, pesos, familias, tracking, espaciado, radios, sombras, transiciones, clases de paleta por defecto y colores arbitrarios en clases, con su número de usos.

Los valores definidos en CSS fuera de clases (por ejemplo `.prose-report h2 { font-size: 1.25rem; font-weight: 600 }` en `IAnsurance/web/app/globals.css:30-44`, o el HTML inline de piatio y de los correos de lex) están en los archivos citados en §2, §4 y §7, y en la tabla siguiente.

| Repo | Estilos inline / CSS no-clase relevantes |
|---|---|
| IAnsurance | `.prose-report h2` 1.25rem/600 (`globals.css:31-32`); `h3` 1.05rem/600 (`:39-40`); `table` 0.9rem (`:63`); `th` 600 (`:76`); blockquote radio 4px (`:84`); `fade-in 0.4s ease-out` (`:93`); anillo `stroke-dashoffset 1s ease-out` (`page.tsx:321`) |
| lex-semaforo (correos, `lib/correo/plantillas.ts`) | font-size 11px (`:24`), 12px (`:28,67,155`), 13px (`:59,64,96,121`), 14px (`:37,148`), 18px/700/.05em mono (`:58`), 30px/700/.18em mono (`:95`); line-height 1.3 (`:25`), 1.6 (×12), 1.7 (`:59`), 1.8 (`:148`); radio 8px (`:23`), 6px (`:37,59,148`); padding 32px (`:23`), 16px (`:59,148`), `12px 20px` (`:37`) |
| piatio (`components/YardEditor.tsx`) | font-size 10px (×8), 11px (×3), 12px (×21), 13px (×1), 16px (×2); `fontSize: 10` / `fontWeight: 700` / `lineHeight: '12px'` (`:1663-1666`); letter-spacing .05em (×8); radio 6px (×9), 50% (×6); padding `3px 6px` (×16), `4px 8px` (×9); sombras `0 1px 3px rgba(0,0,0,.3)` (`:1878`), `0 0 2px rgba(0,0,0,.4)` (`:2280`), `0 1px 3px rgba(0,0,0,.4)` (`:2299`), `0 0 8px rgba(220,38,38,.45)` (`:2314`), `0 1px 2px rgba(0,0,0,.3)` (`:2321`); `shadow-[0_0_0_2px_rgba(0,150,142,0.18)]` (`app/disenar/page.tsx:1678`) |
| symdat | Recharts `fontSize` 9 (×8), 10 (×15), 11 (×33), 12 (×26), `'9px'`/`'10px'`/`'11px'`; `fontWeight: 700` (`VentasNewDashboard.js:62`); tooltip `borderRadius: '12px'` + `boxShadow: '0 8px 32px rgba(31, 38, 135, 0.3)'` (`CompactChart.js:38-41`, `Ventas.js:271`); `borderRadius: 8` (`CobranzaGraficos.js:23`); en `index.css` hay sombras `0 1px 3px rgba(0,0,0,0.1)`, `0 4px 6px rgba(0,0,0,0.1)`, `0 4px 15px rgba(…,0.3/0.4)`, `0 4px 20px`, `0 8px 30px`, `0 8px 32px`, `0 12px 40px` en `rgba(31, 38, 135, …)` y `rgba(0, 0, 0, 0.4)`, radios 12px/16px y `* { transition: all 0.3s ease }` |
| sitio-web-songal | `.marker-num` 0.75rem/500/0.1em (`globals.css:100-102`); animaciones `0.8s`/`1.2s cubic-bezier(0.16, 1, 0.3, 1)` (`:77,85`), `1s ease-out` (`:81`), `0.3s ease` (`:111`), `0.4s cubic-bezier(…)` + `0.4s ease` (`:120-121`); delays 100–600ms (`:90-95`); grilla `64px 64px` (`:134,141`) |
| yolotengo | `.eyebrow` 0.72rem/700/0.1em (`globals.css:26-28`); h1-h3 `-0.02em` (`:16`); `--radius-card: 14px` (`theme.css:24`); `--ease-out-expo` (`:25`) |

### sitio-web-songal

> **Fuente válida para Core**: los colores de abajo (salvo `#25D366`/`#1ebe5d`, verde de WhatsApp, y los SVG de plantilla de Next en `public/`, que no se referencian desde `app/`).


**Colores — alcance `produccion`** (32 literales, 17 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#ffffff` | `#FFFFFF`, `#fff`, `#ffffff` | 5 | `app/globals.css:14,23`; `public/globe.svg:1`; `public/site.webmanifest:24`; `public/vercel.svg:1` |
| `#25d366` | `#25D366` | 4 | `app/components/Contact.tsx:42`; `app/components/WhatsAppFloating.tsx:33` |
| `#00968e` | `#00968E`, `#00968e` | 3 | `app/globals.css:5`; `app/layout.tsx:55`; `public/site.webmanifest:23` |
| `#666666` | `#666` | 3 | `public/file.svg:1`; `public/globe.svg:1`; `public/window.svg:1` |
| `#000000` | `#000` | 2 | `public/next.svg:1` |
| `#1b1f2a` | `#1b1f2a` | 2 | `app/globals.css:8,24` |
| `rgba(225,232,240,0.4)` | `rgba(225, 232, 240, 0.4)` | 2 | `app/globals.css:132,133` |
| `rgba(255,255,255,0.03)` | `rgba(255, 255, 255, 0.03)` | 2 | `app/globals.css:139,140` |
| `#00766f` | `#00766f` | 1 | `app/globals.css:6` |
| `#1ebe5d` | `#1ebe5d` | 1 | `app/components/WhatsAppFloating.tsx:33` |
| `#2d3140` | `#2d3140` | 1 | `app/globals.css:9` |
| `#8e9aa8` | `#8e9aa8` | 1 | `app/globals.css:13` |
| `#b8c2cc` | `#b8c2cc` | 1 | `app/globals.css:12` |
| `#e1e8f0` | `#e1e8f0` | 1 | `app/globals.css:11` |
| `#e6f5f3` | `#e6f5f3` | 1 | `app/globals.css:7` |
| `#f4f7fa` | `#f4f7fa` | 1 | `app/globals.css:10` |
| `rgba(27,31,42,0.12)` | `rgba(27, 31, 42, 0.12)` | 1 | `app/globals.css:126` |

> **NO válido para Core**: todo lo que sigue (escala tipográfica, espaciado, radios, sombras y transiciones por clase) está afinado para la landing. Se inventaría para que conste, no como candidato.


**Escala tipográfica en uso (clases Tailwind, 15 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 5 | `text-xl font-display` | 20px | 28px | — (hereda) |  | `app/components/Contact.tsx:42` |
| 5 | `text-sm` | 14px | 20px | — (hereda) |  | `app/components/Footer.tsx:72` |
| 5 | `text-sm font-medium` | 14px | 20px | 500 |  | `app/components/Header.tsx:50` |
| 4 | `text-lg leading-relaxed` | 18px | 1.625 | — (hereda) |  | `app/components/Contact.tsx:27` |
| 4 | `text-base font-medium` | 16px | 24px | 500 |  | `app/components/Header.tsx:100` |
| 3 | `lg:text-5xl text-4xl xl:text-6xl leading-[1.05] font-display tracking-tight` | 36px | 1.05 | — (hereda) | `lg:text-5xl xl:text-6xl` | `app/components/Contact.tsx:23` |
| 2 | `font-medium` | — | — | 500 |  | `app/components/Hero.tsx:28` |
| 2 | `lg:text-5xl text-4xl leading-[1.1] font-display tracking-tight` | 36px | 1.1 | — (hereda) | `lg:text-5xl` | `app/components/Portfolio.tsx:89` |
| 2 | `text-sm leading-relaxed` | 14px | 1.625 | — (hereda) |  | `app/components/Portfolio.tsx:135` |
| 1 | `lg:text-7xl sm:text-6xl text-5xl xl:text-8xl leading-[1.05] font-display tracking-tight` | 48px | 1.05 | — (hereda) | `lg:text-7xl sm:text-6xl xl:text-8xl` | `app/components/Hero.tsx:18` |
| 1 | `lg:text-xl text-lg leading-relaxed` | 18px | 1.625 | — (hereda) | `lg:text-xl` | `app/components/Hero.tsx:26` |
| 1 | `text-xs font-medium` | 12px | 16px | 500 |  | `app/components/Portfolio.tsx:122` |
| 1 | `text-xl leading-tight font-display` | 20px | 1.25 | — (hereda) |  | `app/components/Portfolio.tsx:132` |
| 1 | `text-2xl leading-tight font-display` | 24px | 1.25 | — (hereda) |  | `app/components/Portfolio.tsx:198` |
| 1 | `lg:text-4xl text-3xl leading-tight font-display` | 30px | 1.25 | — (hereda) | `lg:text-4xl` | `app/components/Services.tsx:79` |
| 1 | `text-2xl font-display` | 24px | 32px | — (hereda) |  | `app/components/ValueProps.tsx:80` |
| 1 | `text-base font-display` | 16px | 24px | — (hereda) |  | `app/components/WhatsAppMenu.tsx:68` |
| 1 | `text-sm leading-snug` | 14px | 1.375 | — (hereda) |  | `app/components/WhatsAppMenu.tsx:71` |
| 1 | `lg:text-3xl text-2xl font-display` | 24px | 32px | — (hereda) | `lg:text-3xl` | `app/components/WhyUs.tsx:53` |
| 1 | `lg:text-5xl text-4xl leading-tight font-display tracking-tight` | 36px | 1.25 | — (hereda) | `lg:text-5xl` | `app/privacidad/page.tsx:15` |

- **Tamaños** (17 distintos, 56 usos): `text-sm`×13 · `lg:text-5xl`×6 · `text-4xl`×6 · `text-xl`×6 · `text-base`×5 · `text-lg`×5 · `text-2xl`×3 · `xl:text-6xl`×3 · `lg:text-3xl`×1 · `lg:text-4xl`×1 · `lg:text-7xl`×1 · `lg:text-xl`×1 · `sm:text-6xl`×1 · `text-3xl`×1 · `text-5xl`×1 · `text-xs`×1 · `xl:text-8xl`×1

- **Interlineado** (5 distintos, 24 usos): `leading-relaxed`×13 · `leading-[1.05]`×4 · `leading-tight`×4 · `leading-[1.1]`×2 · `leading-snug`×1

- **Peso** (1 distintos, 12 usos): `font-medium`×12

- **Familia (utilidad)** (1 distintos, 19 usos): `font-display`×19

- **Tracking** (1 distintos, 7 usos): `tracking-tight`×7

- **Espaciado** (102 distintos, 207 usos): `px-6`×13 · `lg:px-8`×9 · `mt-4`×9 · `mx-auto`×9 · `mt-2`×7 · `mt-16`×6 · `gap-2`×5 · `lg:py-32`×5 · `py-24`×5 · `gap-4`×4 · `inset-0`×4 · `mb-1`×4 · `mt-6`×4 · `px-3`×4 · `py-4`×4 · `gap-6`×3 · `mb-3`×3 · `mb-5`×3 · `mt-1`×3 · `mt-12`×3 · `mt-3`×3 · `px-5`×3 · `space-y-1`×3 · `space-y-3`×3 · `gap-1.5`×2 · `gap-12`×2 · `gap-3`×2 · `lg:mt-20`×2 · `pt-8`×2 · `px-7`×2 · `py-2.5`×2 · `py-3`×2 · `right-0`×2 · `top-0`×2 · `-left-20`×1 · `-mt-2`×1 · `-right-32`×1 · `-top-20`×1 · `bottom-0`×1 · `bottom-5`×1 · `gap-1`×1 · `gap-5`×1 · `gap-8`×1 · `gap-x-2`×1 · `gap-x-8`×1 · `gap-y-12`×1 · `gap-y-3`×1 · `hover:gap-3`×1 · `left-0`×1 · `left-8`×1 · `lg:gap-10`×1 · `lg:gap-16`×1 · `lg:gap-6`×1 · `lg:gap-8`×1 · `lg:mt-10`×1 · `lg:mt-14`×1 · `lg:mt-24`×1 · `lg:p-10`×1 · `lg:pb-32`×1 · `lg:pl-8`×1 · `lg:pt-40`×1 · `lg:py-14`×1 · `lg:py-20`×1 · `lg:py-24`×1 · `mb-8`×1 · `md:gap-1.5`×1 · `ml-2`×1 · `mt-0.5`×1 · `mt-10`×1 · `mt-5`×1 · `mt-8`×1 · `p-4`×1 · `p-5`×1 · `p-8`×1 · `pb-20`×1 · `pb-4`×1 · `pb-5`×1 · `pb-6`×1 · `pt-2`×1 · `pt-3`×1 · `pt-32`×1 · `pt-6`×1 · `py-1`×1 · `py-1.5`×1 · `py-10`×1 · `py-16`×1 · `py-20`×1 · `py-5`×1 · `right-4`×1 · `right-5`×1 · `right-6`×1 · `right-8`×1 · `sm:bottom-6`×1 · `sm:gap-x-8`×1 · `sm:ml-8`×1 · `sm:p-8`×1 · `sm:px-8`×1 · `sm:right-6`×1 · `space-y-10`×1 · `space-y-6`×1 · `top-4`×1 · `top-6`×1

- **Border-radius** (4 distintos, 16 usos): `rounded-full`×10 · `rounded-2xl`×3 · `rounded-lg`×2 · `rounded-xl`×1

- **Box-shadow** (3 distintos, 4 usos): `shadow-sm`×2 · `shadow-2xl`×1 · `shadow-lg`×1

- **Transición / animación** (14 distintos, 54 usos): `transition-colors`×21 · `duration-300`×6 · `animate-fade-up`×5 · `transition-all`×5 · `duration-500`×4 · `transition-transform`×3 · `animate-fade-in`×2 · `transition`×2 · `delay-100`×1 · `delay-200`×1 · `delay-300`×1 · `delay-400`×1 · `duration-200`×1 · `transition-opacity`×1

- **Clases de la paleta por defecto de Tailwind**: ninguno.

- **Colores arbitrarios en clases** (5 distintos, 5 usos): `bg-[#25D366]`×1 · `hover:bg-[#1ebe5d]`×1 · `hover:shadow-[#25D366]/50`×1 · `hover:text-[#25D366]`×1 · `shadow-[#25D366]/30`×1

### symdat


**Colores — alcance `produccion`** (485 literales, 127 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#1b1f2a` | `#1B1F2A` | 33 | `frontend/public/favicon.svg:1`; `frontend/public/index.html:10`; `frontend/public/manifest.json:12`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1` |
| `#10b981` | `#10B981`, `#10b981` | 30 | `frontend/src/index.css:272,375,424`; `frontend/src/components/TablaSKUExpandible.js:183`; `frontend/src/modules/ComexDashboard.js:14`; `frontend/src/modules/Contabilidad.js:115,134`; `frontend/src/modules/Finanzas.js:143`; `frontend/src/modules/GerenciaGeneral.js:164`; `frontend/src/modules/Inventario.js:25,216`; `frontend/src/modules/InventarioDashboard.js:15,27`; `frontend/src/modules/Logistica.js:143`; `frontend/src/modules/RRHH.js:147`; `frontend/src/modules/ServicioTecnico.js:141`; `frontend/src/modules/Ventas.js:285`; `frontend/src/modules/VentasNew.js:56,84,206,244,265,333`; `frontend/src/modules/VentasNewDashboard.js:1791,1914`; `frontend/src/modules/VentasNewSimple.js:154,476,737,753`; `frontend/src/modules/VentasOptimizado.js:227` |
| `#3b82f6` | `#3B82F6`, `#3b82f6` | 23 | `frontend/src/modules/ComexDashboard.js:13`; `frontend/src/modules/Contabilidad.js:117,135`; `frontend/src/modules/Finanzas.js:156`; `frontend/src/modules/GerenciaGeneral.js:174`; `frontend/src/modules/Inventario.js:24,217`; `frontend/src/modules/InventarioDashboard.js:14,22,27`; `frontend/src/modules/Logistica.js:153`; `frontend/src/modules/RRHH.js:137`; `frontend/src/modules/ServicioTecnico.js:151`; `frontend/src/modules/Ventas.js:290`; `frontend/src/modules/VentasNew.js:56,208,226`; `frontend/src/modules/VentasNewDashboard.js:1790,1913`; `frontend/src/modules/VentasNewSimple.js:154,477,737`; `frontend/src/modules/VentasOptimizado.js:213` |
| `#e5e7eb` | `#E5E7EB`, `#e5e7eb` | 19 | `frontend/src/index.css:11,92,292,298`; `frontend/src/components/ThemeSelector.js:56,62`; `frontend/src/components/cobranza/CobranzaGraficos.js:23`; `frontend/src/modules/ComexDashboard.js:266,331,353,425`; `frontend/src/modules/InventarioDashboard.js:421,538`; `frontend/src/modules/VentasNewDashboard.js:61`; `frontend/src/modules/abastecimiento/PanelSalud.js:195,266`; `frontend/src/modules/admin/PanelActividad.js:193,211,227` |
| `#6b7280` | `#6B7280`, `#6b7280` | 16 | `frontend/src/index.css:10,84`; `frontend/src/components/ThemeSelector.js:55,61`; `frontend/src/components/cobranza/common.js:124`; `frontend/src/components/cobranza/TablaCartera.js:504`; `frontend/src/modules/ComexDashboard.js:21`; `frontend/src/modules/InventarioDashboard.js:19`; `frontend/src/modules/VentasNewDashboard.js:1897,1903`; `frontend/src/modules/abastecimiento/PanelSalud.js:197,198,203,267,268`; `frontend/src/modules/abastecimiento/salud.js:38` |
| `#f59e0b` | `#F59E0B`, `#f59e0b` | 15 | `frontend/src/index.css:278,430`; `frontend/src/modules/ComexDashboard.js:15`; `frontend/src/modules/Inventario.js:26`; `frontend/src/modules/InventarioDashboard.js:16,27`; `frontend/src/modules/Ventas.js:300`; `frontend/src/modules/VentasNew.js:56,85,207,245`; `frontend/src/modules/VentasNewDashboard.js:1945,1947`; `frontend/src/modules/VentasNewSimple.js:154,737` |
| `#ffffff` | `#FFFFFF`, `#ffffff` | 15 | `frontend/public/manifest.json:13`; `frontend/src/index.css:7,291,297,303,327,335,341,346,384,444`; `frontend/src/components/ThemeSelector.js:52,58`; `frontend/src/components/cobranza/CobranzaGraficos.js:346`; `frontend/src/components/cobranza/common.js:128` |
| `#ef4444` | `#EF4444`, `#ef4444` | 12 | `frontend/src/index.css:284,379,436`; `frontend/src/components/TablaSKUExpandible.js:183`; `frontend/src/modules/ComexDashboard.js:17`; `frontend/src/modules/Contabilidad.js:116`; `frontend/src/modules/InventarioDashboard.js:17,27`; `frontend/src/modules/VentasNew.js:56,246`; `frontend/src/modules/VentasNewSimple.js:154,737` |
| `#d1d5db` | `#d1d5db` | 11 | `frontend/src/index.css:76,88,101,135,176,190,201`; `frontend/src/components/ThemeSelector.js:49`; `frontend/src/components/cobranza/common.js:87`; `frontend/src/modules/bitacora/Analisis.js:26,27` |
| `#8b5cf6` | `#8B5CF6`, `#8b5cf6` | 10 | `frontend/src/modules/ComexDashboard.js:19`; `frontend/src/modules/Inventario.js:27`; `frontend/src/modules/InventarioDashboard.js:27`; `frontend/src/modules/Ventas.js:295`; `frontend/src/modules/VentasNew.js:56`; `frontend/src/modules/VentasNewSimple.js:154,478,737,753,976` |
| `#f9fafb` | `#f9fafb` | 10 | `frontend/src/index.css:68,72,130,143,185,195,214,227`; `frontend/src/components/ThemeSelector.js:48,53` |
| `#667eea` | `#667eea` | 9 | `frontend/src/index.css:21,28,220,319,358,407,453`; `frontend/src/components/CompactChart.js:16,83` |
| `#f8fafc` | `#f8fafc` | 9 | `frontend/src/index.css:8,33,291,297,327,335,346,384`; `frontend/src/components/ThemeSelector.js:59` |
| `#111827` | `#111827` | 7 | `frontend/src/index.css:9,38,166,314`; `frontend/src/components/ThemeSelector.js:46,54,60` |
| `#764ba2` | `#764ba2` | 7 | `frontend/src/index.css:21,28,319,358,407,453`; `frontend/src/components/CompactChart.js:83` |
| `#8884d8` | `#8884D8`, `#8884d8` | 7 | `frontend/src/modules/ERPCliente.js:113,338,377`; `frontend/src/modules/Inventario.js:233`; `frontend/src/modules/VentasNew.js:285`; `frontend/src/modules/VentasNewDashboard.js:1822,1827` |
| `#8e9aa8` | `#8E9AA8` | 7 | `frontend/public/favicon.svg:1`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1`; `frontend/src/components/SurmetricFooter.js:7` |
| `#e1e8f0` | `#E1E8F0` | 7 | `frontend/public/favicon.svg:1`; `frontend/src/App.js:75`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1` |
| `rgba(75,85,99,0.3)` | `rgba(75, 85, 99, 0.3)` | 7 | `frontend/src/index.css:44,59,109,171,196,228,241` |
| `#00968e` | `#00968E` | 6 | `frontend/public/favicon.svg:1`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1`; `frontend/src/components/SurmetricFooter.js:14,23,28` |
| `#14b8a6` | `#14B8A6`, `#14b8a6` | 6 | `frontend/src/modules/ComexDashboard.js:20`; `frontend/src/modules/InventarioDashboard.js:27`; `frontend/src/modules/VentasNewSimple.js:156,769`; `frontend/src/modules/bitacora/Analisis.js:29,150` |
| `#1f7a8c` | `#1f7a8c` | 6 | `frontend/src/components/cobranza/CobranzaGraficos.js:32,242,308,346,364` |
| `#9ca3af` | `#9CA3AF`, `#9ca3af` | 6 | `frontend/src/index.css:80,139`; `frontend/src/modules/InventarioDashboard.js:23`; `frontend/src/modules/VentasNewDashboard.js:62`; `frontend/src/modules/abastecimiento/PanelSalud.js:202`; `frontend/src/modules/admin/PanelMetas.js:345` |
| `#b8c2cc` | `#B8C2CC` | 6 | `frontend/public/favicon.svg:1`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1` |
| `#f97316` | `#F97316`, `#f97316` | 6 | `frontend/src/modules/ComexDashboard.js:16`; `frontend/src/modules/InventarioDashboard.js:27,435`; `frontend/src/modules/VentasNewSimple.js:155,769`; `frontend/src/modules/bitacora/formato.js:65` |
| `rgba(31,38,135,0.3)` | `rgba(31, 38, 135, 0.3)` | 6 | `frontend/src/index.css:161,481`; `frontend/src/components/CompactChart.js:38,71,104`; `frontend/src/modules/Ventas.js:271` |
| `#6366f1` | `#6366F1`, `#6366f1` | 5 | `frontend/src/modules/ComexDashboard.js:18`; `frontend/src/modules/InventarioDashboard.js:18`; `frontend/src/modules/VentasNew.js:321`; `frontend/src/modules/VentasNewSimple.js:155,769` |
| `#dc2626` | `#dc2626` | 5 | `frontend/src/index.css:436`; `frontend/src/modules/VentasNewDashboard.js:68`; `frontend/src/modules/admin/PanelActividad.js:199`; `frontend/src/modules/admin/PanelAreasComerciales.js:24`; `frontend/src/modules/bitacora/formato.js:65` |
| `rgba(0,0,0,0.1)` | `rgba(0, 0, 0, 0.1)` | 5 | `frontend/src/index.css:149,293,299,304,310` |
| `rgba(255,255,255,0.95)` | `rgba(255, 255, 255, 0.95)` | 5 | `frontend/src/index.css:158`; `frontend/src/components/CompactChart.js:39,72,105`; `frontend/src/modules/Ventas.js:272` |
| `#00766f` | `#00766F` | 4 | `frontend/public/favicon.svg:1`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1`; `frontend/src/components/SurmetricFooter.js:14` |
| `#4b5563` | `#4b5563` | 4 | `frontend/src/index.css:105,153,154,175` |
| `#7c3aed` | `#7c3aed` | 4 | `frontend/src/index.css:461`; `frontend/src/modules/VentasNewSimple.js:157`; `frontend/src/modules/admin/PanelActividad.js:231`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#c0392b` | `#c0392b` | 4 | `frontend/src/components/cobranza/CobranzaGraficos.js:242`; `frontend/src/components/cobranza/common.js:59,64`; `frontend/src/modules/Cobranza.js:326` |
| `#e2703a` | `#e2703a` | 4 | `frontend/src/components/cobranza/CobranzaGraficos.js:242`; `frontend/src/components/cobranza/common.js:58,63`; `frontend/src/modules/Cobranza.js:329` |
| `#ec4899` | `#EC4899`, `#ec4899` | 4 | `frontend/src/modules/InventarioDashboard.js:27`; `frontend/src/modules/VentasNew.js:56`; `frontend/src/modules/VentasNewSimple.js:155,753` |
| `#eef0f2` | `#eef0f2` | 4 | `frontend/src/components/cobranza/CobranzaGraficos.js:215,264,304,357` |
| `rgba(255,255,255,0.2)` | `rgba(255, 255, 255, 0.2)` | 4 | `frontend/src/index.css:329,348,386,420` |
| `rgba(31,38,135,0.15)` | `rgba(31, 38, 135, 0.15)` | 4 | `frontend/src/index.css:330,353,392,473` |
| `rgba(75,85,99,0.2)` | `rgba(75, 85, 99, 0.2)` | 4 | `frontend/src/index.css:64,200,245,249` |
| `#00b2ac` | `#00B2AC` | 3 | `frontend/public/favicon.svg:1`; `frontend/src/assets/surdat-lockup-navbar.svg:1`; `frontend/src/assets/surdat-lockup.svg:1` |
| `#06b6d4` | `#06b6d4` | 3 | `frontend/src/modules/VentasNewSimple.js:155,753,769` |
| `#0f9d76` | `#0f9d76` | 3 | `frontend/src/components/cobranza/common.js:54,60`; `frontend/src/modules/Cobranza.js:338` |
| `#16a34a` | `#16a34a` | 3 | `frontend/src/modules/VentasNewDashboard.js:68`; `frontend/src/modules/admin/PanelActividad.js:198`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#2563eb` | `#2563eb` | 3 | `frontend/src/modules/admin/PanelActividad.js:200,215`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#84cc16` | `#84cc16` | 3 | `frontend/src/modules/VentasNewSimple.js:155,753,769` |
| `#eef2ff` | `#eef2ff` | 3 | `frontend/src/components/cobranza/common.js:86`; `frontend/src/components/cobranza/TablaCartera.js:589`; `frontend/src/modules/abastecimiento/PanelSalud.js:269` |
| `#f0c419` | `#f0c419` | 3 | `frontend/src/components/cobranza/CobranzaGraficos.js:242`; `frontend/src/components/cobranza/common.js:56,62` |
| `rgba(0,0,0,0.4)` | `rgba(0, 0, 0, 0.4)` | 3 | `frontend/src/index.css:54,126,181` |
| `rgba(31,41,55,0.95)` | `rgba(31, 41, 55, 0.95)` | 3 | `frontend/src/index.css:113,123,180` |
| `rgba(55,65,81,0.5)` | `rgba(55, 65, 81, 0.5)` | 3 | `frontend/src/index.css:194,232,254` |
| `rgba(75,85,99,0.5)` | `rgba(75, 85, 99, 0.5)` | 3 | `frontend/src/index.css:114,213,236` |
| `#0088fe` | `#0088FE` | 2 | `frontend/src/modules/ERPCliente.js:113`; `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#00c49f` | `#00C49F` | 2 | `frontend/src/modules/ERPCliente.js:113`; `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#059669` | `#059669` | 2 | `frontend/src/index.css:424`; `frontend/src/modules/abastecimiento/PanelSalud.js:20` |
| `#0891b2` | `#0891b2` | 2 | `frontend/src/modules/VentasNewSimple.js:157`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#1f2937` | `#1f2937` | 2 | `frontend/src/components/ThemeSelector.js:47`; `frontend/src/components/cobranza/common.js:128` |
| `#22c55e` | `#22C55E`, `#22c55e` | 2 | `frontend/src/modules/InventarioDashboard.js:21`; `frontend/src/modules/VentasNewSimple.js:156` |
| `#82ca9d` | `#82CA9D`, `#82ca9d` | 2 | `frontend/src/modules/ERPCliente.js:355`; `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#8fbf3f` | `#8fbf3f` | 2 | `frontend/src/components/cobranza/common.js:55,61` |
| `#d97706` | `#d97706` | 2 | `frontend/src/index.css:430`; `frontend/src/modules/abastecimiento/PanelSalud.js:18` |
| `#db2777` | `#db2777` | 2 | `frontend/src/modules/VentasNewSimple.js:157`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#ea580c` | `#ea580c` | 2 | `frontend/src/modules/abastecimiento/PanelSalud.js:17`; `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#f1f5f9` | `#f1f5f9` | 2 | `frontend/src/index.css:303,341` |
| `#ff8042` | `#FF8042` | 2 | `frontend/src/modules/ERPCliente.js:113`; `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#ffbb28` | `#FFBB28` | 2 | `frontend/src/modules/ERPCliente.js:113`; `frontend/src/modules/VentasNewDashboard.js:1827` |
| `rgba(255,255,255,0.1)` | `rgba(255, 255, 255, 0.1)` | 2 | `frontend/src/index.css:477,480` |
| `rgba(31,38,135,0.1)` | `rgba(31, 38, 135, 0.1)` | 2 | `frontend/src/index.css:387,448` |
| `rgba(31,41,55,0.8)` | `rgba(31, 41, 55, 0.8)` | 2 | `frontend/src/index.css:43,226` |
| `rgba(55,65,81,0.8)` | `rgba(55, 65, 81, 0.8)` | 2 | `frontend/src/index.css:212,258` |
| `#0d9488` | `#0d9488` | 1 | `frontend/src/modules/bitacora/formato.js:65` |
| `#0ea5e9` | `#0ea5e9` | 1 | `frontend/src/modules/VentasNewSimple.js:156` |
| `#0f766e` | `#0f766e` | 1 | `frontend/src/modules/bitacora/Analisis.js:29` |
| `#34d399` | `#34d399` | 1 | `frontend/src/index.css:272` |
| `#374151` | `#374151` | 1 | `frontend/src/components/ThemeSelector.js:50` |
| `#4338ca` | `#4338ca` | 1 | `frontend/src/components/cobranza/common.js:86` |
| `#45b7d1` | `#45B7D1` | 1 | `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#4c1d95` | `#4c1d95` | 1 | `frontend/src/index.css:461` |
| `#4ecdc4` | `#4ECDC4` | 1 | `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#4f46e5` | `#4f46e5` | 1 | `frontend/src/modules/abastecimiento/PanelSalud.js:19` |
| `#4facfe` | `#4facfe` | 1 | `frontend/src/components/CompactChart.js:83` |
| `#60a5fa` | `#60a5fa` | 1 | `frontend/src/index.css:264` |
| `#65a30d` | `#65a30d` | 1 | `frontend/src/modules/admin/PanelAreasComerciales.js:24` |
| `#7c5cbf` | `#7c5cbf` | 1 | `frontend/src/modules/Cobranza.js:332` |
| `#8a6d1f` | `#8a6d1f` | 1 | `frontend/src/components/cobranza/CobranzaGraficos.js:316` |
| `#a78bfa` | `#a78bfa` | 1 | `frontend/src/index.css:264` |
| `#a855f7` | `#a855f7` | 1 | `frontend/src/modules/VentasNewSimple.js:156` |
| `#c3cfe2` | `#c3cfe2` | 1 | `frontend/src/index.css:323` |
| `#c8a03c` | `#c8a03c` | 1 | `frontend/src/components/cobranza/CobranzaGraficos.js:315` |
| `#ca8a04` | `#ca8a04` | 1 | `frontend/src/modules/VentasNewDashboard.js:68` |
| `#d946ef` | `#d946ef` | 1 | `frontend/src/modules/VentasNewSimple.js:156` |
| `#dcfce7` | `#dcfce7` | 1 | `frontend/src/modules/VentasNewDashboard.js:69` |
| `#e2e8f0` | `#e2e8f0` | 1 | `frontend/src/index.css:444` |
| `#eab308` | `#eab308` | 1 | `frontend/src/modules/VentasNewSimple.js:157` |
| `#f093fb` | `#f093fb` | 1 | `frontend/src/components/CompactChart.js:83` |
| `#f39c39` | `#f39c39` | 1 | `frontend/src/components/cobranza/common.js:57` |
| `#f3f4f6` | `#f3f4f6` | 1 | `frontend/src/components/cobranza/TablaCartera.js:504` |
| `#f43f5e` | `#f43f5e` | 1 | `frontend/src/modules/VentasNewSimple.js:157` |
| `#f5576c` | `#f5576c` | 1 | `frontend/src/components/CompactChart.js:83` |
| `#f5f7fa` | `#f5f7fa` | 1 | `frontend/src/index.css:323` |
| `#f87171` | `#f87171` | 1 | `frontend/src/index.css:284` |
| `#fbbf24` | `#fbbf24` | 1 | `frontend/src/index.css:278` |
| `#fee2e2` | `#fee2e2` | 1 | `frontend/src/modules/VentasNewDashboard.js:69` |
| `#fef9c3` | `#fef9c3` | 1 | `frontend/src/modules/VentasNewDashboard.js:69` |
| `#ff6b6b` | `#FF6B6B` | 1 | `frontend/src/modules/VentasNewDashboard.js:1827` |
| `#ffc658` | `#FFC658` | 1 | `frontend/src/modules/VentasNewDashboard.js:1827` |
| `hsl(${tono},80%,${luz}%)` | `hsl(${tono}, 80%, ${luz}%)` | 1 | `frontend/src/modules/abastecimiento/salud.js:41` |
| `rgb(${mezcla.join(',')})` | `rgb(${mezcla.join(',')})` | 1 | `frontend/src/components/cobranza/common.js:127` |
| `rgba(102,126,234,0.1)` | `rgba(102, 126, 234, 0.1)` | 1 | `frontend/src/index.css:221` |
| `rgba(16,185,129,0.3)` | `rgba(16, 185, 129, 0.3)` | 1 | `frontend/src/index.css:426` |
| `rgba(17,24,39,0.8)` | `rgba(17, 24, 39, 0.8)` | 1 | `frontend/src/index.css:63` |
| `rgba(229,231,235,0.5)` | `rgba(229, 231, 235, 0.5)` | 1 | `frontend/src/index.css:309` |
| `rgba(239,68,68,0.3)` | `rgba(239, 68, 68, 0.3)` | 1 | `frontend/src/index.css:438` |
| `rgba(245,158,11,0.3)` | `rgba(245, 158, 11, 0.3)` | 1 | `frontend/src/index.css:432` |
| `rgba(248,113,113,0.4)` | `rgba(248, 113, 113, 0.4)` | 1 | `frontend/src/index.css:286` |
| `rgba(251,191,36,0.4)` | `rgba(251, 191, 36, 0.4)` | 1 | `frontend/src/index.css:280` |
| `rgba(255,255,255,.97)` | `rgba(255,255,255,.97)` | 1 | `frontend/src/components/cobranza/CobranzaGraficos.js:24` |
| `rgba(255,255,255,0.18)` | `rgba(255, 255, 255, 0.18)` | 1 | `frontend/src/index.css:472` |
| `rgba(255,255,255,0.25)` | `rgba(255, 255, 255, 0.25)` | 1 | `frontend/src/index.css:469` |
| `rgba(255,255,255,0.8)` | `rgba(255, 255, 255, 0.8)` | 1 | `frontend/src/index.css:308` |
| `rgba(31,38,135,0.25)` | `rgba(31, 38, 135, 0.25)` | 1 | `frontend/src/index.css:340` |
| `rgba(31,41,55,0.6)` | `rgba(31, 41, 55, 0.6)` | 1 | `frontend/src/index.css:58` |
| `rgba(31,41,55,0.9)` | `rgba(31, 41, 55, 0.9)` | 1 | `frontend/src/index.css:48` |
| `rgba(52,211,153,0.4)` | `rgba(52, 211, 153, 0.4)` | 1 | `frontend/src/index.css:274` |
| `rgba(55,65,81,0.3)` | `rgba(55, 65, 81, 0.3)` | 1 | `frontend/src/index.css:205` |
| `rgba(55,65,81,0.9)` | `rgba(55, 65, 81, 0.9)` | 1 | `frontend/src/index.css:53` |
| `rgba(75,85,99,0.4)` | `rgba(75, 85, 99, 0.4)` | 1 | `frontend/src/index.css:49` |

**Colores — alcance `test`** (5 literales, 5 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#eef2ff` | `#eef2ff` | 1 | `frontend/src/components/cobranza/common.test.js:49` |
| `rgb(celdatramo('enplazo',50e6))` | `rgb(celdaTramo('En Plazo', 50e6))` | 1 | `frontend/src/components/cobranza/common.test.js:35` |
| `rgb(celdatramo('vencido+120',0.5e6))` | `rgb(celdaTramo('Vencido +120', 0.5e6))` | 1 | `frontend/src/components/cobranza/common.test.js:42` |
| `rgb(celdatramo('vencido+120',50e6))` | `rgb(celdaTramo('Vencido +120', 50e6))` | 1 | `frontend/src/components/cobranza/common.test.js:36` |
| `rgb(celdatramo('vencido+120',85e6))` | `rgb(celdaTramo('Vencido +120', 85e6))` | 1 | `frontend/src/components/cobranza/common.test.js:43` |

**Colores — alcance `backup`** (5 literales, 4 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#ef4444` | `#ef4444` | 2 | `frontend/src/services/ventasDashboardService.js.backup:359,435` |
| `#10b981` | `#10b981` | 1 | `frontend/src/services/ventasDashboardService.js.backup:381` |
| `#3b82f6` | `#3b82f6` | 1 | `frontend/src/services/ventasDashboardService.js.backup:417` |
| `#f59e0b` | `#f59e0b` | 1 | `frontend/src/services/ventasDashboardService.js.backup:399` |

**Colores — alcance `backend`** (12 literales, 12 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#10b981` | `#10B981` | 1 | `backend/src/controllers/comexKPIsController.js:210` |
| `#16a34a` | `#16a34a` | 1 | `backend/src/utils/seedAreasComerciales.js:17` |
| `#2563eb` | `#2563eb` | 1 | `backend/src/utils/seedAreasComerciales.js:12` |
| `#3b82f6` | `#3B82F6` | 1 | `backend/src/controllers/comexKPIsController.js:204` |
| `#6366f1` | `#6366F1` | 1 | `backend/src/controllers/comexKPIsController.js:205` |
| `#6b7280` | `#6b7280` | 1 | `backend/src/models/AreaComercial.js:21` |
| `#8b5cf6` | `#8B5CF6` | 1 | `backend/src/controllers/comexKPIsController.js:209` |
| `#9ca3af` | `#9ca3af` | 1 | `backend/src/controllers/informeVendedorController.js:365` |
| `#ea580c` | `#ea580c` | 1 | `backend/src/utils/seedAreasComerciales.js:22` |
| `#ef4444` | `#EF4444` | 1 | `backend/src/controllers/comexKPIsController.js:208` |
| `#f59e0b` | `#F59E0B` | 1 | `backend/src/controllers/comexKPIsController.js:206` |
| `#f97316` | `#F97316` | 1 | `backend/src/controllers/comexKPIsController.js:207` |

**Colores — alcance `config-huerfana`** (13 literales, 13 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#16a34a` | `#16a34a` | 1 | `tailwind.config.js:18` |
| `#1d4ed8` | `#1d4ed8` | 1 | `tailwind.config.js:13` |
| `#22c55e` | `#22c55e` | 1 | `tailwind.config.js:17` |
| `#2563eb` | `#2563eb` | 1 | `tailwind.config.js:12` |
| `#3b82f6` | `#3b82f6` | 1 | `tailwind.config.js:11` |
| `#d97706` | `#d97706` | 1 | `tailwind.config.js:23` |
| `#dc2626` | `#dc2626` | 1 | `tailwind.config.js:28` |
| `#ef4444` | `#ef4444` | 1 | `tailwind.config.js:27` |
| `#eff6ff` | `#eff6ff` | 1 | `tailwind.config.js:10` |
| `#f0fdf4` | `#f0fdf4` | 1 | `tailwind.config.js:16` |
| `#f59e0b` | `#f59e0b` | 1 | `tailwind.config.js:22` |
| `#fef2f2` | `#fef2f2` | 1 | `tailwind.config.js:26` |
| `#fffbeb` | `#fffbeb` | 1 | `tailwind.config.js:21` |

**Colores — alcance `doc-mockup`** (64 literales, 42 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#6b7280` | `#6b7280` | 5 | `mockup_surdat_tooltip_badges.html:12`; `docs/mockups/bitacora-analitica.html:245,247,271` |
| `#ffffff` | `#fff`, `#ffffff` | 5 | `mockup_surdat_tooltip_badges.html:9,89,100,163`; `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:188` |
| `#0f766e` | `#0f766e` | 4 | `docs/mockups/bitacora-analitica.html:11,12,246,248` |
| `#1f2330` | `#1f2330` | 3 | `mockup_surdat_tooltip_badges.html:11,100,118` |
| `#9ca3af` | `#9ca3af` | 3 | `docs/mockups/bitacora-analitica.html:243,270` |
| `#0d9488` | `#0d9488` | 2 | `docs/mockups/bitacora-analitica.html:11,269` |
| `#14b8a6` | `#14b8a6` | 2 | `docs/mockups/bitacora-analitica.html:12,248` |
| `#78350f` | `#78350f` | 2 | `mockup_surdat_tooltip_badges.html:45,56` |
| `#b45309` | `#b45309` | 2 | `mockup_surdat_tooltip_badges.html:17`; `docs/mockups/bitacora-analitica.html:246` |
| `#dc2626` | `#dc2626` | 2 | `mockup_surdat_tooltip_badges.html:15`; `docs/mockups/bitacora-analitica.html:269` |
| `#e5e7eb` | `#e5e7eb` | 2 | `docs/mockups/bitacora-analitica.html:244` |
| `#f4f7fa` | `#F4F7FA` | 2 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:92,171` |
| `#00766f` | `#00766F` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:88` |
| `#00968e` | `#00968E` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:87` |
| `#059669` | `#059669` | 1 | `mockup_surdat_tooltip_badges.html:20` |
| `#134e4a` | `#134e4a` | 1 | `docs/mockups/bitacora-analitica.html:248` |
| `#1b1f2a` | `#1B1F2A` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:90` |
| `#2d3140` | `#2D3140` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:91` |
| `#5b3bd4` | `#5b3bd4` | 1 | `mockup_surdat_tooltip_badges.html:13` |
| `#5eead4` | `#5eead4` | 1 | `docs/mockups/bitacora-analitica.html:12` |
| `#66663388` | `#6638` | 1 | `scripts/skualo/sync_comprobantes.py:105` |
| `#66665511` | `#6651` | 1 | `scripts/skualo/sync_comprobantes.py:105` |
| `#86e4c0` | `#86e4c0` | 1 | `mockup_surdat_tooltip_badges.html:134` |
| `#8e9aa8` | `#8E9AA8` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:95` |
| `#b8c2cc` | `#B8C2CC` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:94` |
| `#b91c1c` | `#b91c1c` | 1 | `docs/mockups/bitacora-analitica.html:247` |
| `#ccfbf1` | `#ccfbf1` | 1 | `docs/mockups/bitacora-analitica.html:12` |
| `#d1fae5` | `#d1fae5` | 1 | `mockup_surdat_tooltip_badges.html:21` |
| `#e1e8f0` | `#E1E8F0` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:93` |
| `#e6e8ef` | `#e6e8ef` | 1 | `mockup_surdat_tooltip_badges.html:10` |
| `#e6f5f3` | `#E6F5F3` | 1 | `.claude/skills/analisis-macro-topreman/assets/build-pdf.js:89` |
| `#ede9fe` | `#ede9fe` | 1 | `mockup_surdat_tooltip_badges.html:14` |
| `#f3f4f6` | `#f3f4f6` | 1 | `docs/mockups/bitacora-analitica.html:12` |
| `#f5d68a` | `#f5d68a` | 1 | `mockup_surdat_tooltip_badges.html:19` |
| `#f7f8fb` | `#f7f8fb` | 1 | `mockup_surdat_tooltip_badges.html:8` |
| `#f97316` | `#f97316` | 1 | `docs/mockups/bitacora-analitica.html:269` |
| `#f9fafb` | `#f9fafb` | 1 | `docs/mockups/bitacora-analitica.html:10` |
| `#fafbfd` | `#fafbfd` | 1 | `mockup_surdat_tooltip_badges.html:150` |
| `#fca5a5` | `#fca5a5` | 1 | `mockup_surdat_tooltip_badges.html:135` |
| `#fee2e2` | `#fee2e2` | 1 | `mockup_surdat_tooltip_badges.html:16` |
| `#fef3c7` | `#fef3c7` | 1 | `mockup_surdat_tooltip_badges.html:18` |
| `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.15)` | 1 | `mockup_surdat_tooltip_badges.html:107` |

**Colores — alcance `compilado`**: 786 literales en `frontend/build/index.html` (CSS minificado del build de CRA; no se lista porque es salida generada, no fuente).


**Escala tipográfica en uso (clases Tailwind, 86 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 308 | `text-xs` | 12px | 16px | — (hereda) |  | `frontend/src/components/Dashboard.js:119` |
| 297 | `text-sm` | 14px | 20px | — (hereda) |  | `frontend/src/components/Dashboard.js:81` |
| 126 | `font-medium` | — | — | 500 |  | `frontend/src/components/DataLoader.js:362` |
| 106 | `text-xs font-medium` | 12px | 16px | 500 |  | `frontend/src/components/Dashboard.js:257` |
| 104 | `font-semibold` | — | — | 600 |  | `frontend/src/components/TablaSKUExpandible.js:91` |
| 93 | `text-sm font-medium` | 14px | 20px | 500 |  | `frontend/src/index.css:371` |
| 44 | `text-lg font-semibold` | 18px | 28px | 600 |  | `frontend/src/components/Dashboard.js:98` |
| 42 | `text-[11px]` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `frontend/src/components/cobranza/AccionCobranza.js:42` |
| 39 | `text-lg font-black` | 18px | 28px | 900 |  | `frontend/src/modules/Finanzas.js:244` |
| 35 | `text-lg font-bold` | 18px | 28px | 700 |  | `frontend/src/components/TablaSKUExpandible.js:205` |
| 27 | `text-[10px]` | 10px | (sin line-height propio; hereda) | — (hereda) |  | `frontend/src/components/cobranza/AccionCobranza.js:56` |
| 27 | `font-bold` | — | — | 700 |  | `frontend/src/components/cobranza/CobranzaGraficos.js:167` |
| 25 | `text-sm font-black` | 14px | 20px | 900 |  | `frontend/src/components/cobranza/AccionCobranza.js:141` |
| 24 | `text-sm font-semibold` | 14px | 20px | 600 |  | `frontend/src/index.css:365` |
| 24 | `text-2xl font-bold` | 24px | 32px | 700 |  | `frontend/src/components/Dashboard.js:80` |
| 24 | `text-xs font-medium tracking-wider` | 12px | 16px | 500 |  | `frontend/src/modules/LogisticaDashboard.js:261` |
| 21 | `text-sm font-bold` | 14px | 20px | 700 |  | `frontend/src/index.css:400` |
| 17 | `text-xs font-semibold` | 12px | 16px | 600 |  | `frontend/src/components/TablaSKUExpandible.js:156` |
| 16 | `text-xl font-black` | 20px | 28px | 900 |  | `frontend/src/index.css:460` |
| 14 | `text-2xl font-black` | 24px | 32px | 900 |  | `frontend/src/index.css:406` |
| 12 | `text-3xl font-bold` | 30px | 36px | 700 |  | `frontend/src/modules/Contabilidad.js:71` |
| 11 | `text-xs font-bold` | 12px | 16px | 700 |  | `frontend/src/components/Dashboard.js:273` |
| 10 | `text-xl font-bold` | 20px | 28px | 700 |  | `frontend/src/components/TablaSKUExpandible.js:75` |
| 7 | `text-base font-semibold` | 16px | 24px | 600 |  | `frontend/src/components/ventas/InformeVendedorCard.js:149` |
| 6 | `text-[11px] font-medium` | 11px | (sin line-height propio; hereda) | 500 |  | `frontend/src/components/cobranza/CobranzaGraficos.js:257` |
| 6 | `text-xs font-mono` | 12px | 16px | — (hereda) |  | `frontend/src/modules/ComexDashboard.js:471` |
| 5 | `text-2xl` | 24px | 32px | — (hereda) |  | `frontend/src/modules/ComexDashboard.js:34` |
| 3 | `text-4xl font-black` | 36px | 40px | 900 |  | `frontend/src/index.css:443` |
| 3 | `text-[11px] font-bold tracking-wide` | 11px | (sin line-height propio; hereda) | 700 |  | `frontend/src/components/cobranza/AccionCobranza.js:151` |
| 3 | `font-normal` | — | — | 400 |  | `frontend/src/components/cobranza/AccionCobranza.js:181` |
| 3 | `text-[9px]` | 9px | (sin line-height propio; hereda) | — (hereda) |  | `frontend/src/components/cobranza/TablaCartera.js:152` |
| 3 | `text-2xl leading-none` | 24px | 1 | — (hereda) |  | `frontend/src/modules/AdminPanel.js:42` |
| 3 | `text-xs font-normal` | 12px | 16px | 400 |  | `frontend/src/modules/VentasNewDashboard.js:1610` |
| 2 | `text-lg font-medium` | 18px | 28px | 500 |  | `frontend/src/components/DataAnalyzer.js:63` |
| 2 | `text-sm font-mono` | 14px | 20px | — (hereda) |  | `frontend/src/components/TablaSKUExpandible.js:132` |
| 2 | `text-[11px] tracking-normal` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `frontend/src/components/cobranza/TablaCartera.js:339` |
| 2 | `text-5xl` | 48px | 1 | — (hereda) |  | `frontend/src/modules/ComexDashboard.js:117` |
| 2 | `text-4xl` | 36px | 40px | — (hereda) |  | `frontend/src/modules/ComexDashboard.js:496` |
| 2 | `text-xs leading-5 font-semibold` | 12px | 20px | 600 |  | `frontend/src/modules/LogisticaDashboard.js:350` |
| 2 | `text-[10px] font-semibold` | 10px | (sin line-height propio; hereda) | 600 |  | `frontend/src/modules/abastecimiento/TablaSKU.js:31` |
| 2 | `text-[11px] font-semibold` | 11px | (sin line-height propio; hereda) | 600 |  | `frontend/src/modules/bitacora/Frecuencia.js:50` |
| 2 | `text-[10px] font-semibold tracking-wide` | 10px | (sin line-height propio; hereda) | 600 |  | `frontend/src/modules/bitacora/piezas.js:30` |
| 1 | `text-3xl font-black` | 30px | 36px | 900 |  | `frontend/src/index.css:357` |
| 1 | `text-xs font-bold tracking-wider` | 12px | 16px | 700 |  | `frontend/src/components/CompactKPI.js:36` |
| 1 | `font-black` | — | — | 900 |  | `frontend/src/components/CompactKPI.js:47` |
| 1 | `text-[10px] leading-tight` | 10px | 1.25 | — (hereda) |  | `frontend/src/components/Dashboard.js:277` |
| 1 | `text-xl font-semibold` | 20px | 28px | 600 |  | `frontend/src/components/DataAnalyzer.js:59` |
| 1 | `text-xs font-black tracking-wider` | 12px | 16px | 900 |  | `frontend/src/components/EstadoModuloBadge.js:48` |
| 1 | `text-base` | 16px | 24px | — (hereda) |  | `frontend/src/components/cobranza/CobranzaGraficos.js:90` |
| 1 | `text-[11px] font-bold` | 11px | (sin line-height propio; hereda) | 700 |  | `frontend/src/components/cobranza/CobranzaGraficos.js:114` |
| 1 | `text-xs font-bold tracking-wide` | 12px | 16px | 700 |  | `frontend/src/modules/ComexDashboard.js:470` |
| 1 | `text-3xl` | 30px | 36px | — (hereda) |  | `frontend/src/modules/InventarioDashboard.js:281` |
| 1 | `text-4xl font-bold` | 36px | 40px | 700 |  | `frontend/src/modules/LogisticaDashboard.js:125` |
| 1 | `text-2xl leading-tight font-bold` | 24px | 1.25 | 700 |  | `frontend/src/modules/VentasNewDashboard.js:1608` |
| 1 | `text-xl leading-tight font-semibold` | 20px | 1.25 | 600 |  | `frontend/src/modules/VentasNewDashboard.js:1623` |
| 1 | `text-xs tracking-wide` | 12px | 16px | — (hereda) |  | `frontend/src/modules/VentasNewDashboard.js:2801` |
| 1 | `text-xl font-medium` | 20px | 28px | 500 |  | `frontend/src/modules/VentasOptimizado.js:104` |
| 1 | `text-[10px] font-medium` | 10px | (sin line-height propio; hereda) | 500 |  | `frontend/src/modules/abastecimiento/PanelSalud.js:229` |
| 1 | `text-[11px] font-semibold tracking-wide` | 11px | (sin line-height propio; hereda) | 600 |  | `frontend/src/modules/abastecimiento/TablaSKU.js:56` |
| 1 | `text-xs font-medium tracking-wide` | 12px | 16px | 500 |  | `frontend/src/modules/admin/PanelActividad.js:44` |
| 1 | `text-lg` | 18px | 28px | — (hereda) |  | `frontend/src/modules/admin/PanelActividad.js:45` |
| 1 | `font-semibold font-mono` | — | — | 600 |  | `frontend/src/modules/bitacora/piezas.js:45` |

- **Tamaños** (12 distintos, 1264 usos): `text-xs`×482 · `text-sm`×462 · `text-lg`×121 · `text-[11px]`×57 · `text-2xl`×47 · `text-[10px]`×33 · `text-xl`×29 · `text-3xl`×14 · `text-base`×8 · `text-4xl`×6 · `text-[9px]`×3 · `text-5xl`×2

- **Interlineado** (3 distintos, 8 usos): `leading-none`×3 · `leading-tight`×3 · `leading-5`×2

- **Peso** (5 distintos, 822 usos): `font-medium`×360 · `font-semibold`×208 · `font-bold`×148 · `font-black`×100 · `font-normal`×6

- **Familia (utilidad)** (1 distintos, 13 usos): `font-mono`×13

- **Tracking** (3 distintos, 39 usos): `tracking-wider`×26 · `tracking-wide`×11 · `tracking-normal`×2

- **Espaciado** (109 distintos, 3001 usos): `py-2`×412 · `px-3`×241 · `px-2`×220 · `py-1`×131 · `mb-4`×116 · `py-1.5`×97 · `p-3`×93 · `p-6`×88 · `p-4`×85 · `mb-1`×82 · `gap-2`×81 · `mb-2`×70 · `py-3`×67 · `mb-6`×62 · `mb-3`×61 · `px-4`×58 · `gap-4`×52 · `px-6`×52 · `gap-3`×51 · `mt-1`×50 · `p-2`×48 · `px-1.5`×47 · `mr-2`×41 · `pr-2`×38 · `py-4`×35 · `gap-1`×33 · `py-0.5`×30 · `mt-2`×29 · `space-y-2`×29 · `gap-6`×28 · `ml-2`×26 · `space-y-3`×25 · `p-5`×24 · `pr-4`×21 · `mt-3`×20 · `gap-1.5`×17 · `mx-auto`×17 · `mb-8`×15 · `mt-0.5`×15 · `space-x-2`×14 · `ml-1`×13 · `space-y-4`×13 · `inset-0`×12 · `mr-1`×12 · `p-1`×12 · `p-8`×11 · `py-8`×11 · `top-0`×11 · `pt-2`×10 · `py-6`×10 · `mt-4`×9 · `space-x-3`×9 · `mt-6`×8 · `px-1`×8 · `px-2.5`×7 · `space-y-1`×7 · `space-y-6`×6 · `mr-3`×5 · `pb-2`×5 · `space-x-4`×5 · `left-0`×4 · `ml-1.5`×4 · `ml-6`×4 · `ml-auto`×4 · `mx-4`×4 · `pl-3`×4 · `pt-4`×4 · `py-12`×4 · `bottom-0`×3 · `mb-5`×3 · `p-0.5`×3 · `pl-2`×3 · `pr-3`×3 · `pt-3`×3 · `space-y-0.5`×3 · `gap-x-4`×2 · `gap-y-1`×2 · `left-2`×2 · `lg:px-8`×2 · `mt-8`×2 · `pl-10`×2 · `right-0`×2 · `sm:px-6`×2 · `top-2`×2 · `-ml-1`×1 · `-right-1`×1 · `-top-1`×1 · `gap-8`×1 · `gap-[2px]`×1 · `gap-x-2`×1 · `left-4`×1 · `ml-0.5`×1 · `ml-4`×1 · `ml-8`×1 · `ml-[7.75rem]`×1 · `mt-1.5`×1 · `mx-1`×1 · `pl-7`×1 · `pl-8`×1 · `pr-1`×1 · `pt-6`×1 · `px-0.5`×1 · `px-5`×1 · `right-4`×1 · `sm:right-auto`×1 · `space-x-1`×1 · `space-y-8`×1 · `top-3`×1 · `top-4`×1

- **Border-radius** (9 distintos, 609 usos): `rounded-lg`×221 · `rounded`×130 · `rounded-full`×90 · `rounded-xl`×78 · `rounded-md`×64 · `rounded-2xl`×21 · `rounded-sm`×3 · `rounded-l-full`×1 · `rounded-r`×1

- **Box-shadow** (11 distintos, 118 usos): `shadow-sm`×83 · `shadow-lg`×13 · `shadow-md`×7 · `hover:shadow-md`×4 · `shadow-2xl`×4 · `hover:shadow-sm`×2 · `group-hover:shadow-md`×1 · `hover:shadow-xl`×1 · `shadow-[0_-1px_0_0_#e5e7eb]`×1 · `shadow-[0_1px_0_0_#e5e7eb]`×1 · `shadow-xl`×1

- **Transición / animación** (12 distintos, 112 usos): `transition-colors`×64 · `animate-spin`×14 · `transition-shadow`×7 · `transition-all`×6 · `transition-transform`×6 · `animate-in`×4 · `duration-200`×4 · `ease-out`×2 · `transition`×2 · `animate-ping`×1 · `duration-300`×1 · `transition-opacity`×1

- **Clases de la paleta por defecto de Tailwind** (229 distintos, 2745 usos): `text-gray-500`×311 · `text-gray-600`×229 · `text-gray-900`×190 · `text-gray-700`×154 · `border-gray-300`×113 · `border-gray-200`×107 · `text-gray-400`×88 · `text-red-600`×80 · `border-gray-100`×75 · `text-blue-600`×73 · `bg-gray-50`×66 · `text-gray-800`×66 · `focus:ring-blue-500`×57 · `text-green-600`×51 · `bg-gray-100`×46 · `text-red-700`×36 · `bg-red-100`×31 · `hover:bg-gray-50`×30 · `bg-blue-50`×28 · `text-purple-600`×27 · `text-blue-700`×26 · `border-blue-200`×25 · `border-red-200`×24 · `text-emerald-600`×24 · `bg-red-50`×20 · `bg-amber-50`×19 · `focus:border-blue-500`×19 · `text-yellow-600`×19 · `bg-blue-600`×18 · `border-amber-200`×17 · `hover:bg-blue-700`×17 · `bg-green-100`×16 · `bg-yellow-100`×16 · `text-amber-700`×16 · `text-amber-800`×16 · `text-green-700`×16 · `text-orange-600`×16 · `bg-blue-100`×14 · `text-red-800`×14 · `hover:bg-blue-100`×13 · `text-amber-600`×13 · `hover:bg-blue-50`×12 · `bg-orange-100`×11 · `hover:border-blue-300`×11 · `bg-emerald-50`×9 · `bg-gray-200`×9 · `text-gray-300`×9 · `border-orange-200`×8 · `divide-gray-200`×8 · `from-purple-500`×8 · `text-emerald-700`×8 · `text-yellow-700`×8 · `to-purple-600`×8 · `bg-amber-100`×7 · `bg-green-50`×7 · `text-blue-800`×7 · `text-yellow-800`×7 · `bg-blue-500`×6 · `bg-yellow-50`×6 · `border-yellow-200`×6 · `divide-gray-100`×6 · `from-green-500`×6 · `from-orange-500`×6 · `text-indigo-600`×6 · `text-orange-700`×6 · `to-green-600`×6 · `to-orange-600`×6 · `border-green-200`×5 · `disabled:text-gray-400`×5 · `from-indigo-500`×5 · `text-green-800`×5 · `text-purple-700`×5 · `bg-amber-500`×4 · `bg-emerald-500`×4 · `bg-orange-400`×4 · `bg-purple-100`×4 · `bg-teal-500`×4 · `bg-teal-600`×4 · `border-red-300`×4 · `from-blue-50`×4 · `hover:bg-red-200`×4 · `hover:text-gray-600`×4 · `text-amber-900`×4 · `text-orange-800`×4 · `text-red-500`×4 · `to-indigo-600`×4 · `bg-gray-400`×3 · `bg-gray-800`×3 · `bg-gray-900`×3 · `bg-green-600`×3 · `bg-indigo-50`×3 · `bg-purple-50`×3 · `bg-purple-500`×3 · `bg-red-500`×3 · `border-blue-600`×3 · `border-emerald-200`×3 · `border-indigo-200`×3 · `border-purple-200`×3 · `focus:ring-indigo-500`×3 · `from-blue-500`×3 · `from-teal-500`×3 · `hover:bg-red-50`×3 · `text-blue-900`×3 · `text-green-500`×3 · `text-indigo-700`×3 · `text-orange-500`×3 · `to-blue-50`×3 · `to-blue-600`×3 · `to-teal-600`×3 · `bg-emerald-100`×2 · `bg-emerald-600`×2 · `bg-gray-300`×2 · `bg-gray-700`×2 · `bg-green-400`×2 · `bg-orange-50`×2 · `bg-purple-600`×2 · `bg-violet-50`×2 · `bg-yellow-400`×2 · `border-amber-300`×2 · `border-emerald-300`×2 · `border-gray-50`×2 · `border-red-100`×2 · `disabled:text-gray-300`×2 · `from-cyan-500`×2 · `from-gray-700`×2 · `from-green-50`×2 · `from-red-500`×2 · `from-yellow-500`×2 · `hover:bg-blue-200`×2 · `hover:bg-blue-600`×2 · `hover:bg-emerald-50`×2 · `hover:bg-emerald-700`×2 · `hover:bg-gray-200`×2 · `hover:bg-green-200`×2 · `hover:bg-indigo-50`×2 · `hover:bg-orange-200`×2 · `hover:bg-purple-200`×2 · `hover:bg-purple-700`×2 · `hover:bg-teal-700`×2 · `hover:text-blue-800`×2 · `hover:text-blue-900`×2 · `hover:text-gray-700`×2 · `hover:text-gray-900`×2 · `hover:text-indigo-800`×2 · `hover:text-indigo-900`×2 · `placeholder-gray-500`×2 · `text-blue-500`×2 · `to-cyan-600`×2 · `to-gray-900`×2 · `to-red-600`×2 · `to-yellow-600`×2 · `bg-amber-400`×1 · `bg-amber-500/10`×1 · `bg-blue-200`×1 · `bg-gray-50/60`×1 · `bg-gray-500`×1 · `bg-indigo-400`×1 · `bg-indigo-50/40`×1 · `bg-indigo-500`×1 · `bg-indigo-600`×1 · `bg-orange-600`×1 · `bg-red-200`×1 · `bg-red-400`×1 · `bg-red-600`×1 · `bg-rose-50`×1 · `bg-sky-500`×1 · `bg-slate-600`×1 · `bg-slate-600/10`×1 · `bg-teal-100`×1 · `bg-teal-300`×1 · `bg-teal-400`×1 · `bg-teal-50`×1 · `bg-teal-700`×1 · `bg-yellow-50/40`×1 · `bg-yellow-600`×1 · `border-amber-400`×1 · `border-amber-500/40`×1 · `border-blue-500`×1 · `border-emerald-600`×1 · `border-gray-400`×1 · `border-green-300`×1 · `border-l-amber-500`×1 · `border-l-emerald-500`×1 · `border-l-red-500`×1 · `border-orange-600`×1 · `border-slate-500/40`×1 · `border-teal-200`×1 · `border-violet-200`×1 · `border-yellow-300`×1 · `border-yellow-600`×1 · `disabled:bg-gray-100`×1 · `disabled:border-gray-200`×1 · `enabled:hover:bg-gray-50`×1 · `from-amber-500`×1 · `from-orange-50`×1 · `from-purple-50`×1 · `group-hover:border-blue-200`×1 · `group-hover:text-blue-700`×1 · `hover:bg-amber-50`×1 · `hover:bg-gray-100`×1 · `hover:bg-gray-600`×1 · `hover:bg-gray-900`×1 · `hover:bg-green-700`×1 · `hover:bg-purple-50`×1 · `hover:bg-red-700`×1 · `hover:border-gray-400`×1 · `hover:text-blue-700`×1 · `hover:text-indigo-950`×1 · `hover:text-purple-800`×1 · `outline-violet-500`×1 · `text-emerald-800`×1 · `text-gray-200`×1 · `text-indigo-800`×1 · `text-indigo-900`×1 · `text-purple-500`×1 · `text-purple-800`×1 · `text-red-400`×1 · `text-rose-600`×1 · `text-teal-800`×1 · `text-violet-600`×1 · `text-violet-700`×1 · `to-amber-600`×1 · `to-green-50`×1 · `to-indigo-100`×1 · `to-orange-50`×1 · `to-pink-500`×1 · `to-purple-50`×1 · `to-red-50`×1 · `via-purple-500`×1

- **Colores arbitrarios en clases** (5 distintos, 6 usos): `hover:text-[#00968E]`×2 · `border-[#E1E8F0]`×1 · `hover:text-[#00766F]`×1 · `text-[#00968E]`×1 · `text-[#8E9AA8]`×1

### lex-semaforo


**Colores — alcance `produccion`** (36 literales, 20 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#6b6b6b` | `#6b6b6b` | 7 | `lib/correo/plantillas.ts:24,28,64,67,96,121,155` |
| `#f6f6f4` | `#f6f6f4` | 3 | `lib/correo/plantillas.ts:22,59,148` |
| `#142f4c` | `#142F4C` | 2 | `tailwind.config.ts:16,18` |
| `#15803d` | `#15803D` | 2 | `tailwind.config.ts:25`; `components/informe/ScoreCircle.tsx:6` |
| `#1a1a1a` | `#1a1a1a` | 2 | `lib/correo/plantillas.ts:22,60` |
| `#d97706` | `#D97706` | 2 | `tailwind.config.ts:24`; `components/informe/ScoreCircle.tsx:5` |
| `#dc2626` | `#DC2626` | 2 | `tailwind.config.ts:23`; `components/informe/ScoreCircle.tsx:4` |
| `#e5e3de` | `#e5e3de` | 2 | `lib/correo/plantillas.ts:23,27` |
| `#e7edf3` | `#E7EDF3` | 2 | `tailwind.config.ts:20`; `components/informe/ScoreCircle.tsx:20` |
| `#ffffff` | `#fff` | 2 | `lib/correo/plantillas.ts:23,37` |
| `#0e1f33` | `#0E1F33` | 1 | `tailwind.config.ts:13` |
| `#1e3a5f` | `#1e3a5f` | 1 | `lib/correo/plantillas.ts:37` |
| `#1e4266` | `#1E4266` | 1 | `tailwind.config.ts:19` |
| `#4a4a4a` | `#4a4a4a` | 1 | `lib/correo/plantillas.ts:59` |
| `#5a6b7b` | `#5A6B7B` | 1 | `tailwind.config.ts:14` |
| `#dce3ea` | `#DCE3EA` | 1 | `tailwind.config.ts:15` |
| `#e8f5ec` | `#E8F5EC` | 1 | `tailwind.config.ts:25` |
| `#f7f9fb` | `#F7F9FB` | 1 | `tailwind.config.ts:12` |
| `#fdecec` | `#FDECEC` | 1 | `tailwind.config.ts:23` |
| `#fef3e2` | `#FEF3E2` | 1 | `tailwind.config.ts:24` |

**Escala tipográfica en uso (clases Tailwind, 83 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 87 | `text-sm` | 14px | 20px | — (hereda) |  | `app/page.tsx:65` |
| 41 | `text-xs` | 12px | 16px | — (hereda) |  | `app/admin/page.tsx:188` |
| 29 | `font-semibold` | — | — | 600 |  | `app/page.tsx:96` |
| 22 | `text-sm font-semibold` | 14px | 20px | 600 |  | `app/page.tsx:63` |
| 18 | `text-sm font-medium` | 14px | 20px | 500 |  | `app/globals.css:50` |
| 14 | `text-2xl font-bold font-serif` | 24px | 32px | 700 |  | `app/page.tsx:74` |
| 11 | `text-3xl font-bold font-serif` | 30px | 36px | 700 |  | `app/dashboard/page.tsx:25` |
| 10 | `font-medium` | — | — | 500 |  | `app/admin/page.tsx:95` |
| 9 | `text-xs font-semibold` | 12px | 16px | 600 |  | `app/admin/page.tsx:156` |
| 4 | `text-base` | 16px | 24px | — (hereda) |  | `app/page.tsx:45` |
| 4 | `text-lg font-bold font-serif` | 18px | 28px | 700 |  | `app/admin/page.tsx:78` |
| 4 | `text-xl font-bold font-serif` | 20px | 28px | 700 |  | `components/abogado/ModalDerivar.tsx:75` |
| 3 | `text-lg font-semibold` | 18px | 28px | 600 |  | `app/page.tsx:81` |
| 3 | `text-sm leading-relaxed` | 14px | 1.625 | — (hereda) |  | `app/page.tsx:82` |
| 3 | `text-xs font-mono` | 12px | 16px | — (hereda) |  | `app/admin/page.tsx:150` |
| 3 | `text-[11px] font-semibold tracking-wide` | 11px | (sin line-height propio; hereda) | 600 |  | `components/informe/HallazgoCard.tsx:32` |
| 2 | `text-[11px] font-semibold` | 11px | (sin line-height propio; hereda) | 600 |  | `app/page.tsx:130` |
| 2 | `text-xs tracking-wide` | 12px | 16px | — (hereda) |  | `app/admin/page.tsx:94` |
| 2 | `text-2xl font-bold` | 24px | 32px | 700 |  | `components/abogado/ModalDerivar.tsx:77` |
| 2 | `text-2xl` | 24px | 32px | — (hereda) |  | `components/cierre/CierreFlow.tsx:232` |
| 2 | `text-xl font-serif` | 20px | 28px | — (hereda) |  | `components/crear/CrearFlow.tsx:93` |
| 1 | `text-xs font-semibold tracking-[0.14em]` | 12px | 16px | 600 |  | `app/globals.css:59` |
| 1 | `sm:text-5xl text-4xl leading-[1.1] font-bold font-serif` | 36px | 1.1 | 700 | `sm:text-5xl` | `app/page.tsx:37` |
| 1 | `text-lg` | 18px | 28px | — (hereda) |  | `app/page.tsx:40` |
| 1 | `text-sm font-bold font-serif` | 14px | 20px | 700 |  | `app/page.tsx:80` |
| 1 | `text-lg font-bold font-serif tracking-tight` | 18px | 28px | 700 |  | `components/Logo.tsx:15` |
| 1 | `text-xs font-medium` | 12px | 16px | 500 |  | `components/SiteFooter.tsx:15` |
| 1 | `text-xs font-semibold tracking-wide` | 12px | 16px | 600 |  | `components/abogado/AbogadoFlow.tsx:153` |
| 1 | `text-2xl font-mono tracking-[0.3em]` | 24px | 32px | — (hereda) |  | `components/auth/Ingreso.tsx:89` |
| 1 | `text-[11px] font-mono` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `components/cierre/CierreFlow.tsx:267` |
| 1 | `text-sm leading-relaxed font-mono` | 14px | 1.625 | — (hereda) |  | `components/crear/CrearFlow.tsx:149` |
| 1 | `text-base font-semibold` | 16px | 24px | 600 |  | `components/informe/HallazgoCard.tsx:14` |
| 1 | `text-base leading-relaxed` | 16px | 1.625 | — (hereda) |  | `components/informe/Informe.tsx:40` |
| 1 | `font-bold font-serif` | — | — | 700 |  | `components/informe/Informe.tsx:76` |
| 1 | `text-3xl font-bold` | 30px | 36px | 700 |  | `components/informe/ScoreCircle.tsx:34` |
| 1 | `text-[11px] tracking-wide` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `components/informe/ScoreCircle.tsx:35` |
| 1 | `text-3xl` | 30px | 36px | — (hereda) |  | `components/notaria/NotariaFlow.tsx:20` |
| 1 | `text-sm font-mono` | 14px | 20px | — (hereda) |  | `components/pagos/MuroPago.tsx:97` |
| 1 | `text-lg font-semibold font-mono tracking-wide` | 18px | 28px | 600 |  | `components/pagos/RetornoPago.tsx:101` |
| 1 | `text-[10px] font-semibold` | 10px | (sin line-height propio; hereda) | 600 |  | `components/revisar/RevisarFlow.tsx:213` |
| 1 | `text-xs font-bold` | 12px | 16px | 700 |  | `components/revisar/RevisarFlow.tsx:327` |

- **Tamaños** (11 distintos, 256 usos): `text-sm`×133 · `text-xs`×59 · `text-2xl`×19 · `text-3xl`×13 · `text-lg`×10 · `text-[11px]`×7 · `text-base`×6 · `text-xl`×6 · `sm:text-5xl`×1 · `text-4xl`×1 · `text-[10px]`×1

- **Interlineado** (2 distintos, 6 usos): `leading-relaxed`×5 · `leading-[1.1]`×1

- **Peso** (3 distintos, 143 usos): `font-semibold`×73 · `font-bold`×41 · `font-medium`×29

- **Familia (utilidad)** (2 distintos, 49 usos): `font-serif`×39 · `font-mono`×10

- **Tracking** (4 distintos, 11 usos): `tracking-wide`×8 · `tracking-[0.14em]`×1 · `tracking-[0.3em]`×1 · `tracking-tight`×1

- **Espaciado** (73 distintos, 630 usos): `mt-3`×59 · `mx-auto`×38 · `mt-2`×32 · `mt-6`×31 · `px-3`×29 · `px-5`×29 · `gap-2`×26 · `mt-8`×26 · `px-4`×26 · `mt-4`×25 · `py-2`×25 · `gap-3`×22 · `mt-1`×21 · `py-3`×19 · `p-5`×17 · `py-12`×14 · `p-4`×11 · `mt-5`×10 · `p-6`×10 · `py-16`×9 · `py-2.5`×8 · `space-y-2`×8 · `mb-1`×7 · `mt-10`×7 · `py-0.5`×7 · `py-1.5`×7 · `gap-4`×6 · `mt-0.5`×6 · `mt-1.5`×6 · `px-2`×6 · `space-y-4`×6 · `gap-1.5`×5 · `gap-6`×5 · `mb-3`×5 · `p-3`×5 · `pb-2`×5 · `mb-2`×4 · `inset-0`×3 · `mb-6`×3 · `px-2.5`×3 · `py-1`×3 · `pt-16`×2 · `py-10`×2 · `space-y-3`×2 · `space-y-8`×2 · `-left-[5px]`×1 · `gap-1`×1 · `gap-2.5`×1 · `gap-5`×1 · `gap-8`×1 · `gap-px`×1 · `gap-x-4`×1 · `gap-y-2`×1 · `lg:pt-14`×1 · `ml-1`×1 · `mt-12`×1 · `mt-24`×1 · `mx-1`×1 · `my-8`×1 · `p-1`×1 · `p-[5px]`×1 · `pb-20`×1 · `pb-4`×1 · `pl-3`×1 · `pl-4`×1 · `pt-1`×1 · `pt-4`×1 · `px-1.5`×1 · `py-24`×1 · `py-32`×1 · `space-y-6`×1 · `top-0`×1 · `top-1.5`×1

- **Border-radius** (5 distintos, 84 usos): `rounded-md`×46 · `rounded-full`×24 · `rounded-lg`×10 · `rounded`×3 · `rounded-[7px]`×1

- **Box-shadow**: ninguno.

- **Transición / animación** (2 distintos, 10 usos): `transition-colors`×8 · `animate-spin`×2

- **Clases de la paleta por defecto de Tailwind**: ninguno.

- **Colores arbitrarios en clases**: ninguno.

### IAnsurance


**Colores — alcance `produccion`** (13 literales, 11 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#00968e` | `#00968e` | 2 | `web/app/globals.css:4,17` |
| `#e1e8f0` | `#E1E8F0`, `#e1e8f0` | 2 | `web/app/globals.css:11`; `web/app/page.tsx:309` |
| `#00766f` | `#00766f` | 1 | `web/app/globals.css:5` |
| `#1b1f2a` | `#1b1f2a` | 1 | `web/app/globals.css:8` |
| `#2d3140` | `#2d3140` | 1 | `web/app/globals.css:9` |
| `#8e9aa8` | `#8e9aa8` | 1 | `web/app/globals.css:13` |
| `#b8c2cc` | `#b8c2cc` | 1 | `web/app/globals.css:12` |
| `#d97706` | `#d97706` | 1 | `web/app/globals.css:16` |
| `#dc2626` | `#dc2626` | 1 | `web/app/globals.css:15` |
| `#e6f5f3` | `#e6f5f3` | 1 | `web/app/globals.css:6` |
| `#f4f7fa` | `#f4f7fa` | 1 | `web/app/globals.css:10` |

**Escala tipográfica en uso (clases Tailwind, 5 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 17 | `text-sm` | 14px | 20px | — (hereda) |  | `web/app/layout.tsx:34` |
| 11 | `font-medium` | — | — | 500 |  | `web/app/layout.tsx:35` |
| 4 | `text-xs` | 12px | 16px | — (hereda) |  | `web/app/page.tsx:231` |
| 3 | `text-sm font-medium` | 14px | 20px | 500 |  | `web/app/page.tsx:287` |
| 3 | `font-semibold font-display` | — | — | 600 |  | `web/app/page.tsx:366` |
| 2 | `text-xs font-medium` | 12px | 16px | 500 |  | `web/app/layout.tsx:30` |
| 2 | `text-xs font-mono` | 12px | 16px | — (hereda) |  | `web/app/layout.tsx:46` |
| 2 | `text-lg` | 18px | 28px | — (hereda) |  | `web/app/page.tsx:96` |
| 1 | `text-2xl font-light` | 24px | 32px | 300 |  | `web/app/layout.tsx:26` |
| 1 | `text-lg font-bold font-display tracking-tight` | 18px | 28px | 700 |  | `web/app/layout.tsx:27` |
| 1 | `md:text-5xl text-4xl font-bold font-display tracking-tight` | 36px | 40px | 700 | `md:text-5xl` | `web/app/page.tsx:93` |
| 1 | `text-5xl` | 48px | 1 | — (hereda) |  | `web/app/page.tsx:115` |
| 1 | `text-3xl` | 30px | 36px | — (hereda) |  | `web/app/page.tsx:138` |
| 1 | `text-xs font-medium tracking-wider` | 12px | 16px | 500 |  | `web/app/page.tsx:171` |
| 1 | `font-semibold` | — | — | 600 |  | `web/app/page.tsx:180` |
| 1 | `text-xs font-mono tracking-wider` | 12px | 16px | — (hereda) |  | `web/app/page.tsx:274` |
| 1 | `text-2xl font-bold` | 24px | 32px | 700 |  | `web/app/page.tsx:301` |
| 1 | `text-4xl font-bold font-display` | 36px | 40px | 700 |  | `web/app/page.tsx:326` |
| 1 | `text-[10px] font-medium tracking-wider` | 10px | (sin line-height propio; hereda) | 500 |  | `web/app/page.tsx:329` |
| 1 | `text-2xl` | 24px | 32px | — (hereda) |  | `web/app/page.tsx:336` |
| 1 | `text-xl font-bold font-display` | 20px | 28px | 700 |  | `web/app/page.tsx:337` |
| 1 | `text-sm font-semibold font-display` | 14px | 20px | 600 |  | `web/app/page.tsx:386` |
| 1 | `text-xs tracking-wide` | 12px | 16px | — (hereda) |  | `web/app/page.tsx:421` |

- **Tamaños** (10 distintos, 45 usos): `text-sm`×21 · `text-xs`×11 · `text-2xl`×3 · `text-lg`×3 · `text-4xl`×2 · `md:text-5xl`×1 · `text-3xl`×1 · `text-5xl`×1 · `text-[10px]`×1 · `text-xl`×1

- **Interlineado** (1 distintos, 1 usos): `leading-relaxed`×1

- **Peso** (4 distintos, 29 usos): `font-medium`×18 · `font-bold`×5 · `font-semibold`×5 · `font-light`×1

- **Familia (utilidad)** (2 distintos, 11 usos): `font-display`×8 · `font-mono`×3

- **Tracking** (3 distintos, 6 usos): `tracking-wider`×3 · `tracking-tight`×2 · `tracking-wide`×1

- **Espaciado** (48 distintos, 110 usos): `gap-2`×8 · `p-2`×8 · `gap-3`×6 · `p-6`×6 · `gap-6`×5 · `mx-auto`×5 · `px-6`×5 · `mb-4`×4 · `mb-2`×3 · `p-4`×3 · `px-2`×3 · `py-0.5`×3 · `py-2`×3 · `py-2.5`×3 · `gap-1`×2 · `mb-3`×2 · `mt-1`×2 · `mt-3`×2 · `mt-4`×2 · `pl-5`×2 · `px-4`×2 · `px-5`×2 · `space-y-2`×2 · `space-y-3`×2 · `space-y-6`×2 · `gap-4`×1 · `inset-0`×1 · `last:mb-0`×1 · `mb-1`×1 · `mb-10`×1 · `mb-6`×1 · `ml-2`×1 · `mt-12`×1 · `mt-16`×1 · `mt-2`×1 · `mt-5`×1 · `mt-6`×1 · `p-1`×1 · `p-12`×1 · `p-5`×1 · `print:space-y-4`×1 · `px-3`×1 · `py-1.5`×1 · `py-12`×1 · `py-6`×1 · `space-y-1`×1 · `space-y-1.5`×1 · `space-y-4`×1

- **Border-radius** (5 distintos, 29 usos): `rounded`×8 · `rounded-lg`×7 · `rounded-md`×6 · `rounded-full`×4 · `rounded-xl`×4

- **Box-shadow** (1 distintos, 1 usos): `shadow-sm`×1

- **Transición / animación** (4 distintos, 14 usos): `animate-pulse`×7 · `transition-colors`×4 · `animate-in`×2 · `ease-out`×1

- **Clases de la paleta por defecto de Tailwind** (13 distintos, 19 usos): `bg-red-50`×3 · `bg-amber-50`×2 · `border-red-200`×2 · `text-amber-700`×2 · `text-red-700`×2 · `bg-amber-100`×1 · `bg-red-100`×1 · `border-amber-200`×1 · `stroke-amber-500`×1 · `stroke-red-500`×1 · `text-amber-900`×1 · `text-red-800`×1 · `text-red-900`×1

- **Colores arbitrarios en clases**: ninguno.

### piatio


**Colores — alcance `produccion`** (169 literales, 31 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#ffffff` | `#FFFFFF`, `#fff`, `#ffffff` | 33 | `apps/web/tailwind.config.ts:18`; `apps/web/src/app/globals.css:15`; `apps/web/src/components/YardEditor.tsx:1878,1961,2247,2321,2367,2381,2456,2488,2547,2561,2577,2582,2601,2605,2609,2613,2625,2650,2654,2658,2660,2687,2712,2716,2720,2722,2746,2757,2762,2784,2789` |
| `#1b1f2a` | `#1B1F2A`, `#1b1f2a` | 27 | `apps/web/tailwind.config.ts:15`; `apps/web/src/app/globals.css:12`; `apps/web/src/components/YardEditor.tsx:314,320,2456,2485,2547,2577,2597,2601,2605,2609,2613,2646,2650,2654,2658,2660,2708,2712,2716,2720,2722,2757,2770,2772` |
| `#e1e8f0` | `#E1E8F0`, `#e1e8f0` | 25 | `apps/web/tailwind.config.ts:16`; `apps/web/src/app/globals.css:13`; `apps/web/src/components/YardEditor.tsx:2456,2483,2545,2547,2573,2577,2595,2601,2605,2609,2613,2639,2650,2654,2658,2660,2701,2712,2716,2720,2722,2753,2757` |
| `#00968e` | `#00968E`, `#00968e` | 16 | `apps/web/tailwind.config.ts:12,24`; `apps/web/src/app/globals.css:9`; `apps/web/src/components/YardEditor.tsx:313,645,646,1660,1878,2488,2561,2582,2625,2687,2746,2762,2784` |
| `#8e9aa8` | `#8E9AA8`, `#8e9aa8` | 15 | `apps/web/tailwind.config.ts:17`; `apps/web/src/app/globals.css:14`; `apps/web/src/components/YardEditor.tsx:320,2378,2484,2546,2564,2574,2583,2596,2640,2672,2702,2754,2771` |
| `#166534` | `#166534` | 7 | `apps/web/src/components/YardEditor.tsx:319,321,2244,2269,2270,2280` |
| `#1d4ed8` | `#1D4ED8` | 5 | `apps/web/src/components/YardEditor.tsx:317,322,327,1975,2299` |
| `#0f766e` | `#0F766E` | 4 | `apps/web/src/components/YardEditor.tsx:324,331,1917,2310` |
| `#dc2626` | `#DC2626`, `#dc2626` | 4 | `apps/web/tailwind.config.ts:22`; `apps/web/src/app/globals.css:18`; `apps/web/src/components/YardEditor.tsx:2167,2789` |
| `#be185d` | `#BE185D` | 3 | `apps/web/src/components/YardEditor.tsx:326,328,329` |
| `#d97706` | `#D97706`, `#d97706` | 3 | `apps/web/tailwind.config.ts:21`; `apps/web/src/app/globals.css:17`; `apps/web/src/components/YardEditor.tsx:316` |
| `#00766f` | `#00766F`, `#00766f` | 2 | `apps/web/tailwind.config.ts:13`; `apps/web/src/app/globals.css:10` |
| `#16a34a` | `#16A34A` | 2 | `apps/web/src/components/YardEditor.tsx:315,1902` |
| `#2563eb` | `#2563EB`, `#2563eb` | 2 | `apps/web/tailwind.config.ts:23`; `apps/web/src/app/globals.css:19` |
| `#60a5fa` | `#60A5FA` | 2 | `apps/web/src/components/YardEditor.tsx:317,327` |
| `#e6f5f3` | `#E6F5F3`, `#e6f5f3` | 2 | `apps/web/tailwind.config.ts:14`; `apps/web/src/app/globals.css:11` |
| `rgba(0,0,0,.3)` | `rgba(0,0,0,.3)` | 2 | `apps/web/src/components/YardEditor.tsx:1878,2321` |
| `rgba(0,0,0,.4)` | `rgba(0,0,0,.4)` | 2 | `apps/web/src/components/YardEditor.tsx:2280,2299` |
| `#0ea5e9` | `#0EA5E9` | 1 | `apps/web/src/components/YardEditor.tsx:325` |
| `#22c55e` | `#22C55E` | 1 | `apps/web/src/components/YardEditor.tsx:315` |
| `#5eead4` | `#5EEAD4` | 1 | `apps/web/src/components/YardEditor.tsx:331` |
| `#7c2d12` | `#7C2D12` | 1 | `apps/web/src/components/YardEditor.tsx:318` |
| `#7c3aed` | `#7C3AED` | 1 | `apps/web/src/components/YardEditor.tsx:330` |
| `#92400e` | `#92400E` | 1 | `apps/web/src/components/YardEditor.tsx:316` |
| `#a16207` | `#A16207` | 1 | `apps/web/src/components/YardEditor.tsx:318` |
| `#a78bfa` | `#A78BFA` | 1 | `apps/web/src/components/YardEditor.tsx:330` |
| `#ec4899` | `#EC4899` | 1 | `apps/web/src/components/YardEditor.tsx:328` |
| `#fbcfe8` | `#FBCFE8` | 1 | `apps/web/src/components/YardEditor.tsx:329` |
| `hsl(${hue},55%,45%)` | `hsl(${hue}, 55%, 45%)` | 1 | `apps/web/src/lib/sector-color.ts:9` |
| `rgba(0,150,142,0.18)` | `rgba(0,150,142,0.18)` | 1 | `apps/web/src/app/disenar/page.tsx:1678` |
| `rgba(220,38,38,.45)` | `rgba(220,38,38,.45)` | 1 | `apps/web/src/components/YardEditor.tsx:2314` |

**Colores — alcance `doc-mockup`** (133 literales, 48 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#ffffff` | `#FFFFFF` | 22 | `docs/guia-cabezal-zona1-casa-black.html:7,12,141,152,153,158,159,164,165,170,171,176,177,182,183,188,189,194,195,200,201,281` |
| `#1b1f2a` | `#1B1F2A` | 16 | `docs/guia-cabezal-zona1-casa-black.html:7,147,154,160,166,172,178,184,190,194,195,196,200,201,202` |
| `#2563eb` | `#2563EB` | 11 | `docs/guia-cabezal-zona1-casa-black.html:9,152,153,158,159,164,165,170,171,176,177` |
| `#5e6a78` | `#5E6A78` | 10 | `docs/guia-cabezal-zona1-casa-black.html:7,155,161,167,173,179,185,191,197,203` |
| `#1a2029` | `#1A2029` | 4 | `docs/guia-cabezal-zona1-casa-black.html:19,24,27,32` |
| `#2f9e44` | `#2F9E44` | 3 | `docs/guia-cabezal-zona1-casa-black.html:10,182,183` |
| `#dc2626` | `#DC2626` | 3 | `docs/guia-cabezal-zona1-casa-black.html:11,188,189` |
| `#0f2e2c` | `#0F2E2C` | 2 | `docs/guia-cabezal-zona1-casa-black.html:20,28` |
| `#12161e` | `#12161E` | 2 | `docs/guia-cabezal-zona1-casa-black.html:19,27` |
| `#16281b` | `#16281B` | 2 | `docs/guia-cabezal-zona1-casa-black.html:22,30` |
| `#17233d` | `#17233D` | 2 | `docs/guia-cabezal-zona1-casa-black.html:21,29` |
| `#173634` | `#173634` | 2 | `docs/guia-cabezal-zona1-casa-black.html:24,32` |
| `#18241a` | `#18241A` | 2 | `docs/guia-cabezal-zona1-casa-black.html:25,33` |
| `#1e242e` | `#1E242E` | 2 | `docs/guia-cabezal-zona1-casa-black.html:25,33` |
| `#1f4d49` | `#1F4D49` | 2 | `docs/guia-cabezal-zona1-casa-black.html:24,32` |
| `#262d38` | `#262D38` | 2 | `docs/guia-cabezal-zona1-casa-black.html:25,33` |
| `#2a241c` | `#2A241C` | 2 | `docs/guia-cabezal-zona1-casa-black.html:25,33` |
| `#2a323e` | `#2A323E` | 2 | `docs/guia-cabezal-zona1-casa-black.html:19,27` |
| `#2bb5ac` | `#2BB5AC` | 2 | `docs/guia-cabezal-zona1-casa-black.html:20,28` |
| `#2c2820` | `#2C2820` | 2 | `docs/guia-cabezal-zona1-casa-black.html:25,33` |
| `#2e2414` | `#2E2414` | 2 | `docs/guia-cabezal-zona1-casa-black.html:23,31` |
| `#341a1c` | `#341A1C` | 2 | `docs/guia-cabezal-zona1-casa-black.html:23,31` |
| `#5cc97a` | `#5CC97A` | 2 | `docs/guia-cabezal-zona1-casa-black.html:22,30` |
| `#5fcfc7` | `#5FCFC7` | 2 | `docs/guia-cabezal-zona1-casa-black.html:20,28` |
| `#6b7684` | `#6B7684` | 2 | `docs/guia-cabezal-zona1-casa-black.html:24,32` |
| `#6b9bfa` | `#6B9BFA` | 2 | `docs/guia-cabezal-zona1-casa-black.html:21,29` |
| `#9aa6b4` | `#9AA6B4` | 2 | `docs/guia-cabezal-zona1-casa-black.html:19,27` |
| `#e7ecf2` | `#E7ECF2` | 2 | `docs/guia-cabezal-zona1-casa-black.html:19,27` |
| `#f0a04b` | `#F0A04B` | 2 | `docs/guia-cabezal-zona1-casa-black.html:23,31` |
| `#f26b6b` | `#F26B6B` | 2 | `docs/guia-cabezal-zona1-casa-black.html:23,31` |
| `#00766f` | `#00766F` | 1 | `docs/guia-cabezal-zona1-casa-black.html:8` |
| `#00968e` | `#00968E` | 1 | `docs/guia-cabezal-zona1-casa-black.html:8` |
| `#8e9aa8` | `#8E9AA8` | 1 | `docs/guia-cabezal-zona1-casa-black.html:12` |
| `#b9e2dd` | `#B9E2DD` | 1 | `docs/guia-cabezal-zona1-casa-black.html:12` |
| `#d97706` | `#D97706` | 1 | `docs/guia-cabezal-zona1-casa-black.html:11` |
| `#dcefec` | `#DCEFEC` | 1 | `docs/guia-cabezal-zona1-casa-black.html:12` |
| `#e1e8f0` | `#E1E8F0` | 1 | `docs/guia-cabezal-zona1-casa-black.html:7` |
| `#e6f5f3` | `#E6F5F3` | 1 | `docs/guia-cabezal-zona1-casa-black.html:8` |
| `#e7f5ea` | `#E7F5EA` | 1 | `docs/guia-cabezal-zona1-casa-black.html:10` |
| `#e8effd` | `#E8EFFD` | 1 | `docs/guia-cabezal-zona1-casa-black.html:9` |
| `#e9edf2` | `#E9EDF2` | 1 | `docs/guia-cabezal-zona1-casa-black.html:13` |
| `#eceef1` | `#ECEEF1` | 1 | `docs/guia-cabezal-zona1-casa-black.html:13` |
| `#eef6ec` | `#EEF6EC` | 1 | `docs/guia-cabezal-zona1-casa-black.html:13` |
| `#efe7dc` | `#EFE7DC` | 1 | `docs/guia-cabezal-zona1-casa-black.html:13` |
| `#f1e9dd` | `#F1E9DD` | 1 | `docs/guia-cabezal-zona1-casa-black.html:13` |
| `#f6f9fb` | `#F6F9FB` | 1 | `docs/guia-cabezal-zona1-casa-black.html:7` |
| `#fdecec` | `#FDECEC` | 1 | `docs/guia-cabezal-zona1-casa-black.html:11` |
| `#fdf3e6` | `#FDF3E6` | 1 | `docs/guia-cabezal-zona1-casa-black.html:11` |

**Escala tipográfica en uso (clases Tailwind, 11 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 30 | `text-xs` | 12px | 16px | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:881` |
| 24 | `text-sm` | 14px | 20px | — (hereda) |  | `apps/web/src/app/page.tsx:20` |
| 15 | `text-xs font-medium` | 12px | 16px | 500 |  | `apps/web/src/app/disenar/page.tsx:886` |
| 11 | `text-xs font-mono` | 12px | 16px | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1195` |
| 7 | `text-2xl font-semibold font-display` | 24px | 32px | 600 |  | `apps/web/src/app/disenar/page.tsx:1047` |
| 6 | `font-medium` | — | — | 500 |  | `apps/web/src/app/disenar/page.tsx:1263` |
| 6 | `text-xs font-mono tracking-wider` | 12px | 16px | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1446` |
| 4 | `text-sm font-medium` | 14px | 20px | 500 |  | `apps/web/src/app/page.tsx:16` |
| 3 | `text-sm font-mono` | 14px | 20px | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1031` |
| 3 | `text-base font-semibold font-display` | 16px | 24px | 600 |  | `apps/web/src/app/disenar/page.tsx:1147` |
| 3 | `text-[11px]` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1704` |
| 2 | `text-[10px] font-mono` | 10px | (sin line-height propio; hereda) | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1028` |
| 1 | `text-sm font-mono tracking-widest` | 14px | 20px | — (hereda) |  | `apps/web/src/app/page.tsx:5` |
| 1 | `text-5xl font-semibold font-display` | 48px | 1 | 600 |  | `apps/web/src/app/page.tsx:8` |
| 1 | `text-lg` | 18px | 28px | — (hereda) |  | `apps/web/src/app/page.tsx:9` |
| 1 | `text-xs font-mono tracking-widest` | 12px | 16px | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:872` |
| 1 | `text-4xl font-semibold font-display` | 36px | 40px | 600 |  | `apps/web/src/app/disenar/page.tsx:875` |
| 1 | `text-[10px]` | 10px | (sin line-height propio; hereda) | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1033` |
| 1 | `text-[10px] font-mono tracking-wider` | 10px | (sin line-height propio; hereda) | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1347` |
| 1 | `text-[11px] font-mono` | 11px | (sin line-height propio; hereda) | — (hereda) |  | `apps/web/src/app/disenar/page.tsx:1634` |

- **Tamaños** (9 distintos, 116 usos): `text-xs`×63 · `text-sm`×32 · `text-2xl`×7 · `text-[10px]`×4 · `text-[11px]`×4 · `text-base`×3 · `text-4xl`×1 · `text-5xl`×1 · `text-lg`×1

- **Interlineado**: ninguno.

- **Peso** (2 distintos, 37 usos): `font-medium`×25 · `font-semibold`×12

- **Familia (utilidad)** (2 distintos, 69 usos): `font-mono`×57 · `font-display`×12

- **Tracking** (2 distintos, 13 usos): `tracking-wider`×11 · `tracking-widest`×2

- **Espaciado** (43 distintos, 291 usos): `px-3`×48 · `py-2`×35 · `px-2`×22 · `gap-2`×20 · `py-1`×18 · `py-1.5`×18 · `mt-2`×17 · `p-3`×11 · `mt-4`×9 · `mt-10`×8 · `gap-3`×6 · `mr-1`×6 · `mt-1`×6 · `mt-3`×6 · `p-2`×5 · `p-4`×5 · `space-y-1`×5 · `space-y-2`×5 · `gap-4`×4 · `ml-auto`×3 · `px-2.5`×3 · `gap-1`×2 · `gap-1.5`×2 · `ml-2`×2 · `mt-12`×2 · `mt-6`×2 · `mt-8`×2 · `mx-auto`×2 · `px-6`×2 · `py-0.5`×2 · `gap-x-4`×1 · `gap-y-1`×1 · `mb-1`×1 · `ml-1`×1 · `mx-2`×1 · `pt-2`×1 · `px-5`×1 · `py-10`×1 · `py-2.5`×1 · `py-24`×1 · `right-2`×1 · `space-y-3`×1 · `top-2`×1

- **Border-radius** (3 distintos, 62 usos): `rounded-md`×57 · `rounded`×4 · `rounded-full`×1

- **Box-shadow**: ninguno.

- **Transición / animación** (1 distintos, 5 usos): `transition`×5

- **Clases de la paleta por defecto de Tailwind**: ninguno.

- **Colores arbitrarios en clases**: ninguno.

### yolotengo


**Colores — alcance `produccion`** (13 literales, 13 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#007a73` | `#007a73` | 1 | `apps/web/src/app/theme.css:13` |
| `#00968e` | `#00968e` | 1 | `apps/web/src/app/theme.css:12` |
| `#1b1f2a` | `#1b1f2a` | 1 | `apps/web/src/app/theme.css:11` |
| `#8a5a00` | `#8a5a00` | 1 | `apps/web/src/app/theme.css:21` |
| `#8e9aa8` | `#8e9aa8` | 1 | `apps/web/src/app/theme.css:17` |
| `#b42318` | `#b42318` | 1 | `apps/web/src/app/theme.css:19` |
| `#e0f2f1` | `#e0f2f1` | 1 | `apps/web/src/app/theme.css:14` |
| `#e1e8f0` | `#e1e8f0` | 1 | `apps/web/src/app/theme.css:16` |
| `#f4f7fa` | `#f4f7fa` | 1 | `apps/web/src/app/theme.css:15` |
| `#fdecea` | `#fdecea` | 1 | `apps/web/src/app/theme.css:20` |
| `#fff4e0` | `#fff4e0` | 1 | `apps/web/src/app/theme.css:22` |
| `#ffffff` | `#ffffff` | 1 | `apps/web/src/app/theme.css:18` |
| `rgb(27_31_42/0.25)` | `rgb(27_31_42/0.25)` | 1 | `apps/web/src/components/business-card.tsx:28` |

**Colores — alcance `doc-mockup`** (13 literales, 5 valores distintos)

| Valor normalizado | Escrito como | n | Ubicaciones (ruta:línea) |
|---|---|---|---|
| `#ffffff` | `#fff` | 5 | `docs/marca/logo.html:16,41,66,72,84` |
| `#00968e` | `#00968e` | 3 | `docs/marca/logo.html:35,68,82` |
| `#1b1f2a` | `#1b1f2a` | 3 | `docs/marca/logo.html:49,53,71` |
| `#007a73` | `#007a73` | 1 | `docs/marca/logo.html:27` |
| `#00a89f` | `#00a89f` | 1 | `docs/marca/logo.html:27` |

**Escala tipográfica en uso (clases Tailwind, 144 archivos escaneados)** — una fila por combinación distinta de tamaño/interlineado/peso/familia/tracking dentro de un mismo literal de string.

| n | Combinación (clases) | font-size | line-height | weight | Variantes responsive | Primera ubicación |
|---|---|---|---|---|---|---|
| 73 | `text-sm` | 14px | 20px | — (hereda) |  | `apps/web/src/app/page.tsx:46` |
| 42 | `text-xs` | 12px | 16px | — (hereda) |  | `apps/web/src/app/admin/page.tsx:80` |
| 16 | `font-semibold` | — | — | 600 |  | `apps/web/src/app/(auth)/ingresar/page.tsx:26` |
| 9 | `text-sm font-semibold` | 14px | 20px | 600 |  | `apps/web/src/app/mis-emprendimientos/nuevo/new-business-form.tsx:71` |
| 6 | `text-3xl font-black` | 30px | 36px | 900 |  | `apps/web/src/app/(auth)/ingresar/page.tsx:12` |
| 6 | `font-bold` | — | — | 700 |  | `apps/web/src/app/cotizaciones/page.tsx:47` |
| 5 | `text-xs font-semibold` | 12px | 16px | 600 |  | `apps/web/src/app/admin/page.tsx:130` |
| 4 | `text-base text-xs font-semibold` | 16px | 24px | 600 |  | `apps/web/src/app/admin/page.tsx:102` |
| 3 | `text-xl font-extrabold` | 20px | 28px | 800 |  | `apps/web/src/app/page.tsx:72` |
| 3 | `text-2xl font-bold` | 24px | 32px | 700 |  | `apps/web/src/app/cotizaciones/[id]/page.tsx:77` |
| 3 | `sm:text-4xl text-3xl font-black` | 30px | 36px | 900 | `sm:text-4xl` | `apps/web/src/app/e/[slug]/page.tsx:36` |
| 2 | `text-lg` | 18px | 28px | — (hereda) |  | `apps/web/src/app/page.tsx:33` |
| 2 | `text-2xl font-extrabold` | 24px | 32px | 800 |  | `apps/web/src/app/page.tsx:97` |
| 2 | `text-lg font-extrabold` | 18px | 28px | 800 |  | `apps/web/src/app/mis-emprendimientos/page.tsx:46` |
| 1 | `sm:text-6xl text-4xl leading-[1.05] font-black` | 36px | 1.05 | 900 | `sm:text-6xl` | `apps/web/src/app/page.tsx:30` |
| 1 | `font-extrabold` | — | — | 800 |  | `apps/web/src/app/oportunidades/page.tsx:39` |
| 1 | `leading-snug font-extrabold` | — | 1.375 | 800 |  | `apps/web/src/components/business-card.tsx:33` |
| 1 | `text-2xl` | 24px | 32px | — (hereda) |  | `apps/web/src/components/business-logo.tsx:7` |
| 1 | `font-black tracking-tight` | — | — | 900 |  | `apps/web/src/components/business-logo.tsx:31` |
| 1 | `[&_h2]:text-xl leading-relaxed [&_h2]:font-extrabold` | — | 1.625 | — (hereda) | `[&_h2]:text-xl [&_h2]:font-extrabold` | `apps/web/src/components/legal.tsx:6` |
| 1 | `text-sm font-medium` | 14px | 20px | 500 |  | `apps/web/src/components/site-chrome.tsx:11` |
| 1 | `text-xl font-black tracking-tight` | 20px | 28px | 900 |  | `apps/web/src/components/site-chrome.tsx:15` |
| 1 | `text-base text-xs` | 16px | 24px | — (hereda) |  | `apps/web/src/components/site-chrome.tsx:36` |
| 1 | `text-base text-sm font-semibold` | 16px | 24px | 600 |  | `apps/web/src/components/site-chrome.tsx:57` |
| 1 | `text-base` | 16px | 24px | — (hereda) |  | `apps/web/src/components/ui.tsx:7` |
| 1 | `text-lg font-bold` | 18px | 28px | 700 |  | `apps/web/src/components/ui.tsx:110` |

- **Tamaños** (11 distintos, 173 usos): `text-sm`×84 · `text-xs`×52 · `text-3xl`×9 · `text-base`×7 · `text-2xl`×6 · `text-lg`×5 · `text-xl`×4 · `sm:text-4xl`×3 · `[&_h2]:text-xl`×1 · `sm:text-6xl`×1 · `text-4xl`×1

- **Interlineado** (3 distintos, 3 usos): `leading-[1.05]`×1 · `leading-relaxed`×1 · `leading-snug`×1

- **Peso** (6 distintos, 68 usos): `font-semibold`×35 · `font-black`×12 · `font-bold`×10 · `font-extrabold`×9 · `[&_h2]:font-extrabold`×1 · `font-medium`×1

- **Familia (utilidad)**: ninguno.

- **Tracking** (1 distintos, 2 usos): `tracking-tight`×2

- **Espaciado** (70 distintos, 413 usos): `px-4`×43 · `gap-3`×29 · `py-3`×29 · `mb-4`×26 · `gap-2`×18 · `mt-1`×17 · `gap-4`×14 · `mb-3`×13 · `mt-3`×13 · `mt-4`×12 · `mt-6`×12 · `space-y-3`×12 · `px-3`×11 · `mt-2`×9 · `mx-auto`×9 · `py-1.5`×9 · `space-y-5`×9 · `py-4`×8 · `gap-10`×7 · `p-4`×7 · `py-2`×7 · `space-y-4`×7 · `gap-5`×5 · `mb-2`×5 · `mb-8`×5 · `px-6`×4 · `py-0.5`×4 · `gap-1`×3 · `gap-8`×3 · `mb-6`×3 · `sm:px-6`×3 · `space-y-2`×3 · `space-y-6`×3 · `gap-6`×2 · `mb-10`×2 · `p-5`×2 · `p-6`×2 · `px-1.5`×2 · `px-2`×2 · `px-2.5`×2 · `py-1`×2 · `py-10`×2 · `py-2.5`×2 · `py-5`×2 · `space-y-1`×2 · `space-y-12`×2 · `space-y-8`×2 · `[&_h2]:mt-10`×1 · `[&_li]:ml-5`×1 · `gap-1.5`×1 · `mb-1.5`×1 · `mb-5`×1 · `ml-1`×1 · `ml-2`×1 · `mr-2`×1 · `mt-5`×1 · `mt-8`×1 · `p-1.5`×1 · `pb-4`×1 · `pt-3`×1 · `pt-4`×1 · `pt-6`×1 · `pt-8`×1 · `px-3.5`×1 · `px-5`×1 · `py-14`×1 · `sm:py-14`×1 · `space-y-10`×1 · `space-y-14`×1 · `space-y-24`×1

- **Border-radius** (6 distintos, 58 usos): `rounded-full`×23 · `rounded-xl`×16 · `rounded-[var(--radius-card)]`×12 · `rounded-2xl`×3 · `rounded-lg`×3 · `rounded-bl-sm`×1

- **Box-shadow** (2 distintos, 2 usos): `hover:shadow-[0_8px_24px_-12px_rgb(27_31_42/0.25)]`×1 · `shadow-sm`×1

- **Transición / animación** (4 distintos, 8 usos): `transition-colors`×4 · `duration-300`×2 · `ease-[var(--ease-out-expo)]`×1 · `motion-reduce:transition-none`×1

- **Clases de la paleta por defecto de Tailwind**: ninguno.

- **Colores arbitrarios en clases**: ninguno.
