import type { Question } from '../../lib/quiz'

const vf = [
  { id: 'a', text: 'Vero' },
  { id: 'b', text: 'Falso' },
]

const questions: Question[] = [
  {
    id: 's08-q1',
    prompt: 'La funzione primaria del sangue è fornire ossigeno ai tessuti del corpo e rimuovere l’anidride carbonica.',
    options: vf,
    answer: ['a'],
    explain: 'Il sangue porta O2 e nutrienti ai tessuti e allontana i prodotti di scarto come la CO2.',
    page: '66',
  },
  {
    id: 's08-q2',
    prompt: 'I globuli rossi contengono emoglobina, che trasporta _______; i globuli bianchi proteggono l’organismo contro _______; le piastrine si occupano del processo di _______.',
    options: [
      { id: 'a', text: 'ossigeno / infezioni batteriche e virali / coagulazione' },
      { id: 'b', text: 'CO2 / le emorragie / ossigenazione' },
    ],
    answer: ['a'],
    explain: 'L’emoglobina è il vettore primario dell’O2, i globuli bianchi difendono dalle infezioni e le piastrine formano il coagulo.',
    page: '66',
  },
  {
    id: 's08-q3',
    prompt: 'Nell’emorragia venosa il sangue è di colore rosso _______ e fuoriesce _______ dalla ferita. Nell’emorragia arteriosa il colore è rosso _______ e il sangue _______ dalla ferita.',
    options: [
      { id: 'a', text: 'vivo / con degli zampilli / scuro / scorre con un flusso lento' },
      { id: 'b', text: 'scuro / lento e continuo / vivo / fuoriesce con flusso copioso e pulsante' },
    ],
    answer: ['b'],
    explain: 'Venosa: rosso scuro, flusso lento e costante. Arteriosa: rosso vivo, flusso elevato e pulsante.',
    page: '67',
  },
  {
    id: 's08-q4',
    prompt: 'In caso di sanguinamento grave bisogna esercitare una pressione diretta sulla parte interessata.',
    options: vf,
    answer: ['a'],
    explain: 'La ferita si tampona con una garza e si preme direttamente con la mano.',
    page: '69',
  },
  {
    id: 's08-q5',
    prompt: 'Anche se non è addestrato, il soccorritore deve usare un laccio emostatico quando l’emorragia non si ferma.',
    options: vf,
    answer: ['b'],
    explain: 'Garza emostatica e tourniquet sono indicati solo per il soccorritore addestrato e non fanno parte del manuale.',
    page: '70',
  },
]

export default questions
