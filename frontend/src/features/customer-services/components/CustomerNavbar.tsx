import { useEffect, useState } from 'react'
import { ActionButton } from '../../../components/ui/ActionButton'
import type { User } from '../../../types/domain'
import { performLogout } from '../../auth/lib/logout'
import { CustomerProfilePopover } from './CustomerProfilePopover'

export type CustomerNavbarPage = 'dashboard' | 'services' | 'payment' | 'orders'

const customerNavItems: Array<{
  page: CustomerNavbarPage
  href: string
  label: string
}> = [
  {
    page: 'dashboard',
    href: '#/dashboard/customer',
    label: 'Dashboard',
  },
  {
    page: 'services',
    href: '#/customer/services',
    label: 'Layanan',
  },
  {
    page: 'payment',
    href: '#/customer/payment',
    label: 'Pembayaran',
  },
  {
    page: 'orders',
    href: '#/customer/orders',
    label: 'Detail Order',
  },
]

type CustomerNavbarProps = {
  user: User
  activePage: CustomerNavbarPage
  onUserUpdated?: (user: User) => void
}

export function CustomerNavbar({ user, activePage, onUserUpdated }: CustomerNavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profileUser, setProfileUser] = useState(user)

  useEffect(() => {
    setProfileUser(user)
  }, [user])

  const handleUserUpdated = (updatedUser: User) => {
    setProfileUser(updatedUser)
    onUserUpdated?.(updatedUser)
  }

  return (
    <header className="service-header customer-navbar">
      <div className="container service-header__inner customer-navbar__inner">
        <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
          <span>SHOES</span>
          <span>AND</span>
          <span>CARE</span>
        </a>

        <nav className="customer-navbar__nav" aria-label="Menu customer">
          {customerNavItems.map((item) => (
            <a
              key={item.page}
              className={item.page === activePage ? 'is-active' : ''}
              href={item.href}
              aria-current={item.page === activePage ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="service-header__account customer-navbar__actions">
          <CustomerProfilePopover
            user={profileUser}
            isOpen={isProfileOpen}
            onToggle={() => setIsProfileOpen((current) => !current)}
            onUserUpdated={handleUserUpdated}
          />
          <ActionButton variant="dark" small onClick={() => void performLogout()}>
            Logout
          </ActionButton>
        </div>
      </div>
    </header>
  )
}
