La base compartida de los productos de Surmetric: Surdat, LexSemáforo, IAnsurance, piAtio, YoLoTengo y el sitio. Construye encima de estos tokens; lo que sea propio de un producto —series de gráfico, estados de semáforo, escalas de score— se define en el sistema de ese producto, nunca acá.

Este sistema es una proyección del repo `surmetric-tokens`: este texto es `docs/SISTEMA.md` y los tokens son `tokens/tokens.json`. Los valores se cambian en el repo y se vuelven a proyectar aquí con `/sync-artifact`, nunca al revés. La versión proyectada está en el último cambio del sistema.

## Fundamentos de contenido

Escribe en español latinoamericano neutral, en segunda persona y sin tecnicismos innecesarios. Los rótulos de sección usan `eyebrow`, en mayúsculas. Los ítems numerados se escriben `01`, `02`, `03` en la familia `mono`, nunca `1.` ni `#1`. No uses emoji en interfaz de producto. Los identificadores, montos, RUT, folios y fragmentos de código van en `mono`, siempre: es lo que distingue un dato de una frase.

## Color

Trabaja con los tokens semánticos, no con los de marca. `canvas` es el fondo de página, `surface` la superficie que va encima, `ink` el texto principal e `ink-muted` el secundario. Los tokens `brand-*` existen para que los semánticos apunten a algún lado y para los casos donde el valor literal importa —el logo, por ejemplo—; una pantalla no debería nombrarlos.

El botón primario se rellena con `action` (`#00766F`), su hover es `action-hover` (`#1B1F2A`) y su texto `on-action` (blanco): 5.50:1 en reposo y 16.46:1 en hover. En tema oscuro, `action` pasa a `#00B2AC` con texto `#1B1F2A`. `on-accent` está deprecado: texto blanco sobre `accent` da 3.65:1 y falla AA con texto chico.

El acento está racionado: `accent` ocupa como máximo un 15% del área visible. Es para íconos activos, anillos de foco y bordes, no para el relleno de botones. Como texto no sirve: para enlaces y texto teal usa `accent-strong`.

Hay dos grises. `brand-gray-500` (`#5D6978`) es el gris de texto: `ink-muted` resuelve a él y pasa AA sobre blanco (5.59:1). `brand-gray-400` (`#8E9AA8`) es el gris de identidad, el de las caras del logo, la ilustración y las series secundarias de un gráfico. No es texto sobre fondos claros (2.86:1 sobre blanco); en tema oscuro sí es el texto secundario.

Los estados siguen la misma regla: `danger`, `warning` e `info` sirven como íconos y bordes en los dos temas, pero como texto solo donde su nota lo autoriza. Dentro de un bloque `danger-soft` o `warning-soft` el texto va en `ink`, no en el color del estado. Acompaña siempre el color con una palabra o un ícono: el color solo no comunica el estado.

Deja mucho espacio en blanco y baja densidad. Las superficies se separan con `border`, no con sombra; `shadow-card-hover` es para el hover de una tarjeta y nada más.

El tema oscuro es opt-in y hoy no lo usa ninguna app. Sus valores pasan contraste, pero no son un compromiso de producto.

## Tipografía

`sans` y `display` son ambos Montserrat. `mono` es Geist Mono y es la familia de los datos.

- **Títulos**: `display` 48px, `title-1` 30px y `title-2` 24px, en peso 900, 900 y 800, con tracking −0.025, −0.025 y −0.02 em. `title-3` (20px) y `title-4` (18px, tarjetas, paneles y modales) van en 700. El estilo trae tamaño, interlineado, peso y tracking, pero no la familia: un título lleva siempre `display`.
- **Escala**: `xs` (12px) a `6xl` (60px), con los mismos valores e interlineados de Tailwind. Cuerpo en `base` (16/24) o `sm` (14/20) para interfaz.
- **Rótulo**: `eyebrow` 12/16, peso 600, tracking 0.1em, siempre en mayúsculas y en `ink-muted` o `accent-strong`. El token no puede llevar la transformación ni el color.
- **Micro**: `micro-11` para rótulos de gráfico y metadatos de tabla densa, `micro-10` para ejes y leyendas. No tienen interlineado propio: heredan el del contenedor.

Montserrat en 800 y 900 es solo para `display`, `title-1` y `title-2`. En tarjetas, tablas y UI densa el tope es 700.

## Forma, espacio y movimiento

- **Radios**: `radius-button` y `radius-control` (6px) para botones e inputs, que así calzan en altura en un formulario. `radius-pill` para chips y badges, y `radius-card` (14px) para tarjetas y paneles.
- **Espaciado**: base 4px, 17 pasos de `space-0_5` (2px) a `space-32` (128px), incluido `space-14` (56px).
- **Movimiento**: las transiciones y animaciones de aparición usan `ease-out-expo` —`cubic-bezier(0.16, 1, 0.3, 1)`—. Si el token no está disponible en tu entorno, escribe la curva literal, pero no inventes otra.

## Logo

El grupo **Logos** tiene las seis variantes en vector:

- el lockup principal, para fondos claros;
- la versión blanca, para `brand-dark` o fotos oscuras;
- la versión mono, para escala de grises;
- el isotipo en las mismas tres variantes.

Se escalan sin deformar y sin cambiar colores. El isotipo pierde detalle bajo unos 24px, así que no sirve como favicon: falta una versión simplificada. El margen libre alrededor del logo es la altura del isotipo.

## Iconografía

Core no incluye set de íconos todavía. Para íconos nuevos se recomienda Lucide con trazo 1.5, que calza con los íconos de línea del sitio. Los íconos se pintan en `ink`, `ink-muted` o `accent`, nunca en `brand-gray-300`, que es solo para estados deshabilitados.
