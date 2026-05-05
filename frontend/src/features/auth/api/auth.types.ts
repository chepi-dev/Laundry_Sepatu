import type { UserRole } from '../../../types/domain'

export type AuthApiUser = {
  id: number
  name: string
  email: string
  role: UserRole
  no_hp: string | null
  alamat: string | null
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  no_hp: string
  alamat: string
  role?: UserRole
}

export type UpdateProfilePayload = {
  name: string
  no_hp: string
}

export type AuthResponse = {
  user: AuthApiUser
  access_token?: string
  token_type?: string
  message?: string
  massage?: string
}

export type SendOtpPayload = {
  email: string
}

export type VerifyOtpPayload = {
  email: string
  otp_code: string
}

export type OtpResponse = {
  success: boolean
  message: string
  data?: {
    email?: string
    expired_at?: string
  }
}
