/* ===================================================================
   אסבסט פירוק — Site interactions
   Mobile menu · smooth-scroll close · scroll reveal · stat counters ·
   contact-form validation
   =================================================================== */
(function () {
  'use strict';

  /* ---------- Home links: always scroll to true top ---------- */
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    });

    // Close the menu after clicking a link (mobile).
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'פתיחת תפריט');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target).toLocaleString('he-IL') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('he-IL') + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && counters.length) {
    var countIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (parseInt(el.getAttribute('data-count'), 10) || 0) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');

    function setError(field, message) {
      var wrap = field.closest('.field');
      var slot = wrap.querySelector('.error');
      wrap.classList.toggle('invalid', !!message);
      if (slot) slot.textContent = message || '';
      return !message;
    }

    function validatePhone(value) {
      // Accept Israeli formats: 0XX-XXXXXXX, with spaces/dashes, optional +972.
      var digits = value.replace(/[\s\-()]/g, '');
      return /^(\+?972|0)\d{8,9}$/.test(digits);
    }

    var WHATSAPP_NUMBER = '972542366997';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      var name = form.elements['name'];
      var phone = form.elements['phone'];
      var message = form.elements['message'];

      ok = setError(name, name.value.trim() ? '' : 'נא להזין שם מלא') && ok;

      if (!phone.value.trim()) {
        ok = setError(phone, 'נא להזין מספר טלפון') && ok;
      } else {
        ok = setError(phone, validatePhone(phone.value) ? '' : 'מספר טלפון לא תקין') && ok;
      }

      ok = setError(message, message.value.trim() ? '' : 'נא להזין הודעה') && ok;

      if (!ok) return;

      var waText =
        'היי, פניתי דרך האתר.\n\n' +
        'שם: ' + name.value.trim() + '\n' +
        'טלפון: ' + phone.value.trim() + '\n\n' +
        message.value.trim();

      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText);
      window.open(waUrl, '_blank', 'noopener');

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { success.hidden = true; }, 8000);
      }
      form.reset();
    });

    // Clear an error as soon as the user edits the field.
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var wrap = input.closest('.field');
        if (wrap.classList.contains('invalid')) {
          wrap.classList.remove('invalid');
          var slot = wrap.querySelector('.error');
          if (slot) slot.textContent = '';
        }
      });
    });
  }

  /* ---------- Footer year (keeps copyright current) ---------- */
  // Static year kept in markup; nothing dynamic needed offline.
})();
