/* ─── Particle canvas ─── */
(function () {
  'use strict';

  /* ── PARTICLES ── */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.45';
  document.getElementById('particles').appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeDot() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random(),
    };
  }

  for (let i = 0; i < 80; i++) dots.push(makeDot());

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${d.a * 0.6})`;
      ctx.fill();
    });
    requestAnimationFrame(animParticles);
  }
  animParticles();

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 40
      ? 'rgba(8,8,16,0.97)'
      : 'rgba(8,8,16,0.85)';
  }, { passive: true });

  /* ── MOBILE DRAWER ── */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('navDrawer');
  const scrim = document.getElementById('navScrim');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() { drawer.hidden = false; scrim.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.hidden = true; scrim.hidden = true; document.body.style.overflow = ''; }

  burger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-8% 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObs.observe(el);
  });

  /* ── STAGGERED TIMELINE ── */
  const dayObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.day-item');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-24px)';
          item.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 100 + i * 100);
        });
        dayObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-10% 0px', threshold: 0.1 });

  const timeline = document.querySelector('.days-timeline');
  if (timeline) dayObs.observe(timeline);

  /* ── SIGNALS STAGGER ── */
  const gridObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.signal-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = `opacity .4s ease ${i * 0.07}s, transform .4s ease ${i * 0.07}s`;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50 + i * 70);
        });
        gridObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-10% 0px', threshold: 0.1 });

  const sigGrid = document.querySelector('.signals-grid');
  if (sigGrid) gridObs.observe(sigGrid);

  /* ── COUNTER ANIMATION ── */
  function animCount(el, end, duration, suffix) {
    const start = 0;
    const step = (end / duration) * 16;
    let current = start;
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      el.textContent = Math.round(current) + suffix;
      if (current >= end) clearInterval(timer);
    }, 16);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(n => {
          const text = n.textContent.trim();
          if (text === '∞') return;
          const match = text.match(/(\d+)(\+?)/);
          if (match) animCount(n, parseInt(match[1]), 800, match[2] || '');
        });
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.author-stats');
  if (statsEl) statsObs.observe(statsEl);

})();
