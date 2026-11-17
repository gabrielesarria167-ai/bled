# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User's choice: frameworks, "especially Tailwind CSS". Resolved as Vite + React + TypeScript, Tailwind CSS v4, React Router, React Three Fiber + drei, GSAP ScrollTrigger, Motion (plan approved by the user).

## Users

One learner (the owner of this project), studying alone before attending the instructor-led DAN Europe BLS-D Provider course and its knowledge check. First-time study: no prior first-aid training assumed. Used mostly on a laptop or desktop; phones must still work.

## Product Purpose

An interactive Italian course that teaches the full content of the DAN Europe "Basic Life Support & Defibrillation (BLS-D)" Provider manual (ed. 2023, ERC 2021 guidelines). Success: the learner arrives at the classroom course knowing every concept, number and sequence in the manual, and can answer all its review questions.

## Positioning

Not a summary. Every fact, step, number and warning in the manual is present, and each procedure can be practised on screen (compression rhythm, the adult BLS sequence, the DAE algorithm) rather than only read.

## Operating Context

- Source: `~/Downloads/blsd-corso.pdf`, 108 pages, Italian; sections 1–10 plus two appendices; review questions per section with an answer key on p.98.
- Local, personal study tool. Nothing is published.
- Runs from a local dev server; progress is kept in the browser.

## Capabilities and Constraints

- Language: Italian only. Terminology and acronyms follow the manual (RCP, DAE, SME, ACC, PLS, DPI…).
- Completeness is a hard requirement from the user: "explain thoroughly all details, do not cut anything".
- The manual is "all rights reserved": course text is original wording; the manual's photos are not reused. Images are original SVG/3D or openly licensed (Wikimedia Commons, Sketchfab CC), each credited.
- No medical facts beyond the manual.
- Every section must carry the manual's own warning: this does not replace hands-on training with a certified instructor.
- Rich in images and 3D models; interactive; must not read as a wall of text (user's words).
- No accounts, no backend, no IT/EN toggle.

## Evidence on Hand

- `content/*.md`: per-section content specs, page-tagged against the PDF.
- `content/assets-3d.json`, `content/assets-img.json`: credited models and images under `public/`.
- No testimonials, pass rates or outcome statistics exist; none may be invented.

## Product Principles

1. Nothing cut: completeness outranks brevity; structure and interaction carry the density.
2. Practise, then prove: each procedure is rehearsed on screen before it is quizzed.
3. The manual's numbers are exact and always visible where they matter.
4. The learner always knows where they are and what is left.
5. Honest about limits: screen practice prepares for, never replaces, hands-on training.

## Accessibility & Inclusion

Keyboard reachable controls, visible focus, `prefers-reduced-motion` respected, text contrast at WCAG AA. 3D scenes have a text equivalent of what they show.
