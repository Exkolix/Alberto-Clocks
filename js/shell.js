/* SHELL EXTRAS (owner: Obash)
   - Visitor counter (top right, beside the eye icon)
   - Scrolling ticker with the visitor's REAL date, time and location (HTML5 geolocation) */
window.AW = window.AW || {};

AW.shell = (function () {
  /* ---------- Visitor counter ----------
     No server, so the count is kept in the browser: it goes up by one for each new visit (session). */
  function visitors() {
    var KEY = 'aw_visitors', n = 1000;
    try {
      n = parseInt(localStorage.getItem(KEY), 10) || 1000;
      if (!sessionStorage.getItem('aw_counted')) {
        n += 1;
        localStorage.setItem(KEY, n);
        sessionStorage.setItem('aw_counted', '1');
      }
    } catch (e) { n = 1001; }
    $('#visitorCount').text(n.toLocaleString('en-US'));
  }

  /* ---------- Ticker ---------- */
  var place = 'Locating…';

  function item() {
    return '<span class="tk-item"><span class="tk-label">Date</span><span class="tk-date"></span></span>' +
      '<span class="tk-item"><span class="tk-label">Time</span><span class="tk-time"></span></span>' +
      '<span class="tk-item"><span class="tk-label">Location</span><span class="tk-place"></span></span>' +
      '<span class="tk-item">Alberto Watch Company &mdash; Repair &middot; Appraisal &middot; Retail</span>';
  }
  function buildTicker() {
    var group = '<div class="ticker-group">' + item() + item() + item() + '</div>';
    $('#tickerTrack').html(group + group.replace('ticker-group', 'ticker-group" aria-hidden="true'));
  }
  function tick() {
    var d = new Date();
    $('.tk-date').text(d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    $('.tk-time').text(d.toLocaleTimeString(undefined, { hour12: false }));
    $('.tk-place').text(place);
  }
  function zoneName() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g, ' '); } catch (e) { return 'Unknown'; }
  }
  function locate() {
    place = zoneName() + ' (time zone)';           // shown until the browser shares the real position
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      place = lat.toFixed(2) + '°, ' + lon.toFixed(2) + '°';
      // Turn the coordinates into a city name (free service; if it is offline we keep the coordinates)
      $.getJSON('https://api.bigdatacloud.net/data/reverse-geocode-client', { latitude: lat, longitude: lon, localityLanguage: 'en' })
        .done(function (r) {
          var name = [r.city || r.locality, r.countryName].filter(Boolean).join(', ');
          if (name) place = name;
        });
    }, function () { /* permission refused: keep the time zone name */ }, { timeout: 8000, maximumAge: 600000 });
  }

  function init() {
    visitors();
    buildTicker();
    tick();
    setInterval(tick, 1000);
    locate();
  }
  return { init: init };
})();
