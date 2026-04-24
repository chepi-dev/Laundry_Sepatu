import type { AuthMode, OtpFlow } from '../../../types/auth'

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

  if (hash === '#/auth/verify-email/register') {
    return 'verify-email'
  }

  if (hash === '#/auth/send-otp/register' || hash === '#/auth/send-otp/forgot-password') {
    return 'send-otp'
  }

  return null
}

export function getOtpFlowFromHash(hash: string): OtpFlow | null {
  if (hash === '#/auth/verify-email/register') {
    return 'register'
  }

  if (hash === '#/auth/send-otp/register') {
    return 'register'
  }

  if (hash === '#/auth/send-otp/forgot-password') {
    return 'forgot-password'
  }

  return null
}
