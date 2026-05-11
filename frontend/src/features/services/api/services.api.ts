import { apiRequest } from '../../../lib/apiClient'
import type { Service } from '../../../types/domain'
import { getAuthToken } from '../../auth/lib/session'
import type {
  ApiService,
  ServiceDetailResponse,
  ServiceListResponse,
  ServicePayload,
} from './services.types'

function mapService(service: ApiService): Service {
  return {
    id: service.id,
    namaLayanan: service.nama_layanan,
    harga: Number(service.harga) || 0,
    deskripsi: service.deskripsi ?? '',
  }
}

let cachedServices: Service[] | null = null
let cachedServicesPromise: Promise<Service[]> | null = null

function getRequiredToken() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Sesi login tidak ditemukan.')
  }

  return token
}

export async function getServices() {
  if (cachedServices) {
    return cachedServices
  }

  if (cachedServicesPromise) {
    return cachedServicesPromise
  }

  cachedServicesPromise = apiRequest<ServiceListResponse>('/layanan', {
    method: 'GET',
  })
    .then((response) => {
      cachedServices = response.data.map(mapService)
      return cachedServices
    })
    .catch((error) => {
      cachedServicesPromise = null
      throw error
    })

  return cachedServicesPromise
}

export function clearServicesCache() {
  cachedServices = null
  cachedServicesPromise = null
}

export async function createService(payload: ServicePayload) {
  const response = await apiRequest<ServiceDetailResponse>('/layanan', {
    method: 'POST',
    token: getRequiredToken(),
    payload,
  })

  clearServicesCache()
  return mapService(response.data)
}

export async function updateService(serviceId: number, payload: ServicePayload) {
  const response = await apiRequest<ServiceDetailResponse>(`/layanan/${serviceId}`, {
    method: 'PUT',
    token: getRequiredToken(),
    payload,
  })

  clearServicesCache()
  return mapService(response.data)
}

export async function deleteService(serviceId: number) {
  await apiRequest<{ success?: boolean }>(`/layanan/${serviceId}`, {
    method: 'DELETE',
    token: getRequiredToken(),
  })

  clearServicesCache()
}
