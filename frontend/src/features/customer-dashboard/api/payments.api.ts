import { ApiRequestError, apiRequest } from '../../../lib/apiClient'
import type { Payment, PaymentStatus } from '../../../types/domain'
import { getAuthToken } from '../../auth/lib/session'
import type { ApiPayment, CreatePaymentPayload, PaymentResponse } from './payments.types'

const BANK_ACCOUNT_NAME = 'BCA a.n. Shoes and Care'
const BANK_ACCOUNT_NUMBER = '1234567890'

function getRequiredToken() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Sesi login tidak ditemukan.')
  }

  return token
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

function mapPayment(payment: ApiPayment): Payment {
  return {
    id: payment.id,
    orderId: payment.order_id,
    metodePembayaran: payment.metode_pembayaran,
    status: mapPaymentStatus(payment.status),
    jumlahBayar: payment.jumlah_bayar,
    tanggalBayar: payment.tanggal_bayar ?? '',
    rekeningTujuan: BANK_ACCOUNT_NUMBER,
    namaBank: BANK_ACCOUNT_NAME,
    buktiPembayaran: payment.bukti_pembayaran_url ?? payment.bukti_pembayaran ?? '',
  }
}

export async function getPaymentByOrderId(orderId: number) {
  try {
    const response = await apiRequest<PaymentResponse>(`/orders/${orderId}/pembayaran`, {
      method: 'GET',
      token: getRequiredToken(),
    })

    if (!response || !response.data) {
      return null
    }

    return mapPayment(response.data)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null
    }

    throw error
  }
}

export async function createPaymentByOrderId(orderId: number, payload: CreatePaymentPayload) {
  const formData = new FormData()
  formData.set('metode_pembayaran', payload.metode_pembayaran)

  if (payload.bukti_pembayaran) {
    formData.set('bukti_pembayaran', payload.bukti_pembayaran)
  }

  const response = await apiRequest<PaymentResponse>(`/orders/${orderId}/pembayaran`, {
    method: 'POST',
    token: getRequiredToken(),
    payload: formData,
  })

  return mapPayment(response.data)
}
