
import { SeoBreakdownItem } from "@/hooks/seoSidebar/useSeoScore";
import { LlmBreakdownItem } from "@/hooks/seoSidebar/useLlmScore";
import { calculateKeywordDensity } from "./calculateKeywordDensity";
import { countHeadings, evaluateHeadingStructure } from "./countHeadings";
import { hasKeywordInH1 } from "./hasKeywordInH1";
import { validateMetaDescription } from "./validateMetaDescription";
import { evaluateParagraphs } from "./evaluateParagraphs";
import { checkImageAlts } from "./checkImageAlts";
import { countLinks } from "./countLinks";
import { calculateReadability } from "./calculateReadability";
import { checkKeywordEarly } from "./checkKeywordEarly";
import { checkMinLength } from "./checkMinLength";
import { hasFaqSchema } from "./hasFaqSchema";
import { titleHasNumber } from "./titleHasNumber";
import { checkShortParagraphs } from "./checkShortParagraphs";
import { countEntities } from "./countEntities";
import { hasDirectAnswer } from "./hasDirectAnswer";
import { checkKeywordInSlug } from "./checkKeywordInSlug";
import { hasStructuredData } from "./hasStructuredData";

interface SeoScoreResult {
  totalScore: number;
  breakdown: SeoBreakdownItem[];
}

interface LlmScoreResult {
  totalScore: number;
  breakdown: LlmBreakdownItem[];
}

const SEO_WEIGHTS = {
  keywordDensity: 1,
  keywordInH1: 1,
  headingStructure: 1,
  metaDescription: 1,
  paragraphLength: 1,
  imageAlts: 1,
  internalLinks: 1,
  readability: 1,
  keywordEarly: 1,
  minLength: 1,
  faqSchema: 1,
  keywordInSlug: 1,
  titleNumber: 1,
  shortParagraphs: 1,
};

const LLM_WEIGHTS = {
  semanticEntities: 1,
  directAnswer: 1,
  structuredData: 1,
};

export async function calculateSeoScore(content: string, keyword: string, metaDesc: string, slug: string): Promise<SeoScoreResult> {
  const breakdown: SeoBreakdownItem[] = [];
  
  // Simular delay para análise
  await new Promise(resolve => setTimeout(resolve, 300));

  // 1. Densidade da keyword (1-2% ideal)
  const keywordDensity = calculateKeywordDensity(content, keyword);
  const keywordDensityScore = keywordDensity >= 1 && keywordDensity <= 2 ? 100 : 
                             keywordDensity < 1 ? Math.max(0, keywordDensity * 50) :
                             Math.max(0, 100 - (keywordDensity - 2) * 25);
  
  breakdown.push({
    metric: "Densidade de Keyword (1–2%)",
    score: Math.round(keywordDensityScore),
    weight: SEO_WEIGHTS.keywordDensity
  });

  // 2. Keyword no H1
  const keywordInH1Score = hasKeywordInH1(content, keyword) ? 100 : 0;
  breakdown.push({
    metric: "Keyword no Título (H1)",
    score: keywordInH1Score,
    weight: SEO_WEIGHTS.keywordInH1
  });

  // 3. Estrutura de headings
  const headings = countHeadings(content);
  const headingEvaluation = evaluateHeadingStructure(headings);
  breakdown.push({
    metric: "Headings (H1–H5)",
    score: headingEvaluation.score,
    weight: SEO_WEIGHTS.headingStructure
  });

  // 4. Meta description
  const metaValidation = validateMetaDescription(metaDesc, keyword);
  breakdown.push({
    metric: "Meta Description",
    score: metaValidation.score,
    weight: SEO_WEIGHTS.metaDescription
  });

  const slugScore = checkKeywordInSlug(slug, keyword) ? 100 : 0;
  breakdown.push({
    metric: "Keyword no URL (slug)",
    score: slugScore,
    weight: SEO_WEIGHTS.keywordInSlug
  });
  // 5. Avaliação de parágrafos
  const paragraphEval = evaluateParagraphs(content);
  breakdown.push({
    metric: "Parágrafos (40–60 palavras)",
    score: paragraphEval.score,
    weight: SEO_WEIGHTS.paragraphLength
  });

  // 6. Alt text das imagens
  const imageAlts = checkImageAlts(content, keyword);
  breakdown.push({
    metric: "Alt Text em Imagens",
    score: imageAlts.score,
    weight: SEO_WEIGHTS.imageAlts
  });

  // 7. Links internos
  const links = countLinks(content);
  breakdown.push({
    metric: "Links Internos & Externos DoFollow",
    score: links.score,
    weight: SEO_WEIGHTS.internalLinks
  });

  // 8. Legibilidade
  const readabilityScore = calculateReadability(content);
  breakdown.push({
    metric: "Legibilidade (Flesch-Kincaid)",
    score: readabilityScore,
    weight: SEO_WEIGHTS.readability
  });

  // 9. Keyword nos primeiros 10%
  const keywordEarlyScore = checkKeywordEarly(content, keyword) ? 100 : 0;
  breakdown.push({
    metric: "Keyword nos Primeiros 10%",
    score: keywordEarlyScore,
    weight: SEO_WEIGHTS.keywordEarly
  });

  // 10. Comprimento mínimo
  const minLengthScore = checkMinLength(content, 300) ? 100 : 0;
  breakdown.push({
    metric: "Comprimento Mínimo (300 palavras)",
    score: minLengthScore,
    weight: SEO_WEIGHTS.minLength
  });

  // 11. JSON-LD FAQ / Schema
  const faqScore = hasFaqSchema(content) ? 100 : 0;
  breakdown.push({
    metric: "JSON-LD FAQ / Schema",
    score: faqScore,
    weight: SEO_WEIGHTS.faqSchema
  });

  // 12. Uso de números no título
  const numberScore = titleHasNumber(content) ? 100 : 0;
  breakdown.push({
    metric: "Uso de números no título",
    score: numberScore,
    weight: SEO_WEIGHTS.titleNumber
  });

  // 13. Parágrafos Curtos
  const shortParaScore = checkShortParagraphs(content, 80) ? 100 : 0;
  breakdown.push({
    metric: "Parágrafos Curtos",
    score: shortParaScore,
    weight: SEO_WEIGHTS.shortParagraphs
  });

  // Calcular score médio
  const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.length;

  return {
    totalScore: Math.round(totalScore),
    breakdown
  };
}

export async function calculateLlmScore(content: string, keyword: string): Promise<LlmScoreResult> {
  const breakdown: LlmBreakdownItem[] = [];
  
  // Simular delay para análise IA
  await new Promise(resolve => setTimeout(resolve, 400));

  // 1. Entidades semânticas
  const entities = countEntities(content);
  const semanticScore = Math.min(100, Math.round((entities / 5) * 100));
  breakdown.push({
    metric: "Cobertura de Entidades Semânticas (LLM)",
    score: semanticScore,
    weight: LLM_WEIGHTS.semanticEntities
  });

  // 2. Resposta Direta (TL;DR)
  const directAnswerScore = hasDirectAnswer(content) ? 100 : 0;
  breakdown.push({
    metric: "Resposta Direta (TL;DR)",
    score: directAnswerScore,
    weight: LLM_WEIGHTS.directAnswer
  });

  // 3. Structured Data (Other Schemas)
  const structuredScore = hasStructuredData(content, ["HowTo", "Article"]) ? 100 : 0;
  breakdown.push({
    metric: "Structured Data (Other Schemas)",
    score: structuredScore,
    weight: LLM_WEIGHTS.structuredData
  });

  // Calcular score médio
  const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.length;

  return {
    totalScore: Math.round(totalScore),
    breakdown
  };
}

