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

  /* Gigs retire themselves the day after they happen, and the whole
     Upcoming block goes with the last one, so a date that has been and
     gone is never left on the page labelled upcoming. */
  var gigBlock = document.querySelector('.gigs');
  if (gigBlock) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var upcoming = 0;

    [].forEach.call(gigBlock.querySelectorAll('.gig-list li'), function (gig) {
      var stamp = gig.querySelector('time[datetime]');
      var when = stamp && new Date(stamp.getAttribute('datetime') + 'T00:00:00');
      if (!when || isNaN(when.getTime()) || when < today) {
        gig.hidden = true;
      } else {
        upcoming++;
      }
    });

    if (!upcoming) { gigBlock.hidden = true; }
  }

  /* YouTube posters. maxres does not exist for every upload, so fall back
     to hqdefault — which always does — the first time one 404s. The cards
     crop to 16:9, so hqdefault's 4:3 letterboxing never shows. */
  [].forEach.call(document.querySelectorAll('img[data-yt-poster]'), function (img) {
    var id = img.getAttribute('data-yt-poster');
    var triedFallback = false;
    img.addEventListener('error', function () {
      if (!triedFallback) {
        triedFallback = true;
        img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
        return;
      }
      /* Neither poster loaded — drop the broken image so the card falls
         back to its slate ground and play ring rather than showing a
         torn-image marker. */
      img.style.display = 'none';
    });
    img.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
  });

  /* Video lightbox. The iframe is only built on open and torn down on
     close, so no YouTube player loads — and nothing is requested from
     YouTube — until someone actually asks to watch something. */
  var lightbox = document.getElementById('lightbox');
  var lightboxFrame = document.getElementById('lightboxFrame');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastPlayTrigger = null;

  function openVideo(id, trigger) {
    lastPlayTrigger = trigger || null;
    lightboxFrame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0" title="Live session video" allow="accelerometer; ' +
      'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen></iframe>';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeVideo() {
    lightbox.hidden = true;
    lightboxFrame.innerHTML = '';
    document.body.style.overflow = '';
    if (lastPlayTrigger) { lastPlayTrigger.focus(); lastPlayTrigger = null; }
  }

  if (lightbox) {
    [].forEach.call(document.querySelectorAll('[data-yt]'), function (card) {
      card.addEventListener('click', function () {
        openVideo(card.getAttribute('data-yt'), card);
      });
    });

    lightboxClose.addEventListener('click', closeVideo);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { closeVideo(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) { closeVideo(); }
    });
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
