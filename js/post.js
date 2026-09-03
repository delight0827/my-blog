import { getManifest } from './manifest.js';
import { loadMarkdown } from './markdown.js';
import { mountRabbits, initBackToTop } from './mascot.js';
import { categoryIcon, postCategory } from './categories.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderNotFound() {
  const meta = document.getElementById('post-meta');
  const content = document.getElementById('post-content');
  meta.innerHTML = '';
  content.innerHTML = `
    <div class="state-panel">
      <div data-rabbit="404"></div>
      <h1 class="state-panel__title">이 글을 찾을 수 없어요</h1>
      <p>주소가 잘못되었거나, 삭제된 글일 수 있어요.</p>
      <a class="state-panel__back" href="index.html">홈으로 돌아가기</a>
    </div>
  `;
  mountRabbits(content);
}

async function init() {
  mountRabbits();
  initBackToTop('#back-to-top');

  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    renderNotFound();
    return;
  }

  try {
    const posts = await getManifest();
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      renderNotFound();
      return;
    }

    document.title = `${post.title} · 토끼 블로그`;

    const meta = document.getElementById('post-meta');
    const category = postCategory(post);
    meta.innerHTML = `
      <a class="post-meta__tag" href="index.html?category=${encodeURIComponent(category)}">${categoryIcon(category)} ${category}</a>
      <h1 class="post-meta__title">${post.title}</h1>
      <time class="post-meta__date" datetime="${post.date}">${formatDate(post.date)}</time>
    `;

    const html = await loadMarkdown(`posts/${post.slug}.md`);
    document.getElementById('post-content').innerHTML = html;
  } catch (err) {
    console.error(err);
    renderNotFound();
  }
}

init();
