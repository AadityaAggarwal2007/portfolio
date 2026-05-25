import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ===== SMOOTH SCROLL =====
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
(function tick() {
  cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
  fx += (mx - fx) * 0.06; fy += (my - fy) * 0.06;
  if (cursor) cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  if (follower) follower.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
  requestAnimationFrame(tick);
})();

document.querySelectorAll('a,.initiative-card,.pillar-card,.dept-card,.number-card,.role-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) Object.assign(cursor.style, { width: '10px', height: '10px' });
    if (follower) Object.assign(follower.style, { width: '56px', height: '56px', borderColor: 'var(--gold)' });
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) Object.assign(cursor.style, { width: '6px', height: '6px' });
    if (follower) Object.assign(follower.style, { width: '40px', height: '40px', borderColor: 'var(--text4)' });
  });
});

// ===== INTRO SEQUENCE =====
const loader = document.getElementById('loader');
const squareWrap = document.querySelector('.loader-square-wrap');
const portrait = document.querySelector('.hero-portrait img');
const collageBg = document.querySelector('.hero-collage-bg');
const heroContent = document.querySelector('.hero-content');
const portraitWrap = document.querySelector('.hero-portrait');


// Hide hero elements initially
if (portrait) { portrait.style.opacity = '0'; portrait.style.transition = 'none'; }
if (collageBg) collageBg.style.opacity = '0';
if (heroContent) heroContent.style.opacity = '0';
gsap.set(['.hero-badge', '.title-line', '.hero-subtitle', '.hero-stat', '.hero-stat-divider', '.hero-scroll-indicator'], { opacity: 0, y: 20 });

// Phase 1: Square spins for 2s
setTimeout(() => {
  // Phase 2: Hide square, reveal words one by one
  if (squareWrap) squareWrap.classList.add('hide');
  setTimeout(() => {
    if (squareWrap) squareWrap.style.display = 'none';

    const words = document.querySelectorAll('.joke-word');
    const wordDelay = 250;
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), i * wordDelay);
    });

    const totalWordTime = words.length * wordDelay;
    setTimeout(() => {
      // Phase 3: Hide joke text — loader stays as BLACK SCREEN
      const jokeEl = document.querySelector('.loader-joke');
      if (jokeEl) jokeEl.style.display = 'none';

      // Clone portrait onto BODY (not loader) so it persists during loader fade
      if (portrait && loader) {
        const soloImg = portrait.cloneNode(true);
        const isMobile = window.innerWidth <= 640;
        const rect = portrait.getBoundingClientRect();
        const rightPos = window.innerWidth - rect.right;

        if (isMobile) {
          // Mobile: center the portrait, smaller height
          soloImg.style.cssText = `height:clamp(320px,55vh,480px);width:auto;object-fit:contain;display:block;opacity:1;filter:drop-shadow(0 0 3px rgba(255,255,255,.8)) drop-shadow(0 0 20px rgba(255,255,255,.25));position:fixed;bottom:0;left:50%;z-index:100000;transform:translateX(-50%) translateY(100%) scale(1.1);transition:transform .8s cubic-bezier(.22,1,.36,1);transform-origin:bottom center;`;
        } else {
          soloImg.style.cssText = `height:clamp(640px,100vh,950px);width:auto;object-fit:contain;display:block;opacity:1;filter:drop-shadow(0 0 3px rgba(255,255,255,.8)) drop-shadow(0 0 20px rgba(255,255,255,.25));position:fixed;bottom:0;right:${rightPos}px;z-index:100000;transform:translateY(100%) scale(1.15);transition:transform .8s cubic-bezier(.22,1,.36,1);transform-origin:bottom right;`;
        }
        document.body.appendChild(soloImg);

        // Trigger slide-up animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (isMobile) {
              soloImg.style.transform = 'translateX(-50%) translateY(0) scale(1.1)';
            } else {
              soloImg.style.transform = 'translateY(0) scale(1.15)';
            }
          });
        });

        // Phase 4: Once slide-up is mostly done, start smooth shrink + reveal
        setTimeout(() => {
          // Smooth shrink from scale → 1 and white glow → normal shadow
          soloImg.style.transition = 'transform 1.2s cubic-bezier(.25,.46,.45,.94), filter 1s ease-out, opacity .6s ease-out .6s';
          if (isMobile) {
            soloImg.style.transform = 'translateX(-50%) translateY(0) scale(1)';
          } else {
            soloImg.style.transform = 'translateY(0) scale(1)';
          }
          soloImg.style.filter = 'drop-shadow(0 20px 60px rgba(0,0,0,.7)) drop-shadow(0 4px 24px rgba(0,0,0,.5))';
          soloImg.style.opacity = '0';

          // Show the real portrait underneath
          portrait.style.transition = 'none';
          portrait.style.opacity = '1';
          portrait.style.filter = 'drop-shadow(0 20px 60px rgba(0,0,0,.7)) drop-shadow(0 4px 24px rgba(0,0,0,.5))';

          // Fade out loader smoothly
          loader.style.transition = 'opacity .6s ease-out';
          loader.classList.add('loaded');

          // Show collage
          if (collageBg) {
            collageBg.style.transition = 'opacity .6s ease-out';
            collageBg.style.opacity = '1';
          }
          // Show text container
          if (heroContent) {
            heroContent.style.transition = 'opacity .6s ease-out';
            heroContent.style.opacity = '1';
          }

          // Stagger text animations
          setTimeout(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.5 })
              .to('.title-line', { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.2')
              .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
              .to('.hero-stat, .hero-stat-divider', { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, '-=0.2')
              .to('.hero-scroll-indicator', { opacity: 1, y: 0, duration: 0.4 }, '-=0.1');
            gsap.to('.title-outline', { opacity: 0.5, duration: 0 });
          }, 200);

          // Counter animation
          document.querySelectorAll('.hero-stat .stat-number[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            gsap.fromTo(el, { textContent: 0 }, {
              textContent: target, duration: 2, delay: 0.6, ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate() { el.textContent = Math.floor(parseFloat(el.textContent)).toLocaleString(); }
            });
          });

          // Clean up clone after all transitions complete
          setTimeout(() => { soloImg.remove(); }, 1400);
        }, 600);
      }
    }, totalWordTime + 350);
  }, 350);
}, 1000);

// ===== SCROLL REVEALS =====
document.querySelectorAll('[data-animate]').forEach(el => {
  if (el.closest('.hero-section')) return;
  ScrollTrigger.create({
    trigger: el, start: 'top 88%',
    onEnter: () => el.classList.add('visible'),
  });
});

// ===== NAV =====
const nav = document.getElementById('main-nav');
ScrollTrigger.create({
  start: 80,
  onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 80)
});

const sections = document.querySelectorAll('.section');
sections.forEach(s => {
  ScrollTrigger.create({
    trigger: s, start: 'top 50%', end: 'bottom 50%',
    onEnter: () => setActive(s.id),
    onEnterBack: () => setActive(s.id),
  });
});
function setActive(id) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === id));
}
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.getElementById(l.dataset.section);
    if (t) lenis.scrollTo(t, { offset: -60 });
  });
});

// ===== NUMBER COUNTERS =====
document.querySelectorAll('.number-value[data-count]').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dec = target % 1 !== 0;

  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target, duration: 2.2, ease: 'power2.out',
        snap: dec ? { textContent: 0.1 } : { textContent: 1 },
        onUpdate() {
          const v = parseFloat(el.textContent);
          el.textContent = dec ? prefix + v.toFixed(1) + suffix : prefix + Math.floor(v).toLocaleString() + suffix;
        }
      });
    }
  });
});

// ===== TIMELINE AUTO-EXPAND ON SCROLL =====
document.querySelectorAll('.zig-card[data-expandable]').forEach(card => {
  const details = card.querySelector('.zig-details');
  const btn = card.querySelector('.zig-toggle');

  ScrollTrigger.create({
    trigger: card,
    start: 'top 70%',
    end: 'bottom 30%',
    onEnter: () => {
      details.classList.add('open');
      if (btn) { btn.textContent = 'Hide Details'; btn.classList.add('active'); }
    },
    onLeave: () => {
      details.classList.remove('open');
      if (btn) { btn.textContent = 'View Details'; btn.classList.remove('active'); }
    },
    onEnterBack: () => {
      details.classList.add('open');
      if (btn) { btn.textContent = 'Hide Details'; btn.classList.add('active'); }
    },
    onLeaveBack: () => {
      details.classList.remove('open');
      if (btn) { btn.textContent = 'View Details'; btn.classList.remove('active'); }
    },
  });

  // Keep manual toggle as fallback
  if (btn) {
    btn.addEventListener('click', () => {
      details.classList.toggle('open');
      const isOpen = details.classList.contains('open');
      btn.textContent = isOpen ? 'Hide Details' : 'View Details';
      btn.classList.toggle('active', isOpen);
    });
  }
});

// ===== DEPT TIMELINE SCROLL REVEAL =====
document.querySelectorAll('.dept-timeline[data-scroll-reveal]').forEach(tl => {
  ScrollTrigger.create({
    trigger: tl,
    start: 'top 85%',
    end: 'bottom 20%',
    onEnter: () => tl.classList.add('revealed'),
    onLeave: () => tl.classList.remove('revealed'),
    onEnterBack: () => tl.classList.add('revealed'),
    onLeaveBack: () => tl.classList.remove('revealed'),
  });
});

// ===== PARALLAX ORBS =====
gsap.to('.hero-orb-1', { y: -80, scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 } });
gsap.to('.hero-orb-2', { y: -40, x: 30, scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 } });

// ===== CARD TILT =====
document.querySelectorAll('.initiative-card, .pillar-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
