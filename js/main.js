(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header background once scrolled past the fold edge */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobileNav.classList.toggle('is-open', !open);
  });

  mobileNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
    }
  });

  /* type fades up as it enters — nothing snaps */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* slow parallax on portraits and the hero */
  var parallaxLayers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var sapphire = document.querySelector('.bloom-sapphire');
  var orchid = document.querySelector('.bloom-orchid');
  var ticking = false;

  /* The blue sinks and the orchid rises as the page runs, so the
     atmosphere shifts from cool at the top to warm-violet at the base. */
  function driftBlooms() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    if (sapphire) {
      sapphire.style.transform =
        'translate3d(' + (progress * 12).toFixed(2) + 'vw,' +
        (progress * 24).toFixed(2) + 'vh,0)';
    }
    if (orchid) {
      orchid.style.transform =
        'translate3d(' + (progress * -14).toFixed(2) + 'vw,' +
        (progress * -34).toFixed(2) + 'vh,0)';
    }
  }

  function drift() {
    driftBlooms();
    var viewport = window.innerHeight;

    parallaxLayers.forEach(function (layer) {
      var box = layer.getBoundingClientRect();
      if (box.bottom < 0 || box.top > viewport) return;

      var progress = (box.top + box.height / 2 - viewport / 2) / viewport;
      var target = layer.classList.contains('hero-media') ? layer : layer.querySelector('img');
      if (!target) return;

      var shift = layer.classList.contains('hero-media') ? progress * 60 : progress * -26;
      target.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0) scale(1.08)';
    });

    ticking = false;
  }

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 40);
    if (reduced || ticking) return;
    ticking = true;
    window.requestAnimationFrame(drift);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  if (!reduced) drift();
})();
