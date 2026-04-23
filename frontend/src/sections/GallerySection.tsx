import type { LandingContent } from '../types/content'

type GallerySectionProps = {
  gallery: LandingContent['gallery']
}

export function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section className="gallery-section container">
      <div className="section-heading section-heading--center">
        <p className="section-kicker">HASIL KERJA</p>
        <h2 className="section-title">{gallery.title}</h2>
        <p className="section-description">{gallery.description}</p>
      </div>

      <div className="gallery-grid">
        {gallery.items.map((item) => (
          <article
            key={item.alt}
            className={`gallery-card gallery-card--${item.theme}`}
            aria-label={item.alt}
          />
        ))}
      </div>
    </section>
  )
}
