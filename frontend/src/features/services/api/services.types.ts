export type ApiService = {
  id: number
  nama_layanan: string
  harga: string | number
  deskripsi: string | null
}

export type ServiceListResponse = {
  data: ApiService[]
  success?: boolean
}

export type ServiceDetailResponse = {
  data: ApiService
  success?: boolean
  massage?: string
}

export type ServicePayload = {
  nama_layanan: string
  harga: number
  deskripsi?: string
}
