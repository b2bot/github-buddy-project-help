
export interface HeadingCount {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
}

export function countHeadings(content: string): HeadingCount {
  const headingCount: HeadingCount = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0
  };
  
  if (!content) return headingCount;
  
  // Count each heading level
  headingCount.h1 = (content.match(/<h1[^>]*>/gi) || []).length;
  headingCount.h2 = (content.match(/<h2[^>]*>/gi) || []).length;
  headingCount.h3 = (content.match(/<h3[^>]*>/gi) || []).length;
  headingCount.h4 = (content.match(/<h4[^>]*>/gi) || []).length;
  headingCount.h5 = (content.match(/<h5[^>]*>/gi) || []).length;
  
  return headingCount;
}

export function evaluateHeadingStructure(headings: HeadingCount): {
  hasUniqueH1: boolean;
  hasGoodDistribution: boolean;
  score: number;
} {
  const hasUniqueH1 = headings.h1 === 1;
  const hasGoodDistribution = headings.h2 >= 2 && headings.h3 >= 1;
  
  let score = 0;
  if (hasUniqueH1) score += 50;
  if (hasGoodDistribution) score += 50;
  
  return {
    hasUniqueH1,
    hasGoodDistribution,
    score
  };
}
