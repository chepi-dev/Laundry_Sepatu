import {
  mapOrderApiToModel,
  mapOrderDetailApiToModel,
  mapPaymentApiToModel,
  mapServiceApiToModel,
  mapUserApiToModel,
} from '../api/mappers'
import type {
  ApiOrder,
  ApiOrderDetail,
  ApiPayment,
  ApiService,
  ApiUser,
} from '../types/api'
import type { AdminDashboardData } from '../types/domain'

const mockAdmin: ApiUser = {
  id: 1,
  name: 'Admin Shoes Care',
  email: 'admin@shoesandcare.id',
  role: 'admin',
  no_hp: '+62 811-2222-1111',
  alamat: 'Workshop Pusat, Yogyakarta',
}

const mockCustomers: ApiUser[] = [
  {
    id: 12,
    name: 'Rafi Pratama',
    email: 'rafi.pratama@mail.com',
    role: 'customer',
    no_hp: '+62 895-6201-73070',
    alamat: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
  },
  {
    id: 13,
    name: 'Nabila Putri',
    email: 'nabila.putri@mail.com',
    role: 'customer',
    no_hp: '+62 812-4455-7788',
    alamat: 'Jl. Gejayan, Sleman, Yogyakarta',
  },
  {
    id: 14,
    name: 'Yoga Saputra',
    email: 'yoga.saputra@mail.com',
    role: 'customer',
    no_hp: '+62 857-1900-4567',
    alamat: 'Jl. Magelang, Yogyakarta',
  },
]

const mockServices: ApiService[] = [
  {
    id: 1,
    nama_layanan: 'Deep Cleaning',
    harga: 50000,
    deskripsi: 'Pembersihan menyeluruh untuk upper, midsole, insole, dan area detail.',
  },
  {
    id: 2,
    nama_layanan: 'Unyellowing',
    harga: 100000,
    deskripsi: 'Perawatan khusus untuk mengurangi warna kuning pada midsole putih.',
  },
  {
    id: 3,
    nama_layanan: 'Repaint',
    harga: 185000,
    deskripsi: 'Pengecatan ulang dengan material khusus agar tampilan kembali segar.',
  },
  {
    id: 4,
    nama_layanan: 'Antar Jemput',
    harga: 0,
    deskripsi: 'Layanan pickup dan delivery untuk customer yang tidak sempat ke workshop.',
  },
]

const mockOrderDetails: ApiOrderDetail[] = [
  {
    id: 1,
    order_id: 101,
    layanan_id: 1,
    qty: 1,
    harga: 50000,
    subtotal: 50000,
  },
  {
    id: 2,
    order_id: 101,
    layanan_id: 2,
    qty: 1,
    harga: 100000,
    subtotal: 100000,
  },
  {
    id: 3,
    order_id: 102,
    layanan_id: 3,
    qty: 1,
    harga: 185000,
    subtotal: 185000,
  },
  {
    id: 4,
    order_id: 103,
    layanan_id: 1,
    qty: 2,
    harga: 50000,
    subtotal: 100000,
  },
]

const mockOrders: ApiOrder[] = [
  {
    id: 101,
    user_id: 12,
    kode_order: 'SAC-240423-001',
    tanggal_order: '2026-04-23',
    status: 'Dicuci',
    total_harga: 150000,
    alamat_pickup: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
    catatan: 'Sepatu putih, ada noda membandel di midsole kanan.',
    estimasi_selesai: '2026-04-25',
  },
  {
    id: 102,
    user_id: 13,
    kode_order: 'SAC-240422-002',
    tanggal_order: '2026-04-22',
    status: 'Diproses',
    total_harga: 185000,
    alamat_pickup: 'Jl. Gejayan, Sleman, Yogyakarta',
    catatan: 'Minta repaint warna tetap original.',
    estimasi_selesai: '2026-04-26',
  },
  {
    id: 103,
    user_id: 14,
    kode_order: 'SAC-240421-003',
    tanggal_order: '2026-04-21',
    status: 'Pickup',
    total_harga: 100000,
    alamat_pickup: 'Jl. Magelang, Yogyakarta',
    catatan: 'Butuh pickup sore hari.',
    estimasi_selesai: '2026-04-24',
  },
]

const mockPayments: ApiPayment[] = [
  {
    id: 1,
    order_id: 101,
    metode_pembayaran: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    jumlah_bayar: 150000,
    tanggal_bayar: '2026-04-23',
    rekening_tujuan: '1234567890',
    nama_bank: 'BCA a.n. Shoes and Care',
    bukti_pembayaran: 'bukti-101.jpg',
  },
  {
    id: 2,
    order_id: 102,
    metode_pembayaran: 'QRIS',
    status: 'Lunas',
    jumlah_bayar: 185000,
    tanggal_bayar: '2026-04-22',
    rekening_tujuan: '1234567890',
    nama_bank: 'BCA a.n. Shoes and Care',
    bukti_pembayaran: 'bukti-102.jpg',
  },
  {
    id: 3,
    order_id: 103,
    metode_pembayaran: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    jumlah_bayar: 100000,
    tanggal_bayar: '2026-04-21',
    rekening_tujuan: '1234567890',
    nama_bank: 'BCA a.n. Shoes and Care',
    bukti_pembayaran: 'bukti-103.jpg',
  },
]

export const adminDashboardMock: AdminDashboardData = {
  admin: mapUserApiToModel(mockAdmin),
  customers: mockCustomers.map(mapUserApiToModel),
  services: mockServices.map(mapServiceApiToModel),
  orders: mockOrders.map((order) =>
    mapOrderApiToModel(
      order,
      mockOrderDetails
        .filter((detail) => detail.order_id === order.id)
        .map(mapOrderDetailApiToModel),
    ),
  ),
  payments: mockPayments.map(mapPaymentApiToModel),
}
