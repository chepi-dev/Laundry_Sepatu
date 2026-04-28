import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import type { Order, OrderDetail, Payment, Service, User } from '../../types/domain'
import { CustomerNavbar } from './components/CustomerNavbar'
import { getCustomerServicesData } from './api/customerServices.repository'

const ORDER_STEPS = ['Pending', 'Diproses', 'Pickup', 'Dicuci', 'Selesai']

function formatDate(date?: string) {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

function getServiceName(services: Service[], detail: OrderDetail) {
  return (
    detail.layananNama ??
    services.find((service) => service.id === detail.layananId)?.namaLayanan ??
    `Layanan #${detail.layananId}`
  )
}

function getStatusClass(status: string) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function getPaymentForOrder(payments: Payment[], orderId: number) {
  return payments.find((payment) => payment.orderId === orderId) ?? null
}

export function CustomerOrderDetailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getCustomerServicesData()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setUser(response.user)
        setOrders(response.orders)
        setPayments(response.payments)
        setServices(response.services)
        setSelectedOrderId(response.orders[0]?.id ?? null)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Gagal memuat detail order customer.'
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

  if (isLoading) {
    return <div className="service-page service-page--state">Memuat detail order...</div>
  }

  if (loadErrorMessage || !user) {
    return (
      <div className="service-page service-page--state">
        {loadErrorMessage || 'Data customer tidak tersedia.'}
      </div>
    )
  }

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null
  const selectedPayment = selectedOrder
    ? getPaymentForOrder(payments, selectedOrder.id)
    : null
  const activeStepIndex = selectedOrder
    ? ORDER_STEPS.findIndex((step) => step === selectedOrder.status)
    : -1

  return (
    <div className="service-page">
      <CustomerNavbar user={user} activePage="orders" />

      <main className="service-main container">
        <section className="service-hero">
          <div>
            <p className="section-kicker">Detail Order Customer</p>
            <h1>Riwayat dan Detail Pesanan</h1>
            <p>
              Lihat kode order, layanan yang dipilih, total pembayaran, alamat pickup,
              dan status proses laundry sepatu dari pesanan customer.
            </p>
          </div>

        </section>

        {orders.length === 0 ? (
          <section className="service-panel customer-order-empty">
            <div>
              <p className="section-kicker">Belum Ada Order</p>
              <h2>Detail order akan muncul setelah customer membuat pesanan.</h2>
            </div>
            <ActionButton href="#/customer/services" variant="dark">
              Buat Pesanan Baru
            </ActionButton>
          </section>
        ) : (
          <section className="customer-order-layout">
            <aside className="service-panel customer-order-sidebar">
              <div className="dashboard-panel__header">
                <div>
                  <p className="section-kicker">Daftar Order</p>
                  <h2>Pesanan Customer</h2>
                </div>
              </div>

              <div className="customer-order-list">
                {orders.map((order) => {
                  const payment = getPaymentForOrder(payments, order.id)

                  return (
                    <button
                      key={order.id}
                      className={`customer-order-list-card ${
                        selectedOrder?.id === order.id ? 'is-active' : ''
                      }`}
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <span>{order.kodeOrder}</span>
                      <strong>{formatRupiah(order.totalHarga)}</strong>
                      <small>
                        {formatDate(order.tanggalOrder)} -{' '}
                        {payment?.status ?? 'Belum bayar'}
                      </small>
                    </button>
                  )
                })}
              </div>
            </aside>

            {selectedOrder ? (
              <article className="service-panel customer-order-detail">
                <div className="customer-order-detail__header">
                  <div>
                    <p className="section-kicker">Kode Order</p>
                    <h2>{selectedOrder.kodeOrder}</h2>
                  </div>
                  <span className={`status-pill status-pill--${getStatusClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="customer-order-info-grid">
                  <div>
                    <span>Tanggal Order</span>
                    <strong>{formatDate(selectedOrder.tanggalOrder)}</strong>
                  </div>
                  <div>
                    <span>Estimasi Selesai</span>
                    <strong>{formatDate(selectedOrder.estimasiSelesai)}</strong>
                  </div>
                  <div>
                    <span>Total Harga</span>
                    <strong>{formatRupiah(selectedOrder.totalHarga)}</strong>
                  </div>
                </div>

                <div className="customer-order-section">
                  <div className="dashboard-panel__header">
                    <div>
                      <p className="section-kicker">Proses Order</p>
                      <h3>Status Pesanan</h3>
                    </div>
                  </div>

                  <div className="customer-order-timeline" aria-label="Status proses order">
                    {ORDER_STEPS.map((step, index) => (
                      <div
                        key={step}
                        className={`customer-order-step ${
                          index <= activeStepIndex ? 'is-complete' : ''
                        }`}
                      >
                        <span>{index + 1}</span>
                        <strong>{step}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="customer-order-section">
                  <div className="dashboard-panel__header">
                    <div>
                      <p className="section-kicker">Layanan</p>
                      <h3>Detail Item</h3>
                    </div>
                  </div>

                  <div className="customer-order-items">
                    {selectedOrder.details.map((detail) => (
                      <div key={detail.id} className="customer-order-item">
                        <div>
                          <span>Nama Layanan</span>
                          <strong>{getServiceName(services, detail)}</strong>
                        </div>
                        <div>
                          <span>Qty</span>
                          <strong>{detail.qty} item</strong>
                        </div>
                        <div>
                          <span>Harga Satuan</span>
                          <strong>{formatRupiah(detail.harga)}</strong>
                        </div>
                        <div>
                          <span>Subtotal</span>
                          <strong>{formatRupiah(detail.subtotal)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="customer-order-two-column">
                  <section className="customer-order-summary-box">
                    <p className="section-kicker">Pickup</p>
                    <h3>Alamat dan Catatan</h3>
                    <p>{selectedOrder.alamatPickup}</p>
                    <small>{selectedOrder.catatan}</small>
                  </section>

                  <section className="customer-order-summary-box">
                    <p className="section-kicker">Pembayaran</p>
                    <h3>{selectedPayment?.metodePembayaran ?? 'Belum Ada Pembayaran'}</h3>
                    <div className="customer-order-payment-row">
                      <span>Status</span>
                      <strong>{selectedPayment?.status ?? 'Menunggu pembayaran'}</strong>
                    </div>
                    <div className="customer-order-payment-row">
                      <span>Total Bayar</span>
                      <strong>{formatRupiah(selectedPayment?.jumlahBayar ?? selectedOrder.totalHarga)}</strong>
                    </div>
                  </section>
                </div>

                <div className="customer-order-customer-box">
                  <p className="section-kicker">Customer</p>
                  <div className="customer-order-customer-grid">
                    <div>
                      <span>Nama</span>
                      <strong>{user.name}</strong>
                    </div>
                    <div>
                      <span>Email</span>
                      <strong>{user.email}</strong>
                    </div>
                    <div>
                      <span>No. HP</span>
                      <strong>{user.noHp}</strong>
                    </div>
                  </div>
                </div>
              </article>
            ) : null}
          </section>
        )}
      </main>
    </div>
  )
}
