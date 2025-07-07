
export interface ImageAltCheck {
  total: number;
  withAlt: number;
  withKeyword: number;
  score: number;
}

export function checkImageAlts(content: string, keyword: string): ImageAltCheck {
  if (!content) {
    return {
      total: 0,
      withAlt: 0,
      withKeyword: 0,
      score: 0
    };
  }
  
  // Find all image tags
  const imageMatches = content.match(/<img[^>]*>/gi) || [];
  const total = imageMatches.length;
  
  if (total === 0) {
    return {
      total: 0,
      withAlt: 0,
      withKeyword: 0,
      score: 0
    };
  }
  
  let withAlt = 0;
  let withKeyword = 0;
  
  imageMatches.forEach(img => {
    // Check for alt attribute
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    if (altMatch && altMatch[1].trim().length > 0) {
      withAlt++;
      
      // Check if alt contains keyword
      if (keyword && altMatch[1].toLowerCase().includes(keyword.toLowerCase())) {
        withKeyword++;
      }
    }
  });
  
  const score = total > 0 ? Math.round((withAlt / total) * 100) : 0;
  
  return {
    total,
    withAlt,
    withKeyword,
    score
  };
}
