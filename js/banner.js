// Top banner: time-of-day greeting, a live analog clock + date/time text,
// and a simple per-browser visit counter (stored in localStorage — this
// counts visits from this device only, not a global visitor count).

function greetingForHour(hour) {
  if (hour >= 5 && hour < 10) return '좋은 아침이에요! 오늘도 힘차게 시작해봐요 🌅';
  if (hour >= 10 && hour < 17) return '오늘도 좋은 하루 보내고 계신가요? 🌸';
  if (hour >= 17 && hour < 21) return '편안한 저녁 시간 보내세요 🌇';
  return '포근한 밤 되세요, 오늘도 수고하셨어요 🌙';
}

function updateGreeting() {
  const el = document.getElementById('banner-greeting');
  if (!el) return;
  el.textContent = greetingForHour(new Date().getHours());
}

function updateClock() {
  const now = new Date();
  const hourHand = document.getElementById('clock-hour');
  const minuteHand = document.getElementById('clock-minute');
  const secondHand = document.getElementById('clock-second');

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (hourHand) hourHand.style.transform = `rotate(${hours * 30 + minutes * 0.5}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minutes * 6 + seconds * 0.1}deg)`;
  if (secondHand) secondHand.style.transform = `rotate(${seconds * 6}deg)`;

  const dateEl = document.getElementById('banner-date');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  }

  const timeEl = document.getElementById('banner-time');
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
}

function updateVisitorCount() {
  const el = document.getElementById('banner-visitors');
  if (!el) return;

  try {
    const COUNT_KEY = 'rabbit-blog-visit-count';
    const SESSION_KEY = 'rabbit-blog-session-counted';

    let count = Number(localStorage.getItem(COUNT_KEY) || '0');
    if (!sessionStorage.getItem(SESSION_KEY)) {
      count += 1;
      localStorage.setItem(COUNT_KEY, String(count));
      sessionStorage.setItem(SESSION_KEY, '1');
    }
    el.textContent = `이 기기 방문 ${count}회`;
  } catch (err) {
    el.textContent = '';
  }
}

export function initBanner() {
  updateGreeting();
  updateClock();
  updateVisitorCount();
  setInterval(updateClock, 1000);
  setInterval(updateGreeting, 60000);
}
