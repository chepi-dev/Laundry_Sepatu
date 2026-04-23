type IconBadgeProps = {
  icon: 'shield' | 'support' | 'delivery' | 'guarantee'
}

export function IconBadge({ icon }: IconBadgeProps) {
  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation">
        {icon === 'shield' ? (
          <path d="M12 3 5 6v6c0 4.3 2.8 8.2 7 9 4.2-.8 7-4.7 7-9V6l-7-3Zm0 4.2 3.2 1.4v3.2c0 2.2-1.2 4.3-3.2 5.2-2-.9-3.2-3-3.2-5.2V8.6L12 7.2Z" />
        ) : null}
        {icon === 'support' ? (
          <path d="M12 4a7 7 0 0 0-7 7v2a2 2 0 0 0 2 2h1v-5H7a5 5 0 0 1 10 0h-1v5h1a2 2 0 0 0 2-2v-2a7 7 0 0 0-7-7Zm-4 8h2v4H8v-4Zm6 0h2v4h-2v-4Zm-5 6h6v2H9v-2Z" />
        ) : null}
        {icon === 'delivery' ? (
          <path d="M4 6h10v8h-1.2a2.8 2.8 0 0 0-5.6 0H6a2 2 0 0 1-2-2V6Zm11 2h2.8l2.2 2.5V14h-1.2a2.8 2.8 0 0 0-5.6 0H15V8Zm-5 7.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Zm7 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
        ) : null}
        {icon === 'guarantee' ? (
          <path d="M12 2.8 6 5.2v6.2c0 4 2.6 7.6 6 8.8 3.4-1.2 6-4.8 6-8.8V5.2l-6-2.4Zm0 3 3.6 1.4v4.2c0 2.5-1.4 4.9-3.6 6-2.2-1.1-3.6-3.5-3.6-6V7.2L12 5.8Zm-1 7 1.3 1.3 2.7-2.8 1.2 1.2-3.9 4-2.5-2.5 1.2-1.2Z" />
        ) : null}
      </svg>
    </span>
  )
}
