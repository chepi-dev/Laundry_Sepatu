import { useEffect, useState } from 'react'
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

function getCustomer(customers: User[], userId: number) {
  return customers.find((customer) => customer.id === userId) ?? null
}

function getWhatsAppHref(phone: string, customerName: string, orderCode: string) {
  const digitsOnly = phone.replace(/\D/g, '')

  if (!digitsOnly) {
    return ''
  }

  const normalizedPhone = digitsOnly.startsWith('0')
    ? `62${digitsOnly.slice(1)}`
    : digitsOnly.startsWith('8')
      ? `62${digitsOnly}`
      : digitsOnly
  const message = `Halo ${customerName}, kami dari Shoes and Care terkait order ${orderCode}.`

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
}

export function AdminOrdersPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getAdminDashboardData({
      includeCustomers: false,
      includePayments: false,
      includeServices: false,
    })
      .then((response) => {
        if (isMounted) {
          setAdminData(response)
        }
      })
      .catch((error) => {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : 'Gagal memuat order admin.'
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
    return <div className="dashboard-page service-page--state">Memuat order admin...</div>
  }

  const latestOrders = [...adminData.orders].sort((a, b) =>
    b.tanggalOrder.localeCompare(a.tanggalOrder),
  )
  const activeOrders = latestOrders.filter((order) => order.status !== 'Selesai')
  const completedOrders = latestOrders.filter((order) => order.status === 'Selesai')

  const handleCompleteOrder = async (orderId: number) => {
    try {
      setAdminData(
        await completeAdminOrder(orderId, {
          includeCustomers: false,
          includePayments: false,
          includeServices: false,
        }),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menyelesaikan order.'
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
          <a className="is-active" href="#/dashboard/admin/orders">
            Order Masuk
          </a>
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

      <main className="dashboard-content admin-orders-content">
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Order Masuk</p>
            <p>
              Kelola antrian customer dalam tampilan ringkas agar status dan aksi order
              langsung terlihat.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel dashboard-panel--highlight admin-orders-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Daftar Order</p>
              <h2>Antrian Pengerjaan</h2>
            </div>
            <div className="admin-order-summary" aria-label="Ringkasan order">
              <span>{activeOrders.length} aktif</span>
              <strong>{completedOrders.length} selesai</strong>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table admin-order-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Pelanggan</th>
                  <th>No. HP</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Alamat Pickup</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => {
                  const customer = getCustomer(adminData.customers, order.userId)
                  const customerName = customer?.name ?? 'Pelanggan'
                  const customerPhone = customer?.noHp ?? '-'
                  const whatsappHref = getWhatsAppHref(customerPhone, customerName, order.kodeOrder)
                  const canOpenWhatsApp = Boolean(whatsappHref)

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className="admin-order-code">{order.kodeOrder}</strong>
                      </td>
                      <td>{customerName}</td>
                      <td>
                        <span className="admin-order-phone">
                          <span>{customerPhone}</span>
                          {canOpenWhatsApp ? (
                            <a href={whatsappHref} target="_blank" rel="noreferrer">
                              WA
                            </a>
                          ) : null}
                        </span>
                      </td>
                      <td>{formatDate(order.tanggalOrder)}</td>
                      <td>
                        <strong>{formatRupiah(order.totalHarga)}</strong>
                      </td>
                      <td>
                        <span className="admin-order-address">{order.alamatPickup}</span>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-pill--${order.status
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === 'Selesai' ? (
                          <span className="admin-payment-done">Selesai</span>
                        ) : (
                          <button
                            className="admin-order-action"
                            type="button"
                            onClick={() => void handleCompleteOrder(order.id)}
                          >
                            Selesai
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
