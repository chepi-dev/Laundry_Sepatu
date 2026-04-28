const DEFAULT_API_BASE_URL = 'http://localhost:8000/api'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type PrimitiveValue = string | number | boolean | null | undefined
type RequestPayload =
  | Record<string, PrimitiveValue>
  | Record<string, PrimitiveValue | PrimitiveValue[] | Record<string, PrimitiveValue>[]>

type RequestOptions = {
  method?: RequestMethod
  payload?: RequestPayload
  token?: string | null
}

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', payload, token } = options
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const requestInit: RequestInit = {
    method,
    headers,
  }

  let requestUrl = `${getApiBaseUrl()}${path}`

  if (method === 'GET' && payload) {
    const query = new URLSearchParams()

    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return
      }

      query.set(key, String(value))
    })

    requestUrl = `${requestUrl}?${query.toString()}`
  }

  if ((method === 'POST' || method === 'PUT') && payload) {
    headers.set('Content-Type', 'application/json')
    requestInit.body = JSON.stringify(payload)
  }

  const response = await fetch(requestUrl, requestInit)
  const rawText = await response.text()
  const data = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {}

  if (!response.ok) {
    const errorMessage =
      typeof data.message === 'string'
        ? data.message
        : typeof data.massage === 'string'
          ? data.massage
          : 'Permintaan ke server gagal diproses.'

    throw new ApiRequestError(errorMessage, response.status)
  }

  return data as T
}
