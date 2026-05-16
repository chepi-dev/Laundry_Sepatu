import { apiRequest } from '../../../lib/apiClient'
import type { AdminDashboardData, Payment, PaymentStatus, User } from '../../../types/domain'
import { getCurrentUser } from '../../auth/api/auth.api'
import type { AuthApiUser } from '../../auth/api/auth.types'
import { getAuthToken } from '../../auth/lib/session'
import { mapOrder } from '../../customer-dashboard/api/orders.api'
import type { ApiOrder } from '../../customer-dashboard/api/orders.types'
import { getServices } from '../../services/api/services.api'

type ApiAdminCustomer = Partial<AuthApiUser> & {
  nama_pelanggan?: string | null
  customer_name?: string | null
  customer_no_hp?: string | null
}

type ApiAdminOrder = ApiOrder & {
  user?: AuthApiUser | null
  customer?: ApiAdminCustomer | null
  nama_pelanggan?: string | null
  customer_name?: string | null
  no_hp?: string | null
  customer_no_hp?: string | null
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
  customer?: ApiAdminCustomer | null
  nama_pelanggan?: string | null
  customer_name?: string | null
  no_hp?: string | null
  customer_no_hp?: string | null
}

type AdminDashboardRequestOptions = {
  includeCustomers?: boolean
  includeOrders?: boolean
  includePayments?: boolean
  includeServices?: boolean
}

type AdminWalkInOrderPayload =
  | {
      customer_id: number
      layanan_id: number
      qty: number
      alamat_pickup: string
      catatan?: string
    }
  | {
      name: string
      no_hp: string
      email: string
      alamat: string
      layanan_id: number
      qty: number
      catatan?: string
    }

type AdminWalkInOrderResponse = {
  message?: string
  data?: ApiAdminOrder
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
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    noHp: user.no_hp ?? '-',
    alamat: user.alamat ?? '-',
  }
}

function mapAdminCustomer(customer: ApiAdminCustomer, fallbackUserId: number): User | null {
  const name = customer.name ?? customer.customer_name ?? customer.nama_pelanggan ?? ''
  const noHp = customer.no_hp ?? customer.customer_no_hp ?? ''

  if (!name && !noHp && !customer.email) {
    return null
  }

  return {
    id: Number(customer.id ?? fallbackUserId),
    name: name || 'Pelanggan',
    email: customer.email ?? '-',
    role: customer.role ?? 'customer',
    noHp: noHp || '-',
    alamat: customer.alamat ?? '-',
  }
}

function getUniqueCustomers(orders: ApiAdminOrder[]) {
  const customers = new Map<number, User>()

  orders.forEach((order) => {
    if (order.user) {
      customers.set(order.user.id, mapApiUser(order.user))
      return
    }

    const mappedCustomer = mapAdminCustomer(
      order.customer ?? {
        id: order.user_id,
        name: order.customer_name ?? order.nama_pelanggan ?? undefined,
        no_hp: order.no_hp ?? order.customer_no_hp ?? undefined,
      },
      Number(order.user_id),
    )

    if (mappedCustomer) {
      customers.set(mappedCustomer.id, mappedCustomer)
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
    id: Number(payment.id),
    orderId: Number(payment.order_id),
    metodePembayaran: payment.metode_pembayaran,
    status: mapPaymentStatus(payment.status),
    jumlahBayar: Number(payment.jumlah_bayar),
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

  await apiRequest(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    token: getRequiredToken(),
    payload: {
      status: 'diproses',
    },
  })

  return getAdminDashboardData(options)
}

export async function createAdminWalkInOrder(payload: AdminWalkInOrderPayload) {
  return apiRequest<AdminWalkInOrderResponse>('/admin/walk-in-orders', {
    method: 'POST',
    token: getRequiredToken(),
    payload,
  })
}
