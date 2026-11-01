/* Photography page: chapter progress pill. Dialogs, lightbox and menu come from main.js. */
(function () {
  'use strict';
  var pill = document.querySelector('.ch-progress');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  if (!pill || !chapters.length || !('IntersectionObserver' in window)) return;
  var num = pill.querySelector('.ch-num'), name = pill.querySelector('.ch-name'), bar = pill.querySelector('.ch-bar span');
  var total = chapters.length;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var c = en.target, i = chapters.indexOf(c) + 1;
      num.textContent = c.getAttribute('data-chapter') + ' / ' + String(total).padStart(2, '0');
      name.textContent = c.getAttribute('data-title');
      bar.style.width = (i / total * 100) + '%';
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  chapters.forEach(function (c) { io.observe(c); });

  // Show the pill only while the reader is inside the chapters
  var first = chapters[0], last = chapters[total - 1];
  function update() {
    var top = first.getBoundingClientRect().top, bottom = last.getBoundingClientRect().bottom;
    pill.classList.toggle('is-on', top < window.innerHeight * 0.5 && bottom > window.innerHeight * 0.5);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
