import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData, verifyAdminPayment } from './api/adminDashboard.repository'
import type { AdminDashboardData, Order, User } from '../../types/domain'

function formatDate(date?: string) {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getOrderForPayment(orders: Order[], orderId: number) {
  return orders.find((order) => order.id === orderId) ?? null
}

function getCustomerForOrder(customers: User[], order: Order | null) {
  if (!order) {
    return null
  }

  return customers.find((customer) => customer.id === order.userId) ?? null
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
  const message = `Halo ${customerName}, kami dari Shoes and Care terkait pembayaran order ${orderCode}.`

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
}

export function AdminPaymentsPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getAdminDashboardData({
      includeCustomers: false,
      includePayments: true,
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
  const sortedPayments = [...adminData.payments].sort((a, b) => b.id - a.id)

  const handleVerifyPayment = async (orderId: number) => {
    try {
      setAdminData(
        await verifyAdminPayment(orderId, {
          includeCustomers: false,
          includePayments: true,
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
                  <th>Pelanggan</th>
                  <th>No. HP</th>
                  <th>Tanggal</th>
                  <th>Metode</th>
                  <th>Total</th>
                  <th>Bukti</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((payment) => {
                  const order = getOrderForPayment(adminData.orders, payment.orderId)
                  const customer = getCustomerForOrder(adminData.customers, order)
                  const orderCode = order?.kodeOrder ?? `#${payment.orderId}`
                  const customerName = customer?.name ?? 'Pelanggan'
                  const customerPhone = customer?.noHp ?? '-'
                  const whatsappHref = getWhatsAppHref(customerPhone, customerName, orderCode)
                  const canOpenWhatsApp = Boolean(whatsappHref)

                  return (
                    <tr key={payment.id}>
                      <td>
                        <strong className="admin-payment-order">{orderCode}</strong>
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
                      <td>{formatDate(order?.tanggalOrder ?? payment.tanggalBayar)}</td>
                      <td>{payment.metodePembayaran}</td>
                      <td>
                        <strong>{formatRupiah(payment.jumlahBayar)}</strong>
                      </td>
                      <td>
                        {payment.buktiPembayaran ? (
                          <a
                            className="admin-payment-proof"
                            href={payment.buktiPembayaran}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          <span className="admin-payment-proof">Belum ada file</span>
                        )}
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
