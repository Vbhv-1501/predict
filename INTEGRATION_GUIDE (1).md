# Depth Scroll Sections — Integration Guide for Antigravity

This document explains two production-ready scroll-animation sections and exactly
how to drop them into the existing site. Both are framework-flexible and are built
so the host site's **own color theme and font stack win automatically** — you only
override a handful of CSS variables, nothing else.

## Files in this delivery

| File | What it is | Use when |
|------|-----------|----------|
| `DepthScrollSection.jsx` | React component — pinned chat-thread storytelling block (3 left-panel steps + right-side chat that builds on scroll) | Site is React / Next.js |
| `depth-scroll-section.html` | Same chat block as plain HTML/CSS/JS | Site is WordPress / static / Webflow |
| `DepthConverge.jsx` | React component — card that **stretches to full-screen** while 5 signal lines converge into a glowing orb (canvas-rendered) | Site is React / Next.js |
| `depth-converge.html` | Same converge block as plain HTML/CSS/JS | Site is WordPress / static / Webflow |
| `INTEGRATION_GUIDE.md` | This file | — |
| `HERO_CANVAS_FIX.md` | Diagnosis + fix for the black/blank canvas hero that won't scroll | The hero is failing |

Pick the `.jsx` **or** the `.html` variant per section depending on the stack.
Do not load both variants of the same section.

---

## 1. Shared rules that apply to BOTH sections

### 1a. GSAP dependency
Both sections use **GSAP 3.12.5 + ScrollTrigger**. They lazy-load it from CDN at
runtime, so no `npm install` is strictly required. Two options:

- **Keep CDN (default):** do nothing. The component injects the scripts once and
  shares them across mounts.
- **Bundle instead (recommended for production):**
  ```bash
  npm i gsap
  ```
  Then in the `.jsx` files, replace the `loadGsap()` call and its CDN injector with:
  ```js
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  gsap.registerPlugin(ScrollTrigger);
  ```
  and use `gsap` / `ScrollTrigger` directly instead of `window.gsap` / `window.ScrollTrigger`.

> Only load GSAP **once** on the page. If the host theme already loads GSAP, delete
> the two `<script src="...gsap...">` / `<script src="...ScrollTrigger...">` lines
> from the `.html` files, or skip the bundled import in one of the React components.

### 1b. Smooth-scroll libraries (Lenis / Locomotive)
If the site uses Lenis or Locomotive Scroll, ScrollTrigger must be told to read
their scroll position or pinning will drift. Add this once, after both are initialized:

```js
// Lenis example
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

If you are NOT using a smooth-scroll library, ignore this — native scroll works as-is.

### 1c. "Buttery smooth" guarantees (already built in)
- All motion animates **only** `transform`, `opacity`, `filter`, `border-radius`, and
  `inset` — no width/height/top/left thrash on the per-frame path (the one card
  size tween is GPU-friendly and runs once).
- `will-change` is set on every animated element.
- `scrub: 1` gives a 1-second smoothing lag so scroll feels weighted, never jumpy.
- The converge section paints its many lines on **one `<canvas>`** via
  `requestAnimationFrame`, not hundreds of DOM nodes, so it holds 60fps.
- `transform: translateZ(0)` forces GPU compositing on the morphing layers.
- Mobile and `prefers-reduced-motion` disable pinning entirely and fall back to a
  static stacked layout — no canvas loop runs there.

Do not change these to animate layout properties; that is what breaks 60fps.

---

## 2. THEME ADAPTATION — make it match the host site automatically

Both sections expose their entire palette and type through **CSS custom properties**
declared on the section's root element. The host site overrides them in one place.
Nothing else in the components references hard-coded colors or fonts for theming.

### 2a. Variables you can override

```css
/* Chat storytelling section root: .dx-section */
.dx-section {
  --bg:     #FAFAF8;  /* section background      */
  --ink:    #111111;  /* primary text            */
  --muted:  #6b6b6b;  /* secondary text          */
  --blue:   #0A84FF;  /* user chat bubble        */
  --bubble: #f1f1ef;  /* AI chat bubble bg       */
  --accent: #9B1C2E;  /* ACTION / highlight red  */
  --font:   "Inter", system-ui, sans-serif; /* whole section type */
}

/* Converge section root: .dc-section */
.dc-section {
  --bg:    #FAFAF8;   /* light page background    */
  --ink:   #111111;   /* primary text             */
  --muted: #6b6b6b;   /* secondary text           */
  --red:   #C0334D;   /* brand accent (headline em, CTA) */
  --font:  "Inter", system-ui, sans-serif;
}
```

### 2b. How to make them inherit the site's theme

**Option A — inherit the site's font automatically (preferred).**
Change the `--font` default in each component to `inherit` so it picks up whatever
font the page body already uses:

```css
.dx-section, .dc-section { --font: inherit; }
```
The components already do `font-family: var(--font)`, so this alone makes the type
match the host site with zero further work.

**Option B — point variables at the site's existing design tokens.**
If the site has its own CSS variables (very common in themes/design systems), map them:

```css
.dx-section,
.dc-section {
  --font:   var(--site-font-sans, inherit);
  --ink:    var(--site-color-text, #111);
  --muted:  var(--site-color-text-muted, #6b6b6b);
  --bg:     var(--site-color-bg, #FAFAF8);
  --accent: var(--brand-accent, #9B1C2E);  /* dx-section */
  --red:    var(--brand-accent, #C0334D);  /* dc-section */
}
```
Put this override AFTER the component's own `<style>` so it wins (it has equal
specificity and comes later, or add it in the site's global stylesheet which loads after).

**Option C — dark-mode aware.**
Wrap the overrides in the site's existing dark-mode selector:

```css
html[data-theme="dark"] .dx-section {
  --bg:#0d0d0f; --ink:#f5f5f5; --muted:#9a9a9c; --bubble:#1a1a1c;
}
```
Note: the converge section's expanded panel is intentionally dark (#0d0d0f) by design
— that is the artwork, not the page theme. Only the surrounding light page uses `--bg`.

### 2c. Headline accent words
- Chat section: the red highlight comes from the class `.dx-hl` (uses `--accent`).
- Converge section: the colored word in the headline is an `<em>` (uses `--red`).
  Edit which word is emphasized directly in the markup (e.g. `Only <em>we</em> see`).

### 2d. What you should NOT theme
Leave these as-is — they are part of the visual identity of the artwork, not the
page chrome:
- The expanded dark canvas panel background in the converge section.
- The per-signal line colors (Glucose blue, HRV white, etc.) — but you *may* recolor
  them in the `SIGNALS` array if the brand requires it.
- The glowing red orb / beam in the converge section (tied to `#FF3B5C`).

---

## 3. Section A — Chat Storytelling (`DepthScrollSection` / `depth-scroll-section.html`)

### What it does
A full-viewport section that **pins** while you scroll. The left panel cross-fades
through three steps (label → big headline → body). The right panel is a chat thread
that **builds message by message** as you scroll: blue user bubbles, grey AI bubbles
with an avatar, a typing indicator, and a red ACTION card. A progress bar sits bottom-left.
At the end the panel lifts away and the section unpins into whatever follows.

### Content you can edit
- `STEPS` array → the three left-panel insights (`label`, `headline`, `body`).
  Use `\n` inside `headline` to force a line break (e.g. `"Patterns you'd\nnever spot."`).
- `CHAT` array → the thread. Each item has:
  - `type`: `"user"` | `"ai"` | `"typing"`
  - `at`: number 0–1, the scroll progress where it appears
  - `text` (user) or `lines` (ai). In `lines`, `{ html }` supports `<b>` and
    `<span class="dx-hl">` for the accent color; `{ action: true }` renders the ACTION label.

### React integration
```jsx
import DepthScrollSection from "./components/DepthScrollSection";

// place it directly before Testimonials
<DepthScrollSection />
<Testimonials />
```

### HTML integration
Paste the whole `depth-scroll-section.html` block (markup + `<style>` + scripts)
immediately before the Testimonials markup. In WordPress use a **Custom HTML** block;
in a page builder use an **HTML / Code** widget; in Webflow use an **Embed**.

---

## 4. Section B — Full-Screen Converge (`DepthConverge` / `depth-converge.html`)

### What it does (scroll order)
1. Light page. A dark **rounded chart card** sits on the right (single ApoB line +
   LIVE badge). Left headline morphs from *"Your blood is only a snapshot in time."*
   → *"Only we see the whole picture."*
2. Card content swaps to a **5-signal panel** (Glucose / HRV / Sleep / Training /
   Bloodwork) with animated waveforms.
3. The card **stretches edge-to-edge to a full-screen dark panel** (border-radius →
   0, inset → 0).
4. The five signals (drawn on `<canvas>`) **flow from left-edge labels, braid into a
   helix in the center, and collapse into a glowing red orb** that feeds the
   "DEPTH READS → Recovery's back." readout + the "Bring your devices. / We bring the
   intelligence. / Continuously." CTA.

### How the motion is wired
- One GSAP timeline pinned with `end: "+=420%"` (≈ 4 viewport-heights of scroll).
- `ScrollTrigger.onUpdate` writes `self.progress` into `phaseRef` every frame.
- The canvas `requestAnimationFrame` loop reads that `phase` and recomputes the line
  paths: a `reveal` factor (lines appear) and a `conv` factor (lines braid + collapse).
- The card size/border-radius is a single GSAP tween at ~32% progress.

### Content you can edit
- `SIGNALS` array → the five tracked signals (`label`, `icon`, `color`). Add/remove
  entries; the canvas and labels regenerate from this list automatically.
- Headline `<em>` word, the `dc-readout` copy, and the `dc-read-cta` lines are plain markup.
- To change scroll length / pacing: adjust `end: "+=420%"` and the timeline position
  numbers (the `, 0.32)` style trailing args are 0–1 timeline positions).
- To change braid density: in the canvas `draw()`, the `Math.sin(fx * 26 + braidPhase)`
  term — raise `26` for more weave loops.

### React integration
```jsx
import DepthConverge from "./components/DepthConverge";

<DepthConverge />
```

### HTML integration
`depth-converge.html` is a full standalone page so you can test it by opening it in a
browser. To embed: copy the `<section class="dc-section">…</section>`, its `<style>`,
and the two GSAP `<script src>` lines + the inline `<script>` into a Custom HTML / Embed
block. Delete the `.spacer` divs (they exist only for the standalone demo).

### v2 changes (current file)
The delivered `DepthConverge.jsx` is v2. Differences from any earlier copy:
- **Starts at the 5-signal panel.** The intro "Your blood is only a snapshot in time"
  state and the single ApoB line chart were removed. The section opens directly on the
  Glucose/HRV/Sleep/Training/Bloodwork panel.
- **Fullscreen panel layers above the text.** The card has a higher `z-index` than the
  left text, and the left text fades out (`autoAlpha → 0`) as the card stretches, so the
  headline never shows through the dark panel.
- **Lines are anchored to their labels.** The canvas measures each label row's vertical
  centre (via `ResizeObserver` + `getBoundingClientRect`) and starts each line exactly in
  front of its own label, beginning just past the label's right edge — not at generic lanes.
- **No ghost lines.** Only the animated strokes are drawn; there are no duplicate static
  label rows or non-moving flat lines.

If the brand needs the panel to NOT cover the left text (e.g. keep both side by side),
reduce the card's final size in the stretch tween (e.g. `width:"60vw"`) instead of `100vw`
and remove the `dc-text` fade tween.

### IMPORTANT — canvas must have real height
The canvas sizes itself from its parent's measured box. The parent `.dc-card` always
has an explicit height (it starts at `min(64vh,520px)` and animates to `100vh`), so the
canvas is never zero-height. **Do not** place this section inside a parent with
`height: 0`, `display: none` at load, or an unmeasured flex/grid track — that is the
classic cause of a black blank canvas (see `HERO_CANVAS_FIX.md`).

---

## 5. Quick integration checklist

- [ ] Chose `.jsx` or `.html` per section to match the stack.
- [ ] GSAP loaded exactly once on the page.
- [ ] If Lenis/Locomotive is used, wired `ScrollTrigger.update` to it (§1b).
- [ ] Overrode `--font` (→ `inherit` or site token) and accent color (§2).
- [ ] Section sits directly before its intended neighbor (e.g. Testimonials).
- [ ] Verified the converge section's parent has a real, measurable height (§4).
- [ ] Tested at desktop + a ≤820px width (mobile fallback should stack, no pin).
- [ ] Confirmed `ScrollTrigger.refresh()` runs after fonts/images load (the components
      call it; if you add late-loading content above the section, call it again).

---

## 6. Common pitfalls (and the fix)

| Symptom | Cause | Fix |
|--------|-------|-----|
| Section doesn't pin / scroll feels off | Smooth-scroll lib not wired to ScrollTrigger | §1b |
| Pin jumps when content above loads late | Layout shift changed start position | Call `ScrollTrigger.refresh()` after load, or set fixed heights above |
| Fonts don't match site | `--font` still set to Inter | Set `--font: inherit` (§2b) |
| Canvas is black/blank, no animation | Parent has no measurable height, or hidden at mount | See `HERO_CANVAS_FIX.md` |
| Two copies of GSAP warnings | Loaded via CDN AND bundle | Load once (§1a) |
| Janky on scroll | Something animating layout (width/top) per frame | Keep to transform/opacity/filter |
