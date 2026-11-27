/* PRICE LIST SCREEN LOGIC (owner: Obash)
   Draws the table from the JSON and runs the line-up tabs, search and the sortable headings.
   Click (or Enter on) a row to open the shared watch popup.
   The address keeps in step (#/price-list?line=luxury&q=pulse), so a filtered view can be shared or bookmarked. */
window.AW = window.AW || {};

AW.priceList = (function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function init(params) {
    var $body = $('#priceBody');
    if (!$body.length) return;

    AW.data.load().then(function (d) {
      var watches = d.watches, lineups = d.lineups;
      var $tabs = $('#plTabs [data-line]'), $search = $('#priceSearch'), $clear = $('#priceSearchClear'), $table = $('#priceTable');
      var line = 'all', sort = { key: null, dir: 1 }, lastKey = null, timer = null, typing = null;

      // ref number (the same one the popup shows), collection name and a lowercase text each watch is searched in
      var meta = {};
      watches.forEach(function (w, i) {
        var ref = 'AW-' + (i + 1 < 10 ? '0' : '') + (i + 1), l = lineups.filter(function (x) { return x.id === w.lineup; })[0];
        meta[w.id] = { ref: 'Ref. ' + ref, line: l ? l.name : '', hay: [w.name, l ? l.name : '', w.movement, w.case, w.year, 'ref', ref].join(' ').toLowerCase() };
      });

      // start from the address: #/price-list?line=luxury&q=pulse
      var want = params && params.get('line');
      if (want && lineups.some(function (l) { return l.id === want; })) line = want;
      $search.val(params && params.get('q') || '');

      function paintTabs() {
        $tabs.each(function () {
          var on = $(this).data('line') === line;
          $(this).toggleClass('active', on).attr('aria-pressed', on);
        });
      }
      function paintSort() {
        $('#priceTable th[aria-sort]').attr('aria-sort', 'none');
        if (sort.key) $('[data-sort="' + sort.key + '"]').closest('th').attr('aria-sort', sort.dir > 0 ? 'ascending' : 'descending');
      }

      // tab counts, e.g. "Luxury [3]"
      $tabs.each(function () {
        var id = $(this).data('line');
        var n = id === 'all' ? watches.length : watches.filter(function (w) { return w.lineup === id; }).length;
        $(this).find('.pl-n').text('[' + n + ']');
      });

      function row(w) {
        return '<tr data-watch="' + w.id + '" tabindex="0">' +
          '<td class="pl-c-photo"><img src="' + w.image + '" alt="' + esc(w.name) + '" loading="lazy"></td>' +
          '<td><span class="pl-title">' + esc(w.name) + '</span><span class="pl-ref">' + meta[w.id].ref + '</span></td>' +
          '<td class="pl-c-line">' + esc(meta[w.id].line) + '</td>' +
          '<td class="pl-c-move"><span class="pl-main">' + esc(w.movement) + '</span><span class="pl-sub">' + esc(w.case) + '</span></td>' +
          '<td class="pl-c-year">' + esc(w.year) + '</td>' +
          '<td class="price pl-c-price">' + AW.fmt(w.price) + '</td>' +
          '<td class="pl-c-act"><button class="pl-view" type="button" tabindex="-1">View</button></td></tr>';
      }

      function update(mode) {      // mode: 'fade' (tab, sort) or 'now' (typing, first draw)
        var q = $.trim($search.val()), words = q.toLowerCase().split(/\s+/).filter(Boolean);
        $clear.prop('hidden', !$search.val());

        var list = watches.filter(function (w) {
          return (line === 'all' || w.lineup === line) && words.every(function (t) { return meta[w.id].hay.indexOf(t) > -1; });
        });
        if (sort.key) {
          list.sort(function (a, b) {
            var x = sort.key === 'name' ? a.name : sort.key === 'year' ? parseInt(a.year, 10) : a.price;
            var y = sort.key === 'name' ? b.name : sort.key === 'year' ? parseInt(b.year, 10) : b.price;
            return (sort.key === 'name' ? x.localeCompare(y) : x - y) * sort.dir;
          });
        }

        $('#plCount').text(list.length + (list.length === 1 ? ' watch' : ' watches'));
        try {
          var parts = []; if (line !== 'all') parts.push('line=' + line); if (q) parts.push('q=' + encodeURIComponent(q));
          var h = '#/price-list' + (parts.length ? '?' + parts.join('&') : '');
          if (location.hash !== h) history.replaceState(null, '', h);
        } catch (e) {}

        var key = list.map(function (w) { return w.id; }).join('|');
        if (key === lastKey) return;                    // same watches in the same order: nothing to redraw
        lastKey = key;

        function draw() {
          $body.html(list.length
            ? list.map(row).join('')
            : '<tr class="pl-empty"><td colspan="7"><p>No watches match' + (q ? ' “' + esc(q) + '”' : ' this search') + '.</p><button class="link-line" type="button" data-reset>Show all watches</button></td></tr>');
          $table.removeClass('is-swap');
        }
        clearTimeout(timer);
        if (mode === 'fade' && !AW.motion.reduced) { $table.addClass('is-swap'); timer = setTimeout(draw, 160); }
        else draw();
      }

      function reset() { line = 'all'; sort = { key: null, dir: 1 }; $search.val(''); paintTabs(); paintSort(); update('fade'); }

      $tabs.off('click.aw').on('click.aw', function () { line = $(this).data('line'); paintTabs(); update('fade'); });
      $('[data-sort]').off('click.aw').on('click.aw', function () {
        var k = $(this).data('sort');
        sort = sort.key === k ? { key: k, dir: -sort.dir } : { key: k, dir: 1 };
        paintSort(); update('fade');
      });
      $search.off('.aw')
        .on('input.aw', function () { $clear.prop('hidden', !this.value); clearTimeout(typing); typing = setTimeout(function () { update('now'); }, 140); })
        .on('keydown.aw', function (e) { if (e.key === 'Escape' && this.value) { this.value = ''; update('now'); } });
      $clear.off('click.aw').on('click.aw', function () { $search.val('').trigger('focus'); update('now'); });

      $body.off('.aw')
        .on('click.aw', 'tr[data-watch]', function () { AW.popup.open($(this).data('watch')); })
        .on('keydown.aw', 'tr[data-watch]', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); AW.popup.open($(this).data('watch')); } })
        .on('click.aw', '[data-reset]', reset);

      paintTabs(); paintSort(); update('now');
    });
  }
  return { init: init };
})();
