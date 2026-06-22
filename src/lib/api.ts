import { normalizeGame, normalizeStatus, Tournament, EnrollResponse, OrganizerRequestResponse, Bracket } from '../types/tournament'

const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api'

const TOKEN_KEY = 'cc_token'

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // Don't set Content-Type for FormData — browser sets it automatically with the boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body as { message?: string }).message ?? `Error ${res.status}`
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

function normalizeBracket(raw: unknown): Bracket {
  const obj = raw as Record<string, unknown>
  const rounds = obj.rounds

  if (!Array.isArray(rounds)) return { rounds: [] }

  return {
    rounds: rounds.map((r) => {
      const rd = r as Record<string, unknown>
      const matches = Array.isArray(rd.matches) ? rd.matches : []
      return {
        round: (rd.round ?? rd.Round ?? 0) as number,
        roundName: String(rd.roundName ?? rd.RoundName ?? ''),
        matches: matches.map((m) => {
          const mt = m as Record<string, unknown>
          const str = (v: unknown) => (v != null ? String(v) : null)
          const id = str(mt.id ?? mt.Id ?? mt.matchId ?? mt.MatchId) ?? ''
          if (!id && import.meta.env.DEV) {
            console.warn('[normalizeBracket] match sin id — campos disponibles:', Object.keys(mt))
          }
          return {
            id,
            matchNumber:   Number(mt.matchNumber  ?? mt.MatchNumber  ?? 0),
            teamAId:       str(mt.teamAId    ?? mt.TeamAId)    ,
            teamAName:     str(mt.teamAName  ?? mt.TeamAName)  ,
            teamBId:       str(mt.teamBId    ?? mt.TeamBId)    ,
            teamBName:     str(mt.teamBName  ?? mt.TeamBName)  ,
            winnerId:      str(mt.winnerId   ?? mt.WinnerId)   ,
            winnerName:    str(mt.winnerName ?? mt.WinnerName) ,
            scheduledAt:   str(mt.scheduledAt  ?? mt.ScheduledAt)  ,
            riotLobbyCode: str(mt.riotLobbyCode ?? mt.RiotLobbyCode),
          }
        }),
      }
    }),
  }
}

function normalizeTournament(t: Tournament): Tournament {
  return {
    ...t,
    game: normalizeGame(t.game as unknown as string),
    status: normalizeStatus(t.status as unknown as string),
    teams: (t.teams ?? []).map((team) => ({
      ...team,
      players: (team.players ?? []).map((p) => {
        const raw = p as unknown as Record<string, string>
        const username =
          raw.userName ?? raw.username ?? raw.UserName ?? raw.Username ??
          raw.name ?? raw.Name ?? raw.displayName ?? raw.DisplayName ?? ''
        const userId = raw.userId ?? raw.UserId ?? raw.id ?? raw.Id ?? ''
        if (!username && import.meta.env.DEV) {
          console.warn('[TeamPlayer] No se encontró username en el player. Campos disponibles:', Object.keys(raw))
        }
        return { ...p, userId, username }
      }),
    })),
  }
}

export const api = {
  register(data: { name: string; email: string; password: string; university: string; faculty: string; career: string }) {
    return request<{ token: string; username: string; email: string; isEmailConfirmed: boolean; isRiotLinked: boolean; isValidated: boolean }>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login(data: { email: string; password: string }) {
    return request<{ token: string; username: string; isEmailConfirmed: boolean; isRiotLinked: boolean; isValidated: boolean }>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  requestValidation(data: {
    legajo: string
    universityId: string
    faculty: string
    career: string
    year: number
    file: File
  }) {
    const formData = new FormData()
    formData.append('legajo', data.legajo)
    formData.append('university', data.universityId)
    formData.append('faculty', data.faculty)
    formData.append('career', data.career)
    formData.append('year', String(data.year))
    formData.append('file', data.file)
    return request<{ message: string }>('/Validation/request', {
      method: 'POST',
      body: formData,
    })
  },

  getValidationStatus() {
    return request<{ status: string | number }>('/Validation/status')
  },

  getUniversities() {
    return request<{ id: string; name: string }[]>('/University')
  },

  linkRiot(data: { summonerName: string; region: string }) {
    return request<{ message: string }>('/Riot/link', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // ── Tournaments ─────────────────────────────────────────────────────────────

  getTournaments() {
    return request<Tournament[]>('/Tournament')
      .then((ts) => ts.map(normalizeTournament))
  },

  getTournament(id: string) {
    return request<Tournament>(`/Tournament/${id}`)
      .then(normalizeTournament)
  },

  getMyTournaments() {
    return request<Tournament[]>('/Tournament/my')
      .then((ts) => ts.map(normalizeTournament))
  },

  enrollTournament(id: string) {
    return request<EnrollResponse>(`/Tournament/${id}/enroll`, {
      method: 'POST',
    })
  },

  leaveTournament(id: string) {
    return request<{ message: string }>(`/Tournament/${id}/enroll`, {
      method: 'DELETE',
    })
  },

  updateTournament(id: string, data: {
    name: string
    startDate: string
    game: 0 | 1 | 2
    description: string
    isInterUniversity: boolean
    universityId: string | null
    maxTeams: number
  }) {
    return request<Tournament>(`/Tournament/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  generateBracket(id: string) {
    return request<unknown>(`/Tournament/${id}/bracket`, { method: 'POST' })
      .then(normalizeBracket)
  },

  getBracket(id: string) {
    return request<unknown>(`/Tournament/${id}/bracket`)
      .then(normalizeBracket)
  },

  // ── LCU / Match lobby ────────────────────────────────────────────────────────

  registerLCU(data: { url: string; token: string }) {
    return request<{ message: string }>('/lcu/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  createLobby(matchId: string) {
    return request<{ message: string }>(`/matches/${matchId}/create-lobby`, {
      method: 'POST',
    })
  },

  invitePlayers(matchId: string, playerNames: string[]) {
    return request<{ message: string }>(`/matches/${matchId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ playerNames }),
    })
  },

  getLobbyStatus(matchId: string) {
    return request<{ members?: { summonerName: string; state?: string }[] }>(
      `/matches/${matchId}/lobby-status`
    )
  },

  // ── Organizer Request ────────────────────────────────────────────────────────

  createOrganizerRequest(data: {
    tournamentName: string
    startDate: string
    game: 0 | 1 | 2
    description: string
    isInterUniversity: boolean
    universityId: string | null
    maxTeams: number
  }) {
    return request<OrganizerRequestResponse>('/OrganizerRequest', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
