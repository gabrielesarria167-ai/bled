import { Lightbulb, LightbulbOff, Menu } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import { Plate } from './components/ui/Plate'
import { bySlug, fileKey, sections } from './course'
import { sectionState, useProgress } from './lib/progress'
import Home from './pages/Home'

type Mod = { default: ComponentType }
const sectionFiles = import.meta.glob<Mod>('./sections/*.tsx')
const pageFiles = import.meta.glob<Mod>('./pages/*.tsx')
const lazyFrom = (files: Record<string, () => Promise<Mod>>, path: string) => (files[path] ? lazy(files[path]) : null)

const Esame = lazyFrom(pageFiles, './pages/Esame.tsx')
const Simulazione = lazyFrom(pageFiles, './pages/Simulazione.tsx')
const Crediti = lazyFrom(pageFiles, './pages/Crediti.tsx')
const Lab = lazyFrom(pageFiles, './pages/Lab.tsx')
const sectionViews = Object.fromEntries(sections.map((s) => [s.slug, lazyFrom(sectionFiles, `./sections/${fileKey(s)}.tsx`)]))

function Missing({ what }: { what: string }) {
  return (
    <div className="mx-auto max-w-[60ch] px-5 py-24">
      <h1 className="text-title">{what} non è ancora pronta</h1>
      <p className="mt-4">
        Questa parte del corso è in costruzione. <Link className="underline" to="/">Torna al percorso</Link>.
      </p>
    </div>
  )
}

function SectionRoute() {
  const { slug = '' } = useParams()
  if (!bySlug(slug)) return <Navigate to="/" replace />
  const View = sectionViews[slug]
  return View ? <View key={slug} /> : <Missing what="Questa sezione" />
}

/** New page: start at the top, or at the #anchor once the lazy page has rendered. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const id = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el || ++tries > 40) clearInterval(id)
      el?.scrollIntoView()
    }, 50)
    return () => clearInterval(id)
  }, [pathname, hash])
  return null
}

function Masthead() {
  const p = useProgress()
  const done = sections.filter((s) => sectionState(p, s.slug) === 'completata').length
  const [dark, setDark] = useState(() => document.documentElement.dataset.luci === 'spente')
  const { pathname } = useLocation()

  useEffect(() => {
    if (dark) document.documentElement.dataset.luci = 'spente'
    else delete document.documentElement.dataset.luci
    try {
      localStorage.setItem('blsd-corso:luci', dark ? 'spente' : 'accese')
    } catch {
      // preference lasts for this visit only
    }
  }, [dark])
  useEffect(() => {
    document.getElementById('sezioni')?.hidePopover?.()
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-ground">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-4 px-5 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <Plate glyph="dae" className="w-10" />
          <span className="whitespace-nowrap font-display text-[1.6rem] font-extrabold leading-none max-[380px]:sr-only">Corso BLS-D</span>
        </Link>
        <p className="ml-auto hidden text-[0.92rem] text-ink-soft sm:block" aria-live="polite">
          {done} di {sections.length} sezioni completate
        </p>
        <Link to="/esame" className="hidden rounded-chip px-3 py-2 font-display text-[1.2rem] font-bold leading-none hover:bg-panel md:block">
          Esame
        </Link>
        <button type="button" popoverTarget="sezioni" className="ml-auto flex items-center gap-2 rounded-chip px-3 py-2 font-display text-[1.2rem] font-bold leading-none ring-2 ring-inset ring-line hover:ring-ink-soft sm:ml-0">
          <Menu className="size-5" aria-hidden /> Sezioni
        </button>
        <button type="button" onClick={() => setDark(!dark)} aria-pressed={dark} aria-label="Luci spente: mostra il corso come un segnale fotoluminescente al buio" title="Luci spente" className="grid size-10 place-items-center rounded-chip ring-2 ring-inset ring-line hover:ring-ink-soft">
          {dark ? <LightbulbOff className="size-5" aria-hidden /> : <Lightbulb className="size-5" aria-hidden />}
        </button>
      </div>

      <nav id="sezioni" popover="auto" aria-label="Tutte le sezioni" className="fixed inset-auto right-3 top-[4.5rem] m-0 max-h-[calc(100dvh-5.5rem)] w-[min(26rem,calc(100vw-1.5rem))] overflow-auto rounded-plate bg-ground p-3 text-ink shadow-raise ring-2 ring-line">
        <ol>
          {sections.map((s) => {
            const st = sectionState(p, s.slug)
            return (
              <li key={s.slug}>
                <Link to={`/sezione/${s.slug}`} className="flex items-center gap-3 rounded-chip p-2 hover:bg-panel">
                  <Plate glyph={s.glyph} className={`w-9 ${st === 'completata' ? '' : 'opacity-55'}`} />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[0.8rem] text-ink-soft">
                      {s.kind}
                      {st === 'completata' ? ', completata' : st === 'in-corso' ? ', in corso' : ''}
                    </span>
                    <span className="block font-bold">{s.title}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
        <div className="mt-2 flex gap-2 border-t-2 border-line pt-3 font-display text-[1.15rem] font-bold">
          <Link to="/simulazione" className="rounded-chip px-3 py-2 hover:bg-panel">Simulazione</Link>
          <Link to="/esame" className="rounded-chip px-3 py-2 hover:bg-panel">Esame finale</Link>
          <Link to="/crediti" className="rounded-chip px-3 py-2 hover:bg-panel">Crediti</Link>
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <a href="#contenuto" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-chip focus:bg-must focus:px-4 focus:py-2 focus:text-on-sign">
          Vai al contenuto
        </a>
        <Masthead />
        <main id="contenuto">
          <Suspense fallback={<p className="px-5 py-24 text-center text-ink-soft">Carico…</p>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sezione/:slug" element={<SectionRoute />} />
              <Route path="/esame" element={Esame ? <Esame /> : <Missing what="L’esame finale" />} />
              <Route path="/simulazione" element={Simulazione ? <Simulazione /> : <Missing what="La simulazione" />} />
              <Route path="/crediti" element={Crediti ? <Crediti /> : <Missing what="La pagina dei crediti" />} />
              {Lab && <Route path="/lab" element={<Lab />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="mt-16 border-t-2 border-line">
          <div className="mx-auto flex max-w-[88rem] flex-wrap gap-x-10 gap-y-2 px-5 py-8 text-[0.9rem] text-ink-soft md:px-10">
            <p className="max-w-[70ch]">Corso di studio personale basato sul manuale DAN Europe BLS-D Provider (ed. 2023, linee guida ERC 2021). Non sostituisce un corso con istruttore qualificato.</p>
            <Link to="/crediti" className="underline">Crediti di immagini e modelli 3D</Link>
          </div>
        </footer>
      </BrowserRouter>
    </MotionConfig>
  )
}
