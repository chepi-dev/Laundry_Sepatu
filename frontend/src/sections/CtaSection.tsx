import { ActionButton } from '../components/ui/ActionButton'
import type { LandingContent } from '../types/content'

type CtaSectionProps = {
  cta: LandingContent['cta']
}

export function CtaSection({ cta }: CtaSectionProps) {
  return (
    <section className="cta-section" id="pickup">
      <div className="container cta-content">
        <h2>{cta.title}</h2>
        <p>{cta.description}</p>
        <ActionButton href={cta.href} variant="light">
          {cta.label}
        </ActionButton>
      </div>
    </section>
  )
}
