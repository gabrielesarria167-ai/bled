import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'

const base =
  'inline-flex items-center justify-center gap-2 rounded-chip px-5 py-2.5 font-display text-[1.15rem] font-bold leading-none tracking-[0.01em] transition-[translate,background-color,box-shadow] duration-150 ease-out active:translate-y-px disabled:opacity-45 disabled:active:translate-y-0'
const variants = {
  safe: 'bg-safe text-on-sign shadow-plate hover:bg-safe-deep',
  danger: 'bg-danger text-on-sign shadow-plate hover:brightness-90',
  must: 'bg-must text-on-sign shadow-plate hover:brightness-90',
  quiet: 'bg-transparent text-ink ring-2 ring-inset ring-line hover:ring-ink-soft',
  /** For use on dark wells and green fields. */
  onDark: 'bg-well-ink text-well shadow-plate hover:bg-lume',
}
export type ButtonVariant = keyof typeof variants

export function Button({ variant = 'safe', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest} />
}

export function ButtonLink({ variant = 'safe', className = '', ...rest }: LinkProps & { variant?: ButtonVariant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
