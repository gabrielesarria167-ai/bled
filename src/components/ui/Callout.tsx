import type { ReactNode } from 'react'
import { SignMark } from './Plate'

const kinds = {
  nota: { bg: 'bg-safe-tint', label: 'Nota' },
  attenzione: { bg: 'bg-warn-tint', label: 'Attenzione' },
  obbligo: { bg: 'bg-must-tint', label: 'Da fare sempre' },
  divieto: { bg: 'bg-danger-tint', label: 'Da non fare' },
}

/**
 * A boxed note. The sign shape says what kind it is:
 * square green = information, yellow triangle = caution, blue circle = obligatory action, red ring = prohibition.
 */
export function Callout({ kind = 'nota', title, children }: { kind?: keyof typeof kinds; title?: string; children: ReactNode }) {
  const k = kinds[kind]
  return (
    <aside className={`${k.bg} my-6 flex max-w-[72ch] gap-4 rounded-plate p-5`}>
      <SignMark kind={kind} className="mt-0.5 w-10" />
      <div className="min-w-0 [&>*+*]:mt-2 [&_ul]:list-[square] [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        <p className="font-display text-[1.3rem] font-bold leading-tight">{title ?? k.label}</p>
        {children}
      </div>
    </aside>
  )
}
