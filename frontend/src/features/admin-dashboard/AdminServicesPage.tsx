import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getCurrentUser } from '../auth/api/auth.api'
import { createService, deleteService, getServices, updateService } from '../services/api/services.api'
import type { Service, User } from '../../types/domain'

export function AdminServicesPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([getCurrentUser(), getServices()])
      .then(([currentAdmin, response]) => {
        if (!isMounted) {
          return
        }

        setAdmin(currentAdmin)
        setServices(response)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Gagal memuat data layanan.'
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

  const resetServiceForm = () => {
    setEditingServiceId(null)
    setServiceName('')
    setServicePrice('')
    setServiceDescription('')
  }

  const handleSaveService = async () => {
    const trimmedName = serviceName.trim()
    const trimmedDescription = serviceDescription.trim()
    const parsedPrice = Number(servicePrice)

    if (!trimmedName || !trimmedDescription || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Isi data layanan dengan benar sebelum disimpan.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const payload = {
        nama_layanan: trimmedName,
        harga: parsedPrice,
        deskripsi: trimmedDescription,
      }

      const savedService =
        editingServiceId !== null
          ? await updateService(editingServiceId, payload)
          : await createService(payload)

      const nextServices =
        editingServiceId !== null
          ? services.map((service) => (service.id === editingServiceId ? savedService : service))
          : [savedService, ...services]

      setServices(nextServices)
      resetServiceForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menyimpan layanan.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingServiceId(service.id)
    setServiceName(service.namaLayanan)
    setServicePrice(String(service.harga))
    setServiceDescription(service.deskripsi)
    setErrorMessage('')
  }

  const handleDeleteService = async (serviceId: number) => {
    setErrorMessage('')

    try {
      await deleteService(serviceId)
      const nextServices = services.filter((service) => service.id !== serviceId)
      setServices(nextServices)

      if (editingServiceId === serviceId) {
        resetServiceForm()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus layanan.'
      setErrorMessage(message)
    }
  }

  if (errorMessage && !admin) {
    return <div className="dashboard-page service-page--state">{errorMessage}</div>
  }

  if (!admin) {
    return <div className="dashboard-page service-page--state">Memuat layanan admin...</div>
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
          <a href="#/dashboard/admin">Ringkasan</a>
          <a href="#/dashboard/admin/orders">Order Masuk</a>
          <a href="#/dashboard/admin/orders/completed">Order Selesai</a>
          <a href="#/dashboard/admin/payments">Verifikasi</a>
          <a className="is-active" href="#/dashboard/admin/services">
            Layanan
          </a>
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

      <main className="dashboard-content admin-services-content">
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Layanan Aktif</p>
            <p>
              Kelola data layanan dalam tampilan ringkas agar proses tambah, edit, dan hapus
              lebih cepat.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel admin-services-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Form Layanan</p>
              <h2>{editingServiceId !== null ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
            </div>
            <div className="admin-payment-summary" aria-label="Ringkasan layanan">
              <span>{services.length} layanan</span>
              <strong>{editingServiceId !== null ? 'Mode edit' : 'Mode tambah'}</strong>
            </div>
          </div>

          <div className="admin-service-compact-form">
            <label className="form-field" htmlFor="admin-service-name">
              <span>Nama Layanan</span>
              <input
                id="admin-service-name"
                placeholder="Contoh: Fast Cleaning"
                value={serviceName}
                onChange={(event) => setServiceName(event.target.value)}
              />
            </label>
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
            <label
              className="form-field admin-service-description-field"
              htmlFor="admin-service-description"
            >
              <span>Deskripsi</span>
              <input
                id="admin-service-description"
                placeholder="Jelaskan treatment layanan ini"
                value={serviceDescription}
                onChange={(event) => setServiceDescription(event.target.value)}
              />
            </label>
            <div className="admin-service-form__actions admin-service-compact-actions">
              <button
                className="admin-payment-action"
                type="button"
                disabled={isSaving}
                onClick={handleSaveService}
              >
                {isSaving
                  ? 'Memproses...'
                  : editingServiceId !== null
                    ? 'Update'
                    : 'Tambah'}
              </button>
              {editingServiceId !== null ? (
                <button className="service-select-button" type="button" onClick={resetServiceForm}>
                  Batal
                </button>
              ) : null}
            </div>
          </div>

          {errorMessage ? <p className="service-error">{errorMessage}</p> : null}

          <div className="dashboard-panel__header admin-service-list-header">
            <div>
              <p className="section-kicker">Daftar Layanan</p>
              <h2>Layanan Tersedia</h2>
            </div>
          </div>

          {isLoading ? <p>Memuat layanan...</p> : null}

          <div className="admin-table-wrap">
            <table className="admin-data-table admin-service-table">
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.namaLayanan}</strong>
                    </td>
                    <td>
                      <span className="admin-service-description">{service.deskripsi}</span>
                    </td>
                    <td>
                      <strong>{formatRupiah(service.harga)}</strong>
                    </td>
                    <td>
                      <div className="admin-service-table-actions">
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
                          onClick={() => void handleDeleteService(service.id)}
                        >
                          Hapus
                        </button>
                      </div>
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
