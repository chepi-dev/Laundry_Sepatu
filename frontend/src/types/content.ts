type LinkItem = {
  label: string
  href: string
}

type AuthLinkItem = {
  label: string
  href: string
}

type HeroContent = {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

type GuaranteeItem = {
  icon: 'shield' | 'support' | 'delivery' | 'guarantee'
  title: string
  description: string
}

type ServiceItem = {
  theme: 'fast' | 'deep' | 'premium' | 'unyellow' | 'repaint' | 'pickup'
  title: string
  description: string
  price: number
  href: string
  ctaLabel?: string
}

type WorkshopItem = {
  city: string
  name: string
  hours: string
  mapHref: string
  whatsappHref: string
}

type GalleryItem = {
  theme: 'rider' | 'cleaning' | 'bag' | 'detailing'
  alt: string
}

type BlogItem = {
  badge: string
  dateLabel: string
  dateIso: string
  title: string
  href: string
  theme: 'bundle' | 'athlete' | 'promo' | 'tips' | 'materials' | 'mesh'
}

export type LandingContent = {
  announcement: {
    text: string
    ctaLabel: string
    href: string
  }
  navigation: LinkItem[]
  hero: HeroContent
  guarantees: {
    title: string
    description: string
    items: GuaranteeItem[]
  }
  services: {
    title: string
    description: string
    items: ServiceItem[]
  }
  workshops: {
    title: string
    description: string
    filters: string[]
    items: WorkshopItem[]
  }
  gallery: {
    title: string
    description: string
    items: GalleryItem[]
  }
  blog: {
    title: string
    items: BlogItem[]
  }
  cta: {
    title: string
    description: string
    label: string
    href: string
  }
  footer: {
    description: string
    contacts: LinkItem[]
    offices: {
      name: string
      href: string
    }[]
    links: LinkItem[]
    socials: {
      label: string
      shortLabel: string
      href: string
    }[]
    authLinks: AuthLinkItem[]
    copyright: string
  }
}
