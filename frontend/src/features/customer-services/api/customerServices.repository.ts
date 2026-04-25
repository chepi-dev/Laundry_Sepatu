// API-INTEGRATION:
// Route backend yang sudah tersedia untuk halaman ini:
// GET /me
// GET /layanan

import { getCurrentUser } from '../../../api/auth.api'
import { mapServiceApiToModel, mapUserApiToModel } from '../../../api/mappers'
import { getCustomerDashboardData } from '../../customer-dashboard/api/customerDashboard.repository'
import {
  getLocalCustomerOrders,
  getLocalCustomerPayments,
} from '../lib/customerOrderFlow'
import { getServices } from '../../../api/services.api'
import type { ApiService } from '../../../types/api'

function normalizeServicesResponse(payload: unknown): ApiService[] {
  if (Array.isArray(payload)) {
    return payload as ApiService[]
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.data)) {
      return record.data as ApiService[]
    }

    if (Array.isArray(record.layanan)) {
      return record.layanan as ApiService[]
    }

    if (Array.isArray(record.services)) {
      return record.services as ApiService[]
    }
  }

  return []
}

export async function getCustomerServicesData() {
  const dashboardData = getCustomerDashboardData()
  const localOrders = getLocalCustomerOrders()
  const localPayments = getLocalCustomerPayments()
  const [user, services] = await Promise.all([getCurrentUser(), getServices()])
  const normalizedServices = normalizeServicesResponse(services)

  return {
    user: mapUserApiToModel(user),
    services: normalizedServices.map(mapServiceApiToModel),
    orders: [...localOrders, ...dashboardData.orders],
    payments: [...localPayments, ...dashboardData.payments],
  }
}
