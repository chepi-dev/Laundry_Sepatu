import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getCurrentUser } from '../auth/api/auth.api'
import { getServices } from '../services/api/services.api'
import { getAdminCustomers } from './api/adminDashboard.repository'
import type { Service, User } from '../../types/domain'

export function AdminWalkInPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<User[]>([])
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing')
  const [selectedCustomerId, setSelectedCustomerId] = useState(0)
  const [customerSearch, setCustomerSearch] = useState('')
  const [walkInName, setWalkInName] = useState('')
  const [walkInEmail, setWalkInEmail] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [walkInAddress, setWalkInAddress] = useState('')
  const [walkInNote, setWalkInNote] = useState('')
  const [walkInServiceId, setWalkInServiceId] = useState(0)
  const [walkInQty, setWalkInQty] = useState(1)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([getCurrentUser(), getServices(), getAdminCustomers()])
      .then(([currentAdmin, serviceData, customerData]) => {
        if (!isMounted) {
          return
        }

        setAdmin(currentAdmin)
        setServices(serviceData)
        setCustomers(customerData)
        setWalkInServiceId(serviceData[0]?.id ?? 0)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Gagal memuat layanan.'
        setLoadErrorMessage(message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const selectedWalkInService =
    services.find((service) => service.id === walkInServiceId) ?? services[0]
  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null
  const walkInTotal = (selectedWalkInService?.harga ?? 0) * walkInQty
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = customerSearch.trim().toLowerCase()

    if (!searchValue) {
      return true
    }

    return [customer.name, customer.email, customer.noHp, customer.alamat]
      .join(' ')
      .toLowerCase()
      .includes(searchValue)
  })

  const fillCustomerFields = (customer: User) => {
    setWalkInName(customer.name)
    setWalkInEmail(customer.email)
    setWalkInPhone(customer.noHp)
    setWalkInAddress(customer.alamat)
  }

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId)
    setFormErrorMessage('')

    const customer = customers.find((item) => item.id === customerId)

    if (customer) {
      fillCustomerFields(customer)
    }
  }

  const handleUseExistingCustomer = () => {
    setCustomerMode('existing')
    setFormErrorMessage('')

    if (selectedCustomer) {
      fillCustomerFields(selectedCustomer)
    }
  }

  const handleUseNewCustomer = () => {
    setCustomerMode('new')
    setSelectedCustomerId(0)
    setCustomerSearch('')
    setWalkInName('')
    setWalkInEmail('')
    setWalkInPhone('')
    setWalkInAddress('')
    setFormErrorMessage('')
  }

  const resetWalkInForm = () => {
    setCustomerMode('existing')
    setSelectedCustomerId(0)
    setCustomerSearch('')
    setWalkInName('')
    setWalkInEmail('')
    setWalkInPhone('')
    setWalkInAddress('')
    setWalkInNote('')
    setWalkInServiceId(services[0]?.id ?? 0)
    setWalkInQty(1)
    setFormErrorMessage('')
  }

  const handleCreateWalkInOrder = () => {
    const trimmedName = walkInName.trim()
    const trimmedPhone = walkInPhone.trim()
    const trimmedAddress = walkInAddress.trim()

    if (customerMode === 'existing' && !selectedCustomer) {
      setFormErrorMessage('Pilih customer lama terlebih dahulu atau gunakan tombol Customer Baru.')
      return
    }

    if (!trimmedName || !trimmedPhone || !trimmedAddress || !selectedWalkInService) {
      setFormErrorMessage('Nama, nomor HP, dan alamat wajib diisi sebelum menyimpan order.')
      return
    }

    setFormErrorMessage('')
    setFormErrorMessage(
      'Endpoint API untuk order pelanggan datang langsung belum tersedia, jadi data tidak disimpan lokal lagi.',
    )
  }

  if (loadErrorMessage && !admin) {
    return <div className="dashboard-page service-page--state">{loadErrorMessage}</div>
  }

  if (!admin) {
    return <div className="dashboard-page service-page--state">Memuat form datang langsung...</div>
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

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu admin pelanggan langsung">
          <a href="#/dashboard/admin">Ringkasan</a>
          <a href="#/dashboard/admin/orders">Order Masuk</a>
          <a href="#/dashboard/admin/orders/completed">Order Selesai</a>
          <a href="#/dashboard/admin/payments">Verifikasi</a>
          <a href="#/dashboard/admin/services">Layanan</a>
          <a className="is-active" href="#/dashboard/admin/walk-in">
            Datang Langsung
          </a>
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

      <main className="dashboard-content admin-walkin-content">
        <section className="dashboard-hero admin-dashboard-hero admin-walkin-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Pelanggan Datang Langsung</p>
            <p>
              Catat order cash dari toko dalam form ringkas agar proses kasir lebih cepat.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel dashboard-panel--highlight admin-walkin-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Form Pelanggan Langsung</p>
              <h2>Order Cash di Toko</h2>
            </div>
            <div className="admin-walkin-summary" aria-label="Ringkasan order langsung">
              <span>Metode</span>
              <strong>Cash</strong>
            </div>
          </div>

          {loadErrorMessage ? <p className="service-error">{loadErrorMessage}</p> : null}
          {formErrorMessage ? <p className="service-error">{formErrorMessage}</p> : null}

          <div className="dashboard-order-form admin-walkin-form">
            <div className="admin-walkin-customer-tools">
              <div className="admin-walkin-mode-buttons" aria-label="Mode input customer">
                <button
                  className={`service-select-button ${
                    customerMode === 'existing' ? 'is-selected' : ''
                  }`}
                  type="button"
                  onClick={handleUseExistingCustomer}
                >
                  Customer Lama
                </button>
                <button
                  className={`service-select-button ${customerMode === 'new' ? 'is-selected' : ''}`}
                  type="button"
                  onClick={handleUseNewCustomer}
                >
                  Customer Baru
                </button>
              </div>

              {customerMode === 'existing' ? (
                <div className="admin-walkin-customer-picker">
                  <label className="form-field" htmlFor="walkin-customer-search">
                    <span>Cari Customer</span>
                    <input
                      id="walkin-customer-search"
                      placeholder="Cari nama, email, no. HP, atau alamat"
                      value={customerSearch}
                      onChange={(event) => setCustomerSearch(event.target.value)}
                    />
                  </label>
                  <label className="form-field" htmlFor="walkin-customer">
                    <span>Pilih Customer</span>
                    <select
                      id="walkin-customer"
                      value={selectedCustomerId}
                      onChange={(event) => handleSelectCustomer(Number(event.target.value))}
                    >
                      <option value={0}>Pilih dari data customer</option>
                      {filteredCustomers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.noHp}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
            </div>

            <FormField
              id="walkin-name"
              label="Nama Pelanggan"
              placeholder="Masukkan nama pelanggan"
              readOnly={customerMode === 'existing' && Boolean(selectedCustomer)}
              value={walkInName}
              onChange={setWalkInName}
            />
            <FormField
              id="walkin-phone"
              label="No. HP"
              type="tel"
              placeholder="Masukkan nomor handphone"
              readOnly={customerMode === 'existing' && Boolean(selectedCustomer)}
              value={walkInPhone}
              onChange={setWalkInPhone}
            />
            <FormField
              id="walkin-email"
              label="Email"
              type="email"
              placeholder="Opsional"
              readOnly={customerMode === 'existing' && Boolean(selectedCustomer)}
              value={walkInEmail}
              onChange={setWalkInEmail}
            />
            <label className="form-field" htmlFor="walkin-service">
              <span>Pilih Layanan</span>
              <select
                id="walkin-service"
                value={walkInServiceId}
                onChange={(event) => setWalkInServiceId(Number(event.target.value))}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.namaLayanan}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field" htmlFor="walkin-qty">
              <span>Jumlah Item</span>
              <input
                id="walkin-qty"
                type="number"
                min="1"
                value={walkInQty}
                onChange={(event) => setWalkInQty(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>
            <FormField
              id="walkin-address"
              label="Alamat (Wajib)"
              placeholder="Masukkan alamat pelanggan"
              value={walkInAddress}
              onChange={setWalkInAddress}
            />
            <FormField
              id="walkin-note"
              label="Catatan"
              placeholder="Contoh: minta selesai cepat"
              value={walkInNote}
              onChange={setWalkInNote}
            />
          </div>

          <div className="admin-walkin-checkout">
            <div>
              <span>Layanan</span>
              <strong>{selectedWalkInService?.namaLayanan ?? '-'}</strong>
            </div>
            <div>
              <span>Qty</span>
              <strong>{walkInQty}</strong>
            </div>
            <div>
              <span>Total Cash</span>
              <strong>{formatRupiah(walkInTotal)}</strong>
            </div>
            <div className="admin-walkin-actions">
              <button className="admin-payment-action" type="button" onClick={handleCreateWalkInOrder}>
                Simpan Order
              </button>
              <button className="service-select-button" type="button" onClick={resetWalkInForm}>
                Reset
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
