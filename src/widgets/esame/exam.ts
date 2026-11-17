import { sections, type SectionInfo } from '../../course'
import { isCorrect, passed, type Question } from '../../lib/quiz'

/** Every question from the section files, minus the appendices (s11-, s12-), which are not from the manual's sections. */
export function examPool(lists: Question[][]): Question[] {
  return lists.flat().filter((q) => !/^s1[12]-/.test(q.id))
}

/** mulberry32: small seeded generator, so a draw can be reproduced from its seed. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items]
  const r = rng(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Draws `count` questions, taking one per section in turn so every section is represented before any repeats. */
export function drawExam(pool: Question[], count: number, seed: number): Question[] {
  const want = Math.min(count, pool.length)
  const groups = new Map<string, Question[]>()
  for (const q of shuffle(pool, seed)) {
    const key = sectionOf(q.id)?.slug ?? ''
    groups.set(key, [...(groups.get(key) ?? []), q])
  }
  const picked: Question[] = []
  for (let round = 0; picked.length < want; round++) {
    for (const g of groups.values()) if (g[round] && picked.length < want) picked.push(g[round])
  }
  return shuffle(picked, seed + 1)
}

export function sectionOf(id: string): SectionInfo | undefined {
  const m = /^s(\d{2})-/.exec(id)
  return m ? sections.find((s) => s.n === Number(m[1])) : undefined
}

export type SectionScore = { section: SectionInfo; score: number; total: number }

/** Score per section, in course order. */
export function breakdown(questions: Question[], answers: Record<string, string[]>): SectionScore[] {
  const rows = new Map<SectionInfo, SectionScore>()
  for (const q of questions) {
    const section = sectionOf(q.id)
    if (!section) continue
    const row = rows.get(section) ?? { section, score: 0, total: 0 }
    row.total++
    if (isCorrect(q, answers[q.id])) row.score++
    rows.set(section, row)
  }
  return [...rows.values()].sort((a, b) => a.section.n - b.section.n)
}

/** Sections under the 80% mark, weakest first. */
export function weakest(rows: SectionScore[]): SectionScore[] {
  return rows.filter((r) => !passed(r.score, r.total)).sort((a, b) => a.score / a.total - b.score / b.total || a.section.n - b.section.n)
}
