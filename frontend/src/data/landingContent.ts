import type { LandingContent } from '../types/content'

export const landingContent: LandingContent = {
  announcement: {
    text: 'Bergabung dengan membership Shoes and Care. Dapatkan 5000 poin.',
    ctaLabel: '',
    href: '#beranda',
  },
  navigation: [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Blog', href: '#blog' },
    { label: 'Lokasi', href: '#lokasi' },
    { label: 'Promo', href: '#blog' },
    { label: 'Cerita Atlet', href: '#blog' },
  ],
  hero: {
    eyebrow: 'Premium shoe care since 2013',
    title: 'Cuci Sepatu Premium Bergaransi',
    description:
      'Lebih dari sekadar cuci sepatu. Kami merawat, melindungi, dan mengembalikan tampilan sepatu kesayanganmu agar awet, bersih, dan nyaman dipakai.',
    primaryLabel: 'Gunakan Layanan Sekarang',
    primaryHref: '#layanan',
    secondaryLabel: 'Antar Jemput',
    secondaryHref: '#pickup',
  },
  guarantees: {
    title: 'Barangmu, Tanggung Jawab Kami',
    description:
      'Shoes and Care merupakan jasa perawatan dan cuci sepatu premium dengan sistem layanan yang dirancang untuk memberi kemudahan, kenyamanan, dan hasil maksimal.',
    items: [
      {
        icon: 'shield',
        title: 'Garansi Cuci Ulang',
        description:
          'Jika hasilnya kurang memuaskan, kami tangani kembali tanpa biaya tambahan sesuai syarat yang berlaku.',
      },
      {
        icon: 'support',
        title: 'Konsultasi Gratis',
        description:
          'Dapatkan rekomendasi treatment terbaik dari tim profesional agar sepatu ditangani dengan aman.',
      },
      {
        icon: 'delivery',
        title: 'Gratis Jemput & Antar',
        description:
          'Layanan antar jemput gratis hingga 5 km dari workshop tertentu untuk memberi pengalaman yang praktis.',
      },
      {
        icon: 'guarantee',
        title: 'Jaminan Garansi Layanan',
        description:
          'Dikerjakan oleh tim berpengalaman dengan SOP yang jelas sehingga kualitas layanan tetap terjaga.',
      },
    ],
  },
  services: {
    title: 'Layanan',
    description:
      'Kami menyediakan berbagai macam layanan untuk perawatan barang kesayangan kamu, dikerjakan oleh tim yang sudah berpengalaman dan profesional.',
    items: [
      {
        theme: 'fast',
        title: 'Fast Cleaning',
        description:
          'Pembersihan instan untuk bagian upper dan midsole yang bisa ditunggu dalam waktu singkat.',
        price: 30000,
        href: '#footer',
      },
      {
        theme: 'deep',
        title: 'Deep Cleaning',
        description:
          'Pembersihan detail dan menyeluruh untuk kotoran membandel serta noda yang menumpuk.',
        price: 50000,
        href: '#footer',
      },
      {
        theme: 'premium',
        title: 'Premium Treatment',
        description:
          'Perawatan spesial untuk material sensitif yang memerlukan perhatian lebih pada proses pengerjaan.',
        price: 90000,
        href: '#footer',
      },
      {
        theme: 'unyellow',
        title: 'Unyellowing',
        description:
          'Treatment khusus untuk mengurangi warna kuning pada bagian midsole dan area berbahan terang.',
        price: 100000,
        href: '#footer',
      },
      {
        theme: 'repaint',
        title: 'Repaint',
        description:
          'Restorasi warna dengan cat khusus agar tampilan sepatu atau tas kembali lebih segar dan rapi.',
        price: 185000,
        href: '#footer',
      },
      {
        theme: 'pickup',
        title: 'Antar Jemput',
        description:
          'Layanan pickup dan delivery untuk kamu yang tidak sempat datang langsung ke workshop.',
        price: 0,
        href: '#pickup',
        ctaLabel: 'Hubungi Kami Sekarang',
      },
    ],
  },
  workshops: {
    title: 'Lokasi Workshop',
    description: 'Temukan lokasi workshop Shoes and Care di berbagai kota.',
    filters: ['Jakarta', 'Yogyakarta', 'Jawa Tengah', 'Reset Filter'],
    items: [
      {
        city: 'Jakarta',
        name: 'SAC Bintaro (Store 1) Sektor 1',
        hours: 'Senin-Minggu, 10.00 - 21.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Cibubur',
        hours: 'Senin-Minggu, 10.00 - 21.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Gandaria',
        hours: 'Senin-Minggu, 12.00 - 20.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Gatsu',
        hours: 'Weekday 10.00-20.00 | Weekend 08.00-18.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Jatiwaringin (Jawara)',
        hours: 'Senin-Jumat 10.00 - 20.00 | Sabtu-Minggu 12.00 - 18.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Lebak Bulus',
        hours: 'Setiap hari, 10.00 - 20.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Pasar Rebo',
        hours: 'Senin-Sabtu 13.00 - 22.00 | Minggu 13.30 - 20.00',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
      {
        city: 'Jakarta',
        name: 'SAC Puri Kembangan',
        hours: '10.00 - 22.00 | Senin, Selasa, Rabu, Jumat, Sabtu, Minggu',
        mapHref: '#footer',
        whatsappHref: '#footer',
      },
    ],
  },
  gallery: {
    title: 'Galeri',
    description: 'Temukan hasil kerja workshop Shoes and Care di berbagai kota.',
    items: [
      { theme: 'rider', alt: 'Kurir antar jemput Shoes and Care' },
      { theme: 'cleaning', alt: 'Proses deep cleaning sepatu' },
      { theme: 'bag', alt: 'Perawatan tas premium' },
      { theme: 'detailing', alt: 'Detail pengerjaan oleh teknisi' },
    ],
  },
  blog: {
    title: 'Blog & Tips',
    items: [
      {
        badge: 'Promo',
        dateLabel: '16 Apr 2026',
        dateIso: '2026-04-16',
        title: 'Better Run Deals',
        href: '#footer',
        theme: 'bundle',
      },
      {
        badge: 'Interview',
        dateLabel: '01 Apr 2026',
        dateIso: '2026-04-01',
        title: 'Dari 105 Kg ke 65 Kg: Bedah strategi transformasi 40 Kg Rafi.',
        href: '#footer',
        theme: 'athlete',
      },
      {
        badge: 'Promo',
        dateLabel: '29 Mar 2026',
        dateIso: '2026-03-29',
        title: 'Halal Bi Halal Promo!',
        href: '#footer',
        theme: 'promo',
      },
      {
        badge: 'Tips',
        dateLabel: '25 Mar 2026',
        dateIso: '2026-03-25',
        title: 'Tips membasmi noda membandel pada permukaan sepatu.',
        href: '#footer',
        theme: 'tips',
      },
      {
        badge: 'Informasi',
        dateLabel: '16 Mar 2026',
        dateIso: '2026-03-16',
        title: 'Bahan sepatu ini butuh perawatan yang ekstra!',
        href: '#footer',
        theme: 'materials',
      },
      {
        badge: 'Tips',
        dateLabel: '12 Mar 2026',
        dateIso: '2026-03-12',
        title: 'Sepatu mesh putih susah dibersihkan? Ini penyebabnya.',
        href: '#footer',
        theme: 'mesh',
      },
    ],
  },
  cta: {
    title: 'Tidak Sempat ke Workshop?',
    description:
      'Gunakan layanan antar jemput gratis kami. Tim akan menjemput sepatu langsung ke lokasi kamu.',
    label: 'Hubungi via WhatsApp',
    href: '#footer',
  },
  footer: {
    description:
      'Jasa perawatan dan cuci sepatu premium dengan layanan garansi gratis, cuci ulang, antar jemput, dan konsultasi gratis.',
    contacts: [
      { label: 'Halo SAC - Layanan Pelanggan', href: 'tel:+6285920292879' },
      { label: 'SACGo - Layanan Antar Jemput', href: 'tel:+62895602173070' },
    ],
    offices: [
      { name: 'Kantor Yogyakarta', href: '#footer' },
      { name: 'Kantor Jakarta', href: '#footer' },
    ],
    links: [
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'Lokasi Workshop', href: '#lokasi' },
      { label: 'Karir', href: '#footer' },
    ],
    socials: [
      { label: 'Facebook', shortLabel: 'f', href: '#footer' },
      { label: 'YouTube', shortLabel: 'y', href: '#footer' },
      { label: 'Instagram', shortLabel: 'i', href: '#footer' },
    ],
    authLinks: [
      { label: 'Login', href: '#/auth/login' },
      { label: 'Register', href: '#/auth/register' },
      { label: 'Forgot Password', href: '#/auth/forgot-password' },
    ],
    copyright: '© 2020 - 2026 Shoes and Care. All Right Reserved.',
  },
}
