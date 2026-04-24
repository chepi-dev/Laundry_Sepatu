import { logout } from '../../../api/auth.api'
import { clearSessionUser } from './session'

export async function performLogout() {
  try {
    await logout()
  } catch {
    clearSessionUser()
  }

  clearSessionUser()
  window.location.hash = '#/auth/login'
}
