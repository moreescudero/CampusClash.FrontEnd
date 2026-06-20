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

function normalizeTournament(t: Tournament): Tournament {
  return {
    ...t,
    game: normalizeGame(t.game as unknown as string),
    status: normalizeStatus(t.status as unknown as string),
    teams: (t.teams ?? []).map((team) => ({
      ...team,
      players: (team.players ?? []).map((p) => ({
        ...p,
        username: (p as unknown as Record<string, string>).userName ?? p.username ?? '',
      })),
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
    return request<Bracket>(`/tournament/${id}/bracket`, { method: 'POST' })
  },

  getBracket(id: string) {
    return request<Bracket>(`/tournament/${id}/bracket`)
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
