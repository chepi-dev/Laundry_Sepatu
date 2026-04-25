import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import { getCustomerServicesData } from './api/customerServices.repository'
import { saveCustomerPaymentDraft } from './lib/customerOrderFlow'
import { performLogout } from '../auth/lib/logout'
import type { Service, User } from '../../types/domain'

export function CustomerServicesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState(0)
  const [selectedQty, setSelectedQty] = useState(1)
  const [pickupAddress, setPickupAddress] = useState('')
  const [orderNote, setOrderNote] = useState('')

  useEffect(() => {
    let isMounted = true

    getCustomerServicesData()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setUser(response.user)
        setServices(response.services)
        setSelectedServiceId(response.services[0]?.id ?? 0)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Gagal memuat data layanan.'
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

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0]
  const selectedTotal = (selectedService?.harga ?? 0) * selectedQty

  if (isLoading) {
    return <div className="service-page service-page--state">Memuat layanan...</div>
  }

  if (loadErrorMessage || !user) {
    return (
      <div className="service-page service-page--state">
        {loadErrorMessage || 'Data pengguna tidak tersedia.'}
      </div>
    )
  }

  const handleProceedToPayment = () => {
    if (!selectedService) {
      setErrorMessage('Pilih layanan terlebih dahulu.')
      return
    }

    if (!pickupAddress.trim()) {
      setErrorMessage('Alamat pickup wajib diisi sebelum lanjut ke pembayaran.')
      return
    }

    setErrorMessage('')
    saveCustomerPaymentDraft({
      user,
      service: selectedService,
      qty: selectedQty,
      alamatPickup: pickupAddress.trim(),
      catatan: orderNote.trim(),
      totalBayar: selectedTotal,
    })
    window.location.hash = '#/customer/payment'
  }

  return (
    <div className="service-page">
      <header className="service-header">
        <div className="container service-header__inner">
          <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
            <span>SHOES</span>
            <span>AND</span>
            <span>CARE</span>
          </a>

          <div className="service-header__account">
            <div className="service-header__user">
              <span>Customer</span>
              <strong>{user.name}</strong>
            </div>
            <ActionButton variant="dark" small onClick={() => void performLogout()}>
              Logout
            </ActionButton>
          </div>
        </div>
      </header>

      <main className="service-main container">
        <section className="service-hero">
          <div>
            <p className="section-kicker">Layanan Customer</p>
            <h1>Pilih Layanan Cuci Sepatu</h1>
            <p>
              Pilih layanan yang dibutuhkan, lengkapi form pemesanan, lalu lanjutkan
              ke pembayaran agar detail order tercatat dengan rapi.
            </p>
          </div>
        </section>

        <section className="service-layout">
          <article className="service-panel service-panel--selection">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Pesan Layanan</p>
                <h2>Form Pemesanan Awal</h2>
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
                label="Catatan Barang"
                placeholder="Contoh: midsole kuning, upper kena noda, atau ingin finishing khusus"
                as="textarea"
                value={orderNote}
                onChange={setOrderNote}
              />
            </div>

            {errorMessage ? <p className="service-error">{errorMessage}</p> : null}

            <div className="service-panel__actions">
              <button className="auth-submit" type="button" onClick={handleProceedToPayment}>
                Lanjut ke Pembayaran
              </button>
              <ActionButton href="#beranda" variant="light">
                Kembali ke Beranda
              </ActionButton>
            </div>
          </article>

          <article className="service-panel service-panel--compact">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Ringkasan Pesanan</p>
                <h2>Layanan Dipilih</h2>
              </div>
            </div>

            <div className="dashboard-service-preview">
              <div>
                <span>Nama Layanan</span>
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

            <div className="service-summary-card">
              <p>{selectedService?.deskripsi}</p>
              <div className="service-summary-card__meta">
                <span>Jumlah item: {selectedQty}</span>
                <span>Email customer: {user.email}</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
