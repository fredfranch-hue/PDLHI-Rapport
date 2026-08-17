import { useState, useEffect } from 'react'
import { Snackbar, Alert, Box, Button } from '@mui/material'

/**
 * Composant de notification de mise à jour
 * Affiche une notification discrète quand une nouvelle version est disponible
 */
function UpdateNotification({ onUpdate }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // S'ouvrir quand le composant est monté
    setOpen(true)
  }, [])

  const handleUpdate = () => {
    setOpen(false)
    if (onUpdate) {
      onUpdate()
    }
    // Recharger la page pour appliquer la mise à jour
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleDismiss = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={handleDismiss}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{ mb: 2 }}
    >
      <Alert
        onClose={handleDismiss}
        severity="info"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          bgcolor: 'info.main',
          color: 'white',
        }}
      >
        <Box sx={{ flex: 1 }}>
          Une nouvelle version de l'application est disponible.
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            size="small"
            onClick={handleUpdate}
            sx={{ fontWeight: 600 }}
          >
            Mettre à jour
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={handleDismiss}
            variant="outlined"
            sx={{ borderColor: 'white' }}
          >
            Plus tard
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  )
}

export default UpdateNotification
