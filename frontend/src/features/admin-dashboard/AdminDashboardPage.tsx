import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData } from './api/adminDashboard.repository'
import type { AdminDashboardData } from '../../types/domain'

export function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getAdminDashboardData({ includePayments: false })
      .then((response) => {
        if (isMounted) {
          setAdminData(response)
        }
      })
      .catch((error) => {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : 'Gagal memuat dashboard admin.'
          setLoadErrorMessage(message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loadErrorMessage) {
    return <div className="dashboard-page service-page--state">{loadErrorMessage}</div>
  }

  if (!adminData) {
    return <div className="dashboard-page service-page--state">Memuat dashboard admin...</div>
  }

  const { admin, customers, orders, services } = adminData

  const activeOrders = orders.filter((order) => order.status !== 'Selesai')
  const completedOrders = orders.filter((order) => order.status === 'Selesai')
  const overviewMetrics = [
    {
      label: 'Order Aktif',
      value: activeOrders.length,
    },
    {
      label: 'Order Selesai',
      value: completedOrders.length,
    },
    {
      label: 'Layanan',
      value: services.length,
    },
  ]
  const adminSections = [
    {
      title: 'Order Masuk',
      description: 'Antrian pengerjaan customer.',
      status: `${activeOrders.length} aktif`,
      href: '#/dashboard/admin/orders',
    },
    {
      title: 'Order Selesai',
      description: 'Riwayat order yang sudah selesai.',
      status: `${completedOrders.length} selesai`,
      href: '#/dashboard/admin/orders/completed',
    },
    {
      title: 'Verifikasi Pembayaran',
      description: 'Bukti transfer menunggu review.',
      status: 'Buka halaman',
      href: '#/dashboard/admin/payments',
    },
    {
      title: 'Kelola Layanan',
      description: 'Tambah, edit, dan hapus layanan.',
      status: `${services.length} layanan`,
      href: '#/dashboard/admin/services',
    },
    {
      title: 'Datang Langsung',
      description: 'Input order cash di toko.',
      status: 'Cash',
      href: '#/dashboard/admin/walk-in',
    },
    {
      title: 'Pelanggan',
      description: 'Data customer terdaftar.',
      status: `${customers.length} customer`,
      href: '#/dashboard/admin/customers',
    },
  ]

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
          <a href="#/dashboard/admin/orders/completed">Order Selesai</a>
          <a href="#/dashboard/admin/payments">Verifikasi</a>
          <a href="#/dashboard/admin/services">Layanan</a>
          <a href="#/dashboard/admin/walk-in">Datang Langsung</a>
          <a href="#/dashboard/admin/customers">Pelanggan</a>
        </nav>

        <div className="dashboard-navbar__actions">
          <ActionButton variant="dark" small onClick={() => void performLogout()}>
            Logout
          </ActionButton>
        </div>
      </header>

      <main className="dashboard-content admin-overview-content">
        <section className="dashboard-hero admin-dashboard-hero admin-overview-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Dashboard Admin</p>
            <p>
              Pantau operasional utama dan buka halaman kerja dari daftar ringkas.
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

        <section className="dashboard-panel admin-overview-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Ringkasan Operasional</p>
              <h2>Kontrol Admin</h2>
            </div>
          </div>

          <div className="admin-overview-metrics">
            {overviewMetrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table admin-overview-table">
              <thead>
                <tr>
                  <th>Area Kerja</th>
                  <th>Fokus</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adminSections.map((section) => (
                  <tr key={section.title}>
                    <td>
                      <strong>{section.title}</strong>
                    </td>
                    <td>{section.description}</td>
                    <td>
                      <span className="admin-overview-status">{section.status}</span>
                    </td>
                    <td>
                      <a className="admin-overview-action" href={section.href}>
                        Buka
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
