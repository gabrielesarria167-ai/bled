import { useState } from 'react'

export type Tag = 'comune' | 'blsd' | 'facoltativo'
type Entry = { id: string; text: string; tag: Tag }

/** "Cosa studierai" (manual p. 10). */
export const topics: Entry[] = [
  { id: 'anatomia', text: 'Capire le basi di anatomia e fisiologia', tag: 'comune' },
  { id: 'catena', text: 'Conoscere e comprendere i quattro anelli della “catena di sopravvivenza”', tag: 'comune' },
  { id: 'protezione', text: 'Proteggerti dalla trasmissione di malattie e da altri pericoli', tag: 'comune' },
  { id: 'coscienza', text: 'Verificare lo stato di coscienza', tag: 'comune' },
  { id: 'respiro', text: 'Controllare se il respiro è normale oppure assente', tag: 'comune' },
  { id: 'rcp', text: 'Eseguire compressioni toraciche e ventilazione artificiale, cioè la RCP (rianimazione cardio-polmonare)', tag: 'comune' },
  { id: 'soffocamento', text: 'Assistere una vittima di soffocamento', tag: 'comune' },
  { id: 'pls', text: 'Mettere una persona infortunata in posizione laterale di sicurezza', tag: 'comune' },
  { id: 'emorragia', text: 'Assistere in caso di sanguinamento esterno', tag: 'facoltativo' },
  { id: 'shock', text: 'Assistere una persona infortunata in stato di shock', tag: 'facoltativo' },
  { id: 'arresto', text: 'Riconoscere segni e sintomi di un arresto cardiaco improvviso', tag: 'blsd' },
  { id: 'dae', text: 'Eseguire il Basic Life Support con un DAE', tag: 'blsd' },
  { id: 'controlli', text: 'Fare i controlli ordinari di un DAE', tag: 'blsd' },
]

/** "Cosa saprai fare" (manual p. 11). */
export const objectives: Entry[] = [
  { id: 'sicurezza', text: 'Valutare la sicurezza dell’ambiente', tag: 'comune' },
  { id: 'rcp', text: 'Praticare da unico soccorritore la RCP su una persona non cosciente che non respira', tag: 'comune' },
  { id: 'pls', text: 'Mettere in posizione laterale di sicurezza una persona infortunata priva di coscienza', tag: 'comune' },
  { id: 'soffocamento', text: 'Soccorrere un adulto che sta soffocando', tag: 'comune' },
  { id: 'emorragia', text: 'Soccorrere in caso di emorragia esterna', tag: 'facoltativo' },
  { id: 'shock', text: 'Soccorrere una persona in stato di shock', tag: 'facoltativo' },
  { id: 'infarto', text: 'Riconoscere i segni premonitori di un attacco cardiaco o infarto', tag: 'blsd' },
  { id: 'dae', text: 'Prestare soccorso usando un DAE', tag: 'blsd' },
]

export function TagChip({ tag }: { tag: Tag }) {
  if (tag === 'comune') return null
  return <span className={`ml-2 inline-block rounded-chip px-1.5 py-1 align-[0.1em] text-[0.78rem] font-bold leading-none ${tag === 'blsd' ? 'bg-must-tint text-ink' : 'bg-panel-2 text-ink'}`}>{tag === 'blsd' ? 'Solo BLS-D' : 'Facoltativo'}</span>
}

const filters: { id: Tag | 'tutti'; label: string; says: string }[] = [
  { id: 'tutti', label: 'Tutti', says: '13 argomenti in tutto: 8 per tutti, 2 facoltativi, 3 solo per il BLS-D.' },
  { id: 'comune', label: 'Per tutti', says: '8 argomenti fanno parte sia del corso BLS sia del corso BLS-D.' },
  { id: 'blsd', label: 'Solo BLS-D', says: '3 argomenti riguardano solo il BLS-D, cioè il soccorso con il DAE.' },
  { id: 'facoltativo', label: 'Facoltativi', says: '2 argomenti sono facoltativi: il sanguinamento esterno e lo shock.' },
]

/** The 13 knowledge topics with a filter: pick a group and the matching topics stand out. */
export function TopicFilter() {
  const [f, setF] = useState<Tag | 'tutti'>('tutti')
  const count = (id: Tag | 'tutti') => (id === 'tutti' ? topics.length : topics.filter((t) => t.tag === id).length)

  return (
    <div className="my-8 rounded-plate bg-panel p-4 sm:p-6">
      <div role="group" aria-label="Filtra gli argomenti" className="flex flex-wrap gap-2">
        {filters.map((x) => (
          <button key={x.id} type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={`rounded-chip px-3.5 py-2 font-display text-[1.1rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${f === x.id ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`}>
            {x.label} ({count(x.id)})
          </button>
        ))}
      </div>
      <p className="mt-4 font-bold" aria-live="polite">
        {filters.find((x) => x.id === f)!.says}
      </p>
      <div role="list" className="mt-3 grid gap-x-6 gap-y-1 md:grid-cols-2">
        {topics.map((t) => {
          const on = f === 'tutti' || t.tag === f
          return (
            <div key={t.id} role="listitem" className={`flex gap-3 rounded-chip p-2 transition-opacity duration-200 ${on ? '' : 'opacity-35'}`}>
              <span className={`mt-[0.55em] size-2 shrink-0 ${on && f !== 'tutti' ? 'bg-must' : 'bg-ink-soft'}`} aria-hidden />
              <span className="min-w-0">
                {t.text}
                <TagChip tag={t.tag} />
                {!on && <span className="sr-only"> (non incluso nel filtro)</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
