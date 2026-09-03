import { getManifest } from './manifest.js';
import { mountRabbits, initScrollHint } from './mascot.js';
import { categoryIcon, postCategory } from './categories.js';

const ALL_KEY = '전체';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderPostCard(post) {
  const li = document.createElement('li');
  const category = postCategory(post);
  li.innerHTML = `
    <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
      <span class="post-card__tag">${categoryIcon(category)} ${category}</span>
      <h2 class="post-card__title">${post.title}</h2>
      <p class="post-card__excerpt">${post.excerpt || ''}</p>
      <time class="post-card__date" datetime="${post.date}">${formatDate(post.date)}</time>
    </a>
  `;
  return li;
}

function renderState(container, pose, title, message) {
  container.innerHTML = '';
  const panel = document.createElement('li');
  panel.className = 'state-panel';
  panel.style.gridColumn = '1 / -1';

  const rabbitSlot = document.createElement('div');
  rabbitSlot.setAttribute('data-rabbit', pose);
  panel.appendChild(rabbitSlot);

  const heading = document.createElement('p');
  heading.className = 'state-panel__title';
  heading.textContent = title;
  panel.appendChild(heading);

  if (message) {
    const body = document.createElement('p');
    body.textContent = message;
    panel.appendChild(body);
  }

  container.appendChild(panel);
  mountRabbits(container);
}

function renderCategoryNav(nav, categories, activeCategory, onSelect) {
  nav.innerHTML = '';
  const items = [ALL_KEY, ...categories];

  items.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-pill';
    button.classList.toggle('is-active', category === activeCategory);
    button.textContent =
      category === ALL_KEY ? `${ALL_KEY}` : `${categoryIcon(category)} ${category}`;
    button.addEventListener('click', () => onSelect(category));
    nav.appendChild(button);
  });
}

async function init() {
  mountRabbits();
  initScrollHint('.hero', '#scroll-hint');

  const list = document.getElementById('post-list');
  const nav = document.getElementById('category-nav');
  renderState(list, 'loading', '글을 불러오는 중이에요...');

  let posts;
  try {
    posts = await getManifest();
  } catch (err) {
    console.error(err);
    renderState(list, '404', '글 목록을 불러오지 못했어요', '잠시 후 다시 시도해주세요.');
    return;
  }

  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const categories = [...new Set(sorted.map(postCategory))];

  function renderList(activeCategory) {
    const filtered =
      activeCategory === ALL_KEY
        ? sorted
        : sorted.filter((post) => postCategory(post) === activeCategory);

    list.innerHTML = '';
    if (filtered.length === 0) {
      renderState(list, 'loading', '이 카테고리엔 아직 글이 없어요', '곧 새 글로 찾아올게요.');
      return;
    }
    filtered.forEach((post) => list.appendChild(renderPostCard(post)));
  }

  function selectCategory(category, { pushState = true } = {}) {
    renderCategoryNav(nav, categories, category, (next) => selectCategory(next));
    renderList(category);

    const url = new URL(window.location.href);
    if (category === ALL_KEY) {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    if (pushState) {
      window.history.pushState({ category }, '', url);
    }
  }

  const initialCategory = new URLSearchParams(window.location.search).get('category') || ALL_KEY;
  selectCategory(categories.includes(initialCategory) ? initialCategory : ALL_KEY, {
    pushState: false,
  });

  window.addEventListener('popstate', () => {
    const category = new URLSearchParams(window.location.search).get('category') || ALL_KEY;
    selectCategory(categories.includes(category) ? category : ALL_KEY, { pushState: false });
  });
}

init();
