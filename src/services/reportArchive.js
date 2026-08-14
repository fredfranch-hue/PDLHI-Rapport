import JSZip from 'jszip'

/**
 * Génère un nom de fichier proposé pour l'archive
 * Format : Rapport_YYYY-MM-DD_Commune.pdlhi ou Rapport_YYYY-MM-DD.pdlhi
 * @param {Object} report - Données du rapport contenant date et commune
 * @returns {string} Nom de fichier proposé
 */
export function generateFileName(report = {}) {
  const date = report.date ? new Date(report.date) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  const commune = report.commune ? report.commune.trim() : ''
  const filename = commune ? `Rapport_${dateStr}_${commune}` : `Rapport_${dateStr}`

  // Nettoyer le nom de fichier en supprimant les caractères invalides
  return filename.replace(/[<>:"/\\|?*]/g, '_').concat('.pdlhi')
}

/**
 * Crée une archive ZIP contenant le rapport
 * Utilisé en interne par exportReport
 * @param {Object} report - Données du rapport
 * @param {Array} desordres - Liste des désordres
 * @returns {Promise<JSZip>} Archive ZIP prête à être sérialisée
 */
export async function createArchive(report = {}, desordres = []) {
  const zip = new JSZip()

  // 1. Créer le rapport JSON
  const reportData = {
    formatVersion: '1.0',
    application: 'PDLHI Rapport',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    report: {
      date: report.date || null,
      commune: report.commune || '',
      adresse: report.adresse || '',
      bailleur: report.bailleur || '',
      occupant: report.occupant || '',
      operateur: report.operateur || '',
      referenceSignalLogement: report.refSignalLogement || '',
      referenceAXEL: report.refAxel || '',
      desordres: desordres.map((d) => ({
        id: d.id,
        piece: d.piece || '',
        categorie: d.categorie || '',
        desordre: d.desordre || '',
        commentaire: d.commentaire || '',
        photos: (d.photos || []).map((_, idx) => `photo_${String(idx + 1).padStart(3, '0')}.jpg`),
      })),
    },
  }

  // 2. Ajouter report.json à la racine
  zip.file('report.json', JSON.stringify(reportData, null, 2))

  // 3. Créer le dossier photos et ajouter les photos
  const photosFolder = zip.folder('photos')

  let photoIndex = 1
  for (const desordre of desordres) {
    const photos = desordre.photos || []
    for (const photoFile of photos) {
      const photoName = `photo_${String(photoIndex).padStart(3, '0')}.jpg`
      try {
        const arrayBuffer = await photoFile.arrayBuffer()
        photosFolder.file(photoName, arrayBuffer, { binary: true })
        photoIndex += 1
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Erreur lors de l'ajout de la photo ${photoName}:`, err)
      }
    }
  }

  return zip
}

/**
 * Exporte le rapport complet en tant que fichier .pdlhi (archive ZIP)
 * @param {Object} report - Données du rapport
 * @param {Array} desordres - Liste des désordres avec photos
 */
export async function exportReport(report = {}, desordres = []) {
  try {
    // Créer l'archive
    const zip = await createArchive(report, desordres)

    // Générer le nom de fichier
    const filename = generateFileName(report)

    // Générer le fichier et déclencher le téléchargement
    const blob = await zip.generateAsync({ type: 'blob' })

    // Créer un lien de téléchargement et simuler un clic
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Notification utilisateur
    // eslint-disable-next-line no-console
    console.log(`Rapport exporté avec succès : ${filename}`)

    return { success: true, filename }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de l\'export du rapport :', err)
    throw err
  }
}

/**
 * Fonction stub pour l'import de rapport (US-014)
 * À implémenter ultérieurement
 * @param {File} file - Fichier .pdlhi à importer
 * @returns {Promise<Object>} Données du rapport importées
 */
export async function importReport(file) {
  // À implémenter
  throw new Error('importReport() n\'est pas encore implémenté')
}
