import { Routes, Route } from 'react-router-dom'
import Accueil from '../pages/Accueil'
import NouveauRapport from '../pages/NouveauRapport'
import RapportVisite from '../pages/RapportVisite'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/nouveau-rapport" element={<NouveauRapport />} />
      <Route path="/rapport-visite" element={<RapportVisite />} />
    </Routes>
  )
}

export default AppRouter
