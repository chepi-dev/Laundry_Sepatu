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
    default:
      return 'Pending'
  }
}

function mapOrderDetail(detail: ApiOrderDetail): OrderDetail {
  return {
    id: detail.id,
    orderId: detail.order_id,
    layananId: detail.layanan_id,
    qty: detail.qty,
    harga: detail.harga,
    subtotal: detail.subtotal,
    layananNama: detail.layanan?.nama_layanan,
  }
}

function mapOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    userId: order.user_id,
    kodeOrder: order.kode_order,
    tanggalOrder: order.tanggal_order,
    status: mapOrderStatus(order.status),
    totalHarga: order.total_harga,
    alamatPickup: order.alamat_pickup,
    catatan: order.catatan ?? 'Tidak ada catatan tambahan.',
    estimasiSelesai: order.estimasi_selesai ?? order.tanggal_order,
    details: order.details.map(mapOrderDetail),
  }
}

export async function getCustomerOrders() {
  const response = await apiRequest<OrderListResponse>('/orders', {
    method: 'GET',
    token: getRequiredToken(),
  })

  return response.data.map(mapOrder)
}

export async function createCustomerOrder(payload: CreateOrderPayload) {
  const response = await apiRequest<CreateOrderResponse>('/orders', {
    method: 'POST',
    token: getRequiredToken(),
    payload,
  })

  return mapOrder(response.data)
}
