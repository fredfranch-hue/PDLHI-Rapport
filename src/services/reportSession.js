/**
 * Service de gestion de la session du rapport
 * Gère le rapport actif, la clôture et le nettoyage de la session
 */

const ACTIVE_REPORT_KEY = 'pdlhi_active_report'

/**
 * Sauvegarde le rapport actif en localStorage
 * @param {Object} report - Données du rapport
 * @param {Array} desordres - Liste des désordres
 */
export function saveActiveReport(report, desordres) {
  try {
    const sessionData = {
      report,
      desordres,
      savedAt: new Date().toISOString(),
    }
    sessionStorage.setItem(ACTIVE_REPORT_KEY, JSON.stringify(sessionData))
    // eslint-disable-next-line no-console
    console.log('Rapport actif sauvegardé en sessionStorage')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de la sauvegarde du rapport actif :', err)
  }
}

/**
 * Charge le rapport actif depuis sessionStorage
 * @returns {Object|null} { report, desordres } ou null si aucun rapport actif
 */
export function loadActiveReport() {
  try {
    const data = sessionStorage.getItem(ACTIVE_REPORT_KEY)
    if (!data) return null

    const { report, desordres } = JSON.parse(data)
    // eslint-disable-next-line no-console
    console.log('Rapport actif chargé depuis sessionStorage')
    return { report, desordres }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors du chargement du rapport actif :', err)
    return null
  }
}

/**
 * Clôture le rapport actif
 * - Supprime le rapport de la mémoire de session
 * - Réinitialise l'état de l'application
 * @returns {Object} { success: true, message: 'Rapport clôturé avec succès' }
 */
export function closeActiveReport() {
  try {
    // Supprimer le rapport actif de sessionStorage
    sessionStorage.removeItem(ACTIVE_REPORT_KEY)

    // Supprimer tout autre stockage temporaire lié au rapport
    sessionStorage.removeItem('importedDesordres')

    // eslint-disable-next-line no-console
    console.log('Rapport clôturé et session nettoyée')

    return { success: true, message: 'Rapport clôturé avec succès' }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de la clôture du rapport :', err)
    return { success: false, message: 'Erreur lors de la clôture du rapport' }
  }
}

/**
 * Vérifie s'il y a un rapport actif
 * @returns {boolean} true si un rapport actif existe
 */
export function hasActiveReport() {
  try {
    const data = sessionStorage.getItem(ACTIVE_REPORT_KEY)
    return !!data
  } catch (err) {
    return false
  }
}

/**
 * Réinitialise complètement la session
 * À utiliser lors du retour à l'accueil
 */
export function resetSession() {
  try {
    sessionStorage.removeItem(ACTIVE_REPORT_KEY)
    sessionStorage.removeItem('importedDesordres')
    // eslint-disable-next-line no-console
    console.log('Session réinitialisée')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de la réinitialisation de la session :', err)
  }
}
