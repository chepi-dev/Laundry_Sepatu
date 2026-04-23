import { ActionButton } from '../components/ui/ActionButton'
import type { LandingContent } from '../types/content'

type HeroSectionProps = {
  announcement: LandingContent['announcement']
  navigation: LandingContent['navigation']
  hero: LandingContent['hero']
}

export function HeroSection({
  announcement,
  navigation,
  hero,
}: HeroSectionProps) {
  return (
    <>
      <div className="announcement-bar">
        <p>{announcement.text}</p>
        {announcement.ctaLabel ? (
          <a href={announcement.href}>{announcement.ctaLabel}</a>
        ) : null}
      </div>

      <header className="site-header">
        <a className="brand-mark" href="#beranda" aria-label="Shoes and Care">
          <span>SHOES</span>
          <span>AND</span>
          <span>CARE</span>
        </a>

        <nav className="main-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <ActionButton href="#/auth/login" variant="gold" small>
          Masuk
        </ActionButton>
      </header>

      <section className="hero-section" id="beranda">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="hero-copy">{hero.description}</p>

          <div className="hero-actions">
            <ActionButton href={hero.primaryHref} variant="gold">
              {hero.primaryLabel}
            </ActionButton>
            <ActionButton href={hero.secondaryHref} variant="dark">
              {hero.secondaryLabel}
            </ActionButton>
          </div>
        </div>
      </section>
    </>
  )
}
