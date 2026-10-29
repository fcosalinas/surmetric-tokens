# Proyección en Claude: el sistema de diseño "Surmetric Core"

`https://claude.ai/artifact/FbjoeVnhJvjSkRV1y67Fta` es una proyección de este repo: se escribe desde aquí y nunca al revés. Un cambio hecho en la página se pierde en el próximo sync de ese archivo.

## Qué se proyecta

| En el artifact | Desde el repo | Cómo |
|---|---|---|
| `project/tokens.json` | `tokens/tokens.json` | íntegro |
| `project/README.md` | `docs/SISTEMA.md` | íntegro. Es el brand book. No es el `README.md` del repo, que trae instalación y tablas para devs, cosa que el tipo pide no poner. |
| `project/fonts/*.woff2` | `fonts/*.woff2` | como archivos, solo las que declara `type.fonts` |
| grupo de assets **Logos** | `logo/surmetric-*.svg` (el favicon y sus derivados no) | subidas al almacén de assets, con su registro en `assetGroups` del índice |
| `project/assets/Logos/README.md` | `logo/README.md` | íntegro |
| `project/design-system.json` (índice) | — | se lee justo antes y se reescribe al final: solo cambian el grupo Logos, `groups` y `lastChange` |

Dos cosas las maneja la página y el sync las respeta. Al README servido le agrega una sección generada ("Consuming this system" con un índice), que se ignora al comparar. Y el orden de las tiles de Logos se puede cambiar en la página: el sync solo agrega al final los nombres que falten.
| `project/components/Cover/preview.html` | — | a mano. El sync no la regenera: avisa si cambiaron el nombre, la paleta o las escalas que dibuja. |

## Cómo se corre

En Claude Code, desde este repo: **`/sync-artifact`** (`.claude/commands/sync-artifact.md`). El comando:

1. baja lo que el artifact sirve hoy;
2. corre `npm run sync:artifact`;
3. sube solo los SVG cuyos bytes cambiaron;
4. publica solo los archivos que cambiaron, con el índice en la última llamada;
5. vuelve a bajar y corre `npm run check:artifact`, que tiene que dar "Sin cambios".

Si no hay diferencias, no publica nada y lo dice.

Los scripts npm no funcionan solos en una terminal ni en CI: el artifact es privado y solo se lee y se escribe con la herramienta Artifact de Claude Code. No hay API ni token. Por eso los dos piden `--served <dir>`, la copia bajada en el momento, y fallan si no la tienen. No hay caché en disco contra la cual comparar.

- `npm run sync:artifact -- --served <dir> --out <dir>`: arma el plan y los archivos a publicar.
- `npm run check:artifact -- --served <dir>`: sale con 1 si la proyección está desfasada respecto del repo.

## Qué muestra la página distinto del repo

La página genera en cada guardado una ficha, `project/api/tokens.md`, con lo que entendió de `tokens.json`. `/sync-artifact` la baja y el script compara contra ella. Verificado el 2026-10-29, con la ficha de la v0.2.3:

- **Todos los tokens aparecen**, incluido `ease-out-expo`: la ficha tiene una sección Easing. El "No motion family" de `format.md` no aplica a una familia llamada `easing`.
- **El tracking de los títulos y del `eyebrow` aparece** (por ejemplo "letter-spacing -0.025em").
- **La página agrega valores donde Core no los define a propósito.** A `micro-11` y `micro-10` les asigna interlineado 1.4 (en Core heredan el del contenedor). A la escala `xs`…`6xl` y a los micro les asigna peso 400 (en Core heredan). Esos valores quedan en el `tokens.css` que genera la página, así que un diseño hecho en Claude con esas clases fija interlineado y peso que en las apps no existen. No tiene arreglo desde el repo: el formato no tiene forma de decir "hereda".
- **El `uppercase` del eyebrow** no es un token: está solo en el texto del sistema y en la receta.
- **Lo que vive en `dist/`** (preset de Tailwind 3, `theme.css`, tipos TS) y las recetas de componentes son del paquete npm, no del sistema.

`check:artifact` también valida `tokens.json` contra las reglas de descarte de `format.md` (nombres, alias, largos y topes). Si algo se descartaría, lo lista y falla.

## Blobs huérfanos

Cuando un SVG cambia, se sube como blob nuevo y el anterior queda en el almacén sin registro. No se borran sin decidirlo. El sync anota aquí cada uno.

| Fecha | Versión que lo reemplazó | Archivo | Blob huérfano |
|---|---|---|---|
<!-- huerfanos:end -->

Borrados (2026-10-29, a pedido): los 6 blobs de la primera subida de la v0.2.0, reemplazados en la v0.2.1 (`b08fb56e…`, `cea694f1…`, `3ed7f655…`, `67621e1c…`, `b4fa7e3a…`, `2e781191…`).
