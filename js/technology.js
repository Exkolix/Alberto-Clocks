/* TECHNOLOGY SCREEN LOGIC (owner: Obash)
   The five topics are written in views/technology.html. This only shows one at a time.
   #/technology?item=solar opens a topic directly (the menu and footer use that), and the address follows your choice. */
window.AW = window.AW || {};

AW.technology = (function () {
  function init(params) {
    var $tabs = $('#techList .tech-tab'), $items = $('.tech-item');
    if (!$tabs.length) return;

    var keys = $tabs.map(function () { return $(this).data('key'); }).get();
    var first = params && params.get('item');
    var current = keys.indexOf(first) > -1 ? first : keys[0];

    function show(key, fromUser) {
      current = key;
      $items.each(function () { $(this).prop('hidden', $(this).data('key') !== key); });
      $tabs.each(function () { $(this).attr('aria-current', $(this).data('key') === key ? 'true' : 'false'); });
      try { history.replaceState(null, '', '#/technology?item=' + key); } catch (e) {}
      AW.menu.setActive();

      // on phones the index is a scrolling row: bring the chosen tab into view
      var list = document.getElementById('techList'), tab = $tabs.filter('[data-key="' + key + '"]')[0];
      if (list && tab && list.scrollWidth > list.clientWidth + 2) {
        var left = tab.parentNode.offsetLeft - 20;
        if (list.scrollTo) list.scrollTo({ left: left, behavior: fromUser && !AW.motion.reduced ? 'smooth' : 'auto' }); else list.scrollLeft = left;
      }
    }

    $tabs.off('click.aw').on('click.aw', function () { show($(this).data('key'), true); });
    // arrow keys move through the topics
    $tabs.off('keydown.aw').on('keydown.aw', function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      var next = keys[(keys.indexOf(current) + d + keys.length) % keys.length];
      show(next, true);
      $tabs.filter('[data-key="' + next + '"]').trigger('focus');
    });

    show(current, false);
  }
  return { init: init };
})();
