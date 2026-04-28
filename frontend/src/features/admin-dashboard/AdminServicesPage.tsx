import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getAdminDashboardData, syncAdminServices } from './api/adminDashboard.repository'
import { createService, deleteService, getServices, updateService } from '../services/api/services.api'
import type { AdminDashboardData, Service } from '../../types/domain'

export function AdminServicesPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData>(() => getAdminDashboardData())
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

    getServices()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setServices(response)
        setAdminData(syncAdminServices(response))
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
      setAdminData(syncAdminServices(nextServices))
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
      setAdminData(syncAdminServices(nextServices))

      if (editingServiceId === serviceId) {
        resetServiceForm()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus layanan.'
      setErrorMessage(message)
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

      <main className="dashboard-content">
        <section className="dashboard-hero admin-dashboard-hero admin-compact-hero">
          <div>
            <p className="section-kicker">Layanan Aktif</p>
            <p>
              Kelola data layanan dalam halaman terpisah agar proses tambah, edit, dan
              hapus layanan lebih fokus dan tidak bercampur dengan operasional harian.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-grid admin-dashboard-grid">
          <article className="dashboard-panel dashboard-panel--highlight">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Form Layanan</p>
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
              {errorMessage ? <p className="service-error">{errorMessage}</p> : null}
              <div className="admin-service-form__actions">
                <button className="auth-submit" type="button" onClick={handleSaveService}>
                  {isSaving
                    ? 'Memproses...'
                    : editingServiceId !== null
                      ? 'Update Layanan'
                      : 'Tambah Layanan'}
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
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Daftar Layanan</p>
                <h2>Layanan Tersedia</h2>
              </div>
            </div>

            {isLoading ? <p>Memuat layanan...</p> : null}

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
                      onClick={() => void handleDeleteService(service.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
