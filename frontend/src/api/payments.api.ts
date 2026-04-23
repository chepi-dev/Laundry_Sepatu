// API-INTEGRATION:
// File ini sudah disesuaikan dengan route Laravel:
// POST /orders/{orderId}/pembayaran
// GET /orders/{orderId}/pembayaran
// PATCH /admin/orders/{orderId}/pembayaran/status

import { apiRequest } from './http'
import type {
  ApiCreatePaymentPayload,
  ApiPayment,
  ApiUpdatePaymentStatusPayload,
} from '../types/api'

export function createPayment(orderId: number, payload: ApiCreatePaymentPayload) {
  return apiRequest<ApiPayment>(`/orders/${orderId}/pembayaran`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getPaymentByOrder(orderId: number) {
  return apiRequest<ApiPayment>(`/orders/${orderId}/pembayaran`)
}

export function updateAdminPaymentStatus(
  orderId: number,
  payload: ApiUpdatePaymentStatusPayload,
) {
  return apiRequest<ApiPayment>(`/admin/orders/${orderId}/pembayaran/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
