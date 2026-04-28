import type { CustomerDashboardData } from '../../../types/domain'
import { getCurrentUser } from '../../auth/api/auth.api'
import { getCustomerOrders } from './orders.api'
import { getPaymentByOrderId } from './payments.api'
import { getServices } from '../../services/api/services.api'

// API-INTEGRATION:
// Customer dashboard sekarang mengambil:
// - user dari endpoint auth `/me`
// - order dari endpoint customer `/orders`
// - service masih dari mock sementara sampai endpoint layanan disambungkan
// - payment masih dari storage lokal sementara sampai endpoint pembayaran disambungkan
export async function getCustomerDashboardData(): Promise<CustomerDashboardData> {
  const [user, orders, services] = await Promise.all([
    getCurrentUser(),
    getCustomerOrders(),
    getServices(),
  ])
  const payments = await Promise.all(orders.map((order) => getPaymentByOrderId(order.id)))

  return {
    user,
    services,
    orders,
    payments: payments.filter((payment) => payment !== null),
  }
}
