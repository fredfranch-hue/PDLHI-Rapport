import { Routes, Route } from 'react-router-dom'
import Accueil from '../pages/Accueil'
import NouveauRapport from '../pages/NouveauRapport'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/nouveau-rapport" element={<NouveauRapport />} />
    </Routes>
  )
}

export default AppRouter
