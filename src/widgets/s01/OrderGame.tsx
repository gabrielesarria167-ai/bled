import { ArrowDown, ArrowUp, Check, GripVertical, RotateCcw, X } from 'lucide-react'
import { Reorder, useDragControls } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Button } from '../../components/ui'
import { inPlace, move } from './order'

type Item = { id: string; text: string }

/**
 * Put the items in the right order (drag by the grip, or use the arrows), then Verifica.
 * For use inside a <Stage>: every row is marked "al posto giusto" or "da spostare".
 * `items` must be given already scrambled; `answer` is the correct sequence of ids.
 */
export function OrderGame({ items, answer, label, solved }: { items: Item[]; answer: string[]; label: string; solved?: ReactNode }) {
  const [order, setOrder] = useState(() => items.map((i) => i.id))
  const [checked, setChecked] = useState(false)
  const text = (id: string) => items.find((i) => i.id === id)?.text ?? ''
  const right = inPlace(order, answer)
  const allRight = right === answer.length

  return (
    <div role="group" aria-label={label}>
      <Reorder.Group as="div" role="list" axis="y" values={order} onReorder={(v: string[]) => !checked && setOrder(v)} className="space-y-2">
        {order.map((id, i) => (
          <Row key={id} id={id} n={i + 1} text={text(id)} last={i === order.length - 1} state={checked ? (answer[i] === id ? 'ok' : 'no') : null} onMove={(d) => setOrder(move(order, i, d))} />
        ))}
      </Reorder.Group>

      <div aria-live="polite" className="mt-4 min-h-6">
        {checked &&
          (allRight ? (
            <div className="rounded-chip bg-well-2 p-4 [&>*+*]:mt-2">
              <p className="flex items-center gap-2 font-bold text-lume">
                <Check className="size-5" strokeWidth={3} aria-hidden /> Ordine corretto.
              </p>
              {solved}
            </div>
          ) : (
            <p className="rounded-chip bg-well-2 p-4">
              <span className="font-bold">
                {right} di {answer.length} al posto giusto.
              </span>{' '}
              Le voci segnate “da spostare” sono fuori posto: premi Correggi, spostale e verifica di nuovo.
            </p>
          ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {!checked && (
          <Button variant="onDark" onClick={() => setChecked(true)}>
            Verifica
          </Button>
        )}
        {checked && !allRight && (
          <Button variant="onDark" onClick={() => setChecked(false)}>
            Correggi
          </Button>
        )}
        {checked && allRight && (
          <Button
            variant="onDark"
            onClick={() => {
              setOrder(items.map((i) => i.id))
              setChecked(false)
            }}
          >
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>
    </div>
  )
}

function Row({ id, n, text, last, state, onMove }: { id: string; n: number; text: string; last: boolean; state: 'ok' | 'no' | null; onMove: (d: -1 | 1) => void }) {
  const drag = useDragControls()
  const locked = state !== null
  const arrow = 'grid size-9 place-items-center rounded-chip ring-2 ring-inset ring-well-soft/40 hover:ring-well-soft disabled:opacity-30'
  return (
    <Reorder.Item
      as="div"
      role="listitem"
      value={id}
      dragListener={false}
      dragControls={drag}
      className={`flex items-center gap-2 rounded-chip bg-well-2 py-2 pl-1 pr-2 ring-2 ring-inset ${state === 'ok' ? 'ring-lume' : 'ring-transparent'}`}
    >
      <span onPointerDown={(e) => !locked && drag.start(e)} className={`grid h-10 w-7 shrink-0 touch-none place-items-center text-well-soft ${locked ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`} aria-hidden>
        <GripVertical className="size-5" />
      </span>
      <span className="w-6 shrink-0 font-display text-[1.35rem] font-extrabold leading-none text-lume">{n}</span>
      <span className="min-w-0 flex-1 leading-snug">{text}</span>
      {state === 'ok' && (
        <span className="flex shrink-0 items-center gap-1 text-[0.88rem] text-lume">
          <Check className="size-4" strokeWidth={3} aria-hidden /> al posto giusto
        </span>
      )}
      {state === 'no' && (
        <span className="flex shrink-0 items-center gap-1 text-[0.88rem] text-well-soft">
          <X className="size-4" strokeWidth={3} aria-hidden /> da spostare
        </span>
      )}
      {!locked && (
        <span className="flex shrink-0 gap-1">
          <button type="button" className={arrow} disabled={n === 1} onClick={() => onMove(-1)} aria-label={`Sposta su: ${text}`}>
            <ArrowUp className="size-4" aria-hidden />
          </button>
          <button type="button" className={arrow} disabled={last} onClick={() => onMove(1)} aria-label={`Sposta giù: ${text}`}>
            <ArrowDown className="size-4" aria-hidden />
          </button>
        </span>
      )}
    </Reorder.Item>
  )
}
