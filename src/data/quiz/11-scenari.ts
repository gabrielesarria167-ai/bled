import type { Question } from '../../lib/quiz'

// Self-check questions written for the course from pp. 99–102 (not from the manual).
const questions: Question[] = [
  {
    id: 's11-q1',
    prompt: 'Qual è l’indicazione di base per una persona infortunata e cosciente?',
    options: [
      { id: 'A', text: 'Metterla sempre seduta' },
      { id: 'B', text: 'Lasciarla nella posizione in cui è stata trovata' },
      { id: 'C', text: 'Portarla subito in posizione laterale di sicurezza' },
      { id: 'D', text: 'Trascinarla lontano dal luogo dell’incidente in ogni caso' },
    ],
    answer: ['B'],
    explain: 'L’infortunato cosciente va lasciato dove è stato trovato, soprattutto se l’incidente è di origine traumatica e si sospetta una lesione di colonna vertebrale, testa o collo.',
    page: '100',
  },
  {
    id: 's11-q2',
    prompt: 'Quale di questi NON è tra i fattori da valutare prima di spostare una vittima?',
    options: [
      { id: 'A', text: 'Il peso della vittima' },
      { id: 'B', text: 'Il percorso da compiere' },
      { id: 'C', text: 'L’età della vittima' },
      { id: 'D', text: 'Il numero di soccorritori necessari per agire in sicurezza' },
    ],
    answer: ['C'],
    explain: 'I fattori sono il peso della vittima, il percorso, le condizioni e l’esperienza del soccorritore e il numero di soccorritori necessari; l’età non compare.',
    page: '100',
  },
  {
    id: 's11-q3',
    prompt: 'Nella tecnica Rautek, come viene bloccata la testa della vittima?',
    options: [
      { id: 'A', text: 'Tenendola per la fronte con entrambe le mani' },
      { id: 'B', text: 'Afferrandola a livello della mandibola e facendola appoggiare sulla spalla del soccorritore' },
      { id: 'C', text: 'Con una tavola spinale' },
      { id: 'D', text: 'Non viene bloccata' },
    ],
    answer: ['B'],
    explain: 'Il soccorritore prende la testa all’altezza della mandibola e la appoggia sulla propria spalla, e non lascia mai l’immobilizzazione mentre solleva la persona.',
    page: '101',
  },
  {
    id: 's11-q4',
    prompt: 'Nel Log Roll, dove si appoggiano le mani del soccorritore?',
    options: [
      { id: 'A', text: 'Una sostiene testa e collo, l’altra preme dolcemente il gomito più lontano contro il fianco della vittima' },
      { id: 'B', text: 'Entrambe sotto le ascelle' },
      { id: 'C', text: 'Una sulla fronte e una sul mento' },
      { id: 'D', text: 'Entrambe sulle caviglie' },
    ],
    answer: ['A'],
    explain: 'Una mano sorregge testa e collo, l’altra va sul gomito più lontano, spinto con delicatezza contro il fianco, prima di ruotare la vittima verso di sé.',
    page: '101',
  },
  {
    id: 's11-q5',
    prompt: 'Una vittima con sospetta lesione spinale è già supina e respira. Cosa si fa?',
    options: [
      { id: 'A', text: 'La si mette in posizione laterale di sicurezza' },
      { id: 'B', text: 'Si inizia la RCP' },
      { id: 'C', text: 'Le si stabilizza la testa senza metterla in posizione laterale di sicurezza' },
      { id: 'D', text: 'La si fa sedere' },
    ],
    answer: ['C'],
    explain: 'Se respira le si stabilizza la testa, ma non va messa in posizione laterale di sicurezza; la RCP si esegue solo se non respira.',
    page: '102',
  },
]

export default questions
