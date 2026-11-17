import { describe, expect, test } from 'vitest'
import { choices, reduce, regia, start, VOICE, type Action, type Scenario, type SimState } from './aedMachine'

const plain: Scenario = { mode: 'semi', body: 'uomo', villoso: false, bagnato: false, cerotto: false, ossigeno: false }
const run = (s: SimState, ...acts: (Action | string)[]) => acts.reduce((st, a) => reduce(st, typeof a === 'string' ? { type: 'choose', id: a } : a), s)

/** From the scene to the first analysis, all correct. */
const toAnalysis = (sc: Scenario) => run(start(sc), 'sicurezza', 'aiuto', 'rcp', { type: 'daeArrivato' }, 'accendi', 'indumenti', 'asciuga', 'applica', { type: 'padsPlaced' }, 'connetti')

describe('percorso defibrillabile (semiautomatico)', () => {
  test('arriva allo shock, poi 2 minuti di RCP e nuova analisi, senza errori', () => {
    let s = toAnalysis(plain)
    expect(s.phase).toBe('analisi')
    expect(s.say).toEqual([VOICE.analisi])
    s = run(s, 'via', { type: 'analisiFinita', shockable: true })
    expect(s.phase).toBe('shock_consigliato')
    s = run(s, 'dichiara')
    expect(s.phase).toBe('scarica')
    expect(s.say).toEqual([VOICE.premi])
    s = run(s, 'shock')
    expect(s).toMatchObject({ phase: 'rcp', shocks: 1, cpr: false })
    s = run(s, 'rcp', { type: 'rcpFinita' })
    expect(s).toMatchObject({ phase: 'analisi', cprPeriods: 1, analyses: 1, cpr: true })
    expect(s.errors).toEqual([])
    expect(s.log).toContain(VOICE.erogata)
  })

  test('il DAE automatico eroga da solo; il pulsante di scarica non esiste', () => {
    let s = run(toAnalysis({ ...plain, mode: 'auto' }), 'via', { type: 'analisiFinita', shockable: true }, 'dichiara')
    expect(s.say).toEqual([VOICE.auto])
    expect(choices(s).map((c) => c.id)).not.toContain('shock')
    s = run(s, 'lontano', { type: 'scaricaAuto' })
    expect(s).toMatchObject({ phase: 'rcp', shocks: 1 })
    expect(s.errors).toEqual([])
  })

  test('scaricaAuto è ignorato con il DAE semiautomatico', () => {
    const s = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: true }, 'dichiara')
    expect(reduce(s, { type: 'scaricaAuto' })).toBe(s)
  })
})

describe('percorso non defibrillabile', () => {
  test('nessuna scarica, RCP subito, poi arrivo ALS e rapporto', () => {
    let s = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: false })
    expect(s.phase).toBe('shock_non_consigliato')
    expect(s.say).toEqual([VOICE.noShock])
    s = run(s, 'rcp')
    expect(s).toMatchObject({ phase: 'rcp', cpr: true, shocks: 0 })
    expect(regia(s)).toEqual(['respira', 'als', 'esausto'])
    s = run(s, { type: 'regia', event: 'als' }, 'consegna', 'fine')
    expect(s.phase).toBe('fine')
    expect(s.errors).toEqual([])
  })

  test('staccare le piastre dopo "nessuna scarica" è un errore', () => {
    const s = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: false }, 'stacca')
    expect(s.phase).toBe('shock_non_consigliato')
    expect(s.errors).toHaveLength(1)
  })
})

describe('errori di sicurezza', () => {
  test('comprimere durante l’analisi la interrompe e conta come errore di sicurezza', () => {
    let s = run(toAnalysis(plain), 'continua')
    expect(s).toMatchObject({ phase: 'analisi', interrupted: true, clear: false })
    expect(s.say).toEqual([VOICE.interrotta])
    expect(s.errors[0].safety).toBe(true)
    // The analysis cannot finish while someone is touching the victim.
    expect(reduce(s, { type: 'analisiFinita', shockable: true })).toBe(s)
    s = run(s, 'via')
    expect(s).toMatchObject({ clear: true, interrupted: false })
    expect(s.say).toEqual([VOICE.analisi])
  })

  test('toccare la vittima mentre il DAE analizza interrompe l’analisi', () => {
    const s = run(toAnalysis(plain), 'via', 'tocca')
    expect(s).toMatchObject({ clear: false, interrupted: true })
    expect(s.errors.map((e) => e.safety)).toEqual([true])
  })

  test('toccare la vittima durante la scarica annulla lo shock e torna al controllo', () => {
    const semi = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: true }, 'dichiara', 'tieni')
    expect(semi).toMatchObject({ phase: 'shock_consigliato', shocks: 0 })
    expect(semi.errors[0].safety).toBe(true)
    const auto = run(toAnalysis({ ...plain, mode: 'auto' }), 'via', { type: 'analisiFinita', shockable: true }, 'dichiara', 'tocca')
    expect(auto).toMatchObject({ phase: 'shock_consigliato', shocks: 0 })
    expect(reduce(auto, { type: 'scaricaAuto' })).toBe(auto)
  })

  test('erogare senza controllare è un errore di sicurezza', () => {
    const s = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: true }, 'subito')
    expect(s.phase).toBe('shock_consigliato')
    expect(s.errors[0].safety).toBe(true)
  })
})

describe('preparazione e chiusura', () => {
  test('il torace va preparato secondo la scena prima degli elettrodi', () => {
    const sc = { ...plain, villoso: true, cerotto: true, ossigeno: true }
    let s = run(start(sc), 'sicurezza', 'aiuto', 'rcp', { type: 'daeArrivato' }, 'accendi')
    s = run(s, 'rasa')
    expect(s.errors.at(-1)?.text).toMatch(/Prima scopri il torace/)
    s = run(s, 'indumenti', 'asciuga', 'applica')
    expect(s.phase).toBe('torace')
    s = run(s, 'rasa', 'cerotto', 'ossigeno', 'applica')
    expect(s.phase).toBe('elettrodi')
    expect(s.errors).toHaveLength(2)
  })

  test('un passo non necessario è solo una nota, non un errore', () => {
    const s = run(start(plain), 'sicurezza', 'aiuto', 'rcp', { type: 'daeArrivato' }, 'accendi', 'indumenti', 'rasa')
    expect(s.note?.tone).toBe('info')
    expect(s.errors).toEqual([])
  })

  test('continuare per qualche istante le compressioni dopo il ripristino non è un errore', () => {
    let s = run(toAnalysis(plain), 'via', { type: 'analisiFinita', shockable: true }, 'dichiara', 'shock', 'rcp', { type: 'regia', event: 'respira' })
    expect(s.phase).toBe('respiro')
    s = run(s, 'continua')
    expect(s.errors).toEqual([])
    s = run(s, 'pls', { type: 'regia', event: 'indicazioni' })
    expect(s).toMatchObject({ phase: 'analisi', clear: false })
  })

  test('esaurimento chiude il percorso; gli eventi di regia valgono solo durante la RCP', () => {
    const early = toAnalysis(plain)
    expect(reduce(early, { type: 'regia', event: 'esausto' })).toBe(early)
    const s = run(early, 'via', { type: 'analisiFinita', shockable: false }, 'rcp', { type: 'regia', event: 'esausto' })
    expect(s.phase).toBe('esausto')
    expect(choices(s)).toEqual([])
  })
})
