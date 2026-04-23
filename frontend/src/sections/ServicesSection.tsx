import { ActionButton } from '../components/ui/ActionButton'
import { formatRupiah } from '../lib/format'
import type { LandingContent } from '../types/content'

type ServicesSectionProps = {
  services: LandingContent['services']
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="services-section container" id="layanan">
      <div className="section-heading section-heading--split">
        <div>
          <p className="section-kicker">LAYANAN</p>
          <h2 className="section-title">{services.title}</h2>
          <p className="section-description">{services.description}</p>
        </div>

        <ActionButton href="#blog" variant="gold">
          Lihat Daftar Menu
        </ActionButton>
      </div>

      <div className="services-grid">
        {services.items.map((service) => (
          <article key={service.title} className="service-card">
            <div
              className={`service-media service-media--${service.theme}`}
              aria-hidden="true"
            />
            <div className="service-body">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-meta">
                <span>Mulai dari</span>
                <strong>{formatRupiah(service.price)}</strong>
              </div>

              {service.ctaLabel ? (
                <ActionButton href={service.href} variant="dark" small>
                  {service.ctaLabel}
                </ActionButton>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
