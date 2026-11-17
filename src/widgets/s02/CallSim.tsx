import { Check, Phone, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'
import { callFeedback, infos, lines } from './call'

const text = (id: string) => lines.find((l) => l.id === id)?.text ?? ''

/**
 * A call to 112: pick the sentences to say, then end the call. Feedback lists which of the six
 * items the SME needs were given, which are missing and which sentences were too vague. For use inside a <Stage>.
 */
export function CallSim() {
  const [said, setSaid] = useState<string[]>([])
  const [ended, setEnded] = useState(false)
  const f = callFeedback(said)
  const left = lines.filter((l) => !said.includes(l.id))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="text-well-soft">
          Sei in un bar, il bar Centrale di via Roma 12, di fronte alla stazione. Un uomo crolla a terra: non risponde e respira in modo lento e faticoso. Hai chiamato il 112, messo il vivavoce e iniziato le compressioni. Ti chiami Luca Bianchi.
        </p>
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className="flex max-w-[34ch] items-start gap-2 rounded-chip bg-well-2 p-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-lume" aria-hidden />
            <span>
              <span className="sr-only">Operatore: </span>Numero unico di emergenza, mi dica.
            </span>
          </p>
          {said.map((id) => (
            <p key={id} className="ml-auto flex max-w-[36ch] items-start gap-2 rounded-chip bg-well-ink p-3 text-well">
              <span className="min-w-0 flex-1">
                <span className="sr-only">Tu: </span>
                {text(id)}
              </span>
              {!ended && (
                <button type="button" onClick={() => setSaid((cur) => cur.filter((s) => s !== id))} aria-label={`Togli la frase: ${text(id)}`} className="grid size-7 shrink-0 place-items-center rounded-chip hover:bg-well-soft/40">
                  <X className="size-4" aria-hidden />
                </button>
              )}
            </p>
          ))}
        </div>
      </div>

      <div>
        {!ended ? (
          <>
            <p className="font-display text-[1.3rem] font-bold leading-tight text-lume">Che cosa dici all’operatore?</p>
            <p className="mt-1 text-[0.92rem] text-well-soft">Scegli le frasi una alla volta. Quando pensi di aver detto tutto, termina la chiamata.</p>
            <div className="mt-3 space-y-2">
              {left.map((l) => (
                <button key={l.id} type="button" onClick={() => setSaid((s) => [...s, l.id])} className="block w-full rounded-chip bg-well-2 p-3 text-left ring-2 ring-inset ring-transparent transition-colors duration-150 hover:ring-well-soft">
                  {l.text}
                </button>
              ))}
            </div>
            <Button variant="onDark" className="mt-4" disabled={said.length === 0} onClick={() => setEnded(true)}>
              Termina la chiamata
            </Button>
          </>
        ) : (
          <div aria-live="polite">
            <p className="font-display text-[1.3rem] font-bold leading-tight text-lume">{f.complete ? 'Chiamata completa.' : `Hai dato ${f.covered.size} informazioni su 6.`}</p>
            <div role="list" className="mt-3 space-y-1.5">
              {infos.map((i) => {
                const ok = f.covered.has(i.id)
                return (
                  <div role="listitem" key={i.id} className={`flex items-start gap-2 ${ok ? '' : 'text-well-soft'}`}>
                    {ok ? <Check className="mt-0.5 size-5 shrink-0 text-lume" strokeWidth={3} aria-hidden /> : <X className="mt-0.5 size-5 shrink-0" strokeWidth={3} aria-hidden />}
                    <span>
                      {i.label}: <strong>{ok ? 'detto' : 'manca'}</strong>
                    </span>
                  </div>
                )
              })}
            </div>
            {f.vague.length > 0 && (
              <div className="mt-4 rounded-chip bg-well-2 p-3 [&>*+*]:mt-2">
                <p className="font-bold">Frasi troppo vaghe</p>
                {f.vague.map((l) => (
                  <p key={l.id}>
                    “{l.text}” {l.why}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-4">
              {f.complete
                ? 'Hai detto tutto in modo preciso. Ora resta in linea e rispondi alle domande dell’operatore.'
                : 'Ricomincia e completa la chiamata: chi chiama deve dare tutte e sei le informazioni, in modo chiaro e preciso.'}
            </p>
            <Button
              variant="onDark"
              className="mt-4"
              onClick={() => {
                setSaid([])
                setEnded(false)
              }}
            >
              <RotateCcw className="size-4" aria-hidden /> Ricomincia
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
