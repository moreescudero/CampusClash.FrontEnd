import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const COMPLETED = [
  'Cuenta creada',
  'Email confirmado',
  'Validación académica enviada',
  'Cuenta Riot vinculada',
]

export function Success() {
  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col items-center justify-center px-4 noise">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl bg-[oklch(49.1%_0.27_292.581)] opacity-20 blur-xl scale-110" />
          <div className="relative w-20 h-20 rounded-2xl bg-[oklch(17%_0_0)] border border-[oklch(49.1%_0.27_292.581/0.35)] flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
              <path
                d="M8 20l8 8 16-16"
                stroke="oklch(58% 0.27 292.581)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          ¡Listo para competir!
        </h1>
        <p className="text-[oklch(48%_0_0)] mb-8 leading-relaxed text-sm max-w-xs">
          Tu cuenta está configurada. Explorá los torneos y anotate con tu facultad.
        </p>

        {/* Checklist card */}
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
          La validación académica puede demorar hasta 24 hs en ser aprobada.
        </p>
      </div>
    </div>
  )
}
