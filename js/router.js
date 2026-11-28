/* SPA ROUTER (owner: Obash)
   The address bar hash picks the screen:  #/home  #/products?line=luxury  ...
   The old screen fades out, the new one is loaded from views/*.html, scrolls to top and fades in.
   If a view file cannot be fetched (double-clicking index.html), js/views-bundle.js is used instead. */
window.AW = window.AW || {};

AW.router = (function () {
  var routes = {
    'home':          { file: 'views/home.html',          title: 'Home',                    init: function () { AW.home.init(); } },
    'products':      { file: 'views/products.html',      title: 'Products',                init: function (p) { AW.products.init(p); } },
    'price-list':    { file: 'views/price-list.html',    title: 'Price List',              init: function (p) { AW.priceList.init(p); } },
    'technology':    { file: 'views/technology.html',    title: 'Technology',              init: function (p) { AW.technology.init(p); } },
    'gallery':       { file: 'views/gallery.html',       title: 'Gallery' },
    'store-locator': { file: 'views/store-locator.html', title: 'Store Locator & Contact', init: function (p) { AW.storeLocator.init(p); } },
    'support':       { file: 'views/support.html',       title: 'Support' },
    'about':         { file: 'views/about.html',         title: 'About Us' },
    'sitemap':       { file: 'views/sitemap.html',       title: 'Site Map' }
  };
  var alias = { 'contact': 'store-locator', 'services': 'support' };
  var nav = 0, first = true;

  function parse() {
    var p = location.hash.replace(/^#\/?/, '').split('?');
    return { path: p[0] || 'home', params: new URLSearchParams(p[1] || '') };
  }

  function soon(title) {
    return '<section class="soon"><div><h1 class="title">' + title + '</h1><span class="rule"></span><p>This screen is being built next.</p></div></section>';
  }

  // VS Code "Live Server" injects its reload <script> into every </svg> of a fetched file, which breaks the page.
  // Views never contain scripts, so we drop any script/comment before inserting the HTML.
  function clean(html) {
    return String(html)
      .replace(/<!--\s*Code injected by live-server\s*-->[\s\S]*$/, '')      // everything it pasted at the end
      .replace(/<!--\s*Code injected by live-server\s*-->/g, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '');
  }

  function fetchView(route) {
    return new Promise(function (resolve) {
      $.ajax({ url: route.file, dataType: 'html', cache: true })
        .done(function (html) { resolve(clean(html)); })
        .fail(function () {
          var bundled = window.AW_VIEWS && window.AW_VIEWS[route.file];
          resolve(bundled || soon(route.title));
        });
    });
  }

  function render() {
    var r = parse(), key = alias[r.path] || r.path;
    var route = routes[key] || { file: null, title: 'Page not found' };
    var id = ++nav, $app = $('#app');

    function show(html) {
      if (id !== nav) return;
      $app.css('opacity', 0).html(html);
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.title = route.title + ' | Alberto Watch Company';
      AW.menu.setActive();
      AW.motion.refresh($app[0]);
      if (route.init) route.init(r.params);
      $app.stop(true).fadeTo(first ? 700 : 420, 1);
      first = false;
    }
    function load() { (route.file ? fetchView(route) : Promise.resolve(soon(route.title))).then(show); }

    if (first) load(); else $app.stop(true).fadeTo(200, 0, load);
  }

  function init() {
    $(window).on('hashchange', render);
    // clicking the link of the screen you are already on just scrolls back to the top
    $(document).on('click', 'a[href^="#/"]', function () {
      var h = this.getAttribute('href');
      if (h === location.hash || (h === '#/home' && !location.hash)) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    render();
  }
  return { init: init };
})();
