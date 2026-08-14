import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SaveIcon from '@mui/icons-material/Save'
import { generatePdf } from '../services/pdfGenerator'
import { exportReport } from '../services/reportArchive'
import { closeActiveReport } from '../services/reportSession'
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
import { referentielPDLHI } from '../data/referentielPDLHI'
import AppBarOfficielle from '../components/AppBarOfficielle'
import logoRepublique from '../assets/logos/logo-republique.png'
import logoPrefet from '../assets/logos/logo-prefet.png'
import logoSignalLogement from '../assets/logos/logo-signal-logement.png'

function RapportVisite() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const report = state?.report ?? state ?? {}
  const importedDesordres = state?.desordres ?? []
  const [desordres, setDesordres] = useState(importedDesordres)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [pdfGeneratedFileName, setPdfGeneratedFileName] = useState(null)
  const categorieOptions = Object.keys(referentielPDLHI)

  const [formData, setFormData] = useState({
    piece: 'Entrée',
    categorie: categorieOptions[0] || '',
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
      photos: [],
    }

    setDesordres((current) => [...current, nouveauDesordre])
    handleCloseDialog()
  }

  const handleDeleteDesordre = (id) => {
    setDesordres((current) => current.filter((desordre) => desordre.id !== id))
  }

  const handleOpenFileDialog = (desordreId) => {
    const input = document.getElementById(`file-input-${desordreId}`)
    if (input) input.click()
  }

  const handleFileChange = (desordreId) => (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setDesordres((current) =>
      current.map((d) => {
        if (d.id !== desordreId) return d
        const remaining = 3 - (d.photos ? d.photos.length : 0)
        const toAdd = files.slice(0, remaining)
        return { ...d, photos: [...(d.photos || []), ...toAdd] }
      })
    )

    // reset input so selecting same file again works
    event.target.value = ''
  }

  const handleDeletePhoto = (desordreId, index) => {
    setDesordres((current) =>
      current.map((d) => {
        if (d.id !== desordreId) return d
        const photos = (d.photos || []).filter((_, i) => i !== index)
        return { ...d, photos }
      })
    )
  }

  const handleSaveReport = async () => {
    try {
      await exportReport(report, desordres)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de l\'enregistrement du rapport :', err)
    }
  }

  const handleGeneratePdf = async () => {
    try {
      const result = await generatePdf(report, desordres)
      if (result?.success) {
        setPdfGeneratedFileName(result.filename)
        setCloseDialogOpen(true)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la génération du PDF :', err)
    }
  }

  const handleCloseDialogContinue = () => {
    setCloseDialogOpen(false)
    setPdfGeneratedFileName(null)
  }

  const handleCloseDialogConfirm = () => {
    setCloseDialogOpen(false)
    closeActiveReport()
    navigate('/', { replace: true })
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

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        📷 {desordre.photos ? desordre.photos.length : 0} {((desordre.photos ? desordre.photos.length : 0) <= 1) ? 'photo' : 'photos'}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                        {(desordre.photos || []).map((file, idx) => (
                          <Box key={idx} sx={{ position: 'relative', width: 96, height: 72, borderRadius: 1, overflow: 'hidden', boxShadow: 1 }}>
                            <Box
                              component="img"
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePhoto(desordre.id, idx)}
                              aria-label="Supprimer la photo"
                              sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}

                        {(desordre.photos || []).length < 3 ? (
                          <>
                            <input
                              id={`file-input-${desordre.id}`}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleFileChange(desordre.id)}
                              multiple
                            />
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenFileDialog(desordre.id)}
                              sx={{ minWidth: 160, height: 40 }}
                            >
                              Ajouter une photo
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outlined"
                            disabled
                            aria-disabled
                            sx={{ minWidth: 200, height: 40, bgcolor: 'grey.100' }}
                          >
                            📷 3 photos — limite atteinte
                          </Button>
                        )}
                      </Stack>
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
                {categorieOptions.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
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
                <MenuItem value="" disabled>
                  <em>Sélectionner un désordre</em>
                </MenuItem>
                {(referentielPDLHI[formData.categorie] || []).map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
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

        <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          fullWidth
          disabled={desordres.length === 0}
          onClick={handleSaveReport}
        >
          Enregistrer le rapport
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          fullWidth
          disabled={desordres.length === 0}
          onClick={handleGeneratePdf}
        >
          Générer le PDF
        </Button>
      </Box>

      {/* Boîte de dialogue de clôture du rapport */}
      <Dialog open={closeDialogOpen} onClose={handleCloseDialogContinue}>
        <DialogTitle sx={{ fontWeight: 700 }}>Rapport terminé</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Le rapport PDF a été généré avec succès.
          </Typography>
          <Typography sx={{ mt: 1.5 }}>
            Le rapport de visite est-il maintenant terminé ?
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.9em' }}>
            Vous pourrez toujours le rouvrir ultérieurement à partir de votre fichier .pdlhi.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogContinue}>
            Continuer les modifications
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseDialogConfirm}
            autoFocus
          >
            ✔ Oui, clôturer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RapportVisite
