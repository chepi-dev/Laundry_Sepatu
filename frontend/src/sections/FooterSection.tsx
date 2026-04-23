import type { LandingContent } from '../types/content'

type FooterSectionProps = {
  footer: LandingContent['footer']
}

export function FooterSection({ footer }: FooterSectionProps) {
  return (
    <footer className="site-footer" id="footer">
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
            <h3>Kantor</h3>
            {footer.offices.map((item) => (
              <a key={item.name} href={item.href}>
                {item.name}
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
  )
}
