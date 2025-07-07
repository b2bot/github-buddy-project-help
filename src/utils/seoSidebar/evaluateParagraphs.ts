
export interface ParagraphEvaluation {
  avgWords: number;
  totalParagraphs: number;
  goodParagraphs: number;
  score: number;
}

export function evaluateParagraphs(content: string): ParagraphEvaluation {
  if (!content) {
    return {
      avgWords: 0,
      totalParagraphs: 0,
      goodParagraphs: 0,
      score: 0
    };
  }
  
  // Extract paragraphs
  const paragraphMatches = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
  const totalParagraphs = paragraphMatches.length;
  
  if (totalParagraphs === 0) {
    return {
      avgWords: 0,
      totalParagraphs: 0,
      goodParagraphs: 0,
      score: 0
    };
  }
  
  let totalWords = 0;
  let goodParagraphs = 0;
  
  paragraphMatches.forEach(paragraph => {
    // Remove HTML tags and count words
    const plainText = paragraph.replace(/<[^>]*>/g, '').trim();
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    totalWords += wordCount;
    
    // Check if paragraph has good length (40-60 words)
    if (wordCount >= 40 && wordCount <= 60) {
      goodParagraphs++;
    }
  });
  
  const avgWords = totalWords / totalParagraphs;
  const score = Math.round((goodParagraphs / totalParagraphs) * 100);
  
  return {
    avgWords: Math.round(avgWords),
    totalParagraphs,
    goodParagraphs,
    score
  };
}
