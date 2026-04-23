// API-INTEGRATION:
// Repository ini adalah pintu masuk data untuk dashboard admin.
// Saat Laravel siap, file ini bisa mengambil dan menggabungkan data
// `users`, `orders`, `order_details`, `layanans`, dan `pembayarans`
// lalu menyajikannya ke UI admin dengan bentuk yang stabil.

import { adminDashboardMock } from '../../../mocks/adminDashboard.mock'
import type { AdminDashboardData, OrderStatus, Service, User } from '../../../types/domain'

type WalkInOrderInput = {
  name: string
  email: string
  noHp: string
  alamat: string
  catatan: string
  layananId: number
  qty: number
}

let adminDashboardState: AdminDashboardData = adminDashboardMock

export function getAdminDashboardData(): AdminDashboardData {
  return adminDashboardState
}

export function completeAdminOrder(orderId: number) {
  adminDashboardState = {
    ...adminDashboardState,
    orders: adminDashboardState.orders.map((order) =>
      order.id === orderId ? { ...order, status: 'Selesai' } : order,
    ),
  }

  return adminDashboardState
}

export function verifyAdminPayment(paymentId: number) {
  adminDashboardState = {
    ...adminDashboardState,
    payments: adminDashboardState.payments.map((payment) =>
      payment.id === paymentId ? { ...payment, status: 'Lunas' } : payment,
    ),
  }

  return adminDashboardState
}

export function saveAdminService(input: Omit<Service, 'id'> & { id?: number | null }) {
  const nextService: Service = {
    id: input.id ?? Date.now(),
    namaLayanan: input.namaLayanan,
    harga: input.harga,
    deskripsi: input.deskripsi,
  }

  const serviceExists = input.id !== null && input.id !== undefined

  adminDashboardState = {
    ...adminDashboardState,
    services: serviceExists
      ? adminDashboardState.services.map((service) =>
          service.id === input.id ? nextService : service,
        )
      : [nextService, ...adminDashboardState.services],
  }

  return adminDashboardState
}

export function deleteAdminService(serviceId: number) {
  adminDashboardState = {
    ...adminDashboardState,
    services: adminDashboardState.services.filter((service) => service.id !== serviceId),
  }

  return adminDashboardState
}

export function createWalkInAdminOrder(input: WalkInOrderInput) {
  const existingCustomer =
    adminDashboardState.customers.find(
      (customer) => customer.email === input.email || customer.noHp === input.noHp,
    ) ?? null

  const selectedService =
    adminDashboardState.services.find((service) => service.id === input.layananId) ?? null

  if (!selectedService) {
    return adminDashboardState
  }

  const now = new Date()
  const estimated = new Date(now)
  estimated.setDate(now.getDate() + 2)

  const nextCustomerId = existingCustomer?.id ?? Date.now()
  const nextOrderId = nextCustomerId + 1
  const nextPaymentId = nextCustomerId + 2
  const totalHarga = selectedService.harga * input.qty

  const nextCustomer: User = existingCustomer ?? {
    id: nextCustomerId,
    name: input.name,
    email: input.email || `walkin${nextCustomerId}@local.customer`,
    role: 'customer',
    noHp: input.noHp,
    alamat: input.alamat || 'Datang langsung ke toko',
  }

  const nextOrders = [
    {
      id: nextOrderId,
      userId: nextCustomerId,
      kodeOrder: `SAC-CASH-${String(nextOrderId).slice(-6)}`,
      tanggalOrder: now.toISOString(),
      status: 'Diproses' as OrderStatus,
      totalHarga,
      alamatPickup: input.alamat || 'Datang langsung ke toko',
      catatan:
        input.catatan ||
        `Customer datang langsung ke toko dan memilih layanan ${selectedService.namaLayanan}.`,
      estimasiSelesai: estimated.toISOString(),
      details: [
        {
          id: nextOrderId + 10,
          orderId: nextOrderId,
          layananId: selectedService.id,
          qty: input.qty,
          harga: selectedService.harga,
          subtotal: totalHarga,
        },
      ],
    },
    ...adminDashboardState.orders,
  ]

  const nextPayments = [
    {
      id: nextPaymentId,
      orderId: nextOrderId,
      metodePembayaran: 'Cash',
      status: 'Lunas' as const,
      jumlahBayar: totalHarga,
      tanggalBayar: now.toISOString(),
      rekeningTujuan: 'Pembayaran langsung di kasir',
      namaBank: 'Cash toko',
      buktiPembayaran: 'Pembayaran cash diterima admin',
    },
    ...adminDashboardState.payments,
  ]

  adminDashboardState = {
    ...adminDashboardState,
    customers: existingCustomer
      ? adminDashboardState.customers
      : [nextCustomer, ...adminDashboardState.customers],
    orders: nextOrders,
    payments: nextPayments,
  }

  return adminDashboardState
}
