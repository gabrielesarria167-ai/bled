import type { ReactNode } from 'react'

/**
 * The dark well: where things are practised or turned in 3D. Like a sign glowing with the lights off,
 * so everything inside uses the `well` / `well-ink` / `lume` colours.
 */
export function Stage({ title, hint, children, footer, className = '' }: { title: string; hint?: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <section className={`mount my-10 overflow-hidden rounded-plate bg-well text-well-ink shadow-raise ${className}`} aria-label={title}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 pt-5">
        <h3 className="text-[1.7rem] text-lume">{title}</h3>
        {hint && <p className="text-[0.9rem] text-well-soft">{hint}</p>}
      </header>
      <div className="p-6 pt-4">{children}</div>
      {footer && <footer className="border-t border-well-2 px-6 py-4 text-[0.9rem] text-well-soft">{footer}</footer>}
    </section>
  )
}
