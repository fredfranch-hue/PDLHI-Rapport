import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './styles/theme'
import AppRouter from './routes/AppRouter'
import About from './components/About'
import UpdateNotification from './components/UpdateNotification'

function App() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Écouter l'événement de mise à jour disponible du service worker
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true)
    }

    window.addEventListener('pwa-update-available', handleUpdateAvailable)

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/PDLHI-Rapport">
        <AppRouter onAboutClick={() => setAboutOpen(true)} />
        <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
        {updateAvailable && (
          <UpdateNotification
            onUpdate={() => {
              setUpdateAvailable(false)
            }}
          />
        )}
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
