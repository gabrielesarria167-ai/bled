import { Check, RotateCcw, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useReducer, type KeyboardEvent } from 'react'
import { Button, Stage } from '../../components/ui'
import { SOAK_AT, bleedRate, initial, reduce, type Msg } from './pressure'

const ease = [0.23, 1, 0.32, 1] as const

const text: Record<Msg, { t: string; ok?: boolean; bad?: boolean }> = {
  inizio: { t: 'Una ferita all’avambraccio sanguina molto. Prima di toccarla, proteggiti.' },
  'prima-guanti': { t: 'Prima indossa i guanti: devi proteggerti ed evitare il contatto con sangue e altri fluidi corporei.', bad: true },
  'guanti-ok': { t: 'Guanti indossati. Ora tampona: appoggia sulla ferita una garza, possibilmente sterile o comunque perfettamente pulita.', ok: true },
  'prima-garza': { t: 'Tamponare vuol dire coprire la ferita con una garza e premerci sopra con la mano: appoggia prima la garza.', bad: true },
  'garza-ok': { t: 'Garza appoggiata. Ora fai pressione diretta con la mano: tieni premuto sulla ferita.', ok: true },
  premi: { t: 'Pressione diretta in corso: continua a premere.' },
  lasciato: { t: 'Hai tolto la mano: senza pressione diretta il sanguinamento non si controlla. Torna a premere sulla garza.', bad: true },
  intriso: { t: 'Il sangue filtra attraverso il tampone. Cosa fai con la garza intrisa?' },
  decidi: { t: 'Prima decidi cosa fare con la garza intrisa di sangue.' },
  'non-togliere': {
    t: 'No: il tampone non va tolto. Toglierlo potrebbe peggiorare le cose, perché porterebbe via il coagulo, anche solo parziale, che si è formato e che aiuta a controllare il sanguinamento. Lascialo dov’è e aggiungi altro materiale assorbente sopra.',
    bad: true,
  },
  aggiunto: { t: 'Giusto: altro materiale assorbente sopra il primo tampone, che resta al suo posto. Continua la pressione diretta. Se l’emorragia continuasse ancora, andrebbe valutato l’uso di lacci o bende emostatici.', ok: true },
  fermata: { t: 'L’emorragia si è fermata. Ora fissa il tampone con un bendaggio abbastanza grande da coprire per intero tampone e ferita.', ok: true },
  fatto: {
    t: 'Bendaggio fatto: stretto, ma senza bloccare la circolazione. Ora controlla il refill ungueale, rassicura l’infortunato e digli di restare il più fermo possibile, immobilizza l’arto, valuta i segni vitali e cerca eventuali segni di shock.',
    ok: true,
  },
}

/** Press and hold on the wound: direct pressure, a soaked dressing that must stay, more gauze on top, then the bandage. */
export function PressureTrainer() {
  const [s, dispatch] = useReducer(reduce, initial)
  const active = s.phase === 'premi' || s.phase === 'premi2'
  const rate = bleedRate(s)
  const drops = Math.round(rate * 4)
  const m = text[s.msg]
  const soak = s.phase === 'premi' ? (s.hold / SOAK_AT) * 0.75 : s.layers ? 0.8 : 0

  useEffect(() => {
    if (!active) return
    let last = performance.now()
    let raf = requestAnimationFrame(function loop(t) {
      dispatch({ type: 'tick', dt: t - last })
      last = t
      raf = requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(raf)
  }, [active])

  const keyDown = (e: KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (!e.repeat) dispatch({ type: 'press' })
  }
  const keyUp = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') dispatch({ type: 'release' })
  }
  const release = () => dispatch({ type: 'release' })

  return (
    <Stage title="Prova la pressione diretta" hint="Tieni premuto sulla ferita, col dito, il mouse o la barra spaziatrice" footer="Una simulazione: i tempi sono accelerati e non sono indicazioni del manuale.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <button
            type="button"
            className="block w-full touch-none select-none rounded-plate bg-well-2"
            aria-label="Ferita: tieni premuto per fare pressione diretta con la mano"
            aria-pressed={s.pressing}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              dispatch({ type: 'press' })
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onLostPointerCapture={release}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
            onBlur={release}
            onContextMenu={(e) => e.preventDefault()}
          >
            <svg viewBox="0 0 400 230" className="w-full" aria-hidden>
              {/* forearm and hand */}
              <rect x="10" y="112" width="320" height="56" rx="28" fill="var(--well-soft)" />
              <rect x="300" y="104" width="88" height="70" rx="32" fill="var(--well-soft)" />
              <ellipse cx="170" cy="126" rx="26" ry="6" fill="var(--danger)" />
              {/* blood running off the arm */}
              {Array.from({ length: drops }, (_, i) => (
                <motion.circle key={`${drops}-${i}`} cx={150 + i * 13} cy="172" r="4.5" fill="var(--danger)" initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 48], opacity: [0, 1, 0] }} transition={{ duration: 1.1, delay: i * 0.27, repeat: Infinity, ease: 'easeIn' }} />
              ))}
              {/* first dressing, staining as it soaks */}
              {s.layers > 0 && (
                <g>
                  <rect x="130" y="102" width="80" height="30" rx="4" fill="var(--well-ink)" />
                  <ellipse cx="170" cy="117" rx="34" ry="12" fill="var(--danger)" opacity={soak} />
                </g>
              )}
              {s.layers > 1 && (
                <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease }}>
                  <rect x="122" y="94" width="96" height="30" rx="4" fill="var(--well-ink)" />
                  <ellipse cx="170" cy="110" rx="20" ry="7" fill="var(--danger)" opacity={s.phase === 'premi2' ? s.hold - SOAK_AT : 0.25} />
                </motion.g>
              )}
              {/* bandage covering dressing and wound */}
              {s.phase === 'fatto' && (
                <motion.g style={{ originX: 0, originY: 0.5 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3, ease }}>
                  <rect x="104" y="96" width="132" height="78" rx="10" fill="var(--well-ink)" />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <rect key={i} x={112 + i * 25} y="98" width="5" height="74" rx="2.5" fill="var(--well-soft)" opacity="0.6" transform={`rotate(18 ${114 + i * 25} 135)`} />
                  ))}
                </motion.g>
              )}
              {/* rescuer's gloved hand */}
              <motion.g initial={false} animate={{ y: s.pressing ? 0 : -26, opacity: s.pressing ? 1 : 0 }} transition={{ duration: 0.15, ease }}>
                <rect x="148" y="0" width="44" height="70" rx="18" fill="var(--lume)" opacity="0.75" />
                <rect x="124" y="58" width="92" height="38" rx="16" fill="var(--lume)" />
              </motion.g>
            </svg>
          </button>
          <div className="mt-4">
            <div className="flex justify-between text-[0.88rem] text-well-soft">
              <span id="s08-meter">Controllo del sanguinamento</span>
              <span>{Math.round(s.hold * 100)}%</span>
            </div>
            <div className="relative mt-1 h-3 overflow-hidden rounded-chip bg-well-2" role="progressbar" aria-labelledby="s08-meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(s.hold * 100)}>
              <div className="absolute inset-0 origin-left bg-lume" style={{ transform: `scaleX(${s.hold})` }} />
              <div className="absolute inset-y-0 w-0.5 bg-well" style={{ left: `${SOAK_AT * 100}%` }} aria-hidden />
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[0.9rem] text-well-soft">
            Guanti: {s.phase === 'guanti' ? 'no' : 'sì'}. Strati di garza: {s.layers}. Errori: {s.errors}.
          </p>
          <p className="mt-3 flex gap-2 text-[1.08rem] leading-snug" aria-live="polite">
            {m.ok && <Check className="mt-1 size-5 shrink-0 text-lume" strokeWidth={3} aria-label="Corretto" />}
            {m.bad && <X className="mt-1 size-5 shrink-0 text-well-ink" strokeWidth={3} aria-label="Errore" />}
            <span className={m.ok ? 'text-lume' : ''}>{m.t}</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {(s.phase === 'guanti' || s.phase === 'garza') && (
              <>
                {s.phase === 'guanti' && (
                  <Button variant="onDark" onClick={() => dispatch({ type: 'guanti' })}>
                    Indossa i guanti
                  </Button>
                )}
                <Button variant="onDark" onClick={() => dispatch({ type: 'garza' })}>
                  Appoggia la garza
                </Button>
              </>
            )}
            {s.phase === 'intriso' && (
              <>
                <Button variant="onDark" onClick={() => dispatch({ type: 'togli' })}>
                  Togli la garza intrisa e mettine una nuova
                </Button>
                <Button variant="onDark" onClick={() => dispatch({ type: 'aggiungi' })}>
                  Lasciala e aggiungi altra garza sopra
                </Button>
              </>
            )}
            {s.phase === 'benda' && (
              <Button variant="onDark" onClick={() => dispatch({ type: 'benda' })}>
                Fissa il tampone con il bendaggio
              </Button>
            )}
            {s.phase !== 'guanti' && (
              <Button variant="onDark" onClick={() => dispatch({ type: 'reset' })}>
                <RotateCcw className="size-4" aria-hidden /> Ricomincia
              </Button>
            )}
          </div>
          {s.phase === 'fatto' && (
            <p className="mt-5 font-display text-[1.5rem] font-extrabold leading-tight text-lume" aria-live="polite">
              {s.errors === 0 ? 'Sequenza completa, senza errori.' : `Sequenza completa, con ${s.errors} ${s.errors === 1 ? 'errore' : 'errori'}. Riprova per farla senza.`}
            </p>
          )}
        </div>
      </div>
    </Stage>
  )
}
