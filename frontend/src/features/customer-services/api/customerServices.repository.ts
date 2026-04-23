// API-INTEGRATION:
// Route backend yang sudah tersedia untuk halaman ini:
// GET /me
// GET /layanan

import { getCurrentUser } from '../../../api/auth.api'
import { mapServiceApiToModel, mapUserApiToModel } from '../../../api/mappers'
import { getServices } from '../../../api/services.api'

export async function getCustomerServicesData() {
  const [user, services] = await Promise.all([getCurrentUser(), getServices()])

  return {
    user: mapUserApiToModel(user),
    services: services.map(mapServiceApiToModel),
  }
}
