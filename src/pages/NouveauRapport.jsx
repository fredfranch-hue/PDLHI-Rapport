import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function NouveauRapport() {
  const navigate = useNavigate()
  const [rapport, setRapport] = useState({
    date: getTodayDate(),
    commune: '',
    adresse: '',
    bailleur: '',
    occupant: '',
    refSignalLogement: '',
    refAxel: '',
  })

  const handleChange = (field) => (event) => {
    setRapport((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100%',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          Nouveau rapport
        </Typography>

        <Stack spacing={2.5} component="form" noValidate>
          <TextField
            label="Date"
            type="date"
            value={rapport.date}
            InputLabelProps={{ shrink: true }}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Commune"
            fullWidth
            value={rapport.commune}
            onChange={handleChange('commune')}
          />
          <TextField
            label="Adresse"
            fullWidth
            value={rapport.adresse}
            onChange={handleChange('adresse')}
          />
          <TextField
            label="Bailleur"
            fullWidth
            value={rapport.bailleur}
            onChange={handleChange('bailleur')}
          />
          <TextField
            label="Occupant"
            fullWidth
            value={rapport.occupant}
            onChange={handleChange('occupant')}
          />
          <TextField
            label="Référence Signal Logement"
            fullWidth
            value={rapport.refSignalLogement}
            onChange={handleChange('refSignalLogement')}
          />
          <TextField
            label="Référence AXEL"
            fullWidth
            value={rapport.refAxel}
            onChange={handleChange('refAxel')}
          />
        </Stack>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/rapport-visite', { state: rapport })}
          >
            Commencer le rapport
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={() => navigate('/')}
          >
            Retour
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default NouveauRapport
