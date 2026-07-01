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
            defaultValue={getTodayDate()}
            InputLabelProps={{ shrink: true }}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField label="Commune" fullWidth />
          <TextField label="Adresse" fullWidth />
          <TextField label="Bailleur" fullWidth />
          <TextField label="Occupant" fullWidth />
          <TextField label="Référence Signal Logement" fullWidth />
          <TextField label="Référence AXEL" fullWidth />
        </Stack>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" size="large" fullWidth>
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
