export function countEntities(content: string, _model?: string): number {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, ' ');
  const entityMatches = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/g) || [];
  const unique = new Set(entityMatches.map(e => e.trim()));
  return unique.size;
}
