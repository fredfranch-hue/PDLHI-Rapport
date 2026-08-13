import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import logoPrefet from '../assets/logos/logo-prefet.png'
import logoSignalLogement from '../assets/logos/logo-signal-logement.png'

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

  // Page de garde : logos empilés à gauche (Préfecture dessus, Signal Logement dessous)
  try {
    const logoUrls = [logoPrefet, logoSignalLogement]
    const embeddedLogos = []
    for (const url of logoUrls) {
      try {
        const res = await fetch(url)
        const ab = await res.arrayBuffer()
        const embedded = await pdfDoc.embedPng(new Uint8Array(ab))
        embeddedLogos.push(embedded)
      } catch (e) {
        // ignore missing logos
      }
    }

    if (embeddedLogos.length > 0) {
      const maxLogoWidth = 120
      const gapBetween = 8
      let lx = margin
      let ly = y
      for (let i = 0; i < embeddedLogos.length; i++) {
        const l = embeddedLogos[i]
        const scale = Math.min(1, maxLogoWidth / l.width)
        const w = l.width * scale
        const h = l.height * scale
        page.drawImage(l, { x: lx, y: ly - h, width: w, height: h })
        ly = ly - h - gapBetween
      }
      y = ly - 30
    }
  } catch (e) {
    // ignore
  }

  // Title
  // Title block (centered). Keep larger spacing from logos.
  drawText('RAPPORT DE VISITE', { size: 20, bold: true, align: 'center', leading: 32 })
  y -= 8
  drawText('Direction départementale des territoires', { size: 11, align: 'center' })
  y -= 12
  drawText('Pôle Départemental de Lutte contre l\'Habitat Indigne (PDLHI)', { size: 13, bold: true, align: 'center' })
  y -= 20

  // format date in French: 'Jeudi 13 août 2026'
  const formatDateFr = (iso) => {
    try {
      const d = iso ? new Date(iso) : new Date()
      const formatted = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
      return formatted.charAt(0).toUpperCase() + formatted.slice(1)
    } catch (e) {
      return iso || '—'
    }
  }

  const infoLines = [
    ['Date', formatDateFr(report.date)],
    ['Commune', report.commune || '—'],
    ['Adresse', report.adresse || '—'],
    ['Bailleur', report.bailleur || '—'],
    ['Occupant', report.occupant || '—'],
    ['Opérateur de visite', report.operator || 'Non renseigné'],
    ['Référence Signal Logement', report.refSignalLogement || '—'],
    ['Référence AXEL', report.refAxel || '—'],
  ]

  // Draw information in a two-column table with light borders
  const rowHeight = 22
  const tableTop = y
  const rowsCount = infoLines.length
  const tableHeight = rowsCount * rowHeight
  // table background white with border
  page.drawRectangle({ x: margin - 4, y: tableTop - tableHeight, width: contentWidth + 8, height: tableHeight + 4, color: rgb(1, 1, 1) })
  page.drawRectangle({ x: margin - 4, y: tableTop - tableHeight, width: contentWidth + 8, height: tableHeight + 4, borderColor: rgb(0.83, 0.83, 0.83), borderWidth: 0.5 })
  // vertical divider
  const dividerX = margin + contentWidth / 2
  page.drawLine({ start: { x: dividerX, y: tableTop }, end: { x: dividerX, y: tableTop - tableHeight }, thickness: 0.5, color: rgb(0.83, 0.83, 0.83) })

  for (let i = 0; i < infoLines.length; i++) {
    const [label, value] = infoLines[i]
    const rowY = tableTop - (i + 0.5) * rowHeight + 6
    if (y < margin + 40) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      ;({ width, height } = page.getSize())
      y = height - margin
    }
    // draw label and value in table row
    const leftX = margin + 6
    const rightX = dividerX + 6
    const labelSize = 11
    const valueSize = 11
    page.drawText(label + ':', { x: leftX, y: rowY, size: labelSize, font: helveticaBold })
    page.drawText(String(value), { x: rightX, y: rowY, size: valueSize, font: helvetica })
  }
  y = tableTop - tableHeight - 12

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

    // Note: EXIF orientation is not handled here. Future improvement: read EXIF orientation
    // and rotate images accordingly before embedding.

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

    // draw a light box for the constat with header band
    const boxPadding = 10
    const boxHeight = requiredHeight
    const boxTop = y
    const boxY = boxTop - boxHeight
    // outer border
    page.drawRectangle({ x: margin - 6, y: boxY, width: contentWidth + 12, height: boxHeight, borderColor: rgb(0.83, 0.83, 0.83), borderWidth: 0.5 })
    // header band
    const bandHeight = 26
    page.drawRectangle({ x: margin - 6, y: boxTop - bandHeight, width: contentWidth + 12, height: bandHeight, color: rgb(0.95, 0.95, 0.95) })

    // draw constat header and fields inside box
    // place content below the header band with padding to avoid overlap
    y = boxTop - bandHeight - boxPadding
    // header text inside band, left aligned with padding
    page.drawText(`CONSTAT N°${constatIndex}`, { x: margin, y: boxTop - bandHeight + 6, size: 14, font: helveticaBold })

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

          // centered captions under image (3 lines)
          const captionTop = y - it.displayH - 6
          const lines = [`Photo ${ci + 1}`, d.piece || '—', d.desordre || '—']
          for (let li = 0; li < lines.length; li++) {
            const line = lines[li]
            const textWidth = helvetica.widthOfTextAtSize(line, captionSize)
            const captionX = x + (it.displayW - textWidth) / 2
            const captionY = captionTop - li * (captionSize + 2)
            page.drawText(line, { x: captionX, y: captionY, size: captionSize, font: helvetica })
          }

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

  // MENTIONS block at the end of the document (in a light gray box, smaller font, justified)
  const mentionsText = `Le présent rapport constitue un document de travail interne du Pôle Départemental de Lutte contre l'Habitat Indigne (PDLHI).\n\nIl a pour objet de faciliter le suivi technique des situations signalées.\n\nIl ne constitue ni un rapport d'expertise, ni un constat contradictoire, ni un document opposable aux parties.\n\nLes éventuelles décisions administratives sont prises dans le cadre des procédures prévues par les textes en vigueur et des constats réalisés par les autorités compétentes.`
  // ensure space
  if (y < margin + 140) {
    page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    ;({ width, height } = page.getSize())
    y = height - margin
  }
  const mentionsBoxHeightEstimate = 120
  page.drawRectangle({ x: margin - 6, y: y - mentionsBoxHeightEstimate, width: contentWidth + 12, height: mentionsBoxHeightEstimate, color: rgb(0.95, 0.95, 0.95) })
  // draw title
  page.drawText('MENTIONS', { x: margin, y: y - 18, size: 11, font: helveticaBold })
  let my = y - 36

  // draw justified wrapped text inside box
  const drawJustified = (text, size = 10) => {
    const font = helvetica
    const maxWidth = contentWidth - 8
    const paragraphs = text.split(/\n\n+/)
    for (const para of paragraphs) {
      const words = para.split(/\s+/)
      let lineWords = []
      let lineWidth = 0
      for (let i = 0; i < words.length; i++) {
        const w = words[i]
        const wWidth = font.widthOfTextAtSize(w, size)
        if (lineWords.length === 0) {
          lineWords.push(w)
          lineWidth = wWidth
        } else if (lineWidth + font.widthOfTextAtSize(' ', size) + wWidth <= maxWidth) {
          lineWords.push(w)
          lineWidth += font.widthOfTextAtSize(' ', size) + wWidth
        } else {
          // draw justified line
          const gaps = lineWords.length - 1
          if (gaps <= 0) {
            page.drawText(lineWords.join(' '), { x: margin + 4, y: my, size, font })
            my -= size + 4
          } else {
            const extra = (maxWidth - font.widthOfTextAtSize(lineWords.join(' '), size)) / gaps
            let lx = margin + 4
            for (let gi = 0; gi < lineWords.length; gi++) {
              const word = lineWords[gi]
              page.drawText(word, { x: lx, y: my, size, font })
              lx += font.widthOfTextAtSize(word, size) + font.widthOfTextAtSize(' ', size) + extra
            }
            my -= size + 4
          }
          lineWords = [w]
          lineWidth = wWidth
        }
      }
      if (lineWords.length > 0) {
        page.drawText(lineWords.join(' '), { x: margin + 4, y: my, size, font })
        my -= size + 4
      }
      my -= 6
    }
  }

  drawJustified(mentionsText, 10)
  y = my - 12

  // Footer: add page numbers centered on each page
  const pages = pdfDoc.getPages()
  const totalPages = pages.length
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i]
    const { width: pw } = p.getSize()
    const footerText = `Page ${i + 1} / ${totalPages}`
    const fSize = 10
    const tw = helvetica.widthOfTextAtSize(footerText, fSize)
    p.drawText(footerText, { x: (pw - tw) / 2, y: 20, size: fSize, font: helvetica })
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
