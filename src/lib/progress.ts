import { useSyncExternalStore } from 'react'
import { passed } from './quiz'

const KEY = 'blsd-corso:v1'

export type Progress = {
  /** slug -> ids of subsections scrolled through */
  seen: Record<string, string[]>
  /** slug -> number of subsections on that page (recorded when the page mounts) */
  subs: Record<string, number>
  /** quiz id (section slug, or "esame") -> best result */
  quiz: Record<string, { score: number; total: number }>
  /** quiz id -> number of questions, recorded when a quiz mounts, so a section with a quiz needs a pass */
  quizTotal: Record<string, number>
  /** free-form persisted values for drills and checklists, keyed by widget id */
  store: Record<string, unknown>
  last?: { slug: string; sub?: string }
}

const empty: Progress = { seen: {}, subs: {}, quiz: {}, quizTotal: {}, store: {} }

function load(): Progress {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return empty
  }
}

let state = load()
const listeners = new Set<() => void>()

function commit(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage unavailable: progress lives for this visit only
  }
  listeners.forEach((l) => l())
}

export const progress = {
  get: () => state,
  setSubs(slug: string, count: number) {
    if (state.subs[slug] !== count) commit({ ...state, subs: { ...state.subs, [slug]: count } })
  },
  markSeen(slug: string, sub: string) {
    const had = state.seen[slug] ?? []
    const seen = had.includes(sub) ? state.seen : { ...state.seen, [slug]: [...had, sub] }
    if (seen !== state.seen || state.last?.slug !== slug || state.last?.sub !== sub) commit({ ...state, seen, last: { slug, sub } })
  },
  declareQuiz(id: string, total: number) {
    if (state.quizTotal[id] !== total) commit({ ...state, quizTotal: { ...state.quizTotal, [id]: total } })
  },
  saveQuiz(id: string, score: number, total: number) {
    const best = state.quiz[id]
    if (!best || score >= best.score) commit({ ...state, quiz: { ...state.quiz, [id]: { score, total } } })
  },
  set(key: string, value: unknown) {
    commit({ ...state, store: { ...state.store, [key]: value } })
  },
  reset() {
    commit(empty)
  },
}

export function useProgress() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
  )
}

/** Persisted value for a widget (drill best score, ticked checklist items, form fields). */
export function useStored<T>(key: string, initial: T): [T, (v: T) => void] {
  const p = useProgress()
  return [(p.store[key] as T) ?? initial, (v) => progress.set(key, v)]
}

export type SectionState = 'nuova' | 'in-corso' | 'completata'

export function sectionState(p: Progress, slug: string): SectionState {
  const quiz = p.quiz[slug]
  const seen = p.seen[slug]?.length ?? 0
  const subs = p.subs[slug] ?? 0
  const done = slug in p.quizTotal ? !!quiz && passed(quiz.score, quiz.total) : subs > 0 && seen >= subs
  if (done) return 'completata'
  return seen > 0 || quiz ? 'in-corso' : 'nuova'
}
