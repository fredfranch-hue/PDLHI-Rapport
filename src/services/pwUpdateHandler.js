/**
 * Service de gestion des mises à jour de la PWA
 * Utilise le système de notification fourni par vite-plugin-pwa
 */

export class PWAUpdateHandler {
  constructor() {
    this.registration = null
    this.updateCallback = null
  }

  /**
   * Initialise le gestionnaire de mise à jour
   * @param {Function} onUpdateAvailable - Callback appelé quand une mise à jour est disponible
   */
  setup(onUpdateAvailable) {
    this.updateCallback = onUpdateAvailable

    // Écouter les changements du service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.updateCallback) {
          this.updateCallback()
        }
      })
    }
  }

  /**
   * Enregistre le Service Worker avec gestion des mises à jour
   * @param {Object} options - Options de registration
   */
  async registerServiceWorker(options = {}) {
    try {
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register(
          options.scriptURL || '/sw.js',
          options
        )
        // eslint-disable-next-line no-console
        console.info('✅ Service Worker enregistré avec succès')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Erreur lors de l\'enregistrement du Service Worker :', error)
    }
  }

  /**
   * Vérifie manuellement si une mise à jour est disponible
   */
  async checkForUpdates() {
    try {
      if (this.registration) {
        await this.registration.update()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la vérification des mises à jour :', error)
    }
  }

  /**
   * Obtient l'état du Service Worker
   * @returns {string} 'active', 'waiting', 'installing' ou 'inactive'
   */
  getServiceWorkerState() {
    if (!this.registration) return 'inactive'

    if (this.registration.active) return 'active'
    if (this.registration.waiting) return 'waiting'
    if (this.registration.installing) return 'installing'

    return 'inactive'
  }

  /**
   * Force la mise à jour du Service Worker
   */
  skipWaiting() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }
}

export const pwaUpdateHandler = new PWAUpdateHandler()
