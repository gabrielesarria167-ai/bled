import type { ReactNode } from 'react'
import models from '../../content/assets-3d.json'
import images from '../data/credits.json'

type Credit = { file: string; title?: string; alt?: string; author?: string; authorUrl?: string; sourceUrl?: string; license?: string; licenseUrl?: string }

const all = images as Credit[]
const signs = all.filter((c) => c.file.includes('iso7010/'))
const photos = all.filter((c) => !c.file.includes('iso7010/'))
const name = (c: Credit) => c.title?.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '') || c.alt || c.file
const licence = (l?: string) => l?.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1') ?? 'licenza non indicata'

const link = (href: string | undefined, text: ReactNode) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="underline">
      {text}
    </a>
  ) : (
    text
  )

function CreditList({ items }: { items: Credit[] }) {
  return (
    <ul className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
      {items.map((c) => (
        <li key={c.file} className="min-w-0 border-t-2 border-line pt-3">
          <p className="font-bold leading-snug [overflow-wrap:anywhere]">{name(c)}</p>
          <p className="text-[0.92rem] leading-snug text-ink-soft">
            {c.author ? <>Autore: {link(c.authorUrl, c.author)}. </> : 'Autore non indicato. '}
            Licenza: {link(c.licenseUrl, licence(c.license))}. {c.sourceUrl && link(c.sourceUrl, 'Fonte')}
          </p>
        </li>
      ))}
    </ul>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-sub">{title}</h2>
      <div className="mt-3 max-w-[68ch] space-y-3">{children}</div>
    </section>
  )
}

export default function Crediti() {
  return (
    <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10">
      <h1 className="text-title">Crediti</h1>
      <p className="mt-4 max-w-[60ch] text-[1.1rem] text-ink-soft">Da dove vengono i contenuti, le immagini, i modelli 3D e i caratteri di questo corso.</p>

      <Block title="Contenuti del corso">
        <p>
          I testi seguono il manuale DAN Europe BLS-D Provider, edizione 2023, basato sulle linee guida ERC (European Resuscitation Council) 2021. Sono stati riformulati per lo studio personale e non sostituiscono il manuale né un corso con un istruttore qualificato.
        </p>
        <p>Le illustrazioni a pittogrammi e i disegni animati delle manovre sono originali, realizzati per questo corso.</p>
      </Block>

      <Block title="Modelli 3D">
        <p>Tutti i modelli provengono da Sketchfab.</p>
      </Block>
      <CreditList items={models as Credit[]} />

      <Block title="Fotografie e disegni">
        {photos.length === 0 && <p>Per ora il corso non usa fotografie: quando verranno aggiunte, i loro crediti compariranno qui.</p>}
        {photos.length > 0 && <p>Immagini con licenza libera da Wikimedia Commons.</p>}
      </Block>
      {photos.length > 0 && <CreditList items={photos} />}

      <Block title="Segnali di sicurezza ISO 7010">
        <p>I segnali ISO 7010 vengono da Wikimedia Commons e sono di pubblico dominio.</p>
      </Block>
      {signs.length > 0 && <CreditList items={signs} />}

      <Block title="Caratteri">
        <p>
          I titoli usano Sofia Sans Condensed, il testo Atkinson Hyperlegible Next. Entrambi sono distribuiti con licenza{' '}
          <a href="https://openfontlicense.org" target="_blank" rel="noreferrer" className="underline">
            SIL Open Font License
          </a>
          .
        </p>
      </Block>
    </div>
  )
}
