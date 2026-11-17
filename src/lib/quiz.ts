export type Question = {
  id: string
  prompt: string
  options: { id: string; text: string }[]
  /** Correct option ids. For kind 'order' this is the correct sequence. */
  answer: string[]
  /** single (default): one option. multi: all correct options. order: arrange options. */
  kind?: 'single' | 'multi' | 'order'
  explain: string
  /** Manual page(s), e.g. "41" or "47–49". */
  page?: string
}

export function isCorrect(q: Question, given: string[] | undefined): boolean {
  if (!given || given.length !== q.answer.length) return false
  if (q.kind === 'order') return given.every((id, i) => id === q.answer[i])
  const want = new Set(q.answer)
  return given.every((id) => want.has(id))
}

export function scoreQuiz(questions: Question[], answers: Record<string, string[]>) {
  const score = questions.filter((q) => isCorrect(q, answers[q.id])).length
  return { score, total: questions.length }
}

/** A section counts as passed at 80%, the threshold used across the course. */
export const passed = (score: number, total: number) => total > 0 && score / total >= 0.8
