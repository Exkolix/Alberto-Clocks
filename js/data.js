/* DATA LOADER (owner: Obash)
   Reads data/watches.json. If the browser blocks that (opening index.html by double-click),
   it falls back to js/fallback-data.js, which tools/bundle.js generates from the same JSON. */
window.AW = window.AW || {};

AW.data = (function () {
  var promise = null;
  function load() {
    if (!promise) {
      promise = new Promise(function (resolve) {
        $.getJSON('data/watches.json')
          .done(resolve)
          .fail(function () { resolve(window.AW_FALLBACK_DATA || { lineups: [], watches: [] }); });
      });
    }
    return promise;
  }
  return { load: load };
})();

AW.fmt = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
