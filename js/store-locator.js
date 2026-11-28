/* STORE LOCATOR + CONTACT LOGIC (owner: Obash)
   1. City tabs: show one store's details and its map at a time (#/store-locator?city=abuja opens a city).
   2. Enquiry form: checks every field, shows a clear message under the ones that are wrong, then a thank-you panel.
      There is no server behind this site, so nothing is actually sent.
   3. Links: #/contact scrolls down to the form; #/contact?watch=<id> (the popup's Enquire button) pre-fills the form. */
window.AW = window.AW || {};

AW.storeLocator = (function () {
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[0-9][0-9 ()\-]{6,17}$/;
  var NAME = /^[A-Za-zÀ-ɏ' .\-]+$/;

  // one rule per field: returns an error message, or '' when the value is fine
  var rules = {
    cfName: function (v) { if (!v) return 'Please tell us your name.'; if (v.length < 2) return 'That name looks too short.'; if (!NAME.test(v)) return 'Please use letters only.'; return ''; },
    cfEmail: function (v) { if (!v) return 'Please enter your email address.'; if (!EMAIL.test(v)) return 'That email address does not look right.'; return ''; },
    cfPhone: function (v) { if (v && !PHONE.test(v)) return 'Please enter a valid phone number, for example +234 800 000 0102.'; return ''; },
    cfTopic: function (v) { return v ? '' : 'Please choose a topic.'; },
    cfMsg: function (v) { if (!v) return 'Please write a short message.'; if (v.length < 10) return 'Please add a little more detail (at least 10 characters).'; return ''; }
  };

  function init(params) {
    params = params || new URLSearchParams('');
    cities(params);
    form(params);

    // #/contact (menu, footer, popup) means "take me to the form"
    if (/^#\/contact/.test(location.hash) || params.get('watch')) {
      setTimeout(function () {
        var el = document.getElementById('contactSection');
        if (el) el.scrollIntoView({ behavior: AW.motion.reduced ? 'auto' : 'smooth', block: 'start' });
      }, 520);
    }
  }

  /* ---------- 1. city tabs ---------- */
  function cities(params) {
    var $tabs = $('#slTabs [data-city]'), $panes = $('.sl-pane'), $maps = $('#storeMap svg');
    var keys = $tabs.map(function () { return $(this).data('city'); }).get();
    var want = params.get('city');
    var current = keys.indexOf(want) > -1 ? want : 'lagos';

    function show(city) {
      current = city;
      $tabs.each(function () { var on = $(this).data('city') === city; $(this).toggleClass('active', on).attr('aria-pressed', on); });
      $panes.each(function () { $(this).prop('hidden', $(this).data('city') !== city); });
      // SVG elements have no .hidden property, so the attribute is set directly
      $maps.each(function () { if ($(this).data('city') === city) this.removeAttribute('hidden'); else this.setAttribute('hidden', ''); });
    }
    $tabs.off('click.aw').on('click.aw', function () { show($(this).data('city')); });
    show(current);
  }

  /* ---------- 2. enquiry form ---------- */
  function form(params) {
    var $form = $('#contactForm');
    if (!$form.length) return;
    var ids = ['cfName', 'cfEmail', 'cfPhone', 'cfTopic', 'cfMsg'];

    function check(id) {
      var $f = $('#' + id), msg = rules[id]($.trim($f.val()));
      $('#' + id + 'Err').text(msg);
      $f.attr('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }

    // check a field when you leave it, and again as you fix it
    ids.forEach(function (id) {
      $('#' + id).off('.aw')
        .on('blur.aw', function () { check(id); })
        .on('input.aw change.aw', function () { if ($(this).attr('aria-invalid') === 'true') check(id); });
    });

    $form.off('submit.aw').on('submit.aw', function (e) {
      e.preventDefault();
      var bad = ids.filter(function (id) { return !check(id); });
      if (bad.length) { $('#' + bad[0]).trigger('focus'); return; }

      var name = $.trim($('#cfName').val()).split(/\s+/)[0];
      var store = $('#cfStore').val(), topic = $('#cfTopic').val().toLowerCase();
      $('#doneTitle').text('Thank you, ' + name);
      $('#doneText').text('Your message about ' + (topic === 'a watch' ? 'a watch' : topic) + ' is with ' + (store ? 'our ' + store + ' store' : 'our team') + '. We will reply to ' + $.trim($('#cfEmail').val()) + '.');
      $form.prop('hidden', true);
      $('#contactDone').prop('hidden', false).trigger('focus');
    });

    $('#contactAgain').off('click.aw').on('click.aw', function () {
      $form[0].reset();
      ids.forEach(function (id) { $('#' + id + 'Err').text(''); $('#' + id).attr('aria-invalid', 'false'); });
      $('#contactDone').prop('hidden', true);
      $form.prop('hidden', false);
      $('#cfName').trigger('focus');
    });

    // the popup's "Enquire about this watch" sends #/contact?watch=<id>
    var id = params.get('watch');
    if (id) {
      AW.data.load().then(function (d) {
        var i = -1;
        d.watches.forEach(function (w, n) { if (w.id === id) i = n; });
        if (i < 0) return;
        var w = d.watches[i], ref = 'AW-' + (i + 1 < 10 ? '0' : '') + (i + 1);
        $('#cfTopic').val('A watch');
        $('#cfMsg').val('I would like to know more about the ' + w.name + ' (Ref. ' + ref + ').');
      });
    }
  }

  return { init: init };
})();
