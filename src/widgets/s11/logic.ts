export type SpinalFacts = { conscious: boolean; supine: boolean; breathing?: boolean }
export type SpinalAction = 'stabilizza' | 'ruota' | 'pls' | 'rcp' | 'seduta'

/** The manual's rule for a suspected spinal injury (p. 102). 'pls' and 'seduta' are never the answer. */
export function spinalAction(f: SpinalFacts): SpinalAction {
  if (f.conscious) return 'stabilizza'
  if (!f.supine) return 'ruota'
  return f.breathing ? 'stabilizza' : 'rcp'
}

export type DrillCase = { id: string; text: string; answer: string; why: string }

/** A drill may ask for a confirmation list after certain answers; the learner moves on only when every item is ticked. */
export function canAdvance(c: DrillCase, picked: string | null, confirmWhen: string | undefined, ticked: number, needed: number) {
  if (picked === null) return false
  return c.answer !== confirmWhen || ticked >= needed
}
