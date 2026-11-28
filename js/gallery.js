/* GALLERY LOGIC (owner: Obash)
   Click a photo -> full-screen viewer. Arrows / swipe / keyboard move through the photos, Esc or X closes.
   The viewer lives inside views/gallery.html, so it disappears with the screen. */
window.AW = window.AW || {};

AW.gallery = (function () {
  function init() {
    var $items = $('#galGrid .gal-item'), $v = $('#galViewer'), $img = $('#galImg'), $count = $('#galCount');
    if (!$items.length || !$v.length) return;
    var i = 0, opener = null, startX = null;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function draw(n, instant) {
      i = (n + $items.length) % $items.length;
      var $a = $items.eq(i), src = $a.attr('data-full'), alt = $a.find('img').attr('alt') || '';
      function put() { $img.attr({ src: src, alt: alt }); $count.text(pad(i + 1) + ' / ' + pad($items.length)); $img.removeClass('is-out'); }
      if (instant || AW.motion.reduced) return put();
      $img.addClass('is-out'); setTimeout(put, 220);
    }
    function open(n, from) {
      opener = from; draw(n, true);
      $v.prop('hidden', false); $('body').css('overflow', 'hidden');
      $v.find('.gal-x').trigger('focus');
    }
    function close() {
      $v.prop('hidden', true); $('body').css('overflow', '');
      if (opener) $(opener).trigger('focus');
    }

    $items.off('click.aw').on('click.aw', function (e) { e.preventDefault(); open($items.index(this), this); });
    $v.find('.gal-x').off('click.aw').on('click.aw', close);
    $v.find('.gal-prev').off('click.aw').on('click.aw', function () { draw(i - 1); });
    $v.find('.gal-next').off('click.aw').on('click.aw', function () { draw(i + 1); });
    $v.off('click.aw').on('click.aw', function (e) { if (e.target === this || $(e.target).is('.gal-stage')) close(); });

    $v.off('touchstart.aw touchend.aw')
      .on('touchstart.aw', function (e) { startX = e.originalEvent.touches[0].clientX; })
      .on('touchend.aw', function (e) {
        if (startX === null) return;
        var dx = e.originalEvent.changedTouches[0].clientX - startX; startX = null;
        if (Math.abs(dx) > 50) draw(i + (dx < 0 ? 1 : -1));
      });

    // keys work only while the viewer is open; the handler is replaced each time the screen loads
    $(document).off('keydown.gal').on('keydown.gal', function (e) {
      if ($v.prop('hidden') || !document.body.contains($v[0])) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') draw(i + 1);
      else if (e.key === 'ArrowLeft') draw(i - 1);
      else if (e.key === 'Tab') {   // keep focus inside the viewer
        var $f = $v.find('button'), first = $f[0], last = $f[$f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // leaving the screen with the viewer open (e.g. browser back) must not leave the page locked
    $(window).off('hashchange.gal').on('hashchange.gal', function () { $('body').css('overflow', ''); });
  }
  return { init: init };
})();
