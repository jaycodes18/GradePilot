# LEXICON SOVEREIGN

A high-performance, desktop-native React workstation for legal intelligence
and compliance. Operated under retainer.

> Design philosophy: **Kinetic Brutalism.** High-end Swiss design meets a
> futuristic OS. Razor-sharp 90° edges, absolute black, stark white, with
> Legal Gold reserved for alerts and success. Massive negative space.

---

## Stack

| Concern         | Choice                                          |
| --------------- | ----------------------------------------------- |
| Framework       | Next.js 15 (App Router) + React 19              |
| Styling         | Tailwind CSS (flat — no shadows, no rounded)    |
| Motion          | Framer Motion (layout) + GSAP (elastic micro)   |
| 3D              | `@react-three/fiber` + `three`                  |
| State           | `zustand` + `persist` middleware → localStorage |
| Variable Fonts  | Inter Tight (display) + JetBrains Mono (code)   |

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # strict TS check
```

## What ships

### 1. Boot Sequence — `components/BootSequence.tsx`
Full-screen loader. A line-art gavel draws itself stroke-by-stroke, then
deconstructs into geometric lines that fly apart, then morphs into the
typographic **LEXICON** wordmark. The wordmark is wrapped in a Framer
Motion `layoutId="lexicon-mark"` and is also rendered by `TopNav` —
Framer performs a continuous FLIP from splash-center to the top-left nav
slot.

### 2. Sovereign Neural Canvas — `components/NeuralCanvas.tsx`
6,500-point monochromatic point cloud rendered via `@react-three/fiber`
with a custom GLSL shader. Particles are stored with two attribute
buffers — `aHome` (random) and `aSpiral` (Fibonacci phyllotaxis at the
golden angle ≈ 137.5°) — and interpolated via the `uMode` uniform.

* **Mouse displacement** — repulsion is performed in the vertex shader
  using a world-space mouse uniform; the field falls off smoothly with
  distance and gates down when in spiral mode (organized logic = ordered).
* **Thinking state** — when the global `aiState` is `thinking` or
  `streaming`, `uMode` eases toward 1 and the cloud reorganizes into the
  rotating Fibonacci spiral.

### 3. Analysis HUD — `components/AnalysisHUD.tsx`
Horizontal split-pane with a draggable 0.5px glassmorphic divider.
* **Left** — `DocumentPanel`: editable, line-numbered, with inline
  highlighting of statutory references the AI is likely to cite.
* **Right** — `AdvisoryConsole`: high-end terminal that streams the
  partner's memo with a log strip, console status, and the magnetic
  dispatch button.

### 4. AI RAG Simulation — `app/api/analyze/route.ts`
Streams a fabricated advisory in the voice of a *Senior Partner at a
Magic Circle Law Firm*. Output is constrained to strict **IRAC** form
(Issue / Rule / Application / Conclusion). Statutory references are
embedded inline as `[[CITE:UCC § 2-207]]` markers; the client renderer
parses these into interactive `<CitationTag />` components that surface a
floating tooltip card with the official text under retainer.

The route also emits `[[STATE:THINKING]]` / `[[STATE:STREAMING]]` /
`[[STATE:COMPLETE]]` control markers that the console swaps into the
zustand store — which is what triggers the neural canvas's Fibonacci
state.

### 5. Boutique Subscription — `components/SubscriptionApplication.tsx`
Full-screen membership *application* — not a SaaS pricing table. Three
tiers presented as relationships, not feature lists:
* **I — Observer** (by invitation)
* **II — Counsel** (application required)
* **III — Retainer** (partner interview only) — locks Real-Time Statute
  Monitoring, direct-line escalation, on-prem deployment.

### 6. Magnetic Buttons — `components/MagneticButton.tsx`
GSAP-driven elastic chassis. On `mousemove` the button and its label
translate toward the cursor at 35% / 17.5% strength respectively; on
`mouseleave` both spring back via `elastic.out(1, 0.35)`.

### 7. Persisted Workspace — `lib/store.ts`
A single zustand store with `persist` middleware. Documents, tier,
session history, and the HUD split ratio are all saved to
`localStorage` under the key `lexicon-sovereign:workspace`.

## File map

```
app/
  layout.tsx              variable fonts, metadata, root html
  page.tsx                mounts <Workstation />
  globals.css             kinetic brutalism design system
  api/analyze/route.ts    streaming senior-partner advisory
components/
  Workstation.tsx         orchestrator: boot → chrome → hero → HUD
  BootSequence.tsx        gavel deconstruct → LEXICON wordmark
  TopNav.tsx              receives shared layoutId from boot
  NeuralCanvas.tsx        R3F point cloud, mouse repulsion, Fibonacci
  GridOverlay.tsx         visible 0.5px snap grid
  AnalysisHUD.tsx         draggable 0.5px glass split-pane
  DocumentPanel.tsx       left pane — editable instrument
  AdvisoryConsole.tsx     right pane — streaming terminal
  IRACRenderer.tsx        parses + renders IRAC + citations
  CitationTag.tsx         hover-card floating tooltip
  MagneticButton.tsx      GSAP elastic micro-interaction
  SubscriptionApplication.tsx   boutique membership form
lib/
  store.ts                zustand + persist
  citations.ts            statute database for tooltips
  irac.ts                 IRAC parser + citation segmenter
```

## Notes for the operator

* No off-the-shelf component libraries are used. Every primitive (button,
  input, card, divider, tooltip) is hand-built to enforce the 0px-radius,
  flat, hairline aesthetic.
* `*` selector enforces `border-radius: 0 !important` to defeat any
  inherited rounding from default user-agent styling.
* The visible 0.5px grid is rendered via `linear-gradient` on
  `.sov-grid`, mask-faded so it reads as infrastructure rather than
  wallpaper.
* All animation timing follows the same easing — `[0.7, 0, 0.2, 1]` — to
  preserve the "physical, heavy, and extremely fast" cadence.
