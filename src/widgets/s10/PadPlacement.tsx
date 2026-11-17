import { Check } from 'lucide-react'
import { useState } from 'react'
import { ModelStage, type Hotspot } from '../../components/three/ModelStage'
import { Stage } from '../../components/ui'
import { PadBoard } from './PadBoard'
import type { Body } from './pads'

const BODIES: { id: Body; label: string; hint: string }[] = [
  { id: 'uomo', label: 'Uomo', hint: 'Il secondo elettrodo va subito sotto il muscolo pettorale.' },
  { id: 'donna', label: 'Donna', hint: 'Il secondo elettrodo va subito sotto la mammella.' },
  { id: 'seno', label: 'Seno abbondante', hint: 'Evita il tessuto mammario: lateralmente oppure sotto il seno sinistro.' },
]

/** Place both electrodes on three chests (uomo, donna, seno abbondante), with a few centimetres of tolerance. */
export function PadPlacement() {
  const [body, setBody] = useState<Body>('uomo')
  const [solved, setSolved] = useState<Body[]>([])
  return (
    <Stage title="Applica gli elettrodi" hint="Destra e sinistra sono quelle della vittima.">
      <div role="radiogroup" aria-label="Torace" className="mb-4 flex flex-wrap gap-2">
        {BODIES.map((b) => (
          <button key={b.id} type="button" role="radio" aria-checked={body === b.id} onClick={() => setBody(b.id)} className={`rounded-chip px-3 py-2 font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${body === b.id ? 'bg-lume text-well ring-lume' : 'text-well-ink ring-well-2 hover:ring-well-soft'}`}>
            {b.label}
            {solved.includes(b.id) && <span className="sr-only">, completato</span>}
            {solved.includes(b.id) && <Check className="ml-1 inline size-4 align-[-0.15em]" strokeWidth={3.5} aria-hidden />}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <PadBoard key={body} body={body} onDone={() => setSolved((s) => (s.includes(body) ? s : [...s, body]))} />
        <div className="space-y-3 text-[0.97rem]">
          <p className="font-bold text-lume">{BODIES.find((b) => b.id === body)!.hint}</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Un elettrodo sulla parte destra del torace, subito sotto la clavicola e a destra dello sterno.</li>
            <li>L’altro sul fianco sinistro del torace, subito sotto il muscolo pettorale (uomo) o subito sotto la mammella (donna): la linea ascellare mediana sinistra.</li>
          </ol>
          <p className="text-well-soft">La posizione può scostarsi di qualche centimetro, ma deve essere il più possibile corretta. Qui la tolleranza è di qualche centimetro attorno al punto giusto.</p>
          <p className="text-well-soft">Completati: {solved.length} di {BODIES.length}.</p>
        </div>
      </div>
    </Stage>
  )
}

const padHotspots: Hotspot[] = [
  { at: [-0.1, 0.68, 0.12], label: 'Elettrodo destro', text: <p>Sulla parte destra del torace, subito sotto la clavicola e a destra dello sterno.</p> },
  { at: [0.19, 0.5, 0.1], label: 'Elettrodo sinistro', text: <p>Sul fianco sinistro, subito sotto il muscolo pettorale (nella donna subito sotto la mammella), sulla linea ascellare mediana sinistra.</p> },
]

/** The two electrodes as flat pads on the standing body: plain meshes, same stage units as the hotspots. */
function Pads() {
  return (
    <>
      <mesh position={[-0.1, 0.68, 0.105]}>
        <boxGeometry args={[0.11, 0.14, 0.012]} />
        <meshStandardMaterial roughness={0.55} />
      </mesh>
      <mesh position={[0.19, 0.5, 0.07]} rotation={[0, 1.05, 0]}>
        <boxGeometry args={[0.11, 0.15, 0.012]} />
        <meshStandardMaterial roughness={0.55} />
      </mesh>
    </>
  )
}

export function TorsoPads() {
  return (
    <Stage title="Le piastre sul corpo" hint="Ruota il corpo per vedere il fianco sinistro.">
      {
        // 3D-CHECK
        <ModelStage src="/models/torso.glb" target={[0, 0.5, 0]} distance={1.8} alt="Corpo maschile in piedi visto di fronte, con le due piastre del DAE: una sotto la clavicola destra, l’altra sul fianco sinistro, sulla linea ascellare mediana." hotspots={padHotspots}>
          <Pads />
        </ModelStage>
      }
    </Stage>
  )
}

const aedHotspots: Hotspot[] = [
  { at: [-0.5, 0.35, 0.4], label: 'Accensione', text: <p>Per iniziare, secondo il modello, sollevi il coperchio oppure premi il pulsante di accensione.</p> },
  { at: [0.4, 0.4, 0.4], label: 'Istruzioni vocali e pittogrammi', text: <p>Il DAE ti guida passo dopo passo con istruzioni vocali, spesso aiutate da infografiche e pittogrammi.</p> },
  { at: [0.15, -0.15, 0.45], label: 'Pulsante di scarica', text: <p>Con un DAE semiautomatico, quando la scarica è necessaria il dispositivo ti dice di premere questo pulsante. Con un DAE completamente automatico non si preme nulla: lo shock parte da solo dopo pochi secondi di preavviso.</p> },
  { at: [-0.6, -0.4, 0.3], label: 'Connettore delle piastre', text: <p>Gli elettrodi devono essere collegati al DAE: verifica che il connettore delle placche sia inserito correttamente.</p> },
]

export function AedModel() {
  return (
    <Stage title="Il DAE in 3D" hint="Trascina per ruotare, scegli un numero.">
      {
        // 3D-CHECK
        <ModelStage src="/models/aed.glb" alt="Defibrillatore automatico esterno (DAE) senza piastre, con il pulsante di accensione e il pulsante di scarica sul pannello frontale." hotspots={aedHotspots} autoRotate />
      }
    </Stage>
  )
}
