import { getAuthModeFromHash, getOtpFlowFromHash } from './features/auth/lib/auth'
import { AuthPage } from './features/auth/AuthPage'
import { AdminCustomersPage } from './features/admin-dashboard/AdminCustomersPage'
import { AdminDashboardPage } from './features/admin-dashboard/AdminDashboardPage'
import { AdminOrdersPage } from './features/admin-dashboard/AdminOrdersPage'
import { AdminPaymentsPage } from './features/admin-dashboard/AdminPaymentsPage'
import { AdminServicesPage } from './features/admin-dashboard/AdminServicesPage'
import { AdminWalkInPage } from './features/admin-dashboard/AdminWalkInPage'
import { CustomerOrderDetailPage } from './features/customer-services/CustomerOrderDetailPage'
import { CustomerPaymentPage } from './features/customer-services/CustomerPaymentPage'
import { CustomerServicesPage } from './features/customer-services/CustomerServicesPage'
import { getCustomerServicesHash } from './features/customer-services/lib/routes'
import { CustomerDashboardPage } from './features/customer-dashboard/CustomerDashboardPage'
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
import { useEffect, useState } from 'react'

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const authMode = getAuthModeFromHash(hash)
  const otpFlow = getOtpFlowFromHash(hash)
  const servicesMode = getCustomerServicesHash(hash)
  const dashboardMode = getDashboardHash(hash)

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
    return <AuthPage mode={authMode} otpFlow={otpFlow} footer={landingContent.footer} />
  }

  if (servicesMode === 'services') {
    return <CustomerServicesPage />
  }

  if (servicesMode === 'payment') {
    return <CustomerPaymentPage />
  }

  if (servicesMode === 'orders') {
    return <CustomerOrderDetailPage />
  }

  if (dashboardMode === 'customer') {
    return <CustomerDashboardPage />
  }

  if (dashboardMode === 'admin') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminDashboardPage />
  }

  if (dashboardMode === 'admin-orders') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminOrdersPage />
  }

  if (dashboardMode === 'admin-payments') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminPaymentsPage />
  }

  if (dashboardMode === 'admin-services') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminServicesPage />
  }

  if (dashboardMode === 'admin-walkin') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminWalkInPage />
  }

  if (dashboardMode === 'admin-customers') {
    if (!getAuthToken() || !hasRoleAccess('admin')) {
      return <AuthPage mode="login" otpFlow={null} footer={landingContent.footer} />
    }

    return <AdminCustomersPage />
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
