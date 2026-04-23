import { useState, type FormEvent } from 'react'
import { login, logout, register } from '../../api/auth.api'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import type { LandingContent } from '../../types/content'
import type { AuthMode } from '../../types/auth'
import { clearSessionUser, setSessionUser } from './lib/session'

type AuthPageProps = {
  mode: AuthMode
  footer: LandingContent['footer']
}

const authContent = {
  login: {
    eyebrow: 'Member Access',
    title: 'Masuk ke Akun',
    description:
      'Masuk untuk cek layanan, lanjutkan pemesanan, dan kelola data perawatan sepatu kamu.',
    submitLabel: 'Masuk Sekarang',
  },
  register: {
    eyebrow: 'Create Account',
    title: 'Daftar Akun Baru',
    description:
      'Buat akun untuk menikmati proses pemesanan yang lebih cepat, rapi, dan mudah dilacak.',
    submitLabel: 'Buat Akun',
  },
  'forgot-password': {
    eyebrow: 'Account Recovery',
    title: 'Lupa Password',
    description:
      'Masukkan email yang terdaftar. Kami akan kirim instruksi reset password ke email tersebut.',
    submitLabel: 'Kirim Link Reset',
  },
} as const

export function AuthPage({ mode, footer }: AuthPageProps) {
  const content = authContent[mode]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'register') {
        const response = await register({
          name,
          email,
          password,
          no_hp: phone,
          alamat: address,
          role: 'customer',
        })

        if (response.user) {
          setSessionUser(response.user)
        }

        window.location.hash = '#/auth/login'
        return
      }

      if (mode === 'login') {
        const response = await login({ email, password })
        setSessionUser(response.user)

        if (response.user.role === 'admin') {
          window.location.hash = '#/dashboard/admin'
          return
        }

        window.location.hash = '#/customer/services'
        return
      }

      if (mode === 'forgot-password') {
        clearSessionUser()
        await logout().catch(() => undefined)
        window.location.hash = '#/auth/login'
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses permintaan.'
      setErrorMessage(message)

      if (mode === 'login') {
        window.alert('Email atau password salah. Silakan periksa kembali.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero__glow auth-hero__glow--left" />
        <div className="auth-hero__glow auth-hero__glow--right" />

        <div className="container auth-shell">
          <div className="auth-branding">
            <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
              <span>SHOES</span>
              <span>AND</span>
              <span>CARE</span>
            </a>

            <p className="section-kicker">{content.eyebrow}</p>
            <h1 className="auth-title">{content.title}</h1>
            <p className="auth-description">{content.description}</p>

            <div className="auth-points">
              <div className="auth-point">
                <strong>Desain Konsisten</strong>
                <span>Selaras dengan landing page utama yang sudah final.</span>
              </div>
              <div className="auth-point">
                <strong>Form Lebih Rapi</strong>
                <span>Setiap kebutuhan auth dipisah dengan alur yang jelas.</span>
              </div>
              <div className="auth-point">
                <strong>Mudah Dilanjutkan</strong>
                <span>Siap dihubungkan ke backend atau API auth berikutnya.</span>
              </div>
            </div>

            <ActionButton href="#beranda" variant="light">
              Kembali ke Beranda
            </ActionButton>
          </div>

          <div className="auth-card">
            <div className="auth-tabs" aria-label="Navigasi auth">
              <a
                className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`}
                href="#/auth/login"
              >
                Login
              </a>
              <a
                className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`}
                href="#/auth/register"
              >
                Register
              </a>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <>
                  <FormField
                    id="register-name"
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    value={name}
                    onChange={setName}
                  />
                  <FormField
                    id="register-email"
                    label="Email"
                    type="email"
                    placeholder="Masukkan email aktif"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <FormField
                    id="register-password"
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    autoComplete="new-password"
                    value={password}
                    onChange={setPassword}
                  />
                  <FormField
                    id="register-phone"
                    label="No. HP"
                    type="tel"
                    placeholder="Masukkan nomor handphone"
                    autoComplete="tel"
                    value={phone}
                    onChange={setPhone}
                  />
                  <FormField
                    id="register-address"
                    label="Alamat"
                    placeholder="Masukkan alamat lengkap"
                    as="textarea"
                    value={address}
                    onChange={setAddress}
                  />
                </>
              ) : null}

              {mode === 'login' ? (
                <>
                  <FormField
                    id="login-email"
                    label="Email"
                    type="email"
                    placeholder="Masukkan email"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <FormField
                    id="login-password"
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    value={password}
                    onChange={setPassword}
                  />
                  <div className="auth-meta-links">
                    <a href="#/auth/forgot-password">Lupa password?</a>
                  </div>
                </>
              ) : null}

              {mode === 'forgot-password' ? (
                <>
                  <FormField
                    id="forgot-email"
                    label="Email"
                    type="email"
                    placeholder="Masukkan email yang terdaftar"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <div className="auth-meta-links">
                    <a href="#/auth/login">Kembali ke login</a>
                  </div>
                </>
              ) : null}

              {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

              <button className="auth-submit" type="submit">
                {isSubmitting ? 'Memproses...' : content.submitLabel}
              </button>
            </form>

          </div>
        </div>
      </section>

      <footer className="site-footer auth-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <div className="brand-mark brand-mark--footer" aria-hidden="true">
              <span>SHOES</span>
              <span>AND</span>
              <span>CARE</span>
            </div>
            <p>{footer.description}</p>
          </div>

          <div className="footer-columns">
            <div>
              <h3>Kontak</h3>
              {footer.contacts.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>

            <div>
              <h3>Auth</h3>
              {footer.authLinks.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>

            <div>
              <h3>Navigasi</h3>
              {footer.links.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>{footer.copyright}</p>
          <div className="social-row" aria-label="Sosial media">
            {footer.socials.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label}>
                {item.shortLabel}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
