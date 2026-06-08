import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MainLayout } from '../components/MainLayout'
import { api } from '../lib/api'
import { Tournament, GAME_CONFIG, STATUS_CONFIG, formatDate } from '../types/tournament'
import { getProfile } from '../lib/auth'

function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-[oklch(18%_0_0)] rounded-2xl mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[oklch(18%_0_0)]" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-[oklch(18%_0_0)]" />
      </div>
    </div>
  )
}

interface TeamCardProps {
  team: Tournament['teams'][number]
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="rounded-xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">{team.name}</p>
          <p className="text-xs text-[oklch(40%_0_0)] mt-0.5">{team.universityName}</p>
        </div>
        {team.isFull && (
          <span className="text-[10px] font-semibold text-[oklch(60%_0.2_145)] bg-[oklch(55%_0.2_145/0.12)] border border-[oklch(55%_0.2_145/0.25)] px-2 py-0.5 rounded-full">
            Completo
          </span>
        )}
      </div>
      {team.players.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {team.players.map((p) => (
            <div key={p.userId} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                {p.username[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-[oklch(58%_0_0)]">{p.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function TournamentDetail() {
  const { id } = useParams<{ id: string }>()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState('')
  const [enrollSuccess, setEnrollSuccess] = useState('')
  const [leaving, setLeaving] = useState(false)

  const profile = getProfile()

  useEffect(() => {
    if (!id) return
    api.getTournament(id)
      .then(setTournament)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el torneo'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleEnroll() {
    if (!id) return
    setEnrollError('')
    setEnrolling(true)
    try {
      const res = await api.enrollTournament(id)
      setEnrollSuccess(`Te inscribiste en el equipo "${res.teamName}" (${res.universityName})`)
      const updated = await api.getTournament(id)
      setTournament(updated)
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'No se pudo inscribir')
    } finally {
      setEnrolling(false)
    }
  }

  async function handleLeave() {
    if (!id) return

    setEnrollError('')
    setEnrollSuccess('')
    setLeaving(true)

    try {
      const res = await api.leaveTournament(id)

      setEnrollSuccess(res.message)

      const updated = await api.getTournament(id)
      setTournament(updated)
    } catch (err) {
      setEnrollError(
        err instanceof Error
          ? err.message
          : 'No se pudo dar de baja'
      )
    } finally {
      setLeaving(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <SkeletonDetail />
        </div>
      </MainLayout>
    )
  }

  if (error || !tournament) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center justify-center py-32 text-center">
          <p className="text-sm text-[oklch(62%_0.22_25)] mb-4">{error || 'Torneo no encontrado'}</p>
          <Link to="/tournaments" className="text-sm text-[oklch(55%_0.2_292.581)] hover:text-[oklch(65%_0.25_292.581)]">
            ← Volver a torneos
          </Link>
        </div>
      </MainLayout>
    )
  }

  const game = GAME_CONFIG[tournament.game]
  const status = STATUS_CONFIG[tournament.status]
  const canEnroll = tournament.status === 'open' && profile?.isValidated

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <Link
          to="/tournaments"
          className="inline-flex items-center gap-1.5 text-xs text-[oklch(40%_0_0)] hover:text-white transition-colors no-underline mb-6"
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Todos los torneos
        </Link>

        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden border border-[oklch(22%_0_0)] mb-8">
          <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-10`} />
          <div className={`h-1 bg-gradient-to-r ${game.gradient}`} />
          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${game.gradient}`}>
                    {game.label}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{tournament.name}</h1>
                {tournament.description && (
                  <p className="text-sm text-[oklch(50%_0_0)] max-w-lg leading-relaxed">{tournament.description}</p>
                )}
              </div>

              {canEnroll && (
                <div className="shrink-0 flex gap-2">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white
                      bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)]
                      hover:opacity-90 active:scale-95 transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-lg shadow-[oklch(47%_0.28_283)]/30"
                  >
                    {enrolling ? 'Inscribiendo...' : 'Inscribirme'}
                  </button>

                  <button
                    onClick={handleLeave}
                    disabled={leaving}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white
                      bg-gradient-to-r from-[oklch(45%_0.22_25)] to-[oklch(52%_0.25_15)]
                      hover:opacity-90 active:scale-95 transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-lg shadow-[oklch(45%_0.22_25)]/30"
                  >
                    {leaving ? 'Procesando...' : 'Darse de baja'}
                  </button>
                </div>
              )}
            </div>

            {enrollSuccess && (
              <div className="mt-4 rounded-lg border border-[oklch(55%_0.2_145/0.3)] bg-[oklch(55%_0.2_145/0.08)] px-4 py-3 text-sm text-[oklch(60%_0.2_145)]">
                {enrollSuccess}
              </div>
            )}
            {enrollError && (
              <div className="mt-4 rounded-lg border border-[oklch(62%_0.22_25)/0.3] bg-[oklch(22%_0_0)] px-4 py-3 text-sm text-[oklch(62%_0.22_25)]">
                {enrollError}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-white mb-4">
              Equipos inscritos
              <span className="ml-2 text-xs font-medium text-[oklch(40%_0_0)]">
                {tournament.teams.length}/{tournament.maxTeams}
              </span>
            </h2>
            {tournament.teams.length === 0 ? (
              <div className="rounded-xl border border-[oklch(20%_0_0)] bg-[oklch(16%_0_0)] p-8 text-center">
                <p className="text-sm text-[oklch(38%_0_0)]">Todavía no hay equipos inscritos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tournament.teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[oklch(38%_0_0)] mb-4">Detalles</h3>
              <div className="flex flex-col gap-3.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[oklch(35%_0_0)] mb-0.5">Organizador</p>
                  <p className="text-sm text-[oklch(75%_0_0)] font-medium">{tournament.organizerUsername}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[oklch(35%_0_0)] mb-0.5">Fecha de inicio</p>
                  <p className="text-sm text-[oklch(75%_0_0)] font-medium">{formatDate(tournament.startDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[oklch(35%_0_0)] mb-0.5">Modalidad</p>
                  <p className="text-sm text-[oklch(75%_0_0)] font-medium">
                    {tournament.isInterUniversity ? 'Inter-universitario' : tournament.universityName ?? 'Por universidad'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[oklch(35%_0_0)] mb-0.5">Capacidad</p>
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between text-xs text-[oklch(45%_0_0)] mb-1">
                      <span>{tournament.teams.length} equipos</span>
                      <span>{tournament.maxTeams} máx.</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[oklch(22%_0_0)] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${game.gradient} transition-all`}
                        style={{ width: `${Math.min(100, (tournament.teams.length / tournament.maxTeams) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!canEnroll && tournament.status === 'open' && !profile?.isValidated && (
              <div className="rounded-xl border border-[oklch(55%_0.18_60/0.3)] bg-[oklch(55%_0.18_60/0.06)] p-4">
                <p className="text-xs text-[oklch(60%_0.18_60)] leading-relaxed">
                  Necesitás tener tu cuenta validada para inscribirte en torneos.
                </p>
                <Link to="/validation" className="inline-block mt-2 text-xs font-semibold text-[oklch(55%_0.2_292.581)] hover:text-[oklch(65%_0.25_292.581)] no-underline">
                  Validar mi cuenta →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
