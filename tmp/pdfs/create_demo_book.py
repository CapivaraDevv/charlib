from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A5
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


OUTPUT = Path(__file__).resolve().parents[2] / "output" / "pdf" / "entre-linhas-demo.pdf"
WIDTH, HEIGHT = A5


def centered_text(pdf: canvas.Canvas, text: str, y: float, font: str, size: int, color: str) -> None:
    pdf.setFont(font, size)
    pdf.setFillColor(HexColor(color))
    x = (WIDTH - stringWidth(text, font, size)) / 2
    pdf.drawString(x, y, text)


def draw_page_number(pdf: canvas.Canvas, page: int) -> None:
    pdf.setStrokeColor(HexColor("#D3A84B"))
    pdf.setLineWidth(0.6)
    pdf.line(48, 38, WIDTH - 48, 38)
    centered_text(pdf, str(page), 22, "Helvetica", 8, "#7A5A45")


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A5)
    pdf.setTitle("Entre Linhas")
    pdf.setAuthor("Clara Monteiro")

    pdf.setFillColor(HexColor("#24140F"))
    pdf.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    centered_text(pdf, "ENTRE LINHAS", HEIGHT * 0.58, "Times-Bold", 30, "#F5E8D3")
    centered_text(pdf, "CLARA MONTEIRO", HEIGHT * 0.47, "Helvetica", 11, "#D3A84B")
    centered_text(pdf, "Uma história fictícia criada para demonstrar o CharLib", 54, "Helvetica-Oblique", 8, "#C9B9AB")
    pdf.showPage()

    chapters = [
        ("Capítulo 1", "A biblioteca depois da chuva"),
        ("Capítulo 2", "O bilhete na margem"),
        ("Capítulo 3", "Quando as páginas respiram"),
    ]
    body = [
        "A luz dourada atravessava a janela e repousava sobre os livros.",
        "Clara escolheu um volume antigo, abriu-o com cuidado e encontrou",
        "uma frase sublinhada. Não era apenas uma lembrança: era um convite",
        "para continuar a história exatamente de onde alguém havia parado.",
    ]

    page = 2
    for chapter, subtitle in chapters:
        for section in range(1, 5):
            pdf.setFillColor(HexColor("#FBF4E8"))
            pdf.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
            if section == 1:
                centered_text(pdf, chapter.upper(), HEIGHT - 105, "Helvetica-Bold", 9, "#B07A2A")
                centered_text(pdf, subtitle, HEIGHT - 145, "Times-Bold", 20, "#3A2118")
            pdf.setFillColor(HexColor("#4A342B"))
            pdf.setFont("Times-Roman", 11)
            y = HEIGHT - (205 if section == 1 else 92)
            for _ in range(5):
                for line in body:
                    pdf.drawString(52, y, line)
                    y -= 18
                y -= 12
            draw_page_number(pdf, page)
            pdf.showPage()
            page += 1

    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
