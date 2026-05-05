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
import type { User } from '../../types/domain'

const BANK_ACCOUNT_NAME = 'BCA a.n. Shoes and Care'
const BANK_ACCOUNT_NUMBER = '1234567890'

export function CustomerPaymentPage() {
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

  if (isLoading) {
    return <div className="service-page service-page--state">Memuat pembayaran...</div>
  }

  if (loadErrorMessage) {
    return <div className="service-page service-page--state">{loadErrorMessage}</div>
  }

  if (!draft) {
    return (
      <div className="service-page">
        {user ? (
          <CustomerNavbar user={user} activePage="payment" onUserUpdated={setUser} />
        ) : null}
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

      await createPaymentByOrderId(createdOrder.id, {
        metode_pembayaran: 'Transfer Bank',
      })

      clearCustomerPaymentDraft()
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
      <CustomerNavbar
        user={user ?? draft.user}
        activePage="payment"
        onUserUpdated={setUser}
      />

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
      </main>
    </div>
  )
}
