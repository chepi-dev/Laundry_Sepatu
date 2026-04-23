export type DashboardMode = 'customer' | 'admin' | 'admin-walkin' | 'admin-customers'

export function getDashboardHash(hash: string): DashboardMode | null {
  if (hash === '#/dashboard/customer') {
    return 'customer'
  }

  if (hash === '#/dashboard/admin') {
    return 'admin'
  }

  if (hash === '#/dashboard/admin/walk-in') {
    return 'admin-walkin'
  }

  if (hash === '#/dashboard/admin/customers') {
    return 'admin-customers'
  }

  return null
}
