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
import type { CustomerDashboardData } from '../types/domain'

const mockUser: ApiUser = {
  id: 12,
  name: 'Rafi Pratama',
  email: 'rafi.pratama@mail.com',
  role: 'customer',
  no_hp: '+62 895-6201-73070',
  alamat: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
}

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
    user_id: 12,
    kode_order: 'SAC-240419-002',
    tanggal_order: '2026-04-19',
    status: 'Selesai',
    total_harga: 185000,
    alamat_pickup: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
    catatan: 'Tas warna krem, butuh repaint minor di sudut bawah.',
    estimasi_selesai: '2026-04-22',
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
    bukti_pembayaran: '',
  },
  {
    id: 2,
    order_id: 102,
    metode_pembayaran: 'QRIS',
    status: 'Lunas',
    jumlah_bayar: 185000,
    tanggal_bayar: '2026-04-19',
    rekening_tujuan: '1234567890',
    nama_bank: 'BCA a.n. Shoes and Care',
    bukti_pembayaran: 'bukti-transfer-102.jpg',
  },
]

export const customerDashboardMock: CustomerDashboardData = {
  user: mapUserApiToModel(mockUser),
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
