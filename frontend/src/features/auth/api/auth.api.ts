import type { User } from '../../../types/domain'
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../lib/session'
import { authRequest } from './auth.client'
import type {
  AuthApiUser,
  AuthResponse,
  LoginPayload,
  OtpResponse,
  RegisterPayload,
  SendOtpPayload,
  VerifyOtpPayload,
} from './auth.types'

function mapAuthUserToDomain(user: AuthApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    noHp: user.no_hp,
    alamat: user.alamat,
  }
}

function getResponseToken(payload: AuthResponse) {
  return payload.access_token ?? null
}

export async function login(payload: LoginPayload) {
  const response = await authRequest<AuthResponse>('/login', {
    method: 'GET',
    payload: {
      email: payload.email,
      password: payload.password,
    },
  })
  const token = getResponseToken(response)

  if (!token) {
    throw new Error('Token login tidak diterima dari server.')
  }

  setAuthToken(token)

  return {
    user: mapAuthUserToDomain(response.user),
    token,
  }
}

export async function register(payload: RegisterPayload) {
  const response = await authRequest<AuthResponse>('/register', {
    method: 'POST',
    payload: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.password,
      role: payload.role ?? 'customer',
      no_hp: payload.no_hp,
      alamat: payload.alamat,
    },
  })
  const token = getResponseToken(response)

  if (token) {
    setAuthToken(token)
  }

  return {
    user: mapAuthUserToDomain(response.user),
    token,
  }
}

export async function sendOtp(payload: SendOtpPayload) {
  return authRequest<OtpResponse>('/send-otp', {
    method: 'POST',
    payload: {
      email: payload.email,
    },
  })
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return authRequest<OtpResponse>('/verify-otp', {
    method: 'POST',
    payload: {
      email: payload.email,
      otp_code: payload.otp_code,
    },
  })
}

export async function getCurrentUser() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Sesi login tidak ditemukan.')
  }

  const response = await authRequest<AuthApiUser>('/me', {
    method: 'GET',
    token,
  })

  return mapAuthUserToDomain(response)
}

export async function logout() {
  const token = getAuthToken()

  if (!token) {
    clearAuthToken()
    return
  }

  try {
    await authRequest<{ message?: string }>('/logout', {
      method: 'POST',
      token,
    })
  } finally {
    clearAuthToken()
  }
}
