import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { SceneId } from './scenario'

/** Side view, victim's head on the left. Sign-pictogram grammar: round heads, limbs as rounded bars, no outlines. */
type Pose = 'stand' | 'kneel-shoulder' | 'kneel-chest' | 'kneel-head' | 'gas' | 'compress' | 'ventila' | 'upright'
type Look = {
  alt: string
  victim: 'fianco' | 'supina' | 'pls' | 'segni'
  pose: Pose
  gloves?: boolean
  road?: boolean
  kit?: boolean
  phone?: boolean
  dae?: 'box' | 'pads'
  bystander?: 'run' | 'stand' | 'carry'
  bolt?: boolean
  ambulance?: boolean
}

const looks: Record<SceneId, Look> = {
  arrivo: { alt: 'Una persona a terra sul marciapiede, accanto alla strada; il soccorritore in piedi si ferma e osserva la scena.', victim: 'fianco', pose: 'stand', road: true },
  kit: { alt: 'Il soccorritore, con il kit di primo soccorso ai piedi, indossa i guanti monouso.', victim: 'fianco', pose: 'stand', gloves: true, kit: true },
  coscienza: { alt: 'In ginocchio, il soccorritore scuote le spalle della persona a terra.', victim: 'fianco', pose: 'kneel-shoulder', gloves: true },
  'vie-aeree': { alt: 'Persona supina: una mano sulla fronte reclina la testa, le dita sotto il mento lo sollevano.', victim: 'supina', pose: 'kneel-head', gloves: true },
  gas: { alt: 'Il soccorritore avvicina la guancia alla bocca della persona e guarda il torace.', victim: 'supina', pose: 'gas', gloves: true },
  telefono: { alt: 'Il telefono in vivavoce a terra accanto al soccorritore; il passante corre a prendere il DAE.', victim: 'supina', pose: 'kneel-chest', gloves: true, phone: true, bystander: 'run' },
  compressioni: { alt: 'Compressioni toraciche: braccia tese, spalle sopra le mani, al centro del torace.', victim: 'supina', pose: 'compress', gloves: true, phone: true },
  ventilazioni: { alt: 'Il soccorritore soffia nella maschera tascabile appoggiata sul viso della persona.', victim: 'supina', pose: 'ventila', gloves: true, phone: true },
  'dae-arriva': { alt: 'La RCP continua mentre il passante arriva con il DAE.', victim: 'supina', pose: 'compress', gloves: true, bystander: 'carry' },
  torace: { alt: 'Il DAE acceso accanto alla testa; il soccorritore prepara il torace nudo.', victim: 'supina', pose: 'kneel-chest', gloves: true, dae: 'box' },
  piastre: { alt: 'Due piastre sul torace collegate al DAE: una sotto la clavicola destra, una sul fianco sinistro.', victim: 'supina', pose: 'kneel-chest', gloves: true, dae: 'pads' },
  analisi: { alt: 'Analisi del ritmo: il soccorritore tiene le mani sollevate e nessuno tocca la persona.', victim: 'supina', pose: 'upright', gloves: true, dae: 'pads', bystander: 'stand' },
  shock: { alt: 'Scarica: nessuno tocca la persona mentre il DAE eroga lo shock.', victim: 'supina', pose: 'upright', gloves: true, dae: 'pads', bystander: 'stand', bolt: true },
  'rcp-dae': { alt: 'RCP 30:2 con il DAE acceso e le piastre collegate.', victim: 'supina', pose: 'compress', gloves: true, dae: 'pads' },
  segni: { alt: 'La persona muove un braccio e apre gli occhi; il soccorritore si ferma.', victim: 'segni', pose: 'kneel-shoulder', gloves: true, dae: 'pads' },
  pls: { alt: 'La persona in posizione laterale di sicurezza, il soccorritore in ginocchio accanto.', victim: 'pls', pose: 'kneel-shoulder', gloves: true },
  'pls-telefono': { alt: 'La persona in posizione laterale di sicurezza; il telefono in vivavoce a terra.', victim: 'pls', pose: 'kneel-shoulder', gloves: true, phone: true },
  'pls-dae': { alt: 'La persona in posizione laterale di sicurezza con il DAE ancora collegato.', victim: 'pls', pose: 'kneel-shoulder', gloves: true, dae: 'pads' },
  'sme-pls': { alt: 'Arriva l’ambulanza; la persona è in posizione laterale di sicurezza.', victim: 'pls', pose: 'kneel-shoulder', gloves: true, ambulance: true },
  'sme-pls-dae': { alt: 'Arriva l’ambulanza; la persona è in posizione laterale di sicurezza con il DAE collegato.', victim: 'pls', pose: 'kneel-shoulder', gloves: true, dae: 'pads', ambulance: true },
  'sme-rcp': { alt: 'Arriva l’ambulanza mentre la RCP continua con il DAE collegato.', victim: 'supina', pose: 'compress', gloves: true, dae: 'pads', ambulance: true },
}

type Pt = [number, number]
type Figure = { knee?: Pt; foot?: Pt; legs?: [Pt, Pt][]; hip: Pt; shoulder: Pt; head: Pt; arms: [Pt, Pt][] }

const poses: Record<Pose, Figure> = {
  stand: { legs: [[[542, 190], [530, 256]], [[554, 190], [566, 256]]], hip: [548, 188], shoulder: [548, 122], head: [548, 96], arms: [[[548, 132], [518, 178]], [[548, 132], [578, 178]]] },
  'kneel-shoulder': { knee: [300, 256], foot: [362, 256], hip: [318, 198], shoulder: [276, 136], head: [262, 112], arms: [[[276, 144], [204, 226]], [[280, 150], [226, 228]]] },
  'kneel-chest': { knee: [300, 256], foot: [362, 256], hip: [318, 198], shoulder: [276, 136], head: [262, 112], arms: [[[276, 144], [222, 226]], [[280, 150], [248, 228]]] },
  'kneel-head': { knee: [226, 256], foot: [288, 256], hip: [242, 198], shoulder: [206, 140], head: [196, 116], arms: [[[206, 148], [148, 220]], [[210, 154], [168, 248]]] },
  gas: { knee: [236, 256], foot: [298, 256], hip: [252, 202], shoulder: [208, 176], head: [180, 194], arms: [[[208, 182], [146, 222]], [[212, 186], [168, 248]]] },
  compress: { knee: [296, 256], foot: [358, 256], hip: [312, 198], shoulder: [240, 142], head: [226, 116], arms: [[[240, 150], [236, 222]], [[246, 152], [242, 222]]] },
  ventila: { knee: [230, 256], foot: [292, 256], hip: [246, 200], shoulder: [204, 170], head: [172, 194], arms: [[[204, 176], [140, 222]], [[208, 180], [164, 224]]] },
  upright: { knee: [300, 256], foot: [362, 256], hip: [304, 198], shoulder: [300, 128], head: [300, 102], arms: [[[300, 136], [254, 94]], [[300, 136], [346, 94]]] },
}

const bystanders: Record<'run' | 'stand' | 'carry', Omit<Figure, 'knee' | 'foot'>> = {
  run: { legs: [[[580, 194], [608, 256]], [[580, 194], [552, 248]]], hip: [580, 192], shoulder: [594, 128], head: [598, 104], arms: [[[592, 138], [620, 172]], [[592, 138], [566, 160]]] },
  stand: { legs: [[[556, 192], [548, 256]], [[564, 192], [572, 256]]], hip: [560, 190], shoulder: [560, 124], head: [560, 100], arms: [[[560, 132], [546, 184]], [[560, 132], [574, 184]]] },
  carry: { legs: [[[556, 192], [548, 256]], [[564, 192], [572, 256]]], hip: [560, 190], shoulder: [560, 124], head: [560, 100], arms: [[[560, 132], [540, 176]], [[560, 132], [574, 184]]] },
}

const Bar = ({ a, b, w, c }: { a: Pt; b: Pt; w: number; c: string }) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />

function Person({ f, color, hands }: { f: Omit<Figure, 'knee' | 'foot'> & Partial<Figure>; color: string; hands: string }) {
  return (
    <g>
      {f.knee && f.foot && <Bar a={f.knee} b={f.foot} w={18} c={color} />}
      {f.knee && <Bar a={f.knee} b={f.hip} w={20} c={color} />}
      {f.legs?.map(([a, b], i) => <Bar key={i} a={a} b={b} w={18} c={color} />)}
      <Bar a={f.hip} b={f.shoulder} w={28} c={color} />
      <circle cx={f.head[0]} cy={f.head[1]} r={17} fill={color} />
      {f.arms.map(([a, b], i) => (
        <g key={i}>
          <Bar a={a} b={b} w={12} c={color} />
          <circle cx={b[0]} cy={b[1]} r={7.5} fill={hands} />
        </g>
      ))}
    </g>
  )
}

function Victim({ kind }: { kind: Look['victim'] }) {
  const c = 'var(--well-soft)'
  const head = <circle cx={150} cy={236} r={16} fill={c} />
  if (kind === 'pls')
    return (
      <g>
        {head}
        <Bar a={[182, 242]} b={[316, 242]} w={30} c={c} />
        <Bar a={[198, 232]} b={[164, 252]} w={12} c={c} />
        <Bar a={[320, 250]} b={[466, 252]} w={18} c={c} />
        <Bar a={[318, 238]} b={[372, 212]} w={20} c={c} />
        <Bar a={[372, 212]} b={[392, 252]} w={18} c={c} />
      </g>
    )
  return (
    <g>
      {head}
      <Bar a={[182, 240]} b={[318, 240]} w={30} c={c} />
      {kind === 'fianco' ? (
        <>
          <Bar a={[318, 242]} b={[384, 222]} w={20} c={c} />
          <Bar a={[384, 222]} b={[440, 250]} w={18} c={c} />
        </>
      ) : (
        <Bar a={[322, 244]} b={[466, 248]} w={22} c={c} />
      )}
      {kind === 'segni' && <Bar a={[206, 230]} b={[194, 180]} w={12} c={c} />}
    </g>
  )
}

const daeGlyph = 'M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7ZM27.5 15l-8 11.5h5L22 36l8.5-12h-5Z'

function Dae({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 18} y={y - 6} width={20} height={10} rx={3} fill="var(--safe)" />
      <rect x={x} y={y} width={56} height={42} rx={6} fill="var(--safe)" />
      <path d={daeGlyph} fillRule="evenodd" fill="var(--on-sign)" transform={`translate(${x + 14} ${y + 7}) scale(0.58)`} />
    </g>
  )
}

export function SimScene({ scene }: { scene: SceneId }) {
  const l = looks[scene]
  const hands = l.gloves ? 'var(--lume)' : 'var(--well-ink)'
  const rescuer = <Person f={poses[l.pose]} color="var(--well-ink)" hands={hands} />
  let body: ReactNode = rescuer
  if (l.pose === 'compress')
    body = (
      <motion.g animate={{ y: [0, 7, 0] }} transition={{ duration: 60 / 110, repeat: Infinity, ease: 'easeInOut' }}>
        {rescuer}
      </motion.g>
    )

  return (
    <svg viewBox="0 60 640 260" className="block h-auto w-full" role="img" aria-label={l.alt}>
      <rect x={0} y={262} width={640} height={10} fill="var(--well-2)" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.g key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          {l.road && (
            <g>
              <rect x={0} y={276} width={640} height={44} fill="var(--well-2)" />
              <line x1={0} y1={300} x2={640} y2={300} stroke="var(--well-soft)" strokeOpacity={0.4} strokeWidth={3} strokeDasharray="24 18" />
              <g fill="var(--well-soft)" fillOpacity={0.55}>
                <rect x={60} y={268} width={62} height={20} rx={7} />
                <rect x={40} y={282} width={110} height={22} rx={8} />
              </g>
              <circle cx={66} cy={306} r={9} fill="var(--well)" />
              <circle cx={126} cy={306} r={9} fill="var(--well)" />
            </g>
          )}
          {l.ambulance && (
            <g>
              <rect x={466} y={160} width={164} height={86} rx={12} fill="var(--well-2)" />
              <rect x={520} y={174} width={54} height={54} rx={7} fill="var(--lume)" />
              <path d="M541 182h12v14h14v12h-14v14h-12v-14h-14v-12h14Z" fill="var(--well)" />
              <circle cx={500} cy={250} r={12} fill="var(--well-soft)" />
              <circle cx={600} cy={250} r={12} fill="var(--well-soft)" />
            </g>
          )}
          <Victim kind={l.victim} />
          {l.kit && (
            <g>
              <rect x={466} y={232} width={48} height={28} rx={5} fill="var(--safe)" />
              <path d="M486 236h8v8h8v8h-8v6h-8v-6h-8v-8h8Z" fill="var(--on-sign)" />
            </g>
          )}
          {l.phone && (
            <g fill="none" stroke="var(--lume)" strokeWidth={3} strokeLinecap="round">
              <rect x={378} y={236} width={14} height={24} rx={3} fill="var(--lume)" stroke="none" />
              <path d="M400 240q6 8 0 16M408 234q11 14 0 28" />
            </g>
          )}
          {l.dae && <Dae x={60} y={216} />}
          {l.dae === 'pads' && (
            <g>
              <path d="M116 232C146 204 172 206 196 220M116 244C168 266 236 252 272 228" fill="none" stroke="var(--lume)" strokeWidth={3} />
              <rect x={186} y={217} width={24} height={13} rx={3} fill="var(--lume)" />
              <rect x={262} y={220} width={24} height={13} rx={3} fill="var(--lume)" />
            </g>
          )}
          {l.bolt && <path d="M238 146l-22 36h15l-11 32 30-42h-15l11-26Z" fill="var(--lume)" />}
          {body}
          {l.pose === 'gas' && <path d="M162 206q-6 6 0 12M154 200q-10 12 0 24" fill="none" stroke="var(--lume)" strokeWidth={3} strokeLinecap="round" />}
          {l.pose === 'ventila' && <ellipse cx={152} cy={220} rx={13} ry={6} fill="var(--lume)" />}
          {l.bystander && (
            <g opacity={0.6}>
              <Person f={bystanders[l.bystander]} color="var(--well-ink)" hands="var(--well-ink)" />
            </g>
          )}
          {l.bystander === 'carry' && <Dae x={512} y={176} />}
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}
