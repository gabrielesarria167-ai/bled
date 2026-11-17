import type { ReactNode } from 'react'
import credits from '../../data/credits.json'

type Credit = { file: string; alt?: string; title?: string; author?: string; sourceUrl?: string; license?: string; width?: number; height?: number }
const all = credits as Credit[]

/**
 * An image or drawing with a caption. Pass `file` (path under /public, e.g. "img/rcp-compressioni.jpg") for a
 * credited photo: alt text and credit line come from the credits manifest. Pass children for an original SVG.
 */
export function Figure({ file, alt, caption, children, wide }: { file?: string; alt?: string; caption?: ReactNode; children?: ReactNode; wide?: boolean }) {
  const c = file ? all.find((x) => x.file === file) : undefined
  return (
    <figure className={`my-8 ${wide ? '' : 'max-w-[72ch]'}`}>
      <div className="mount overflow-hidden rounded-plate bg-panel">
        {file ? <img src={`/${file}`} alt={alt ?? c?.alt ?? ''} width={c?.width} height={c?.height} loading="lazy" className="h-auto w-full" /> : children}
      </div>
      {(caption || c) && (
        <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">
          {caption}
          {c && (
            <span className="block text-[0.8rem]">
              Immagine: {c.author ?? 'autore non indicato'}, {c.license}
              {c.sourceUrl && (
                <>
                  {' '}
                  (<a className="underline" href={c.sourceUrl} target="_blank" rel="noreferrer">Wikimedia Commons</a>)
                </>
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
