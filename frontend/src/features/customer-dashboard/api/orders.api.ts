import { apiRequest } from '../../../lib/apiClient'
import type { Order, OrderDetail, OrderStatus } from '../../../types/domain'
import { getAuthToken } from '../../auth/lib/session'
import type {
  ApiOrder,
  ApiOrderDetail,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderListResponse,
} from './orders.types'

function getRequiredToken() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Sesi login tidak ditemukan.')
  }

  return token
}

function mapOrderStatus(status: string): OrderStatus {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending'
    case 'diproses':
      return 'Diproses'
    case 'pickup':
      return 'Pickup'
    case 'dicuci':
      return 'Dicuci'
    case 'selesai':
      return 'Selesai'
    case 'diambil':
      return 'Diambil'
    case 'dibatalkan':
      return 'Dibatalkan'
    default:
      return 'Pending'
  }
}

function mapOrderDetail(detail: ApiOrderDetail): OrderDetail {
  return {
    id: Number(detail.id),
    orderId: Number(detail.order_id),
    layananId: Number(detail.layanan_id),
    qty: Number(detail.qty),
    harga: Number(detail.harga),
    subtotal: Number(detail.subtotal),
    layananNama: detail.layanan?.nama_layanan,
  }
}

export function mapOrder(order: ApiOrder): Order {
  return {
    id: Number(order.id),
    userId: Number(order.user_id),
    kodeOrder: order.kode_order,
    tanggalOrder: order.tanggal_order,
    status: mapOrderStatus(order.status),
    totalHarga: Number(order.total_harga),
    alamatPickup: order.alamat_pickup,
    catatan: order.catatan ?? 'Tidak ada catatan tambahan.',
    estimasiSelesai: order.estimasi_selesai ?? order.tanggal_order,
    details: order.details.map(mapOrderDetail),
  }
}

let cachedCustomerOrders: Order[] | null = null
let cachedCustomerOrdersPromise: Promise<Order[]> | null = null

export function clearCustomerOrdersCache() {
  cachedCustomerOrders = null
  cachedCustomerOrdersPromise = null
}

export async function getCustomerOrders() {
  if (cachedCustomerOrders) {
    return cachedCustomerOrders
  }

  if (cachedCustomerOrdersPromise) {
    return cachedCustomerOrdersPromise
  }

  cachedCustomerOrdersPromise = apiRequest<OrderListResponse>('/orders', {
    method: 'GET',
    token: getRequiredToken(),
  })
    .then((response) => {
      cachedCustomerOrders = response.data.map(mapOrder)
      return cachedCustomerOrders
    })
    .catch((error) => {
      cachedCustomerOrdersPromise = null
      throw error
    })

  return cachedCustomerOrdersPromise
}

export async function createCustomerOrder(payload: CreateOrderPayload) {
  const response = await apiRequest<CreateOrderResponse>('/orders', {
    method: 'POST',
    token: getRequiredToken(),
    payload,
  })

  clearCustomerOrdersCache()
  return mapOrder(response.data)
}
