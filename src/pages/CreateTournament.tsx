import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/MainLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api } from '../lib/api'
import { OrganizerRequestResponse, GAME_CONFIG, formatDate, normalizeGame} from '../types/tournament'
const GAMES = [
  { value: 0 as const, key: 'leagueoflegends' as const },
  { value: 1 as const, key: 'valorant' as const },
  { value: 2 as const, key: 'cs2' as const },
]

const MAX_TEAMS_OPTIONS = [2, 4, 8, 16]

export function CreateTournament() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState<OrganizerRequestResponse | null>(null)

  const [form, setForm] = useState({
    tournamentName: '',
    startDate: '',
    game: 0 as 0 | 1 | 2,
    description: '',
    isInterUniversity: false,
    universityId: null as string | null,
    maxTeams: 8,
  })

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.createOrganizerRequest(form)
      setSubmitted(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return <SuccessScreen request={submitted} onDone={() => navigate('/my-tournaments')} />
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Crear torneo</h1>
          <p className="text-sm text-[oklch(42%_0_0)]">Completá los datos y enviaremos tu solicitud para revisión.</p>
        </div>

        <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden shadow-[0_2px_32px_oklch(0%_0_0/0.4)]">
          <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

            <Input
              label="Nombre del torneo"
              placeholder="Ej: Liga Interfacultades LoL S2"
              value={form.tournamentName}
              onChange={(e) => set('tournamentName', e.target.value)}
              required
            />

            {/* Game selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Juego</label>
              <div className="grid grid-cols-3 gap-2">
                {GAMES.map(({ value, key }) => {
                  const g = GAME_CONFIG[key]
                  const active = form.game === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set('game', value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'border-[oklch(49.1%_0.27_292.581/0.5)] bg-[oklch(49.1%_0.27_292.581/0.1)] text-white'
                          : 'border-[oklch(22%_0_0)] bg-[oklch(20%_0_0)] text-[oklch(45%_0_0)] hover:border-[oklch(30%_0_0)] hover:text-white'
                      }`}
                    >
                      <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${g.gradient}`} />
                      {g.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Input
              label="Fecha de inicio"
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Contá de qué trata el torneo, reglas, premios..."
                rows={3}
                className="rounded-lg bg-[oklch(20%_0_0)] border border-[oklch(26%_0_0)] px-4 py-3 text-sm text-[oklch(96%_0_0)] outline-none resize-none focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] transition-all placeholder:text-[oklch(35%_0_0)]"
              />
            </div>

            {/* Max teams */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Equipos máximos</label>
              <div className="flex gap-2">
                {MAX_TEAMS_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('maxTeams', n)}
                    className={`flex-1 h-10 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      form.maxTeams === n
                        ? 'border-[oklch(49.1%_0.27_292.581/0.5)] bg-[oklch(49.1%_0.27_292.581/0.1)] text-white'
                        : 'border-[oklch(22%_0_0)] bg-[oklch(20%_0_0)] text-[oklch(45%_0_0)] hover:border-[oklch(30%_0_0)] hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Inter-university toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[oklch(22%_0_0)] bg-[oklch(20%_0_0)]">
              <div>
                <p className="text-sm font-medium text-[oklch(75%_0_0)]">Inter-universitario</p>
                <p className="text-xs text-[oklch(38%_0_0)] mt-0.5">Abierto a jugadores de cualquier universidad</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isInterUniversity}
                onClick={() => set('isInterUniversity', !form.isInterUniversity)}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                  form.isInterUniversity ? 'bg-[oklch(49.1%_0.27_292.581)]' : 'bg-[oklch(26%_0_0)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form.isInterUniversity ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {error && (
              <p className="text-sm text-[oklch(62%_0.22_25)] bg-[oklch(22%_0_0)] border border-[oklch(62%_0.22_25)/0.3] rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-1">
              Enviar solicitud
            </Button>

            <p className="text-center text-xs text-[oklch(32%_0_0)]">
              Tu solicitud será revisada en un plazo de 48 hs hábiles.
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

function SuccessScreen({ request, onDone }: { request: OrganizerRequestResponse; onDone: () => void }) {
  const game = GAME_CONFIG[normalizeGame(request.game)]
  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.05] blur-[100px]" />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl bg-[oklch(49.1%_0.27_292.581)] opacity-20 blur-xl scale-110" />
          <div className="relative w-20 h-20 rounded-2xl bg-[oklch(17%_0_0)] border border-[oklch(49.1%_0.27_292.581/0.35)] flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
              <path d="M8 20l8 8 16-16" stroke="oklch(58% 0.27 292.581)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">¡Solicitud enviada!</h1>
        <p className="text-sm text-[oklch(48%_0_0)] mb-8 leading-relaxed">
          Revisaremos tu solicitud y te notificaremos cuando sea aprobada.
        </p>

        <div className="w-full rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden mb-6">
          <div className={`h-[2px] bg-gradient-to-r ${game.gradient} to-transparent`} />
          <div className="p-5 flex flex-col gap-3 text-left">
            {[
              ['Torneo', request.tournamentName],
              ['Juego', game.label],
              ['Fecha', formatDate(request.startDate)],
              ['Equipos', String(request.maxTeams)],
              ['Modalidad', request.isInterUniversity ? 'Inter-universitario' : 'Por universidad'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-[oklch(38%_0_0)]">{label}</span>
                <span className="text-sm font-medium text-[oklch(72%_0_0)]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <Button size="lg" onClick={onDone}>Ver mis torneos</Button>
      </div>
    </MainLayout>
  )
}
