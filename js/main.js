document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // simple form handler (no backend wired up yet)
  ['#contact-form', '#partner-form'].forEach(function (sel) {
    var form = document.querySelector(sel);
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = form.querySelector('.form-status');
        if (status) {
          status.textContent = 'Thanks — this form is not yet connected to an inbox. See the note below for how to wire it up.';
        }
      });
    }
  });

  // dropdown nav (desktop: hover via CSS; also click/tap + keyboard support, and mobile accordion)
  document.querySelectorAll('.nav-item').forEach(function (item) {
    var trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(function (o) {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); });
    }
  });

  // product video fallback
  document.querySelectorAll('.video-wrap').forEach(function (wrap) {
    var video = wrap.querySelector('.product-video');
    if (!video) return;
    video.addEventListener('error', function () { wrap.classList.add('has-error'); }, true);
    // if no source resolves at all within a moment, also fall back
    setTimeout(function () {
      if (video.readyState === 0) wrap.classList.add('has-error');
    }, 1500);
  });

  // current year in footer
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
