
export function calculateKeywordDensity(content: string, keyword: string): number {
  if (!content || !keyword) return 0;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, ' ').toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  // Split into words and filter out empty strings
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  if (totalWords === 0) return 0;
  
  // Count keyword occurrences (exact match and partial matches)
  const keywordOccurrences = plainText.split(keywordLower).length - 1;
  
  return (keywordOccurrences / totalWords) * 100;
}
