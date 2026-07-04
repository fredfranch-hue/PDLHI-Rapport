import { useLocation } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AppBarOfficielle from '../components/AppBarOfficielle'
import logoRepublique from '../assets/logos/logo-republique.png'
import logoPrefet from '../assets/logos/logo-prefet.png'
import logoSignalLogement from '../assets/logos/logo-signal-logement.png'

function RapportVisite() {
  const { state } = useLocation()
  const report = state ?? {}
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
        >
          Ajouter un désordre
        </Button>

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
      </Box>

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
