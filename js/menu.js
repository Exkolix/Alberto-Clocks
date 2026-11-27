/* HAMBURGER MENU (owner: Obash)
   Desktop: hover a main WORD -> it turns gold + underlined and its panel opens; hovering another word redraws the content with a fade down.
   Mobile / touch: tap a main item -> its sub-links expand below it.
   Also marks the link of the current screen as .active (colour change "after clicking"). */
window.AW = window.AW || {};

AW.menu = (function () {
  var $menu, $hb;
  function desktop() { return window.matchMedia('(min-width: 992px) and (hover: hover)').matches; }

  function open() {
    $menu.addClass('is-open').attr('aria-hidden', 'false');
    $('body').addClass('menu-open');
    $hb.attr('aria-expanded', 'true');
    setTimeout(function () { $menu.find('.menu-close').trigger('focus'); }, 80);
  }
  function close() {
    if (!$menu.hasClass('is-open')) return;
    $menu.removeClass('is-open is-switching').attr('aria-hidden', 'true');
    $('body').removeClass('menu-open');
    $hb.attr('aria-expanded', 'false');
    setTimeout(function () { $menu.find('.menu-item').removeClass('is-open').find('.menu-top').attr('aria-expanded', 'false'); }, 500);
  }
  function openItem($li) {
    if ($li.hasClass('is-open')) return;                                  // same word again: nothing changes
    $menu.toggleClass('is-switching', $menu.find('.menu-item.is-open').length > 0);   // another one was open: keep the panel, redraw its content
    $menu.find('.menu-item').not($li).removeClass('is-open').find('.menu-top').attr('aria-expanded', 'false');
    $li.addClass('is-open').find('.menu-top').attr('aria-expanded', 'true');
  }

  function split(href) {
    var p = (href || '').replace(/^#\/?/, '').split('?');
    return { path: p[0] || 'home', q: p[1] || '' };
  }
  function setActive() {
    var cur = split(location.hash);
    $('.menu a, .icon-link, .site-footer a').each(function () {
      var l = split(this.getAttribute('href'));
      var on = l.path === cur.path && (!l.q || l.q === cur.q);
      $(this).toggleClass('active', on);
    });
    $('.tile').each(function () { $(this).toggleClass('active', $(this).is('.active')); });
    $menu.find('.menu-item').each(function () { $(this).toggleClass('has-active', $(this).find('a.active').length > 0); });
  }

  function init() {
    $menu = $('#menu'); $hb = $('#hb');
    $menu.find('.menu-sub-inner').each(function () { $(this).find('a').each(function (i) { this.style.setProperty('--k', i); }); });   // order of arrival
    $hb.on('click', open);
    $menu.on('click', '[data-menu-close]', close);
    $(document).on('keydown', function (e) { if (e.key === 'Escape') close(); });
    $menu.on('click', 'a', close);

    $menu.on('click', '.menu-top', function () {
      var $li = $(this).closest('.menu-item');
      if ($li.hasClass('is-open') && !desktop()) { $li.removeClass('is-open'); $(this).attr('aria-expanded', 'false'); }
      else openItem($li);
    });
    // only the WORD itself reacts to the mouse, not the whole line (the panel stays open until another word is hovered)
    $menu.on('mouseenter', '.menu-top span', function () { if (desktop()) openItem($(this).closest('.menu-item')); });
    $menu.on('focusin', '.menu-item', function () { if (desktop()) openItem($(this)); });
  }

  return { init: init, open: open, close: close, setActive: setActive };
})();
