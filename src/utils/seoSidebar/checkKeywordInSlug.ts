export function checkKeywordInSlug(slug: string, keyword: string): boolean {
  if (!slug || !keyword) return false;
  const normalizedSlug = slug.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '-');
  return normalizedSlug.includes(normalizedKeyword);
}
