import { ReactNode, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getProfile, getInitials, logout } from '../lib/auth'

const NAV_LINKS = [
  { label: 'Torneos', to: '/tournaments' },
  { label: 'Mis torneos', to: '/my-tournaments' },
  { label: 'Clasificación', to: '/leaderboard' },
]

export function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const profile = getProfile()
  const displayName = profile?.name || profile?.email?.split('@')[0] || 'Jugador'
  const initials = getInitials(displayName)
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots noise">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.04] blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.9] backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Campus Clash" className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden sm:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium rounded-md transition-colors no-underline ${
                    isActive
                      ? 'text-white bg-[oklch(22%_0_0)]'
                      : 'text-[oklch(45%_0_0)] hover:text-white hover:bg-[oklch(20%_0_0)]'
                  }`
                }
              >
                {label}
              </NavLink>
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
              <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-[oklch(24%_0_0)] bg-[oklch(17%_0_0)] shadow-[0_8px_32px_oklch(0%_0_0/0.5)] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[oklch(22%_0_0)]">
                  <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-[oklch(40%_0_0)] truncate mt-0.5">{profile?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-sm text-[oklch(65%_0_0)] hover:text-white hover:bg-[oklch(22%_0_0)] rounded-lg no-underline transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tournaments/create"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-sm text-[oklch(65%_0_0)] hover:text-white hover:bg-[oklch(22%_0_0)] rounded-lg no-underline transition-colors"
                  >
                    Crear torneo
                  </Link>
                  <div className="h-px bg-[oklch(22%_0_0)] my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-[oklch(60%_0.15_25)] hover:bg-[oklch(22%_0_0)] rounded-lg transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10">{children}</main>
    </div>
  )
}
