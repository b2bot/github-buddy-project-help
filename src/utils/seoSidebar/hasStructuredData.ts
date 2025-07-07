export function hasStructuredData(content: string, types: string[]): boolean {
  const matches = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
  if (!matches) return false;
  try {
    const json = JSON.parse(matches[1]);
    if (Array.isArray(json)) {
      return json.some(j => types.includes(j['@type']));
    }
    return types.includes(json['@type']);
  } catch {
    return false;
  }
}
