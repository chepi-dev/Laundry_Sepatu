// API-INTEGRATION:
// File ini adalah titik utama untuk koneksi HTTP ke Laravel.
// Asumsi: route yang dibagikan user ada di `routes/api.php`,
// sehingga base URL default-nya menjadi `http://127.0.0.1:8000/api`.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'
const AUTH_TOKEN_KEY = 'laundry_auth_token'

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function apiRequest<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
