import { Routes, Route } from 'react-router-dom'
import Accueil from '../pages/Accueil'
import NouveauRapport from '../pages/NouveauRapport'
import RapportVisite from '../pages/RapportVisite'

function AppRouter({ onAboutClick }) {
  return (
    <Routes>
      <Route path="/" element={<Accueil onAboutClick={onAboutClick} />} />
      <Route path="/nouveau-rapport" element={<NouveauRapport onAboutClick={onAboutClick} />} />
      <Route path="/rapport-visite" element={<RapportVisite onAboutClick={onAboutClick} />} />
    </Routes>
  )
}

export default AppRouter
