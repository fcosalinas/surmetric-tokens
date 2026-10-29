Logo Surmetric en vector, el primero que existe: hasta v0.2.0 solo había PNG. Se generó con `scripts/logo.py` del repo `surmetric-tokens` a partir del raster de surmetric.cl. Los colores de las caras están ajustados a la paleta (`brand-gray-100`, `brand-gray-400`, `brand-gray-300`, `brand-teal-bright`, `brand-teal-dark` y `brand-teal`), y el wordmark es Montserrat convertida a trazos: "SUR" en 700 y "METRIC" en 400.

| Archivo | Fondo |
|---|---|
| `surmetric-lockup.svg` | Claro: blanco o `brand-gray-100` |
| `surmetric-lockup-white.svg` | `brand-dark` o fotos oscuras |
| `surmetric-lockup-mono.svg` | Escala de grises: el cubo teal pasa a neutros |
| `surmetric-isotipo.svg`, `-white`, `-mono` | Igual que su lockup, para espacios chicos |

El viewBox está ceñido a la tinta: el margen libre (la altura del isotipo) lo pone quien lo usa. Bajo ~24px el isotipo se empasta; falta un favicon simplificado.
