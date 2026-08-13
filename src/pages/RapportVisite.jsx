import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { referentielDesordres } from '../data/referentielDesordres'
import AppBarOfficielle from '../components/AppBarOfficielle'
import logoRepublique from '../assets/logos/logo-republique.png'
import logoPrefet from '../assets/logos/logo-prefet.png'
import logoSignalLogement from '../assets/logos/logo-signal-logement.png'

function RapportVisite() {
  const { state } = useLocation()
  const report = state ?? {}
  const [desordres, setDesordres] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    piece: 'Entrée',
    categorie: 'Humidité',
    desordre: '',
    commentaire: '',
  })

  const informationsGenerales = [
    { label: 'Date', value: report.date || '—' },
    { label: 'Commune', value: report.commune || '—' },
    { label: 'Adresse', value: report.adresse || '—' },
    { label: 'Bailleur', value: report.bailleur || '—' },
    { label: 'Occupant', value: report.occupant || '—' },
    {
      label: 'Référence Signal Logement',
      value: report.refSignalLogement || '—',
    },
    { label: 'Référence AXEL', value: report.refAxel || '—' },
  ]

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setFormData({
      piece: 'Entrée',
      categorie: 'Humidité',
      desordre: '',
      commentaire: '',
    })
  }

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'categorie' ? { desordre: '' } : {}),
    }))
  }

  const handleAddDesordre = () => {
    const nouveauDesordre = {
      id: Date.now(),
      piece: formData.piece,
      categorie: formData.categorie,
      desordre: formData.desordre.trim(),
      commentaire: formData.commentaire.trim(),
    }

    setDesordres((current) => [...current, nouveauDesordre])
    handleCloseDialog()
  }

  const handleDeleteDesordre = (id) => {
    setDesordres((current) => current.filter((desordre) => desordre.id !== id))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <AppBarOfficielle title="Rapport de visite" />

      <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              width: '100%',
            }}
          >
            <Box
              component="img"
              src={logoRepublique}
              alt="République"
              sx={{ height: 56, width: 'auto' }}
            />
            <Box
              component="img"
              src={logoPrefet}
              alt="Préfet"
              sx={{ height: 56, width: 'auto' }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 700 }}
          >
            Rapport de visite
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: '100%',
            }}
          >
            <Box
              component="img"
              src={logoSignalLogement}
              alt="Signal Logement"
              sx={{ height: 56, width: 'auto' }}
            />
          </Box>
        </Box>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Informations générales
            </Typography>
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {informationsGenerales.map((info) => (
                <Box
                  key={info.label}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 2 },
                    py: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 220, fontWeight: 600 }}
                  >
                    {info.label}
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {info.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          fullWidth
          sx={{ mb: 3, py: 1.25 }}
          onClick={handleOpenDialog}
        >
          Ajouter un désordre
        </Button>

        {desordres.length > 0 ? (
          <Stack spacing={2} sx={{ mb: 3 }}>
            {desordres.map((desordre) => (
              <Card key={desordre.id} variant="outlined">
                <CardContent sx={{ p: 2.25 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        {desordre.desordre || 'Désordre'}
                      </Typography>
                      <Stack spacing={0.75}>
                        <Typography variant="body2">
                          <strong>Pièce :</strong> {desordre.piece}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Catégorie :</strong> {desordre.categorie}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Désordre :</strong> {desordre.desordre || '—'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Commentaire :</strong> {desordre.commentaire || '—'}
                        </Typography>
                      </Stack>
                    </Box>
                    <IconButton
                      color="error"
                      aria-label="Supprimer le désordre"
                      onClick={() => handleDeleteDesordre(desordre.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography variant="h4" component="div" sx={{ mb: 1.5 }}>
                📝
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aucun désordre enregistré.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Appuyez sur "Ajouter un désordre" pour commencer la visite.
              </Typography>
            </Box>
          </Card>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un désordre</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="piece-label">Pièce</InputLabel>
              <Select
                labelId="piece-label"
                label="Pièce"
                value={formData.piece}
                onChange={handleFieldChange('piece')}
              >
                <MenuItem value="Entrée">Entrée</MenuItem>
                <MenuItem value="Séjour">Séjour</MenuItem>
                <MenuItem value="Cuisine">Cuisine</MenuItem>
                <MenuItem value="Salle d'eau">Salle d'eau</MenuItem>
                <MenuItem value="WC">WC</MenuItem>
                <MenuItem value="Chambre">Chambre</MenuItem>
                <MenuItem value="Garage">Garage</MenuItem>
                <MenuItem value="Cave">Cave</MenuItem>
                <MenuItem value="Combles">Combles</MenuItem>
                <MenuItem value="Extérieur">Extérieur</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="categorie-label">Catégorie</InputLabel>
              <Select
                labelId="categorie-label"
                label="Catégorie"
                value={formData.categorie}
                onChange={handleFieldChange('categorie')}
              >
                <MenuItem value="Humidité">Humidité</MenuItem>
                <MenuItem value="Ventilation">Ventilation</MenuItem>
                <MenuItem value="Électricité">Électricité</MenuItem>
                <MenuItem value="Chauffage">Chauffage</MenuItem>
                <MenuItem value="Menuiseries">Menuiseries</MenuItem>
                <MenuItem value="Plomberie">Plomberie</MenuItem>
                <MenuItem value="Structure">Structure</MenuItem>
                <MenuItem value="Performance énergétique">
                  Performance énergétique
                </MenuItem>
                <MenuItem value="Divers">Divers</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="desordre-label">Désordre</InputLabel>
              <Select
                labelId="desordre-label"
                label="Désordre"
                value={formData.desordre}
                onChange={handleFieldChange('desordre')}
              >
                {(() => {
                  const key = formData.categorie === 'Divers' ? 'Autre' : formData.categorie
                  const options = referentielDesordres[key] || []
                  return options.length
                    ? options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))
                    : (
                      <MenuItem value="">
                        <em>Aucun</em>
                      </MenuItem>
                    )
                })()}
              </Select>
            </FormControl>

            <TextField
              label="Commentaire"
              fullWidth
              multiline
              minRows={3}
              value={formData.commentaire}
              onChange={handleFieldChange('commentaire')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button variant="contained" onClick={handleAddDesordre}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          fullWidth
          disabled
        >
          Générer le PDF
        </Button>
      </Box>
    </Box>
  )
}

export default RapportVisite
