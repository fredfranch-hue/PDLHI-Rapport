import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function generatePdf(report = {}, desordres = []) {
  const pdfDoc = await PDFDocument.create()

  const A4_WIDTH = 595.28
  const A4_HEIGHT = 841.89
  const margin = 48

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
  let { width, height } = page.getSize()
  let y = height - margin

  const drawText = (text, options = {}) => {
    const size = options.size || 12
    const font = options.bold ? helveticaBold : helvetica
    const x = options.x != null ? options.x : margin
    const align = options.align || 'left'
    let textWidth = font.widthOfTextAtSize(text, size)
    let tx = x
    if (align === 'center') tx = (width - textWidth) / 2
    page.drawText(text, { x: tx, y, size, font })
    y -= (options.leading || size + 6)
  }

  // Title
  drawText('RAPPORT DE VISITE', { size: 18, bold: true, align: 'center', leading: 24 })
  y -= 6

  const infoLines = [
    ['Date', report.date || '—'],
    ['Commune', report.commune || '—'],
    ['Adresse', report.adresse || '—'],
    ['Bailleur', report.bailleur || '—'],
    ['Occupant', report.occupant || '—'],
    ['Référence Signal Logement', report.refSignalLogement || '—'],
    ['Référence AXEL', report.refAxel || '—'],
  ]

  for (const [label, value] of infoLines) {
    // check page break
    if (y < margin + 40) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      ({ width, height } = page.getSize())
      y = height - margin
    }
    drawText(label + ':', { bold: true })
    drawText(value, { leading: 16 })
  }

  y -= 6
  if (y < margin + 80) {
    page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    ({ width, height } = page.getSize())
    y = height - margin
  }

  drawText('CONSTATS', { size: 14, bold: true, leading: 18 })
  y -= 6

  for (const d of desordres) {
    if (y < margin + 80) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      ({ width, height } = page.getSize())
      y = height - margin
    }

    drawText('Pièce', { bold: true })
    drawText(d.piece || '—')

    drawText('Catégorie', { bold: true })
    drawText(d.categorie || '—')

    drawText('Désordre', { bold: true })
    drawText(d.desordre || '—')

    drawText('Commentaire', { bold: true })
    drawText(d.commentaire || '—', { leading: 18 })

    y -= 6
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const date = (report.date && report.date.slice(0, 10)) || new Date().toISOString().slice(0, 10)
  const filename = `Rapport_PDLHI_${date}.pdf`
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default generatePdf
