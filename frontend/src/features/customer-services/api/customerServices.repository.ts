import { getCurrentUser } from '../../auth/api/auth.api'
import { getServices } from '../../services/api/services.api'
import type { Service, User } from '../../../types/domain'

export async function getCustomerServicesData(): Promise<{ user: User; services: Service[] }> {
  const [user, services] = await Promise.all([getCurrentUser(), getServices()])

  return {
    user,
    services,
  }
}
