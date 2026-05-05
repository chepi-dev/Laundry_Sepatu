import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData, verifyAdminPayment } from './api/adminDashboard.repository'
import type { AdminDashboardData } from '../../types/domain'

export function AdminPaymentsPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getAdminDashboardData({ includeCustomers: false, includeServices: false })
      .then((response) => {
        if (isMounted) {
          setAdminData(response)
        }
      })
      .catch((error) => {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : 'Gagal memuat pembayaran admin.'
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
    return <div className="dashboard-page service-page--state">Memuat pembayaran admin...</div>
  }

  const pendingPayments = adminData.payments.filter(
    (payment) => payment.status === 'Menunggu Verifikasi',
  )

  const handleVerifyPayment = async (orderId: number) => {
    try {
      setAdminData(
        await verifyAdminPayment(orderId, {
          includeCustomers: false,
          includeServices: false,
        }),
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memverifikasi pembayaran.'
      setLoadErrorMessage(message)
    }
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
          <a href="#/dashboard/admin/orders">Order Masuk</a>
          <a href="#/dashboard/admin/orders/completed">Order Selesai</a>
          <a className="is-active" href="#/dashboard/admin/payments">
            Verifikasi
          </a>
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

      <main className="dashboard-content admin-payments-content">
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Verifikasi Pembayaran</p>
            <p>
              Tinjau bukti transfer customer dalam tampilan ringkas agar semua data utama
              langsung terlihat.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel admin-payments-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Daftar Verifikasi</p>
              <h2>Menunggu Review</h2>
            </div>
            <div className="admin-payment-summary" aria-label="Ringkasan pembayaran">
              <span>{pendingPayments.length} perlu dicek</span>
              <strong>{adminData.payments.length} pembayaran</strong>
            </div>
          </div>

          <div className="admin-table-wrap admin-payment-table-wrap">
            <table className="admin-data-table admin-payment-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Metode</th>
                  <th>Total Bayar</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adminData.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="admin-payment-order">#{payment.orderId}</strong>
                    </td>
                    <td>
                      <span
                        className={`status-pill status-pill--${payment.status
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.metodePembayaran}</td>
                    <td>
                      <strong>{formatRupiah(payment.jumlahBayar)}</strong>
                    </td>
                    <td>
                      <span className="admin-payment-proof">
                        {payment.buktiPembayaran || 'Belum ada file'}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'Menunggu Verifikasi' ? (
                        <button
                          className="admin-payment-action"
                          type="button"
                          onClick={() => void handleVerifyPayment(payment.orderId)}
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <span className="admin-payment-done">Selesai</span>
                      )}
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
