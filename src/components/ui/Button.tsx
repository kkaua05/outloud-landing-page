import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export type ButtonVariant = 'cream' | 'royal' | 'ghost' | 'ghost-light'

interface CommonProps {
  variant?: ButtonVariant
  /** Icon rendered inside the circular chip at the end of the button. */
  icon?: ReactNode
  /** Stretch to the full width of the container. */
  block?: boolean
  children: ReactNode
}

function classes(variant: ButtonVariant, block: boolean, hasIcon: boolean, extra?: string) {
  return ['btn', `btn--${variant}`, block && 'btn--block', hasIcon && 'btn--with-icon', extra]
    .filter(Boolean)
    .join(' ')
}

function Content({ icon, children }: Pick<CommonProps, 'icon' | 'children'>) {
  return (
    <>
      <span className="btn__label">{children}</span>
      {icon ? <span className="btn__icon">{icon}</span> : null}
    </>
  )
}

export function Button({
  variant = 'royal',
  icon,
  block = false,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, block, Boolean(icon), className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </button>
  )
}

export function ButtonLink({
  variant = 'royal',
  icon,
  block = false,
  className,
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes(variant, block, Boolean(icon), className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </a>
  )
}
