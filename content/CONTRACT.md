# Builder contract: Corso BLS-D

You are building pages of an interactive Italian course from a first-aid manual. The app (Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router + React Three Fiber/drei + GSAP + Motion) is already scaffolded, with a design system and a component kit. Read this whole file, then the files it points to, before writing.

## 1. What is fixed (do not edit)

`src/index.css`, `src/App.tsx`, `src/main.tsx`, `src/course.ts`, `src/lib/*`, `src/components/**`, `src/pages/Home.tsx`, `src/widgets/RhythmTrainer.tsx`, `package.json`, configs, `content/*.md`. Do not install packages. If the kit lacks something you need, build it as a widget in your own folder (below) and mention it in your report.

Read before writing: `src/index.css` (tokens and utilities), `src/components/ui/*.tsx` (the kit: every component has a doc comment), `src/components/three/ModelStage.tsx`, `src/pages/Home.tsx` (reference for tone and class usage), `src/lib/quiz.ts`, `src/lib/progress.ts`.

## 2. What you write

- A section page: `src/sections/NN-slug.tsx` (exact names are in `src/course.ts`, e.g. `05-rcp.tsx`), default export a component. The router picks it up by file name.
- Its review questions: `src/data/quiz/NN-slug.ts`, `export default` a `Question[]` (type from `src/lib/quiz.ts`). Ids must be globally unique: `s05-q1`, `s05-q2`…
- Its interactive widgets: `src/widgets/sNN/*.tsx` (your own folder; nobody else writes there).
- Logic that can be silently wrong (state machines, scoring, timers) gets a small `*.test.ts` next to it (Vitest, node environment, pure functions only).

## 3. The content rule: nothing cut, own words

The source for your section is `content/NN-slug.md`: a page-tagged spec of the manual. Every fact, number, list item, step, definition, note and warning in it must appear on your page. The user's instruction is "explain thoroughly all details, do not cut anything". Do not summarise away detail; use structure and interaction to carry the density instead.

- Language: Italian. Use the manual's terms and acronyms exactly (RCP, DAE, SME, ACC, BLS, BLS-D, PLS, DPI, FV, TV…). Write an acronym out the first time it appears on a page.
- The manual is copyrighted: the spec is already reworded, and your page text must stay original wording too. Do not add medical facts that are not in the spec.
- If you need to check something against the source: `python3 -I -c "import PyPDF2; r=PyPDF2.PdfReader('/Users/gabrielesarria/Downloads/blsd-corso.pdf'); print(r.pages[N-1].extract_text())"` (N = printed page number).
- Lines in the spec that start with `**Figura` and `**Idea interattiva` are notes for you, not page copy.
- `## Domande di ripasso` in the spec becomes the quiz data file: ALL questions, all options, the given answers and explanations, with `page`. A question with several correct answers is `kind: 'multi'`; an ordering question is `kind: 'order'` (give `options` in a scrambled order and `answer` as the correct sequence of ids).

## 4. Page shape

```tsx
import { Callout, Compare, Figure, KeyFacts, Quiz, SectionPage, Stage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/05-rcp'

export default function Rcp() {
  return (
    <SectionPage slug="rcp" lead={<p>Two or three sentences: what this section teaches and why it matters.</p>}>
      <Sub id="rapporto" title="Rapporto compressioni–ventilazioni" page="38">
        <p>Plain paragraphs, lists and h3/h4 are styled automatically inside a Sub.</p>
        <KeyFacts items={[{ label: 'Rapporto', value: '30:2' }]} />
      </Sub>
      …
      <Sub id="ripasso" title="Domande di ripasso" page="52">
        <Quiz id="rcp" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
```

- One `<Sub>` per subsection of the manual, in the manual's order and with the manual's headings (drop the "5.1" numbering from the title only if it reads better; keep page numbers in `page`). The rail on the left is built from the Subs.
- The last Sub is always the quiz: `id="ripasso"`, and `<Quiz id={slug}>` so progress is saved under the section slug.
- A good section alternates: a short explanation, then something to look at or do, then the numbers to remember. Never more than about three paragraphs in a row without a figure, a kit component or a widget. It must not read as a wall of text.
- Put each section's numbers to memorise in `<KeyFacts>` (near where they are taught, and/or one complete plate before the quiz).

## 5. The kit (import from `src/components/ui`)

| Component | Use it for |
|---|---|
| `SectionPage`, `Sub` | Page frame and subsections |
| `Callout kind="nota \| attenzione \| obbligo \| divieto"` | Boxed notes. nota = information; attenzione = the manual's ATTENZIONE boxes and cautions; obbligo = something that must always be done; divieto = something never to do |
| `KeyFacts items=[{label, value, note?}]` | Numbers to know by heart (label, dotted leader, value). `tone="well"` for the dark version |
| `Steps items=[{title, body, visual?}] mode="list \| stepper"` | Real procedures only (ordered steps). `stepper` = one step at a time with previous/next |
| `Compare columns=[{title, kind?, items, footer?}]` | Side-by-side: lieve/grave, adulto/bambino, fare/non fare |
| `FlipCards items=[{front, back}]` | Glossary terms and recall |
| `Details title group?` | Secondary detail only; never hide core content |
| `Checklist id items columns?` | Persisted tick lists |
| `Figure file? caption wide?` | A credited photo (`file="img/…"`, see §8) or an original SVG passed as children |
| `Stage title hint? footer?` | The dark frame for anything practised or 3D. Inside it use only `text-well-ink`, `text-well-soft`, `text-lume`, `bg-well-2`, and `<Button variant="onDark">` |
| `ScrollStory steps visual label` | Scrollytelling: a pinned visual that changes as text steps scroll by. `visual(active, progress)` returns the drawing. Use at most once per section, for a process that unfolds (oxygen's path, the chain, the minutes after cardiac arrest) |
| `Quiz id questions` | Review questions |
| `Button`, `ButtonLink` variants `safe \| danger \| must \| quiet \| onDark` | Controls |
| `Plate glyph tone`, `SignMark kind`, `Pictogram name` | Sign plates and pictograms (glyph names: see `Pictogram.tsx`) |
| `ModelStage` (from `src/components/three/ModelStage`) | 3D models, see §7 |
| `useStored(key, initial)` (from `src/lib/progress`) | Persist a widget's value (best score, form fields). Key format `sNN:name` |

## 6. Visual language: safety signage (ISO 7010)

The course looks like the safety-sign system: colour and shape always mean the same thing.

- **Green (`safe`)**: safe condition, information, correct, done. The brand field.
- **Blue (`must`)**: obligatory action: procedure steps, primary actions inside a task, focus rings.
- **Yellow (`warn`)**: caution. Text on yellow is dark.
- **Red (`danger`)**: stop, prohibition, wrong. Never decorative; never for emphasis.
- **Dark well (`well`, `well-2`, `well-ink`, `well-soft`, `lume`)**: practice and 3D only.
- Neutrals: `ground` (page), `panel`, `panel-2`, `ink`, `ink-soft`, `line`.

Use the Tailwind colour utilities generated from these tokens (`bg-safe`, `text-ink-soft`, `ring-line`, `bg-safe-tint`, `bg-must-tint`, `bg-warn-tint`, `bg-danger-tint`…). Never write hex or oklch values in components, so the "luci spente" dark mode keeps working. Inside SVG use `fill="var(--safe)"`, `stroke="var(--ink)"`, `currentColor` etc.

- Type: headings use `font-display` (condensed, weight 700–800, tight leading); body is the default. Sizes available: `text-title`, `text-sub`, or arbitrary like `text-[1.4rem]`. Sentence case everywhere; no all-caps labels; no letter-spaced small caps.
- Radius: `rounded-plate` for blocks, `rounded-chip` for controls. No pills except round counters.
- Shadows: `shadow-plate`, `shadow-raise` only.
- Running text max width is about 68ch (automatic in `Sub`); widgets and figures may be wider.

**Original illustrations.** Where the spec notes a figure and no photo fits, draw an original inline SVG in the sign-pictogram grammar: solid flat shapes, round heads, limbs as rounded bars, no outlines, no gradients, no faces, two or three token colours, generous padding, `viewBox` sized to content, `role="img"` with an Italian `aria-label`. Animate SVGs with Motion or CSS when movement explains the manoeuvre (a hand pressing, a head tilting, a body rolling). Prefer one good clear drawing over three weak ones. Never recreate the manual's photos.

**Do not**: gradients (text or background), glass/blur, emoji, icon-in-a-tile card grids, nested cards, a coloured left border on boxes, eyebrow labels above headings, "01/02/03" markers on things that are not sequences, em dashes in visible text (use commas, colons, parentheses), exclamation marks, invented statistics, centred body text, `transition-all`, animating width/height/top/left.

**Icons**: `lucide-react` for control icons (check, arrows, play, pause, volume, rotate). Pictograms from the kit for signs.

## 7. 3D models

`<ModelStage src alt hotspots? rotation? autoRotate? animate? hide? distance? height? target? deferLabel? className?>{extra r3f nodes}</ModelStage>`, normally inside a `<Stage>`. The model is auto-centred and scaled so its largest side is 2.4 stage units; hotspots and children use those units. Scroll never zooms the model.

Files in `public/models/` (credits in `content/assets-3d.json`, already handled by the credits page):

| src | What | Notes |
|---|---|---|
| `/models/heart.glb` | Realistic human heart, external | 3.3 MB |
| `/models/heart-section.glb` | Heart cut-away with chambers, valves, red/blue vessels | 28 MB: always pass `deferLabel="28 MB"` |
| `/models/lungs.glb` | Lungs with trachea and larynx, external | 7.6 MB |
| `/models/torso.glb` | Male body, standing A-pose, facing the camera | Use this for hand placement and pad positions. Do not lay it supine; frame the chest with `target={[0, 0.5, 0]} distance={1.8}` (sternum about x 0, y 0.45 to 0.6, z 0.15) |
| `/models/aed.glb` | AED device (no pads) | 1.1 MB |
| `/models/cpr-hands.glb` | Animated hands doing a compression | Pass `animate`, and `hide={['Cylinder']}` to show hands only |
| `/models/first-aid-kit.glb` | First-aid kit bag | 5 MB |
| `/models/skeleton.glb` | Full male skeleton | 6 MB |

Do not use drei's `<Html>` anywhere (it breaks rendering with React 19); hotspots are drawn by ModelStage itself. You cannot see the models, so: give your best-guess `rotation` and hotspot coordinates, and put the comment `// 3D-CHECK` on the line above every `<ModelStage`. The orchestrator will open each one in the browser and correct positions. Every hotspot needs a real `label` and `text` from the spec. Always write a meaningful Italian `alt`.

## 8. Photos and signs

Openly licensed photos are being collected into `public/img/` with a manifest at `content/assets-img.json` (fields: `file`, `subject`, `alt`, `notes`, licence). Run `ls public/img public/img/iso7010` and read the manifest (if it exists yet) when you start; use a photo only if the manifest says it shows what you need: `<Figure file="img/name.jpg" caption="…" />` (alt and credit are filled in from the manifest). If no photo fits, draw an SVG. Real ISO 7010 sign SVGs are in `public/img/iso7010/` (e.g. `e010-dae.svg`, `e003-primo-soccorso.svg`, `e004-telefono-emergenza.svg`, `m009-guanti-protettivi.svg`, `w009-rischio-biologico.svg`, `w012-pericolo-elettricita.svg`); show them with a plain `<img src="/img/iso7010/…" alt="…" className="w-24" />` where a real sign helps (hazards, PPE, the DAE sign).

## 9. Interaction quality

- Each section needs at least two real interactions beyond the quiz, chosen from the spec's "Idea interattiva" notes: something the learner does (decide, order, time, tap, drag, step through), with feedback that teaches. A widget that only reveals text on click does not count.
- Every control: keyboard reachable, visible focus (automatic), `aria-label` where there is no text, `aria-live="polite"` on feedback. Never rely on colour alone: pair it with a word or an icon.
- Motion: only `transform`, `opacity`, `clip-path`; 120–300 ms for UI, ease-out (`ease-out` class or `[0.23, 1, 0.32, 1]`); no entrance animation on text; nothing that hijacks scroll. Use Motion (`motion/react`) for component animation and drag, GSAP only through `ScrollStory`. Honour reduced motion (Motion does via the app's `MotionConfig`; for CSS use `motion-safe:`).
- Timers and audio never start by themselves; `SpeechSynthesis`/Web Audio only after a click.
- Copy: plain Italian, second person singular ("premi", "controlla"), sentence case, buttons say what they do ("Verifica", "Avanti", "Ricomincia"). Errors say what was wrong and what to do.
- Layout must hold at 375 px wide and at 1440 px. No horizontal scrolling.

## 10. Finish

1. `cd` to the project root and run `npx tsc -b`. Fix every error in YOUR files. Other builders are working at the same time, so ignore errors in files you do not own.
2. Run `npx vitest run src/widgets/sNN src/data` (your tests) if you wrote any.
3. Re-read your page against `content/NN-slug.md` heading by heading and confirm nothing is missing.
4. Report in under 200 words: files written, the interactions you built, every `// 3D-CHECK` and photo used, anything from the spec you could not place, and anything you needed from the kit that was missing. Do not paste code.
