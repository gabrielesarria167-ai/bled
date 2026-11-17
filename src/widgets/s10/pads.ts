/** Electrode positions on the chest drawing (viewBox 320 × 400; the victim faces you, so her right is on your left). */

export type Body = 'uomo' | 'donna' | 'seno'
export type Target = 'R' | 'L'
export type Spot = { id: string; x: number; y: number; label: string; target?: Target; why: string }
export type Verdict = { ok: boolean; target?: Target; spot?: Spot; why: string }

export const W = 320
export const H = 400
/** "La posizione può scostarsi di qualche centimetro": a drop this close to a correct spot counts. */
const TOL = 26
const NEAR = 38

export const GENERIC = 'Fuori posizione. Un elettrodo va sulla parte destra del torace, subito sotto la clavicola e a destra dello sterno; l’altro sul fianco sinistro, subito sotto il muscolo pettorale (uomo) o la mammella (donna).'

const common: Spot[] = [
  { id: 'dx-clav', x: 130, y: 124, label: 'Sotto la clavicola destra, a destra dello sterno', target: 'R', why: 'Giusto: subito sotto la clavicola destra, a destra dello sterno.' },
  { id: 'sx-clav', x: 190, y: 124, label: 'Sotto la clavicola sinistra', why: 'Qui no: è sotto la clavicola sinistra, in posizione speculare all’elettrodo destro. Destra e sinistra sono quelle della vittima: guardandola di fronte, la sua destra è alla tua sinistra.' },
  { id: 'sterno', x: 160, y: 160, label: 'Sopra lo sterno', why: 'Non sopra lo sterno: un elettrodo va subito sotto la clavicola destra, a destra dello sterno.' },
  { id: 'dx-fianco', x: 88, y: 226, label: 'Fianco destro', why: 'Questo è il fianco destro della vittima. L’altro elettrodo va sul suo fianco sinistro, che guardandola di fronte è alla tua destra.' },
  { id: 'sotto-dx', x: 130, y: 196, label: 'Sotto l’elettrodo destro', why: 'Non sotto l’elettrodo destro: l’altro va sul fianco sinistro del torace.' },
  { id: 'addome', x: 160, y: 296, label: 'Sull’addome', why: 'Troppo in basso: gli elettrodi vanno sul torace, uno sotto la clavicola destra e uno sul fianco sinistro.' },
]

export const SPOTS: Record<Body, Spot[]> = {
  uomo: [...common, { id: 'sx-fianco', x: 232, y: 224, label: 'Fianco sinistro, sotto il pettorale, sulla linea ascellare mediana', target: 'L', why: 'Giusto: fianco sinistro, subito sotto il muscolo pettorale, sulla linea ascellare mediana sinistra.' }],
  donna: [
    ...common,
    { id: 'sx-fianco', x: 234, y: 238, label: 'Fianco sinistro, subito sotto la mammella', target: 'L', why: 'Giusto: fianco sinistro, subito sotto la mammella, sulla linea ascellare mediana sinistra.' },
    { id: 'mammella', x: 198, y: 190, label: 'Sopra la mammella sinistra', why: 'Non sopra la mammella: l’elettrodo va sul fianco sinistro, subito sotto la mammella.' },
  ],
  seno: [
    ...common,
    { id: 'lato', x: 240, y: 206, label: 'Lateralmente, sul fianco sinistro', target: 'L', why: 'Giusto: con seni abbondanti è ragionevole mettere l’elettrodo sinistro lateralmente, evitando il tessuto mammario.' },
    { id: 'sotto-seno', x: 206, y: 264, label: 'Sotto il seno sinistro', target: 'L', why: 'Giusto: sotto il seno sinistro, evitando il tessuto mammario.' },
    { id: 'mammella', x: 194, y: 204, label: 'Sul seno sinistro', why: 'Evita il tessuto mammario: metti l’elettrodo sinistro lateralmente oppure sotto il seno sinistro.' },
  ],
}

/** Judge a drop at (x, y). `taken` is the target already occupied by the other electrode, if it is placed correctly. */
export function judge(body: Body, x: number, y: number, taken?: Target): Verdict {
  let spot = SPOTS[body][0]
  let d = Infinity
  for (const s of SPOTS[body]) {
    const e = Math.hypot(s.x - x, s.y - y)
    if (e < d) [spot, d] = [s, e]
  }
  if (spot.target && d <= TOL) {
    if (spot.target === taken) return { ok: false, spot, why: 'Qui c’è già l’altro elettrodo: i due elettrodi vanno in due punti diversi, sotto la clavicola destra e sul fianco sinistro.' }
    return { ok: true, target: spot.target, spot, why: spot.why }
  }
  if (d <= NEAR) return { ok: false, spot, why: spot.target ? `Quasi: ${spot.label.toLowerCase()}. La posizione può scostarsi di qualche centimetro, ma deve essere il più possibile corretta.` : spot.why }
  return { ok: false, why: GENERIC }
}
