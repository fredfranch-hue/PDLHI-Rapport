import { useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

/**
 * Composant À propos
 * Affiche les informations de l'application et du système PWA
 */
function About({ open, onClose }) {
  const swState = useMemo(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return 'Actif ✅'
    }
    return 'Inactif'
  }, [])

  const isPWAInstalled = useMemo(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator.standalone === true)
      ? 'PWA installée'
      : 'Navigateur'
  }, [])

  const buildDate = useMemo(() => {
    // Date de build (à remplacer par une vraie date via le système de build)
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>À propos</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* Titre et version */}
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              PDLHI Rapport
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Application de rapport de visite
            </Typography>
          </Box>

          <Divider />

          {/* Versions */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Versions
            </Typography>
            <List dense>
              <ListItem disableGutters>
                <ListItemText
                  primary="Version Application"
                  secondary="0.0.1"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Format .pdlhi"
                  secondary="1.0"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider />

          {/* Build et système */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Système
            </Typography>
            <List dense>
              <ListItem disableGutters>
                <ListItemText
                  primary="Date du build"
                  secondary={buildDate}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Service Worker"
                  secondary={swState}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Mode"
                  secondary={isPWAInstalled}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default About
