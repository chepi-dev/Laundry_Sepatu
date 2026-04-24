import { useEffect, useState, type ChangeEvent } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { formatRupiah } from '../../lib/format'
import { performLogout } from '../auth/lib/logout'
import { getCustomerServicesData } from './api/customerServices.repository'
import {
  appendLocalCustomerOrder,
  clearCustomerPaymentDraft,
  getCustomerPaymentDraft,
} from './lib/customerOrderFlow'
import type { Order, Payment, Service } from '../../types/domain'

const BANK_ACCOUNT_NAME = 'BCA a.n. Shoes and Care'
const BANK_ACCOUNT_NUMBER = '1234567890'

export function CustomerPaymentPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [paymentProofName, setPaymentProofName] = useState('')
  const [paymentProofPreview, setPaymentProofPreview] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
      <div className="service-page service-page--state">
        Data pembayaran belum tersedia. Silakan isi form layanan terlebih dahulu.
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

  const handleConfirmPayment = () => {
    if (!paymentProofName.trim()) {
      setErrorMessage('Isi bukti pembayaran agar order bisa diproses.')
      return
    }

    const formattedToday = new Date().toISOString().slice(0, 10)
    const nextOrderId = Math.max(0, ...orders.map((order) => order.id)) + 1
    const nextPaymentId = Math.max(0, ...payments.map((payment) => payment.id)) + 1
    const nextDetailId =
      Math.max(0, ...orders.flatMap((order) => order.details.map((detail) => detail.id))) + 1
    const nextCodeSuffix = String(nextOrderId).padStart(3, '0')
    const nextOrderCode = `SAC-${formattedToday.replaceAll('-', '').slice(2)}-${nextCodeSuffix}`

    const createdOrder: Order = {
      id: nextOrderId,
      userId: draft.user.id,
      kodeOrder: nextOrderCode,
      tanggalOrder: formattedToday,
      status: 'Diproses',
      totalHarga: draft.totalBayar,
      alamatPickup: draft.alamatPickup,
      catatan: draft.catatan || 'Tidak ada catatan tambahan.',
      estimasiSelesai: formattedToday,
      details: [
        {
          id: nextDetailId,
          orderId: nextOrderId,
          layananId: draft.service.id,
          qty: draft.qty,
          harga: draft.service.harga,
          subtotal: draft.totalBayar,
        },
      ],
    }

    const createdPayment: Payment = {
      id: nextPaymentId,
      orderId: nextOrderId,
      metodePembayaran: 'Transfer Bank',
      status: 'Menunggu Verifikasi',
      jumlahBayar: draft.totalBayar,
      tanggalBayar: formattedToday,
      rekeningTujuan: BANK_ACCOUNT_NUMBER,
      namaBank: BANK_ACCOUNT_NAME,
      buktiPembayaran: paymentProofName,
    }

    appendLocalCustomerOrder(createdOrder, createdPayment)
    clearCustomerPaymentDraft()
    setOrders((currentOrders) => [createdOrder, ...currentOrders])
    setPayments((currentPayments) => [createdPayment, ...currentPayments])
    setPaymentProofName('')
    setPaymentProofPreview('')
    setErrorMessage('')
    setSuccessMessage('Pembayaran berhasil dicatat. Detail order sudah diperbarui.')
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
              <strong>{draft.user.name}</strong>
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
                Konfirmasi Pembayaran
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
                  <span className="status-pill status-pill--menunggu-verifikasi">
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
