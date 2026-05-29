import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { getProfile } from '../lib/auth'

function Header() {
  return (
    <header className="border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.9] backdrop-blur-sm sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center no-underline">
        <img src="/logo.png" alt="Campus Clash" className="h-9 w-auto object-contain" />
      </Link>
      {/* All 4 dots filled = onboarding complete */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(38%_0_0)]">Paso</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-4 rounded-full bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)]" />
          ))}
        </div>
        <span className="text-[10px] font-semibold text-[oklch(38%_0_0)]">4/4</span>
      </div>
    </header>
  )
}

interface PendingItem {
  label: string
  description: string
  path: string
}

export function Success() {
  const profile = getProfile()
  const validationDone = profile?.validationSubmitted || profile?.isValidated || false
  const riotDone = profile?.isRiotLinked || false
  const allDone = validationDone && riotDone

  const pending: PendingItem[] = [
    ...(!validationDone
      ? [{ label: 'Validación académica', description: 'Subí tu constancia de alumno regular para verificar que sos estudiante.', path: '/validation' }]
      : []),
    ...(!riotDone
      ? [{ label: 'Vincular cuenta Riot', description: 'Conectá tu cuenta de League of Legends o Valorant para participar.', path: '/link-riot' }]
      : []),
  ]

  if (allDone) {
    return <ReadyScreen />
  }

  return <PendingScreen pending={pending} />
}

function ReadyScreen() {
  const COMPLETED = [
    'Cuenta creada',
    'Email confirmado',
    'Constancia académica enviada',
    'Cuenta Riot vinculada',
  ]

  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col noise">
      <Header />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl bg-[oklch(49.1%_0.27_292.581)] opacity-20 blur-xl scale-110" />
          <div className="relative w-20 h-20 rounded-2xl bg-[oklch(17%_0_0)] border border-[oklch(49.1%_0.27_292.581/0.35)] flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
              <path d="M8 20l8 8 16-16" stroke="oklch(58% 0.27 292.581)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">¡Listo para competir!</h1>
        <p className="text-[oklch(48%_0_0)] mb-8 leading-relaxed text-sm max-w-xs">
          Tu cuenta está completa. Explorá los torneos y anotate con tu facultad.
        </p>

        <div className="w-full rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden mb-6 shadow-[0_0_40px_oklch(0%_0_0/0.4)]">
          <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
          <div className="p-5 flex flex-col gap-3 text-left">
            {COMPLETED.map((label) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-[oklch(75%_0_0)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/dashboard" className="w-full">
          <Button size="lg">Ir a los torneos →</Button>
        </Link>
        <p className="mt-4 text-xs text-[oklch(32%_0_0)]">
          La validación académica puede demorar hasta 48 hs hábiles en ser aprobada.
        </p>
      </div>
      </div>
    </div>
  )
}

function PendingScreen({ pending }: { pending: PendingItem[] }) {
  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col noise">
      <Header />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(55%_0.15_60)] opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="relative w-20 h-20 rounded-2xl bg-[oklch(17%_0_0)] border border-[oklch(28%_0_0)] flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
              <circle cx="20" cy="20" r="14" stroke="oklch(55% 0.18 60)" strokeWidth="2" />
              <path d="M20 13v9" stroke="oklch(55% 0.18 60)" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="20" cy="27" r="1.2" fill="oklch(55% 0.18 60)" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Todavía no estás listo
        </h1>
        <p className="text-[oklch(48%_0_0)] mb-8 leading-relaxed text-sm max-w-xs">
          Para poder participar en los torneos necesitás completar los siguientes pasos.
        </p>

        {/* Pending items */}
        <div className="w-full rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden mb-6 shadow-[0_0_40px_oklch(0%_0_0/0.4)]">
          <div className="h-[2px] bg-gradient-to-r from-[oklch(50%_0.18_60)] to-transparent" />
          <div className="divide-y divide-[oklch(20%_0_0)]">
            {pending.map((item) => (
              <div key={item.label} className="flex items-start gap-4 px-5 py-4 text-left">
                <div className="w-5 h-5 rounded-full border-2 border-[oklch(35%_0_0)] flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[oklch(35%_0_0)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[oklch(75%_0_0)]">{item.label}</p>
                  <p className="text-xs text-[oklch(42%_0_0)] mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <Link
                  to={item.path}
                  className="text-xs font-semibold text-[oklch(55%_0.2_292.581)] hover:text-[oklch(65%_0.25_292.581)] no-underline transition-colors whitespace-nowrap mt-0.5"
                >
                  Completar →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Link to="/dashboard" className="w-full">
          <Button size="lg" variant="ghost">
            Ir al inicio igual
          </Button>
        </Link>
        <p className="mt-4 text-xs text-[oklch(30%_0_0)]">
          Podés completar estos pasos desde tu perfil en cualquier momento.
        </p>
      </div>
      </div>
    </div>
  )
}
