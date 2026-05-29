import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const STATS = [
  { value: '12', label: 'Universidades' },
  { value: '48', label: 'Torneos' },
  { value: '1.200+', label: 'Jugadores' },
]

export function Welcome() {
  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col noise">
      {/* Radial glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[400px] rounded-full bg-[oklch(47%_0.28_283)] opacity-[0.04] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.8] backdrop-blur-sm sticky top-0">
        <img src="/logo.png" alt="Campus Clash" className="h-10 w-auto object-contain" />
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[oklch(50%_0_0)] hover:text-white transition-colors no-underline"
          >
            Iniciar sesión
          </Link>
          <Link to="/register">
            <Button variant="ghost" size="sm">
              Registrarse
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo with glow */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-72 h-72 rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.12] blur-3xl" />
          <img
            src="/logo.png"
            alt="Campus Clash"
            className="relative h-40 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(30%_0_0)] bg-[oklch(18%_0_0)] px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(64%_0.2_145)] animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-[oklch(60%_0_0)] tracking-wide">
            Temporada 1 · Argentina · Servidor LAS
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-5 max-w-2xl">
          <span className="text-white">Donde las facultades</span>
          <br />
          <span className="text-gradient">compiten.</span>
        </h1>

        <p className="text-[oklch(50%_0_0)] text-lg max-w-sm mb-10 leading-relaxed">
          Torneos universitarios interfacultades de League of Legends, Valorant y CS2.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-px rounded-xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden mb-10">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center px-6 py-3">
              <span className="text-xl font-extrabold text-white tabular-nums">{stat.value}</span>
              <span className="text-[11px] text-[oklch(42%_0_0)] font-medium uppercase tracking-widest">{stat.label}</span>
              {i < STATS.length - 1 && (
                <div className="absolute right-0 top-2 bottom-2 w-px bg-[oklch(22%_0_0)]" />
              )}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link to="/register" className="w-full">
            <Button size="lg">
              Empezar gratis →
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-sm text-[oklch(35%_0_0)]">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="text-[oklch(55%_0.2_292.581)] hover:text-[oklch(65%_0.25_292.581)] no-underline font-semibold transition-colors"
          >
            Iniciá sesión
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[oklch(18%_0_0)] px-6 py-4 flex items-center justify-center gap-8">
        {['League of Legends', 'Valorant', 'CS2'].map((game) => (
          <span key={game} className="text-[11px] text-[oklch(30%_0_0)] font-semibold uppercase tracking-widest">
            {game}
          </span>
        ))}
      </footer>
    </div>
  )
}
