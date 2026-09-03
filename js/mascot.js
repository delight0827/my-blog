// Shared rabbit mascot: one SVG template, reused across poses (hero, hint,
// loading, 404, back-to-top, footer). Each pose gets its animation behavior
// from css/mascot.css based on the `rabbit--<pose>` class.

function buildRabbitMarkup(pose) {
  const armRightTransform =
    pose === 'hint' ? 'translate(133,110) rotate(70)' : 'translate(133,116) rotate(18)';

  const extras = [];

  if (pose === '404') {
    extras.push(
      '<text class="rabbit-question" x="140" y="44" font-size="30" font-weight="700" ' +
        'fill="var(--color-accent-strong)" font-family="var(--font-family-base)">?</text>'
    );
  }

  if (pose === 'loading') {
    extras.push(
      '<g transform="translate(72,150)">' +
        '<rect x="0" y="0" width="56" height="14" rx="4" fill="var(--color-white)" ' +
        'stroke="var(--color-text-primary)" stroke-width="2.5"/>' +
        '<line x1="28" y1="0" x2="28" y2="14" stroke="var(--color-text-primary)" stroke-width="2"/>' +
        '</g>'
    );
  }

  return `
<svg class="rabbit rabbit--${pose}" viewBox="0 0 200 200" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="rabbit-shadow" cx="100" cy="180" rx="46" ry="8" fill="var(--color-bg-mid)" opacity="0.6"></ellipse>
  <g class="rabbit-body-wrap">
    <g transform="translate(138,152)">
      <circle class="rabbit-tail" cx="0" cy="0" r="10" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="2.5"></circle>
    </g>
    <ellipse class="rabbit-body" cx="100" cy="142" rx="44" ry="38" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></ellipse>
    <g transform="translate(88,58) rotate(-10)">
      <g class="rabbit-ear-left">
        <rect x="-11" y="-68" width="22" height="70" rx="11" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></rect>
        <rect x="-5" y="-58" width="10" height="48" rx="5" fill="var(--color-bg-mid)"></rect>
      </g>
    </g>
    <g transform="translate(112,58) rotate(10)">
      <g class="rabbit-ear-right">
        <rect x="-11" y="-68" width="22" height="70" rx="11" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></rect>
        <rect x="-5" y="-58" width="10" height="48" rx="5" fill="var(--color-bg-mid)"></rect>
      </g>
    </g>
    <circle class="rabbit-head" cx="100" cy="92" r="38" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></circle>
    <ellipse class="rabbit-cheek-left" cx="78" cy="102" rx="8" ry="6" fill="var(--color-bg-mid)"></ellipse>
    <ellipse class="rabbit-cheek-right" cx="122" cy="102" rx="8" ry="6" fill="var(--color-bg-mid)"></ellipse>
    <circle class="rabbit-eye-left" cx="86" cy="90" r="4" fill="var(--color-text-primary)"></circle>
    <circle class="rabbit-eye-right" cx="114" cy="90" r="4" fill="var(--color-text-primary)"></circle>
    <path class="rabbit-nose" d="M100 98 l-5 6 h10 z" fill="var(--color-accent)"></path>
    <path class="rabbit-mouth" d="M92 106 q8 8 16 0" fill="none" stroke="var(--color-text-primary)" stroke-width="2.5" stroke-linecap="round"></path>
    <g transform="translate(67,116) rotate(-16)">
      <g class="rabbit-arm-left">
        <rect x="-8" y="0" width="16" height="46" rx="8" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></rect>
      </g>
    </g>
    <g transform="${armRightTransform}">
      <g class="rabbit-arm-right">
        <rect x="-8" y="0" width="16" height="46" rx="8" fill="var(--color-white)" stroke="var(--color-text-primary)" stroke-width="3"></rect>
      </g>
    </g>
  </g>
  ${extras.join('')}
</svg>`.trim();
}

export function createRabbit(pose) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildRabbitMarkup(pose);
  return wrapper.firstElementChild;
}

export function mountRabbits(root = document) {
  root.querySelectorAll('[data-rabbit]').forEach((slot) => {
    const pose = slot.getAttribute('data-rabbit');
    slot.replaceWith(createRabbit(pose));
  });
}

export function initScrollHint(heroSelector, hintSelector) {
  const hero = document.querySelector(heroSelector);
  const hint = document.querySelector(hintSelector);
  if (!hero || !hint || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      hint.classList.toggle('is-hidden', !entry.isIntersecting);
    },
    { threshold: 0.4 }
  );
  observer.observe(hero);
}

export function initBackToTop(buttonSelector) {
  const button = document.querySelector(buttonSelector);
  if (!button) return;

  const toggleVisible = () => {
    button.classList.toggle('is-visible', window.scrollY > 600);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      toggleVisible();
      ticking = false;
    });
  });
  toggleVisible();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    button.classList.remove('is-hopping');
    // restart the burst animation even if triggered twice in a row
    void button.offsetWidth;
    button.classList.add('is-hopping');
    setTimeout(() => button.classList.remove('is-hopping'), 500);
  });
}
