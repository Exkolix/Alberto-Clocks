/* SCROLL MOTION (owner: Obash)
   1. Reveal   - .reveal / .reveal-img / .reveal-seq / .split animate in once when they enter the screen
                 (inside a [data-play-in-view] block they wait and play together once it is ~60% in view)
   2. Parallax - [data-parallax] images drift at a different speed from the page
   3. Stage    - hero + collections share one video: as you scroll it DIMS, then PAUSES
   4. Scene    - "Our Collections" (desktop only) is pinned on the dimmed video. At STEP the heading fades in and the 3 cards
                 slide up from the bottom (timed in home.css: ease-out, cards 1 and 2 together, 3 a touch later).
                 It then simply stays pinned until the scroll is used up and scrolls away normally. Scrolling back up reverses it.
                 On phones and short screens there is NO animation: the section is static.
   5. Progress - the thin gold line under the header fills as you scroll
   Everything switches off if the visitor has "reduce motion" set in their system. */
window.AW = window.AW || {};

AW.motion = (function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null, io2 = null, parallax = [], stage = {}, scene = {}, ticking = false, bar = null, header = null;
  var DIM_DONE = 0.85;          // how far through the dim the video counts as "dimmed and paused"

  // the scene: the pinned scroll is 104vh long (css .collections height = stage + 104vh)
  var STEP = 0.135;             // where the heading fades in and the cards slide up, about 14vh into the pinned scroll

  function show(el) { el.classList.add('in'); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function easeOut(u) { return 1 - Math.pow(1 - u, 3); }
  function span(t, a, b) { return clamp((t - a) / (b - a)); }

  function refresh(root) {
    root = root || document;
    if (io) io.disconnect();
    if (io2) io2.disconnect();
    var all = Array.prototype.slice.call(root.querySelectorAll('.reveal, .reveal-img, .reveal-seq, .split'));
    // [data-play-in-view]: everything inside waits and plays together once the block is (nearly) fully on screen
    var held = Array.prototype.slice.call(root.querySelectorAll('[data-play-in-view]'));
    var els = all.filter(function (e) { return !held.some(function (h) { return h.contains(e); }); });

    stage = { hero: root.querySelector('[data-hero]'), content: root.querySelector('[data-hero-content]'), cue: root.querySelector('.hero-cue'),
              dim: root.querySelector('[data-stage-dim]'), video: root.querySelector('.hero-video'), pausedByUs: false };

    if (reduced || !('IntersectionObserver' in window)) {
      all.forEach(show);
      if (stage.dim) stage.dim.style.opacity = '0.6';
    } else {
      // full-view trigger: 60% of the block visible, or the block fills 60% of the screen height (phones, where it is taller)
      io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var rb = en.rootBounds, tall = rb && en.intersectionRect.height >= rb.height * 0.6;
          if (!en.isIntersecting || (en.intersectionRatio < 0.6 && !tall)) return;
          io2.unobserve(en.target);
          Array.prototype.slice.call(en.target.querySelectorAll('.reveal, .reveal-img, .reveal-seq, .split')).forEach(show);
        });
      }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
      held.forEach(function (h) { if (!h.querySelector('.reveal-seq.in')) io2.observe(h); });
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target); show(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach(function (e) { if (!e.classList.contains('in')) io.observe(e); });
    }
    parallax = Array.prototype.slice.call(root.querySelectorAll('[data-parallax]'));
    setupScene(root);
    update();
  }

  function setupScene(root) {
    scene = { el: root.querySelector('[data-scene]') };
    if (!scene.el) return;
    scene.pin = scene.el.querySelector('[data-scene-pin]');
    scene.head = scene.el.querySelector('[data-scene-head]');
    scene.cards = Array.prototype.slice.call(scene.el.querySelectorAll('[data-scene-card]'));
    measureScene();
  }
  function measureScene() {
    if (!scene.el) return;
    scene.pinned = getComputedStyle(scene.pin).position === 'sticky';
    scene.el.classList.toggle('is-pinned', scene.pinned);
    scene.cardDrop = scene.pin.clientHeight + 40;   // far enough that a card starts fully below the pin (which clips it)
  }

  function updateScene() {
    var hdr = header ? header.offsetHeight : 64, i;
    if (reduced || !scene.pinned) {
      // phones, short screens, reduced motion: no animation at all, the section is simply there
      scene.head.style.opacity = ''; scene.head.style.transform = '';
      scene.cards.forEach(function (c) { c.style.opacity = ''; c.style.transform = ''; c.style.pointerEvents = ''; });
      return;
    }
    // ----- pinned (desktop): one step at STEP, driven by how far we have scrolled -----
    var r = scene.el.getBoundingClientRect();
    var range = r.height - scene.pin.offsetHeight;
    var t = range > 0 ? clamp((hdr - r.top) / range) : 1;
    var on = t >= STEP;                         // heading fades in + cards slide up (CSS timing in home.css)
    scene.head.style.opacity = on ? 1 : 0;
    for (i = 0; i < scene.cards.length; i++) {
      var c = scene.cards[i];
      c.style.opacity = 1;                      // no fade on the cards: each is below the pin until it slides up
      c.style.transform = 'translate3d(0,' + (on ? 0 : scene.cardDrop) + 'px,0)';
      c.style.pointerEvents = on ? 'auto' : 'none';
    }
  }

  function update() {
    ticking = false;
    var y = window.pageYOffset, vh = window.innerHeight;

    if (!bar) bar = document.querySelector('.scroll-progress');
    if (!header) header = document.querySelector('.site-header');
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    if (scene.el) updateScene();
    if (reduced) return;

    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i], box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -250 || box.top > vh + 250) continue;
      var offset = box.top + box.height / 2 - vh / 2;
      el.style.transform = 'translate3d(0,' + (-offset * parseFloat(el.getAttribute('data-parallax'))).toFixed(1) + 'px,0)';
    }

    if (stage.hero) {
      var h = stage.hero.offsetHeight;
      // hero text drifts up and fades
      if (y < h * 1.1 && stage.content) {
        stage.content.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        var fade = Math.max(0, 1 - (y / h) * 1.5).toFixed(3);
        stage.content.style.opacity = fade;
        if (stage.cue) stage.cue.style.opacity = fade;
      }
      // video dims, then pauses (and plays again if you scroll back up)
      var p = Math.min(1, Math.max(0, y / (h * 0.55)));
      if (stage.dim) stage.dim.style.opacity = (p * 0.78).toFixed(3);
      var done = p >= DIM_DONE, v = stage.video;
      if (v) {
        if (done && !v.paused) { v.pause(); stage.pausedByUs = true; }
        else if (!done && stage.pausedByUs) { stage.pausedByUs = false; var r = v.play(); if (r && r.catch) r.catch(function () {}); }
      }
    }
  }

  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measureScene(); onScroll(); });

  return { refresh: refresh, reduced: reduced };
})();
