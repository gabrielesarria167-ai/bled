import type { ReactNode } from 'react'
import { SignMark } from './Plate'

export type CompareColumn = { title: string; kind?: 'nota' | 'attenzione' | 'obbligo' | 'divieto'; items: ReactNode[]; footer?: ReactNode }

/** Two or three things set side by side on the same rows (lieve vs grave, adulto vs bambino, fare vs non fare). */
export function Compare({ columns }: { columns: CompareColumn[] }) {
  return (
    <div className="my-8 grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(17rem, 100%), 1fr))` }}>
      {columns.map((c) => (
        <div key={c.title} className="rounded-plate bg-panel p-5">
          <p className="flex items-center gap-3 font-display text-[1.5rem] font-extrabold leading-none">
            {c.kind && <SignMark kind={c.kind} className="w-8" />}
            {c.title}
          </p>
          <ul className="mt-4 space-y-2 border-t-2 border-ground pt-4">
            {c.items.map((it, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[0.6em] size-1.5 shrink-0 bg-ink-soft" aria-hidden />
                <span className="min-w-0">{it}</span>
              </li>
            ))}
          </ul>
          {c.footer && <div className="mt-4 text-[0.92rem] text-ink-soft">{c.footer}</div>}
        </div>
      ))}
    </div>
  )
}
