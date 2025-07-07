
export function hasKeywordInH1(content: string, keyword: string): boolean {
  if (!content || !keyword) return false;
  
  // Extract H1 content
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!h1Match) return false;
  
  const h1Text = h1Match[1].replace(/<[^>]*>/g, '').toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  return h1Text.includes(keywordLower);
}
