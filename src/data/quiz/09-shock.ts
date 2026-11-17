import type { Question } from '../../lib/quiz'

const vf = [
  { id: 'a', text: 'Vero' },
  { id: 'b', text: 'Falso' },
]

const questions: Question[] = [
  {
    id: 's09-q1',
    prompt: 'Cos’è lo shock?',
    options: [
      { id: 'a', text: 'Una perdita di liquido sierologico' },
      { id: 'b', text: 'Una riduzione dell’afflusso di sangue e di ossigeno nei principali organi' },
      { id: 'c', text: 'Un improvviso spavento' },
    ],
    answer: ['b'],
    explain: 'Lo shock è uno stato di ipoperfusione d’organo, cioè meno sangue e quindi meno ossigeno agli organi.',
    page: '73',
  },
  {
    id: 's09-q2',
    prompt: 'Lo shock può essere causato da un sanguinamento _______ o da un’eccessiva _______.',
    options: [
      { id: 'a', text: 'massivo / perdita di liquidi' },
      { id: 'b', text: 'debole / debolezza' },
    ],
    answer: ['a'],
    explain: 'Tra i meccanismi ci sono la riduzione del volume circolante dopo un’emorragia e la perdita eccessiva di liquidi.',
    page: '73',
  },
  {
    id: 's09-q3',
    kind: 'multi',
    prompt: 'Scegli i 3 tipi di shock corretti tra i seguenti.',
    options: [
      { id: 'a', text: 'Neurogeno' },
      { id: 'b', text: 'Ipovolemico' },
      { id: 'c', text: 'Emotivo' },
      { id: 'd', text: 'Osseo' },
      { id: 'e', text: 'Cutaneo' },
      { id: 'f', text: 'Anafilattico' },
    ],
    answer: ['a', 'b', 'f'],
    explain: 'I tipi elencati nel manuale sono ipovolemico, cardiogeno, settico, anafilattico e neurogeno.',
    page: '73',
  },
  {
    id: 's09-q4',
    prompt: 'In caso di shock si possono rilevare questi segni e sintomi: ansia, irrequietezza e confusione dovute all’ipossia cerebrale, sete, pupille dilatate.',
    options: vf,
    answer: ['a'],
    explain: 'Sono tutti presenti nell’elenco dei segni e sintomi dello shock.',
    page: '74',
  },
  {
    id: 's09-q5',
    prompt: 'Durante il primo soccorso bisogna controllare l’_______, mettere la vittima in posizione _______ e mantenere normale la _______.',
    options: [
      { id: 'a', text: 'emorragia esterna, se presente / supina / temperatura corporea' },
      { id: 'b', text: 'emozione / prona / pressione' },
    ],
    answer: ['a'],
    explain: 'Si gestisce l’eventuale emorragia esterna, si pone la vittima supina e si mantiene la temperatura corporea nella norma.',
    page: '74–76',
  },
  {
    id: 's09-q6',
    prompt: 'A una persona sotto shock vanno dati liquidi, come l’acqua, per bocca.',
    options: vf,
    answer: ['b'],
    explain: 'Niente liquidi per bocca: la vittima potrebbe inalarli e soffocare, e bere favorisce il vomito.',
    page: '74',
  },
  {
    id: 's09-q7',
    prompt: 'Le persone sotto shock devono essere ospedalizzate per ulteriori trattamenti.',
    options: vf,
    answer: ['a'],
    explain: 'Chi è in stato di shock va sempre ospedalizzato per ulteriori indagini e/o trattamenti.',
    page: '75',
  },
]

export default questions
