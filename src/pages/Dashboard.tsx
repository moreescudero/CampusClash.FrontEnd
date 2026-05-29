import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProfile, getInitials, logout } from '../lib/auth'
import { Button } from '../components/ui/Button'

const GAMES = ['League of Legends', 'Valorant', 'CS2'] as const

const TOURNAMENTS = [
  {
    game: 'League of Legends',
    name: 'Copa Interfacultades S1',
    date: 'Junio 2026',
    spots: '8 equipos · 5v5',
    status: 'open',
    color: 'from-[oklch(55%_0.2_230)] to-[oklch(48%_0.22_260)]',
  },
  {
    game: 'Valorant',
    name: 'Torneo Relámpago #1',
    date: 'Julio 2026',
    spots: '16 equipos · 5v5',
    status: 'soon',
    color: 'from-[oklch(55%_0.22_25)] to-[oklch(48%_0.2_350)]',
  },
  {
    game: 'CS2',
    name: 'Clutch University Cup',
    date: 'Agosto 2026',
    spots: '8 equipos · 5v5',
    status: 'soon',
    color: 'from-[oklch(58%_0.18_145)] to-[oklch(48%_0.16_170)]',
  },
]

const STATUS_ITEMS = [
  {
    key: 'isEmailConfirmed' as const,
    label: 'Email confirmado',
    pending: 'Confirmá tu email',
    path: '/confirm-email',
  },
  {
    key: 'isValidated' as const,
    label: 'Validación académica',
    pending: 'Pendiente de aprobación',
    path: '/validation',
  },
  {
    key: 'isRiotLinked' as const,
    label: 'Cuenta Riot vinculada',
    pending: 'Vincular cuenta',
    path: '/link-riot',
  },
]

export function Dashboard() {
  const navigate = useNavigate()
  const profile = getProfile()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = profile?.name || profile?.email?.split('@')[0] || 'Jugador'
  const initials = getInitials(displayName)

  const completedSteps = profile
    ? STATUS_ITEMS.filter((s) => profile[s.key]).length
    : 0

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots noise">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.9] backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Campus Clash" className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {['Torneos', 'Clasificación', 'Equipos'].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-sm text-[oklch(45%_0_0)] hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[oklch(20%_0_0)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[oklch(20%_0_0)] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials || '?'}
            </div>
            <span className="text-sm font-medium text-[oklch(80%_0_0)] hidden sm:block max-w-[120px] truncate">
              {displayName}
            </span>
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-[oklch(40%_0_0)]">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-[oklch(24%_0_0)] bg-[oklch(17%_0_0)] shadow-[0_8px_32px_oklch(0%_0_0/0.5)] overflow-hidden">
                <div className="px-3 py-2 border-b border-[oklch(22%_0_0)]">
                  <p className="text-xs text-[oklch(40%_0_0)] truncate">{profile?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/validation"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-sm text-[oklch(65%_0_0)] hover:text-white hover:bg-[oklch(22%_0_0)] rounded-lg no-underline transition-colors"
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-[oklch(62%_0.22_25)] hover:bg-[oklch(22%_0_0)] rounded-lg transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.05] blur-[80px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(40%_0_0)] mb-1">
              Temporada 1 · Argentina
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hola, <span className="text-gradient">{displayName.split(' ')[0]}</span>
            </h1>
          </div>

          {/* Onboarding progress */}
          {completedSteps < 3 && (
            <div className="flex items-center gap-3 bg-[oklch(17%_0_0)] border border-[oklch(22%_0_0)] rounded-xl px-4 py-2.5">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${i < completedSteps ? 'bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)]' : 'bg-[oklch(24%_0_0)]'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-[oklch(48%_0_0)]">
                {completedSteps}/3 pasos completados
              </span>
            </div>
          )}
        </div>

        {/* Account status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STATUS_ITEMS.map((item) => {
            const done = profile?.[item.key] ?? false
            return (
              <div
                key={item.key}
                className="rounded-xl border bg-[oklch(17%_0_0)] overflow-hidden"
                style={{ borderColor: done ? 'oklch(35% 0.1 145)' : 'oklch(22% 0 0)' }}
              >
                <div className={`h-[2px] ${done ? 'bg-gradient-to-r from-[oklch(55%_0.2_145)] to-transparent' : 'bg-[oklch(22%_0_0)]'}`} />
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-[oklch(55%_0.2_145/0.15)]' : 'bg-[oklch(20%_0_0)]'}`}>
                    {done ? (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <path d="M2 6l3 3 5-5" stroke="oklch(64% 0.2 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <circle cx="6" cy="6" r="4" stroke="oklch(38% 0 0)" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${done ? 'text-[oklch(75%_0_0)]' : 'text-[oklch(45%_0_0)]'}`}>
                      {done ? item.label : item.pending}
                    </p>
                    {!done && (
                      <Link
                        to={item.path}
                        className="text-[10px] text-[oklch(49.1%_0.27_292.581)] hover:text-[oklch(60%_0.25_292.581)] no-underline font-semibold transition-colors"
                      >
                        Completar →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
          <div className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] flex items-center justify-center text-lg font-extrabold text-white shrink-0 shadow-[0_4px_16px_oklch(49.1%_0.27_292.581/0.3)]">
              {initials || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{displayName}</p>
              <p className="text-sm text-[oklch(42%_0_0)] truncate">{profile?.email}</p>
              {(profile?.university || profile?.faculty) && (
                <p className="text-xs text-[oklch(38%_0_0)] truncate mt-0.5">
                  {[profile.faculty, profile.university].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {GAMES.map((g) => (
                <span key={g} className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(30%_0_0)] border border-[oklch(22%_0_0)] rounded px-2 py-0.5">
                  {g === 'League of Legends' ? 'LoL' : g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tournaments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[oklch(40%_0_0)]">
              Torneos activos
            </h2>
            <span className="text-xs text-[oklch(30%_0_0)]">Temporada 1</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOURNAMENTS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden group hover:border-[oklch(30%_0_0)] transition-colors"
              >
                <div className={`h-[2px] bg-gradient-to-r ${t.color} to-transparent`} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>
                      {t.game}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                      t.status === 'open'
                        ? 'bg-[oklch(55%_0.2_145/0.12)] text-[oklch(60%_0.2_145)] border border-[oklch(55%_0.2_145/0.2)]'
                        : 'bg-[oklch(20%_0_0)] text-[oklch(35%_0_0)] border border-[oklch(24%_0_0)]'
                    }`}>
                      {t.status === 'open' ? 'Inscripción abierta' : 'Próximamente'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight">{t.name}</p>
                    <p className="text-xs text-[oklch(40%_0_0)] mt-1">{t.spots}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[oklch(20%_0_0)]">
                    <span className="text-xs text-[oklch(35%_0_0)]">{t.date}</span>
                    <Button
                      variant={t.status === 'open' ? 'primary' : 'ghost'}
                      size="sm"
                      disabled={t.status !== 'open'}
                      className={t.status !== 'open' ? 'opacity-30' : ''}
                    >
                      {t.status === 'open' ? 'Inscribirse' : 'Ver más'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
