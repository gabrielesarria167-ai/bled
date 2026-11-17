import type { Question } from '../../lib/quiz'

const questions: Question[] = [
  {
    id: 's01-q1',
    prompt: 'Per vivere, l’organismo ha bisogno di ricevere ossigeno in modo costante.',
    options: [
      { id: 'a', text: 'Vero' },
      { id: 'b', text: 'Falso' },
    ],
    answer: ['a'],
    explain: 'Senza un apporto continuo di ossigeno i processi metabolici si fermano, e cellule e organi degenerano fino a morire.',
    page: '13',
  },
  {
    id: 's01-q2',
    prompt: 'Perché l’aria possa passare fino ai polmoni, bisogna che ______ siano/sia aperte/a.',
    options: [
      { id: 'a', text: 'Le vie aeree' },
      { id: 'b', text: 'La bocca' },
    ],
    answer: ['a'],
    explain: 'È la pervietà di tutte le vie aeree (naso, bocca, faringe, laringe, trachea) a far arrivare l’aria ai polmoni senza ostacoli.',
    page: '13',
  },
  {
    id: 's01-q3',
    prompt: 'L’epiglottide impedisce a cibo e liquidi di entrare ______.',
    options: [
      { id: 'a', text: 'Nello stomaco' },
      { id: 'b', text: 'Nel cuore' },
      { id: 'c', text: 'Nella trachea' },
      { id: 'd', text: 'Nell’esofago' },
    ],
    answer: ['c'],
    explain: 'Quando deglutisci l’epiglottide si abbassa sopra la laringe proprio per tenere cibo e liquidi fuori dalla trachea.',
    page: '13',
  },
  {
    id: 's01-q4',
    prompt: 'Lo scambio dei gas ha luogo ______.',
    options: [
      { id: 'a', text: 'Nelle arteriole' },
      { id: 'b', text: 'Nell’aorta' },
      { id: 'c', text: 'Negli alveoli' },
      { id: 'd', text: 'Nell’atrio' },
    ],
    answer: ['c'],
    explain: 'O2 e CO2 diffondono attraverso le pareti sottili che separano gli alveoli dai capillari.',
    page: '14',
  },
  {
    id: 's01-q5',
    prompt: '______ pompa in circolo il sangue ossigenato e lo fa giungere a ogni parte del corpo.',
    options: [
      { id: 'a', text: 'Lo stomaco' },
      { id: 'b', text: 'Il cuore' },
      { id: 'c', text: 'I muscoli' },
      { id: 'd', text: 'Il fegato' },
    ],
    answer: ['b'],
    explain: 'È il cuore, con il ventricolo sinistro, a spingere il sangue ricco di O2 in tutto il corpo.',
    page: '14',
  },
]

export default questions
