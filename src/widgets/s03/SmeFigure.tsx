const tell = [
  'il tuo nome',
  'dove è avvenuta l’emergenza (il luogo esatto)',
  'che cosa è successo',
  'quante sono le vittime coinvolte',
  'in che condizioni è la vittima',
  'quale primo soccorso è stato prestato',
]

/** "What to tell the SME": a phone on 1-1-2 and the six things the caller reports (quiz p.28, detailed in Section 2). */
export function SmeFigure() {
  return (
    <div className="grid items-center gap-x-8 gap-y-4 p-6 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
      <svg viewBox="0 0 150 200" className="mx-auto w-28 sm:w-full" role="img" aria-label="Uno smartphone che chiama il numero 1-1-2">
        <rect x="30" y="16" width="80" height="168" rx="14" fill="var(--ink)" />
        <rect x="38" y="32" width="64" height="124" rx="5" fill="var(--ground)" />
        <text x="70" y="104" textAnchor="middle" className="font-display" fontSize="34" fontWeight="800" fill="var(--safe)">
          112
        </text>
        <circle cx="70" cy="170" r="6" fill="var(--ground)" />
        <g fill="none" stroke="var(--safe)" strokeWidth="7" strokeLinecap="round">
          <path d="M120 44a22 22 0 0 1 0 30" />
          <path d="M131 32a38 38 0 0 1 0 54" />
        </g>
      </svg>
      <div>
        <p className="font-display text-[1.5rem] font-extrabold leading-tight">Al telefono con il SME riferisci:</p>
        <ul className="mt-3 grid list-[square] gap-x-8 gap-y-1.5 pl-5 marker:text-safe sm:grid-cols-2">
          {tell.map((t) => (
            <li key={t} className="mt-0!">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
