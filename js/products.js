/* PRODUCTS SCREEN LOGIC (owner: Obash)
   Draws the watch grid from the JSON and runs the filters: collection checkboxes, price slider, sort.
   The address keeps in step (#/products?line=luxury,smart), so a filtered view can be shared or bookmarked. */
window.AW = window.AW || {};

AW.products = (function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function init(params) {
    var $grid = $('#productGrid');
    if (!$grid.length) return;

    AW.data.load().then(function (d) {
      var watches = d.watches, lineups = d.lineups;
      var prices = watches.map(function (w) { return w.price; });
      var min = Math.min.apply(null, prices), max = Math.max.apply(null, prices);
      var $boxes = $('[data-line]'), $range = $('#priceRange'), $out = $('#priceOut'), $sort = $('#sortBy');
      var lastKey = null, timer = null;

      // start from the address: #/products?line=luxury or ?line=vintage,smart
      var start = (params && params.get('line') || '').split(',');
      $boxes.each(function () { this.checked = start.indexOf($(this).data('line')) > -1; });

      // the price slider is logarithmic (a smartwatch and a tourbillon sit far apart), the top always means "all prices"
      function cap() {
        var v = +$range.val();
        if (v >= 100) return max;
        var p = min * Math.pow(max / min, v / 100), step = p >= 10000 ? 500 : p >= 1000 ? 100 : 10;
        return Math.ceil(p / step) * step;
      }
      function selected() { return $boxes.filter(':checked').map(function () { return $(this).data('line'); }).get(); }

      function card(w, i, reveal) {
        return '<article' + (reveal ? ' class="reveal-seq" style="--i:' + (i % 3) + '"' : '') + '>' +
          '<a class="watch-card" href="#/products?line=' + w.lineup + '" data-watch="' + w.id + '">' +
          '<div class="watch-img"><img src="' + w.image + '" alt="' + esc(w.name) + '" loading="lazy"></div>' +
          '<div class="watch-text"><h3 class="watch-name">' + esc(w.name) + '</h3><p class="prod-price">' + AW.fmt(w.price) + '</p></div>' +
          '</a></article>';
      }

      function update(mode) {      // mode: 'first' (with the load animation), 'fade' (checkbox, sort), 'now' (slider drag)
        var lines = selected(), top = cap(), sort = $sort.val();
        $out.text(+$range.val() >= 100 ? 'All prices' : 'Up to ' + AW.fmt(top));

        var list = watches.filter(function (w) { return (!lines.length || lines.indexOf(w.lineup) > -1) && w.price <= top; });
        if (sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
        else if (sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
        else if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });

        $('#prodCount').text(list.length + (list.length === 1 ? ' watch' : ' watches'));
        var one = lines.length === 1 ? lineups.filter(function (l) { return l.id === lines[0]; })[0] : null;
        $('#prodSub').text(one ? one.line : 'All collections');
        try { var h = '#/products' + (lines.length ? '?line=' + lines.join(',') : ''); if (location.hash !== h) history.replaceState(null, '', h); } catch (e) {}

        var key = list.map(function (w) { return w.id; }).join('|');
        if (key === lastKey) return;                    // same watches in the same order: nothing to redraw
        lastKey = key;

        function draw(reveal) {
          $grid.html(list.length
            ? list.map(function (w, i) { return card(w, i, reveal); }).join('')
            : '<div class="prod-empty"><p>No watches match these filters.</p><button class="link-line" type="button" data-reset>Clear filters</button></div>');
          $grid.removeClass('is-swap');
          if (reveal) AW.motion.refresh(document.getElementById('app'));
        }
        clearTimeout(timer);
        if (mode === 'fade' && !AW.motion.reduced) { $grid.addClass('is-swap'); timer = setTimeout(draw, 160); }
        else draw(mode === 'first');
      }

      function reset() { $boxes.prop('checked', false); $range.val(100); $sort.val('default'); update('fade'); }

      $boxes.add($sort).off('change.aw').on('change.aw', function () { update('fade'); });
      $range.off('input.aw').on('input.aw', function () { update('now'); });
      $('#pfReset').off('click.aw').on('click.aw', reset);
      $grid.off('click.aw')
        .on('click.aw', '.watch-card', function (e) { e.preventDefault(); AW.popup.open($(this).data('watch')); })
        .on('click.aw', '[data-reset]', reset);

      update('first');
    });
  }
  return { init: init };
})();
