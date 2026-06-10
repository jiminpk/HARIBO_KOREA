/**
 * main.js — Haribo Korea
 *
 * 모듈 구성:
 *   initSwipers()       — 모든 Swiper 인스턴스 초기화
 *   initCommunity()     — Section 2 토글 & 카드 인터랙션
 *   initHeader()        — 스크롤 헤더 효과
 *   initGoTop()         — 상단으로 스크롤 버튼
 *   initFadeIn()        — IntersectionObserver 페이드 인
 *   initLineupCards()   — 라인업 카드 hover / ripple
 *   initHamburger()     — 모바일 햄버거 메뉴
 *   initNewsletter()    — 뉴스레터 구독 피드백
 *   initCursorTrail()   — 커스텀 커서 (데스크탑 전용)
 */

/* =========================================
   Swipers
========================================= */
function initSwipers() {
  // Hero
  new Swiper('.main-visual', {
    loop: true,
    speed: 800,
    autoplay: { delay: 3000, disableOnInteraction: false },
    slidesPerView: 1,
    pagination: { el: '.main-visual .swiper-pagination', clickable: true },
  });

  // Section 1: Content — 슬라이드 높이 균등화
  const contentSwiper = new Swiper('.section-content', {
    loop: true,
    speed: 800,
    navigation: {
      nextEl: '.section-content .swiper-button-next',
      prevEl: '.section-content .swiper-button-prev',
    },
    autoplay: { delay: 5000, disableOnInteraction: false },
    on: {
      init(swiper) { equalizeContentSlides(swiper); },
      resize(swiper) { equalizeContentSlides(swiper); },
    },
  });

  function equalizeContentSlides(swiper) {
    // 모든 슬라이드 높이 초기화 후 최대값 측정
    const slides = swiper.el.querySelectorAll('.swiper-slide');
    slides.forEach(s => s.style.height = '');
    let maxH = 0;
    slides.forEach(s => { maxH = Math.max(maxH, s.offsetHeight); });
    if (maxH > 0) slides.forEach(s => s.style.height = maxH + 'px');
  }

  // Section 3: Goods
  new Swiper('.section-goods', {
    loop: true,
    speed: 1000,
    autoplay: { delay: 3000, disableOnInteraction: false },
    slidesPerView: 1,
    navigation: {
      nextEl: '.section-goods .swiper-button-next',
      prevEl: '.section-goods .swiper-button-prev',
    },
  });

  // Section 4: Lineup
  new Swiper('.lineup-swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    breakpoints: {
      480: { slidesPerView: 1,  slidesPerGroup: 1,  spaceBetween: 16  },
      768: { slidesPerView: 2,  slidesPerGroup: 2,  spaceBetween: 20  },
      1024: { slidesPerView: 3, slidesPerGroup: 3,  spaceBetween: 30  },
      1280: { slidesPerView: 4, slidesPerGroup: 4,  spaceBetween: 40  },
    },
    scrollbar: {
      el: '.section-lineup .swiper-scrollbar',
      draggable: true,
      hide: false,
    },
    navigation: {
      nextEl: '.section-lineup .swiper-button-next',
      prevEl: '.section-lineup .swiper-button-prev',
    },
  });

  // Section 5: About Us
  new Swiper('.about-swiper', {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: false,
    pagination: { el: '.about-pagination', clickable: true },
  });
}


/* =========================================
   Section 2: Community
========================================= */
function initCommunity() {
  const section     = document.querySelector('.section-card');
  const toggleInput = document.querySelector('.toggle-switch input');
  const cards       = document.querySelectorAll('.card-item');
  const darkBg      = document.querySelector('.section-card .dark');

  if (!section) return;

  const open  = () => { section.classList.add('active');    if (toggleInput) toggleInput.checked = true; };
  const close = () => { section.classList.remove('active'); if (toggleInput) toggleInput.checked = false; };

  if (toggleInput) {
    toggleInput.addEventListener('change', () => {
      toggleInput.checked ? open() : close();
    });
  }

  cards.forEach(card => card.addEventListener('click', open));

  if (darkBg) {
    darkBg.addEventListener('click', close);
  }
}


/* =========================================
   Header: 스크롤 시 배경 강화
========================================= */
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* =========================================
   Go Top 버튼
========================================= */
function initGoTop() {
  const btn = document.getElementById('goTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* =========================================
   Fade-in (IntersectionObserver)
========================================= */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}


/* =========================================
   Lineup 카드: hover 이미지 확대 + Ripple
========================================= */
function initLineupCards() {
  document.querySelectorAll('.lineup-card').forEach(card => {
    // Hover
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.img-box img');
      if (img) img.style.transform = 'scale(1.07)';
    });
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.img-box img');
      if (img) img.style.transform = 'scale(1)';
    });

    // Ripple
    card.addEventListener('click', (e) => {
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top  - size / 2}px;
      `;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* =========================================
   햄버거 메뉴
========================================= */
function initHamburger() {
  const btn     = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!btn || !overlay) return;

  const close = () => {
    btn.classList.remove('is-open');
    overlay.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('is-open');
    overlay.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
}


/* =========================================
   뉴스레터 구독 피드백
========================================= */
function initNewsletter() {
  const btn   = document.querySelector('.subscribe-btn');
  const input = document.querySelector('.subscribe-input');
  if (!btn || !input) return;

  // 체크 아이콘 삽입
  btn.innerHTML = `
    <span class="arrow-text">❯</span>
    <svg class="check-icon" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;

  btn.addEventListener('click', () => {
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      input.style.outline = '2px solid #E3000F';
      input.focus();
      setTimeout(() => (input.style.outline = ''), 1200);
      return;
    }

    btn.classList.add('success');
    input.value = '';
    input.placeholder = '구독 완료! 감사합니다 🎉';
    input.disabled = true;

    setTimeout(() => {
      btn.classList.remove('success');
      input.placeholder = 'Enter your email';
      input.disabled = false;
    }, 3500);
  });
}


/* =========================================
   커스텀 커서 트레일 (데스크탑)
========================================= */
function initCursorTrail() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot  = Object.assign(document.createElement('div'), { className: 'cursor-dot'  });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  document.body.append(dot, ring);

  let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    mouseX = clientX;
    mouseY = clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    requestAnimationFrame(animateRing);
  })();

  // 호버 가능 요소에서 ring 확대
  const hoverEls = 'a, button, .card-item, .lineup-card, .support-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}


/* =========================================
   Init
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  initSwipers();
  initCommunity();
  initHeader();
  initGoTop();
  initFadeIn();
  initLineupCards();
  initHamburger();
  initNewsletter();
  initCursorTrail();
});