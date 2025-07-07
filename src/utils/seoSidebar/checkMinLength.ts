
export function checkMinLength(content: string, minWords: number = 300): boolean {
  if (!content) return false;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, ' ');
  
  // Count words
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  
  return words.length >= minWords;
}
