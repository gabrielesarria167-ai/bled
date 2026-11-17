import type { ReactNode } from 'react'

export type Fact = { label: string; value: ReactNode; note?: string }

/** The numbers to know by heart, set like a data plate: label, dotted leader, value. */
export function KeyFacts({ title = 'Da sapere a memoria', items, tone = 'safe' }: { title?: string; items: Fact[]; tone?: 'safe' | 'well' }) {
  const well = tone === 'well'
  return (
    <div className={`my-8 max-w-[72ch] rounded-plate p-6 ${well ? 'bg-well text-well-ink' : 'plate'}`}>
      <p className="font-display text-[1.5rem] font-extrabold leading-none">{title}</p>
      <dl className="mt-4 space-y-2.5">
        {items.map((f) => (
          <div key={f.label}>
            <div className="flex items-baseline">
              <dt>{f.label}</dt>
              <span className="leader" aria-hidden />
              <dd className={`font-display text-[1.55rem] font-extrabold leading-none ${well ? 'text-lume' : ''}`}>{f.value}</dd>
            </div>
            {f.note && <p className="text-[0.88rem] opacity-85">{f.note}</p>}
          </div>
        ))}
      </dl>
    </div>
  )
}
