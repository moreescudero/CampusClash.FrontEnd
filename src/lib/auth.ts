import { getToken, clearToken } from './api'

export interface UserProfile {
  name: string
  email: string
  university: string
  faculty: string
  isEmailConfirmed: boolean
  isRiotLinked: boolean
  isValidated: boolean
  validationSubmitted: boolean // sent the form, pending admin approval
}

const PROFILE_KEY = 'cc_profile'

export function setProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY)
  return raw ? (JSON.parse(raw) as UserProfile) : null
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function logout() {
  clearToken()
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem('cc_email')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
