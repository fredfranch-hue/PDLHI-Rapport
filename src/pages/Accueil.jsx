import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { Box, Button, Typography, Alert } from '@mui/material'
import { importReport } from '../services/reportArchive'
import { resetSession } from '../services/reportSession'

function Accueil() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)

  // Réinitialiser la session lorsque la page d'accueil est chargée
  useEffect(() => {
    resetSession()
  }, [])

  const handleOpenReport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Réinitialiser le message d'erreur
      setErrorMessage(null)

      // Importer le rapport
      const { report, desordres } = await importReport(file)

      // Rediriger vers RapportVisite avec les données
      navigate('/rapport-visite', { 
        state: { report, desordres },
        replace: true 
      })
    } catch (err) {
      // Afficher le message d'erreur
      const errorMsg = err.message || 'Une erreur inconnue s\'est produite lors de l\'ouverture du rapport.'
      setErrorMessage(errorMsg)
      // eslint-disable-next-line no-console
      console.error('Erreur import :', err)
    }

    // Réinitialiser l'input file
    event.target.value = ''
  }

  const triggerFileDialog = () => {
    const fileInput = document.getElementById('file-input-open-report')
    if (fileInput) fileInput.click()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        gap: 3,
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        PDLHI Rapport
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Rapport de visite de logement
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 320 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 320 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate('/nouveau-rapport')}
        >
          Nouveau rapport
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<FolderOpenIcon />}
          onClick={triggerFileDialog}
        >
          Ouvrir un rapport
        </Button>
        <Button variant="outlined" size="large" fullWidth disabled>
          Paramètres
        </Button>
      </Box>

      {/* Input file caché */}
      <input
        id="file-input-open-report"
        type="file"
        accept=".pdlhi"
        style={{ display: 'none' }}
        onChange={handleOpenReport}
      />
    </Box>
  )
}

export default Accueil
