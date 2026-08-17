import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './styles/global.css'

// Enregistrer le Service Worker avec détection de mises à jour
registerSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      // eslint-disable-next-line no-console
      console.info('✅ Service Worker enregistré avec succès')

      // Vérifier les mises à jour toutes les heures
      setInterval(async () => {
        try {
          await registration.update()
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Erreur lors de la vérification des mises à jour:', err)
        }
      }, 60 * 60 * 1000) // 1 heure
    }
  },
  onRegisterError(error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erreur lors de l\'enregistrement du Service Worker :', error)
  },
  onNeedRefresh() {
    // eslint-disable-next-line no-console
    console.info('🔄 Une nouvelle version de l\'application est disponible')
    // Dispatcher un événement personnalisé
    window.dispatchEvent(new Event('pwa-update-available'))
  },
  onOfflineReady() {
    // eslint-disable-next-line no-console
    console.info('📱 Application prête pour le mode hors ligne')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
