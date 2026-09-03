// Fetches and caches posts/manifest.json — the hand-maintained index of posts,
// since client-side JS has no way to list the posts/ directory on its own.

let manifestPromise = null;

export function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('posts/manifest.json').then((res) => {
      if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
      return res.json();
    });
  }
  return manifestPromise;
}
