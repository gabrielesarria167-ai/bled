import { useState } from 'react'
import { useProgress, useStored } from '../../lib/progress'
import { DecisionDrill } from '../s11/Decisioni'
import { kit, kitTotal } from './contenuto'

/** Totals across the four kit checklists (same storage keys as <Checklist>), what is still missing from the minimum, and the expiry check date. */
export function KitStato() {
  const { store } = useProgress()
  const ticked = kit.map((g) => (store[`check:${g.id}`] as string[] | undefined) ?? [])
  const [checkedOn, setCheckedOn] = useStored('s12:kit-scadenze', '')
  const total = ticked.reduce((n, t) => n + t.length, 0)
  const missing = kit[0].items.filter((it) => !ticked[0].includes(it.id))

  return (
    <div className="my-6 max-w-[72ch] rounded-plate bg-panel p-5" aria-live="polite">
      <p className="font-display text-[2.2rem] font-extrabold leading-none">
        {total} <span className="text-[1.3rem] font-bold">di {kitTotal} voci nel tuo kit</span>
      </p>
      {missing.length === 0 ? (
        <p className="mt-3 font-bold text-safe-deep">Dotazione minima completa: tutte le 14 voci ci sono.</p>
      ) : (
        <>
          <p className="mt-3 font-bold">
            Alla dotazione minima mancano ancora {missing.length} {missing.length === 1 ? 'voce' : 'voci'}:
          </p>
          <ul className="mt-1 list-[square] pl-5 text-[0.95rem]">
            {missing.map((it) => (
              <li key={it.id}>{it.label}</li>
            ))}
          </ul>
        </>
      )}
      <label className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-bold">Scadenze controllate il</span>
        <input type="date" value={checkedOn} onChange={(e) => setCheckedOn(e.target.value)} className="rounded-chip bg-ground px-3 py-2 ring-2 ring-inset ring-line focus:ring-must" />
      </label>
    </div>
  )
}

function sample<T>(all: T[], n: number) {
  const a = [...all]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

/** Sort 8 random kit items into the manual's four groups. */
export function KitSort() {
  const [cases] = useState(() =>
    sample(
      kit.flatMap((g) => g.items.map((it) => ({ id: it.id, text: it.label, answer: g.id, why: `«${it.label}» fa parte del gruppo: ${g.title.toLowerCase()}.` }))),
      8,
    ),
  )
  return <DecisionDrill question="In quale gruppo la mette il manuale?" cases={cases} options={kit.map((g) => ({ id: g.id, label: g.title }))} />
}
