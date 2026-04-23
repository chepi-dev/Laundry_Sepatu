import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import {
  completeAdminOrder,
  deleteAdminService,
  getAdminDashboardData,
  saveAdminService,
  verifyAdminPayment,
} from './api/adminDashboard.repository'
import type { AdminDashboardData, Service, User } from '../../types/domain'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function getCustomerName(customers: User[], userId: number) {
  return customers.find((customer) => customer.id === userId)?.name ?? 'Pelanggan'
}

export function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData>(() => getAdminDashboardData())
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')

  const { admin, customers, services, orders, payments } = adminData
  const activeOrders = orders.filter((order) => order.status !== 'Selesai')
  const pendingPayments = payments.filter(
    (payment) => payment.status === 'Menunggu Verifikasi',
  )
  const totalRevenue = payments
    .filter((payment) => payment.status === 'Lunas')
    .reduce((total, payment) => total + payment.jumlahBayar, 0)

  const latestOrders = [...orders].sort((a, b) =>
    b.tanggalOrder.localeCompare(a.tanggalOrder),
  )

  const resetServiceForm = () => {
    setEditingServiceId(null)
    setServiceName('')
    setServicePrice('')
    setServiceDescription('')
  }

  const handleVerifyPayment = (paymentId: number) => {
    setAdminData(verifyAdminPayment(paymentId))
  }

  const handleCompleteOrder = (orderId: number) => {
    setAdminData(completeAdminOrder(orderId))
  }

  const handleSaveService = () => {
    const trimmedName = serviceName.trim()
    const trimmedDescription = serviceDescription.trim()
    const parsedPrice = Number(servicePrice)

    if (!trimmedName || !trimmedDescription || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return
    }

    setAdminData(
      saveAdminService({
        id: editingServiceId,
        namaLayanan: trimmedName,
        harga: parsedPrice,
        deskripsi: trimmedDescription,
      }),
    )
    resetServiceForm()
  }

  const handleEditService = (service: Service) => {
    setEditingServiceId(service.id)
    setServiceName(service.namaLayanan)
    setServicePrice(String(service.harga))
    setServiceDescription(service.deskripsi)
    scrollToSection('admin-services')
  }

  const handleDeleteService = (serviceId: number) => {
    setAdminData(deleteAdminService(serviceId))

    if (editingServiceId === serviceId) {
      resetServiceForm()
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
            <h2>{admin.name}</h2>
          </div>
        </div>

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu dashboard admin">
          <button
            className="is-active"
            type="button"
            onClick={() => scrollToSection('admin-top')}
          >
            Ringkasan
          </button>
          <button type="button" onClick={() => scrollToSection('admin-orders')}>
            Order Masuk
          </button>
          <button type="button" onClick={() => scrollToSection('admin-payments')}>
            Verifikasi
          </button>
          <button type="button" onClick={() => scrollToSection('admin-services')}>
            Layanan
          </button>
          <a href="#/dashboard/admin/walk-in">Datang Langsung</a>
          <a href="#/dashboard/admin/customers">Pelanggan</a>
        </nav>

        <div className="dashboard-navbar__actions">
          <ActionButton href="#beranda" variant="light">
            Kembali ke Beranda
          </ActionButton>
        </div>
      </header>

      <main className="dashboard-content" id="admin-top">
        <section className="dashboard-hero admin-dashboard-hero admin-overview-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Dashboard Admin</p>
            <p>
              Pantau pesanan aktif, proses verifikasi pembayaran, dan aktivitas layanan
              dalam satu tampilan ringkas untuk mendukung pengelolaan operasional harian.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton variant="gold" small onClick={() => scrollToSection('admin-payments')}>
              Tinjau Verifikasi
            </ActionButton>
            <ActionButton variant="dark" small onClick={() => scrollToSection('admin-orders')}>
              Tinjau Pesanan
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-stats" id="admin-summary">
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

        <section className="dashboard-grid admin-dashboard-grid">
          <article className="dashboard-panel dashboard-panel--highlight" id="admin-orders">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Order Masuk</p>
                <h2>Antrian Pengerjaan</h2>
              </div>
            </div>

            <div className="dashboard-service-list">
              {latestOrders.map((order) => (
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-card__header">
                    <div>
                      <h3>{order.kodeOrder}</h3>
                      <p>{getCustomerName(customers, order.userId)}</p>
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
          </article>

          <div className="dashboard-right-stack">
            <article className="dashboard-panel" id="admin-payments">
              <div className="dashboard-panel__header">
                <div>
                  <p className="section-kicker">Verifikasi Pembayaran</p>
                  <h2>Menunggu Review</h2>
                </div>
              </div>

              <div className="dashboard-list">
                {payments.map((payment) => (
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
            </article>

            <article className="dashboard-panel dashboard-panel--highlight" id="admin-services">
              <div className="dashboard-panel__header">
                <div>
                  <p className="section-kicker">Layanan Aktif</p>
                  <h2>Kelola Layanan</h2>
                </div>
              </div>

              <div className="admin-service-form">
                <FormField
                  id="admin-service-name"
                  label="Nama Layanan"
                  placeholder="Contoh: Fast Cleaning"
                  value={serviceName}
                  onChange={setServiceName}
                />
                <label className="form-field" htmlFor="admin-service-price">
                  <span>Harga</span>
                  <input
                    id="admin-service-price"
                    type="number"
                    min="0"
                    placeholder="Contoh: 75000"
                    value={servicePrice}
                    onChange={(event) => setServicePrice(event.target.value)}
                  />
                </label>
                <FormField
                  id="admin-service-description"
                  label="Deskripsi"
                  placeholder="Jelaskan treatment layanan ini"
                  as="textarea"
                  value={serviceDescription}
                  onChange={setServiceDescription}
                />
                <div className="admin-service-form__actions">
                  <button className="auth-submit" type="button" onClick={handleSaveService}>
                    {editingServiceId !== null ? 'Update Layanan' : 'Tambah Layanan'}
                  </button>
                  {editingServiceId !== null ? (
                    <button
                      className="service-select-button"
                      type="button"
                      onClick={resetServiceForm}
                    >
                      Batal Edit
                    </button>
                  ) : null}
                </div>
                <p className="admin-service-form__note">
                  Card layanan di bawah ini otomatis dibuat dari data layanan yang aktif.
                </p>
              </div>

              <div className="admin-service-summary">
                {services.map((service) => (
                  <div key={service.id} className="dashboard-service-card admin-service-card">
                    <h3>{service.namaLayanan}</h3>
                    <p>{service.deskripsi}</p>
                    <strong>{formatRupiah(service.harga)}</strong>
                    <div className="admin-service-card__actions">
                      <button
                        className="service-select-button"
                        type="button"
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="service-select-button admin-service-card__delete"
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
