// ===== EmailJS 설정 =====
// 1. https://emailjs.com 에서 무료 가입
// 2. Email Service 추가 (Gmail 선택)
// 3. Email Template 생성
// 4. 아래 값을 본인 계정 정보로 교체
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // Account > API Keys
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // Email Services
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // Email Templates

(function () { emailjs.init(EMAILJS_PUBLIC_KEY); })();

// ===== AOS 초기화 =====
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

// ===== 네비 스크롤 효과 + 플로팅 버튼 표시 =====
const navbar      = document.getElementById('navbar');
const floatingBtns = document.querySelector('.floating-btns');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (floatingBtns) floatingBtns.classList.toggle('visible', window.scrollY > 200);
});

// ===== 모바일 메뉴 =====
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ===== 활성 네비 링크 =====
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== 예약 폼 제출 (EmailJS) =====
const bookingForm  = document.getElementById('bookingForm');
const submitBtn    = document.getElementById('submitBtn');
const submitText   = document.getElementById('submitText');
const submitLoading = document.getElementById('submitLoading');
const formMessage  = document.getElementById('formMessage');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // 로딩 상태
    submitBtn.disabled    = true;
    submitText.style.display   = 'none';
    submitLoading.style.display = 'inline';
    formMessage.className = 'form-message';

    const templateParams = {
      from_name:    document.getElementById('name').value,
      from_phone:   document.getElementById('phone').value,
      service_type: document.getElementById('service').value,
      desired_date: document.getElementById('date').value,
      message:      document.getElementById('message').value,
      reply_to:     document.getElementById('phone').value,
    };

    // honeypot 봇 감지
    if (document.querySelector('[name="_honey"]') &&
        document.querySelector('[name="_honey"]').value) {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        formMessage.textContent = '✓ 예약 신청이 완료되었습니다! 빠른 시간 내에 연락드리겠습니다.';
        formMessage.className   = 'form-message success';
        bookingForm.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        // EmailJS 미설정 시 안내 메시지
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
          formMessage.textContent = '⚠ EmailJS 설정이 필요합니다. script.js 상단의 KEY 값을 입력해주세요.';
        } else {
          formMessage.textContent = '전송 중 오류가 발생했습니다. 카카오톡 또는 전화로 문의해 주세요.';
        }
        formMessage.className = 'form-message error';
      })
      .finally(() => {
        submitBtn.disabled     = false;
        submitText.style.display    = 'inline';
        submitLoading.style.display = 'none';
      });
  });
}

// ===== 날짜 입력 최소값 (오늘 이후) =====
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// ===== KO / EN 언어 토글 =====
const langToggle   = document.getElementById('langToggle');
const logoText     = document.getElementById('logoText');
const footerLogo   = document.getElementById('footerLogoText');
const langLabel    = document.getElementById('langLabel');
const langInactive = langToggle ? langToggle.querySelector('.lang-inactive') : null;
const heroTitle    = document.getElementById('heroTitle');

let isKorean = false;  // 기본값: 영문

// <br>만 허용하고 나머지 태그 제거 (XSS 방지)
function safeBrHtml(str) {
  const div = document.createElement('div');
  div.textContent = str.replace(/<br\s*\/?>/gi, '\x00BR\x00');
  return div.innerHTML.replace(/\x00BR\x00/g, '<br>');
}

function applyLanguage(ko) {
  const attr = ko ? 'data-ko' : 'data-en';

  // html lang 속성 + 탭 제목 동기화
  document.documentElement.lang = ko ? 'ko' : 'en';
  document.title = ko ? '탈모썜 | SMP 두피문신 전문' : 'TALMOSSAM | Scalp Micropigmentation';

  // 1. 로고
  const logoVal = ko ? '탈모썜' : 'TALMOSSAM';
  if (logoText)   logoText.textContent  = logoVal;
  if (footerLogo) footerLogo.textContent = logoVal;

  // 2. 토글 버튼 레이블
  if (langLabel)    langLabel.textContent    = ko ? 'KO' : 'EN';
  if (langInactive) langInactive.textContent = ko ? 'EN' : 'KO';

  // 3. 히어로 타이틀
  if (heroTitle) {
    heroTitle.innerHTML = ko
      ? '두피문신의<br><span class="accent">새로운 기준</span>'
      : 'The New Standard<br><span class="accent">in SMP</span>';
  }

  // 4. data-ko / data-en 속성 요소 적용 (<br>만 허용, 나머지 태그 제거)
  document.querySelectorAll('[data-ko][data-en]').forEach(el => {
    const val = el.getAttribute(attr);
    if (!val) return;
    if (val.includes('<br') || val.includes('<BR')) {
      el.innerHTML = safeBrHtml(val);
    } else {
      el.textContent = val;
    }
  });
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    isKorean = !isKorean;
    applyLanguage(isKorean);
  });
}

// 페이지 로드 시 기본 언어 적용
applyLanguage(isKorean);

// 저작권 연도 자동 갱신
const yearEl = document.getElementById('copyrightYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== 부드러운 스크롤 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ===== 숫자 카운트 업 애니메이션 =====
function animateCount(el, end, suffix) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * end) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const numberEls = document.querySelectorAll('.number');
const numberData = [
  { end: 500, suffix: '+' },
  { end: 98,  suffix: '%' },
  { end: 5,   suffix: '년+' },
  { end: 0,   suffix: '건' },
];

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numItem = entry.target.closest('.number-item');
    if (numItem) numItem.classList.add('slot-fire');
    const idx = Array.from(numberEls).indexOf(entry.target);
    if (idx < 0) return;
    const { end, suffix } = numberData[idx];
    entry.target.innerHTML = '0' + `<span>${suffix}</span>`;
    animateCount({ set textContent(v) { entry.target.innerHTML = v + `<span>${suffix}</span>`; } }, end, '');
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

numberEls.forEach(el => countObserver.observe(el));

// ===== 유튜브 영상 → 슬라이드 → 영상 반복 시퀀스 =====
var ytTag = document.createElement('script');
ytTag.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytTag);

var ytPlayer;
var slideTimer = null;
var SLIDE_CYCLE = 24000; // 슬라이드 1순환 = 24초 (6초 × 4장)

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('heroYT', {
    events: { onStateChange: onYTStateChange }
  });
};

// YT 로드 차단 환경 안전망 — 5초 후에도 플레이어 없으면 슬라이드로 전환
setTimeout(function () {
  if (!ytPlayer) showSlides();
}, 5000);

function onYTStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    showSlides();
  }
}

function showSlides() {
  var overlay = document.getElementById('heroTransitionOverlay');
  var frame   = document.getElementById('heroYT');

  // 1단계: 화면 어둡게
  if (overlay) overlay.classList.add('active');

  setTimeout(function () {
    // 2단계: 어두운 상태에서 영상 숨김
    if (frame) frame.classList.add('fade-out');

    setTimeout(function () {
      // 3단계: 다시 밝아지며 슬라이드 노출
      if (overlay) overlay.classList.remove('active');

      // 슬라이드 24초 후 영상으로 복귀
      slideTimer = setTimeout(showVideo, SLIDE_CYCLE);
    }, 100);
  }, 750);
}

function showVideo() {
  var overlay = document.getElementById('heroTransitionOverlay');
  var frame   = document.getElementById('heroYT');

  // 1단계: 화면 어둡게
  if (overlay) overlay.classList.add('active');

  setTimeout(function () {
    // 2단계: 어두운 상태에서 영상 표시 후 재생
    if (frame) frame.classList.remove('fade-out');
    if (ytPlayer && ytPlayer.seekTo) {
      ytPlayer.seekTo(0);
      ytPlayer.playVideo();
    }

    setTimeout(function () {
      // 3단계: 다시 밝아지며 영상 노출
      if (overlay) overlay.classList.remove('active');
    }, 100);
  }, 750);
}

// ===== 스크롤 진행 표시바 =====
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ===== 커스텀 커서 (pointer 디바이스만) =====
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const outer = document.getElementById('cursorOuter');
  const dot   = document.getElementById('cursorDot');
  if (!outer || !dot) return;

  let mx = -200, my = -200;
  let ox = -200, oy = -200;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    outer.classList.add('visible');
    dot.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    outer.classList.remove('visible');
    dot.classList.remove('visible');
  });

  // 링 따라오기 — 약간 지연
  function lerp(a, b, t) { return a + (b - a) * t; }
  (function animCursor() {
    ox = lerp(ox, mx, 0.12);
    oy = lerp(oy, my, 0.12);
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    requestAnimationFrame(animCursor);
  })();

  // hover 상태
  document.querySelectorAll('a, button, .filter-btn, .portfolio-item, .service-card, .pricing-card').forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('hovering'));
    el.addEventListener('mouseleave', () => outer.classList.remove('hovering'));
  });
})();

// ===== 히어로 커튼 제거 =====
(function () {
  const curtain = document.getElementById('heroCurtain');
  if (!curtain) return;
  setTimeout(() => { curtain.style.display = 'none'; }, 1400);
})();

// ===== 스크롤 Parallax =====
(function () {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;
  window.addEventListener('scroll', () => {
    parallaxEls.forEach(el => {
      const rect  = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const mid   = window.innerHeight / 2;
      const offset = (mid - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
})();

// ===== 스크롤 Reveal (reveal-up) =====
(function () {
  const items = document.querySelectorAll('.reveal-up');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
})();

// ===== 포트폴리오 필터 =====
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) item.classList.add('revealed');
      });
    });
  });
})();

// ===== 고객 후기 슬라이더 =====
(function () {
  const track    = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn  = document.getElementById('revPrev');
  const nextBtn  = document.getElementById('revNext');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let autoTimer;

  function getPerPage() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function maxIdx() {
    return Math.max(0, cards.length - getPerPage());
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIdx(); i++) {
      const d = document.createElement('button');
      d.className = 'review-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => slide(i));
      dotsWrap.appendChild(d);
    }
  }

  function getStep() {
    if (!cards.length) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function slide(n) {
    current = Math.max(0, Math.min(n, maxIdx()));
    track.style.transform = `translateX(-${current * getStep()}px)`;
    dotsWrap.querySelectorAll('.review-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(autoTimer);  // 중복 타이머 방지
    autoTimer = setInterval(() => slide(current >= maxIdx() ? 0 : current + 1), 4000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  buildDots();
  startAuto();

  prevBtn && prevBtn.addEventListener('click', () => { stopAuto(); slide(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { stopAuto(); slide(current + 1); startAuto(); });

  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  let touchX = 0;
  track.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   (e) => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    stopAuto();
    slide(diff > 0 ? current + 1 : current - 1);
    startAuto();
  }, { passive: true });

  window.addEventListener('resize', () => { buildDots(); slide(Math.min(current, maxIdx())); stopAuto(); startAuto(); });
})();

// ===== About 텍스트 라인별 등장 =====
(function () {
  const lines = document.querySelectorAll('.text-reveal-line');
  if (!lines.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = Array.from(lines).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('revealed'), idx * 70);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  lines.forEach(el => obs.observe(el));
})();

// ===== 히어로 마우스 패럴랙스 =====
(function () {
  const hero  = document.getElementById('hero');
  const vWrap = document.querySelector('.hero-video-wrap');
  const hCont = document.querySelector('.hero-content');
  if (!hero || !vWrap) return;
  hero.addEventListener('mousemove', (e) => {
    const r  = hero.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    vWrap.style.transform = `translate(${dx * -7}px, ${dy * -4}px) scale(1.03)`;
    if (hCont) hCont.style.transform = `translate(${dx * 3}px, ${dy * 2}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    vWrap.style.transform = '';
    if (hCont) hCont.style.transform = '';
  });
})();

// ===== BA 드래그 슬라이더 =====
(function () {
  const slider  = document.getElementById('baSlider');
  const after   = document.getElementById('baAfter');
  const divider = document.getElementById('baDivider');
  if (!slider || !after || !divider) return;

  let dragging = false;

  function setPos(clientX) {
    const r = slider.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - r.left) / r.width) * 100));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left   = pct + '%';
  }

  divider.addEventListener('mousedown',  (e) => { dragging = true; e.preventDefault(); });
  slider.addEventListener( 'mousemove',  (e) => { if (dragging) setPos(e.clientX); });
  document.addEventListener('mouseup',   ()  => { dragging = false; });

  divider.addEventListener('touchstart', ()  => { dragging = true; }, { passive: true });
  slider.addEventListener( 'touchmove',  (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend',  ()  => { dragging = false; });
})();

// ===== 가격 카드 등장 =====
(function () {
  const cards = document.querySelectorAll('.pricing-card');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('price-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  cards.forEach(c => obs.observe(c));
})();

// ===== 도트 네비게이션 =====
(function () {
  const dots = document.querySelectorAll('.dot-nav-item');
  if (!dots.length) return;
  const allSections = document.querySelectorAll('section[id]');

  function updateDots() {
    let current = 'hero';
    allSections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.4) current = sec.id;
    });
    dots.forEach(d => d.classList.toggle('active', d.dataset.dot === current));
  }

  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
})();
