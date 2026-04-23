import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import { getCustomerServicesData } from './api/customerServices.repository'
import type { Service, User } from '../../types/domain'

export function CustomerServicesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState(0)
  const [selectedQty, setSelectedQty] = useState(1)

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
        setErrorMessage(message)
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

  if (errorMessage || !user) {
    return (
      <div className="service-page service-page--state">
        {errorMessage || 'Data pengguna tidak tersedia.'}
      </div>
    )
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

          <div className="service-header__user">
            <span>Customer</span>
            <strong>{user.name}</strong>
          </div>
        </div>
      </header>

      <main className="service-main container">
        <section className="service-hero">
          <div>
            <p className="section-kicker">Langkah 1 dari 3</p>
            <h1>Pilih Layanan Cuci Sepatu</h1>
            <p>
              Setelah login, customer langsung masuk ke halaman ini untuk memilih
              treatment yang dibutuhkan sebelum lanjut ke pembayaran dan detail
              pesanan.
            </p>
          </div>

          <div className="service-steps">
            <div className="service-step service-step--done">Register</div>
            <div className="service-step service-step--done">Login</div>
            <div className="service-step service-step--active">Pilih Layanan</div>
            <div className="service-step">Pembayaran</div>
            <div className="service-step">Detail Pesanan</div>
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
              />

              <FormField
                id="order-note"
                label="Catatan Barang"
                placeholder="Contoh: midsole kuning, upper kena noda, atau ingin finishing khusus"
                as="textarea"
              />
            </div>

            <div className="service-panel__actions">
              <button className="auth-submit" type="button">
                Lanjut ke Pembayaran
              </button>
              <ActionButton href="#beranda" variant="light">
                Kembali ke Beranda
              </ActionButton>
            </div>
          </article>

          <article className="service-panel">
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

        <section className="service-catalog">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Daftar Layanan</p>
              <h2>Pilih Treatment Sesuai Kebutuhan</h2>
            </div>
          </div>

          <div className="service-catalog__grid">
            {services.map((service) => (
              <article
                key={service.id}
                className={`service-catalog__card ${
                  selectedServiceId === service.id ? 'is-selected' : ''
                }`}
              >
                <h3>{service.namaLayanan}</h3>
                <p>{service.deskripsi}</p>
                <strong>{formatRupiah(service.harga)}</strong>
                <button
                  type="button"
                  className="service-select-button"
                  onClick={() => setSelectedServiceId(service.id)}
                >
                  Pilih Layanan
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
