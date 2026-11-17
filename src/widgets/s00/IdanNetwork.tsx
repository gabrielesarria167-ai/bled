// Nodes placed roughly where each area lies on a world map, around the IDAN hub.
const areas = [
  { name: 'America', x: 70, y: 120 },
  { name: 'Europa', x: 250, y: 40, here: true },
  { name: 'Sud Africa', x: 250, y: 222 },
  { name: 'Giappone', x: 450, y: 70 },
  { name: 'Sud-Est asiatico', x: 430, y: 196 },
]

/** The International DAN network: five independent organisations around one hub. */
export function IdanNetwork() {
  return (
    <svg viewBox="0 0 520 260" className="h-auto w-full" role="img" aria-label="La rete International DAN: cinque organizzazioni indipendenti in America, Europa, Giappone, Sud Africa e Sud-Est asiatico.">
      {areas.map((a) => (
        <line key={a.name} x1="260" y1="130" x2={a.x} y2={a.y} stroke="var(--line)" strokeWidth="4" strokeLinecap="round" />
      ))}
      <rect x="214" y="104" width="92" height="52" rx="8" fill="var(--safe)" />
      <text x="260" y="139" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--on-sign)" className="font-display">
        IDAN
      </text>
      {areas.map((a) => (
        <g key={a.name}>
          <circle cx={a.x} cy={a.y} r="13" fill={a.here ? 'var(--safe)' : 'var(--ground)'} stroke="var(--safe)" strokeWidth="5" />
          <text x={a.x} y={a.y < 130 ? a.y - 22 : a.y + 34} textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--ink)" className="font-display">
            {a.name}
            {a.here ? ' (DAN Europe)' : ''}
          </text>
        </g>
      ))}
    </svg>
  )
}
