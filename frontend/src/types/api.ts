import type { OrderStatus, PaymentStatus, UserRole } from './domain'

export type ApiUser = {
  id: number
  name: string
  email: string
  password?: string
  role: UserRole
  no_hp: string
  alamat: string
}

export type ApiService = {
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
}

export type ApiOrder = {
  id: number
  user_id: number
  kode_order: string
  tanggal_order: string
  status: OrderStatus
  total_harga: number
  alamat_pickup: string
  catatan: string
  estimasi_selesai: string
}

export type ApiPayment = {
  id: number
  order_id: number
  metode_pembayaran: string
  status: PaymentStatus
  jumlah_bayar: number
  tanggal_bayar: string
  rekening_tujuan: string
  nama_bank: string
  bukti_pembayaran?: string
}

export type ApiLoginPayload = {
  email: string
  password: string
}

export type ApiRegisterPayload = {
  name: string
  email: string
  password: string
  no_hp: string
  alamat: string
  role?: UserRole
}

export type ApiForgotPasswordPayload = {
  email: string
}

export type ApiAuthResponse = {
  user: ApiUser
  access_token?: string
  token?: string
  token_type?: string
  message?: string
}

export type ApiServicePayload = {
  nama_layanan: string
  harga: number
  deskripsi: string
}

export type ApiCreateOrderPayload = {
  layanan_id: number
  qty: number
  alamat_pickup: string
  catatan: string
}

export type ApiCreatePaymentPayload = {
  metode_pembayaran: string
  jumlah_bayar: number
  bukti_pembayaran?: string
}

export type ApiUpdateOrderStatusPayload = {
  status: OrderStatus
}

export type ApiUpdatePaymentStatusPayload = {
  status: PaymentStatus
}
