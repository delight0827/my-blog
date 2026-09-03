// Shared category → icon mapping. A post's category is its first tag.
// Unknown categories fall back to a generic paw icon.

const CATEGORY_ICONS = {
  '일기': '📔',
  '독서노트': '📚',
  '내 일상': '☀️',
  '메모': '📝',
  '소개': '💬',
  '영어': '🔤',
};

const DEFAULT_ICON = '🐾';

export function categoryIcon(name) {
  return CATEGORY_ICONS[name] || DEFAULT_ICON;
}

export function postCategory(post) {
  return (post.tags && post.tags[0]) || '기타';
}
