export type SignItem = { id: string; text: string; sign: boolean; why: string }

/** The nine signs and symptoms of the manual mixed with their opposites, which are not signs of shock. */
export const signItems: SignItem[] = [
  { id: 'ansia', text: 'Ansia, irrequietezza, confusione', sign: true, why: 'Sono dovute all’ipossia cerebrale: al cervello arriva meno ossigeno.' },
  { id: 'polso-lento', text: 'Polso lento e forte', sign: false, why: 'Nello shock il polso è rapido e debole: è il tentativo di compensare l’ipotensione.' },
  { id: 'respiro', text: 'Respiro rapido e superficiale', sign: true, why: 'È dovuto al ridotto apporto di O2.' },
  { id: 'pelle-calda', text: 'Pelle calda e arrossata', sign: false, why: 'Nello shock la pelle è fredda e il colorito pallido.' },
  { id: 'sete', text: 'Sete', sign: true, why: 'È dovuta all’ipovolemia. Ricorda però: niente liquidi per bocca.' },
  { id: 'pupille-strette', text: 'Pupille ristrette', sign: false, why: 'Nello shock le pupille sono dilatate.' },
  { id: 'polso', text: 'Polso rapido e debole', sign: true, why: 'È il tentativo dell’organismo di compensare l’ipotensione.' },
  { id: 'sudore', text: 'Sudorazione fredda', sign: true, why: 'È tra i segni elencati nel manuale.' },
  { id: 'pressione-alta', text: 'Pressione arteriosa alta', sign: false, why: 'Nello shock c’è sempre una riduzione della pressione arteriosa.' },
  { id: 'pelle', text: 'Pelle fredda e colorito pallido', sign: true, why: 'È tra i segni elencati nel manuale, insieme alla sudorazione fredda.' },
  { id: 'respiro-lento', text: 'Respiro lento e profondo', sign: false, why: 'Nello shock il respiro è rapido e superficiale, per il ridotto apporto di O2.' },
  { id: 'nausea', text: 'Nausea, vomito', sign: true, why: 'È tra i segni elencati nel manuale.' },
  { id: 'pupille', text: 'Pupille dilatate', sign: true, why: 'È tra i segni elencati nel manuale.' },
  { id: 'debolezza', text: 'Debolezza e perdita di coscienza', sign: true, why: 'È tra i segni elencati nel manuale.' },
]

export function checkSigns(items: SignItem[], selected: string[]) {
  const sel = new Set(selected)
  const signs = items.filter((i) => i.sign)
  return {
    total: signs.length,
    found: signs.filter((i) => sel.has(i.id)).length,
    wrong: items.filter((i) => !i.sign && sel.has(i.id)).length,
  }
}
