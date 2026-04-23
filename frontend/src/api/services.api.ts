// API-INTEGRATION:
// File ini sudah disesuaikan dengan route Laravel:
// GET /layanan, GET /layanan/{id}, POST /layanan, PUT /layanan/{id}, DELETE /layanan/{id}

import { apiRequest } from './http'
import type { ApiService, ApiServicePayload } from '../types/api'

export function getServices() {
  return apiRequest<ApiService[]>('/layanan')
}

export function getServiceById(serviceId: number) {
  return apiRequest<ApiService>(`/layanan/${serviceId}`)
}

export function createService(payload: ApiServicePayload) {
  return apiRequest<ApiService>('/layanan', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateService(serviceId: number, payload: ApiServicePayload) {
  return apiRequest<ApiService>(`/layanan/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteService(serviceId: number) {
  return apiRequest<{ message?: string }>(`/layanan/${serviceId}`, {
    method: 'DELETE',
  })
}
