import { useState, type FormEvent } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { FormField } from '../../components/ui/FormField'
import type { LandingContent } from '../../types/content'
import type { AuthMode, OtpFlow } from '../../types/auth'
import { login, register, sendOtp, verifyOtp } from './api/auth.api'
import { setSessionUser } from './lib/session'

type AuthPageProps = {
  mode: AuthMode
  otpFlow: OtpFlow | null
  footer: LandingContent['footer']
}

type PendingOtpPayload = {
  flow: OtpFlow
  name?: string
  email: string
  password?: string
  phone?: string
  address?: string
}

const OTP_STORAGE_KEY = 'laundry_pending_otp'

const authContent = {
  login: {
    eyebrow: 'Member Access',
    title: 'Masuk ke Akun',
    description:
      'Masuk untuk melihat layanan, mengecek pesanan, dan mengakses dashboard sesuai peran akun kamu.',
    submitLabel: 'Masuk Sekarang',
  },
  register: {
    eyebrow: 'Registrasi Akun',
    title: 'Daftar Akun Baru',
    description:
      'Lengkapi data akun terlebih dahulu, lalu lanjutkan verifikasi OTP pada halaman yang sama dengan proses pemulihan password.',
    submitLabel: 'Daftar Sekarang',
  },
  'forgot-password': {
    eyebrow: 'Pemulihan Akun',
    title: 'Lupa Password',
    description:
      'Masukkan email terdaftar untuk melanjutkan verifikasi OTP sebelum proses pemulihan akun.',
    submitLabel: 'Kirim Kode OTP',
  },
  'verify-email': {
    eyebrow: 'Verifikasi Email',
    title: 'Verifikasi Email Akun',
    description:
      'Masukkan kode verifikasi yang dikirim ke email agar pendaftaran akun bisa diselesaikan.',
    submitLabel: 'Verifikasi Email',
  },
  'send-otp': {
    eyebrow: 'Verifikasi OTP',
    title: 'Masukkan Kode OTP',
    description:
      'Halaman ini dipakai bersama untuk verifikasi pendaftaran akun baru maupun pemulihan password.',
    submitLabel: 'Verifikasi OTP',
  },
} as const

function savePendingOtp(payload: PendingOtpPayload) {
  window.sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(payload))
}

function getPendingOtp(): PendingOtpPayload | null {
  const rawValue = window.sessionStorage.getItem(OTP_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as PendingOtpPayload
  } catch {
    return null
  }
}

function clearPendingOtp() {
  window.sessionStorage.removeItem(OTP_STORAGE_KEY)
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses permintaan.'
}

export function AuthPage({ mode, otpFlow, footer }: AuthPageProps) {
  const content = authContent[mode]
  const pendingOtp = mode === 'send-otp' || mode === 'verify-email' ? getPendingOtp() : null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
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

      if (mode === 'register') {
        await sendOtp({ email })
        savePendingOtp({
          flow: 'register',
          name,
          email,
          password,
          phone,
          address,
        })
        window.location.hash = '#/auth/verify-email/register'
        return
      }

      if (mode === 'forgot-password') {
        await sendOtp({ email })
        savePendingOtp({
          flow: 'forgot-password',
          email,
        })
        window.location.hash = '#/auth/send-otp/forgot-password'
        return
      }

      if (!pendingOtp || !otpFlow || pendingOtp.flow !== otpFlow) {
        throw new Error('Data OTP tidak ditemukan. Silakan ulangi proses dari awal.')
      }

      const normalizedOtpCode = otpCode.trim()

      if (normalizedOtpCode.length < 4) {
        throw new Error('Kode OTP harus diisi terlebih dahulu.')
      }

      await verifyOtp({
        email: pendingOtp.email,
        otp_code: normalizedOtpCode,
      })

      if (pendingOtp.flow === 'register') {
        const response = await register({
          name: pendingOtp.name ?? '',
          email: pendingOtp.email,
          password: pendingOtp.password ?? '',
          no_hp: pendingOtp.phone ?? '',
          alamat: pendingOtp.address ?? '',
          role: 'customer',
        })

        clearPendingOtp()
        setSessionUser(response.user)

        if (response.user.role === 'admin') {
          window.location.hash = '#/dashboard/admin'
          return
        }

        window.location.hash = '#/customer/services'
        return
      }

      clearPendingOtp()
      window.alert(
        'Verifikasi OTP berhasil. Alur reset password siap dilanjutkan setelah endpoint backend ditambahkan.',
      )
      window.location.hash = '#/auth/login'
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)

      if (mode === 'login') {
        window.alert(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!pendingOtp || !otpFlow || pendingOtp.flow !== otpFlow) {
      setErrorMessage('Data OTP tidak ditemukan. Silakan ulangi proses dari awal.')
      return
    }

    setIsResending(true)

    try {
      const response = await sendOtp({ email: pendingOtp.email })
      setSuccessMessage(response.message || 'Kode OTP baru sudah dikirim ke email Anda.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsResending(false)
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
          </div>

          <div className="auth-card">
            <div className="auth-tabs" aria-label="Navigasi auth">
              <a className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`} href="#/auth/login">
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

              {mode === 'verify-email' ? (
                <>
                  
                  <FormField
                    id="verify-email-code"
                    label="Kode Verifikasi"
                    placeholder="Masukkan kode verifikasi email"
                    value={otpCode}
                    onChange={setOtpCode}
                  />
                  <div className="auth-meta-links">
                    <a href="#/auth/register">Kembali ke formulir daftar</a>
                    <button
                      type="button"
                      disabled={isSubmitting || isResending}
                      onClick={handleResendOtp}
                    >
                      {isResending ? 'Mengirim...' : 'Kirim ulang kode'}
                    </button>
                  </div>
                </>
              ) : null}

              {mode === 'send-otp' ? (
                <>
                  
                  <FormField
                    id="otp-code"
                    label="Kode OTP"
                    placeholder="Masukkan kode OTP"
                    value={otpCode}
                    onChange={setOtpCode}
                  />
                  <div className="auth-meta-links">
                    <a href="#/auth/forgot-password">Kembali ke formulir sebelumnya</a>
                    <button
                      type="button"
                      disabled={isSubmitting || isResending}
                      onClick={handleResendOtp}
                    >
                      {isResending ? 'Mengirim...' : 'Kirim ulang OTP'}
                    </button>
                  </div>
                </>
              ) : null}

              {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
              {successMessage ? <p className="auth-success">{successMessage}</p> : null}

              <button className="auth-submit" type="submit" disabled={isSubmitting || isResending}>
                {isSubmitting ? 'Memproses...' : content.submitLabel}
              </button>

              <ActionButton href="#beranda" variant="light">
                Kembali ke Beranda
              </ActionButton>
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
