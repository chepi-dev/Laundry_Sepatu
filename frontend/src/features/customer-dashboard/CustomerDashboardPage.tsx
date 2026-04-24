import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import { getCustomerDashboardData } from './api/customerDashboard.repository'
import { performLogout } from '../auth/lib/logout'
import type {
  Order as CustomerOrder,
  Payment as CustomerPayment,
  Service as CustomerService,
} from '../../types/domain'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getServiceName(services: CustomerService[], layananId: number) {
  return (
    services.find((service) => service.id === layananId)?.namaLayanan ?? 'Layanan'
  )
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function CustomerDashboardPage() {
  const { user, orders, payments, services } = getCustomerDashboardData()
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? 0)
  const [selectedQty, setSelectedQty] = useState(1)
  const [pickupAddress, setPickupAddress] = useState(user.alamat)
  const [orderNote, setOrderNote] = useState('')
  const [orderHistory, setOrderHistory] = useState<CustomerOrder[]>(orders)
  const [paymentHistory, setPaymentHistory] = useState<CustomerPayment[]>(payments)
  const activeOrder = orderHistory[0]
  const latestPayment = paymentHistory[0]
  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0]
  const selectedTotal = (selectedService?.harga ?? 0) * selectedQty
  const paymentTotal = latestPayment.jumlahBayar
  const hasPaymentProof = Boolean(latestPayment.buktiPembayaran)

  const handlePaymentProofChange = (fileName: string) => {
    if (!fileName) {
      return
    }

    setPaymentHistory((current) => {
      const [firstPayment, ...rest] = current

      if (!firstPayment) {
        return current
      }

      return [
        {
          ...firstPayment,
          buktiPembayaran: fileName,
          status: 'Menunggu Verifikasi',
        },
        ...rest,
      ]
    })
  }

  const handleCreateOrder = () => {
    if (!selectedService) {
      return
    }

    const today = new Date()
    const estimated = new Date(today)
    const nextOrderId = Date.now()
    estimated.setDate(today.getDate() + 2)

    const nextOrder: CustomerOrder = {
      id: nextOrderId,
      userId: user.id,
      kodeOrder: `SAC-${today
        .toISOString()
        .slice(2, 10)
        .replaceAll('-', '')}-${String(today.getHours()).padStart(2, '0')}${String(
        today.getMinutes(),
      ).padStart(2, '0')}`,
      tanggalOrder: today.toISOString(),
      status: 'Diproses',
      totalHarga: selectedTotal,
      alamatPickup: pickupAddress,
      catatan:
        orderNote || `Pesanan baru untuk layanan ${selectedService.namaLayanan}.`,
      estimasiSelesai: estimated.toISOString(),
      details: [
        {
          id: nextOrderId + 1,
          orderId: nextOrderId,
          layananId: selectedService.id,
          qty: selectedQty,
          harga: selectedService.harga,
          subtotal: selectedTotal,
        },
      ],
    }

    const nextPayment: CustomerPayment = {
      id: nextOrderId + 2,
      orderId: nextOrder.id,
      metodePembayaran: 'Transfer Bank',
      status: 'Menunggu Verifikasi',
      jumlahBayar: selectedTotal,
      tanggalBayar: today.toISOString(),
      rekeningTujuan: '1234567890',
      namaBank: 'BCA a.n. Shoes and Care',
      buktiPembayaran: '',
    }

    setOrderHistory((current) => [nextOrder, ...current])
    setPaymentHistory((current) => [nextPayment, ...current])
    setOrderNote('')

    document.getElementById('orders')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="dashboard-navbar__brand">
          <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
            <span>SHOES</span>
            <span>AND</span>
            <span>CARE</span>
          </a>

          <div className="dashboard-profile dashboard-profile--navbar">
            <h2>{user.name}</h2>
          </div>
        </div>

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu dashboard customer">
          <button
            className="is-active"
            type="button"
            onClick={() => scrollToSection('dashboard-top')}
          >
            Ringkasan
          </button>
          <button type="button" onClick={() => scrollToSection('orders')}>
            Pesanan Saya
          </button>
          <button type="button" onClick={() => scrollToSection('payments')}>
            Pembayaran
          </button>
          <button type="button" onClick={() => scrollToSection('services')}>
            Detail Order
          </button>
          <button type="button" onClick={() => scrollToSection('customer-info')}>
            Profil
          </button>
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

      <main className="dashboard-content" id="dashboard-top">
        <section className="dashboard-hero">
          <div>
            <p className="section-kicker">Dashboard Customer</p>
            <h1>Halo, {user.name.split(' ')[0]}</h1>
            <p>
              Pantau pesanan laundry sepatu, status pembayaran, dan layanan yang
              tersedia langsung dari satu dashboard.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton
              variant="gold"
              onClick={() => scrollToSection('create-order')}
            >
              Pesan Layanan
            </ActionButton>
            <ActionButton variant="dark" onClick={() => scrollToSection('orders')}>
              Lihat Pesanan
            </ActionButton>
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

        <section className="dashboard-grid">
          <article className="dashboard-panel dashboard-panel--highlight" id="create-order">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Pesan Layanan</p>
                <h2>Buat Order Baru</h2>
              </div>
            </div>

            <div className="dashboard-order-form">
              <label className="form-field" htmlFor="service-select">
                <span>Pilih Layanan</span>
                <select
                  id="service-select"
                  value={selectedServiceId}
                  onChange={(event) => setSelectedServiceId(Number(event.target.value))}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.namaLayanan}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field" htmlFor="service-qty">
                <span>Jumlah Item</span>
                <input
                  id="service-qty"
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={(event) =>
                    setSelectedQty(Math.max(1, Number(event.target.value) || 1))
                  }
                />
              </label>

              <FormField
                id="pickup-address"
                label="Alamat Pickup"
                placeholder="Masukkan alamat penjemputan"
                as="textarea"
                value={pickupAddress}
                onChange={setPickupAddress}
              />

              <FormField
                id="order-note"
                label="Catatan"
                placeholder="Tulis kondisi sepatu atau permintaan khusus"
                as="textarea"
                value={orderNote}
                onChange={setOrderNote}
              />
            </div>

            <div className="dashboard-service-preview">
              <div>
                <span>Layanan Dipilih</span>
                <strong>{selectedService?.namaLayanan}</strong>
              </div>
              <div>
                <span>Harga Satuan</span>
                <strong>{formatRupiah(selectedService?.harga ?? 0)}</strong>
              </div>
              <div>
                <span>Total Estimasi</span>
                <strong>{formatRupiah(selectedTotal)}</strong>
              </div>
            </div>

            <div className="dashboard-order-actions">
              <button className="auth-submit" type="button" onClick={handleCreateOrder}>
                Kirim Pesanan
              </button>
              <p>
                Customer dapat memilih layanan terlebih dahulu, lalu tahap berikutnya
                bisa kita sambungkan ke backend untuk menyimpan order.
              </p>
            </div>
          </article>

          <div className="dashboard-right-stack">
            <article className="dashboard-panel dashboard-panel--highlight" id="orders">
              <div className="dashboard-panel__header">
                <div>
                  <p className="section-kicker">Pesanan Aktif</p>
                  <h2>{activeOrder.kodeOrder}</h2>
                </div>
                <span className={`status-pill status-pill--${activeOrder.status.toLowerCase()}`}>
                  {activeOrder.status}
                </span>
              </div>

              <div className="dashboard-order-meta">
                <div>
                  <span>Tanggal Order</span>
                  <strong>{formatDate(activeOrder.tanggalOrder)}</strong>
                </div>
                <div>
                  <span>Estimasi Selesai</span>
                  <strong>{formatDate(activeOrder.estimasiSelesai)}</strong>
                </div>
                <div>
                  <span>Total Harga</span>
                  <strong>{formatRupiah(activeOrder.totalHarga)}</strong>
                </div>
              </div>

              <p className="dashboard-note">{activeOrder.catatan}</p>

              <div className="dashboard-service-list">
                {activeOrder.details.map((detail) => (
                  <div key={detail.id} className="dashboard-service-item">
                    <div>
                      <h3>{getServiceName(services, detail.layananId)}</h3>
                      <p>Qty {detail.qty}</p>
                    </div>
                    <strong>{formatRupiah(detail.subtotal)}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-panel" id="payments">
              <div className="dashboard-panel__header">
                <div>
                  <p className="section-kicker">Pembayaran</p>
                  <h2>Transfer Bank</h2>
                </div>
                <span
                  className={`status-pill status-pill--${latestPayment.status
                    .toLowerCase()
                    .replaceAll(' ', '-')}`}
                >
                  {latestPayment.status}
                </span>
              </div>

              <div className="dashboard-list">
                <div className="dashboard-list__row">
                  <span>Metode Pembayaran</span>
                  <strong>Transfer Bank</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Rekening Tujuan</span>
                  <strong>{latestPayment.namaBank}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>No. Rekening</span>
                  <strong>{latestPayment.rekeningTujuan}</strong>
                </div>
                <div className="dashboard-list__row">
                  <span>Total Pembayaran</span>
                  <strong>{formatRupiah(paymentTotal)}</strong>
                </div>
              </div>

              <div className="dashboard-payment-proof">
                <label className="form-field" htmlFor="payment-proof">
                  <span>Upload Bukti Pembayaran</span>
                  <input
                    id="payment-proof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) =>
                      handlePaymentProofChange(event.target.files?.[0]?.name ?? '')
                    }
                  />
                </label>

                <div className="dashboard-payment-proof__info">
                  <span>Bukti Pembayaran</span>
                  <strong>
                    {latestPayment.buktiPembayaran || 'Belum ada file diunggah'}
                  </strong>
                </div>
              </div>
            </article>
          </div>

          <article className="dashboard-panel dashboard-panel--wide" id="services">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Detail Order</p>
                <h2>Ringkasan Pesanan</h2>
              </div>
            </div>

            {hasPaymentProof ? (
              <div className="dashboard-services-grid">
                <div className="dashboard-service-card">
                  <h3>Kode Order</h3>
                  <p>Nomor referensi pesanan customer yang sedang diproses.</p>
                  <strong>{activeOrder.kodeOrder}</strong>
                </div>
                <div className="dashboard-service-card">
                  <h3>Layanan</h3>
                  <p>
                    {getServiceName(services, activeOrder.details[0]?.layananId ?? 0)} dengan Qty{' '}
                    {activeOrder.details[0]?.qty ?? 0}.
                  </p>
                  <strong>
                    {formatRupiah(activeOrder.details[0]?.subtotal ?? activeOrder.totalHarga)}
                  </strong>
                </div>
                <div className="dashboard-service-card">
                  <h3>Pickup & Status</h3>
                  <p>{activeOrder.alamatPickup}</p>
                  <strong>{activeOrder.status}</strong>
                </div>
                <div className="dashboard-service-card">
                  <h3>Pembayaran</h3>
                  <p>{latestPayment.buktiPembayaran}</p>
                  <strong>{formatRupiah(latestPayment.jumlahBayar)}</strong>
                </div>
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <h3>Detail order akan muncul di sini</h3>
                <p>
                  Upload bukti pembayaran terlebih dahulu agar ringkasan detail order
                  bisa ditampilkan.
                </p>
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}
