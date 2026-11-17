import type { Question } from '../../lib/quiz'

const questions: Question[] = [
  {
    id: 's05-q1',
    prompt: 'Secondo le linee guida ERC 2021, qual è il rapporto attuale fra compressioni e ventilazioni?',
    options: [
      { id: 'a', text: '30:2' },
      { id: 'b', text: '15:2' },
      { id: 'c', text: '5:1' },
      { id: 'd', text: '50:2' },
    ],
    answer: ['a'],
    explain: 'Il rapporto 30:2 è indicato come il miglior compromesso fra flusso di sangue e apporto di O2.',
    page: '38',
  },
  {
    id: 's05-q2',
    prompt: 'In che modo si evita che l’aria finisca nello stomaco causando distensione gastrica?',
    options: [
      { id: 'a', text: 'Soffiando molto in fretta' },
      { id: 'b', text: 'Con insufflazioni lunghe 5 secondi' },
      { id: 'c', text: 'Soffiando con delicatezza e per non più di 1 secondo a ogni ventilazione' },
    ],
    answer: ['c'],
    explain: 'Servono ventilazioni di circa 1 secondo, evitando quelle troppo veloci, troppo energiche o troppo lunghe.',
    page: '45',
  },
  {
    id: 's05-q3',
    prompt: 'Che cosa bisogna fare se la vittima rigurgita?',
    options: [
      { id: 'a', text: 'Evitare di toccarle la bocca per non rischiare contagi' },
      { id: 'b', text: 'Voltarla sul fianco perché il materiale esca e ripulire la bocca dai residui' },
      { id: 'c', text: 'Continuare con insufflazioni più energiche' },
    ],
    answer: ['b'],
    explain: 'In caso di rigurgito la vittima va messa sul fianco e le vie aeree vanno liberate.',
    page: '44',
  },
  {
    id: 's05-q4',
    prompt: 'Completa: il soccorritore ________ la persona infortunata dimostrandole attenzione, le spiega che cosa sta succedendo e che si sta occupando di lei, e tiene gli astanti ________.',
    options: [
      { id: 'a', text: 'Rassicura, a debita distanza' },
      { id: 'b', text: 'Rimprovera, vicini a sé' },
      { id: 'c', text: 'Chiede dell’acqua per, intorno a sé, per mostrare quanto è importante il suo intervento' },
    ],
    answer: ['a'],
    explain: 'La vittima cosciente va rassicurata con un atteggiamento premuroso, e gli astanti vanno tenuti lontani per non aggiungerle stress.',
    page: '39',
  },
  {
    id: 's05-q5',
    prompt: 'Completa: le compressioni toraciche si eseguono a un ritmo di ____ al minuto, senza superare le ____ al minuto, cioè ____ compressioni in circa ____ secondi.',
    options: [
      { id: 'a', text: '100, 120, 30, 15-18' },
      { id: 'b', text: '120, 140, 30, 12-15' },
      { id: 'c', text: '100, 120, 30, 12-15' },
      { id: 'd', text: '100, 140, 15, 15-18' },
    ],
    answer: ['a'],
    explain: 'Almeno 100 e non oltre 120 compressioni al minuto: quindi 30 compressioni in 18 secondi (a 100) o 15 secondi (a 120).',
    page: '41',
  },
  {
    id: 's05-q6',
    prompt: 'Completa: ogni ventilazione deve durare circa ________.',
    options: [
      { id: 'a', text: '1 secondo' },
      { id: 'b', text: '5 secondi' },
      { id: 'c', text: '2 secondi' },
    ],
    answer: ['a'],
    explain: 'La singola ventilazione dura circa 1 secondo; 5 secondi è il tempo massimo per tutte e due.',
    page: '42',
  },
  {
    id: 's05-q7',
    prompt: 'Completa: l’uso di un DAE è ________ e può ________ il tasso di sopravvivenza.',
    options: [
      { id: 'a', text: 'Proibito, diminuire' },
      { id: 'b', text: 'Raccomandato, aumentare' },
      { id: 'c', text: 'Sconsigliato, ridurre' },
    ],
    answer: ['b'],
    explain: 'Solo la defibrillazione precoce ripristina il ritmo cardiaco e, se avviene nei primissimi minuti, la sopravvivenza è molto alta.',
    page: '46',
  },
]

export default questions
