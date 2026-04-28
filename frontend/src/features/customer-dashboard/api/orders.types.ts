type ApiOrderService = {
  id: number
  nama_layanan: string
  harga: number
  deskripsi: string
}

export type ApiOrderDetail = {
  id: number
  order_id: number
  layanan_id: number
  qty: number
  harga: number
  subtotal: number
  layanan?: ApiOrderService
}

export type ApiOrder = {
  id: number
  user_id: number
  kode_order: string
  tanggal_order: string
  status: string
  total_harga: number
  alamat_pickup: string
  catatan: string | null
  estimasi_selesai: string | null
  details: ApiOrderDetail[]
}

export type OrderListResponse = {
  data: ApiOrder[]
  success?: boolean
}

export type CreateOrderPayload = {
  alamat_pickup: string
  catatan?: string
  estimasi_selesai?: string
  layanans: Array<{
    layanan_id: number
    qty: number
  }>
}

export type CreateOrderResponse = {
  success?: boolean
  message?: string
  data: ApiOrder
}
