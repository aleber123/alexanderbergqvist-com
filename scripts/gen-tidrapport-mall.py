"""Generate the free timesheet templates served from /downloads/.

    ~/Downloads/asc-launcher/.venv/bin/python scripts/gen-tidrapport-mall.py

Writes:
  public/downloads/tidrapport-mall-vecka.xlsx  – weekly, with formulas
  public/downloads/tidrapport-mall-manad.pdf   – monthly, printable A4

Needs openpyxl + reportlab. Re-run after changing the layout; the files
are committed so the site build doesn't depend on Python.
"""
import os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'downloads')
os.makedirs(OUT, exist_ok=True)

INK = '1F1B16'
BLUE = '1976D2'
LIGHT = 'EAF2FB'
thin = Side(style='thin', color='C9C2B8')
box = Border(left=thin, right=thin, top=thin, bottom=thin)


def xlsx_week():
    wb = Workbook()
    ws = wb.active
    ws.title = 'Tidrapport vecka'
    ws.sheet_view.showGridLines = False

    widths = {'A': 12, 'B': 13, 'C': 10, 'D': 10, 'E': 11, 'F': 15, 'G': 13, 'H': 34}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    ws['A1'] = 'Tidrapport – vecka'
    ws['A1'].font = Font(size=18, bold=True, color=INK)
    ws['A2'] = 'Fyll i de ljusblå fälten. Timmar, summor och lön räknas ut automatiskt.'
    ws['A2'].font = Font(italic=True, color='6B645B')

    fields = [
        ('A4', 'Namn', 'C4'),
        ('A5', 'Arbetsgivare', 'C5'),
        ('A6', 'Veckans måndag', 'C6'),
        ('E4', 'Timlön (kr)', 'G4'),
        ('E5', 'OB-tillägg (%)', 'G5'),
        ('E6', 'Vecka', 'G6'),
    ]
    inp = PatternFill('solid', fgColor=LIGHT)
    for label_cell, label, value_cell in fields:
        ws[label_cell] = label
        ws[label_cell].font = Font(bold=True)
        c = ws[value_cell]
        c.fill = inp
        c.border = box
    ws.merge_cells('C4:D4')
    ws.merge_cells('C5:D5')
    ws.merge_cells('C6:D6')
    ws['C6'].number_format = 'yyyy-mm-dd'
    ws['G4'].number_format = '#,##0.00'
    ws['G5'].number_format = '0'
    ws['G5'] = 50
    ws['G6'] = '=IF(C6="","",ISOWEEKNUM(C6))'
    ws['G6'].fill = PatternFill(None)

    head = ['Dag', 'Datum', 'Start', 'Slut', 'Rast (min)', 'Arbetade timmar', 'varav OB-tim', 'Anteckning']
    r0 = 8
    for i, h in enumerate(head):
        c = ws.cell(row=r0, column=i + 1, value=h)
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=BLUE)
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        c.border = box
    ws.row_dimensions[r0].height = 30

    days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']
    for i, d in enumerate(days):
        r = r0 + 1 + i
        ws.cell(row=r, column=1, value=d).font = Font(bold=True)
        ws.cell(row=r, column=2, value=f'=IF($C$6="","",$C$6+{i})').number_format = 'yyyy-mm-dd'
        for col in (3, 4):
            c = ws.cell(row=r, column=col)
            c.number_format = 'hh:mm'
            c.fill = inp
        ws.cell(row=r, column=5).fill = inp
        # MOD(slut-start;1) handles night shifts that end after midnight.
        ws.cell(row=r, column=6, value=f'=IF(OR(C{r}="",D{r}=""),"",ROUND(MOD(D{r}-C{r},1)*24-N(E{r})/60,2))').number_format = '0.00'
        ws.cell(row=r, column=7).fill = inp
        ws.cell(row=r, column=7).number_format = '0.00'
        ws.cell(row=r, column=8).fill = inp
        for col in range(1, 9):
            ws.cell(row=r, column=col).border = box
            if col < 8:
                ws.cell(row=r, column=col).alignment = Alignment(horizontal='center')

    rs = r0 + 8
    first, last = r0 + 1, r0 + 7
    ws.cell(row=rs, column=1, value='Summa').font = Font(bold=True)
    ws.cell(row=rs, column=6, value=f'=SUM(F{first}:F{last})').number_format = '0.00'
    ws.cell(row=rs, column=7, value=f'=SUM(G{first}:G{last})').number_format = '0.00'
    for col in range(1, 9):
        c = ws.cell(row=rs, column=col)
        c.font = Font(bold=True)
        c.border = box
        c.fill = PatternFill('solid', fgColor='F3EFE8')
        if col < 8:
            c.alignment = Alignment(horizontal='center')

    r = rs + 2
    rows = [
        ('Grundlön (timmar × timlön)', f'=IF($G$4="","",F{rs}*$G$4)'),
        ('OB-tillägg (OB-tim × timlön × OB-%)', f'=IF($G$4="","",G{rs}*$G$4*$G$5/100)'),
        ('Summa före skatt', f'=IF($G$4="","",F{r}+F{r + 1})'),
    ]
    for i, (label, formula) in enumerate(rows):
        ws.cell(row=r + i, column=1, value=label).font = Font(bold=(i == 2))
        ws.merge_cells(start_row=r + i, start_column=1, end_row=r + i, end_column=5)
        c = ws.cell(row=r + i, column=6, value=formula)
        c.number_format = '#,##0.00 "kr"'
        c.font = Font(bold=(i == 2))
        c.border = box

    r += 5
    ws.cell(row=r, column=1, value='Underskrift anställd: ______________________      Attesterat av: ______________________')
    r += 2
    ws.cell(row=r, column=1, value='Tips: skriv tider som 07:30 och 16:00. Slutar passet efter midnatt räknas det ändå rätt.').font = Font(italic=True, color='6B645B')
    ws.cell(row=r + 1, column=1, value='Slipp mallen: appen Tidrapportera räknar timmar, OB och lön automatiskt – alexanderbergqvist.com/tidrapport/').font = Font(italic=True, color=BLUE)

    dv = DataValidation(type='decimal', operator='between', formula1='0', formula2='600', allow_blank=True,
                        error='Ange rast i minuter, t.ex. 30.', errorTitle='Rast')
    ws.add_data_validation(dv)
    dv.add(f'E{first}:E{last}')

    ws.print_area = f'A1:H{r + 1}'
    ws.page_setup.orientation = 'landscape'
    ws.page_setup.fitToWidth = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.freeze_panes = 'A9'

    # No cached values are stored, so ask the app to recalc on open.
    wb.calculation.fullCalcOnLoad = True
    wb.properties.title = 'Tidrapport mall – vecka'
    wb.properties.creator = 'Alexander Bergqvist'
    path = os.path.join(OUT, 'tidrapport-mall-vecka.xlsx')
    wb.save(path)
    return path


def pdf_month():
    path = os.path.join(OUT, 'tidrapport-mall-manad.pdf')
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle('Tidrapport mall – månad')
    c.setAuthor('Alexander Bergqvist')
    W, H = A4
    left, right = 14 * mm, W - 14 * mm

    c.setFont('Helvetica-Bold', 18)
    c.drawString(left, H - 20 * mm, 'Tidrapport – månad')

    # Header fields
    c.setFont('Helvetica', 9)
    y = H - 30 * mm
    fields = [('Namn', left, 80 * mm), ('Arbetsgivare', left + 92 * mm, 90 * mm)]
    fields2 = [('Månad och år', left, 80 * mm), ('Anställningsnr / avdelning', left + 92 * mm, 90 * mm)]
    for row_y, row in ((y, fields), (y - 11 * mm, fields2)):
        for label, x, w in row:
            c.setFillColor(colors.HexColor('#6B645B'))
            c.drawString(x, row_y + 5 * mm, label)
            c.setStrokeColor(colors.HexColor('#9C948A'))
            c.line(x, row_y, x + w, row_y)
    c.setFillColor(colors.black)

    cols = [('Dag', 16), ('Start', 18), ('Slut', 18), ('Rast (min)', 18), ('Arbetade tim', 22),
            ('OB-tim', 18), ('Övertid tim', 20), ('Anteckning', 0)]
    total_w = right - left
    fixed = sum(w for _, w in cols) * mm
    widths = [w * mm if w else total_w - fixed for _, w in cols]
    xs = [left]
    for w in widths:
        xs.append(xs[-1] + w)

    top = y - 22 * mm
    row_h = 6.1 * mm
    # Header row
    c.setFillColor(colors.HexColor('#1976D2'))
    c.rect(left, top - row_h, total_w, row_h, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 8)
    for (label, _), x, w in zip(cols, xs, widths):
        c.drawCentredString(x + w / 2, top - row_h + 2 * mm, label)

    c.setFont('Helvetica', 8)
    c.setStrokeColor(colors.HexColor('#C9C2B8'))
    for i in range(31):
        yy = top - row_h * (i + 2)
        if i % 2 == 1:
            c.setFillColor(colors.HexColor('#F6F3EE'))
            c.rect(left, yy, total_w, row_h, stroke=0, fill=1)
        c.setFillColor(colors.black)
        c.drawCentredString(xs[0] + widths[0] / 2, yy + 2 * mm, str(i + 1))
    # Summa row
    ys = top - row_h * 33
    c.setFillColor(colors.HexColor('#EAE4DA'))
    c.rect(left, ys, total_w, row_h, stroke=0, fill=1)
    c.setFillColor(colors.black)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(left + 2 * mm, ys + 2 * mm, 'Summa')

    # Grid
    bottom = ys
    for x in xs:
        c.line(x, top, x, bottom)
    for i in range(34):
        c.line(left, top - row_h * i, right, top - row_h * i)

    # Signatures
    sy = bottom - 20 * mm
    c.setFont('Helvetica', 9)
    for label, x in (('Underskrift anställd', left), ('Attesterat av arbetsgivare', left + 92 * mm)):
        c.line(x, sy, x + 80 * mm, sy)
        c.setFillColor(colors.HexColor('#6B645B'))
        c.drawString(x, sy - 4.5 * mm, label + '  (datum och namnförtydligande)')
        c.setFillColor(colors.black)

    c.setFont('Helvetica-Oblique', 7.5)
    c.setFillColor(colors.HexColor('#6B645B'))
    c.drawString(left, 12 * mm,
                 'Arbetade tim = slut - start - rast. Fler mallar och instruktioner: alexanderbergqvist.com/tidrapport/tidrapport-mall/')
    c.drawString(left, 8 * mm,
                 'Slipp räkna för hand: appen Tidrapportera räknar timmar, OB och lön automatiskt och exporterar samma rapport som PDF.')
    c.showPage()
    c.save()
    return path


if __name__ == '__main__':
    for p in (xlsx_week(), pdf_month()):
        print(p, os.path.getsize(p), 'bytes')
