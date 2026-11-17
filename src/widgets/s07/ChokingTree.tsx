import { ArrowRight, RotateCcw, Undo2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button, SignMark } from '../../components/ui'

type Option = { label: string; next: string }
export type TreeNode = { title: string; sign?: 'nota' | 'attenzione' | 'obbligo' | 'divieto'; text: ReactNode; ask?: string; options: Option[] }

/** Mild or severe obstruction: from the question to the victim, through the signs, to the action (pp. 58–59, 61–62). */
export const tree: Record<string, TreeNode> = {
  chiedi: {
    title: 'Chiedi: «Cosa c’è? Stai soffocando?»',
    text: 'Una persona a tavola si alza in piedi e si porta le mani al collo. Le fai la domanda. Come risponde?',
    options: [
      { label: 'Riesce a rispondere', next: 'tosse' },
      { label: 'Non riesce a parlare (al massimo annuisce)', next: 'grave' },
    ],
  },
  tosse: {
    title: 'Come tossisce?',
    text: 'Risponde. Ora guarda la tosse.',
    options: [
      { label: 'Tossisce in modo efficace', next: 'respiro' },
      { label: 'Fa tentativi di tosse silenziosi e inefficaci', next: 'grave' },
    ],
  },
  respiro: {
    title: 'Come respira?',
    text: 'Risponde e tossisce in modo efficace. Ultimo segno: il respiro.',
    options: [
      { label: 'Respira', next: 'lieve' },
      { label: 'Non riesce a respirare, o ha un respiro ansimante', next: 'grave' },
    ],
  },
  lieve: {
    title: 'Ostruzione lieve',
    sign: 'nota',
    text: (
      <p>
        Risponde, tossisce in modo efficace e respira. <strong>Incoraggiala a tossire e non fare nient’altro.</strong>
      </p>
    ),
    ask: 'E se cambia qualcosa?',
    options: [{ label: 'La tosse diventa inefficace', next: 'grave' }],
  },
  grave: {
    title: 'Ostruzione grave',
    sign: 'attenzione',
    text: (
      <p>
        Basta uno di questi segni: non riesce a parlare, tosse silenziosa e inefficace, non respira o ansima. Attenzione: può <strong>perdere coscienza in breve tempo</strong>.
      </p>
    ),
    ask: 'È ancora cosciente?',
    options: [
      { label: 'Sì, è cosciente', next: 'colpi' },
      { label: 'Ha perso coscienza', next: 'rcp' },
    ],
  },
  colpi: {
    title: 'Colpi al dorso e spinte addominali',
    sign: 'obbligo',
    text: (
      <ul>
        <li>
          <strong>5 colpi al dorso</strong>, decisi, tra le due scapole.
        </li>
        <li>
          Se non hanno liberato le vie aeree, <strong>5 compressioni/spinte addominali</strong> (manovra di Heimlich).
        </li>
        <li>Dopo ogni singolo colpo o spinta verifica subito l’effetto.</li>
        <li>Ripeti colpi e spinte finché l’ostruzione non si risolve.</li>
      </ul>
    ),
    ask: 'Come va a finire?',
    options: [
      { label: 'L’oggetto esce', next: 'risolta' },
      { label: 'Perde coscienza', next: 'rcp' },
    ],
  },
  risolta: {
    title: 'Ostruzione risolta',
    sign: 'nota',
    text: <p>Ti fermi appena le vie aeree sono libere: non occorre dare tutti i colpi o le spinte previsti.</p>,
    options: [],
  },
  rcp: {
    title: 'Vittima non cosciente: RCP',
    sign: 'obbligo',
    text: (
      <ol>
        <li>Sostienila e adagiala a terra con attenzione.</li>
        <li>Attiva subito il SME (Servizio Medico di Emergenza), se nessun altro dei presenti l’ha già fatto.</li>
        <li>Inizia la RCP (rianimazione cardio-polmonare): compressioni toraciche e ventilazione artificiale secondo le linee guida BLS (Basic Life Support).</li>
      </ol>
    ),
    options: [],
  },
}

/** Walk the tree: each choice of an observed sign leads to the next question or to what to do. */
export function ChokingTree() {
  const [path, setPath] = useState<{ id: string; picked?: string }[]>([{ id: 'chiedi' }])
  const here = path[path.length - 1]
  const n = tree[here.id]
  const go = (o: Option) => setPath([...path.slice(0, -1), { ...here, picked: o.label }, { id: o.next }])

  return (
    <div className="my-10 rounded-plate bg-panel p-5 md:p-6" role="group" aria-label="Albero decisionale: ostruzione lieve o grave">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[1.7rem]">Lieve o grave? Decidi tu</h3>
        <p className="text-[0.9rem] text-ink-soft">Scegli ciò che osservi</p>
      </div>
      {path.length > 1 && (
        <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9rem] text-ink-soft" aria-label="Il percorso fatto">
          {path.slice(0, -1).map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>
                {tree[p.id].title}: <strong className="text-ink">{p.picked}</strong>
              </span>
              <ArrowRight className="size-3.5" aria-hidden />
            </li>
          ))}
        </ol>
      )}
      <div aria-live="polite" className="mt-4 rounded-chip bg-ground p-5">
        <p className="flex items-center gap-3 font-display text-[1.6rem] font-extrabold leading-tight">
          {n.sign && <SignMark kind={n.sign} className="w-8" />}
          {n.title}
        </p>
        <div className="mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-[square] [&_ul]:pl-5 [&>*+*]:mt-2">{typeof n.text === 'string' ? <p>{n.text}</p> : n.text}</div>
        {n.ask && <p className="mt-3 font-bold">{n.ask}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {n.options.map((o) => (
          <Button key={o.label} variant="must" onClick={() => go(o)}>
            {o.label}
          </Button>
        ))}
        {path.length > 1 && (
          <>
            <Button variant="quiet" onClick={() => setPath(path.slice(0, -1).map((p, i, a) => (i === a.length - 1 ? { id: p.id } : p)))}>
              <Undo2 className="size-4" aria-hidden /> Indietro
            </Button>
            <Button variant="quiet" onClick={() => setPath([{ id: 'chiedi' }])}>
              <RotateCcw className="size-4" aria-hidden /> Ricomincia
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
