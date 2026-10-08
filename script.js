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

// ===== 네비 스크롤 효과 =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
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

// ===== BEFORE / AFTER 슬라이더 =====
const baSlider = document.getElementById('baSlider');
const baHandle = document.getElementById('baHandle');
const baAfter  = baSlider ? baSlider.querySelector('.ba-after') : null;

if (baSlider && baHandle && baAfter) {
  let isDragging = false;

  function updateSlider(x) {
    const rect   = baSlider.getBoundingClientRect();
    const posX   = Math.max(0, Math.min(x - rect.left, rect.width));
    const pct    = (posX / rect.width) * 100;
    baAfter.style.width  = pct + '%';
    baHandle.style.left  = pct + '%';
  }

  baSlider.addEventListener('mousedown',  (e) => { isDragging = true; updateSlider(e.clientX); });
  window.addEventListener('mousemove',    (e) => { if (isDragging) updateSlider(e.clientX); });
  window.addEventListener('mouseup',      ()  => { isDragging = false; });

  baSlider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',    (e) => { if (isDragging) updateSlider(e.touches[0].clientX); },    { passive: true });
  window.addEventListener('touchend',     ()  => { isDragging = false; });
}

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

function applyLanguage(ko) {
  const attr = ko ? 'data-ko' : 'data-en';

  // 1. 로고
  const logoVal = ko ? '탈모썜' : 'TALMOSSAM';
  if (logoText)   logoText.textContent  = logoVal;
  if (footerLogo) footerLogo.textContent = logoVal;

  // 2. 토글 버튼 레이블
  if (langLabel)    langLabel.textContent    = ko ? 'KO' : 'EN';
  if (langInactive) langInactive.textContent = ko ? 'EN' : 'KO';

  // 3. 히어로 타이틀 (HTML 구조 유지)
  if (heroTitle) {
    heroTitle.innerHTML = ko
      ? '두피문신의<br><span class="accent">새로운 기준</span>'
      : 'The New Standard<br><span class="accent">in SMP</span>';
  }

  // 4. data-ko / data-en 속성을 가진 모든 요소 자동 적용
  document.querySelectorAll('[data-ko][data-en]').forEach(el => {
    const val = el.getAttribute(attr);
    // innerHTML을 허용하는 요소 (br 태그 포함 가능)
    if (val && val.includes('<')) {
      el.innerHTML = val;
    } else if (val) {
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

function onYTStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    showSlides();
  }
}

function showSlides() {
  var frame = document.getElementById('heroYT');
  if (frame) frame.classList.add('fade-out');

  slideTimer = setTimeout(function () {
    showVideo();
  }, SLIDE_CYCLE);
}

function showVideo() {
  var frame = document.getElementById('heroYT');
  if (frame) frame.classList.remove('fade-out');
  if (ytPlayer && ytPlayer.seekTo) {
    ytPlayer.seekTo(0);
    ytPlayer.playVideo();
  }
}
