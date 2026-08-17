import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import logoPdlhi from '../assets/logo-pdlhi.svg'
import logoPartenaire from '../assets/logo-partenaire.svg'
import ConnectionIndicator from './ConnectionIndicator'

function AppBarOfficielle({ title, onAboutClick }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAboutClick = () => {
    handleMenuClose()
    if (onAboutClick) onAboutClick()
  }

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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ConnectionIndicator />
          <Box
            component="img"
            src={logoPartenaire}
            alt="Partenaire"
            sx={{ height: 40, width: 'auto' }}
          />
          <IconButton
            color="inherit"
            size="small"
            onClick={handleMenuOpen}
            aria-label="menu"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAboutClick}>À propos</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AppBarOfficielle
