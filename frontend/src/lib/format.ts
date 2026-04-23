const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(value: number) {
  if (value === 0) {
    return 'Gratis'
  }

  return rupiahFormatter.format(value).replace('IDR', 'Rp')
}
