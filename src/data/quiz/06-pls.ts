import type { Question } from '../../lib/quiz'

const vf = [
  { id: 'a', text: 'Vero' },
  { id: 'b', text: 'Falso' },
]

const questions: Question[] = [
  {
    id: 's06-q1',
    prompt: 'Mettere in posizione laterale di sicurezza una persona non cosciente che respira serve a tenere aperte le vie aeree e a impedire che sangue e vomito le ostruiscano.',
    options: vf,
    answer: ['a'],
    explain: 'La PLS mantiene pervie le vie aeree e lascia defluire per gravità vomito e sangue, che così non vengono inalati.',
    page: '54',
  },
  {
    id: 's06-q2',
    prompt: 'Chi ha lesioni alla schiena o al collo non va messo in posizione laterale di sicurezza.',
    options: vf,
    answer: ['a'],
    explain: 'Con traumi a schiena e/o collo il movimento potrebbe provocare altri danni.',
    page: '54',
  },
  {
    id: 's06-q3',
    prompt: 'Una persona con una lesione aperta al torace va girata sul lato _______.',
    options: [
      { id: 'a', text: 'Opposto alla ferita' },
      { id: 'b', text: 'Della ferita, per facilitare la fuoriuscita del sangue' },
      { id: 'c', text: 'Che è più comodo' },
    ],
    answer: ['b'],
    explain: 'Con lesioni al torace e/o al polmone si gira la persona sul lato leso, così il sangue nella cavità toracica può defluire.',
    page: '54',
  },
  {
    id: 's06-q4',
    prompt: 'Una persona con una lesione a un polmone va girata sul lato del polmone sano per respirare meglio.',
    options: vf,
    answer: ['b'],
    explain: 'Va girata sul lato leso, non su quello sano: è così che si facilitano pervietà delle vie aeree e respirazione.',
    page: '54',
  },
]

export default questions
