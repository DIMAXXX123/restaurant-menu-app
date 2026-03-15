const API = import.meta.env.VITE_API_URL || '';

/**
 * Resolves an image URL — returns full Supabase URLs as-is,
 * prefixes relative /uploads paths with the API base.
 */
export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API}${url}`;
}
