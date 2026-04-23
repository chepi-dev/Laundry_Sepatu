import type { AuthMode } from '../../../types/auth'

export function getAuthModeFromHash(hash: string): AuthMode | null {
  if (hash === '#/auth/login') {
    return 'login'
  }

  if (hash === '#/auth/register') {
    return 'register'
  }

  if (hash === '#/auth/forgot-password') {
    return 'forgot-password'
  }

  return null
}
