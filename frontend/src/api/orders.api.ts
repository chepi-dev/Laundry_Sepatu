// API-INTEGRATION:
// File ini sudah disesuaikan dengan route Laravel:
// GET /orders, GET /orders/{id}, POST /orders
// GET /admin/orders, PATCH /admin/orders/{id}/status

import { apiRequest } from './http'
import type {
  ApiCreateOrderPayload,
  ApiOrder,
  ApiUpdateOrderStatusPayload,
} from '../types/api'

export function getOrders() {
  return apiRequest<ApiOrder[]>('/orders')
}

export function getOrderById(orderId: number) {
  return apiRequest<ApiOrder>(`/orders/${orderId}`)
}

export function createOrder(payload: ApiCreateOrderPayload) {
  return apiRequest<ApiOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getAdminOrders() {
  return apiRequest<ApiOrder[]>('/admin/orders')
}

export function updateAdminOrderStatus(
  orderId: number,
  payload: ApiUpdateOrderStatusPayload,
) {
  return apiRequest<ApiOrder>(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
