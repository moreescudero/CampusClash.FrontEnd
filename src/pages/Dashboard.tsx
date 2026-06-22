import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, setProfile, getInitials, UserProfile } from '../lib/auth'
import { MainLayout } from '../components/MainLayout'
import { TournamentCard } from '../components/TournamentCard'
import { api } from '../lib/api'
import { Tournament, GameString, GAME_CONFIG, BracketMatchEntry } from '../types/tournament'

interface UpcomingMatch {
  match: BracketMatchEntry
  roundName: string
  tournamentName: string
  tournamentId: string
  myTeamName: string
}

function formatMatchDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const FEATURED_TOURNAMENTS = [
  {
    game: 'leagueoflegends' as GameString,
    name: 'Copa Interfacultades Season 2',
    description: 'El torneo más grande de LoL universitario vuelve con 16 equipos de las principales facultades del país.',
    date: '15 de agosto, 2026',
    spots: '16 equipos · 5v5',
    tag: 'Inscripción abierta',
    tagColor: 'text-[oklch(60%_0.2_145)] bg-[oklch(55%_0.2_145/0.15)] border-[oklch(55%_0.2_145/0.3)]',
  },
  {
    game: 'valorant' as GameString,
    name: 'Valorant University Series',
    description: 'Clasificatorio inter-universitario. Equipos de todo el país compiten por el título de mejor facultad.',
    date: '5 de septiembre, 2026',
    spots: '8 equipos · 5v5',
    tag: 'Próximamente',
    tagColor: 'text-[oklch(65%_0.2_60)] bg-[oklch(60%_0.2_60/0.12)] border-[oklch(60%_0.2_60/0.25)]',
  },
  {
    game: 'cs2' as GameString,
    name: 'CS2 Faculty Cup',
    description: 'El torneo de Counter-Strike más competitivo de la temporada. Solo los mejores equipos por facultad.',
    date: '20 de septiembre, 2026',
    spots: '8 equipos · 5v5',
    tag: 'Próximamente',
    tagColor: 'text-[oklch(65%_0.2_60)] bg-[oklch(60%_0.2_60/0.12)] border-[oklch(60%_0.2_60/0.25)]',
  },
]

function FeaturedCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % FEATURED_TOURNAMENTS.length)
    }, 4500)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current])

  function go(index: number) {
    setCurrent(index)
  }

  function prev() {
    setCurrent((c) => (c - 1 + FEATURED_TOURNAMENTS.length) % FEATURED_TOURNAMENTS.length)
  }

  function next() {
    setCurrent((c) => (c + 1) % FEATURED_TOURNAMENTS.length)
  }

  const item = FEATURED_TOURNAMENTS[current]
  const game = GAME_CONFIG[item.game]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] select-none">
      {/* Background gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-[0.08] transition-all duration-700`} />

      {/* Top accent line */}
      <div className={`h-[2px] bg-gradient-to-r ${game.gradient} transition-all duration-700`} />

      <div className="relative px-6 py-7 flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${game.gradient}`}>
              {game.shortLabel}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.tagColor}`}>
              {item.tag}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1.5 leading-tight">
            {item.name}
          </h2>
          <p className="text-sm text-[oklch(45%_0_0)] leading-relaxed mb-4 max-w-lg">
            {item.description}
          </p>

          <div className="flex items-center gap-5 text-xs text-[oklch(38%_0_0)]">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {item.date}
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                <path d="M6 1a2 2 0 100 4 2 2 0 000-4zM2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {item.spots}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 flex flex-col items-start sm:items-end gap-3">
          <Link
            to="/tournaments"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${game.gradient} hover:opacity-90 active:scale-[0.97] transition-all no-underline shadow-[0_4px_20px_oklch(0%_0_0/0.3)]`}
          >
            Ver torneo →
          </Link>

          {/* Navigation dots */}
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-6 h-6 rounded-full bg-[oklch(22%_0_0)] hover:bg-[oklch(28%_0_0)] flex items-center justify-center transition-colors cursor-pointer">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                <path d="M6 2L4 5l2 3" stroke="oklch(60% 0 0)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              {FEATURED_TOURNAMENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all cursor-pointer ${
                    i === current
                      ? `h-1.5 w-5 bg-gradient-to-r ${game.gradient}`
                      : 'h-1.5 w-1.5 bg-[oklch(28%_0_0)] hover:bg-[oklch(38%_0_0)]'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="w-6 h-6 rounded-full bg-[oklch(22%_0_0)] hover:bg-[oklch(28%_0_0)] flex items-center justify-center transition-colors cursor-pointer">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                <path d="M4 2l2 3-2 3" stroke="oklch(60% 0 0)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type StepState = 'done' | 'review' | 'pending'

const STEPS = [
  {
    id: 'email',
    doneLabel: 'Email confirmado',
    reviewLabel: null,
    pendingLabel: 'Confirmá tu email',
    path: '/confirm-email',
    getState: (p: UserProfile): StepState => p.isEmailConfirmed ? 'done' : 'pending',
  },
  {
    id: 'validation',
    doneLabel: 'Validación aprobada',
    reviewLabel: 'Constancia en revisión',
    pendingLabel: 'Validá tu cuenta',
    path: '/validation',
    getState: (p: UserProfile): StepState => p.isValidated ? 'done' : p.validationSubmitted ? 'review' : 'pending',
  },
  {
    id: 'riot',
    doneLabel: 'Cuenta Riot vinculada',
    reviewLabel: null,
    pendingLabel: 'Vincular cuenta Riot',
    path: '/link-riot',
    getState: (p: UserProfile): StepState => p.isRiotLinked ? 'done' : 'pending',
  },
]

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden animate-pulse">
      <div className="h-1.5 bg-[oklch(22%_0_0)]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 rounded-md bg-[oklch(22%_0_0)]" />
          <div className="h-4 w-32 rounded bg-[oklch(22%_0_0)]" />
        </div>
        <div className="h-3 w-full rounded bg-[oklch(22%_0_0)]" />
        <div className="mt-2 pt-3 border-t border-[oklch(20%_0_0)] flex justify-between">
          <div className="h-3 w-20 rounded bg-[oklch(20%_0_0)]" />
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [profile, setProfileState] = useState(getProfile)
  const displayName = profile?.name || profile?.email?.split('@')[0] || 'Jugador'
  const initials = getInitials(displayName)

  const stepStates = profile ? STEPS.map((s) => s.getState(profile)) : STEPS.map(() => 'pending' as StepState)
  const completedSteps = stepStates.filter((s) => s === 'done').length
  const inProgressSteps = stepStates.filter((s) => s === 'review').length

  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loadingTournaments, setLoadingTournaments] = useState(true)

  const [upcomingMatch, setUpcomingMatch] = useState<UpcomingMatch | null>(null)
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)

  useEffect(() => {
    api.getTournaments()
      .then((data) => setTournaments(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingTournaments(false))
  }, [])

  useEffect(() => {
    if (!profile?.username) { setLoadingUpcoming(false); return }
    const username = profile.username

    api.getMyTournaments()
      .then(async (myTournaments) => {
        const active = myTournaments.filter((t) => t.status === 'inProgress' || t.status === 'open')
        let soonest: UpcomingMatch | null = null
        const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000) // show matches up to 2h after start

        for (const tournament of active) {
          const myTeam = tournament.teams.find((team) =>
            team.players.some((p) => p.username === username)
          )
          if (!myTeam) continue

          const bracket = await api.getBracket(tournament.id).catch(() => null)
          if (!bracket) continue

          for (const round of bracket.rounds) {
            for (const match of round.matches) {
              if (match.winnerId || !match.scheduledAt) continue
              if (match.teamAName !== myTeam.name && match.teamBName !== myTeam.name) continue
              const matchDate = new Date(match.scheduledAt)
              if (matchDate < cutoff) continue
              if (!soonest || matchDate < new Date(soonest.match.scheduledAt!)) {
                soonest = { match, roundName: round.roundName, tournamentName: tournament.name, tournamentId: tournament.id, myTeamName: myTeam.name }
              }
            }
          }
        }
        setUpcomingMatch(soonest)
      })
      .catch(() => {})
      .finally(() => setLoadingUpcoming(false))
  }, [])

  // Consulta el estado de validación siempre que no esté aprobado aún.
  // Si la API responde, también marcamos validationSubmitted por si el flag
  // nunca se guardó localmente (ej. error de red al momento de enviar).
  useEffect(() => {
    if (profile?.isValidated) return
    api.getValidationStatus()
      .then(({ status }) => {
        const s = String(status).toLowerCase()
        const updated = {
          ...profile!,
          validationSubmitted: true,
          isValidated: s === '1' || s === 'approved',
        }
        setProfile(updated)
        setProfileState(updated)
      })
      .catch(() => {})
  }, [])

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

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

          {completedSteps < 3 && (
            <div className="flex items-center gap-3 bg-[oklch(17%_0_0)] border border-[oklch(22%_0_0)] rounded-xl px-4 py-2.5">
              <div className="flex gap-1">
                {stepStates.map((state, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-all ${
                      state === 'done'    ? 'bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)]' :
                      state === 'review'  ? 'bg-[oklch(60%_0.18_60)]' :
                      'bg-[oklch(24%_0_0)]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[oklch(48%_0_0)]">
                {completedSteps}/3
                {inProgressSteps > 0 && (
                  <span className="text-[oklch(55%_0.15_60)]"> · {inProgressSteps} en revisión</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Featured carousel */}
        <FeaturedCarousel />

        {/* Account status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((step, i) => {
            const state = stepStates[i]
            const borderColor = state === 'done' ? 'oklch(35% 0.1 145)' : state === 'review' ? 'oklch(50% 0.15 60 / 0.5)' : 'oklch(22% 0 0)'
            const topLine = state === 'done' ? 'bg-gradient-to-r from-[oklch(55%_0.2_145)] to-transparent' : state === 'review' ? 'bg-gradient-to-r from-[oklch(60%_0.18_60)] to-transparent' : 'bg-[oklch(22%_0_0)]'
            const iconBg = state === 'done' ? 'bg-[oklch(55%_0.2_145/0.15)]' : state === 'review' ? 'bg-[oklch(60%_0.18_60/0.12)]' : 'bg-[oklch(20%_0_0)]'
            const label = state === 'done' ? step.doneLabel : state === 'review' ? (step.reviewLabel ?? step.doneLabel) : step.pendingLabel
            const labelColor = state === 'done' ? 'text-[oklch(75%_0_0)]' : state === 'review' ? 'text-[oklch(65%_0.15_60)]' : 'text-[oklch(45%_0_0)]'

            return (
              <div
                key={step.id}
                className="rounded-xl border bg-[oklch(17%_0_0)] overflow-hidden transition-all"
                style={{ borderColor }}
              >
                <div className={`h-[2px] ${topLine} transition-all`} />
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${iconBg}`}>
                    {state === 'done' && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <path d="M2 6l3 3 5-5" stroke="oklch(64% 0.2 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {state === 'review' && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <circle cx="6" cy="6" r="4.5" stroke="oklch(65% 0.18 60)" strokeWidth="1.3" />
                        <path d="M6 3.5v3l2 1.2" stroke="oklch(65% 0.18 60)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {state === 'pending' && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <circle cx="6" cy="6" r="4" stroke="oklch(38% 0 0)" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${labelColor}`}>{label}</p>
                    {state === 'review' && (
                      <p className="text-[10px] text-[oklch(42%_0_0)]">Revisión en ~48hs hábiles</p>
                    )}
                    {state === 'pending' && (
                      <Link
                        to={step.path}
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
          </div>
        </div>

        {/* Próximo partido */}
        {!loadingUpcoming && upcomingMatch && (
          <div className="rounded-2xl border border-[oklch(49.1%_0.27_292.581/0.25)] bg-[oklch(49.1%_0.27_292.581/0.04)] overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(49.1%_0.27_292.581)] mb-1">
                    Próximo partido
                  </p>
                  <p className="text-sm font-bold text-white">{upcomingMatch.tournamentName}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[oklch(49.1%_0.27_292.581)] bg-[oklch(49.1%_0.27_292.581/0.12)] border border-[oklch(49.1%_0.27_292.581/0.25)] px-2 py-0.5 rounded-full">
                    {upcomingMatch.roundName}
                  </span>
                </div>
                <Link
                  to={`/tournaments/${upcomingMatch.tournamentId}`}
                  className="shrink-0 text-xs font-semibold text-[oklch(49.1%_0.27_292.581)] hover:text-[oklch(62%_0.25_292.581)] no-underline transition-colors"
                >
                  Ver bracket →
                </Link>
              </div>

              <div className="rounded-xl border border-[oklch(26%_0_0)] bg-[oklch(15.5%_0_0)] overflow-hidden mb-3">
                {/* Team A */}
                <div className={`flex items-center gap-2 px-3 py-2.5 ${upcomingMatch.match.teamAName === upcomingMatch.myTeamName ? 'bg-[oklch(49.1%_0.27_292.581/0.08)]' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${upcomingMatch.match.teamAName === upcomingMatch.myTeamName ? 'bg-[oklch(58%_0.27_292.581)] shadow-[0_0_6px_oklch(58%_0.27_292.581/0.8)]' : 'bg-[oklch(22%_0_0)]'}`} />
                  <span className="text-xs font-semibold text-[oklch(58%_0_0)] truncate">{upcomingMatch.match.teamAName ?? 'Por definir'}</span>
                  {upcomingMatch.match.teamAName === upcomingMatch.myTeamName && (
                    <span className="ml-auto text-[9px] font-bold text-[oklch(49.1%_0.27_292.581)] shrink-0">TU EQUIPO</span>
                  )}
                </div>
                <div className="h-px bg-[oklch(20%_0_0)]" />
                {/* Team B */}
                <div className={`flex items-center gap-2 px-3 py-2.5 ${upcomingMatch.match.teamBName === upcomingMatch.myTeamName ? 'bg-[oklch(49.1%_0.27_292.581/0.08)]' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${upcomingMatch.match.teamBName === upcomingMatch.myTeamName ? 'bg-[oklch(58%_0.27_292.581)] shadow-[0_0_6px_oklch(58%_0.27_292.581/0.8)]' : 'bg-[oklch(22%_0_0)]'}`} />
                  <span className="text-xs font-semibold text-[oklch(58%_0_0)] truncate">{upcomingMatch.match.teamBName ?? 'Por definir'}</span>
                  {upcomingMatch.match.teamBName === upcomingMatch.myTeamName && (
                    <span className="ml-auto text-[9px] font-bold text-[oklch(49.1%_0.27_292.581)] shrink-0">TU EQUIPO</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[oklch(45%_0_0)] flex items-center gap-1.5">
                  <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3 shrink-0">
                    <rect x="0.5" y="1.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M0.5 4h9M3 0.5v2M7 0.5v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                  {formatMatchDate(upcomingMatch.match.scheduledAt!)}
                </p>
                {upcomingMatch.match.riotLobbyCode && (
                  <a
                    href={`riotclient://launch-product?product=league_of_legends&tournamentCode=${upcomingMatch.match.riotLobbyCode}`}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity no-underline"
                  >
                    Unirse a partida →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent tournaments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[oklch(40%_0_0)]">
              Torneos activos
            </h2>
            <Link
              to="/tournaments"
              className="text-xs text-[oklch(49.1%_0.27_292.581)] hover:text-[oklch(60%_0.25_292.581)] no-underline font-semibold transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {loadingTournaments ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="rounded-xl border border-[oklch(20%_0_0)] bg-[oklch(16%_0_0)] p-8 text-center">
              <p className="text-sm text-[oklch(38%_0_0)] mb-3">No hay torneos activos por el momento</p>
              <Link
                to="/tournaments/create"
                className="text-xs font-semibold text-[oklch(49.1%_0.27_292.581)] hover:text-[oklch(60%_0.25_292.581)] no-underline"
              >
                Crear el primero →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
