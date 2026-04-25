import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData } from './api/adminDashboard.repository'
import type { AdminDashboardData } from '../../types/domain'

export function AdminDashboardPage() {
  const [adminData] = useState<AdminDashboardData>(() => getAdminDashboardData())
  const { admin, orders, payments } = adminData

  const activeOrders = orders.filter((order) => order.status !== 'Selesai')
  const pendingPayments = payments.filter(
    (payment) => payment.status === 'Menunggu Verifikasi',
  )
  const totalRevenue = payments
    .filter((payment) => payment.status === 'Lunas')
    .reduce((total, payment) => total + payment.jumlahBayar, 0)

  return (
    <div className="dashboard-page admin-dashboard-page">
      <header className="dashboard-navbar">
        <div className="dashboard-navbar__brand">
          <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
            <span>SHOES</span>
            <span>AND</span>
            <span>CARE</span>
          </a>

          <div className="dashboard-profile dashboard-profile--navbar">
            <h2>{admin.name}</h2>
          </div>
        </div>

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu dashboard admin">
          <a className="is-active" href="#/dashboard/admin">
            Ringkasan
          </a>
          <a href="#/dashboard/admin/orders">Order Masuk</a>
          <a href="#/dashboard/admin/payments">Verifikasi</a>
          <a href="#/dashboard/admin/services">Layanan</a>
          <a href="#/dashboard/admin/walk-in">Datang Langsung</a>
          <a href="#/dashboard/admin/customers">Pelanggan</a>
        </nav>

        <div className="dashboard-navbar__actions">
          <ActionButton href="#beranda" variant="light" small>
            Kembali ke Beranda
          </ActionButton>
          <ActionButton variant="dark" small onClick={() => void performLogout()}>
            Logout
          </ActionButton>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-hero admin-dashboard-hero admin-overview-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Dashboard Admin</p>
            <p>
              Halaman ringkasan ini difokuskan untuk melihat kondisi operasional utama,
              lalu admin bisa masuk ke halaman khusus untuk order, verifikasi, layanan,
              pelanggan, dan transaksi datang langsung.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin/payments" variant="gold" small>
              Tinjau Verifikasi
            </ActionButton>
            <ActionButton href="#/dashboard/admin/orders" variant="dark" small>
              Tinjau Pesanan
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Order Aktif</span>
            <strong>{activeOrders.length}</strong>
            <p>Total order yang masih berjalan dan perlu dipantau admin.</p>
          </article>
          <article className="dashboard-stat-card">
            <span>Pembayaran Pending</span>
            <strong>{pendingPayments.length}</strong>
            <p>Jumlah bukti transfer yang menunggu proses verifikasi.</p>
          </article>
          <article className="dashboard-stat-card">
            <span>Pendapatan Masuk</span>
            <strong>{formatRupiah(totalRevenue)}</strong>
            <p>Akumulasi pembayaran yang sudah berhasil terverifikasi.</p>
          </article>
        </section>

      
      </main>
    </div>
  )
}
