# Hero Canvas — Black Blank Screen & No Scroll: Diagnosis + Fix

**Symptom:** the hero section renders a black/blank rectangle, nothing animates, and
scroll does nothing. The frame images all exist, but on the live page the `<canvas>`
shows nothing and ScrollTrigger appears dead.

This is almost never "the animation code is wrong." It is one of a small set of
**measurement / lifecycle** problems specific to canvas + ScrollTrigger. Below is the
full diagnosis, ordered from most to least likely, each with the exact fix.

---

## TL;DR — the three real causes

1. **The canvas has zero measurable size at the moment it's drawn** (parent has no
   height, or is `display:none`/`visibility:hidden`/`opacity:0` at mount, or is inside
   an unmeasured flex/grid track). A zero-size canvas draws nothing → black.
2. **ScrollTrigger created its pin before layout/fonts settled**, so `start`/`end`
   were computed against the wrong height and the pin never engages. Needs a
   `refresh()` after load.
3. **The animation reads scroll progress but the canvas never repaints**, or the
   draw loop started before the element was in the DOM / before `getContext` succeeded.

If Antigravity is failing it, it is most likely #1 (a hidden or zero-height parent at
build/SSR/mount time).

---

## 1. Zero / unmeasured canvas size (the #1 cause)

A `<canvas>` does **not** size itself to its CSS box automatically for drawing. You set
its CSS size (e.g. `width:100%;height:100%`) AND you must set its **backing-store**
size (`canvas.width` / `canvas.height` in device pixels). If you read the parent box
**while it is collapsed**, both come back `0` and every draw call paints into a 0×0
buffer — which shows as a black or blank element.

### Why the parent is collapsed at the wrong moment
- The canvas's parent is positioned `absolute`/`fixed` and the grandparent has no
  explicit height, so it measures `0`.
- The section mounts hidden (`display:none`, a closed tab/accordion, an
  `opacity:0`/`visibility:hidden` reveal-on-scroll wrapper) and the resize runs once,
  at `0`, and never again.
- SSR/hydration (Next.js): `getBoundingClientRect()` ran during a pass where the box
  wasn't laid out yet.
- Fonts/web components shifted layout after the one-time measure.

### Fix A — give the canvas parent an explicit, non-zero height
The single most reliable fix. The canvas parent must always have a real height:
```css
.hero-canvas-wrap {
  position: relative;
  width: 100%;
  height: 100vh;       /* or a fixed px height — never 0, never auto-collapsing */
  min-height: 100vh;
}
.hero-canvas {
  position: absolute;
  inset: 0;
  display: block;      /* removes inline-canvas baseline gap */
  width: 100%;
  height: 100%;
}
```

### Fix B — measure with ResizeObserver, not a one-time read
Re-measure whenever the box actually changes size (covers hidden-at-mount → shown):
```js
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  const r = canvas.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return;     // skip useless 0-size passes
  canvas.width  = Math.round(r.width  * dpr);
  canvas.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);          // draw in CSS pixels
}

const ro = new ResizeObserver(resize);
ro.observe(canvas);
resize();
// cleanup: ro.disconnect();
```
`ResizeObserver` fires the moment the element gains real dimensions, so even if it
mounts hidden, the canvas sizes correctly the instant it becomes visible.

### Fix C — don't draw until size is valid
Guard the draw loop so it no-ops while the canvas is 0×0 instead of painting black:
```js
function draw(time) {
  if (canvas.width === 0 || canvas.height === 0) {
    rafId = requestAnimationFrame(draw);
    return;                                        // wait for a valid size
  }
  // ...clear + paint...
  rafId = requestAnimationFrame(draw);
}
```

### Quick way to confirm it's this
In dev tools console on the live page:
```js
const c = document.querySelector("canvas");
console.log(c.width, c.height, c.getBoundingClientRect());
```
If `width`/`height` are `0` (or the rect is `0` tall) → it's a sizing problem, apply
Fix A+B+C. If they're correct but still black → go to §3.

---

## 2. ScrollTrigger pin computed against wrong layout (no scroll)

If the pin/`start`/`end` were measured before the page settled (late fonts, images,
or async content above the hero), the trigger ranges are wrong and the section won't
pin or scrub.

### Fix — refresh after everything that affects layout
```js
// after the timeline is created:
window.addEventListener("load", () => ScrollTrigger.refresh());

// if fonts load late:
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

// if you mount in React, refresh on next frame after mount:
requestAnimationFrame(() => ScrollTrigger.refresh());
```

### Fix — make sure the plugin is actually registered
A silent failure mode: `pin` does nothing because the plugin wasn't registered.
```js
gsap.registerPlugin(ScrollTrigger);   // must run before any ScrollTrigger is created
```

### Fix — the pinned element needs height context
`pin: someEl` requires the trigger to have scrollable distance. The trigger element
(the outer `<section>`) must be allowed to be taller than the viewport via
`end: "+=NNN%"` or `pinSpacing: true` (default). If you set `pinSpacing:false` without
providing space elsewhere, the page won't scroll through the animation.

### Fix — smooth-scroll libraries
If Lenis/Locomotive is on the page, ScrollTrigger reads the wrong scroll position and
the pin appears frozen. Wire them together once:
```js
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## 3. Canvas sized correctly but still black (loop / context issues)

- **`getContext` returned null or ran on the wrong element.** Confirm
  `canvas.getContext("2d")` (or `"webgl"`) is not null and that you're selecting the
  right canvas (multiple canvases on the page?).
- **The RAF loop never started, or started before the element was in the DOM.** Start
  it inside `useEffect`/`onMount`, not at module top level. In React 18 Strict Mode the
  effect runs twice in dev — make sure cleanup cancels the previous `requestAnimationFrame`
  so you don't end up with a dead first loop:
  ```js
  let rafId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(rafId);
  ```
- **You clear to black and the strokes are also near-black on black.** If you do
  `ctx.fillStyle="#000"; ctx.fillRect(...)` each frame but the progress-driven `reveal`
  is still 0 (because scroll progress isn't being delivered — see §2), nothing is drawn
  on top → solid black. Verify the value you feed the canvas is actually changing:
  ```js
  scrollTrigger: { onUpdate: (self) => { console.log(self.progress); phase = self.progress; } }
  ```
  If `progress` never logs or stays 0, the problem is ScrollTrigger (§2), not the canvas.
- **DPR transform applied twice.** Calling `ctx.setTransform(dpr,...)` and also scaling
  manually doubles the transform and can push everything off-canvas. Use one or the other.

---

## 4. SSR / Next.js specific (if the host is Next.js)

`canvas`, `window`, `requestAnimationFrame`, and `getBoundingClientRect` don't exist on
the server. If the component runs during SSR it throws or measures nothing.

- Mark it client-only:
  ```js
  "use client";
  ```
- Or dynamically import with SSR disabled:
  ```js
  import dynamic from "next/dynamic";
  const Hero = dynamic(() => import("./Hero"), { ssr: false });
  ```
- Do all canvas/ScrollTrigger work inside `useEffect`/`useLayoutEffect`, never in the
  render body.

---

## 5. Minimal known-good pattern (copy this shape)

This is the exact lifecycle the working sections in this delivery use. If the failing
hero deviates from this shape, align it.

```jsx
"use client";
import { useRef, useEffect } from "react";

export default function HeroCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);

  // 1) canvas: size via ResizeObserver, draw via RAF, guard zero-size
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      if (canvas.width && canvas.height) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ...paint using phaseRef.current...
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  // 2) scrolltrigger: register, pin, feed progress, refresh after load
  useEffect(() => {
    let killed = false;
    import("gsap").then(({ gsap }) => import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => { phaseRef.current = self.progress; },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => st.kill();
    }));
    return () => { killed = true; };
  }, []);

  return (
    <section ref={wrapRef} style={{ position: "relative", height: "100vh", minHeight: "100vh", background: "#0d0d0f" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
    </section>
  );
}
```

---

## 6. Diagnostic order for Antigravity (run top to bottom)

1. Console: `const c=document.querySelector('canvas'); console.log(c.width,c.height,c.getBoundingClientRect())`.
   - Zero → fix sizing (§1). This is the most common cause of black screen.
2. Console: confirm `onUpdate` logs a changing `progress` while scrolling (§2/§3).
   - No change → ScrollTrigger isn't driving (register plugin, refresh, wire smooth-scroll).
3. Confirm `gsap.registerPlugin(ScrollTrigger)` runs before any trigger is created.
4. Confirm the section is client-side only (Next.js `"use client"` / dynamic `ssr:false`).
5. Confirm only ONE GSAP instance is on the page.
6. Confirm the canvas parent has an explicit non-zero height and isn't hidden at mount.
7. Add `ScrollTrigger.refresh()` on `window load` and `document.fonts.ready`.

Fixing #1 (canvas size) and #2 (ScrollTrigger refresh + register) resolves the
black-blank-no-scroll hero in the overwhelming majority of cases.
