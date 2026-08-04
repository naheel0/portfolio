/** Normalize a URL — ensures it has an https:// scheme so links don't break */
export const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};
