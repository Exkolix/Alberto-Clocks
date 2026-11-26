/* HOME SCREEN LOGIC (owner: Obash) - draws the Featured carousel from the JSON and starts the hero video. */
window.AW = window.AW || {};

AW.home = (function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function featured() {
    AW.data.load().then(function (d) {
      var list = d.watches.filter(function (w) { return w.featured; });
      var $row = $('#featuredRow');
      $row.html(list.map(function (w, i) {
        return '<article class="fcard reveal-seq" style="--i:' + (i % 4) + '">' +
          '<a class="watch-card" href="#/products?line=' + w.lineup + '" data-watch="' + w.id + '">' +
          '<div class="watch-img"><img src="' + w.image + '" alt="' + esc(w.name) + '" loading="lazy"></div>' +
          '<div class="watch-text"><h3 class="watch-name">' + esc(w.name) + '</h3><p class="watch-desc">' + esc(w.description) + '</p></div>' +
          '</a></article>';
      }).join(''));

      // click a card -> popup (the link underneath is only a fallback)
      $row.off('click.aw').on('click.aw', '.watch-card', function (e) { e.preventDefault(); AW.popup.open($(this).data('watch')); });

      // arrows
      var row = $row[0], $prev = $('#fPrev'), $next = $('#fNext');
      function step() { var c = row.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : row.clientWidth * 0.8; }
      function sync() {
        $prev.prop('disabled', row.scrollLeft <= 2);
        $next.prop('disabled', row.scrollLeft + row.clientWidth >= row.scrollWidth - 2);
      }
      $prev.off('click.aw').on('click.aw', function () { row.scrollBy({ left: -step(), behavior: 'smooth' }); });
      $next.off('click.aw').on('click.aw', function () { row.scrollBy({ left: step(), behavior: 'smooth' }); });
      $row.off('scroll.aw').on('scroll.aw', sync);
      sync();

      AW.motion.refresh(document.getElementById('app'));
    });
  }

  function hero() {
    var v = document.querySelector('.hero-video');
    if (!v || AW.motion.reduced) return;               // reduced motion: keep the still poster
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }

  function init() { featured(); hero(); }
  return { init: init };
})();
