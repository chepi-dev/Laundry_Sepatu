export type ApiPayment = {
  id: number
  order_id: number
  metode_pembayaran: string
  status: string
  jumlah_bayar: number
  bukti_pembayaran?: string | null
  bukti_pembayaran_url?: string | null
  tanggal_bayar?: string | null
}

export type PaymentResponse = {
  message?: string
  data: ApiPayment
}

export type CreatePaymentPayload = {
  metode_pembayaran: string
  bukti_pembayaran?: File
}
