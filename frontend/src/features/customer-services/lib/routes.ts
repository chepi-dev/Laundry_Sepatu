export function getCustomerServicesHash(hash: string) {
  if (hash === '#/customer/services') {
    return 'services'
  }

  if (hash === '#/customer/payment') {
    return 'payment'
  }

  if (hash === '#/customer/orders') {
    return 'orders'
  }

  return null
}
