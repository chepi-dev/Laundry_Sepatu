import { logout } from '../api/auth.api'
import { clearSessionUser } from './session'

export async function performLogout() {
  try {
    await logout()
  } catch {
    // Token lokal tetap dibersihkan agar sesi frontend tidak tersisa.
  }

  clearSessionUser()
  window.location.hash = '#/auth/login'
}
