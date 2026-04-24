import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData, verifyAdminPayment } from './api/adminDashboard.repository'
import type { AdminDashboardData } from '../../types/domain'

export function AdminPaymentsPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData>(() => getAdminDashboardData())

  const handleVerifyPayment = (paymentId: number) => {
    setAdminData(verifyAdminPayment(paymentId))
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

      <main className="dashboard-content">
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Verifikasi Pembayaran</p>
            <p>
              Tinjau bukti transfer customer dalam halaman khusus agar proses review
              pembayaran lebih cepat dan tidak tertutup panel lain.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Daftar Verifikasi</p>
              <h2>Menunggu Review</h2>
            </div>
          </div>

          <div className="dashboard-list">
            {adminData.payments.map((payment) => (
              <div key={payment.id} className="admin-review-card">
                <div className="dashboard-list__row">
                  <span>Order</span>
                  <strong>#{payment.orderId}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Status</span>
                  <strong>{payment.status}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Metode</span>
                  <strong>{payment.metodePembayaran}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Total Bayar</span>
                  <strong>{formatRupiah(payment.jumlahBayar)}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Bukti</span>
                  <strong>{payment.buktiPembayaran || 'Belum ada file'}</strong>
                </div>
                {payment.status === 'Menunggu Verifikasi' ? (
                  <button
                    className="auth-submit"
                    type="button"
                    onClick={() => handleVerifyPayment(payment.id)}
                  >
                    Verifikasi Pembayaran
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
