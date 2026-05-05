import { useEffect, useState, type FormEvent } from 'react'
import type { User } from '../../../types/domain'
import { updateCurrentUserProfile } from '../../auth/api/auth.api'

type CustomerProfilePopoverProps = {
  user: User
  isOpen: boolean
  onToggle: () => void
  onUserUpdated: (user: User) => void
}

export function CustomerProfilePopover({
  user,
  isOpen,
  onToggle,
  onUserUpdated,
}: CustomerProfilePopoverProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.noHp ?? '')
  const [alamat, setAlamat] = useState(user.alamat ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setName(user.name)
    setPhone(user.noHp ?? '')
    setAlamat(user.alamat ?? '')
  }, [user.name, user.noHp, user.alamat])

  const handleCancelEdit = () => {
    setIsEditing(false)
    setName(user.name)
    setPhone(user.noHp ?? '')
    setAlamat(user.alamat ?? '')
    setErrorMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    const trimmedAlamat = alamat.trim()

    if (!trimmedName) {
      setErrorMessage('Nama wajib diisi.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const updatedUser = await updateCurrentUserProfile({
        name: trimmedName,
        no_hp: trimmedPhone,
        alamat: trimmedAlamat,
      })

      onUserUpdated(updatedUser)
      setIsEditing(false)
      setSuccessMessage('Profil berhasil diperbarui.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profil gagal diperbarui.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="service-header__profile">
      <button
        className={`service-header__profile-trigger ${isOpen ? 'is-open' : ''}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <strong>{user.name}</strong>
      </button>

      {isOpen ? (
        <div className="customer-profile-popover">
          <div className="customer-profile-popover__header">
            <div>
              <p className="section-kicker">Profil Customer</p>
              <h3>{user.name}</h3>
            </div>

            {!isEditing ? (
              <button
                className="customer-profile-popover__edit"
                type="button"
                onClick={() => {
                  setIsEditing(true)
                  setSuccessMessage('')
                }}
              >
                Edit
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <form className="customer-profile-popover__form" onSubmit={handleSubmit}>
              <label className="form-field" htmlFor="customer-profile-name">
                <span>Nama</span>
                <input
                  id="customer-profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className="form-field" htmlFor="customer-profile-phone">
                <span>No. HP</span>
                <input
                  id="customer-profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>

              <label className="form-field" htmlFor="customer-profile-alamat">
                <span>Alamat</span>
                <textarea
                  id="customer-profile-alamat"
                  value={alamat}
                  onChange={(event) => setAlamat(event.target.value)}
                />
              </label>

              {errorMessage ? <p className="service-error">{errorMessage}</p> : null}

              <div className="customer-profile-popover__actions">
                <button className="admin-payment-action" type="submit" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>

                <button
                  className="service-select-button"
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <>
              {successMessage ? <p className="service-success">{successMessage}</p> : null}

              <div className="customer-profile-popover__rows">
                <div className="customer-profile-popover__row">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="customer-profile-popover__row">
                  <span>No. HP</span>
                  <strong>{user.noHp || '-'}</strong>
                </div>

                <div className="customer-profile-popover__row customer-profile-popover__row--stack">
                  <span>Alamat</span>
                  <strong>{user.alamat || '-'}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}