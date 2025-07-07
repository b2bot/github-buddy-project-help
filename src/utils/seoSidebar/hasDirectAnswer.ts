export function hasDirectAnswer(content: string): boolean {
  const match = content.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match) return false;
  const text = match[1].replace(/<[^>]*>/g, '').trim();
  return text.length >= 100;
}
