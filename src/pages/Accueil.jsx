import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

function Accueil() {
  const navigate = useNavigate()
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 320 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate('/nouveau-rapport')}
        >
          Nouveau rapport
        </Button>
        <Button variant="outlined" size="large" fullWidth>
          Reprendre un rapport
        </Button>
        <Button variant="outlined" size="large" fullWidth>
          Paramètres
        </Button>
      </Box>
    </Box>
  )
}

export default Accueil
