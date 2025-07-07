
export interface MetaDescriptionValidation {
  hasDesc: boolean;
  hasKeyword: boolean;
  lengthOK: boolean;
  score: number;
}

export function validateMetaDescription(desc: string, keyword: string): MetaDescriptionValidation {
  const hasDesc = desc && desc.trim().length > 0;
  const hasKeyword = hasDesc && desc.toLowerCase().includes(keyword.toLowerCase());
  const lengthOK = hasDesc && desc.length >= 150 && desc.length <= 160;
  
  let score = 0;
  if (hasDesc) score += 33;
  if (hasKeyword) score += 33;
  if (lengthOK) score += 34;
  
  return {
    hasDesc,
    hasKeyword,
    lengthOK,
    score
  };
}
