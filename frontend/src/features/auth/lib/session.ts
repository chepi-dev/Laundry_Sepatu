import type { User, UserRole } from '../../../types/domain'

const AUTH_USER_KEY = 'laundry_auth_user'
const AUTH_TOKEN_KEY = 'laundry_auth_token'

export function setSessionUser(user: User) {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getSessionUser(): User | null {
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    return null
  }
}

export function clearSessionUser() {
  window.localStorage.removeItem(AUTH_USER_KEY)
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function hasRoleAccess(role: UserRole) {
  return getSessionUser()?.role === role
}
