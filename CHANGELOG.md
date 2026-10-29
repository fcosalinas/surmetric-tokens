# Changelog

Política de versiones y de qué cuenta como breaking: README, "Desarrollo y versiones".

## 0.2.2 — 2026-10-29

Parche: ningún valor de token cambia.

- **`/sync-artifact`** (Claude Code) y `npm run sync:artifact` / `npm run check:artifact`: proyectan el repo en el sistema de diseño "Surmetric Core" de Claude y verifican que no esté desfasado. Solo publican lo que cambió. Ver `docs/ARTIFACT.md`.
- `docs/SISTEMA.md`: el texto del sistema de diseño (su README) pasa a vivir en el repo. `logo/README.md`: la nota del grupo Logos.
- README: el paso 5 de "Publicar una versión" usa `/sync-artifact`.

## 0.2.1 — 2026-10-29

Parche: ningún valor de token cambia.

- `dist/theme.css`: el comentario de cabecera ya no contiene el texto `@import "tailwindcss"`. La versión de Tailwind para navegador (`@tailwindcss/browser`) lo detectaba dentro de un `<style type="text/tailwindcss">` y dejaba de aplicar el tema. Con build (Vite, Next, CLI) no afectaba.
- `logo/`: el viewBox queda ceñido a la tinta de verdad. `scripts/logo.py` calculaba el borde del isotipo como si las uniones fueran en punta (15 px de trazo fuera del vértice) y son redondeadas (6.7 px), así que sobraban ~8 px a cada lado. Isotipo: `13.3 5.3 422.4 277.4`; lockup: 1840.61 de ancho. El dibujo no cambia.

## 0.2.0 — 2026-10-29

Aplica las decisiones de la Fase A (`docs/DECISIONES-PENDIENTES.md`).

### Breaking

- **`brand-gray-500-legacy` → `brand-gray-400`** (mismo valor, `#8E9AA8`). Cambian la clase (`text-brand-gray-500-legacy` → `text-brand-gray-400`), la variable (`--sm-color-brand-gray-500-legacy` → `--sm-color-brand-gray-400`) y la clave en TS. Ningún `package.json` de los commits auditados depende del paquete, así que no hay nada que migrar en las apps.

### Nuevo

- **Botón primario**: `action` (`#00766F` / oscuro `#00B2AC`), `action-hover` (`#1B1F2A` / `#00968E`), `on-action` (`#FFFFFF` / `#1B1F2A`). El build verifica que `on-action` pase AA sobre ambos.
- **Escala tipográfica**: `xs`…`6xl` con los mismos valores e interlineados de Tailwind (las clases no cambian), y títulos `display`, `title-1`…`title-4` con peso y tracking (`text-title-1` aplica tamaño, interlineado, peso y tracking en Tailwind 3 y 4).
- **Rótulo `eyebrow`**: 0.75rem / 1rem / 600 / 0.1em; se usa como `text-eyebrow uppercase text-ink-muted`. Reemplaza los `.eyebrow` de lex (0.14em → 0.1em) y yolotengo (0.72rem/700 → 12px/600; color `#8E9AA8` → `#5D6978`, que sí pasa AA a 12px).
- **Espaciado**: familia `spacing`, base 4px, 17 pasos (`space-0_5` … `space-32`, incluido `space-14`). En Tailwind 4 se emite `--spacing: 0.25rem`, igual al valor por defecto; en Tailwind 3 no se toca la escala.
- **Radios**: `radius-control` 6px, `radius-button` 6px, `radius-pill` 9999px (`rounded-control`, `rounded-button`, `rounded-pill`).
- **Logo vectorial** en `logo/` (lockup e isotipo, color, blanco y mono), exportado como `surmetric-tokens/logo/*`. Ver `docs/LOGO.md`.
- TS/JS: exports `typeStyles` y `spacing`.

### Cambios sin cambio de valor

- `on-accent` queda **deprecado**: usar `action` + `on-action`. Se quita en la próxima versión breaking.
- `accent` deja de describirse como relleno de botón; es solo acento no-texto. Se corrige su `usage`: el mínimo real sobre `surface` en claro es 3.39:1, no 3.54:1.
- `ease-out-expo` documenta sus puntos de control en `usage`.
- README: receta del rótulo, tema oscuro marcado "sin consumidores", recetas de componentes, regla de adopción, política de versiones y orden de adopción.

### Pendiente fuera de este repo

Cambios que este repo no puede hacer:

- **Skill `surmetric-branding`**:
  - `SKILL.md:30` dice `brand-gray-500 = #8E9AA8 — Texto secundario…`. Debe decir `brand-gray-400 = #8E9AA8 — gris de identidad (logo, ilustración); no es texto sobre fondos claros` y agregar `brand-gray-500 = #5D6978 — texto secundario, metadatos, placeholders`.
  - `SKILL.md:67`: "Small/meta 13px en brand-gray-500" pasa a 12px (`xs`) en `#5D6978`.
  - `SKILL.md:62-64`: la jerarquía queda alineada con los títulos de Core (900/900/800/700/700; tracking −0.025/−0.025/−0.02/−0.01/0 em).
  - `assets/palette.json`: mismo cambio de grises.
  - `assets/`: reemplazar los PNG por los SVG de `logo/`. Su `logo-lockup-full.png` es un JPEG.
- **Preferencia guardada en Claude**: "el secundario es `#8E9AA8`" pasa a "el gris de identidad es `#8E9AA8`; el texto secundario es `#5D6978`".
- **Proyección del sistema de diseño en Claude**: actualizar desde el tag `v0.2.0`. La proyección no tiene familia de movimiento, así que `ease-out-expo` puede no mostrarse.

## 0.1.0 — 2026-10-29

Primera versión: color en dos temas, Montserrat + Geist Mono, `micro-10`/`micro-11`, `radius-card`, `shadow-card-hover`, `ease-out-expo`.
