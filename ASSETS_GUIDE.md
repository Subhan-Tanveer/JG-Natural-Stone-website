# JG Natural Stone — Image & Video Generation Guide

Every visual slot on the site maps to a file in `assets/img/`. Until you drop a real
file in, the site shows an intentional procedural-stone placeholder, so nothing looks
broken. Replace them one at a time.

**Global rules for every asset**
- Export **WebP** (with a JPG fallback if you like), **max ~100 KB each**, sRGB.
- Keep one lighting language across the whole set: **warm, low-key, gallery-lit stone on
  a dark backdrop**, a single soft key light raking across the surface to reveal veining.
- Brand accent to echo where natural: **warm brass `#C69A5B`** (a brass faucet, cabinet
  pull, or warm rim-light — never neon).
- Photoreal, editorial architecture-magazine finish. No text, no logos, no watermarks.

Recommended generator: any high-end text-to-image model (Midjourney v6+, Flux, Google
Imagen, DALL·E 3). Aspect ratios are noted per slot.

---

## ★ STARTER IMAGE + VIDEO (the hero) — do this one first

The hero is designed to hold **either a still or a looping muted video**. Generate the
still first; it doubles as the **starter frame** for the image-to-video step.

### 1. Hero starter image → `assets/img/hero-slab.jpg`  ·  aspect **16:9** (also export a 9:16 crop for mobile)

> Photorealistic cinematic close-up of a honed dark charcoal granite countertop slab in a
> luxury kitchen, fine silver-grey natural veining catching a single soft warm key light
> from the left, shallow depth of field, deep shadow falling off to the right into near
> black, subtle brass pendant light glowing warm out of focus in the background, moody
> low-key editorial architectural photography, rich matte stone texture, warm neutral
> color grade (#12100E shadows, #C69A5B warm highlights), no people, no text, ultra
> detailed, shot on 50mm, 16:9.

### 2. Hero video (image-to-video, using the starter image above) → `assets/img/hero.webm` / `hero.mp4`

Feed the starter image into an image-to-video model (Runway Gen-3, Luma Dream Machine,
Kling, Pika). Prompt:

> Slow cinematic push-in across a honed dark granite countertop, camera glides left to
> right revealing fine natural veining as the soft warm key light rakes across the polished
> surface; faint dust motes drift through a shaft of light; a brass pendant glows softly out
> of focus in the background. Extremely slow, steady, elegant motion. Muted, no people,
> seamless loop, 6–8 seconds, subtle and premium — no fast cuts, no camera shake.

Export **muted, ~6–8 s, seamless loop, <2 MB, 1080p**. To use it, swap the hero `<img>` in
`index.html` for a `<video autoplay muted loop playsinline poster="assets/img/hero-slab.jpg">`.

---

## Material previews (portrait cards that float on hover)  ·  aspect **4:5**, ~280×340

Keep these four as a tight, consistent set — same camera distance and light, only the
stone changes.

| File | Prompt |
|---|---|
| `mat-granite.jpg` | *Macro of polished black-and-gold granite slab, dramatic natural veining and mineral flecks, warm key light raking across, deep shadows, dark editorial studio backdrop, photoreal, 4:5.* |
| `mat-quartz.jpg` | *Macro of pristine white engineered quartz with fine grey veining, clean soft warm light, matte-to-satin finish, dark studio backdrop, photoreal, 4:5.* |
| `mat-marble.jpg` | *Macro of white Carrara marble with soft flowing grey veining, cool elegant surface lit by a warm key light, dark backdrop, photoreal, 4:5.* |
| `mat-quartzite.jpg` | *Macro of dramatic quartzite slab, marble-like white base with bold charcoal veining, warm raking light, dark studio backdrop, photoreal, 4:5.* |

---

## Before / After transformation  ·  aspect **16:10**

Shoot (or generate) the **same kitchen from the same angle** twice so the reveal lines up.

| File | Prompt |
|---|---|
| `before.jpg` | *Wide shot of a dated, worn kitchen with tired laminate countertops and dim lighting, same camera angle and framing as the "after", realistic, slightly flat cool light, 16:10.* |
| `after.jpg` | *The exact same kitchen from the identical angle, now renovated with a stunning new granite/quartz countertop and waterfall island, warm inviting lighting, brass fixtures, styled and pristine, photoreal, 16:10.* |

---

## Gallery — recent work  ·  mixed crops

Vary the crops so the masonry grid feels alive. Same warm gallery lighting throughout.

| File | Slot | Prompt |
|---|---|---|
| `work-1.jpg` | tall (4:5) | *Waterfall-edge white quartz kitchen island, warm pendant lighting, luxury modern kitchen, photoreal, vertical.* |
| `work-2.jpg` | square | *Granite kitchen counter with a full-height matching backsplash, book-matched veining, warm light, photoreal.* |
| `work-3.jpg` | square | *Elegant marble bathroom vanity top with undermount sink and brass faucet, soft warm light, photoreal.* |
| `work-4.jpg` | wide (16:9) | *Book-matched quartzite countertop run with undermount sink, dramatic symmetrical veining, warm kitchen light, photoreal, wide.* |
| `work-5.jpg` | tall (4:5) | *Dark granite bar top under warm pendant lights, moody upscale home bar, photoreal, vertical.* |
| `work-6.jpg` | square | *Bright white quartz kitchen island with seating, warm natural daylight, clean modern, photoreal.* |

---

## Social share  ·  aspect **1.91:1**  ·  `og-cover.jpg`

> Cinematic hero shot of a honed dark granite countertop with fine veining, warm brass
> accents, deep moody lighting, luxury kitchen, editorial, room for nothing else (no text),
> 1200×630.

---

### After you drop images in
No code change needed for the stills — filenames already match. For the hero video, make
the one `<img>` → `<video>` swap noted above. Then re-run and check the gallery for any
404s (there should be none — placeholders cover any gap).
