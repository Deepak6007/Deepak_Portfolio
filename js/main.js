/* Site behaviour: glass glow, reveals, case studies, lightbox, brief builder. */
(function () {
  'use strict';

  // ---- Settings you can change ----
  var WHATSAPP = '919966273444';
  var EMAIL = 'deepak7designer@gmail.com';
  // Paste your Google Apps Script web-app URL here to also log every brief to your Google Sheet.
  // See apps-script/Code.gs and README.md. Leave empty to skip.
  var SHEET_ENDPOINT = '';

  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // ---- Light on glass follows the pointer ----
  $$('[data-glow]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---- Project reveal (studio shutter) ----
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---- Phone and tablet menu ----
  var nav = $('.nav'), toggle = $('.nav-toggle');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  }
  if (nav && toggle) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
  }

  // ---- Active nav link ----
  var links = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'services', 'about', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) navIO.observe(s);
    });
  }

  // ---- Dialogs: case studies and lightbox ----
  var lastTrigger = null;
  function openDialog(d, trigger) {
    if (!d) return;
    lastTrigger = trigger || document.activeElement;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    var inner = $('.case-inner', d); if (inner) inner.scrollTop = 0;
    d.dispatchEvent(new CustomEvent('opened'));
  }
  function closeDialog(d) {
    if (!d) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }
  $$('dialog').forEach(function (d) {
    d.addEventListener('close', function () {
      document.body.style.overflow = '';
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
    });
    d.addEventListener('click', function (e) {
      if (e.target === d) closeDialog(d); // backdrop click
      var c = e.target.closest('[data-close]');
      if (c) {
        closeDialog(d);
        if (c.getAttribute('href') === '#contact') { e.preventDefault(); setTimeout(function () { $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 60); }
      }
    });
  });
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openDialog(document.getElementById(b.getAttribute('data-open')), b); });
  });

  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  $$('[data-lightbox]').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = $('img', b);
      lbImg.src = b.getAttribute('data-lightbox');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = b.getAttribute('data-caption') || '';
      openDialog(lb, b);
    });
  });

  // ---- Brief builder ----
  var form = $('#brief');
  if (!form) return;
  var steps = $$('.step', form);
  var dots = $$('.steps li', form);
  var prev = $('#prev'), next = $('#next');
  var cur = 0;

  function val(name) {
    var els = $$('[name="' + name + '"]', form);
    if (!els.length) return '';
    if (els[0].type === 'checkbox') return els.filter(function (e) { return e.checked; }).map(function (e) { return e.value; });
    if (els[0].type === 'radio') { var c = els.filter(function (e) { return e.checked; })[0]; return c ? c.value : ''; }
    return els[0].value.trim();
  }
  // An email address, or a phone number with at least 7 digits
  function reachable(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 7;
  }
  function valid(i) {
    if (i === 0) return val('service').length > 0;
    if (i === 1) return val('details').length > 2;
    if (i === 3) return val('name').length > 0 && reachable(val('contact'));
    return true;
  }
  function briefText() {
    var lines = [
      'Hi Deepak, I have a project for you.',
      '',
      'Service: ' + val('service').join(', '),
      'Project: ' + val('details')
    ];
    if (val('refs')) lines.push('References: ' + val('refs'));
    lines.push('Budget: ' + val('budget'));
    lines.push('Timeline: ' + val('timeline'));
    lines.push('');
    lines.push('Name: ' + val('name') + (val('company') ? ' (' + val('company') + ')' : ''));
    lines.push('Contact: ' + val('contact'));
    return lines.join('\n');
  }
  function show(i) {
    cur = i;
    steps.forEach(function (s, k) { s.hidden = k !== i; s.classList.toggle('is-on', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); d.classList.toggle('is-done', k < i); });
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    next.textContent = i === steps.length - 2 ? 'Review brief' : 'Continue';
    if (i === steps.length - 1) {
      var t = briefText();
      $('#review-text').textContent = t;
      $('#send-wa').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(t);
      $('#send-mail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project brief from ' + val('name')) + '&body=' + encodeURIComponent(t);
    }
    var focusable = $('input, textarea', steps[i]);
    if (focusable && i > 0) focusable.focus({ preventScroll: true });
  }
  function err(i, on) { var e = $('[data-err="' + i + '"]', form); if (e) e.hidden = !on; }

  next.addEventListener('click', function () {
    if (!valid(cur)) { err(cur, true); return; }
    err(cur, false);
    show(Math.min(cur + 1, steps.length - 1));
  });
  prev.addEventListener('click', function () { show(Math.max(cur - 1, 0)); });
  form.addEventListener('input', function () { if (valid(cur)) err(cur, false); });
  form.addEventListener('submit', function (e) { e.preventDefault(); next.click(); });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); next.click(); }
  });

  var logged = false;
  function logToSheet(channel) {
    if (!SHEET_ENDPOINT || logged) return;
    logged = true;
    var body = new URLSearchParams({
      service: val('service').join(', '), details: val('details'), refs: val('refs'),
      budget: val('budget'), timeline: val('timeline'), name: val('name'),
      contact: val('contact'), company: val('company'), channel: channel, page: location.href
    });
    try { fetch(SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: body }); } catch (e) { /* ignore */ }
  }
  var note = $('#sent-note');
  $('#send-wa').addEventListener('click', function () { logToSheet('WhatsApp'); note.textContent = 'WhatsApp opened with your brief. Press send there to deliver it.'; });
  $('#send-mail').addEventListener('click', function () { logToSheet('Email'); note.textContent = 'Your email app opened with the brief filled in. Press send there to deliver it.'; });
  $('#copy-brief').addEventListener('click', function () {
    var t = briefText();
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { note.textContent = 'Brief copied. Paste it into WhatsApp, email or DM.'; });
  });

  // Service buttons pre-select the matching chip
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-service');
      $$('[name="service"]', form).forEach(function (c) { c.checked = c.value === v; });
      show(0);
    });
  });
})();
