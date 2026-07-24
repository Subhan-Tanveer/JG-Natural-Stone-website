# JG Natural Stone LLC — Motion-First Website

A production-ready, motion-first marketing site for JG Natural Stone LLC (custom countertop
fabrication & installation, Fort Worth TX). Built as a self-contained static site with
world-class scroll animation.

## Design direction
**"Honed Stone & the Precision Cut."** Dark quarry-charcoal canvas so stone imagery reads
like gallery pieces, a single warm brass accent, and a CNC-precision motif throughout
(measurement rules, coordinate ticks, mono numerals). One signature moment: the scroll-driven
**before/after transformation** reveal.

- **Type:** Bricolage Grotesque (display) · Figtree (body) · Space Mono (data/labels)
- **Color:** quarry `#12100E` · brass `#C69A5B` · limestone `#E7E0D4` · bone `#F6F2E9`

## Tech
- **GSAP 3 + ScrollTrigger** — all scroll animation (reveals, pinning, scrub, parallax, counters)
- **Lenis** — smooth inertia scrolling site-wide
- Vanilla HTML/CSS/JS — no build step, no framework. Just open/serve `index.html`.

## Motion inventory
Preloader with animated counter · masked hero headline reveal · hero parallax · infinite
materials marquee (flips direction with scroll) · word-by-word scrub thesis · animated
stat counters · floating cursor-follow material previews · 4-step process with scrub rail ·
scroll + drag + keyboard before/after slider · parallax gallery with hover captions ·
staggered review cards · drifting footer wordmark · custom cursor · scroll progress bar.

## Run locally
Any static server works. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly also works, but a server
is recommended so relative asset paths and fonts resolve cleanly.)

## Pages (matches the live jgnaturalstone.com structure)
```
index.html          Home — hero, materials, process, before/after, reviews, CTA
products.html       Our Products — granite, quartz, marble, quartzite + quartz brands
granite.html        Granite detail — features, specs
quartz.html         Quartz detail — features, brands (Cambria/Caesarstone/Silestone/MSI), specs
gallery.html        Full project gallery + before/after slider
visualizers.html    Kitchen / Bathroom / Stacked Stone visualizer links
financing.html      Payment options + how-it-works
faq.html            Accordion FAQ
contact.html        Contact info + quote form
```
Every page shares one nav, footer, `css/style.css`, and `js/main.js`. The motion engine
is self-guarding — each animation only runs if its elements exist on the page.

## Files
```
css/style.css       Design system + all page-component styles
js/main.js          Lenis + GSAP motion system (Home, inner pages, FAQ, forms)
assets/img/         Drop real photos/video here (see ASSETS_GUIDE.md)
ASSETS_GUIDE.md     Image + video generation prompts for every slot
```

## Things to confirm before publishing
- **Visualizer links** in `visualizers.html` point at the client's existing tool pages —
  update if those URLs change.
- **Financing** terms/partner in `financing.html` are placeholder copy — confirm real offers.

## Before you ship — checklist
- [ ] Add real images/video per **ASSETS_GUIDE.md** (WebP, <100 KB each). Placeholders show until then.
- [ ] Wire the quote form to a real backend / email service. It currently validates and opens
      a pre-filled `mailto:office@jgnaturalstone.com`. For reliable delivery use Formspree,
      Netlify Forms, or your CRM endpoint — replace the `setTimeout`/`mailto` block in
      `js/main.js → initForm()`.
- [ ] Self-host GSAP + Lenis (currently CDN) if you want zero external requests.
- [ ] Run Lighthouse — target all green. LCP < 2.5s, INP < 200ms, CLS < 0.1.
- [ ] Test on real iOS & Android; confirm `tel:` dials and smooth scroll feels good on 4G.

## Accessibility & performance
- `prefers-reduced-motion` fully respected — animations snap to final state, smooth scroll off.
- Keyboard-navigable, visible focus, ARIA labels, alt text, semantic landmarks.
- Lazy-loaded gallery images, `transform`/`opacity`-only animations, tabular-nums counters.

## Contact
Jorge Gonzalez, President · office@jgnaturalstone.com · 817 741 8454
