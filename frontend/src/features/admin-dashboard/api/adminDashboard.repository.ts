import { apiRequest } from '../../../lib/apiClient'
import type { AdminDashboardData, User } from '../../../types/domain'
import { getCurrentUser } from '../../auth/api/auth.api'
import type { AuthApiUser } from '../../auth/api/auth.types'
import { getAuthToken } from '../../auth/lib/session'
import { mapOrder } from '../../customer-dashboard/api/orders.api'
import type { ApiOrder } from '../../customer-dashboard/api/orders.types'
import { getPaymentByOrderId } from '../../customer-dashboard/api/payments.api'
import { getServices } from '../../services/api/services.api'

type ApiAdminOrder = ApiOrder & {
  user?: AuthApiUser | null
}

type AdminOrderListResponse = {
  data: ApiAdminOrder[]
  message?: string
}

type AdminCustomerListResponse = {
  data: AuthApiUser[]
  message?: string
}

type AdminDashboardRequestOptions = {
  includeCustomers?: boolean
  includeOrders?: boolean
  includePayments?: boolean
  includeServices?: boolean
}

function getRequiredToken() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Sesi login tidak ditemukan.')
  }

  return token
}

function mapApiUser(user: AuthApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    noHp: user.no_hp ?? '-',
    alamat: user.alamat ?? '-',
  }
}

function getUniqueCustomers(orders: ApiAdminOrder[]) {
  const customers = new Map<number, User>()

  orders.forEach((order) => {
    if (!order.user || order.user.role !== 'customer') {
      return
    }

    customers.set(order.user.id, mapApiUser(order.user))
  })

  return Array.from(customers.values())
}

async function getAdminOrders() {
  const response = await apiRequest<AdminOrderListResponse>('/admin/orders', {
    method: 'GET',
    token: getRequiredToken(),
  })

  return response.data
}

export async function getAdminCustomers() {
  const response = await apiRequest<AdminCustomerListResponse>('/admin/customers', {
    method: 'GET',
    token: getRequiredToken(),
  })

  return response.data.map(mapApiUser)
}

export async function getAdminDashboardData(
  options: AdminDashboardRequestOptions = {},
): Promise<AdminDashboardData> {
  const includeCustomers = options.includeCustomers ?? true
  const includeOrders = options.includeOrders ?? true
  const includePayments = options.includePayments ?? true
  const includeServices = options.includeServices ?? true
  const [admin, services, adminOrders, customers] = await Promise.all([
    getCurrentUser(),
    includeServices ? getServices() : Promise.resolve([]),
    includeOrders ? getAdminOrders() : Promise.resolve([]),
    includeCustomers ? getAdminCustomers() : Promise.resolve([]),
  ])
  const payments = includePayments && includeOrders
    ? await Promise.all(adminOrders.map((order) => getPaymentByOrderId(order.id)))
    : []

  return {
    admin,
    services,
    customers: includeCustomers ? customers : getUniqueCustomers(adminOrders),
    orders: adminOrders.map(mapOrder),
    payments: payments.filter((payment) => payment !== null),
  }
}

export async function completeAdminOrder(
  orderId: number,
  options?: AdminDashboardRequestOptions,
) {
  await apiRequest(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    token: getRequiredToken(),
    payload: {
      status: 'selesai',
    },
  })

  return getAdminDashboardData(options)
}

export async function verifyAdminPayment(
  orderId: number,
  options?: AdminDashboardRequestOptions,
) {
  await apiRequest(`/admin/orders/${orderId}/pembayaran/status`, {
    method: 'PATCH',
    token: getRequiredToken(),
    payload: {
      status: 'lunas',
    },
  })

  return getAdminDashboardData(options)
}
