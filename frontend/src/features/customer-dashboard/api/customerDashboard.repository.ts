import type { CustomerDashboardData } from '../../../types/domain'
import { getCurrentUser } from '../../auth/api/auth.api'
import { clearCustomerOrdersCache, getCustomerOrders } from './orders.api'
import { getPaymentByOrderId } from './payments.api'
import { getServices } from '../../services/api/services.api'

type CustomerDashboardRequestOptions = {
  includePayments?: boolean
}

const cachedDashboardData = new Map<boolean, CustomerDashboardData>()
const cachedDashboardDataPromise = new Map<boolean, Promise<CustomerDashboardData>>()

// API-INTEGRATION:
// Customer dashboard sekarang mengambil:
// - user dari endpoint auth `/me` (cached)
// - order dari endpoint customer `/orders`
// - service dari endpoint `/layanan`
// - payment hanya diambil saat halaman memang membutuhkannya
export async function getCustomerDashboardData(
  options: CustomerDashboardRequestOptions = {},
): Promise<CustomerDashboardData> {
  const includePayments = options.includePayments ?? true
  const cachedData = cachedDashboardData.get(includePayments)

  if (cachedData) {
    return cachedData
  }

  const cachedPromise = cachedDashboardDataPromise.get(includePayments)

  if (cachedPromise) {
    return cachedPromise
  }

  const dashboardDataPromise = (async () => {
    const [user, orders, services] = await Promise.all([
      getCurrentUser(),
      getCustomerOrders(),
      getServices(),
    ])

    const payments = includePayments
      ? await Promise.all(orders.map((order) => getPaymentByOrderId(order.id)))
      : []

    const result = {
      user,
      services,
      orders,
      payments: payments.filter((payment) => payment !== null),
    }

    cachedDashboardData.set(includePayments, result)
    return result
  })()
    .catch((error) => {
      cachedDashboardDataPromise.delete(includePayments)
      throw error
    })

  cachedDashboardDataPromise.set(includePayments, dashboardDataPromise)

  return dashboardDataPromise
}

export function clearCustomerDashboardCache() {
  cachedDashboardData.clear()
  cachedDashboardDataPromise.clear()
  clearCustomerOrdersCache()
}
