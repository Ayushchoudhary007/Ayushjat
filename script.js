// ── Smooth scroll ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Full-width Carousel ────────────────────
const slidesEl   = document.getElementById('slides');
const dotsEl     = document.getElementById('dots');
const sliderWrap = document.getElementById('slider');
const total      = slidesEl ? slidesEl.children.length : 0;
let cur          = 0;
let autoTimer    = null;
let startX       = 0;

if (total > 0) {

  // Build dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    dotsEl.appendChild(d);
  }

  function syncDots() {
    document.querySelectorAll('.sdot').forEach((d, i) =>
      d.classList.toggle('active', i === cur)
    );
  }

  function resetProgress() {
    document.querySelectorAll('.slide-progress').forEach(p => {
      p.style.transition = 'none';
      p.style.width = '0%';
    });
    const active = document.querySelectorAll('.slide-progress')[cur];
    if (active) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          active.style.transition = 'width 4s linear';
          active.style.width = '100%';
        });
      });
    }
  }

  function goTo(n) {
    cur = ((n % total) + total) % total;
    slidesEl.style.transform = `translateX(-${cur * 100}%)`;
    syncDots();
    resetProgress();
  }

  function go(dir) { goTo(cur + dir); }

  function startAuto() {
    autoTimer = setInterval(() => go(1), 4000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // Pause on hover
  sliderWrap.addEventListener('mouseenter', stopAuto);
  sliderWrap.addEventListener('mouseleave', startAuto);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopAuto(); go(-1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); go(1);  startAuto(); }
  });

  // Touch / swipe
  sliderWrap.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  sliderWrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      stopAuto();
      go(dx < 0 ? 1 : -1);
      startAuto();
    }
  });

  // Init
  goTo(0);
  startAuto();
}

// expose go() for inline onclick buttons
window.go = go;
