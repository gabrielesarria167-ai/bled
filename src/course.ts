import type { Glyph } from './components/ui/Pictogram'

export type SectionInfo = {
  n: number
  slug: string
  /** Label shown before the title: "Sezione 5", "Appendice". */
  kind: string
  title: string
  short: string
  pages: string
  glyph: Glyph
  /** One line: what the learner can do after this section. */
  goal: string
}

export const sections: SectionInfo[] = [
  { n: 0, slug: 'introduzione', kind: 'Introduzione', title: 'Il corso DAN BLS-D', short: 'Il corso', pages: '8–11', glyph: 'libro', goal: 'Sai come è fatto il corso, cosa imparerai e cosa serve per il brevetto.' },
  { n: 1, slug: 'anatomia', kind: 'Sezione 1', title: 'Anatomia e fisiologia di base', short: 'A, B, C', pages: '12–15', glyph: 'polmoni', goal: 'Spieghi come vie aeree, respirazione e circolazione portano ossigeno ai tessuti.' },
  { n: 2, slug: 'catena', kind: 'Sezione 2', title: 'La catena della sopravvivenza', short: 'La catena', pages: '16–20', glyph: 'catena', goal: 'Metti in ordine i quattro anelli e sai cosa dire al SME.' },
  { n: 3, slug: 'bls', kind: 'Sezione 3', title: 'Basic Life Support', short: 'BLS', pages: '21–29', glyph: 'croce', goal: 'Sai cos’è il BLS, perché il tempo conta e cosa prevede la legge.' },
  { n: 4, slug: 'sicurezza', kind: 'Sezione 4', title: 'Verifica della sicurezza ambientale', short: 'Sicurezza', pages: '30–35', glyph: 'scudo', goal: 'Valuti la scena con S-A-F-E e ti proteggi dalle infezioni.' },
  { n: 5, slug: 'rcp', kind: 'Sezione 5', title: 'Rianimazione cardio-polmonare', short: 'RCP', pages: '36–52', glyph: 'mani', goal: 'Esegui la sequenza adulto: 30 compressioni, 2 ventilazioni, al ritmo giusto.' },
  { n: 6, slug: 'pls', kind: 'Sezione 6', title: 'Posizione laterale di sicurezza', short: 'PLS', pages: '53–56', glyph: 'laterale', goal: 'Metti in sicurezza chi non è cosciente ma respira.' },
  { n: 7, slug: 'ostruzione', kind: 'Sezione 7', title: 'Ostruzione delle vie aeree da corpo estraneo', short: 'Ostruzione', pages: '57–64', glyph: 'ostruzione', goal: 'Distingui ostruzione lieve e grave e intervieni nel modo corretto.' },
  { n: 8, slug: 'emorragia', kind: 'Sezione 8', title: 'Controllo dell’emorragia esterna', short: 'Emorragia', pages: '65–71', glyph: 'goccia', goal: 'Riconosci il tipo di emorragia e la controlli con la pressione diretta.' },
  { n: 9, slug: 'shock', kind: 'Sezione 9', title: 'Gestione dello shock', short: 'Shock', pages: '72–77', glyph: 'shock', goal: 'Riconosci i segni dello shock e sai cosa fare e cosa evitare.' },
  { n: 10, slug: 'dae', kind: 'Sezione 10', title: 'Defibrillazione automatica esterna e morte cardiaca improvvisa', short: 'DAE', pages: '78–97', glyph: 'dae', goal: 'Usi un DAE in sicurezza seguendo l’algoritmo BLS-D.' },
  { n: 11, slug: 'scenari', kind: 'Appendice 1', title: 'Muovere una persona infortunata', short: 'Spostare', pages: '99–102', glyph: 'barella', goal: 'Sai quando e come spostare un infortunato.' },
  { n: 12, slug: 'piano-kit', kind: 'Appendice 2', title: 'Piano d’emergenza domestico e kit di primo soccorso', short: 'Piano e kit', pages: '103–106', glyph: 'casa', goal: 'Prepari il piano d’emergenza di casa e un kit completo.' },
]

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug)
export const fileKey = (s: SectionInfo) => `${String(s.n).padStart(2, '0')}-${s.slug}`
