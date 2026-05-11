import { getAuthModeFromHash, getOtpFlowFromHash } from './features/auth/lib/auth'
import { getCustomerServicesHash } from './features/customer-services/lib/routes'
import { getDashboardHash } from './features/customer-dashboard/lib/dashboard'
import { landingContent } from './data/landingContent'
import { getAuthToken, hasRoleAccess } from './features/auth/lib/session'
import { BlogSection } from './sections/BlogSection'
import { CtaSection } from './sections/CtaSection'
import { FooterSection } from './sections/FooterSection'
import { GuaranteeSection } from './sections/GuaranteeSection'
import { HeroSection } from './sections/HeroSection'
import { ServicesSection } from './sections/ServicesSection'
import { WorkshopSection } from './sections/WorkshopSection'
import { GallerySection } from './sections/GallerySection'
import './styles/app.css'
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'

const AuthPage = lazy(
  () =>
    import('./features/auth/AuthPage').then((module) => ({
      default: module.AuthPage,
    })),
)
const CustomerDashboardPage = lazy(
  () =>
    import('./features/customer-dashboard/CustomerDashboardPage').then((module) => ({
      default: module.CustomerDashboardPage,
    })),
)
const CustomerOrderDetailPage = lazy(
  () =>
    import('./features/customer-services/CustomerOrderDetailPage').then((module) => ({
      default: module.CustomerOrderDetailPage,
    })),
)
const CustomerPaymentPage = lazy(
  () =>
    import('./features/customer-services/CustomerPaymentPage').then((module) => ({
      default: module.CustomerPaymentPage,
    })),
)
const CustomerServicesPage = lazy(
  () =>
    import('./features/customer-services/CustomerServicesPage').then((module) => ({
      default: module.CustomerServicesPage,
    })),
)
const AdminDashboardPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminDashboardPage').then((module) => ({
      default: module.AdminDashboardPage,
    })),
)
const AdminOrdersPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminOrdersPage').then((module) => ({
      default: module.AdminOrdersPage,
    })),
)
const AdminCompletedOrdersPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminCompletedOrdersPage').then((module) => ({
      default: module.AdminCompletedOrdersPage,
    })),
)
const AdminPaymentsPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminPaymentsPage').then((module) => ({
      default: module.AdminPaymentsPage,
    })),
)
const AdminServicesPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminServicesPage').then((module) => ({
      default: module.AdminServicesPage,
    })),
)
const AdminWalkInPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminWalkInPage').then((module) => ({
      default: module.AdminWalkInPage,
    })),
)
const AdminCustomersPage = lazy(
  () =>
    import('./features/admin-dashboard/AdminCustomersPage').then((module) => ({
      default: module.AdminCustomersPage,
    })),
)

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const authMode = getAuthModeFromHash(hash)
  const otpFlow = getOtpFlowFromHash(hash)
  const servicesMode = getCustomerServicesHash(hash)
  const dashboardMode = getDashboardHash(hash)

  const renderPage = (page: ReactNode) => (
    <Suspense fallback={<div className="page-loading">Loading...</div>}>
      {page}
    </Suspense>
  )

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (authMode) {
    return renderPage(<AuthPage mode={authMode} otpFlow={otpFlow} footer={landingContent.footer} />)
  }

  if (servicesMode === 'services') {
    return renderPage(<CustomerServicesPage />)
  }

  if (servicesMode === 'payment') {
    return renderPage(<CustomerPaymentPage />)
  }

  if (servicesMode === 'orders') {
    return renderPage(<CustomerOrderDetailPage />)
  }

  if (dashboardMode === 'customer') {
    return renderPage(<CustomerDashboardPage />)
  }

  if (dashboardMode === 'admin') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminDashboardPage />)
  }

  if (dashboardMode === 'admin-orders') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminOrdersPage />)
  }

  if (dashboardMode === 'admin-completed-orders') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminCompletedOrdersPage />)
  }

  if (dashboardMode === 'admin-payments') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminPaymentsPage />)
  }

  if (dashboardMode === 'admin-services') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminServicesPage />)
  }

  if (dashboardMode === 'admin-walkin') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminWalkInPage />)
  }

  if (dashboardMode === 'admin-customers') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return renderPage(<AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />)
    }

    return renderPage(<AdminCustomersPage />)
  }

  return (
    <div className="page-shell">
      <HeroSection
        announcement={landingContent.announcement}
        navigation={landingContent.navigation}
        hero={landingContent.hero}
      />

      <main>
        <GuaranteeSection guarantees={landingContent.guarantees} />
        <ServicesSection services={landingContent.services} />
        <WorkshopSection workshops={landingContent.workshops} />
        <GallerySection gallery={landingContent.gallery} />
        <BlogSection blog={landingContent.blog} />
        <CtaSection cta={landingContent.cta} />
      </main>

      <FooterSection footer={landingContent.footer} />
    </div>
  )
}

export default App
