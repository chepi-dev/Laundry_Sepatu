import { apiRequest } from '../../../lib/apiClient'
import type { AdminDashboardData, Payment, PaymentStatus, User } from '../../../types/domain'
import { getCurrentUser } from '../../auth/api/auth.api'
import type { AuthApiUser } from '../../auth/api/auth.types'
import { getAuthToken } from '../../auth/lib/session'
import { mapOrder } from '../../customer-dashboard/api/orders.api'
import type { ApiOrder } from '../../customer-dashboard/api/orders.types'
import { getServices } from '../../services/api/services.api'

type ApiAdminOrder = ApiOrder & {
  user?: AuthApiUser | null
  pembayaran?: ApiAdminPayment | null
}

type AdminOrderListResponse = {
  data: ApiAdminOrder[]
  message?: string
}

type AdminCustomerListResponse = {
  data: AuthApiUser[]
  message?: string
}

type ApiAdminPayment = {
  id: number
  order_id: number
  metode_pembayaran: string
  status: string
  jumlah_bayar: number
  tanggal_bayar?: string | null
  bukti_pembayaran?: string | null
  bukti_pembayaran_url?: string | null
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
    if (order.user) {
      customers.set(order.user.id, mapApiUser(order.user))
    }
  })

  return Array.from(customers.values())
}

function mapPaymentStatus(status: string): PaymentStatus {
  switch (status.toLowerCase()) {
    case 'lunas':
      return 'Lunas'
    case 'gagal':
      return 'Gagal'
    case 'pending':
    default:
      return 'Menunggu Verifikasi'
  }
}

function mapAdminPayment(payment: ApiAdminPayment): Payment {
  return {
    id: payment.id,
    orderId: payment.order_id,
    metodePembayaran: payment.metode_pembayaran,
    status: mapPaymentStatus(payment.status),
    jumlahBayar: payment.jumlah_bayar,
    tanggalBayar: payment.tanggal_bayar ?? '',
    rekeningTujuan: '1234567890',
    namaBank: 'BCA a.n. Shoes and Care',
    buktiPembayaran: payment.bukti_pembayaran_url ?? payment.bukti_pembayaran ?? '',
  }
}

async function getAdminOrders() {
  const response = await apiRequest<AdminOrderListResponse>('/admin/orders', {
    method: 'GET',
    token: getRequiredToken(),
  })

  return response.data
}

function getAdminPaymentsFromOrders(orders: ApiAdminOrder[]) {
  return orders
    .map((order) => order.pembayaran)
    .filter((payment): payment is ApiAdminPayment => Boolean(payment))
    .map(mapAdminPayment)
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
  const includePayments = options.includePayments ?? false // Default false untuk dashboard utama
  const includeServices = options.includeServices ?? true
  const [admin, services, adminOrders, customers] = await Promise.all([
    getCurrentUser(),
    includeServices ? getServices() : Promise.resolve([]),
    includeOrders ? getAdminOrders() : Promise.resolve([]),
    includeCustomers ? getAdminCustomers() : Promise.resolve([]),
  ])
  const payments = includePayments && includeOrders
    ? getAdminPaymentsFromOrders(adminOrders)
    : []

  return {
    admin,
    services,
    customers: includeCustomers ? customers : getUniqueCustomers(adminOrders),
    orders: adminOrders.map(mapOrder),
    payments,
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
