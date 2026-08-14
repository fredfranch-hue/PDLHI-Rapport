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
 * Valide la structure et le contenu d'un rapport JSON
 * @param {Object} data - Données du rapport à valider
 * @throws {Error} Si la validation échoue
 */
function validateReportData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Le fichier ne contient pas de données valides.')
  }

  if (!data.formatVersion) {
    throw new Error('Le fichier ne contient pas de champ formatVersion.')
  }

  if (!data.report || typeof data.report !== 'object') {
    throw new Error('Le fichier ne contient pas de section report valide.')
  }

  // Vérifier la compatibilité des versions
  const version = data.formatVersion
  if (!version.match(/^\d+\.\d+$/)) {
    throw new Error(`Version de format invalide : ${version}`)
  }

  const [major] = version.split('.').map(Number)
  if (major > 1) {
    throw new Error(`Version de format non supportée : ${version}. Merci de mettre à jour l'application.`)
  }
}

/**
 * Reconvertit les données du rapport JSON en objets manipulables
 * Convertit les noms de photos en objets File
 * @param {Object} reportData - Données du rapport depuis report.json
 * @param {Map} photoFiles - Map des noms de fichiers photos vers les Blob
 * @returns {Object} Objet { report, desordres }
 */
async function reconstructReportData(reportData, photoFiles) {
  const { report, desordres } = reportData

  // Reconstruire les infos générales
  const reconstructedReport = {
    date: report.date || '',
    commune: report.commune || '',
    adresse: report.adresse || '',
    bailleur: report.bailleur || '',
    occupant: report.occupant || '',
    operateur: report.operateur || '',
    refSignalLogement: report.referenceSignalLogement || '',
    refAxel: report.referenceAXEL || '',
  }

  // Reconstruire les désordres avec les photos
  const reconstructedDesordres = (desordres || []).map((d) => {
    // Charger les photos associées au désordre
    const photos = (d.photos || []).map((photoName) => {
      const blob = photoFiles.get(photoName)
      if (!blob) {
        // eslint-disable-next-line no-console
        console.warn(`Photo manquante : ${photoName}`)
        return null
      }
      // Convertir Blob en File
      return new File([blob], photoName, { type: blob.type })
    }).filter(Boolean)

    return {
      id: d.id || Date.now(),
      piece: d.piece || '',
      categorie: d.categorie || '',
      desordre: d.desordre || '',
      commentaire: d.commentaire || '',
      photos,
    }
  })

  return { report: reconstructedReport, desordres: reconstructedDesordres }
}

/**
 * Importe un rapport depuis un fichier .pdlhi (archive ZIP)
 * @param {File} file - Fichier .pdlhi à importer
 * @returns {Promise<Object>} Objet { report, desordres }
 * @throws {Error} Si le fichier est invalide ou corrompu
 */
export async function importReport(file) {
  try {
    // 1. Vérifier l'extension du fichier
    if (!file.name.toLowerCase().endsWith('.pdlhi')) {
      throw new Error('Le fichier sélectionné n\'est pas un rapport PDLHI valide.')
    }

    // 2. Ouvrir l'archive ZIP
    let zip
    try {
      zip = await JSZip.loadAsync(file)
    } catch (err) {
      throw new Error('Le fichier est corrompu ou n\'est pas un archive ZIP valide.')
    }

    // 3. Vérifier la présence de report.json
    const reportJsonFile = zip.file('report.json')
    if (!reportJsonFile) {
      throw new Error('Le fichier PDLHI ne contient pas de report.json.')
    }

    // 4. Lire et parser report.json
    let reportData
    try {
      const jsonText = await reportJsonFile.async('text')
      reportData = JSON.parse(jsonText)
    } catch (err) {
      throw new Error('Le fichier report.json est corrompu ou invalide.')
    }

    // 5. Valider la structure du rapport
    validateReportData(reportData)

    // 6. Charger les photos
    const photosFolder = zip.folder('photos')
    const photoFiles = new Map()

    if (photosFolder) {
      const fileList = photosFolder.file(/.*/)
      for (const file of fileList) {
        try {
          const blob = await file.async('blob')
          photoFiles.set(file.name, blob)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`Erreur lors du chargement de la photo ${file.name}:`, err)
        }
      }
    }

    // 7. Reconstruire les données
    const reconstructed = await reconstructReportData(reportData.report, photoFiles)

    // eslint-disable-next-line no-console
    console.log('Rapport importé avec succès :', reconstructed)

    return reconstructed
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de l\'import du rapport :', err)
    throw err
  }
}
