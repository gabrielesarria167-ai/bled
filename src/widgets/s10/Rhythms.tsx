import { Check, CircleHelp, HeartPulse, Move, RotateCcw, X, Zap, ZapOff } from 'lucide-react'
import { useState } from 'react'
import { Button, Stage } from '../../components/ui'
import { useStored } from '../../lib/progress'
import { EcgTrace } from './EcgTrace'
import type { Rhythm } from './ecg'

type Verdict = 'si' | 'no' | 'normale' | 'nd'
type Info = { id: Rhythm; tab: string; name: string; text: string; verdict: Verdict; why: string; page: string }

/** The "Aritmie" table of the spec, one row per rhythm. */
export const RHYTHMS: Info[] = [
  {
    id: 'rs',
    tab: 'RS',
    name: 'Ritmo sinusale (RS)',
    text: 'Il ritmo ben definito che compare nell’ECG di un cuore sano. Nasce dal NSA, si propaga lungo le arterie e dà la pulsazione che senti palpando il polso radiale, carotideo e femorale.',
    verdict: 'normale',
    why: 'Non è un ritmo di arresto: è il ritmo normale a cui la defibrillazione vuole riportare il cuore.',
    page: '80, 82',
  },
  {
    id: 'fv',
    tab: 'FV',
    name: 'Fibrillazione ventricolare (FV)',
    text: 'Ritmo caotico: i ventricoli si contraggono in modo non coordinato e inefficace, il sangue non circola. È l’aritmia più comunemente associata all’ACI e quella che più spesso lo precede; è il ritmo di presentazione nella maggior parte degli arresti cardiaci. Dura in genere pochi minuti, poi evolve in asistolia. Sull’ECG è un tracciato irregolare e disordinato.',
    verdict: 'si',
    why: 'Defibrillabile: il DAE consiglia lo shock.',
    page: '81, 82, 85',
  },
  {
    id: 'tvsp',
    tab: 'TVSP',
    name: 'Tachicardia ventricolare senza polso (TVSP)',
    text: 'Una zona del muscolo ventricolare scarica impulsi a grande velocità al posto del pacemaker dominante. Il ventricolo ha meno tempo per riempirsi: calano la gittata cardiaca e la pressione sistemica fino allo shock, con perdita di coscienza e assenza di polso. Spesso precede la FV. Sull’ECG: onde larghe, regolari e ravvicinate, tutte simili.',
    verdict: 'si',
    why: 'Defibrillabile: il DAE consiglia lo shock.',
    page: '82, 83',
  },
  {
    id: 'aesp',
    tab: 'AESP / PEA',
    name: 'Attività elettrica senza polso (AESP, in inglese PEA)',
    text: 'Attività elettrica molto debole e del tutto inefficace per la funzione di pompa; in genere precede l’asistolia.',
    verdict: 'no',
    why: 'Non defibrillabile: i DAE non la rilevano, non risponde agli shock esterni e richiede cure rianimatorie avanzate.',
    page: '82',
  },
  {
    id: 'asistolia',
    tab: 'Asistolia',
    name: 'Asistolia',
    text: 'Assenza completa di attività elettrica nel cuore (mancanza di contrazione). È l’esito della FV dopo pochi minuti. Il pacemaker di scappamento (NAV) protegge da essa quando il NSA non funziona.',
    verdict: 'no',
    why: 'Non defibrillabile: non risponde agli shock esterni e richiede cure rianimatorie avanzate.',
    page: '80, 82, 85',
  },
  {
    id: 'atriali',
    tab: 'Aritmie atriali',
    name: 'Aritmie atriali',
    text: 'Il testo le cita solo per dire che il NAV fa da filtro e difende il ventricolo da esse.',
    verdict: 'nd',
    why: 'Il testo non indica se siano defibrillabili.',
    page: '80',
  },
  {
    id: 'bav',
    tab: 'Blocco AV',
    name: 'Blocco atrioventricolare',
    text: 'Citato come esempio di condizione patologica in cui il NSA non genera correttamente gli impulsi: subentra il NAV, pacemaker di scappamento, con un automatismo più lento.',
    verdict: 'nd',
    why: 'Il testo non indica se sia defibrillabile.',
    page: '80',
  },
]

const info = (id: Rhythm) => RHYTHMS.find((r) => r.id === id)!
const icons = { si: Zap, no: ZapOff, normale: HeartPulse, nd: CircleHelp }
const chip = (on: boolean) => `rounded-chip px-3 py-2 text-[0.95rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${on ? 'bg-lume text-well ring-lume' : 'text-well-ink ring-well-2 hover:ring-well-soft'}`

function VerdictLine({ r }: { r: Info }) {
  const Icon = icons[r.verdict]
  return (
    <p className="flex items-start gap-2 font-bold text-lume">
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden /> {r.why}
    </p>
  )
}

/** The manual's figure of p. 82: the two shockable rhythms. */
export function ShockableStrips() {
  return (
    <Stage title="I due ritmi defibrillabili" hint="Tracciati illustrativi, non diagnostici.">
      <div className="grid gap-5 md:grid-cols-2">
        {(['fv', 'tvsp'] as const).map((id) => (
          <figure key={id}>
            <EcgTrace rhythm={id} label={`Tracciato illustrativo: ${info(id).name}`} />
            <figcaption className="mt-2 text-[0.95rem]">
              <span className="font-bold text-lume">{info(id).name}.</span> {id === 'fv' ? 'Onde irregolari e caotiche, di ampiezza e forma variabili, senza complessi riconoscibili.' : 'Onde larghe, regolari e ravvicinate, tutte simili fra loro.'}
            </figcaption>
          </figure>
        ))}
      </div>
    </Stage>
  )
}

/** Every rhythm of the "Aritmie" table: switch rhythm, read what it is and what the DAE would do; add movement artefacts. */
export function RhythmLab() {
  const [id, setId] = useState<Rhythm>('rs')
  const [moving, setMoving] = useState(false)
  const r = info(id)
  return (
    <Stage title="I ritmi al monitor" hint="Scegli un ritmo, poi prova a muovere la vittima." footer="Tracciati illustrativi disegnati per il corso, non diagnostici.">
      <div role="radiogroup" aria-label="Ritmo da mostrare" className="flex flex-wrap gap-2">
        {RHYTHMS.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === id} onClick={() => setId(x.id)} className={chip(x.id === id)}>
            {x.tab}
          </button>
        ))}
      </div>
      <EcgTrace className="mt-4" rhythm={id} artefact={moving} label={`Tracciato illustrativo: ${r.name}${moving ? ', coperto da artefatti da movimento' : ''}`} />
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-h-40 rounded-chip bg-well-2 p-4 [&>*+*]:mt-2" aria-live="polite">
          <p className="font-display text-[1.45rem] font-extrabold leading-none text-lume">{r.name}</p>
          <p>{r.text}</p>
          {moving ? (
            <p className="flex items-start gap-2 font-bold text-lume">
              <Move className="mt-0.5 size-5 shrink-0" aria-hidden /> Artefatti: i movimenti coprono il segnale del cuore e il DAE non riesce a valutarlo. Analisi interrotta: fermare tutti i movimenti.
            </p>
          ) : (
            <VerdictLine r={r} />
          )}
          <p className="text-[0.85rem] text-well-soft">Manuale p. {r.page}</p>
        </div>
        <Button variant="onDark" aria-pressed={moving} onClick={() => setMoving(!moving)}>
          <Move className="size-5" aria-hidden /> {moving ? 'Ferma la vittima' : 'Muovi la vittima'}
        </Button>
      </div>
    </Stage>
  )
}

const ARREST: Rhythm[] = ['fv', 'tvsp', 'aesp', 'asistolia']
function deck(): Rhythm[] {
  const d = [...ARREST, ...ARREST]
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[d[i], d[j]] = [d[j], d[i]]
  }
  return d
}

/** "Defibrillabile o no?": eight unlabelled arrest rhythms, decide like the DAE. */
export function ShockDrill() {
  const [cards, setCards] = useState(deck)
  const [i, setI] = useState(0)
  const [given, setGiven] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useStored<number>('s10:ritmi', 0)
  const over = i >= cards.length
  const r = over ? null : info(cards[i])
  const shockable = r?.verdict === 'si'

  const answer = (shock: boolean) => {
    setGiven(shock)
    if (shock === shockable) setScore(score + 1)
  }
  const next = () => {
    if (i + 1 >= cards.length && score > best) setBest(score)
    setI(i + 1)
    setGiven(null)
  }
  const restart = () => {
    setCards(deck())
    setI(0)
    setGiven(null)
    setScore(0)
  }

  return (
    <Stage title="Defibrillabile o no?" hint={over ? undefined : `Tracciato ${i + 1} di ${cards.length}`}>
      {r ? (
        <>
          <EcgTrace rhythm={r.id} label={given === null ? 'Tracciato da riconoscere' : `Tracciato: ${r.name}`} />
          <p className="mt-4 font-bold">Il DAE ha analizzato questo ritmo. Che cosa dice?</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="onDark" disabled={given !== null} onClick={() => answer(true)}>
              <Zap className="size-5" aria-hidden /> Shock consigliato
            </Button>
            <Button variant="onDark" disabled={given !== null} onClick={() => answer(false)}>
              <ZapOff className="size-5" aria-hidden /> Nessuno shock
            </Button>
          </div>
          <div className="mt-4 min-h-20" aria-live="polite">
            {given !== null && (
              <div className="rounded-chip bg-well-2 p-4 [&>*+*]:mt-2">
                <p className="flex items-center gap-2 font-bold text-lume">
                  {given === shockable ? <Check className="size-5" strokeWidth={3} aria-hidden /> : <X className="size-5" strokeWidth={3} aria-hidden />}
                  {given === shockable ? 'Giusto.' : 'No.'} Il ritmo è: {r.name}.
                </p>
                <p>{r.why}</p>
                <Button variant="onDark" onClick={next}>
                  {i + 1 < cards.length ? 'Avanti' : 'Vedi il risultato'}
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3" aria-live="polite">
          <p className="font-display text-[2.2rem] font-extrabold leading-none text-lume">
            {score} su {cards.length}
          </p>
          <p>{score === cards.length ? 'Tutti riconosciuti: FV e TVSP si defibrillano, AESP/PEA e asistolia no.' : 'Ricorda: si defibrillano solo FV e TVSP. AESP/PEA e asistolia non rispondono agli shock esterni.'}</p>
          <p className="text-[0.9rem] text-well-soft">Record: {Math.max(best, score)} su {cards.length}.</p>
          <Button variant="onDark" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        </div>
      )}
    </Stage>
  )
}
