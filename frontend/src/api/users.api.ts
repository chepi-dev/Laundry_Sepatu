// API-INTEGRATION:
// Pada route Laravel yang dibagikan user, endpoint user yang tersedia adalah `/me`.
// Karena itu file ini difokuskan ke data user yang sedang login.

import { apiRequest } from './http'
import type { ApiUser } from '../types/api'

export function getMyProfile() {
  return apiRequest<ApiUser>('/me')
}
