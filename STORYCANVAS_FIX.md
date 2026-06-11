# StoryCanvas — Black Screen / Frames Not Loading: Fix

## What's wrong (confirmed from the recording + your code)

The scroll, pin, and text overlays all work. But the canvas stays **pure black** the
entire scroll — the frame `.png`s are never painted. Two separate bugs:

### Bug 1 — The black screen: `THREE.Texture` swapping (root cause)
`StoryCanvas.tsx` rendered the sequence through a bare WebGL `THREE.Texture`:
```ts
const texture = new THREE.Texture();
texture.image = firstImg;     // assign HTMLImageElement
texture.needsUpdate = true;
```
Assigning a plain `HTMLImageElement` to a hand-constructed `THREE.Texture` and swapping
`texture.image` every frame is unreliable in modern three (r152+): the texture's upload
/ color pipeline isn't initialized the way `TextureLoader`/`CanvasTexture` does it, so
the GPU shows **nothing → solid black**, even though the images are in memory. That is
exactly what the recording shows: text fades correctly, canvas is black throughout.

**Fix:** stop using WebGL for a flat image sequence. A frame-scrub sequence is a 2D
blit job (this is how Apple-style scroll sequences are built). The corrected
`StoryCanvas.tsx` uses a plain `<canvas>` 2D context and `ctx.drawImage(...)` with
object-fit: cover. It cannot show the black-texture bug, is lighter, and keeps your
exact GSAP timeline, Lenis wiring, counter, and text overlays.

### Bug 2 — Not all frames load: hardcoded count mismatch
`LoadingScreen.tsx` looped `i <= 273` per folder (546 total) and `StoryCanvas` animated
to `frameIndex: 545`. You said each folder actually holds **288** frames. So:
- Frames **274–288 of each folder were never requested** (15 × 2 = 30 missing frames).
- The scrub ended at 545 instead of the true last index, so the animation stopped short
  and the tail frames never showed.

**Fix:** a single source of truth for the count. Both files now declare:
```ts
const FRAMES_FOLDER_1 = 288;
const FRAMES_FOLDER_2 = 288;
```
`StoryCanvas` derives `TOTAL_FRAMES` and `LAST_INDEX` from these, so the scrub always
ends on the real final frame. **Set these to the true file count** — if a folder has 288
files, use 288; if 273, use 273. They must match in BOTH files.

---

## Files to replace
1. `src/components/StoryCanvas.tsx` → use the new version (2D canvas).
2. `src/components/LoadingScreen.tsx` (or wherever it lives) → use the new version
   (correct count + decode-aware, concurrency-limited preloading).
3. `page.tsx` → **no change needed**. It still does:
   ```tsx
   const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);
   const handleLoaded = (images: HTMLImageElement[]) => { setPreloadedImages(images); setIsLoading(false); };
   <StoryCanvas preloadedImages={preloadedImages} />
   ```

> You can now remove the `three` import/dependency from this component. If nothing else
> in the app uses three, you may uninstall it.

---

## Set the frame count correctly (do this first)
Check how many files are really in each public folder:
```
public/1/ezgif-frame-001.png ... ezgif-frame-XXX.png
public/2/ezgif-frame-001.png ... ezgif-frame-YYY.png
```
Then set `FRAMES_FOLDER_1 = XXX` and `FRAMES_FOLDER_2 = YYY` in **both**
`LoadingScreen.tsx` and `StoryCanvas.tsx`. If the two folders differ in count, that's
fine — they're independent.

If you're unsure of the exact count, the new `LoadingScreen` logs a console warning for
any frame path that fails to load (`failed to load frame: /1/ezgif-frame-274.png`), so a
wrong count shows up immediately in the dev console.

---

## What the new code does better
- **2D `drawImage` blit** with object-fit: cover math — no black-texture bug, no WebGL
  texture lifecycle to manage.
- **Only redraws when the frame index actually changes** (skips duplicate draws on the
  same frame) → smoother, less work per scroll tick.
- **Outward nearest-loaded fallback** kept: if a frame isn't decoded yet, it draws the
  closest loaded frame instead of flashing black.
- **Concurrency-limited preloader** (12 at a time) so 576 requests don't stampede the
  network; resolves on error so one missing file can't hang the loading screen.
- **ResizeObserver + cover redraw** so the image always fills the viewport without
  stretching, and redraws the current frame on resize.
- `ScrollTrigger.refresh()` on mount, next frame, timeouts, `window load`, and
  `document.fonts.ready` — kept from your original.

---

## Quick verification after swapping
1. Hard refresh. The loading bar should reach 100% (watch the console for any
   `failed to load frame:` warnings — if you see them, the count or path is wrong).
2. The hero should show the FIRST frame image behind the text (not black).
3. Scrolling should scrub smoothly through every frame to the very last one.
4. If it's still black: open console, run
   `document.querySelector('canvas').toDataURL().length` — a large number means pixels
   are being drawn (so it's a z-index/overlay issue), a tiny number means nothing is
   drawn (re-check that `preloadedImages.length > 0` is actually true when StoryCanvas
   mounts — i.e. the loader finished before render).

---

## Why not just fix the THREE version?
You can make THREE work by loading frames through `new THREE.CanvasTexture(canvas2d)` or
`TextureLoader` and setting `texture.colorSpace = THREE.SRGBColorSpace` + `needsUpdate`
on every swap — but for a flat 2D image sequence WebGL buys you nothing and adds the
exact failure mode you hit. The 2D-canvas approach is the standard, robust solution.
