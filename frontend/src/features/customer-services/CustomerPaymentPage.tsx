import { useEffect, useState, type ChangeEvent } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { createCustomerOrder } from '../customer-dashboard/api/orders.api'
import { createPaymentByOrderId } from '../customer-dashboard/api/payments.api'
import { getCustomerServicesData } from './api/customerServices.repository'
import {
  clearCustomerPaymentDraft,
  getCustomerPaymentDraft,
} from './lib/customerOrderFlow'
import { CustomerNavbar } from './components/CustomerNavbar'
import type { Order, Payment, Service, User } from '../../types/domain'

const BANK_ACCOUNT_NAME = 'BCA a.n. Shoes and Care'
const BANK_ACCOUNT_NUMBER = '1234567890'

export function CustomerPaymentPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [paymentProofName, setPaymentProofName] = useState('')
  const [paymentProofPreview, setPaymentProofPreview] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)

  const draft = getCustomerPaymentDraft()

  useEffect(() => {
    let isMounted = true

    getCustomerServicesData()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setServices(response.services)
        setOrders(response.orders)
        setPayments(response.payments)
        setUser(response.user)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Gagal memuat data pembayaran.'
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

  const orderDetails = orders.map((order) => {
    const payment = payments.find((item) => item.orderId === order.id)

    return {
      ...order,
      payment,
      detailItems: order.details.map((detail) => ({
        ...detail,
        serviceName:
          detail.layananNama ??
          services.find((service) => service.id === detail.layananId)?.namaLayanan ??
          (draft && draft.service.id === detail.layananId
            ? draft.service.namaLayanan
            : `Layanan #${detail.layananId}`),
      })),
    }
  })

  if (isLoading) {
    return <div className="service-page service-page--state">Memuat pembayaran...</div>
  }

  if (loadErrorMessage) {
    return <div className="service-page service-page--state">{loadErrorMessage}</div>
  }

  if (!draft) {
    return (
      <div className="service-page">
        {user ? <CustomerNavbar user={user} activePage="payment" /> : null}
        <main className="service-page--state">
          Data pembayaran belum tersedia. Silakan isi form layanan terlebih dahulu.
        </main>
      </div>
    )
  }

  const handlePaymentProofChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setPaymentProofName('')
      setPaymentProofPreview('')
      return
    }

    setPaymentProofName(file.name)
    setErrorMessage('')

    const reader = new FileReader()
    reader.onload = () => {
      setPaymentProofPreview(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsDataURL(file)
  }

  const handleConfirmPayment = async () => {
    if (!paymentProofName.trim()) {
      setErrorMessage('Isi bukti pembayaran agar order bisa diproses.')
      return
    }

    setIsSubmittingPayment(true)

    try {
      const createdOrder = await createCustomerOrder({
        alamat_pickup: draft.alamatPickup,
        catatan: draft.catatan || undefined,
        layanans: [
          {
            layanan_id: draft.service.id,
            qty: draft.qty,
          },
        ],
      })

      const createdPayment = await createPaymentByOrderId(createdOrder.id, {
        metode_pembayaran: 'Transfer Bank',
      })

      clearCustomerPaymentDraft()
      setOrders((currentOrders) => [createdOrder, ...currentOrders])
      setPayments((currentPayments) => [
        {
          ...createdPayment,
          buktiPembayaran: paymentProofName,
        },
        ...currentPayments,
      ])
      setPaymentProofName('')
      setPaymentProofPreview('')
      setErrorMessage('')
      setSuccessMessage('Order dan pembayaran berhasil dibuat.')
      window.location.hash = '#/customer/orders'
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Order gagal dibuat.'
      setErrorMessage(message)
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  return (
    <div className="service-page">
      <CustomerNavbar user={draft.user} activePage="payment" />

      <main className="service-main container">
        <section className="service-hero">
          <div>
            <p className="section-kicker">Pembayaran Customer</p>
            <h1>Konfirmasi Pembayaran Customer</h1>
            <p>
              Pastikan transfer sudah dilakukan ke rekening yang tertera, lalu unggah
              bukti pembayaran untuk melanjutkan proses order.
            </p>
          </div>
        </section>

        <section className="service-payment-page">
          <article className="service-payment-card">
            <div className="dashboard-panel__header">
              <div>
                <p className="section-kicker">Pembayaran</p>
                <h2>Konfirmasi Pembayaran Customer</h2>
              </div>
            </div>

            {successMessage ? <p className="service-success">{successMessage}</p> : null}
            {errorMessage ? <p className="service-error">{errorMessage}</p> : null}

            <div className="service-payment-card__grid">
              <div className="service-payment-card__info">
                <span>Metode Pembayaran</span>
                <strong>Transfer Bank</strong>
              </div>

              <div className="service-payment-card__info">
                <span>Nomor Rekening</span>
                <strong>{BANK_ACCOUNT_NUMBER}</strong>
                <small>{BANK_ACCOUNT_NAME}</small>
              </div>

              <label className="form-field" htmlFor="payment-proof-page">
                <span>Bukti Pembayaran</span>
                <input
                  id="payment-proof-page"
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentProofChange}
                />
              </label>
            </div>

            {paymentProofPreview ? (
              <div className="service-payment-proof">
                <span>Preview Bukti Pembayaran</span>
                <img src={paymentProofPreview} alt="Preview bukti pembayaran customer" />
                <small>{paymentProofName}</small>
              </div>
            ) : null}

            <div className="service-payment-card__summary">
              <div>
                <span>Layanan</span>
                <strong>{draft.service.namaLayanan}</strong>
              </div>
              <div>
                <span>Jumlah Item</span>
                <strong>{draft.qty}</strong>
              </div>
              <div>
                <span>Total Bayar</span>
                <strong>{formatRupiah(draft.totalBayar)}</strong>
              </div>
            </div>

            <div className="service-panel__actions">
              <button className="auth-submit" type="button" onClick={handleConfirmPayment}>
                {isSubmittingPayment ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </button>
              <ActionButton href="#/customer/services" variant="light">
                Batal
              </ActionButton>
            </div>
          </article>
        </section>

        <section className="service-catalog">
          <div className="dashboard-panel__header">
            <div>
              <p className="section-kicker">Detail Order</p>
              <h2>Hasil Pesanan Setelah Pembayaran</h2>
            </div>
          </div>

          <div className="service-order-list">
            {orderDetails.map((order) => (
              <article key={order.id} className="service-order-card">
                <div className="service-order-card__header">
                  <div>
                    <p className="section-kicker">Order {order.kodeOrder}</p>
                    <h3>Pesanan Customer</h3>
                  </div>
                  <span className={`status-pill status-pill--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="service-order-card__grid">
                  <div>
                    <span>Total Bayar</span>
                    <strong>{formatRupiah(order.totalHarga)}</strong>
                  </div>
                  <div>
                    <span>Layanan</span>
                    <strong>{order.detailItems.length} item</strong>
                  </div>
                  <div>
                    <span>Status Bayar</span>
                    <strong>{order.payment?.status ?? 'Menunggu data pembayaran'}</strong>
                  </div>
                </div>

                <div className="service-order-card__items">
                  {order.detailItems.map((detail) => (
                    <div key={detail.id} className="service-order-item">
                      <div>
                        <span>{detail.serviceName}</span>
                        <strong>{detail.qty} item</strong>
                      </div>
                      <strong>{formatRupiah(detail.subtotal)}</strong>
                    </div>
                  ))}
                </div>

                <div className="service-order-card__summary">
                  <p>{order.catatan}</p>
                  <div className="service-summary-card__meta">
                    <span>{order.tanggalOrder}</span>
                    <span>{order.estimasiSelesai}</span>
                    <span>{order.alamatPickup}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
