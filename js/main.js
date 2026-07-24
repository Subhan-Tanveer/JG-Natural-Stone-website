/* =========================================================
   JG NATURAL STONE — motion system
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DESKTOP = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  function runPreloader(done) {
    const el = document.getElementById('preloader');
    const fill = document.getElementById('preFill');
    const count = document.getElementById('preCount');
    if (!el) { done(); return; }          // sub-pages have no preloader
    if (REDUCED) {
      el.style.display = 'none';
      done();
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100, duration: 1.6, ease: 'power2.out',
      onUpdate() {
        const p = Math.round(obj.v);
        count.textContent = p;
        gsap.set(fill, { scaleX: obj.v / 100 });
      },
      onComplete() {
        gsap.to(el, {
          yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.15,
          onComplete() { el.style.display = 'none'; done(); }
        });
      }
    });
  }

  /* ---------------------------------------------------------
     LENIS SMOOTH SCROLL
  --------------------------------------------------------- */
  let lenis = null;
  function initLenis() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -10, duration: 1.2 });
    else gsap.to(window, { duration: 0.8, scrollTo: { y: target, offsetY: 10 } });
  }

  /* ---------------------------------------------------------
     IMAGE FALLBACKS — swap to procedural stone if photo 404s
  --------------------------------------------------------- */
  const STONE_BG = [
    'linear-gradient(135deg,#2a231d,#3a3128 45%,#241d18)',
    'linear-gradient(160deg,#20242a,#2c3038 50%,#181b20)',
    'linear-gradient(135deg,#e7e0d4,#cfc6b6 50%,#b7ad9c)',
    'linear-gradient(140deg,#33291f,#4a3b2a 55%,#241c14)'
  ];
  function handleImages() {
    document.querySelectorAll('img').forEach((img, i) => {
      const ready = () => img.classList.add('is-ready');
      const fail = () => {
        img.style.background = STONE_BG[i % STONE_BG.length];
        img.style.opacity = 1;
        img.removeAttribute('alt-hidden');
        img.dataset.fallback = '1';
        // keep alt for a11y; render an intentional stone panel
        img.style.minHeight = img.style.minHeight || '100%';
        img.src = 'data:image/svg+xml,' + encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='4' height='4' fill='transparent'/></svg>");
      };
      if (img.complete && img.naturalWidth > 0) ready();
      else { img.addEventListener('load', ready); img.addEventListener('error', fail); }
    });
  }

  /* ---------------------------------------------------------
     HERO VIDEO (inner pages) — fade in once playable; pause + hide
     under prefers-reduced-motion (procedural fallback shows instead)
  --------------------------------------------------------- */
  function initHeroVideo() {
    const videos = document.querySelectorAll('video.page-hero__video');
    videos.forEach(v => {
      const ready = () => v.classList.add('is-ready');
      if (v.readyState >= 2) ready();
      else v.addEventListener('loadeddata', ready, { once: true });
      // on error, leave it hidden (opacity 0) — the procedural stone
      // background behind it already reads as an intentional layer
      v.addEventListener('error', () => v.classList.remove('is-ready'), { once: true });
      if (REDUCED) {
        v.pause();
        v.removeAttribute('autoplay');
        v.classList.remove('is-ready');
      }
    });
  }

  /* ---------------------------------------------------------
     HERO VIDEO PLAYLIST (home page) — plays every hero clip back to
     back with zero gap. Two <video> elements swap the "active" role;
     whichever is idle silently preloads the NEXT clip while the other
     plays, so by the time the current clip fires 'ended' the next one
     is already buffered and starts instantly.
  --------------------------------------------------------- */
  function initHeroPlaylist() {
    const stage = document.getElementById('heroVideoStage');
    if (!stage) return;
    const vidA = document.getElementById('heroVideoA');
    const vidB = document.getElementById('heroVideoB');
    if (!vidA || !vidB) return;

    const ORDER = ['hero-home', 'hero-products', 'hero-granite', 'hero-quartz',
      'hero-gallery', 'hero-visualizers', 'hero-financing', 'hero-faq', 'hero-contact'];
    const srcFor = name => `assets/img/${name}.mp4`;

    if (REDUCED) {
      // Show a single static frame — no playlist, no autoplay.
      vidA.src = srcFor(ORDER[0]);
      vidA.addEventListener('loadeddata', () => vidA.classList.add('is-ready'), { once: true });
      return;
    }

    let idx = 0;
    let active = vidA;
    let standby = vidB;

    function preloadNext() {
      const nextName = ORDER[(idx + 1) % ORDER.length];
      standby.src = srcFor(nextName);
      standby.load();
    }

    function playActive() {
      active.classList.add('is-ready');
      standby.classList.remove('is-ready');
      const p = active.play();
      if (p && p.catch) p.catch(() => {}); // ignore autoplay-blocked rejections
      preloadNext();
    }

    function advance() {
      idx = (idx + 1) % ORDER.length;
      const prevActive = active;
      active = standby;
      standby = prevActive;
      playActive();
    }

    vidA.addEventListener('ended', advance);
    vidB.addEventListener('ended', advance);
    // if a clip errors mid-playlist, skip straight to the next one
    vidA.addEventListener('error', advance);
    vidB.addEventListener('error', advance);

    active.src = srcFor(ORDER[0]);
    active.addEventListener('loadeddata', playActive, { once: true });
    active.load();
  }

  /* ---------------------------------------------------------
     PAGE TRANSITION — brand curtain wipe between pages
     Outgoing page: panel slides in from the LEFT to cover.
     Incoming page: panel (covering by default) slides out RIGHT.
  --------------------------------------------------------- */
  function initPageTransition() {
    const wrap = document.getElementById('pageTransition');
    if (!wrap) return;

    // Restore from bfcache (back/forward): the curtain may have been left
    // in its covering state — re-run the reveal so content shows.
    window.addEventListener('pageshow', e => {
      if (!e.persisted) return;
      wrap.classList.remove('is-covering');
      wrap.style.animation = 'none';
      void wrap.offsetWidth;            // force reflow to restart the reveal
      wrap.style.animation = '';
    });

    if (REDUCED) return;               // CSS hides the panel; navigate normally

    const isInternal = a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') ||
          href.startsWith('mailto:') || a.hasAttribute('download')) return false;
      if (a.target && a.target !== '_self') return false;
      let url;
      try { url = new URL(a.href, location.href); } catch (_) { return false; }
      if (url.origin !== location.origin) return false;          // external
      if (url.href === location.href) return false;              // same page
      if (url.pathname === location.pathname && url.hash) return false; // in-page anchor
      return true;
    };

    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a || !isInternal(a)) return;
      e.preventDefault();
      const dest = a.href;
      if (lenis) lenis.stop();
      wrap.classList.add('is-covering');            // slide in from the left
      // navigate once the panel has fully covered the screen
      setTimeout(() => { window.location.href = dest; }, 600);
    });
  }

  /* ---------------------------------------------------------
     NAV + BURGER
  --------------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');

    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: self => nav.classList.toggle('is-scrolled', self.scroll() > 60)
    });

    let open = false;
    const toggle = force => {
      open = typeof force === 'boolean' ? force : !open;
      nav.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open && REDUCED ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());

    // smooth anchor scroll (all in-page links)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        if (open) toggle(false);
        setTimeout(() => scrollTo(t), open ? 350 : 0);
      });
    });
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  function initCursor() {
    if (!DESKTOP || REDUCED) return;
    const dot = document.getElementById('cursor');
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll('[data-cursor], a, button').forEach(el => {
      const label = el.getAttribute('data-cursor');
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
        if (label) dot.setAttribute('data-label', label);
      });
      el.addEventListener('mouseleave', () => { dot.classList.remove('is-hover'); dot.removeAttribute('data-label'); });
    });
  }

  /* ---------------------------------------------------------
     SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  function initProgress() {
    const bar = document.getElementById('scrollProgress');
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  /* ---------------------------------------------------------
     HERO INTRO
  --------------------------------------------------------- */
  function initHero() {
    if (REDUCED || !document.querySelector('.hero')) return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from('.hero__title .line > span', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.2)
      .from('.hero__lede', { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero__actions', { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero__foot > *', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }, '-=0.5');

    // parallax on hero media
    gsap.to('.hero__media', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__content', {
      yPercent: -12, opacity: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------------------------------------------------------
     INNER-PAGE HERO — load-in reveal
  --------------------------------------------------------- */
  function initPageHero() {
    const ph = document.querySelector('.page-hero');
    if (!ph || REDUCED) return;
    const tl = gsap.timeline({ delay: 0.05 });
    tl.from(ph.querySelectorAll('.page-hero__title .line > span'),
        { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.1 })
      .from(ph.querySelector('.breadcrumb'), { y: 14, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.1)
      .from(ph.querySelector('.page-hero__eyebrow'), { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.15)
      .from(ph.querySelector('.page-hero__lede'), { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
  }

  /* ---------------------------------------------------------
     FAQ ACCORDION
  --------------------------------------------------------- */
  function initFaq() {
    const items = gsap.utils.toArray('.faq__item');
    if (!items.length) return;
    items.forEach(item => {
      const q = item.querySelector('.faq__q');
      const a = item.querySelector('.faq__a');
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        const open = item.classList.contains('is-open');
        // close siblings
        items.forEach(other => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
            if (REDUCED) other.querySelector('.faq__a').style.height = '0px';
            else gsap.to(other.querySelector('.faq__a'), { height: 0, duration: 0.4, ease: 'power2.inOut' });
          }
        });
        item.classList.toggle('is-open', !open);
        q.setAttribute('aria-expanded', String(!open));
        const target = !open ? a.querySelector('.faq__a-inner').offsetHeight : 0;
        if (REDUCED) a.style.height = target + 'px';
        else gsap.to(a, { height: target, duration: 0.45, ease: 'power2.inOut',
          onComplete: () => { if (!open) a.style.height = 'auto'; } });
      });
    });
  }

  /* ---------------------------------------------------------
     MARQUEE — seamless loop, direction flips with scroll
  --------------------------------------------------------- */
  function initMarquee() {
    const track = document.getElementById('marquee');
    if (!track) return;
    const half = track.scrollWidth / 2;
    const loop = gsap.to(track, {
      x: -half, duration: 22, ease: 'none', repeat: -1,
      modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % half) }
    });
    if (REDUCED) { loop.pause(); return; }
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const dir = self.direction;
        gsap.to(loop, { timeScale: dir, duration: 0.4, overwrite: true });
      }
    });
  }

  /* ---------------------------------------------------------
     GENERIC REVEALS
  --------------------------------------------------------- */
  function initReveals() {
    if (REDUCED) return;

    // simple fade-up
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.from(el, {
        y: 34, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // headline line masks
    gsap.utils.toArray('.reveal-lines').forEach(block => {
      const lines = block.querySelectorAll('br') ? splitBr(block) : [block];
      gsap.from(lines, {
        yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12,
        scrollTrigger: { trigger: block, start: 'top 82%' }
      });
    });

    // section eyebrows
    gsap.utils.toArray('.section-head__eyebrow').forEach(el => {
      gsap.from(el, { x: -20, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  }

  // wrap each visual line (split on <br>) in an overflow-hidden mask
  function splitBr(el) {
    const html = el.innerHTML;
    if (!/<br\s*\/?>/i.test(html)) {
      const span = document.createElement('span');
      span.style.display = 'block';
      span.innerHTML = html;
      el.innerHTML = '';
      const mask = document.createElement('span');
      mask.style.cssText = 'display:block;overflow:hidden';
      mask.appendChild(span);
      el.appendChild(mask);
      return [span];
    }
    const parts = html.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    return parts.map(p => {
      const mask = document.createElement('span');
      mask.style.cssText = 'display:block;overflow:hidden';
      const span = document.createElement('span');
      span.style.display = 'block';
      span.innerHTML = p;
      mask.appendChild(span);
      el.appendChild(mask);
      return span;
    });
  }

  /* ---------------------------------------------------------
     THESIS — word-by-word scrub reveal
  --------------------------------------------------------- */
  function initThesis() {
    const el = document.getElementById('thesisText');
    if (!el) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    if (REDUCED) { el.querySelectorAll('.w').forEach(w => w.style.opacity = 1); return; }
    gsap.to(el.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 62%', scrub: true }
    });
  }

  /* ---------------------------------------------------------
     COUNTERS
  --------------------------------------------------------- */
  function initCounters() {
    gsap.utils.toArray('.stat__num').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const set = v => { el.textContent = v.toFixed(dec) + suffix; };
      if (REDUCED) { set(target); return; }
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to(obj, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: () => set(obj.v) })
      });
    });
  }

  /* ---------------------------------------------------------
     MATERIALS — floating image preview follows cursor
  --------------------------------------------------------- */
  function initMaterials() {
    const preview = document.getElementById('matPreview');
    const previewImg = document.getElementById('matPreviewImg');
    if (!preview) return;
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
    if (DESKTOP && !REDUCED) {
      window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
    }
    document.querySelectorAll('.mat').forEach(mat => {
      mat.addEventListener('mouseenter', () => {
        if (!DESKTOP || REDUCED) return;
        previewImg.src = mat.dataset.img;
        preview.classList.add('is-on');
      });
      mat.addEventListener('mouseleave', () => preview.classList.remove('is-on'));
    });
    // reveal rows
    if (!REDUCED) {
      gsap.utils.toArray('.mat').forEach(m => {
        gsap.from(m, { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: m, start: 'top 88%' } });
      });
    }
  }

  /* ---------------------------------------------------------
     PROCESS — rail fill + stepped reveal
  --------------------------------------------------------- */
  function initProcess() {
    const fill = document.getElementById('railFill');
    if (fill && !REDUCED) {
      gsap.to(fill, { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });
    }
    gsap.utils.toArray('.step').forEach((step, i) => {
      ScrollTrigger.create({ trigger: step, start: 'top 80%', onEnter: () => step.classList.add('is-in') });
      if (!REDUCED) {
        gsap.from(step, { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.06,
          scrollTrigger: { trigger: step, start: 'top 84%' } });
      }
    });
  }

  /* ---------------------------------------------------------
     BEFORE / AFTER — scroll-scrub + drag + keyboard
  --------------------------------------------------------- */
  function initBeforeAfter() {
    const ba = document.getElementById('ba');
    const clip = document.getElementById('baClip');
    const divider = document.getElementById('baDivider');
    const handle = document.getElementById('baHandle');
    if (!ba) return;

    const setPos = p => {
      p = Math.max(0, Math.min(100, p));
      clip.style.width = p + '%';
      divider.style.left = p + '%';
      handle.setAttribute('aria-valuenow', Math.round(p));
    };
    setPos(50);

    // scroll-scrub sweep 30% -> 70% as section crosses viewport
    if (!REDUCED) {
      const obj = { p: 30 };
      gsap.to(obj, {
        p: 72, ease: 'none',
        scrollTrigger: { trigger: ba, start: 'top 80%', end: 'bottom 30%', scrub: 0.8,
          onUpdate: () => { if (!dragging) setPos(obj.p); } }
      });
    }

    // drag
    let dragging = false;
    const rectPos = clientX => {
      const r = ba.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };
    const start = () => { dragging = true; ba.style.cursor = 'ew-resize'; if (lenis) lenis.stop(); };
    const end = () => { dragging = false; ba.style.cursor = ''; if (lenis && !menuOpen()) lenis.start(); };
    const move = clientX => { if (dragging) setPos(rectPos(clientX)); };

    handle.addEventListener('mousedown', start);
    ba.addEventListener('mousedown', e => { start(); setPos(rectPos(e.clientX)); });
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', start, { passive: true });
    ba.addEventListener('touchmove', e => { if (dragging) setPos(rectPos(e.touches[0].clientX)); }, { passive: true });
    window.addEventListener('touchend', end);

    // keyboard
    handle.addEventListener('keydown', e => {
      const cur = parseFloat(handle.getAttribute('aria-valuenow'));
      if (e.key === 'ArrowLeft') { setPos(cur - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(cur + 4); e.preventDefault(); }
    });

    function menuOpen() { return document.getElementById('menu').classList.contains('is-open'); }
  }

  /* ---------------------------------------------------------
     GALLERY PARALLAX
  --------------------------------------------------------- */
  function initGallery() {
    if (REDUCED) return;
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const inner = el.matches('.shot') ? el.querySelector('img') : el;
      const amt = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(inner, { yPercent: -amt * 60 }, {
        yPercent: amt * 60, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.utils.toArray('.shot').forEach(s => {
      gsap.from(s, { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: s, start: 'top 88%' } });
    });
    gsap.utils.toArray('.review').forEach((r, i) => {
      gsap.from(r, { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.08,
        scrollTrigger: { trigger: '.reviews__grid', start: 'top 82%' } });
    });
  }

  /* ---------------------------------------------------------
     FOOTER wordmark drift
  --------------------------------------------------------- */
  function initFooter() {
    if (REDUCED) return;
    gsap.fromTo('.footer__big', { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
  }

  /* ---------------------------------------------------------
     FORM
  --------------------------------------------------------- */
  function initForm() {
    const form = document.getElementById('qform');
    const note = document.getElementById('qnote');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const material = form.material.value;
      if (!name || !phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !material) {
        note.textContent = 'Please add your name, a valid email, phone, and material.';
        note.className = 'qform__note err';
        return;
      }
      // Front-end demo submit. Wire to a backend / email service (office@jgnaturalstone.com) in production.
      const btn = document.getElementById('qsubmit');
      btn.querySelector('span').textContent = 'Sending…';
      const subject = encodeURIComponent('Quote request — ' + name);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMaterial: ${material}\n\n${form.message.value.trim()}`);
      setTimeout(() => {
        note.textContent = 'Thanks, ' + name.split(' ')[0] + '! Opening your email to send…';
        note.className = 'qform__note ok';
        btn.querySelector('span').textContent = 'Request my free quote';
        window.location.href = `mailto:office@jgnaturalstone.com?subject=${subject}&body=${body}`;
        form.reset();
      }, 700);
    });
  }

  /* ---------------------------------------------------------
     BOOT
  --------------------------------------------------------- */
  function boot() {
    handleImages();
    initHeroVideo();
    initHeroPlaylist();
    initLenis();
    initPageTransition();
    initNav();
    initCursor();
    initProgress();
    initHero();
    initPageHero();
    initFaq();
    initMarquee();
    initReveals();
    initThesis();
    initCounters();
    initMaterials();
    initProcess();
    initBeforeAfter();
    initGallery();
    initFooter();
    initForm();
    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // Boot exactly once, no matter which trigger wins.
  let booted = false;
  function safeBoot() {
    if (booted) return;
    booted = true;
    const el = document.getElementById('preloader');
    if (el) el.style.display = 'none';
    boot();
  }

  document.addEventListener('DOMContentLoaded', () => {
    runPreloader(safeBoot);
    // Failsafe: if the intro tween stalls (throttled tab, slow CDN), boot anyway.
    setTimeout(safeBoot, 4000);
  });
})();
