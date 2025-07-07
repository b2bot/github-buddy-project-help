
export function hasFaqSchema(content: string): boolean {
  if (!content) return false;
  
  // Check for JSON-LD script tag with FAQ schema
  const jsonLdMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
  
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      return jsonData['@type'] === 'FAQPage' || 
             (Array.isArray(jsonData) && jsonData.some(item => item['@type'] === 'FAQPage'));
    } catch (e) {
      // Invalid JSON
    }
  }
  
  // Alternative check for FAQ-like structure
  const faqIndicators = [
    /pergunta/gi,
    /resposta/gi,
    /faq/gi,
    /questão/gi,
    /dúvida/gi
  ];
  
  return faqIndicators.some(pattern => pattern.test(content));
}
