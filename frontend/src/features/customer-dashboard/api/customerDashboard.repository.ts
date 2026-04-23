// API-INTEGRATION:
// Repository ini adalah pintu masuk data untuk halaman dashboard customer.
// Saat Laravel siap, file ini yang paling aman diganti lebih dulu:
// ambil `users`, `layanans`, `orders`, `order_details`, dan `pembayarans`,
// lalu satukan hasilnya ke format yang dipakai UI.

import { customerDashboardMock } from '../../../mocks/customerDashboard.mock'
import type { CustomerDashboardData } from '../../../types/domain'

export function getCustomerDashboardData(): CustomerDashboardData {
  return customerDashboardMock
}
