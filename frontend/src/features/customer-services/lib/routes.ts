export function getCustomerServicesHash(hash: string) {
  if (hash === '#/customer/services') {
    return 'services'
  }

  if (hash === '#/customer/payment') {
    return 'payment'
  }

  return null
}
