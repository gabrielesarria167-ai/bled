import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../../components/ui/Button'
import { useStored } from '../../lib/progress'

type Field = { id: string; label: string; hint?: string; rows?: number; type?: string }
type Block = { title: string; fields: Field[]; fixed: string[] }

/** The manual's example form (p. 106): 7 fields in 3 blocks, with the fixed instructions always visible. */
const blocks: Block[] = [
  {
    title: 'Chiamare',
    fields: [{ id: 'chiamare', label: 'Numeri da chiamare', hint: 'Scrivi il numero nazionale del Servizio Medico d’Emergenza (SME) e i numeri di riferimento per le diverse emergenze (per esempio vigili del fuoco, polizia).', rows: 3 }],
    fixed: ['Il SME, o il numero di emergenza specifico, ti chiederà che cosa è successo e qual è l’emergenza.', 'Resta in linea, mantieni la calma e segui tutte le istruzioni che ricevi.'],
  },
  {
    title: 'Fornire',
    fields: [
      { id: 'indirizzo', label: 'Il proprio indirizzo', rows: 2 },
      { id: 'telefono', label: 'Il proprio numero di telefono', type: 'tel' },
    ],
    fixed: ['Se è possibile, manda qualcuno all’esterno (per esempio in strada) a indicare subito al SME in arrivo il punto esatto dell’incidente.'],
  },
  {
    title: 'Ulteriori informazioni importanti',
    fields: [
      { id: 'antiveleni', label: 'Centro antiveleni' },
      { id: 'medico', label: 'Medico personale' },
      { id: 'familiare', label: 'Familiare da contattare' },
      { id: 'vicini', label: 'Vicini di casa' },
    ],
    fixed: [],
  },
]

const intro = 'Quando ti accorgi che è in atto un’emergenza:'
const hang = 'Appendilo vicino al telefono, in un punto comune della casa: lo devono trovare subito tutti, anche chi non vive qui stabilmente (babysitter, nonni, ecc.).'

/** Fill in the plan (saved on this device) and print just the plan on one sheet. */
export function PianoEmergenza() {
  const [v, setV] = useStored<Record<string, string>>('s12:piano', {})
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (!printing) return
    // Hide the whole app on paper; the sheet below is portalled outside #root, so it is the only thing printed.
    const root = document.getElementById('root')
    root?.classList.add('print:hidden')
    const done = () => setPrinting(false)
    window.addEventListener('afterprint', done)
    window.print()
    return () => {
      root?.classList.remove('print:hidden')
      window.removeEventListener('afterprint', done)
    }
  }, [printing])

  return (
    <div className="my-8">
      <div className="max-w-[46rem] rounded-plate bg-ground p-5 shadow-raise ring-2 ring-line md:p-8">
        <p className="font-display text-[1.9rem] font-extrabold leading-none">Esempio di piano d’emergenza domestico</p>
        <p className="mt-3 font-bold">{intro}</p>
        <ol className="mt-5 space-y-7">
          {blocks.map((b, n) => (
            <li key={b.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
              <span className="grid size-10 place-items-center rounded-chip bg-must font-display text-[1.5rem] font-extrabold leading-none text-on-sign">{n + 1}</span>
              <div className="min-w-0 space-y-3">
                <p className="pt-1.5 font-display text-[1.45rem] font-bold leading-tight">{b.title}</p>
                {b.fields.map((f) => {
                  const common = {
                    id: `piano-${f.id}`,
                    value: v[f.id] ?? '',
                    onChange: (e: { target: { value: string } }) => setV({ ...v, [f.id]: e.target.value }),
                    'aria-describedby': f.hint ? `piano-${f.id}-hint` : undefined,
                    className: 'mt-1 block w-full rounded-chip bg-panel px-3 py-2 ring-2 ring-inset ring-line focus:outline-none focus:ring-must',
                  }
                  return (
                    <div key={f.id}>
                      <label htmlFor={`piano-${f.id}`} className="font-bold">
                        {f.label}
                      </label>
                      {f.hint && (
                        <p id={`piano-${f.id}-hint`} className="text-[0.9rem] leading-snug text-ink-soft">
                          {f.hint}
                        </p>
                      )}
                      {f.rows ? <textarea rows={f.rows} {...common} /> : <input type={f.type ?? 'text'} {...common} />}
                    </div>
                  )
                })}
                {b.fixed.map((t) => (
                  <p key={t} className="rounded-chip bg-safe-tint px-3 py-2 text-[0.95rem] leading-snug">
                    {t}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button variant="must" onClick={() => (printing ? window.print() : setPrinting(true))}>
          <Printer className="size-5" aria-hidden /> Stampa il piano
        </Button>
        <p className="max-w-[48ch] text-[0.92rem] text-ink-soft">I dati restano salvati solo in questo browser. La stampa contiene solo il piano, su un foglio.</p>
      </div>
      <p className="mt-3 max-w-[68ch] font-bold">{hang}</p>

      {printing && createPortal(<Sheet v={v} />, document.body)}
    </div>
  )
}

/** The paper version: black on white whatever the screen theme, blank lines where a field is empty. */
function Sheet({ v }: { v: Record<string, string> }) {
  return (
    <div className="hidden bg-white p-6 text-[12pt] leading-snug text-black print:block">
      <h1 className="text-[24pt]">Piano d’emergenza domestico</h1>
      <p className="mt-3 font-bold">{intro}</p>
      {blocks.map((b, n) => (
        <section key={b.title} className="mt-5 break-inside-avoid">
          <h2 className="text-[16pt]">
            {n + 1}. {b.title}
          </h2>
          {b.fields.map((f) => (
            <div key={f.id} className="mt-2">
              <p className="font-bold">{f.label}:</p>
              {v[f.id]?.trim() ? <p className="whitespace-pre-line">{v[f.id]}</p> : <p className="mt-6 border-b border-black" aria-hidden />}
              {f.hint && !v[f.id]?.trim() && <p className="text-[9pt]">({f.hint})</p>}
            </div>
          ))}
          {b.fixed.map((t) => (
            <p key={t} className="mt-2">
              {t}
            </p>
          ))}
        </section>
      ))}
      <p className="mt-6 text-[10pt]">{hang}</p>
    </div>
  )
}
