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

## Qué no se ve en la página

- **`easing`** (`ease-out-expo`): el formato del tipo no tiene familia de movimiento ("No motion family"). Viaja en `tokens.json`, pero no se muestra.
- **`letterSpacing`** de los títulos y del `eyebrow`: va en la clase que compila la página, pero la vista de Tipografía solo lee tamaño, peso e interlineado.
- **`uppercase` del `eyebrow`**: no es un token. Está en el texto del sistema y en la receta del README.
- **Lo que vive en `dist/`** (preset de Tailwind 3, `theme.css`, tipos TS) y las recetas de componentes: son del paquete npm, no del sistema.

`check:artifact` también valida `tokens.json` contra las reglas de descarte de `format.md` (nombres, alias, largos y topes). Si algo se descartaría, lo lista y falla.

## Blobs huérfanos

Cuando un SVG cambia, se sube como blob nuevo y el anterior queda en el almacén sin registro. No se borran sin decidirlo. El sync anota aquí cada uno.

| Fecha | Versión que lo reemplazó | Archivo | Blob huérfano |
|---|---|---|---|
| 2026-10-29 | v0.2.1 | `surmetric-lockup.svg` | `b08fb56e794e75d203656ee21c71b766` |
| 2026-10-29 | v0.2.1 | `surmetric-lockup-white.svg` | `cea694f199f0cac6ec4f78e5b0081e3f` |
| 2026-10-29 | v0.2.1 | `surmetric-lockup-mono.svg` | `3ed7f655de3c49e082c8c2bd328790e8` |
| 2026-10-29 | v0.2.1 | `surmetric-isotipo.svg` | `67621e1c8961bd906d8b7e8d135ada91` |
| 2026-10-29 | v0.2.1 | `surmetric-isotipo-white.svg` | `b4fa7e3a5d7672c29b5f2e2b16a3d4ad` |
| 2026-10-29 | v0.2.1 | `surmetric-isotipo-mono.svg` | `2e781191371f28912139ba07c404dc5d` |
<!-- huerfanos:end -->
