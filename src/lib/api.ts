const BASE = '/api'

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

export const api = {
  register(data: { name: string; email: string; password: string; university: string; faculty: string }) {
    return request<{ token: string; email: string; isEmailConfirmed: boolean; isRiotLinked: boolean; isValidated: boolean }>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login(data: { email: string; password: string }) {
    return request<{ token: string; isEmailConfirmed: boolean; isRiotLinked: boolean; isValidated: boolean }>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  requestValidation(data: {
    legajo: string
    university: string
    faculty: string
    career: string
    year: string
    file: File
  }) {
    const formData = new FormData()
    formData.append('legajo', data.legajo)
    formData.append('university', data.university)
    formData.append('faculty', data.faculty)
    formData.append('career', data.career)
    formData.append('year', data.year)
    formData.append('file', data.file)
    return request<{ message: string }>('/Validation/request', {
      method: 'POST',
      body: formData,
    })
  },

  getValidationStatus() {
    return request<{ status: string }>('/Validation/status')
  },

  linkRiot(data: { summonerName: string; region: string }) {
    return request<{ message: string }>('/Riot/link', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
