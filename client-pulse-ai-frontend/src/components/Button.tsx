import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import styles from './Button.module.css'

type Appearance = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'medium' | 'small'
  iconOnly?: boolean
}

type ButtonProps = ComponentProps<'button'> & Appearance

type ButtonLinkProps = ComponentProps<typeof Link> & Appearance

function classNames({ variant = 'secondary', size = 'medium', iconOnly = false }: Appearance, className?: string): string {
  return [styles.button, styles[variant], size === 'small' && styles.small, iconOnly && styles.iconOnly, className]
    .filter(Boolean)
    .join(' ')
}

export function Button({ variant, size, iconOnly, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={classNames({ variant, size, iconOnly }, className)} {...props} />
}

export function ButtonLink({ variant, size, iconOnly, className, ...props }: ButtonLinkProps) {
  return <Link className={classNames({ variant, size, iconOnly }, className)} {...props} />
}
