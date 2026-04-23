import { ActionButton } from '../components/ui/ActionButton'
import type { LandingContent } from '../types/content'

type WorkshopSectionProps = {
  workshops: LandingContent['workshops']
}

export function WorkshopSection({ workshops }: WorkshopSectionProps) {
  return (
    <section className="workshop-section" id="lokasi">
      <div className="container">
        <div className="section-heading section-heading--center">
          <p className="section-kicker section-kicker--dark">CABANG</p>
          <h2 className="section-title workshop-title">{workshops.title}</h2>
          <p className="section-description workshop-description">
            {workshops.description}
          </p>

          <div className="filter-row" aria-label="Filter lokasi">
            {workshops.filters.map((filter, index) => (
              <button
                key={filter}
                className={`filter-chip ${index === 0 ? 'is-active' : ''}`}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="workshop-grid">
          {workshops.items.map((shop) => (
            <article key={shop.name} className="workshop-card">
              <p className="workshop-city">{shop.city}</p>
              <h3>{shop.name}</h3>
              <p className="workshop-hours">{shop.hours}</p>
              <a href={shop.mapHref} className="workshop-link">
                Lokasi
              </a>
              <ActionButton href={shop.whatsappHref} variant="gold" small>
                WhatsApp
              </ActionButton>
            </article>
          ))}
        </div>

        <div className="section-footer-action">
          <ActionButton href="#footer" variant="light">
            Lihat Semua Toko
          </ActionButton>
        </div>
      </div>
    </section>
  )
}
