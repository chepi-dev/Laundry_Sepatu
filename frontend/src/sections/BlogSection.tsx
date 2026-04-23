import type { LandingContent } from '../types/content'

type BlogSectionProps = {
  blog: LandingContent['blog']
}

export function BlogSection({ blog }: BlogSectionProps) {
  return (
    <section className="blog-section container" id="blog">
      <div className="section-heading section-heading--split">
        <div>
          <p className="section-kicker">BERITA</p>
          <h2 className="section-title">{blog.title}</h2>
        </div>

        <a className="text-link" href="#footer">
          Lihat Semua
        </a>
      </div>

      <div className="blog-grid">
        {blog.items.map((post) => (
          <article key={post.title} className="blog-card">
            <div className={`blog-media blog-media--${post.theme}`}>
              <span>{post.badge}</span>
            </div>
            <div className="blog-body">
              <div className="blog-meta">
                <span>{post.badge}</span>
                <time dateTime={post.dateIso}>{post.dateLabel}</time>
              </div>
              <h3>{post.title}</h3>
              <a href={post.href} className="text-link">
                Baca Selengkapnya
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
