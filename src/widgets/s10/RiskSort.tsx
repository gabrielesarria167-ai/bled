import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'

type Kind = 'rischio' | 'segno'
type Item = { id: string; text: string; kind: Kind }

/** All 14 risk factors (pp. 81–82) and 6 warning signs (p. 82), mixed. */
const ITEMS: Item[] = [
  { id: 'fumo', text: 'Fumo di sigaretta', kind: 'rischio' },
  { id: 'torace', text: 'Dolore, oppure senso di pressione o di schiacciamento (oppressione), al centro del torace, dietro lo sterno', kind: 'segno' },
  { id: 'ipertensione', text: 'Ipertensione', kind: 'rischio' },
  { id: 'colesterolo', text: 'Ipercolesterolemia', kind: 'rischio' },
  { id: 'sudore', text: 'Sudorazione', kind: 'segno' },
  { id: 'obesita', text: 'Obesità', kind: 'rischio' },
  { id: 'diabete', text: 'Diabete', kind: 'rischio' },
  { id: 'irradiato', text: 'Dolore e fastidio a spalla, braccio, collo o mandibola', kind: 'segno' },
  { id: 'sedentaria', text: 'Vita sedentaria', kind: 'rischio' },
  { id: 'alcol', text: 'Abuso di alcol', kind: 'rischio' },
  { id: 'respiro', text: 'Difficoltà a respirare', kind: 'segno' },
  { id: 'familiare', text: 'Predisposizione familiare alle coronaropatie', kind: 'rischio' },
  { id: 'anamnesi', text: 'Anamnesi positiva per cardiopatia', kind: 'rischio' },
  { id: 'digestione', text: 'Sensazione di intensa difficoltà digestiva', kind: 'segno' },
  { id: 'precedente', text: 'Un precedente attacco di cuore o arresto cardiaco', kind: 'rischio' },
  { id: 'eta', text: 'Età avanzata', kind: 'rischio' },
  { id: 'nausea', text: 'Nausea e vomito', kind: 'segno' },
  { id: 'maschio', text: 'Sesso maschile', kind: 'rischio' },
  { id: 'droghe', text: 'Uso di droghe come cocaina e anfetamine', kind: 'rischio' },
  { id: 'nutrizione', text: 'Squilibri nutrizionali, per esempio bassi livelli di sali minerali nel sangue', kind: 'rischio' },
]
const NAME: Record<Kind, string> = { rischio: 'Fattore di rischio', segno: 'Segno premonitore' }

/** Where the warning-sign pain is felt: lit as the learner sorts the two pain signs. */
function PainZones({ chest, spread }: { chest: boolean; spread: boolean }) {
  const zone = (on: boolean) => ({ fill: on ? 'var(--danger)' : 'var(--panel-2)', className: 'transition-[fill] duration-300' })
  return (
    <figure className="mx-auto w-40 shrink-0 sm:w-48">
      <svg viewBox="0 0 160 220" role="img" aria-label={`Sagoma con le zone del dolore: ${chest ? 'centro del torace evidenziato' : 'centro del torace non ancora evidenziato'}; ${spread ? 'spalle, braccia, collo e mandibola evidenziati' : 'spalle, braccia, collo e mandibola non ancora evidenziati'}.`}>
        <circle cx="80" cy="30" r="22" fill="var(--ink-soft)" />
        <path d="M66 42Q80 58 94 42L94 50Q80 62 66 50Z" {...zone(spread)} />
        <rect x="70" y="52" width="20" height="16" rx="5" {...zone(spread)} />
        <path d="M40 72Q80 62 120 72L116 200H44Z" fill="var(--ink-soft)" />
        <circle cx="42" cy="78" r="12" {...zone(spread)} />
        <circle cx="118" cy="78" r="12" {...zone(spread)} />
        <path d="M36 84 22 160" stroke={spread ? 'var(--danger)' : 'var(--panel-2)'} strokeWidth="16" strokeLinecap="round" className="transition-[stroke] duration-300" />
        <path d="M124 84 138 160" stroke={spread ? 'var(--danger)' : 'var(--panel-2)'} strokeWidth="16" strokeLinecap="round" className="transition-[stroke] duration-300" />
        <ellipse cx="80" cy="104" rx="16" ry="22" {...zone(chest)} />
      </svg>
      <figcaption className="mt-1 text-center text-[0.85rem] text-ink-soft">Le zone del dolore</figcaption>
    </figure>
  )
}

/** Sort each item: risk factor or warning sign. Instant feedback per row. */
export function RiskSort() {
  const [given, setGiven] = useState<Record<string, Kind>>({})
  const answered = Object.keys(given).length
  const right = ITEMS.filter((i) => given[i.id] === i.kind).length
  return (
    <div className="my-8 rounded-plate bg-panel p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.35rem] font-bold leading-tight">Fattore di rischio o segno premonitore?</p>
          <p className="mt-1 text-ink-soft">Per ogni voce scegli il gruppo giusto. Sono tutte voci del manuale: 14 fattori di rischio e 6 segni premonitori.</p>
        </div>
        <PainZones chest={!!given.torace} spread={!!given.irradiato} />
      </div>
      <ul className="mt-5 space-y-2">
        {ITEMS.map((it) => {
          const g = given[it.id]
          const ok = g === it.kind
          return (
            <li key={it.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-chip p-3 ring-2 ring-inset ${!g ? 'bg-ground ring-transparent' : ok ? 'bg-safe-tint ring-safe' : 'bg-danger-tint ring-danger'}`}>
              <span className="min-w-0 flex-[1_1_16rem]">{it.text}</span>
              {g ? (
                <span className="flex items-center gap-1.5 text-[0.95rem] font-bold" role="status">
                  {ok ? <Check className="size-5 text-safe" strokeWidth={3} aria-hidden /> : <X className="size-5 text-danger" strokeWidth={3} aria-hidden />}
                  {ok ? `Giusto: ${NAME[it.kind].toLowerCase()}` : `No: è un ${NAME[it.kind].toLowerCase()}`}
                </span>
              ) : (
                <span className="flex gap-2" role="group" aria-label={`Classifica: ${it.text}`}>
                  {(['rischio', 'segno'] as const).map((k) => (
                    <button key={k} type="button" onClick={() => setGiven({ ...given, [it.id]: k })} className="rounded-chip px-3 py-1.5 text-[0.92rem] font-bold ring-2 ring-inset ring-line hover:ring-ink-soft">
                      {NAME[k]}
                    </button>
                  ))}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-4" aria-live="polite">
        <p className="min-w-0 flex-1">
          {answered < ITEMS.length ? `Classificate ${answered} di ${ITEMS.length}, giuste ${right}.` : `${right} su ${ITEMS.length} giuste. ${right === ITEMS.length ? 'Perfetto.' : 'Rileggi le voci segnate in rosso.'}`}
        </p>
        {answered > 0 && (
          <Button variant="quiet" onClick={() => setGiven({})}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>
    </div>
  )
}
