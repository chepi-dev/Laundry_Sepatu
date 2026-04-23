import { IconBadge } from '../components/ui/IconBadge'
import type { LandingContent } from '../types/content'

type GuaranteeSectionProps = {
  guarantees: LandingContent['guarantees']
}

export function GuaranteeSection({ guarantees }: GuaranteeSectionProps) {
  return (
    <section className="guarantee-section" id="tentang">
      <div className="container">
        <p className="section-kicker">WHY CHOOSE US</p>
        <h2 className="section-title section-title--light">{guarantees.title}</h2>
        <p className="section-description section-description--light">
          {guarantees.description}
        </p>

        <div className="guarantee-grid">
          {guarantees.items.map((item) => (
            <article key={item.title} className="guarantee-card">
              <IconBadge icon={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
