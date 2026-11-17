import { useState } from 'react'

const MAX = 10

/**
 * Minutes since a sudden cardiac arrest: each minute takes away about 10% of the chances of survival
 * (manual p. 18), and the 3-5 minute window for defibrillation is marked (p. 19). Only the manual's numbers.
 */
export function SurvivalSlider() {
  const [min, setMin] = useState(0)
  const lost = min * 10
  const inWindow = min >= 3 && min <= 5

  return (
    <figure className="my-8 max-w-[72ch]">
      <div className="mount rounded-plate bg-panel p-4 sm:p-6">
        <label htmlFor="s02-minuti" className="flex flex-wrap items-baseline justify-between gap-x-4 font-display text-[1.35rem] font-bold leading-tight">
          Minuti trascorsi dall’arresto
          <span className="text-[2.4rem] font-extrabold leading-none">{min}</span>
        </label>
        <input
          id="s02-minuti"
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          aria-valuetext={`${min} minuti: possibilità di sopravvivenza ridotte di circa il ${lost}%`}
          className="mt-3 w-full"
        />
        <div className="relative mt-1 h-7 text-[0.8rem] text-ink-soft" aria-hidden>
          <span className="absolute inset-y-0 rounded-chip bg-warn-tint" style={{ left: '30%', width: '20%' }} />
          <span className="absolute left-[40%] top-1 -translate-x-1/2 whitespace-nowrap font-bold text-ink">3-5 min</span>
          <span className="absolute left-0 top-1">0</span>
          <span className="absolute right-0 top-1">10</span>
        </div>

        <div className="mt-5 flex gap-1" aria-hidden>
          {Array.from({ length: MAX }, (_, i) => (
            <span key={i} className={`h-8 flex-1 rounded-[3px] transition-colors duration-200 ${i < MAX - min ? 'bg-safe' : 'bg-panel-2'}`} />
          ))}
        </div>
        <p className="mt-1 text-[0.8rem] text-ink-soft">Ogni barra verde vale circa il 10% delle possibilità che c’erano al momento del collasso.</p>

        <div aria-live="polite" className="mt-4 min-h-[5lh] [&>*+*]:mt-2">
          <p className="font-bold">{min === 0 ? 'Il cuore si è appena fermato: ogni minuto conta.' : `Dopo ${min} ${min === 1 ? 'minuto' : 'minuti'}: possibilità di sopravvivenza ridotte di circa il ${lost}%.`}</p>
          <p className={`rounded-chip p-3 ${inWindow ? 'bg-warn-tint' : 'bg-ground'}`}>
            {inWindow
              ? 'Sei nella finestra dei 3-5 minuti dal collasso: defibrillare adesso può portare la sopravvivenza fino al 50-70%.'
              : min < 3
                ? 'Defibrillare entro 3-5 minuti dal collasso può portare la sopravvivenza fino al 50-70%. Intanto RCP e chiamata non devono aspettare.'
                : 'Oltre i 5 minuti sei fuori dalla finestra in cui il manuale indica di defibrillare (entro 3-5 minuti dal collasso).'}
          </p>
        </div>
      </div>
      <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">Sposta il cursore. Il manuale indica un calo di circa il 10% per ogni minuto: il grafico applica questa stima minuto per minuto.</figcaption>
    </figure>
  )
}
