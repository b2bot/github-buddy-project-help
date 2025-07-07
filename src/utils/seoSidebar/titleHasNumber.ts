export function titleHasNumber(content: string): boolean {
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!h1Match) return false;
  const text = h1Match[1].replace(/<[^>]*>/g, '');
  return /\d/.test(text);
}
