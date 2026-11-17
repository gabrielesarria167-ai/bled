import { motion } from 'motion/react'

/* Original pictograms in the sign grammar: flat shapes, round heads, limbs as rounded bars. Light panels only. */

const bar = (d: string, w: number, color = 'var(--must)') => <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />
const Victim = () => (
  <g fill="var(--ink-soft)">
    <circle cx="30" cy="118" r="11" />
    {bar('M46 122H128', 20, 'var(--ink-soft)')}
    {bar('M128 125H214', 14, 'var(--ink-soft)')}
  </g>
)
const Floor = () => bar('M6 136H234', 3, 'var(--line)')

export type Pose = 'scena' | 'scuoti' | 'gas' | 'comprimi' | 'ventila'

/** A rescuer and a supine victim, side view. `comprimi` and `scuoti` move. */
export function Rescue({ pose, label }: { pose: Pose; label: string }) {
  return (
    <svg viewBox="0 0 240 150" className="w-full" role="img" aria-label={label}>
      <Floor />
      <Victim />
      {pose === 'scena' && (
        <g>
          {bar('M196 132 198 100M208 132 204 100', 10)}
          {bar('M201 100V66', 16)}
          {bar('M201 70 186 92M201 70 216 92', 7)}
          <circle cx="201" cy="48" r="10" fill="var(--must)" />
          <path d="M176 40a30 30 0 0 0 0 26M168 34a40 40 0 0 0 0 38" fill="none" stroke="var(--safe)" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {pose === 'scuoti' && (
        <g>
          {bar('M70 130 106 132', 12)}
          {bar('M70 130 76 94', 14)}
          {bar('M76 94 64 60', 17)}
          <circle cx="60" cy="42" r="10" fill="var(--must)" />
          <motion.g animate={{ x: [0, -2, 2, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.6 }}>
            {bar('M64 62 44 110', 8)}
          </motion.g>
          <text x="80" y="36" fontSize="13" fontWeight="700" fill="var(--ink)">«Stai bene?»</text>
        </g>
      )}
      {(pose === 'gas' || pose === 'ventila') && (
        <g>
          {bar('M66 130 102 132', 12)}
          {bar('M66 130 72 98', 14)}
          {bar('M72 98 50 84', 17)}
          <circle cx={pose === 'gas' ? 40 : 33} cy={pose === 'gas' ? 92 : 96} r="9" fill="var(--must)" />
          {bar('M50 86 22 110', 7)}
          {bar('M52 90 42 106', 7)}
          {pose === 'gas' ? (
            <path d="M46 96 92 110" stroke="var(--safe)" strokeWidth="2.5" strokeDasharray="3 5" strokeLinecap="round" />
          ) : (
            <path d="M74 104q8 2 14-2" stroke="var(--safe)" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </g>
      )}
      {pose === 'comprimi' && (
        <g>
          {bar('M98 130 134 132', 12)}
          {bar('M98 130 104 94', 14)}
          <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 0.545, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}>
            {bar('M104 94 84 58', 17)}
            <circle cx="79" cy="40" r="10" fill="var(--must)" />
            {bar('M84 60 80 106', 8)}
          </motion.g>
        </g>
      )}
    </svg>
  )
}

/** Resuscitation mask seen from above the face, building up step by step (1–8). */
export function MaskFace({ step }: { step: number }) {
  const mask = 'M110 80C122 80 152 150 150 164 148 176 72 176 70 164 68 150 98 80 110 80Z'
  return (
    <svg viewBox="0 0 220 230" className="w-full max-w-xs" role="img" aria-label={maskLabels[step - 1]}>
      {step === 1 ? (
        <g>
          <path d={mask} fill="var(--ink-soft)" opacity="0.3" />
          <circle cx="110" cy="132" r="12" fill="var(--ink-soft)" />
          {bar('M110 116V84', 4, 'var(--safe)')}
          <path d="M100 94 110 82 120 94" fill="none" stroke="var(--safe)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="110" cy="122" rx="58" ry="74" fill="var(--line)" />
          <rect x="101" y="96" width="18" height="32" rx="9" fill="var(--ink-soft)" opacity="0.55" />
          <rect x="92" y="148" width="36" height="8" rx="4" fill="var(--ink-soft)" opacity="0.55" />
          <circle cx="24" cy="122" r="15" fill="var(--must)" />
          <text x="24" y="150" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">tu</text>
          {step === 3 && <circle cx="110" cy="88" r="8" fill="none" stroke="var(--safe)" strokeWidth="3" />}
          {step >= 3 && (
            <>
              <path d={mask} fill="var(--ink-soft)" opacity="0.3" />
              <circle cx="110" cy="132" r="11" fill="var(--ink-soft)" />
            </>
          )}
          {step >= 4 && <path d="M72 150 52 138M148 150 168 138" stroke="var(--ink-soft)" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />}
          {step >= 5 && (
            <>
              {bar('M104 88 86 132', 7)}
              {bar('M116 88 134 132', 7)}
              {bar('M84 172H136', 7)}
            </>
          )}
          {step >= 6 && (
            <>
              {bar('M80 194 94 200', 7)}
              {bar('M103 202H117', 7)}
              {bar('M126 200 140 194', 7)}
            </>
          )}
          {step >= 7 && <path d="M58 118h10M152 118h10M110 214v-10M62 176l8-6M158 176l-8-6" stroke="var(--safe)" strokeWidth="4" strokeLinecap="round" />}
          {step >= 8 && <path d="M98 112q12-10 24 0M92 104q18-16 36 0" fill="none" stroke="var(--safe)" strokeWidth="3" strokeLinecap="round" />}
        </g>
      )}
    </svg>
  )
}

const maskLabels = [
  'La maschera estratta dall’involucro, con la valvola spinta verso l’esterno',
  'Il soccorritore si mette accanto alla testa della vittima',
  'La maschera appoggiata sul viso, con la radice del naso come riferimento',
  'L’elastico tiene ferma la maschera',
  'Pollice e indice di una mano lungo il bordo della maschera, il pollice dell’altra lungo il margine inferiore',
  'Le altre dita lungo il margine osseo della mandibola, che si solleva',
  'Pressione decisa su tutto il margine esterno della maschera',
  'Ventilazione lenta attraverso la valvola',
]

const regular = (() => {
  let d = 'M0 50'
  for (let x = 0; x < 600; x += 100) d += ` H${x + 20} q6 -6 12 0 H${x + 40} l4 6 6 -44 6 54 4 -16 H${x + 70} q10 -12 20 0 H${x + 100}`
  return d
})()
const fibrillation = (() => {
  let d = 'M0 50'
  for (let x = 2; x <= 600; x += 2) d += ` L${x} ${(50 + 14 * Math.sin(x / 7) + 9 * Math.sin(x / 3.1 + 1) + 6 * Math.sin(x / 17)).toFixed(1)}`
  return d
})()

/** Two traces: organised rhythm vs ventricular fibrillation. */
export function Ecg() {
  return (
    <svg viewBox="0 0 600 230" className="w-full" role="img" aria-label="Due tracciati: in alto un ritmo regolare con battiti uguali e ordinati, in basso la fibrillazione ventricolare, un’onda caotica e irregolare">
      <text x="0" y="16" fontSize="15" fontWeight="700" fill="var(--ink)">Ritmo regolare: il cuore pompa</text>
      <path d={regular} transform="translate(0 20)" fill="none" stroke="var(--safe)" strokeWidth="3" strokeLinejoin="round" />
      <text x="0" y="136" fontSize="15" fontWeight="700" fill="var(--ink)">Fibrillazione ventricolare (FV): ritmo caotico, il cuore non pompa</text>
      <path d={fibrillation} transform="translate(0 140)" fill="none" stroke="var(--danger)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}
