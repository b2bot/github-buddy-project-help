
export function calculateReadability(content: string): number {
  if (!content) return 0;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, ' ').trim();
  
  if (!plainText) return 0;
  
  // Count sentences (split by . ! ?)
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  if (sentenceCount === 0) return 0;
  
  // Count words
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  if (wordCount === 0) return 0;
  
  // Count syllables (simplified approximation)
  let syllableCount = 0;
  words.forEach(word => {
    // Remove punctuation and convert to lowercase
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (cleanWord.length === 0) return;
    
    // Count vowel groups as syllables
    const vowelGroups = cleanWord.match(/[aeiouy]+/g) || [];
    let syllables = vowelGroups.length;
    
    // Adjust for silent e
    if (cleanWord.endsWith('e') && syllables > 1) {
      syllables--;
    }
    
    // Minimum 1 syllable per word
    syllables = Math.max(1, syllables);
    syllableCount += syllables;
  });
  
  // Flesch Reading Ease formula
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Convert to 0-100 scale where higher is better
  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}
