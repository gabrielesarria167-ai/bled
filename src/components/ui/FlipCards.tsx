import { useState, type ReactNode } from 'react'

export type Flip = { front: string; back: ReactNode }

/** Term on the front, definition on the back. For glossaries and "what does this mean" recall. */
export function FlipCards({ items }: { items: Flip[] }) {
  return (
    <ul className="my-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => (
        <FlipCard key={c.front} {...c} />
      ))}
    </ul>
  )
}

function FlipCard({ front, back }: Flip) {
  const [open, setOpen] = useState(false)
  return (
    <li className="[perspective:900px]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative block min-h-36 w-full text-left transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: open ? 'rotateY(180deg)' : undefined }}
      >
        <span className="plate absolute inset-0 grid place-items-center p-5 text-center font-display text-[1.6rem] font-extrabold leading-none [backface-visibility:hidden]">{front}</span>
        <span className="absolute inset-0 grid place-items-center overflow-auto rounded-plate bg-panel p-4 text-[0.92rem] leading-snug ring-2 ring-inset ring-safe [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</span>
        <span className="sr-only">{open ? 'Nascondi la definizione' : 'Mostra la definizione'}</span>
      </button>
    </li>
  )
}
