# Genera logo/*.svg: isotipo y lockup de Surmetric, en vector.
#
# No es parte de `npm run build`: el logo se genera una vez y los SVG se commitean.
# Requiere Python 3 con fonttools y brotli (`pip install fonttools brotli`) y
# `npm install` hecho (lee Montserrat desde node_modules).
#
# Uso: python scripts/logo.py
#
# De dónde sale cada número: docs/LOGO.md. En resumen, todo se midió sobre
# sitio-web-songal/public/logo-lockup-full.png (1857x280, commit d85e38a), y las
# coordenadas de este archivo están en píxeles de ese raster.
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2"
OUT = ROOT / "logo"

# ---------- Isotipo: cubos en proyección dimétrica 2:1 ----------

A = 88  # semiancho del rombo superior = alto del cubo (paso entre cubos)
STROKE = 13.4  # trazo medido: inset interior de 6.7 px en perpendicular a la arista
# Centro del rombo superior de cada cubo, en orden de pintado (de atrás hacia adelante).
CUBES = [
    ("gray", 196, 56),   # atrás
    ("gray", 108, 100),  # izquierda
    ("teal", 341, 100),  # celda delantera derecha del 2x2, desplazada 57 px al este
    ("gray", 196, 144),  # adelante: tapa parte de la cara izquierda del teal
]

PALETTES = {
    # top, cara izquierda, cara derecha
    "color": {"gray": ("#E1E8F0", "#8E9AA8", "#B8C2CC"), "teal": ("#00B2AC", "#00766F", "#00968E"),
              "stroke": "#1B1F2A", "text": "#1B1F2A"},
    "white": {"gray": ("#E1E8F0", "#8E9AA8", "#B8C2CC"), "teal": ("#00B2AC", "#00766F", "#00968E"),
              "stroke": "#FFFFFF", "text": "#FFFFFF"},
    "mono": {"gray": ("#E1E8F0", "#8E9AA8", "#B8C2CC"), "teal": ("#8E9AA8", "#2D3140", "#5D6978"),
             "stroke": "#1B1F2A", "text": "#1B1F2A"},
}


def pts(*p):
    return " ".join(f"{x:g},{y:g}" for x, y in p)


def cube(kind, cx, cy, pal):
    top, left, right = pal[kind]
    n, e, s, w = (cx, cy - A / 2), (cx + A, cy), (cx, cy + A / 2), (cx - A, cy)
    down = lambda p: (p[0], p[1] + A)
    return [
        f'<polygon points="{pts(n, e, s, w)}" fill="{top}"/>',
        f'<polygon points="{pts(w, s, down(s), down(w))}" fill="{left}"/>',
        f'<polygon points="{pts(s, e, down(e), down(s))}" fill="{right}"/>',
    ]


def isotipo(pal):
    faces = [f for c in CUBES for f in cube(c[0], c[1], c[2], pal)]
    body = "\n    ".join(faces)
    return (f'<g stroke="{pal["stroke"]}" stroke-width="{STROKE}" stroke-linejoin="round">\n'
            f"    {body}\n  </g>")


# Extremos del isotipo con el trazo incluido. Los cuatro extremos son vértices (oeste del cubo
# izquierdo, norte del de atrás, este del teal, sur del de adelante) y con unión redondeada el
# trazo sobresale de un vértice exactamente medio trazo en cualquier dirección.
HALF = STROKE / 2
ISO_BOX = (108 - A - HALF, 56 - A / 2 - HALF, 341 + A + HALF, 144 + A / 2 + A + HALF)

# ---------- Wordmark: Montserrat 700 "SUR" + 400 "METRIC", sin tracking ----------

CAP_TOP, BASELINE = 60, 220          # versales planas (E, T, I) ocupan las filas 60..219
CAP_UNITS = 700                      # sCapHeight de Montserrat
K = (BASELINE - CAP_TOP) / CAP_UNITS
WORDS = [("SUR", 700, 475), ("METRIC", 400, 989)]  # x = borde izquierdo medido de la primera letra


def word_paths(text, weight, x_left, fill):
    font = instantiateVariableFont(TTFont(FONT), {"wght": weight})
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    first = cmap[ord(text[0])]
    bp = BoundsPen(gs)
    gs[first].draw(bp)
    pen_x = x_left - bp.bounds[0] * K
    out = []
    for ch in text:
        g = cmap[ord(ch)]
        svg = SVGPathPen(gs, ntos=lambda v: f"{round(v, 2):g}")
        gs[g].draw(TransformPen(svg, (K, 0, 0, -K, pen_x, BASELINE)))
        out.append(svg.getCommands())
        last = BoundsPen(gs)
        gs[g].draw(last)
        ink_right = pen_x + last.bounds[2] * K  # borde derecho de la tinta, sin el sidebearing
        pen_x += hmtx[g][0] * K
    return f'<path fill="{fill}" d="{" ".join(out)}"/>', ink_right


def svg(view, body, title):
    x0, y0, x1, y1 = view
    w, h = x1 - x0, y1 - y0
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:g} {y0:g} {w:g} {h:g}" '
            f'width="{w:g}" height="{h:g}" role="img" aria-label="{title}">\n'
            f"  <title>{title}</title>\n  {body}\n</svg>\n")


def r(v):
    return round(v, 2)


def main():
    OUT.mkdir(exist_ok=True)
    iso_view = tuple(map(r, ISO_BOX))
    for variant, pal in PALETTES.items():
        suffix = "" if variant == "color" else f"-{variant}"
        (OUT / f"surmetric-isotipo{suffix}.svg").write_text(svg(iso_view, isotipo(pal), "Surmetric"), "utf-8", newline="\n")

        parts, right = [isotipo(pal)], 0
        for text, weight, x in WORDS:
            p, right = word_paths(text, weight, x, pal["text"])
            parts.append(p)
        # viewBox ceñido a la tinta en los cuatro lados; el área de protección la pone quien lo usa.
        view = (iso_view[0], iso_view[1], r(right), iso_view[3])
        (OUT / f"surmetric-lockup{suffix}.svg").write_text(svg(view, "\n  ".join(parts), "Surmetric"), "utf-8", newline="\n")
    print("logo/ escrito:", ", ".join(sorted(p.name for p in OUT.glob("*.svg"))))


if __name__ == "__main__":
    main()
