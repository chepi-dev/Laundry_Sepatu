// API-INTEGRATION:
// File ini memetakan field Laravel (snake_case) ke format React (camelCase).
// Kalau response backend berubah, cukup rapikan mapper di sini tanpa membongkar UI.

import type {
  ApiOrder,
  ApiOrderDetail,
  ApiPayment,
  ApiService,
  ApiUser,
} from '../types/api'
import type { Order, OrderDetail, Payment, Service, User } from '../types/domain'

export function mapUserApiToModel(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    noHp: user.no_hp,
    alamat: user.alamat,
  }
}

export function mapServiceApiToModel(service: ApiService): Service {
  return {
    id: service.id,
    namaLayanan:
      (service as ApiService & { namaLayanan?: string }).namaLayanan ??
      service.nama_layanan,
    harga: service.harga,
    deskripsi: service.deskripsi,
  }
}

export function mapOrderDetailApiToModel(detail: ApiOrderDetail): OrderDetail {
  return {
    id: detail.id,
    orderId: detail.order_id,
    layananId: detail.layanan_id,
    qty: detail.qty,
    harga: detail.harga,
    subtotal: detail.subtotal,
  }
}

export function mapOrderApiToModel(
  order: ApiOrder,
  details: OrderDetail[],
): Order {
  return {
    id: order.id,
    userId: order.user_id,
    kodeOrder: order.kode_order,
    tanggalOrder: order.tanggal_order,
    status: order.status,
    totalHarga: order.total_harga,
    alamatPickup: order.alamat_pickup,
    catatan: order.catatan,
    estimasiSelesai: order.estimasi_selesai,
    details,
  }
}

export function mapPaymentApiToModel(payment: ApiPayment): Payment {
  return {
    id: payment.id,
    orderId: payment.order_id,
    metodePembayaran: payment.metode_pembayaran,
    status: payment.status,
    jumlahBayar: payment.jumlah_bayar,
    tanggalBayar: payment.tanggal_bayar,
    rekeningTujuan: payment.rekening_tujuan,
    namaBank: payment.nama_bank,
    buktiPembayaran: payment.bukti_pembayaran,
  }
}
