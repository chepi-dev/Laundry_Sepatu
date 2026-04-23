// API-INTEGRATION:
// Endpoint auth di file ini sudah disesuaikan dengan route Laravel user.
// Catatan: route `/login` saat ini menggunakan GET sesuai route yang diberikan.

import { apiRequest, clearAuthToken, setAuthToken } from './http'
import type {
  ApiAuthResponse,
  ApiLoginPayload,
  ApiRegisterPayload,
  ApiUser,
} from '../types/api'

export function login(payload: ApiLoginPayload) {
  const params = new URLSearchParams({
    email: payload.email,
    password: payload.password,
  })

  return apiRequest<ApiAuthResponse>(`/login?${params.toString()}`, {
    method: 'GET',
  }).then(async (response) => {
    const token = response.access_token ?? response.token

    if (token) {
      setAuthToken(token)
    }

    const user = response.user ?? (await getCurrentUser())

    return {
      ...response,
      user,
    }
  })
}

export function register(payload: ApiRegisterPayload) {
  return apiRequest<ApiAuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((response) => {
    const token = response.access_token ?? response.token

    if (token) {
      setAuthToken(token)
    }

    return response
  })
}

export function getCurrentUser() {
  return apiRequest<ApiUser>('/me')
}

export function logout() {
  return apiRequest<{ message?: string }>('/logout', {
    method: 'POST',
  }).then((response) => {
    clearAuthToken()
    return response
  })
}
