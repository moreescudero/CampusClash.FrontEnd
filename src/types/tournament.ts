export type GameString = 'leagueoflegends' | 'valorant' | 'cs2'
export type TournamentStatus = 'draft' | 'open' | 'inProgress' | 'finished' | 'cancelled'
export type OrganizerRequestStatus = 'pending' | 'approved' | 'rejected'

export interface Player {
  userId: string
  username: string
}

export interface Team {
  id: string
  name: string
  universityName: string
  isFull: boolean
  players: Player[]
}

export interface Tournament {
  id: string
  name: string
  game: GameString
  description: string
  isInterUniversity: boolean
  universityName: string | null
  maxTeams: number
  startDate: string
  status: TournamentStatus
  organizerUsername: string
  createdAt: string
  teams: Team[]
}

export interface OrganizerRequestResponse {
  id: string
  tournamentName: string
  startDate: string
  game: GameString
  description: string
  isInterUniversity: boolean
  universityName: string | null
  maxTeams: number
  status: OrganizerRequestStatus
  createdAt: string
  reviewedAt: string | null
}

export interface EnrollResponse {
  teamId: string
  teamName: string
  universityName: string
  currentPlayers: number
  isFull: boolean
}

export interface GameInfo {
  label: string
  shortLabel: string
  gradient: string
  enumValue: 0 | 1 | 2
}

export const GAME_CONFIG: Record<GameString, GameInfo> = {
  leagueoflegends: {
    label: 'League of Legends',
    shortLabel: 'LoL',
    gradient: 'from-[oklch(55%_0.2_230)] to-[oklch(48%_0.22_260)]',
    enumValue: 0,
  },
  valorant: {
    label: 'Valorant',
    shortLabel: 'Valorant',
    gradient: 'from-[oklch(58%_0.22_25)] to-[oklch(48%_0.2_350)]',
    enumValue: 1,
  },
  cs2: {
    label: 'CS2',
    shortLabel: 'CS2',
    gradient: 'from-[oklch(60%_0.18_145)] to-[oklch(50%_0.16_170)]',
    enumValue: 2,
  },
}

export const STATUS_CONFIG: Record<TournamentStatus, { label: string; className: string }> = {
  draft:      { label: 'Borrador',             className: 'text-[oklch(40%_0_0)] bg-[oklch(22%_0_0)] border-[oklch(26%_0_0)]' },
  open:       { label: 'Inscripción abierta',  className: 'text-[oklch(60%_0.2_145)] bg-[oklch(55%_0.2_145/0.12)] border-[oklch(55%_0.2_145/0.25)]' },
  inProgress: { label: 'En curso',             className: 'text-[oklch(65%_0.2_60)] bg-[oklch(60%_0.2_60/0.12)] border-[oklch(60%_0.2_60/0.25)]' },
  finished:   { label: 'Finalizado',           className: 'text-[oklch(42%_0_0)] bg-[oklch(20%_0_0)] border-[oklch(24%_0_0)]' },
  cancelled:  { label: 'Cancelado',            className: 'text-[oklch(55%_0.15_25)] bg-[oklch(55%_0.15_25/0.1)] border-[oklch(55%_0.15_25/0.2)]' },
}

export function normalizeGame(raw: string | number): GameString {
  const s = String(raw).toLowerCase().replace(/[\s_]/g, '')
  if (s === '0' || s === 'leagueoflegends' || s === 'lol') return 'leagueoflegends'
  if (s === '1' || s === 'valorant') return 'valorant'
  if (s === '2' || s === 'cs2') return 'cs2'
  return 'valorant'
}

export function normalizeStatus(raw: string | number): TournamentStatus {
  const s = String(raw).toLowerCase().replace(/[\s_]/g, '')
  if (s === 'draft' || s === '0') return 'draft'
  if (s === 'open' || s === '1') return 'open'
  if (s === 'inprogress' || s === '2') return 'inProgress'
  if (s === 'finished' || s === '3') return 'finished'
  if (s === 'cancelled' || s === 'canceled' || s === '4') return 'cancelled'
  return 'open'
}

export interface BracketMatchEntry {
  id: string
  matchNumber: number
  teamAId: string | null
  teamAName: string | null
  teamBId: string | null
  teamBName: string | null
  winnerId: string | null
  winnerName: string | null
}

export interface BracketRound {
  round: number
  roundName: string
  matches: BracketMatchEntry[]
}

export interface Bracket {
  rounds: BracketRound[]
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
