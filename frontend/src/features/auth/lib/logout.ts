import { logout, clearCurrentUserCache } from '../api/auth.api'
import { clearServicesCache } from '../../services/api/services.api'
import { clearSessionUser } from './session'

export async function performLogout() {
  try {
    await logout()
  } catch {
    // Token lokal tetap dibersihkan agar sesi frontend tidak tersisa.
  }

  clearSessionUser()
  clearCurrentUserCache()
  clearServicesCache()
  window.location.hash = '#/auth/login'
}
