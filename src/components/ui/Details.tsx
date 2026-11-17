import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

/** Native disclosure. Give several the same `group` to make them exclusive. Use for secondary detail, never for core content. */
export function Details({ title, children, group, open }: { title: string; children: ReactNode; group?: string; open?: boolean }) {
  return (
    <details name={group} open={open} className="group my-3 max-w-[72ch] rounded-plate bg-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-display text-[1.3rem] font-bold leading-tight [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-4 pb-5 [&>*+*]:mt-3 [&_ul]:list-[square] [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">{children}</div>
    </details>
  )
}
