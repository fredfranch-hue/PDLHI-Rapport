import Box from '@mui/material/Box'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

/**
 * Indicateur discret de l'état de la connexion
 * Affiché dans la barre d'application
 */
function ConnectionIndicator() {
  const isOnline = useOnlineStatus()

  const indicator = isOnline ? '🟢' : '⚪'
  const status = isOnline ? 'En ligne' : 'Hors ligne'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        fontSize: '0.875rem',
        color: 'inherit',
        opacity: 0.9,
      }}
      title={status}
    >
      <span>{indicator}</span>
      <span sx={{ display: { xs: 'none', sm: 'inline' } }}>{status}</span>
    </Box>
  )
}

export default ConnectionIndicator
