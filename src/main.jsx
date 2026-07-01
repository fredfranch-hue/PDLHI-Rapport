import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './styles/global.css'

registerSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      console.info('Service Worker enregistré.')
    }
  },
  onRegisterError(error) {
    console.error('Erreur lors de l\'enregistrement du Service Worker :', error)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
