import { useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { getAdminDashboardData } from './api/adminDashboard.repository'
import type { AdminDashboardData } from '../../types/domain'

export function AdminCustomersPage() {
  const [adminData] = useState<AdminDashboardData>(() => getAdminDashboardData())

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

        <nav className="dashboard-nav dashboard-nav--navbar" aria-label="Menu admin pelanggan">
          <a href="#/dashboard/admin">Ringkasan</a>
          <a href="#/dashboard/admin">Order Masuk</a>
          <a href="#/dashboard/admin">Verifikasi</a>
          <a href="#/dashboard/admin">Layanan</a>
          <a href="#/dashboard/admin/walk-in">Datang Langsung</a>
          <a className="is-active" href="#/dashboard/admin/customers">
            Pelanggan
          </a>
        </nav>

        <div className="dashboard-navbar__actions">
          <ActionButton href="#beranda" variant="light">
            Kembali ke Beranda
          </ActionButton>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-hero admin-dashboard-hero admin-customers-hero">
          <div>
            <p className="section-kicker">Data Pelanggan</p>
            <p>
              Halaman ini dibuat khusus agar admin bisa melihat seluruh data pelanggan
              secara padat, rapi, dan lebih mudah discan dibanding tampilan kartu.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <ActionButton href="#/dashboard/admin" variant="dark" small>
              Kembali ke Dashboard
            </ActionButton>
          </div>
        </section>

        <section className="dashboard-panel dashboard-panel--highlight">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Tabel Pelanggan</p>
              <h2>Daftar Pelanggan</h2>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. HP</th>
                  <th>Alamat</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {adminData.customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.noHp}</td>
                    <td>{customer.alamat}</td>
                    <td>{customer.role}</td>
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
