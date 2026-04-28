import type { Service, User } from '../../../types/domain'

const PAYMENT_DRAFT_KEY = 'laundry_customer_payment_draft'

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
