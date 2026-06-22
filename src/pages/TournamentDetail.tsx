import { useEffect, useState, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MainLayout } from '../components/MainLayout'
import { api } from '../lib/api'
import { Tournament, GAME_CONFIG, STATUS_CONFIG, formatDate, Bracket, BracketMatchEntry } from '../types/tournament'
import { getProfile } from '../lib/auth'

// ── Skeleton ──────────────────────────────────────────────────────────────────

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

// ── Team Card ─────────────────────────────────────────────────────────────────

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
        <div className="flex flex-col gap-1">
          {team.players.map((p, i) => {
            const name = p.username || ''
            const initial = name ? name[0].toUpperCase() : '?'
            return (
              <div key={p.userId || i} className="flex items-center gap-2.5 py-1">
                {name ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {initial}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[oklch(20%_0_0)] border border-dashed border-[oklch(28%_0_0)] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[oklch(25%_0_0)]" />
                  </div>
                )}
                {name ? (
                  <span className="text-xs font-medium text-[oklch(72%_0_0)] truncate">{name}</span>
                ) : (
                  <span className="text-xs text-[oklch(32%_0_0)] italic">Jugador {i + 1}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Bracket Components ────────────────────────────────────────────────────────

const SLOT_UNIT = 132  // base slot height: card (up to ~124px with schedule+lobby) + gap (~8px)

function formatMatchDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function BracketTeamRow({ name, isWinner }: { name: string | null; isWinner: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 transition-colors ${
      isWinner ? 'bg-[oklch(49.1%_0.27_292.581/0.1)]' : ''
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
        isWinner
          ? 'bg-[oklch(58%_0.27_292.581)] shadow-[0_0_6px_oklch(58%_0.27_292.581/0.9)]'
          : 'bg-[oklch(22%_0_0)]'
      }`} />
      <p className={`text-xs font-semibold truncate leading-tight ${
        isWinner ? 'text-white' : name ? 'text-[oklch(58%_0_0)]' : 'text-[oklch(26%_0_0)]'
      }`}>
        {name ?? 'Por definir'}
      </p>
    </div>
  )
}

function BracketMatchCard({ match }: { match: BracketMatchEntry }) {
  const aWon = !!match.winnerId && match.teamAId === match.winnerId
  const bWon = !!match.winnerId && match.teamBId === match.winnerId

  return (
    <div className={`w-52 rounded-xl overflow-hidden border transition-all ${
      match.winnerId
        ? 'border-[oklch(49.1%_0.27_292.581/0.35)] shadow-[0_0_18px_oklch(49.1%_0.27_292.581/0.08)]'
        : 'border-[oklch(23%_0_0)]'
    } bg-[oklch(15.5%_0_0)]`}>
      <BracketTeamRow name={match.teamAName} isWinner={aWon} />
      <div className="h-px bg-[oklch(20%_0_0)]" />
      <BracketTeamRow name={match.teamBName} isWinner={bWon} />
      {match.scheduledAt && (
        <>
          <div className="h-px bg-[oklch(18%_0_0)]" />
          <div className="px-3 py-2">
            <p className="text-[10px] text-[oklch(38%_0_0)] flex items-center gap-1.5">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5 shrink-0">
                <rect x="0.5" y="1.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                <path d="M0.5 4h9M3 0.5v2M7 0.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {formatMatchDate(match.scheduledAt)}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function MatchReadyBanner({ match, roundName }: { match: BracketMatchEntry; roundName: string }) {
  const [lobbyReady, setLobbyReady] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const withinWindow = !!match.scheduledAt &&
    new Date(match.scheduledAt).getTime() - Date.now() <= 8 * 60 * 60 * 1000

  useEffect(() => {
    if (!withinWindow) return

    if (import.meta.env.DEV) {
      console.log('[LobbyStatus] match.id =', match.id, '| URL → /api/matches/' + match.id + '/lobby-status')
    }

    async function poll() {
      try {
        const raw = await api.getLobbyStatus(match.id)
        // El backend puede devolver el array directo o envuelto en un objeto
        const members: unknown[] = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as Record<string, unknown>)?.members)
            ? (raw as Record<string, unknown[]>).members
            : Array.isArray((raw as Record<string, unknown>)?.Members)
              ? (raw as Record<string, unknown[]>).Members
              : Array.isArray((raw as Record<string, unknown>)?.participants)
                ? (raw as Record<string, unknown[]>).participants
                : []

        if (import.meta.env.DEV) {
          console.log('[LobbyStatus] respuesta raw:', raw, '→ members:', members.length)
        }

        if (members.length > 0) {
          setMemberCount(members.length)
          setLobbyReady(true)
        }
      } catch {
        // 400/404 LOBBY_NOT_FOUND → todavía no está listo
      }
    }

    poll()
    const id = setInterval(poll, 30_000)
    return () => clearInterval(id)
  }, [match.id])

  function copy() {
    if (!match.riotLobbyCode) return
    navigator.clipboard.writeText(match.riotLobbyCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden border border-[oklch(49.1%_0.27_292.581/0.35)] bg-[oklch(13%_0.015_292)] shadow-[0_0_48px_oklch(49.1%_0.27_292.581/0.12)]">
      <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(65%_0.25_310)] to-[oklch(47%_0.28_283)]" />
      <div className="p-5 sm:p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[oklch(58%_0.27_292.581)] animate-pulse shadow-[0_0_8px_oklch(58%_0.27_292.581)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[oklch(62%_0.25_292.581)]">Tu partida</span>
          </div>
          <span className="text-[10px] font-semibold text-[oklch(55%_0.2_292.581)] bg-[oklch(49.1%_0.27_292.581/0.12)] border border-[oklch(49.1%_0.27_292.581/0.25)] px-2.5 py-0.5 rounded-full">
            {roundName}
          </span>
          {match.scheduledAt && (
            <span className="ml-auto text-xs text-[oklch(42%_0_0)] hidden sm:block">{formatMatchDate(match.scheduledAt)}</span>
          )}
        </div>

        {/* Teams VS */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 min-w-0 rounded-xl bg-[oklch(17%_0_0)] border border-[oklch(24%_0_0)] px-4 py-3 text-center">
            <p className="text-sm font-bold text-white truncate">{match.teamAName ?? 'Por definir'}</p>
          </div>
          <span className="shrink-0 text-xs font-black text-[oklch(30%_0_0)] tracking-widest">VS</span>
          <div className="flex-1 min-w-0 rounded-xl bg-[oklch(17%_0_0)] border border-[oklch(24%_0_0)] px-4 py-3 text-center">
            <p className="text-sm font-bold text-white truncate">{match.teamBName ?? 'Por definir'}</p>
          </div>
        </div>

        {/* Lobby status — solo visible dentro de la ventana de 8h */}
        {withinWindow && (
          lobbyReady ? (
            <div className="rounded-xl border border-[oklch(52%_0.2_145/0.4)] bg-[oklch(52%_0.2_145/0.06)] p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[oklch(52%_0.2_145/0.15)] border border-[oklch(52%_0.2_145/0.25)] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[oklch(58%_0.2_145)] shadow-[0_0_8px_oklch(58%_0.2_145/0.8)] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-[oklch(68%_0.18_145)] uppercase tracking-wider">¡Tu invitación está lista!</span>
                    {memberCount > 0 && (
                      <span className="text-[10px] text-[oklch(45%_0.14_145)] bg-[oklch(52%_0.2_145/0.12)] border border-[oklch(52%_0.2_145/0.2)] px-1.5 py-0.5 rounded-full">
                        {memberCount} en sala
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[oklch(65%_0_0)] leading-snug">
                    Abrí League of Legends y aceptá la invitación que te llegó al cliente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4 px-1">
              <svg className="w-3 h-3 animate-spin text-[oklch(35%_0_0)]" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="2" strokeDasharray="6 18" />
              </svg>
              <span className="text-xs text-[oklch(34%_0_0)]">Preparando lobby...</span>
            </div>
          )
        )}

        {/* Fallback: código manual */}
        {match.riotLobbyCode && (
          <>
            {withinWindow && (
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[oklch(19%_0_0)]" />
                <span className="text-[9px] text-[oklch(26%_0_0)] uppercase tracking-widest">o entrá manualmente</span>
                <div className="flex-1 h-px bg-[oklch(19%_0_0)]" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 rounded-xl bg-[oklch(11%_0_0)] border border-[oklch(20%_0_0)] px-4 py-2.5">
                <p className="text-[9px] uppercase tracking-widest text-[oklch(32%_0_0)] mb-0.5">Código de sala</p>
                <p className="text-sm font-mono font-bold text-white tracking-wider truncate">{match.riotLobbyCode}</p>
              </div>
              <button
                onClick={copy}
                className={`shrink-0 px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  copied
                    ? 'bg-[oklch(50%_0.2_145)] text-white'
                    : 'bg-[oklch(22%_0_0)] border border-[oklch(28%_0_0)] text-[oklch(65%_0_0)] hover:bg-[oklch(25%_0_0)]'
                }`}
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-[10px] text-[oklch(28%_0_0)] mt-2.5">
              En tu cliente de LoL: <span className="text-[oklch(38%_0_0)]">Jugar → Personalizado → Unirte con código</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}


function BracketConnector({ pairCount, slotH }: { pairCount: number; slotH: number }) {
  const armH = slotH / 2
  return (
    <div className="shrink-0" style={{ width: '24px' }}>
      <div style={{ height: '28px' }} />
      {Array.from({ length: pairCount }).map((_, pi) => (
        <div key={pi} style={{ height: `${slotH * 2}px` }} className="relative">
          <div className="absolute border-r-2 border-[oklch(26%_0_0)]" style={{ top: armH, left: 0, width: 12, height: armH }} />
          <div className="absolute border-r-2 border-[oklch(26%_0_0)]" style={{ top: slotH, left: 0, width: 12, height: armH }} />
          <div className="absolute border-t-2 border-[oklch(26%_0_0)]" style={{ top: slotH - 1, left: 12, right: 0 }} />
        </div>
      ))}
    </div>
  )
}

function BracketConnectorReverse({ pairCount, slotH }: { pairCount: number; slotH: number }) {
  const armH = slotH / 2
  return (
    <div className="shrink-0" style={{ width: '24px' }}>
      <div style={{ height: '28px' }} />
      {Array.from({ length: pairCount }).map((_, pi) => (
        <div key={pi} style={{ height: `${slotH * 2}px` }} className="relative">
          <div className="absolute border-l-2 border-[oklch(26%_0_0)]" style={{ top: armH, right: 0, width: 12, height: armH }} />
          <div className="absolute border-l-2 border-[oklch(26%_0_0)]" style={{ top: slotH, right: 0, width: 12, height: armH }} />
          <div className="absolute border-t-2 border-[oklch(26%_0_0)]" style={{ top: slotH - 1, left: 0, right: 12 }} />
        </div>
      ))}
    </div>
  )
}

function DirectConnector({ slotH }: { slotH: number }) {
  return (
    <div className="shrink-0" style={{ width: '24px' }}>
      <div style={{ height: '28px' }} />
      <div style={{ height: `${slotH}px` }} className="relative">
        <div className="absolute border-t-2 border-[oklch(26%_0_0)]" style={{ top: slotH / 2 - 1, left: 0, right: 0 }} />
      </div>
    </div>
  )
}

function RoundCol({ roundName, matches, slotH }: { roundName: string; matches: Bracket['rounds'][number]['matches']; slotH: number }) {
  return (
    <div style={{ width: '208px' }}>
      <div style={{ height: '28px' }} className="flex items-center justify-center">
        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[oklch(58%_0.27_292.581)] to-[oklch(62%_0.22_310)]">
          {roundName}
        </span>
      </div>
      {matches.map((match, mi) => (
        <div key={match.id ?? mi} style={{ height: `${slotH}px` }} className="flex items-center">
          <BracketMatchCard match={match} />
        </div>
      ))}
    </div>
  )
}

function BracketView({ bracket }: { bracket: Bracket }) {
  const rounds = bracket.rounds ?? []

  if (rounds.length === 0) return null

  // Single-round tournament (just a final with 2 teams)
  if (rounds.length === 1) {
    const r = rounds[0]
    return (
      <div className="overflow-x-auto rounded-2xl border border-[oklch(19%_0_0)] bg-[oklch(12.5%_0_0)] p-6 flex justify-center">
        <RoundCol roundName={r.roundName} matches={r.matches} slotH={SLOT_UNIT} />
      </div>
    )
  }

  const finalRound = rounds[rounds.length - 1]
  const halfRounds = rounds.slice(0, -1)
  const totalHalfRounds = halfRounds.length

  // Split each non-final round into left (first half of matches) and right (second half)
  const leftRounds = halfRounds.map((r) => ({ ...r, matches: r.matches.slice(0, Math.ceil(r.matches.length / 2)) }))
  const rightRounds = halfRounds.map((r) => ({ ...r, matches: r.matches.slice(Math.ceil(r.matches.length / 2)) })).reverse()

  // Slot height of the innermost half-round (last left / first right) = also the Final's slot height
  const innerSlotH = SLOT_UNIT * Math.pow(2, totalHalfRounds - 1)

  return (
    <div className="overflow-x-auto rounded-2xl border border-[oklch(19%_0_0)] bg-[oklch(12.5%_0_0)] p-6">
      <div className="min-w-full flex justify-center">
      <div className="flex items-start gap-0">

        {/* LEFT SIDE: outermost round → innermost (Semi-L) */}
        {leftRounds.map((round, ri) => {
          const slotH = SLOT_UNIT * Math.pow(2, ri)
          const isLast = ri === totalHalfRounds - 1
          return (
            <Fragment key={`L${ri}`}>
              <RoundCol roundName={round.roundName} matches={round.matches} slotH={slotH} />
              {isLast
                ? <DirectConnector slotH={slotH} />
                : <BracketConnector pairCount={Math.floor(round.matches.length / 2)} slotH={slotH} />
              }
            </Fragment>
          )
        })}

        {/* FINAL — center */}
        <RoundCol roundName={finalRound.roundName} matches={finalRound.matches} slotH={innerSlotH} />

        {/* RIGHT SIDE: innermost (Semi-R) → outermost, with mirrored connectors */}
        {rightRounds.map((round, ri) => {
          const actualRi = totalHalfRounds - 1 - ri
          const slotH = SLOT_UNIT * Math.pow(2, actualRi)
          const isFirst = ri === 0
          return (
            <Fragment key={`R${ri}`}>
              {isFirst
                ? <DirectConnector slotH={innerSlotH} />
                : <BracketConnectorReverse pairCount={Math.floor(round.matches.length / 2)} slotH={slotH} />
              }
              <RoundCol roundName={round.roundName} matches={round.matches} slotH={slotH} />
            </Fragment>
          )
        })}

      </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function TournamentDetail() {
  const { id } = useParams<{ id: string }>()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState('')
  const [enrollSuccess, setEnrollSuccess] = useState('')
  const [leaving, setLeaving] = useState(false)

  const [bracket, setBracket] = useState<Bracket | null>(null)
  const [bracketLoading, setBracketLoading] = useState(true)
  const [generatingBracket, setGeneratingBracket] = useState(false)
  const [bracketError, setBracketError] = useState('')

  const profile = getProfile()

  useEffect(() => {
    if (!id) return
    api.getTournament(id)
      .then(setTournament)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el torneo'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    api.getBracket(id)
      .then(setBracket)
      .catch(() => {})
      .finally(() => setBracketLoading(false))
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
      setEnrollError(err instanceof Error ? err.message : 'No se pudo dar de baja')
    } finally {
      setLeaving(false)
    }
  }

  async function handleGenerateBracket() {
    if (!id) return
    setGeneratingBracket(true)
    setBracketError('')
    try {
      const b = await api.generateBracket(id)
      setBracket(b)
    } catch (err) {
      setBracketError(err instanceof Error ? err.message : 'No se pudo generar el bracket')
    } finally {
      setGeneratingBracket(false)
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
        <div className="max-w-5xl mx-auto px-6 py-32 flex flex-col items-center text-center">
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
  const isOrganizer = profile?.username === tournament.organizerUsername
  const isFull = tournament.teams.length >= tournament.maxTeams
  const canGenerateBracket = isOrganizer && isFull && !bracket && !bracketLoading

  const myTeam = tournament.teams.find((team) =>
    team.players.some((p) => p.username === profile?.username)
  )
  const myUpcomingMatch = (() => {
    if (!bracket || !myTeam) return null
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000)
    for (const round of bracket.rounds) {
      for (const match of round.matches) {
        if (match.winnerId || !match.scheduledAt) continue
        if (match.teamAName !== myTeam.name && match.teamBName !== myTeam.name) continue
        if (new Date(match.scheduledAt) < cutoff) continue
        return { match, roundName: round.roundName }
      }
    }
    return null
  })()

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

        {/* Match ready banner — shown to participants when their match has a scheduled lobby */}
        {myUpcomingMatch && (
          <MatchReadyBanner match={myUpcomingMatch.match} roundName={myUpcomingMatch.roundName} />
        )}

        {/* Generate bracket banner — organizer only, when tournament is full and bracket not yet created */}
        {canGenerateBracket && (
          <div className="mb-8 rounded-xl border border-[oklch(58%_0.2_60/0.3)] bg-[oklch(58%_0.2_60/0.05)] p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[oklch(70%_0.18_60)]">El torneo tiene todos los equipos listos</p>
              <p className="text-xs text-[oklch(45%_0_0)] mt-0.5">Como organizador podés generar el bracket ahora. Esta acción no se puede repetir.</p>
            </div>
            <button
              onClick={handleGenerateBracket}
              disabled={generatingBracket}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-[oklch(55%_0.2_60)] to-[oklch(50%_0.22_40)]
                hover:opacity-90 active:scale-95 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-[oklch(55%_0.2_60/0.25)]"
            >
              <svg viewBox="0 0 12 14" fill="currentColor" className="w-3 h-3.5 shrink-0">
                <path d="M7 0.5L1.5 7.5H5.5L4.5 13.5L11 6.5H7L7 0.5Z" />
              </svg>
              {generatingBracket ? 'Generando...' : 'Generar Bracket'}
            </button>
          </div>
        )}

        {bracketError && (
          <div className="mb-6 rounded-lg border border-[oklch(62%_0.22_25)/0.3] bg-[oklch(22%_0_0)] px-4 py-3 text-sm text-[oklch(62%_0.22_25)]">
            {bracketError}
          </div>
        )}

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

        {/* Bracket — always visible */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[oklch(20%_0_0)]" />
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[oklch(49.1%_0.27_292.581)]">
                <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="11" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="11" y="5" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 3h3M5 13h3M8 3v10M8 8h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-black uppercase tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-r from-[oklch(55%_0.27_292.581)] to-[oklch(65%_0.22_310)]">
                Bracket
              </span>
            </div>
            <div className="h-px flex-1 bg-[oklch(20%_0_0)]" />
          </div>

          {bracketLoading ? (
            <div className="rounded-2xl border border-[oklch(19%_0_0)] bg-[oklch(12.5%_0_0)] p-6 animate-pulse">
              <div className="flex gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="h-3 w-20 rounded bg-[oklch(20%_0_0)] mx-auto" />
                    {Array.from({ length: Math.pow(2, 3 - i) }).map((_, j) => (
                      <div key={j} className="w-52 rounded-xl bg-[oklch(17%_0_0)] overflow-hidden">
                        <div className="px-3 py-2.5"><div className="h-2.5 w-28 rounded bg-[oklch(22%_0_0)]" /></div>
                        <div className="h-px bg-[oklch(20%_0_0)]" />
                        <div className="px-3 py-2.5"><div className="h-2.5 w-24 rounded bg-[oklch(22%_0_0)]" /></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : bracket ? (
            <BracketView bracket={bracket} />
          ) : (
            <div className="rounded-2xl border border-[oklch(19%_0_0)] bg-[oklch(12.5%_0_0)] p-12 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-[oklch(24%_0_0)] bg-[oklch(16%_0_0)] flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-[oklch(32%_0_0)]">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="1" y="14" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="14" y="7" width="5" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 3.5h5M6 16.5h5M10 3.5v13M10 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[oklch(38%_0_0)]">El bracket aún no fue generado</p>
              <p className="text-xs text-[oklch(28%_0_0)]">
                {isFull
                  ? isOrganizer
                    ? 'Usá el botón de arriba para generar el bracket.'
                    : 'El organizador todavía no generó el bracket.'
                  : `Faltan ${tournament.maxTeams - tournament.teams.length} equipo${tournament.maxTeams - tournament.teams.length !== 1 ? 's' : ''} para completar el torneo.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
