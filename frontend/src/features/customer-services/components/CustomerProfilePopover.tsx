import type { User } from '../../../types/domain'

type CustomerProfilePopoverProps = {
  user: User
  isOpen: boolean
  onToggle: () => void
}

export function CustomerProfilePopover({
  user,
  isOpen,
  onToggle,
}: CustomerProfilePopoverProps) {
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
            <p className="section-kicker">Profil Customer</p>
            <h3>{user.name}</h3>
          </div>

          <div className="customer-profile-popover__rows">
            <div className="customer-profile-popover__row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="customer-profile-popover__row">
              <span>No. HP</span>
              <strong>{user.noHp}</strong>
            </div>
            <div className="customer-profile-popover__row customer-profile-popover__row--stack">
              <span>Alamat</span>
              <strong>{user.alamat}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
