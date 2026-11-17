import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStored } from '../../lib/progress'

/** A persisted tick list (kit contents, DAE maintenance checks, learning objectives). `id` must be unique in the course. */
export function Checklist({ id, items, columns = 1 }: { id: string; items: { id: string; label: ReactNode }[]; columns?: 1 | 2 }) {
  const [done, setDone] = useStored<string[]>(`check:${id}`, [])
  const toggle = (k: string) => setDone(done.includes(k) ? done.filter((d) => d !== k) : [...done, k])
  return (
    <div className="my-6">
      <ul className={`grid gap-x-8 gap-y-1 ${columns === 2 ? 'md:grid-cols-2' : 'max-w-[72ch]'}`}>
        {items.map((it) => {
          const on = done.includes(it.id)
          return (
            <li key={it.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-chip p-2 hover:bg-panel">
                <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(it.id)} />
                <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-[5px] ring-2 ring-inset transition-colors duration-150 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-must ${on ? 'bg-safe text-on-sign ring-safe' : 'ring-ink-soft'}`}>
                  {on && <Check className="size-4" strokeWidth={3.5} aria-hidden />}
                </span>
                <span className={on ? 'text-ink-soft' : ''}>{it.label}</span>
              </label>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[0.9rem] text-ink-soft" aria-live="polite">
        {done.length} di {items.length} spuntati
      </p>
    </div>
  )
}
