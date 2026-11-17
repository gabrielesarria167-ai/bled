import { useState } from 'react'
import { ModelStage, type Hotspot } from '../../components/three/ModelStage'
import { Pictogram, Stage } from '../../components/ui'

const outside: Hotspot[] = [
  { at: [0.18, 0.98, 0.05], label: 'Grossi vasi', text: <p>Dalla parte superiore del cuore escono i grossi vasi. Il cuore è una pompa muscolare potente: spinge il sangue in tutto l’organismo.</p> },
  { at: [-0.55, 0.45, 0.25], label: 'Atrio destro', text: <p>Gli atri sono le camere superiori: accolgono il sangue che arriva dal corpo oppure dai polmoni. Nell’atrio destro si trova il nodo seno-atriale (NSA), il pacemaker principale.</p> },
  { at: [-0.3, -0.25, 0.55], label: 'Ventricolo destro', text: <p>Manda ai polmoni il sangue povero di ossigeno, quello che ritorna al cuore, lungo la circolazione polmonare (piccolo circolo).</p> },
  { at: [0.35, -0.45, 0.35], label: 'Ventricolo sinistro', text: <p>Manda il sangue ossigenato a tutto l’organismo lungo la circolazione sistemica (grande circolo). A ogni contrazione (sistole) ne espelle circa 70 mL: è la gittata sistolica.</p> },
  { at: [0.1, 0.15, 0.62], label: 'Coronarie', text: <p>Anche il muscolo cardiaco riceve sangue, da una rete di arterie: le coronarie. Se una o più si chiudono si ha l’infarto (paragrafo 10.2).</p> },
]

const inside: Hotspot[] = [
  { at: [-0.43, 0.06, 0.25], label: 'Atrio destro', text: <p>Camera superiore della sezione destra: accoglie il sangue in arrivo. Qui nasce l’impulso elettrico, nel nodo seno-atriale (NSA).</p> },
  { at: [0.4, 0.21, 0.25], label: 'Atrio sinistro', text: <p>Camera superiore della sezione sinistra: accoglie il sangue in arrivo e lo passa al ventricolo sottostante.</p> },
  { at: [-0.4, -0.25, 0.28], label: 'Dall’atrio al ventricolo', text: <p>Ogni ventricolo si riempie con il sangue che scende dall’atrio posto sopra di esso. Poi la contrazione muscolare spinge il sangue fuori dalla camera.</p> },
  { at: [-0.43, -0.57, 0.31], label: 'Ventricolo destro', text: <p>Camera inferiore destra: spinge verso i polmoni il sangue povero di ossigeno (piccolo circolo).</p> },
  { at: [0.41, -0.5, 0.22], label: 'Ventricolo sinistro', text: <p>Camera inferiore sinistra: spinge il sangue ossigenato in tutto l’organismo (grande circolo).</p> },
  { at: [0.05, -0.45, 0.3], label: 'Due sezioni separate', text: <p>Il cuore è fatto di due sezioni separate, ciascuna con due camere: un atrio sopra e un ventricolo sotto.</p> },
]

const tab = (on: boolean) => `rounded-chip px-3 py-2 font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${on ? 'bg-lume text-well ring-lume' : 'text-well-ink ring-well-2 hover:ring-well-soft'}`

/** The heart outside (heart.glb) and cut open (heart-section.glb, 28 MB, loaded on request). */
export function HeartModels() {
  const [cut, setCut] = useState(false)
  return (
    <Stage title="Il cuore in 3D" hint="Trascina per ruotare, scegli un numero per leggere.">
      <div role="radiogroup" aria-label="Vista del cuore" className="mb-4 flex flex-wrap gap-2">
        <button type="button" role="radio" aria-checked={!cut} className={tab(!cut)} onClick={() => setCut(false)}>
          Visto da fuori
        </button>
        <button type="button" role="radio" aria-checked={cut} className={tab(cut)} onClick={() => setCut(true)}>
          In sezione: le quattro camere
        </button>
      </div>
      {cut ? (
        // 3D-CHECK
        <ModelStage key="sezione" src="/models/heart-section.glb" deferLabel="28 MB" rotation={[0, -Math.PI / 2, 0]} alt="Cuore aperto in sezione: si vedono i due atri in alto, i due ventricoli in basso e i vasi rossi e blu." hotspots={inside} />
      ) : (
        // 3D-CHECK
        <ModelStage key="esterno" src="/models/heart.glb" alt="Cuore umano visto di fronte, con i grossi vasi che escono in alto e il muscolo dei ventricoli in basso." hotspots={outside} autoRotate />
      )}
    </Stage>
  )
}

const levels = [
  { k: 1, label: 'A riposo' },
  { k: 2, label: 'Sforzo: il doppio' },
  { k: 3, label: 'Sforzo intenso: il triplo' },
]

/** Cardiac output = stroke volume × heart rate, and what effort does to it (p. 79). */
export function CardiacOutput() {
  const [k, setK] = useState(1)
  return (
    <div className="my-8 grid max-w-[72ch] gap-6 rounded-plate bg-panel p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <span className="mx-auto grid size-24 place-items-center rounded-plate bg-ground text-safe">
        <span className="motion-safe:animate-[beat_0.857s_ease-out_infinite]">
          <Pictogram name="cuore" className="w-16" />
        </span>
      </span>
      <div className="min-w-0">
        <p className="font-display text-[1.35rem] font-bold leading-tight">Calcola la gittata cardiaca</p>
        <div role="radiogroup" aria-label="Intensità dell’attività" className="mt-3 flex flex-wrap gap-2">
          {levels.map((l) => (
            <button key={l.k} type="button" role="radio" aria-checked={k === l.k} onClick={() => setK(l.k)} className={`rounded-chip px-3 py-2 text-[0.95rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${k === l.k ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-[3px] bg-panel-2" aria-hidden>
          <div className="h-full origin-left bg-safe transition-transform duration-300 ease-out" style={{ transform: `scaleX(${k / 3})` }} />
        </div>
        <p className="mt-3" aria-live="polite">
          {k === 1 ? (
            <>
              Gittata sistolica × frequenza cardiaca: <strong>0,07 L × 70 bpm ≈ 5 litri al minuto</strong>, all’incirca tutto il volume di sangue del corpo.
            </>
          ) : (
            <>
              Con l’attività fisica la gittata cardiaca diventa {k === 2 ? 'il doppio' : 'il triplo'}: <strong>circa {5 * k} litri al minuto</strong>, a seconda dell’intensità dello sforzo.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
