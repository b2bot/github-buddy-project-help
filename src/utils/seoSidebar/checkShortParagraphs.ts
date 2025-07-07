export function checkShortParagraphs(content: string, maxWords: number = 80): boolean {
  if (!content) return false;
  const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
  return paragraphs.every(p => {
    const text = p.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return words.length <= maxWords;
  });
}
