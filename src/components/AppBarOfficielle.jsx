import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import logoPdlhi from '../assets/logo-pdlhi.svg'
import logoPartenaire from '../assets/logo-partenaire.svg'

function AppBarOfficielle({ title }) {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, sm: 72 } }}>
        <Box
          component="img"
          src={logoPdlhi}
          alt="PDLHI Corrèze"
          sx={{ height: 40, width: 'auto' }}
        />
        <Typography
          variant="h6"
          component="h1"
          sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Box
          component="img"
          src={logoPartenaire}
          alt="Partenaire"
          sx={{ height: 40, width: 'auto' }}
        />
      </Toolbar>
    </AppBar>
  )
}

export default AppBarOfficielle
