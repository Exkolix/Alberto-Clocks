/* SCROLL MOTION (owner: Obash)
   1. Reveal   - .reveal / .reveal-img / .reveal-seq / .split animate in once when they enter the screen
   2. Parallax - [data-parallax] images drift at a different speed from the page
   3. Stage    - hero + collections share one video: as you scroll it DIMS, then PAUSES
   4. Scene    - "Our Collections" is a pinned scroll scene in TWO PARTS that follows the scrollbar both ways:
                   part 1: the heading appears alone on the dimmed video
                   part 2: ONE step - the heading moves up and the 3 cards slide in one after another (timed, ease-out)
                 Scrolling back up reverses it, so it plays every time.
   5. Progress - the thin gold line under the header fills as you scroll
   Everything switches off if the visitor has "reduce motion" set in their system. */
window.AW = window.AW || {};

AW.motion = (function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null, parallax = [], stage = {}, scene = {}, ticking = false, bar = null, header = null;
  var DIM_DONE = 0.85;          // how far through the dim the video counts as "dimmed and paused"

  // the scene: part 1 = heading alone (follows the scroll a little), part 2 = ONE timed step at STEP
  var HEAD_IN = [0.00, 0.30];   // part 1: heading fades in
  var STEP = 0.40;              // scroll position (0..1 of the pinned scroll) where part 2 plays
  var CARD_START = 0.32, CARD_GAP = 0.13, CARD_LEN = 0.24;   // only used when NOT pinned (phones)

  function show(el) { el.classList.add('in'); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function easeOut(u) { return 1 - Math.pow(1 - u, 3); }
  function span(t, a, b) { return clamp((t - a) / (b - a)); }

  function refresh(root) {
    root = root || document;
    if (io) io.disconnect();
    var els = Array.prototype.slice.call(root.querySelectorAll('.reveal, .reveal-img, .reveal-seq, .split'));

    stage = { hero: root.querySelector('[data-hero]'), content: root.querySelector('[data-hero-content]'), cue: root.querySelector('.hero-cue'),
              dim: root.querySelector('[data-stage-dim]'), video: root.querySelector('.hero-video'), pausedByUs: false };

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(show);
      if (stage.dim) stage.dim.style.opacity = '0.6';
    } else {
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
    // how far the heading must sit below its final spot so that it starts in the middle of the screen
    var centre = scene.head.offsetTop + scene.head.offsetHeight / 2;
    scene.drop = Math.max(0, scene.pin.clientHeight / 2 - centre);
  }

  function put(el, u, rise) {          // u: 0..1 progress, rise: how far (px) it starts below its place
    el.style.opacity = u.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - u) * rise).toFixed(1) + 'px,0)';
    el.style.pointerEvents = u > 0.6 ? 'auto' : 'none';
  }

  function updateScene(vh) {
    var hdr = header ? header.offsetHeight : 64, i;
    if (reduced) {
      scene.head.style.opacity = 1;
      scene.cards.forEach(function (c) { c.style.opacity = 1; });
      return;
    }
    if (scene.pinned) {
      // ----- pinned: both parts are driven by how far we have scrolled inside the scene -----
      var r = scene.el.getBoundingClientRect();
      var range = r.height - scene.pin.offsetHeight;
      var t = range > 0 ? clamp((hdr - r.top) / range) : 1;
      var inU = easeOut(span(t, HEAD_IN[0], HEAD_IN[1]));
      var on = t >= STEP;                       // one step: heading moves up, cards slide in (CSS timing in home.css)
      scene.head.style.opacity = inU.toFixed(3);
      scene.head.style.transform = 'translate3d(0,' + ((on ? 0 : scene.drop) + (1 - inU) * 40).toFixed(1) + 'px,0)';
      for (i = 0; i < scene.cards.length; i++) {
        var c = scene.cards[i];
        c.style.setProperty('--ci', i);
        c.style.opacity = on ? 1 : 0;
        c.style.transform = 'translate3d(0,' + (on ? 0 : 150) + 'px,0)';
        c.style.pointerEvents = on ? 'auto' : 'none';
      }
    } else {
      // ----- not pinned (phones, short screens): each item follows its own position on the screen -----
      var h = scene.head.getBoundingClientRect();
      put(scene.head, easeOut(clamp((vh * 0.95 - h.top) / (vh * 0.3))), 40);
      scene.head.style.transform = 'translate3d(0,' + ((1 - easeOut(clamp((vh * 0.95 - h.top) / (vh * 0.3)))) * 40).toFixed(1) + 'px,0)';
      for (i = 0; i < scene.cards.length; i++) {
        var b = scene.cards[i].getBoundingClientRect();
        put(scene.cards[i], easeOut(clamp((vh * 0.96 - b.top) / (vh * 0.34))), 110);
      }
    }
  }

  function update() {
    ticking = false;
    var y = window.pageYOffset, vh = window.innerHeight;

    if (!bar) bar = document.querySelector('.scroll-progress');
    if (!header) header = document.querySelector('.site-header');
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    if (scene.el) updateScene(vh);
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
