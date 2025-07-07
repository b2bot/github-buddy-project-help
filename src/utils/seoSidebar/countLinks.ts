
export interface LinkCount {
  internal: number;
  externalFollow: number;
  total: number;
  score: number;
}

export function countLinks(content: string): LinkCount {
  if (!content) {
    return {
      internal: 0,
      externalFollow: 0,
      total: 0,
      score: 0
    };
  }
  
  // Find all link tags
  const linkMatches = content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  const total = linkMatches.length;
  
  let internal = 0;
  let externalFollow = 0;
  
  linkMatches.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) return;
    
    const href = hrefMatch[1];
    
    // Check if internal link (relative or same domain)
    if (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.hostname)) {
      internal++;
    } else {
      // External link - check if it's follow
      const relMatch = link.match(/rel=["']([^"']*)["']/i);
      if (!relMatch || !relMatch[1].includes('nofollow')) {
        externalFollow++;
      }
    }
  });
  
  // Score based on having at least 3 internal links
  const score = internal >= 3 ? 100 : Math.round((internal / 3) * 100);
  
  return {
    internal,
    externalFollow,
    total,
    score
  };
}
