import { getManifest } from './manifest.js';
import { mountRabbits, initScrollHint } from './mascot.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderPostCard(post) {
  const li = document.createElement('li');
  const tag = post.tags && post.tags[0];
  li.innerHTML = `
    <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
      ${tag ? `<span class="post-card__tag">${tag}</span>` : ''}
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

async function init() {
  mountRabbits();
  initScrollHint('.hero', '#scroll-hint');

  const list = document.getElementById('post-list');
  renderState(list, 'loading', '글을 불러오는 중이에요...');

  try {
    const posts = await getManifest();
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
      renderState(list, 'loading', '아직 게시된 글이 없어요', '곧 새 글로 찾아올게요.');
      return;
    }

    list.innerHTML = '';
    sorted.forEach((post) => list.appendChild(renderPostCard(post)));
  } catch (err) {
    console.error(err);
    renderState(list, '404', '글 목록을 불러오지 못했어요', '잠시 후 다시 시도해주세요.');
  }
}

init();
