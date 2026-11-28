/* SHELL EXTRAS (owner: Obash)
   - Visitor counter (top right, beside the eye icon)
   - Scrolling ticker with the visitor's REAL date, time and location (HTML5 geolocation) */
window.AW = window.AW || {};

AW.shell = (function () {
  /* ---------- Visitor counter ----------
     No server, so the count is kept in this browser only. It starts at 0 and goes up by one per real visit:
     opening more tabs or reloading does not count again; coming back after 30 minutes away does. */
  function visitors() {
    var KEY = 'aw_visits_v2', GAP = 30 * 60 * 1000, now = Date.now(), n = 1;
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null') || { n: 0, t: 0 };
      n = saved.n;
      if (!n || now - saved.t > GAP) n += 1;               // first visit ever, or back after a break
      localStorage.setItem(KEY, JSON.stringify({ n: n, t: now }));   // every page load refreshes "last seen"
    } catch (e) { n = 1; }
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
