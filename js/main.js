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

  // contact form -> Web3Forms (real submission, sends to Cebean's inbox)
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = contactForm.querySelector('.form-status');
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      if (status) { status.textContent = ''; }

      var formData = new FormData(contactForm);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.success) {
            if (status) { status.textContent = "Thanks — your message has been sent. We'll get back to you within 2 business days."; }
            contactForm.reset();
          } else {
            if (status) { status.textContent = 'Something went wrong sending your message. Please try again or reach out via LinkedIn.'; }
          }
        })
        .catch(function () {
          if (status) { status.textContent = 'Something went wrong sending your message. Please try again or reach out via LinkedIn.'; }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
        });
    });
  }

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

  // mini-case tabs (Problem / Approach / Outcome)
  document.querySelectorAll('.mini-case').forEach(function (card) {
    var tabs = card.querySelectorAll('.mc-tab');
    var panels = card.querySelectorAll('.mc-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var idx = tab.getAttribute('data-tab');
        var panel = card.querySelector('.mc-panel[data-panel="' + idx + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  });

  // testimonial carousel
  document.querySelectorAll('.tc-wrap').forEach(function (wrap) {
    var track = wrap.querySelector('.tc-track');
    var prev = wrap.querySelector('.tc-prev');
    var next = wrap.querySelector('.tc-next');
    if (!track) return;
    function scrollAmount() {
      var slide = track.querySelector('.tc-slide');
      return slide ? slide.getBoundingClientRect().width + 20 : 320;
    }
    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
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
