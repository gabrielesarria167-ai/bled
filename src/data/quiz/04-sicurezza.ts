import type { Question } from '../../lib/quiz'

const questions: Question[] = [
  {
    id: 's04-q1',
    prompt: 'Quali pericoli si possono trovare sul luogo di un incidente?',
    options: [
      { id: 'a', text: 'Non è un aspetto importante da considerare' },
      { id: 'b', text: 'Fumo, gas, liquidi corporei (alcuni esempi)' },
      { id: 'c', text: 'Nessun pericolo' },
    ],
    answer: ['b'],
    explain: 'Tra i pericoli elencati ci sono fumo, gas e patogeni, oltre al rischio legato a sangue e secrezioni.',
    page: '31',
  },
  {
    id: 's04-q2',
    prompt: 'Proteggere il soccorritore significa anche proteggerlo da ________ o altri ________.',
    options: [
      { id: 'a', text: 'Droplet e sangue – fluidi corporei' },
      { id: 'b', text: 'Estranei – malintenzionati' },
      { id: 'c', text: 'Cause legali – problemi con le autorità' },
    ],
    answer: ['a'],
    explain: 'Il soccorritore deve proteggersi da droplets, aerosol, secrezioni corporee, sangue e vomito.',
    page: '32',
  },
  {
    id: 's04-q3',
    prompt: 'Quali materiali puoi usare per proteggerti dal rischio d’infezione?',
    options: [
      { id: 'a', text: 'Occhiali da sole e sciarpe' },
      { id: 'b', text: 'Guanti di nylon per la manipolazione degli alimenti' },
      { id: 'c', text: 'Guanti monouso, barriere per la ventilazione e mascherina facciale con un grado di protezione sufficiente' },
    ],
    answer: ['c'],
    explain: 'Il testo indica guanti “usa e getta”, barriere per la rianimazione come la maschera oronasale e mascherine FFP2 o FFP3.',
    page: '32',
  },
  {
    id: 's04-q4',
    prompt: 'Dopo aver prestato il primo soccorso, i materiali riutilizzabili devono essere ________ e ________.',
    options: [
      { id: 'a', text: 'Gettati via – riacquistati' },
      { id: 'b', text: 'Puliti – disinfettati' },
      { id: 'c', text: 'Smaltiti – inviati a un centro di raccolta per rifiuti speciali' },
    ],
    answer: ['b'],
    explain: 'I materiali riutilizzabili vanno puliti e disinfettati dopo ogni uso, seguendo le schede tecniche o il manuale d’uso.',
    page: '33',
  },
  {
    id: 's04-q5',
    prompt: 'Dopo aver prestato il primo soccorso, evita il contatto con l’esterno dei ________.',
    options: [
      { id: 'a', text: 'Guanti' },
      { id: 'b', text: 'Pantaloni' },
      { id: 'c', text: 'Contenitori dei rifiuti speciali' },
    ],
    answer: ['a'],
    explain: 'I guanti si sfilano rivoltandoli, così non tocchi la superficie esterna contaminata da sangue o altri fluidi.',
    page: '33',
  },
]

export default questions
