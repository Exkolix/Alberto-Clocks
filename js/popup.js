/* WATCH POPUP (owner: Obash) - fills the Bootstrap modal in index.html and shows it. */
window.AW = window.AW || {};

AW.popup = (function () {
  var modal = null;
  function open(id) {
    AW.data.load().then(function (d) {
      var w = d.watches.filter(function (x) { return x.id === id; })[0];
      if (!w) return;
      var lineup = d.lineups.filter(function (l) { return l.id === w.lineup; })[0];
      $('#wmImg').attr({ src: w.image, alt: w.name });
      $('#wmLine').text(lineup ? lineup.name : '');
      var n = d.watches.indexOf(w) + 1;
      $('#wmRef').text('Ref. AW-' + (n < 10 ? '0' : '') + n);
      $('#wmCap').text(w.year + ' \u00b7 ' + w.movement);
      $('#wmName').text(w.name);
      $('#wmPrice').text(AW.fmt(w.price));
      $('#wmDesc').text(w.description);
      $('#wmYear').text(w.year);
      $('#wmMove').text(w.movement);
      $('#wmCase').text(w.case);
      $('#wmWater').text(w.water);
      modal = modal || new bootstrap.Modal(document.getElementById('watchModal'));
      modal.show();
    });
  }
  return { open: open };
})();
