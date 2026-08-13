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

  const contentWidth = width - margin * 2

  const drawText = (text, options = {}) => {
    const size = options.size || 12
    const font = options.bold ? helveticaBold : helvetica
    const x = options.x != null ? options.x : margin
    const align = options.align || 'left'
    const textWidth = font.widthOfTextAtSize(text, size)
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
    if (y < margin + 40) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      ;({ width, height } = page.getSize())
      y = height - margin
    }
    drawText(label + ':', { bold: true })
    drawText(value, { leading: 16 })
  }

  y -= 6
  if (y < margin + 80) {
    page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    ;({ width, height } = page.getSize())
    y = height - margin
  }

  drawText('CONSTATS', { size: 14, bold: true, leading: 18 })
  y -= 6

  // constants for images
  const mmToPt = (mm) => mm * 2.83465
  const maxImgWidthPt = mmToPt(70) // ~70mm
  const imgGap = 8
  const captionSize = 10
  const captionLeading = 12

  let constatIndex = 1

  for (const d of desordres) {
    // prepare embedded images info (do conversion here, do not mutate File objects)
    const photos = d.photos || []
    const embeddedImages = []
    for (const file of photos) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        let embedded
        if (file.type && file.type.includes('png')) {
          embedded = await pdfDoc.embedPng(new Uint8Array(arrayBuffer))
        } else {
          // default to jpg embedding; pdf-lib supports jpeg bytes too
          embedded = await pdfDoc.embedJpg(new Uint8Array(arrayBuffer))
        }
        const imgW = embedded.width
        const imgH = embedded.height
        const scale = Math.min(1, maxImgWidthPt / imgW)
        const displayW = imgW * scale
        const displayH = imgH * scale
        embeddedImages.push({ embedded, displayW, displayH, file })
      } catch (err) {
        // skip invalid images
        // eslint-disable-next-line no-console
        console.warn('Skipping image for PDF embed', err)
      }
    }

    // compute rows for images to estimate required height
    const rows = []
    let currentRow = []
    let currentRowWidth = 0
    for (const img of embeddedImages) {
      const w = img.displayW
      const needed = currentRow.length === 0 ? w : currentRowWidth + imgGap + w
      if (needed <= contentWidth) {
        currentRow.push(img)
        currentRowWidth = needed
      } else {
        if (currentRow.length > 0) rows.push(currentRow)
        currentRow = [img]
        currentRowWidth = img.displayW
      }
    }
    if (currentRow.length > 0) rows.push(currentRow)

    const rowsHeights = rows.map((r) => Math.max(...r.map((i) => i.displayH)))
    const totalImagesHeight = rowsHeights.reduce((a, b) => a + b, 0)
    const captionsHeight = rows.length * (captionSize * 3 + captionLeading) // 3 lines per caption
    const imagesBlockHeight = rows.length > 0 ? totalImagesHeight + captionsHeight + (rows.length - 1) * imgGap : 0

    // estimate text block height for this constat
    const textLines = 1 + 4 * 2 // title + (label+value) pairs approximated
    const textHeight = 24 + 4 * 18
    const requiredHeight = textHeight + imagesBlockHeight + 36

    // start new page if not enough room for the whole constat
    if (y < margin + requiredHeight) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      ;({ width, height } = page.getSize())
      y = height - margin
    }

    // draw constat header and fields
    drawText(`CONSTAT N°${constatIndex}`, { bold: true, size: 14 })
    drawText('Pièce :', { bold: true })
    drawText(d.piece || '—')

    drawText('Catégorie :', { bold: true })
    drawText(d.categorie || '—')

    drawText('Désordre :', { bold: true })
    drawText(d.desordre || '—')

    drawText('Commentaire :', { bold: true })
    drawText(d.commentaire || '—', { leading: 18 })

    // images block
    if (embeddedImages.length > 0) {
      y -= 4
      drawText('PHOTOGRAPHIES', { bold: true })
      y -= 6

      // render rows
      let startX = margin
      for (let ri = 0; ri < rows.length; ri++) {
        const row = rows[ri]
        const rowHeight = Math.max(...row.map((i) => i.displayH))
        let x = startX
        // center the row horizontally
        const rowWidth = row.reduce((acc, it, idx) => acc + it.displayW + (idx > 0 ? imgGap : 0), 0)
        const offsetX = margin + (contentWidth - rowWidth) / 2
        x = offsetX

        // check page break for row
        if (y < margin + rowHeight + captionSize * 3 + captionLeading + 20) {
          page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
          ;({ width, height } = page.getSize())
          y = height - margin
        }

        for (let ci = 0; ci < row.length; ci++) {
          const it = row[ci]
          page.drawImage(it.embedded, { x, y: y - it.displayH, width: it.displayW, height: it.displayH })

          // captions under image
          const captionY = y - it.displayH - captionLeading
          drawText(`Photo ${ci + 1}`, { x, size: captionSize })
          drawText(d.piece || '—', { x, size: captionSize })
          drawText(d.desordre || '—', { x, size: captionSize, leading: captionLeading })

          x += it.displayW + imgGap
        }

        // move y under the row (row height + captions)
        y -= rowHeight + (captionSize * 3 + captionLeading) + imgGap
      }
    } else {
      y -= 6
    }

    // small spacer between constats
    y -= 12
    constatIndex += 1
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
