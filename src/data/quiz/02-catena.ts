import type { Question } from '../../lib/quiz'

const questions: Question[] = [
  {
    id: 's02-q1',
    kind: 'order',
    prompt: 'Quali sono, messi nell’ordine giusto, i 4 anelli della catena della sopravvivenza?',
    options: [
      { id: 'a', text: 'RCP precoce' },
      { id: 'b', text: 'Riconoscimento, accesso precoce e chiamata d’aiuto al SME (118/112)' },
      { id: 'c', text: 'Supporto vitale avanzato precoce e trattamento post-rianimatorio standardizzato (Advanced Life Support precoce)' },
      { id: 'd', text: 'Defibrillazione precoce' },
    ],
    answer: ['b', 'a', 'd', 'c'],
    explain: 'La catena parte da riconoscimento e chiamata (primo anello), prosegue con la RCP precoce (secondo) e la defibrillazione precoce (terzo) e si chiude con il supporto vitale avanzato (quarto).',
    page: '18–19',
  },
  {
    id: 's02-q2',
    prompt: 'Nella RCP precoce ______ sostituiscono per un certo tempo la funzione del cuore, mentre ______ portano ossigeno ai polmoni.',
    options: [
      { id: 'a', text: 'i DAE – le compressioni' },
      { id: 'b', text: 'le insufflazioni – una spinta addominale' },
      { id: 'c', text: 'le compressioni toraciche – le ventilazioni' },
    ],
    answer: ['c'],
    explain: 'Le compressioni toraciche fanno per un po’ le veci del cuore; la ventilazione assistita porta O2 ai polmoni e permette lo scambio dei gas negli alveoli.',
    page: '18',
  },
]

export default questions
