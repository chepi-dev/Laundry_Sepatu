import { getCustomerDashboardData } from '../../customer-dashboard/api/customerDashboard.repository'

export async function getCustomerServicesData() {
  return getCustomerDashboardData()
}
