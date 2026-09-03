// Thin wrapper around marked.js (loaded globally via CDN <script> in the HTML).

export async function loadMarkdown(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load markdown at ${path}: ${res.status}`);
  }
  const text = await res.text();
  return marked.parse(text, { gfm: true, breaks: false });
}
