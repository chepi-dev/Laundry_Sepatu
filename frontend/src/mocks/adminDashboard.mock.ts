import type {
  AdminDashboardData,
  Order,
  OrderDetail,
  Payment,
  Service,
  User,
} from '../types/domain'

const mockAdmin: User = {
  id: 1,
  name: 'Admin Shoes Care',
  email: 'admin@shoesandcare.id',
  role: 'admin',
  noHp: '+62 811-2222-1111',
  alamat: 'Workshop Pusat, Yogyakarta',
}

const mockCustomers: User[] = [
  {
    id: 12,
    name: 'Rafi Pratama',
    email: 'rafi.pratama@mail.com',
    role: 'customer',
    noHp: '+62 895-6201-73070',
    alamat: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
  },
  {
    id: 13,
    name: 'Nabila Putri',
    email: 'nabila.putri@mail.com',
    role: 'customer',
    noHp: '+62 812-4455-7788',
    alamat: 'Jl. Gejayan, Sleman, Yogyakarta',
  },
  {
    id: 14,
    name: 'Yoga Saputra',
    email: 'yoga.saputra@mail.com',
    role: 'customer',
    noHp: '+62 857-1900-4567',
    alamat: 'Jl. Magelang, Yogyakarta',
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    namaLayanan: 'Deep Cleaning',
    harga: 50000,
    deskripsi: 'Pembersihan menyeluruh untuk upper, midsole, insole, dan area detail.',
  },
  {
    id: 2,
    namaLayanan: 'Unyellowing',
    harga: 100000,
    deskripsi: 'Perawatan khusus untuk mengurangi warna kuning pada midsole putih.',
  },
  {
    id: 3,
    namaLayanan: 'Repaint',
    harga: 185000,
    deskripsi: 'Pengecatan ulang dengan material khusus agar tampilan kembali segar.',
  },
  {
    id: 4,
    namaLayanan: 'Antar Jemput',
    harga: 0,
    deskripsi: 'Layanan pickup dan delivery untuk customer yang tidak sempat ke workshop.',
  },
]

const mockOrderDetails: OrderDetail[] = [
  {
    id: 1,
    orderId: 101,
    layananId: 1,
    qty: 1,
    harga: 50000,
    subtotal: 50000,
  },
  {
    id: 2,
    orderId: 101,
    layananId: 2,
    qty: 1,
    harga: 100000,
    subtotal: 100000,
  },
  {
    id: 3,
    orderId: 102,
    layananId: 3,
    qty: 1,
    harga: 185000,
    subtotal: 185000,
  },
  {
    id: 4,
    orderId: 103,
    layananId: 1,
    qty: 2,
    harga: 50000,
    subtotal: 100000,
  },
]

const mockOrders: Omit<Order, 'details'>[] = [
  {
    id: 101,
    userId: 12,
    kodeOrder: 'SAC-240423-001',
    tanggalOrder: '2026-04-23',
    status: 'Dicuci',
    totalHarga: 150000,
    alamatPickup: 'Jl. Kaliurang Km 7, Sleman, Yogyakarta',
    catatan: 'Sepatu putih, ada noda membandel di midsole kanan.',
    estimasiSelesai: '2026-04-25',
  },
  {
    id: 102,
    userId: 13,
    kodeOrder: 'SAC-240422-002',
    tanggalOrder: '2026-04-22',
    status: 'Diproses',
    totalHarga: 185000,
    alamatPickup: 'Jl. Gejayan, Sleman, Yogyakarta',
    catatan: 'Minta repaint warna tetap original.',
    estimasiSelesai: '2026-04-26',
  },
  {
    id: 103,
    userId: 14,
    kodeOrder: 'SAC-240421-003',
    tanggalOrder: '2026-04-21',
    status: 'Pickup',
    totalHarga: 100000,
    alamatPickup: 'Jl. Magelang, Yogyakarta',
    catatan: 'Butuh pickup sore hari.',
    estimasiSelesai: '2026-04-24',
  },
]

const mockPayments: Payment[] = [
  {
    id: 1,
    orderId: 101,
    metodePembayaran: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    jumlahBayar: 150000,
    tanggalBayar: '2026-04-23',
    rekeningTujuan: '1234567890',
    namaBank: 'BCA a.n. Shoes and Care',
    buktiPembayaran: 'bukti-101.jpg',
  },
  {
    id: 2,
    orderId: 102,
    metodePembayaran: 'QRIS',
    status: 'Lunas',
    jumlahBayar: 185000,
    tanggalBayar: '2026-04-22',
    rekeningTujuan: '1234567890',
    namaBank: 'BCA a.n. Shoes and Care',
    buktiPembayaran: 'bukti-102.jpg',
  },
  {
    id: 3,
    orderId: 103,
    metodePembayaran: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    jumlahBayar: 100000,
    tanggalBayar: '2026-04-21',
    rekeningTujuan: '1234567890',
    namaBank: 'BCA a.n. Shoes and Care',
    buktiPembayaran: 'bukti-103.jpg',
  },
]

export const adminDashboardMock: AdminDashboardData = {
  admin: mockAdmin,
  customers: mockCustomers,
  services: mockServices,
  orders: mockOrders.map((order) => ({
    ...order,
    details: mockOrderDetails.filter((detail) => detail.orderId === order.id),
  })),
  payments: mockPayments,
}
