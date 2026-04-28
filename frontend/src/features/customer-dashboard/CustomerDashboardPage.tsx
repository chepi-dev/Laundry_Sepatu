import { useEffect, useState } from 'react'
import { CustomerNavbar } from '../customer-services/components/CustomerNavbar'
import { getCustomerDashboardData } from './api/customerDashboard.repository'
import type { CustomerDashboardData } from '../../types/domain'

export function CustomerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getCustomerDashboardData()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setDashboardData(response)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Gagal memuat dashboard customer.'
        setLoadErrorMessage(message)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <div className="dashboard-page"><main className="dashboard-content">Memuat dashboard customer...</main></div>
  }

  if (loadErrorMessage || !dashboardData) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">{loadErrorMessage || 'Data customer tidak tersedia.'}</main>
      </div>
    )
  }

  const { user } = dashboardData

  return (
    <div className="dashboard-page">
      <CustomerNavbar user={user} activePage="dashboard" />

      <main className="dashboard-content" id="dashboard-top">
        <section className="dashboard-hero">
          <div>
            <p className="section-kicker">Dashboard Customer</p>
            <h1>Halo, {user.name.split(' ')[0]}</h1>
            <p>
              Pantau pesanan laundry sepatu, status pembayaran, dan ringkasan order dari data customer yang tersimpan di backend.
            </p>
          </div>

        </section>

        <section className="dashboard-stats dashboard-stats--profile" id="customer-info">
          <article className="dashboard-stat-card">
            <span>Nama Customer</span>
            <strong>{user.name}</strong>
            <p>Nama lengkap customer yang terhubung dengan akun aktif.</p>
          </article>
          <article className="dashboard-stat-card">
            <span>Email</span>
            <strong>{user.email}</strong>
            <p>Email utama yang dipakai untuk login dan notifikasi pesanan.</p>
          </article>
          <article className="dashboard-stat-card">
            <span>No. HP</span>
            <strong>{user.noHp}</strong>
            <p>Nomor customer untuk proses pickup dan konfirmasi layanan.</p>
          </article>
        </section>
      </main>
    </div>
  )
}
