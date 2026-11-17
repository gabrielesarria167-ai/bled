import { RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useReducer } from 'react'
import { Button, Stage } from '../../components/ui'
import { RcpPictogram, tones } from './Figures'

export type Phase = 'dorso' | 'addome'
export type TrainerState = { phase: Phase; count: number; cycle: number; mustCheck: boolean; end: null | 'espulso' | 'incosciente'; ok: boolean; msg: string }
export type TrainerAction = 'colpo' | 'spinta' | 'controlla' | 'espulso' | 'incosciente' | 'ricomincia'

export const PER_SERIES = 5
export const start: TrainerState = { phase: 'dorso', count: 0, cycle: 1, mustCheck: false, end: null, ok: true, msg: 'Ostruzione grave, vittima cosciente. Mettiti di fianco, leggermente dietro, falla inclinare in avanti e dai il primo colpo al dorso.' }

/** One severe-obstruction cycle: 5 back blows then 5 abdominal thrusts, each followed by a check, alternating until the end. */
export function trainer(s: TrainerState, a: TrainerAction): TrainerState {
  if (a === 'ricomincia') return start
  if (s.end) return s
  const no = (msg: string) => ({ ...s, ok: false, msg })
  if (a === 'espulso') return { ...s, end: 'espulso', mustCheck: false, ok: true, msg: 'L’oggetto è uscito: l’ostruzione è risolta. Non servono altri colpi o spinte, anche se la serie non era finita.' }
  if (a === 'incosciente') return { ...s, end: 'incosciente', mustCheck: false, ok: true, msg: 'La vittima ha perso coscienza. Ora fai così:' }
  if (a === 'controlla') {
    if (!s.mustCheck) return no(`Hai già controllato. Ora ${s.phase === 'dorso' ? 'dai il prossimo colpo al dorso' : 'esegui la prossima spinta addominale'}.`)
    if (s.count < PER_SERIES) return { ...s, mustCheck: false, ok: true, msg: `Controllato: ostruzione ancora presente. ${s.phase === 'dorso' ? `Prossimo colpo al dorso (${s.count + 1} di 5).` : `Prossima spinta addominale (${s.count + 1} di 5).`}` }
    return s.phase === 'dorso'
      ? { ...s, phase: 'addome', count: 0, mustCheck: false, ok: true, msg: 'Ancora ostruita dopo 5 colpi al dorso: passa a 5 spinte addominali (manovra di Heimlich). Mettiti dietro la vittima.' }
      : { ...s, phase: 'dorso', count: 0, cycle: s.cycle + 1, mustCheck: false, ok: true, msg: 'Ancora ostruita dopo 5 spinte addominali: torna a 5 colpi al dorso. Continua ad alternare finché l’oggetto esce o la vittima perde coscienza.' }
  }
  const want: Phase = a === 'colpo' ? 'dorso' : 'addome'
  if (s.mustCheck) return no(`Prima controlla: dopo ogni ${s.phase === 'dorso' ? 'colpo' : 'spinta'} verifica se l’ostruzione è stata rimossa.`)
  if (s.phase !== want)
    return no(want === 'addome' ? `Non ancora: prima i colpi al dorso (ne hai dati ${s.count} di 5). Le spinte addominali vengono dopo, se i colpi non bastano.` : 'Ora tocca alle spinte addominali: la serie di 5 colpi al dorso è finita.')
  const count = s.count + 1
  return { ...s, count, mustCheck: true, ok: true, msg: `${want === 'dorso' ? `Colpo ${count} di 5, secco, tra le scapole` : `Spinta ${count} di 5, verso l’interno e verso l’alto`}. Ora controlla se l’ostruzione si è risolta.` }
}

type Pt = readonly [number, number]
const path = (...p: Pt[]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')

// Side view, victim facing left and bent forward; the rescuer is at her side (blows) or right behind her (thrusts).
const res = {
  dorso: { head: [246, 84] as Pt, torso: path([264, 188], [250, 118]), legA: path([262, 196], [266, 240], [268, 284]), legB: path([270, 196], [280, 240], [288, 284]), back: path([248, 124], [200, 170], [148, 156]) },
  addome: { head: [218, 84] as Pt, torso: path([236, 190], [222, 118]), legA: path([234, 198], [238, 240], [240, 284]), legB: path([242, 198], [252, 240], [260, 284]), back: path([220, 124], [200, 175], [170, 180]) },
}
const blowUp = path([252, 122], [232, 98], [204, 84])
const blowHit = path([252, 122], [226, 112], [172, 120])
const fistRest = path([224, 124], [204, 178], [164, 180])
const fistPush = path([224, 124], [206, 166], [166, 166])

/** Severe obstruction practice: tap back blows and abdominal thrusts in the manual's 5 + 5 alternation, checking after each one. */
export function BlowsTrainer() {
  const [s, act] = useReducer(trainer, start)
  const reduce = useReducedMotion()
  const c = tones.well
  const r = res[s.phase]
  const t = { duration: reduce ? 0 : 0.5, ease: [0.23, 1, 0.32, 1] as const }
  const hit = { duration: reduce ? 0 : 0.35, ease: 'easeOut' as const }
  const n = s.count + (s.phase === 'addome' ? 100 : 0) + s.cycle * 1000

  return (
    <Stage title="Colpi al dorso e spinte addominali" hint="Tocca le azioni nell’ordine giusto, controllando dopo ognuna" footer="Sullo schermo ripassi solo la sequenza: la forza e la posizione delle mani si imparano sul manichino, con l’istruttore.">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start">
        <div>
          {s.end === 'incosciente' ? (
            <RcpPictogram tone="well" pressing className="p-4 pt-16" label="La vittima, ora non cosciente, è a terra sulla schiena; il soccorritore inginocchiato esegue le compressioni toraciche" />
          ) : (
            <svg viewBox="0 0 360 300" role="img" aria-label={s.phase === 'dorso' ? 'Vittima in piedi inclinata in avanti; il soccorritore, di fianco e leggermente dietro, la sostiene sul torace con una mano e la colpisce tra le scapole con il palmo dell’altra' : 'Soccorritore in piedi dietro la vittima inclinata in avanti, con le braccia attorno alla parte alta dell’addome e il pugno tra ombelico e sterno'} className="block h-auto w-full">
              <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={c.res}>
                <motion.path initial={false} animate={{ d: r.legA }} transition={t} strokeWidth="16" />
                <motion.path initial={false} animate={{ d: r.legB }} transition={t} strokeWidth="16" />
                <motion.path initial={false} animate={{ d: r.torso }} transition={t} strokeWidth="30" />
                <motion.path initial={false} animate={{ d: r.back }} transition={t} strokeWidth="12" />
              </g>
              <motion.circle initial={false} animate={{ cx: r.head[0], cy: r.head[1] }} transition={t} r="16" fill={c.res} />

              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M200 190 L198 238 L196 284" stroke={c.bg} strokeWidth="24" />
                <path d="M208 190 L212 238 L218 284" stroke={c.body} strokeWidth="16" />
                <path d="M200 190 L198 238 L196 284" stroke={c.body} strokeWidth="16" />
                <path d="M198 182 L140 124" stroke={c.bg} strokeWidth="40" />
                <path d="M198 182 L140 124" stroke={c.body} strokeWidth="34" />
                <path d="M146 132 L140 170 L128 200" stroke={c.bg} strokeWidth="19" />
                <path d="M146 132 L140 170 L128 200" stroke={c.body} strokeWidth="13" />
              </g>
              <circle cx="112" cy="98" r="18" fill={c.body} />

              {s.end === 'espulso' && <motion.circle r="6" fill={c.act} initial={{ cx: 100, cy: 112, opacity: 1 }} animate={{ cx: 70, cy: 284, opacity: 1 }} transition={{ duration: reduce ? 0 : 0.6, ease: 'easeIn' }} />}

              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {s.phase === 'dorso' ? (
                  <>
                    <motion.path key={`b${n}`} initial={{ d: blowUp }} animate={{ d: s.count && s.mustCheck ? [blowUp, blowHit, blowUp] : blowUp }} transition={hit} stroke={c.bg} strokeWidth="19" />
                    <motion.path key={`a${n}`} initial={{ d: blowUp }} animate={{ d: s.count && s.mustCheck ? [blowUp, blowHit, blowUp] : blowUp }} transition={hit} stroke={c.act} strokeWidth="13" />
                    {s.count > 0 && s.mustCheck && (
                      <motion.path key={`i${n}`} d="M176 100 L170 88 M188 104 L194 92 M164 108 L152 102" stroke={c.act} strokeWidth="4" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.12 }} />
                    )}
                  </>
                ) : (
                  <>
                    <motion.path key={`b${n}`} initial={{ d: fistRest }} animate={{ d: s.count && s.mustCheck ? [fistRest, fistPush, fistRest] : fistRest }} transition={hit} stroke={c.bg} strokeWidth="19" />
                    <motion.path key={`a${n}`} initial={{ d: fistRest }} animate={{ d: s.count && s.mustCheck ? [fistRest, fistPush, fistRest] : fistRest }} transition={hit} stroke={c.act} strokeWidth="13" />
                    <path d="M150 196 V164 M142 174 L150 162 L158 174" stroke={c.act} strokeWidth="4" opacity="0.8" />
                  </>
                )}
              </g>
              <rect x="20" y="288" width="320" height="6" rx="3" fill={c.floor} />
            </svg>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-display text-[1.05rem] font-bold text-well-soft">
            Ciclo {s.cycle}
            {s.end ? (s.end === 'espulso' ? ', ostruzione risolta' : ', vittima non cosciente') : ''}
          </p>
          <p className="font-display text-[1.8rem] font-extrabold leading-none">{s.phase === 'dorso' ? 'Colpi al dorso' : 'Spinte addominali'}</p>
          <ol className="mt-3 flex gap-2" aria-label={`${s.count} di 5 ${s.phase === 'dorso' ? 'colpi' : 'spinte'}`}>
            {Array.from({ length: PER_SERIES }, (_, i) => (
              <li key={i} className={`grid size-10 place-items-center rounded-full font-display text-[1.2rem] font-extrabold transition-colors duration-150 ${i < s.count ? 'bg-lume text-well' : 'text-well-soft ring-2 ring-inset ring-well-2'}`}>
                {i + 1}
              </li>
            ))}
          </ol>
          <p aria-live="polite" className={`mt-4 min-h-20 ${s.ok ? '' : 'text-lume'}`}>
            {!s.ok && <strong>Fermati. </strong>}
            {s.msg}
          </p>
          {s.end === 'incosciente' && (
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Sostienila e adagiala a terra con attenzione.</li>
              <li>Attiva subito il SME, se nessuno dei presenti l’ha già fatto.</li>
              <li>Inizia la RCP: compressioni toraciche e ventilazione artificiale secondo le linee guida BLS.</li>
            </ol>
          )}
          {!s.end && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="onDark" onClick={() => act('colpo')}>
                  Colpo al dorso
                </Button>
                <Button variant="onDark" onClick={() => act('spinta')}>
                  Spinta addominale
                </Button>
                <Button variant="onDark" onClick={() => act('controlla')}>
                  Controlla l’effetto
                </Button>
              </div>
              <p className="mt-5 text-[0.9rem] text-well-soft">In qualsiasi momento può succedere:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => act('espulso')} className="rounded-chip px-4 py-2 font-bold ring-2 ring-inset ring-well-soft transition-[box-shadow] duration-150 hover:ring-well-ink">
                  L’oggetto esce
                </button>
                <button type="button" onClick={() => act('incosciente')} className="rounded-chip px-4 py-2 font-bold ring-2 ring-inset ring-well-soft transition-[box-shadow] duration-150 hover:ring-well-ink">
                  La vittima perde coscienza
                </button>
              </div>
            </>
          )}
          <Button className="mt-5" variant="onDark" onClick={() => act('ricomincia')}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        </div>
      </div>
    </Stage>
  )
}
