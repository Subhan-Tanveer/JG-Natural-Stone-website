# JG Natural Stone — Full Image & Video Generation Guide

Every visual slot across all 9 pages, plus a **starter image + video prompt** for each
page's hero and the other spots that call for motion. Until you drop a real file in, the
site shows an intentional procedural-stone placeholder, so nothing looks broken.

---

## How the video workflow works
1. **Generate the STARTER IMAGE** (a still) using the *image prompt*.
2. **Feed that still into an image-to-video model** (Runway Gen-3, Luma Dream Machine, Kling,
   Pika, Sora) together with the *video prompt*. The still becomes the first frame; the video
   prompt drives the motion.
3. Export **muted, 6–8s, seamless loop, ≤2 MB, 1080p**. Keep a matching `.jpg` poster.

## Paste this STYLE BLOCK into EVERY image prompt (keeps the whole site consistent)
> photorealistic, cinematic editorial architectural photography, warm low-key lighting, a
> single soft key light raking across the surface, deep charcoal (#12100E) shadows, warm
> brass (#C69A5B) accents, rich matte stone texture, shallow depth of field, no text, no
> logos, no watermark, shot on 50mm

## Paste this MOTION BLOCK into every video prompt
> extremely slow, steady, elegant camera movement; premium and subtle; muted; seamless 6–8
> second loop; no fast cuts, no camera shake; cinematic

## Export rules
- Stills: **WebP** (JPG fallback), **≤100 KB** each, sRGB.
- Hero videos: **MP4 (H.264) + WebM**, muted, ≤2 MB, 1080p, 16:9 (add a 9:16 crop for mobile).
- No people unless a prompt says so. Brand accent = warm brass, never neon.

---

# PART 1 — HERO: starter image + video, per page

Filenames: still `assets/img/hero-<page>.jpg`, video `assets/img/hero-<page>.mp4` (+ `.webm`).
(Home's still may keep the name `hero-slab.jpg`, which the markup already points to.)

### 1. HOME → `hero-slab.jpg` + `hero-home.mp4`  · 16:9
**Starter image:**
> A honed dark charcoal granite countertop slab in a luxury kitchen, fine silver-grey natural
> veining catching a soft warm key light from the left, deep shadow falling to near-black on
> the right, a brass pendant glowing softly out of focus in the background. [STYLE BLOCK]
**Video:**
> Slow push-in across the granite as the warm key light rakes left-to-right revealing the
> veining; faint dust motes drift through a shaft of light; brass pendant bokeh shimmers.
> [MOTION BLOCK]

### 2. PRODUCTS → `hero-products.jpg` + `hero-products.mp4`  · 16:9
**Starter image:**
> A row of large stone slabs standing upright in a dark fabrication showroom rack — granite,
> white quartz, veined marble and dramatic quartzite side by side, each edge catching a warm
> rim light, floor reflecting faint highlights. [STYLE BLOCK]
**Video:**
> Camera glides slowly past the standing slabs left-to-right, each slab lighting up in turn as
> it passes the key light, subtle parallax between foreground and background slabs. [MOTION BLOCK]

### 3. GRANITE → `hero-granite.jpg` + `hero-granite.mp4`  · 16:9
**Starter image:**
> Extreme macro of a polished black-and-gold granite slab, dramatic natural veining and
> mineral flecks glinting, warm key light grazing across the surface, deep black falloff.
> [STYLE BLOCK]
**Video:**
> The warm light slowly sweeps across the slab surface, gold and mica flecks catching and
> releasing the light one by one, a slow drift toward the richest vein. [MOTION BLOCK]

### 4. QUARTZ → `hero-quartz.jpg` + `hero-quartz.mp4`  · 16:9
**Starter image:**
> A pristine white engineered-quartz waterfall island in a bright modern kitchen, fine grey
> veining, warm brass fixtures, soft daylight mixed with a warm key light, satin finish.
> [STYLE BLOCK]
**Video:**
> Slow dolly along the waterfall edge from counter down to floor, revealing the continuous
> vein wrapping the corner; soft daylight shifts subtly. [MOTION BLOCK]

### 5. GALLERY → `hero-gallery.jpg` + `hero-gallery.mp4`  · 16:9
**Starter image:**
> A wide cinematic shot of a finished luxury kitchen with a large stone island, warm pendant
> lighting, styled but pristine, deep shadows in the corners, editorial interior photography.
> [STYLE BLOCK]
**Video:**
> Very slow cinematic pan across the finished kitchen, left to right, warm pendants glowing,
> a soft rack-focus settling on the island stone. [MOTION BLOCK]

### 6. VISUALIZERS → `hero-visualizers.jpg` + `hero-visualizers.mp4`  · 16:9
**Starter image:**
> A modern kitchen rendered in warm light with one countertop material subtly highlighted, a
> clean architectural-visualization feel, faint depth grid fading in the shadows, no UI, no
> text. [STYLE BLOCK]
**Video:**
> Slow orbit around the kitchen island; as the camera moves, the countertop surface subtly
> shifts sheen as if a material is being previewed; calm and precise. [MOTION BLOCK]

### 7. FINANCING → `hero-financing.jpg` + `hero-financing.mp4`  · 16:9
**Starter image:**
> A warm, inviting family kitchen at golden hour with a beautiful stone island, soft natural
> light through a window, cozy and aspirational, empty of people. [STYLE BLOCK]
**Video:**
> Gentle slow push-in toward the island as golden-hour light warms the stone; soft light
> flicker as if from a window; calm and reassuring. [MOTION BLOCK]

### 8. FAQ → `hero-faq.jpg` + `hero-faq.mp4`  · 16:9
**Starter image:**
> A quiet detail macro: the profiled edge of a polished stone countertop meeting a brass
> measuring square, warm key light, deep shadow, precision-craftsmanship mood. [STYLE BLOCK]
**Video:**
> Slow drift along the polished edge, the warm light traveling down the profile; a shallow
> rack-focus from the brass square to the stone. [MOTION BLOCK]

### 9. CONTACT → `hero-contact.jpg` + `hero-contact.mp4`  · 16:9
**Starter image:**
> The interior of a stone fabrication workshop, a CNC machine and slabs in warm low light,
> sparks of detail on tooling, industrial-precision but premium, empty of people. [STYLE BLOCK]
**Video:**
> Slow reveal gliding into the workshop past a slab toward the CNC bed; faint motion of a
> tool head resting, warm light pooling on the stone. [MOTION BLOCK]

---

# PART 2 — Material macro cards (portrait, hover previews) · 4:5 (~280×340)
Keep these four a tight consistent set — same camera distance and light, only the stone changes.

- `mat-granite.jpg` — *Macro of polished black-and-gold granite, dramatic veining and mineral flecks, warm raking light, dark studio backdrop.* [STYLE BLOCK]
- `mat-quartz.jpg` — *Macro of pristine white engineered quartz with fine grey veining, clean soft warm light, satin finish, dark backdrop.* [STYLE BLOCK]
- `mat-marble.jpg` — *Macro of white Carrara marble with soft flowing grey veining, cool surface under a warm key light, dark backdrop.* [STYLE BLOCK]
- `mat-quartzite.jpg` — *Macro of dramatic quartzite, white base with bold charcoal veining, warm raking light, dark backdrop.* [STYLE BLOCK]

---

# PART 3 — Before / After · 16:10
Same kitchen, same camera angle, twice, so the reveal lines up.

- `before.jpg` — *Wide shot of a dated, worn kitchen with tired laminate countertops and dim flat light, same framing as the "after".* [STYLE BLOCK]
- `after.jpg` — *The exact same kitchen from the identical angle, renovated with a new stone countertop and waterfall island, warm inviting light, brass fixtures, pristine.* [STYLE BLOCK]

---

# PART 4 — Gallery (mixed crops) · vary the framing
Same warm gallery lighting throughout. `work-1.jpg` … `work-9.jpg`:

1. `work-1.jpg` (tall 4:5) — *Waterfall-edge white quartz island, warm pendants, luxury modern kitchen.*
2. `work-2.jpg` (square) — *Granite counter with a full-height matching backsplash, book-matched veining.*
3. `work-3.jpg` (square) — *Elegant marble bathroom vanity with undermount sink and brass faucet.*
4. `work-4.jpg` (wide 16:9) — *Book-matched quartzite run with undermount sink, symmetrical veining.*
5. `work-5.jpg` (tall 4:5) — *Dark granite bar top under warm pendant lights, moody home bar.*
6. `work-6.jpg` (square) — *Bright white quartz island with seating, warm daylight, clean modern.*
7. `work-7.jpg` (square) — *Outdoor kitchen with granite countertop, warm evening light, patio setting.*
8. `work-8.jpg` (wide 16:9) — *Large marble kitchen island with waterfall ends, dramatic veining, luxury.*
9. `work-9.jpg` (tall 4:5) — *Quartzite fireplace surround or feature wall, warm light, statement piece.*

Append [STYLE BLOCK] to each.

---

# PART 5 — Product / brand cards & Visualizer cards
These currently use CSS color tints. To use photos instead, add `--photo` to each card and set
its background image (I can wire that for you). Slots · 4:5 or 3:4:

**Quartz brand cards** (studio slab macros in that brand's signature palette):
- `card-cambria.jpg` — *Macro of a Cambria-style natural quartz slab with fine sparkle and warm-grey veining, dark studio backdrop.* [STYLE BLOCK]
- `card-caesarstone.jpg` — *Macro of a Caesarstone-style engineered quartz slab, refined neutral tone, subtle veining.* [STYLE BLOCK]
- `card-silestone.jpg` — *Macro of a Silestone-style hybrid mineral surface, soft matte finish, muted palette.* [STYLE BLOCK]
- `card-q-msi.jpg` — *Macro of a trend-forward MSI-style quartz slab, clean white with delicate grey veining.* [STYLE BLOCK]

**Visualizer cards** (3:4):
- `viz-kitchen.jpg` — *A warm modern kitchen with a stone island, inviting light, room to overlay a label.* [STYLE BLOCK]
- `viz-bath.jpg` — *A spa-like bathroom with a marble vanity and brass fixtures, soft cool-warm light.* [STYLE BLOCK]
- `viz-stack.jpg` — *A stacked-stone accent wall (fireplace or exterior), textured ledgestone, warm grazing light.* [STYLE BLOCK]

---

# PART 6 — Extra motion + social
- **CNC process clip** → `cnc-fabrication.mp4` (for the Home "Process" area / any build section):
  **Starter image:** *A CNC stone-cutting machine mid-cut on a granite slab, water spray catching warm light, industrial precision, dark workshop.* [STYLE BLOCK]
  **Video:** *The CNC head moves slowly along its cut line, fine water mist drifting, sparks of light on the wet stone; steady top-down-ish angle.* [MOTION BLOCK]
- **Social share** → `og-cover.jpg` · 1200×630 — *Cinematic hero shot of honed dark granite with fine veining and warm brass accents, deep moody light, no text.* [STYLE BLOCK]

---

## Wiring a hero video into a page (I can do this for you)
The home hero already holds an `<img>`. To make any hero play a video, swap its background
media for:
```html
<video class="hero__img is-ready" autoplay muted loop playsinline
       poster="assets/img/hero-<page>.jpg">
  <source src="assets/img/hero-<page>.webm" type="video/webm">
  <source src="assets/img/hero-<page>.mp4"  type="video/mp4">
</video>
```
Inner pages (`.page-hero`) currently use a CSS-only background; adding a video there needs a
small markup + CSS tweak — ask me and I'll add a `.page-hero__video` slot to every inner page
so you only have to drop the files in.
