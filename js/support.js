/* SUPPORT SCREEN LOGIC (owner: Obash)
   The Help questions and the Services list are written in views/support.html. This only shows one tab at a time.
   #/support?section=services opens Services directly (the menu, footer and Home use that), and the address follows your choice. */
window.AW = window.AW || {};

AW.support = (function () {
  function init(params) {
    var $tabs = $('#spTabs .nav-link'), $panes = $('.sp-pane');
    if (!$tabs.length) return;

    var keys = $tabs.map(function () { return $(this).data('section'); }).get();
    var first = params && params.get('section');
    var current = keys.indexOf(first) > -1 ? first : keys[0];

    function show(key) {
      current = key;
      $panes.each(function () { $(this).prop('hidden', $(this).data('section') !== key); });
      $tabs.each(function () {
        var on = $(this).data('section') === key;
        $(this).toggleClass('active', on).attr('aria-pressed', on ? 'true' : 'false');
      });
      try { history.replaceState(null, '', '#/support' + (key === keys[0] ? '' : '?section=' + key)); } catch (e) {}
      AW.menu.setActive();
      AW.motion.refresh(document.getElementById('app'));     // reveal anything inside the pane that just opened
    }

    $tabs.off('click.aw').on('click.aw', function () { show($(this).data('section')); });
    show(current);
  }
  return { init: init };
})();
