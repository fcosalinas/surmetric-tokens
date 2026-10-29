# Logo Surmetric en vector

`logo/` tiene el primer maestro vectorial del logo Surmetric. Hasta 0.1.0 el logo solo existía como PNG raster (inventario en `DECISIONES-PENDIENTES.md` §10), sin ningún archivo fuente. Se construyó a pedido (2026-10-29) a partir de la mejor versión raster disponible.

| Archivo | Fondo | Trazo | Wordmark |
|---|---|---|---|
| `surmetric-lockup.svg` | claro | `#1B1F2A` | `#1B1F2A` |
| `surmetric-lockup-white.svg` | oscuro | `#FFFFFF` | `#FFFFFF` |
| `surmetric-lockup-mono.svg` | claro, impresión sin color | `#1B1F2A` | `#1B1F2A` |
| `surmetric-isotipo.svg`, `-white`, `-mono` | igual que su lockup | | |

Los seis se generan con `python scripts/logo.py`. **No se editan a mano**: cualquier ajuste va en el script.

## De dónde sale cada valor

**Referencia**: `sitio-web-songal/public/logo-lockup-full.png` (commit `d85e38a`), PNG RGBA de 1857×280 con fondo transparente. Es el raster más grande y el único transparente a color. Las coordenadas del script están en píxeles de ese archivo.

### Isotipo

Se midió segmentando las caras por color y tomando sus puntos extremos:

- **Proyección dimétrica 2:1**: el rombo superior interior mide 146×72 px, con razón 0.49.
- **Paso entre cubos: 88 px**. Es el semiancho del rombo medido de eje a eje, y también el alto del cubo: la arista inferior de la cara izquierda del cubo izquierdo, en x=101, cae en y=221 por dentro, que es lo que da un alto de 88.
- **Composición**: 2×2 cubos grises sin la celda delantera derecha (centros de los rombos superiores en (196,56), (108,100) y (196,144)). El cubo teal ocupa esa celda desplazado 57 px al este (centro en (341,100)), y el cubo gris delantero tapa parte de su cara izquierda. Se pinta de atrás hacia adelante: atrás, izquierda, teal, adelante.
- **Trazo: 13.4 px**. Las caras interiores quedan 15 px adentro del eje en horizontal sobre aristas de pendiente 1/2, o sea 6.7 px en perpendicular. Entre caras verticales vecinas, el trazo mide 14 px.
- **Uniones redondeadas** (`stroke-linejoin="round"`), como en el logo SVG de Surdat. Con unión en punta, los vértices agudos de 53° sobresaldrían 15 px.

### Colores: ajustados a la paleta

El raster tiene degradados y antialiasing (≈12,700 colores distintos), así que cada cara se llevó al token de paleta más cercano. Es el mismo mapeo que usa el logo SVG de Surdat en symdat:

| Cara | Medido (moda) | Token |
|---|---|---|
| Superior, cubos grises | `#E1E7EE` | `brand-gray-100` `#E1E8F0` |
| Izquierda, cubos grises | `#8898AA` | `brand-gray-400` `#8E9AA8` |
| Derecha, cubos grises | `#AFBDCB` | `brand-gray-300` `#B8C2CC` |
| Superior, teal | `#00B2AC` | `brand-teal-bright` `#00B2AC` (exacto) |
| Izquierda, teal | `#00736F` | `brand-teal-dark` `#00766F` |
| Derecha, teal | `#00948F` | `brand-teal` `#00968E` |
| Trazo y wordmark | `#131F28` | `brand-dark` `#1B1F2A` |

El wordmark del raster mide `#131F28`, no `#1B1F2A`. Se usó `#1B1F2A` porque es el color de marca declarado y el del logo de Surdat. Confirmado por el dueño de la marca (2026-10-29): queda `#1B1F2A`, y "SUR" en 700 en vez de 675.

### Wordmark

- **Fuente**: Montserrat, la variable que trae el paquete (`@fontsource-variable/montserrat` 5.3.0). Las letras están convertidas a trazos, así que el SVG no depende de la fuente.
- **Medidas del raster**:
  - versales planas (E, T, I) entre las filas 60 y 219, o sea 160 px de alto de versal (`sCapHeight` = 700 unidades);
  - asta de "SUR": 36 px;
  - asta de "METRIC": 16 px.
- **Ajuste**: se compararon los anchos de cada letra y los huecos entre letras contra Montserrat instanciada de 300 a 900:
  - **"SUR" calza mejor en peso 675.** Se usó **700 (Bold)**: es un peso estándar y la diferencia es menor a 1.5 px por letra en versales de 160 px.
  - **"METRIC" calza en 400 (Regular)**, con error de ancho de 2.8 px en total.
  - **Tracking 0** en ambas: los huecos medidos difieren de los de la fuente en menos de 1.5 px. Sin kerning.
- **Posición**: "S" empieza en x=475 y "M" en x=989, medido.

### Variantes

- **Blanca**: igual a la de color, con trazo y wordmark blancos. Así resuelve el raster `logo-lockup-white.png` los fondos oscuros.
- **Mono**: los cubos grises quedan iguales (ya son neutros). El cubo teal pasa a neutros más oscuros (`#8E9AA8` arriba, `#2D3140` izquierda, `#5D6978` derecha), para que siga destacando sin color. El raster `logo-lockup-mono.png` hacía lo mismo, pero con un wordmark de otra tipografía. Aquí el wordmark es Montserrat, como en las otras variantes.

## Favicon (v0.2.3)

`favicon.svg` es el isotipo de color **tal cual**, centrado en un cuadrado del ancho del isotipo (422.4) y con fondo transparente. Sale de `scripts/logo.py`. `npm run favicon` (`scripts/favicon.mjs`, con `@resvg/resvg-js` 2.6.2) genera desde ese SVG:

| Archivo | Tamaño | Fondo |
|---|---|---|
| `favicon.ico` | 16, 32 y 48 px (PNG embebidos) | transparente |
| `apple-touch-icon.png` | 180 px | `#FFFFFF`, con 10% de margen por lado: iOS rellena de negro lo transparente |
| `icon-192.png`, `icon-512.png` | 192 y 512 px | transparente (manifest de PWA) |

**Decisión (2026-10-29)**: el isotipo completo también a 16 px. A ese tamaño se lee como silueta: un bloque gris con el cubo teal, y los trazos casi desaparecen. Se probó trazo 24 en vez de 13.4 y se veía más oscuro sin ganar lectura. Las alternativas descartadas fueron solo el cubo teal (habría sido una variante nueva de la marca) y el trazo grueso. A 32 px y más se ve completo.

## Verificación

El lockup se superpuso al raster en Chrome headless con `mix-blend-mode: difference`, ambos opacos sobre blanco, a escala 1:1. El resultado es negro en toda la superficie. Solo quedan bordes de 1 px de antialiasing y pequeñas marcas en los vértices exteriores, porque el raster tiene esquinas algo más agudas que las uniones redondeadas.

## Lo que falta

- **Imagen OG** (vista previa al compartir enlaces): no se genera. Necesita una composición propia (lockup sobre un fondo de 1200×630), que es una decisión de diseño.
- **Área de protección**: la skill de branding la define como "la altura del isotipo (el cubo)". El viewBox de los SVG está ceñido a la tinta, sin margen.
- **Reemplazo en las apps y en la skill**: songal, IAnsurance y la skill `surmetric-branding` siguen usando los PNG, incluido el JPEG con extensión `.png` y los isotipos con el fragmento de "S" (§10 de las decisiones). Ninguna app se tocó.
