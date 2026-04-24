export type DashboardMode =
  | 'customer'
  | 'admin'
  | 'admin-orders'
  | 'admin-payments'
  | 'admin-services'
  | 'admin-walkin'
  | 'admin-customers'

export function getDashboardHash(hash: string): DashboardMode | null {
  if (hash === '#/dashboard/customer') {
    return 'customer'
  }

  if (hash === '#/dashboard/admin') {
    return 'admin'
  }

  if (hash === '#/dashboard/admin/orders') {
    return 'admin-orders'
  }

  if (hash === '#/dashboard/admin/payments') {
    return 'admin-payments'
  }

  if (hash === '#/dashboard/admin/services') {
    return 'admin-services'
  }

  if (hash === '#/dashboard/admin/walk-in') {
    return 'admin-walkin'
  }

  if (hash === '#/dashboard/admin/customers') {
    return 'admin-customers'
  }

  return null
}
