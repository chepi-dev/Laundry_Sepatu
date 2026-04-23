type BaseActionButtonProps = {
  children: string
  variant: 'gold' | 'dark' | 'light'
  small?: boolean
}

type LinkActionButtonProps = BaseActionButtonProps & {
  href: string
  onClick?: never
}

type ClickActionButtonProps = BaseActionButtonProps & {
  href?: never
  onClick: () => void
}

type ActionButtonProps = LinkActionButtonProps | ClickActionButtonProps

export function ActionButton({
  children,
  variant,
  small = false,
  ...props
}: ActionButtonProps) {
  const sizeClass = small ? 'button-link--small' : ''
  const className = `button-link button-link--${variant} ${sizeClass}`.trim()

  if ('onClick' in props) {
    return (
      <button className={className} type="button" onClick={props.onClick}>
        {children}
      </button>
    )
  }

  return (
    <a className={className} href={props.href}>
      {children}
    </a>
  )
}
