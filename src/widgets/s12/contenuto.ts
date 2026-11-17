export type KitGroup = { id: string; title: string; items: { id: string; label: string }[] }

const list = (prefix: string, labels: string[]) => labels.map((label, i) => ({ id: `${prefix}${i + 1}`, label }))

/** The kit as the manual groups it (pp. 104–105). Each group id is also its Checklist id. */
export const kit: KitGroup[] = [
  {
    id: 's12-kit-minima',
    title: 'Dotazione minima',
    items: list('m', [
      'Valigetta o contenitore protettivo (a prova d’acqua se usi il kit in ambienti bagnati)',
      'Barriera per rianimazione, come lo schermo per il viso',
      'Guanti medicali monouso',
      'Salviette per la pulizia',
      'Soluzione salina sterile per irrigare le ferite',
      'Bende',
      'Medicazioni sterili di varie misure',
      'Garze sterili (possono far parte della medicazione)',
      'Tamponi oculari sterili',
      'Nastro adesivo (cerotto)',
      'Forbici abbastanza robuste da tagliare i vestiti',
      'Bendaggio triangolare',
      'Spille di sicurezza e pinzette',
      'Medicazioni adesive di varie misure',
    ]),
  },
  {
    id: 's12-kit-facoltativi',
    title: 'Facoltativi ma consigliati',
    items: list('f', [
      'Cerotti per avvicinare i bordi di una ferita (strips di sutura)',
      'Siringa per irrigazione',
      'Rasoio usa e getta',
      'Compresse di garza calde e fredde',
      'Ghiaccio istantaneo',
      'Coperta isotermica',
      'Sacchetto per rifiuti speciali',
      'Stecca per immobilizzare le fratture',
      'Maschera per rianimazione oronasale',
      'Manuale di primo soccorso',
      'Lista con i numeri di telefono d’emergenza',
    ]),
  },
  {
    id: 's12-kit-medicamenti',
    title: 'Medicamenti consigliati',
    items: list('d', ['Soluzione antisettica', 'Pomata a base di cortisone', 'Pomata antibiotica', 'Soluzione fisiologica per il lavaggio oculare', 'Compresse antistaminiche', 'Antidolorifici']),
  },
  {
    id: 's12-kit-extra',
    title: 'Extra per personalizzare',
    items: list('x', ['Tamponi di cotone', 'Aghi', 'Una piccola luce', 'Un termometro']),
  },
]

export const kitTotal = kit.reduce((n, g) => n + g.items.length, 0)
