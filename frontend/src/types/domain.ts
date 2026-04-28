export type UserRole = 'customer' | 'admin'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  noHp: string
  alamat: string
}

export type Service = {
  id: number
  namaLayanan: string
  harga: number
  deskripsi: string
}

export type OrderDetail = {
  id: number
  orderId: number
  layananId: number
  qty: number
  harga: number
  subtotal: number
  layananNama?: string
}

export type OrderStatus = 'Pending' | 'Diproses' | 'Pickup' | 'Dicuci' | 'Selesai'

export type Order = {
  id: number
  userId: number
  kodeOrder: string
  tanggalOrder: string
  status: OrderStatus
  totalHarga: number
  alamatPickup: string
  catatan: string
  estimasiSelesai: string
  details: OrderDetail[]
}

export type PaymentStatus = 'Lunas' | 'Menunggu Verifikasi' | 'Gagal'

export type Payment = {
  id: number
  orderId: number
  metodePembayaran: string
  status: PaymentStatus
  jumlahBayar: number
  tanggalBayar: string
  rekeningTujuan: string
  namaBank: string
  buktiPembayaran?: string
}

export type CustomerDashboardData = {
  user: User
  services: Service[]
  orders: Order[]
  payments: Payment[]
}

export type AdminDashboardData = {
  admin: User
  customers: User[]
  services: Service[]
  orders: Order[]
  payments: Payment[]
}
