/** The six things to tell the SME (manual p. 18). */
export const infos = [
  { id: 'nome', label: 'Il tuo nome' },
  { id: 'luogo', label: 'Il luogo esatto dell’emergenza' },
  { id: 'dinamica', label: 'La dinamica: che cosa è accaduto' },
  { id: 'numero', label: 'Il numero delle persone coinvolte' },
  { id: 'condizioni', label: 'Le condizioni delle persone coinvolte' },
  { id: 'soccorso', label: 'Il tipo di soccorso prestato' },
] as const
export type InfoId = (typeof infos)[number]['id']

export type Line = { id: string; text: string; covers?: InfoId; vague?: InfoId; why?: string }

/** Sentences the caller can say, in a scrambled order. Vague ones look useful but do not give the operator what is needed. */
export const lines: Line[] = [
  { id: 'l1', text: 'Un uomo è crollato a terra all’improvviso mentre era al bancone.', covers: 'dinamica' },
  { id: 'l2', text: 'Sono in centro, vicino a un bar.', vague: 'luogo', why: 'Non è un luogo esatto: con questa frase i soccorsi non sanno dove andare.' },
  { id: 'l3', text: 'Mi chiamo Luca Bianchi.', covers: 'nome' },
  { id: 'l4', text: 'Sta male.', vague: 'condizioni', why: 'Troppo generico: l’operatore deve sapere in che condizioni è la persona.' },
  { id: 'l5', text: 'Ho iniziato le compressioni toraciche, il telefono è in vivavoce.', covers: 'soccorso' },
  { id: 'l6', text: 'Sono al bar Centrale, via Roma 12, di fronte alla stazione.', covers: 'luogo' },
  { id: 'l7', text: 'È successa una cosa, venite subito.', vague: 'dinamica', why: 'Non racconta che cosa è accaduto.' },
  { id: 'l8', text: 'Non risponde e respira in modo lento e faticoso.', covers: 'condizioni' },
  { id: 'l9', text: 'La persona coinvolta è una sola.', covers: 'numero' },
]

/** What the call covered, what is missing and which sentences were too vague to count. */
export function callFeedback(said: string[]) {
  const used = lines.filter((l) => said.includes(l.id))
  const covered = new Set(used.flatMap((l) => (l.covers ? [l.covers] : [])))
  return {
    covered,
    missing: infos.filter((i) => !covered.has(i.id)),
    vague: used.filter((l) => l.vague),
    complete: covered.size === infos.length && used.every((l) => !l.vague),
  }
}
