
export function checkKeywordEarly(content: string, keyword: string): boolean {
  if (!content || !keyword) return false;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, ' ').toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  // Split into words
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  if (totalWords === 0) return false;
  
  // Check first 10% of words
  const earlyWordCount = Math.ceil(totalWords * 0.1);
  const earlyWords = words.slice(0, earlyWordCount);
  const earlyText = earlyWords.join(' ');
  
  return earlyText.includes(keywordLower);
}
