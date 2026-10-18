"""Generate PNG and SVG student QR assets for the published quiz URL.

Requires ReportLab and Pillow. The published site itself has no Python dependency.
"""

from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.graphics.barcode.qr import QrCodeWidget


QUIZ_URL = "https://alexbernardino.github.io/cnn-transformer-quiz/"
OUTPUT_STEM = Path(__file__).resolve().parent.parent / "cnn-transformer-quiz-qr"
MODULE_PIXELS = 32
QUIET_ZONE_MODULES = 4


def main() -> None:
    qr = QrCodeWidget(QUIZ_URL, barLevel="Q").qr
    qr.make()

    modules = qr.getModuleCount()
    total_modules = modules + 2 * QUIET_ZONE_MODULES
    side = total_modules * MODULE_PIXELS
    image = Image.new("1", (side, side), 1)
    draw = ImageDraw.Draw(image)
    svg_path = []

    for row in range(modules):
        for column in range(modules):
            if qr.isDark(row, column):
                x = (column + QUIET_ZONE_MODULES) * MODULE_PIXELS
                y = (row + QUIET_ZONE_MODULES) * MODULE_PIXELS
                draw.rectangle(
                    (x, y, x + MODULE_PIXELS - 1, y + MODULE_PIXELS - 1),
                    fill=0,
                )
                svg_x = column + QUIET_ZONE_MODULES
                svg_y = row + QUIET_ZONE_MODULES
                svg_path.append(f"M{svg_x},{svg_y}h1v1h-1z")

    png_output = OUTPUT_STEM.with_suffix(".png")
    svg_output = OUTPUT_STEM.with_suffix(".svg")
    image.save(png_output, optimize=True)
    svg_output.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{side}" '
        f'height="{side}" viewBox="0 0 {total_modules} {total_modules}" '
        'role="img">\n'
        '  <title>CNN and Transformer quiz QR code</title>\n'
        f'  <desc>{QUIZ_URL}</desc>\n'
        f'  <rect width="{total_modules}" height="{total_modules}" fill="white"/>\n'
        f'  <path d="{"".join(svg_path)}" fill="black" '
        'shape-rendering="crispEdges"/>\n'
        '</svg>\n',
        encoding="utf-8",
    )
    print(f"Created {png_output} ({side} x {side} px) for {QUIZ_URL}")
    print(f"Created {svg_output} (scalable, {total_modules} x {total_modules} modules)")


if __name__ == "__main__":
    main()

