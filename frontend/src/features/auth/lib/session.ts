import type { ApiUser } from '../../../types/api'
import type { UserRole } from '../../../types/domain'

const AUTH_USER_KEY = 'laundry_auth_user'

export function setSessionUser(user: ApiUser) {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getSessionUser(): ApiUser | null {
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as ApiUser
  } catch {
    return null
  }
}

export function clearSessionUser() {
  window.localStorage.removeItem(AUTH_USER_KEY)
}

export function hasRoleAccess(role: UserRole) {
  return getSessionUser()?.role === role
}
