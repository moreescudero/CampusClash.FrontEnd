import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'
import { Welcome } from './pages/Welcome'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ConfirmEmail } from './pages/ConfirmEmail'
import { AcademicValidation } from './pages/AcademicValidation'
import { LinkRiot } from './pages/LinkRiot'
import { Success } from './pages/Success'
import { Dashboard } from './pages/Dashboard'
import { Tournaments } from './pages/Tournaments'
import { TournamentDetail } from './pages/TournamentDetail'
import { CreateTournament } from './pages/CreateTournament'
import { MyTournaments } from './pages/MyTournaments'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public: redirect to dashboard if already logged in */}
        <Route path="/" element={<GuestRoute><Welcome /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Onboarding: only accessible while logged in */}
        <Route path="/confirm-email" element={<ProtectedRoute><ConfirmEmail /></ProtectedRoute>} />
        <Route path="/validation" element={<ProtectedRoute><AcademicValidation /></ProtectedRoute>} />
        <Route path="/link-riot" element={<ProtectedRoute><LinkRiot /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

        {/* App */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
        <Route path="/tournaments/create" element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
        <Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
        <Route path="/my-tournaments" element={<ProtectedRoute><MyTournaments /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
