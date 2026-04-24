import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { completeAdminOrder, getAdminDashboardData } from './api/adminDashboard.repository'
import type { AdminDashboardData, User } from '../../types/domain'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getCustomerName(customers: User[], userId: number) {
  return customers.find((customer) => customer.id === userId)?.name ?? 'Pelanggan'
}

export function AdminOrdersPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData>(() => getAdminDashboardData())

  const latestOrders = [...adminData.orders].sort((a, b) =>
    b.tanggalOrder.localeCompare(a.tanggalOrder),
  )

  const handleCompleteOrder = (orderId: number) => {
    setAdminData(completeAdminOrder(orderId))
  }

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
            <h2>{adminData.admin.name}</h2>
          </div>
        </div>

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu dashboard admin">
          <a href="#/dashboard/admin">Ringkasan</a>
          <a className="is-active" href="#/dashboard/admin/orders">
            Order Masuk
          </a>
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
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Order Masuk</p>
            <p>
              Kelola seluruh antrian pengerjaan customer dalam halaman khusus agar
              monitoring order lebih fokus dan tidak bercampur dengan panel admin lain.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel dashboard-panel--highlight">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Daftar Order</p>
              <h2>Antrian Pengerjaan</h2>
            </div>
          </div>

          <div className="dashboard-service-list">
            {latestOrders.map((order) => (
              <div key={order.id} className="admin-order-card">
                <div className="admin-order-card__header">
                  <div>
                    <h3>{order.kodeOrder}</h3>
                    <p>{getCustomerName(adminData.customers, order.userId)}</p>
                  </div>
                  <span className={`status-pill status-pill--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="admin-order-card__meta">
                  <span>{formatDate(order.tanggalOrder)}</span>
                  <span>{formatRupiah(order.totalHarga)}</span>
                  <span>{order.alamatPickup}</span>
                </div>

                <div className="admin-order-card__actions">
                  <button
                    className="service-select-button"
                    type="button"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
