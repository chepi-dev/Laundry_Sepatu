import type { Order, Payment, Service, User } from '../../../types/domain'

const PAYMENT_DRAFT_KEY = 'laundry_customer_payment_draft'
const LOCAL_ORDERS_KEY = 'laundry_customer_local_orders'
const LOCAL_PAYMENTS_KEY = 'laundry_customer_local_payments'

export type CustomerPaymentDraft = {
  user: User
  service: Service
  qty: number
  alamatPickup: string
  catatan: string
  totalBayar: number
}

function readStorageItem<T>(key: string, fallback: T): T {
  const rawValue = window.sessionStorage.getItem(key)

  if (!rawValue) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export function saveCustomerPaymentDraft(draft: CustomerPaymentDraft) {
  window.sessionStorage.setItem(PAYMENT_DRAFT_KEY, JSON.stringify(draft))
}

export function getCustomerPaymentDraft() {
  return readStorageItem<CustomerPaymentDraft | null>(PAYMENT_DRAFT_KEY, null)
}

export function clearCustomerPaymentDraft() {
  window.sessionStorage.removeItem(PAYMENT_DRAFT_KEY)
}

export function appendLocalCustomerOrder(order: Order, payment: Payment) {
  const currentOrders = readStorageItem<Order[]>(LOCAL_ORDERS_KEY, [])
  const currentPayments = readStorageItem<Payment[]>(LOCAL_PAYMENTS_KEY, [])

  window.sessionStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...currentOrders]))
  window.sessionStorage.setItem(LOCAL_PAYMENTS_KEY, JSON.stringify([payment, ...currentPayments]))
}

export function getLocalCustomerOrders() {
  return readStorageItem<Order[]>(LOCAL_ORDERS_KEY, [])
}

export function getLocalCustomerPayments() {
  return readStorageItem<Payment[]>(LOCAL_PAYMENTS_KEY, [])
}
