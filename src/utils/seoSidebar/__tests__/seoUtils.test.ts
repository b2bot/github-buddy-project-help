import { describe, it, expect } from 'vitest';
import { calculateKeywordDensity } from '../calculateKeywordDensity';
import { hasKeywordInH1 } from '../hasKeywordInH1';
import { countHeadings, evaluateHeadingStructure } from '../countHeadings';
import { validateMetaDescription } from '../validateMetaDescription';
import { evaluateParagraphs } from '../evaluateParagraphs';
import { checkImageAlts } from '../checkImageAlts';
import { countLinks } from '../countLinks';
import { calculateReadability } from '../calculateReadability';
import { checkKeywordEarly } from '../checkKeywordEarly';
import { checkMinLength } from '../checkMinLength';
import { hasFaqSchema } from '../hasFaqSchema';
import { titleHasNumber } from '../titleHasNumber';
import { checkShortParagraphs } from '../checkShortParagraphs';
import { countEntities } from '../countEntities';
import { hasDirectAnswer } from '../hasDirectAnswer';
import { hasStructuredData } from '../hasStructuredData';

describe('seo utils', () => {
  const html = `<h1>5 dicas</h1><p>keyword aqui</p><p>Outro paragrafo curto</p>`;
  it('calculateKeywordDensity', () => {
    expect(calculateKeywordDensity(html, 'keyword')).toBeGreaterThan(0);
  });
  it('hasKeywordInH1', () => {
    expect(hasKeywordInH1('<h1>Keyword test</h1>', 'keyword')).toBe(true);
  });
  it('countHeadings', () => {
    const counts = countHeadings('<h1>a</h1><h2>b</h2><h2>c</h2><h3>d</h3>');
    const evalRes = evaluateHeadingStructure(counts);
    expect(evalRes.hasUniqueH1).toBe(true);
  });
  it('validateMetaDescription', () => {
    const res = validateMetaDescription('keyword description texto'.padEnd(150,'a'), 'keyword');
    expect(res.hasDesc).toBe(true);
  });
  it('evaluateParagraphs', () => {
    const res = evaluateParagraphs('<p>word '.repeat(50) + '</p>');
    expect(res.totalParagraphs).toBe(1);
  });
  it('checkImageAlts', () => {
    const res = checkImageAlts('<img alt="keyword"/>', 'keyword');
    expect(res.withAlt).toBe(1);
  });
  it('countLinks', () => {
    const res = countLinks('<a href="/test">a</a>');
    expect(res.internal).toBe(1);
  });
  it('calculateReadability', () => {
    expect(calculateReadability('<p>Texto simples.</p>')).toBeGreaterThan(0);
  });
  it('checkKeywordEarly', () => {
    expect(checkKeywordEarly('<p>keyword test</p>', 'keyword')).toBe(true);
  });
  it('checkMinLength', () => {
    expect(checkMinLength('<p>' + 'a '.repeat(20) + '</p>', 10)).toBe(true);
  });
  it('hasFaqSchema', () => {
    const faq = '<script type="application/ld+json">{"@type":"FAQPage"}</script>';
    expect(hasFaqSchema(faq)).toBe(true);
  });
  it('titleHasNumber', () => {
    expect(titleHasNumber('<h1>10 Coisas</h1>')).toBe(true);
  });
  it('checkShortParagraphs', () => {
    expect(checkShortParagraphs('<p>short text</p>', 80)).toBe(true);
  });
  it('countEntities', () => {
    expect(countEntities('<p>New York City is big</p>')).toBe(1);
  });
  it('hasDirectAnswer', () => {
    expect(hasDirectAnswer('<p>'.padEnd(120,'a')+'</p>')).toBe(true);
  });
  it('hasStructuredData', () => {
    const str = '<script type="application/ld+json">{"@type":"Article"}</script>';
    expect(hasStructuredData(str, ['Article'])).toBe(true);
  });
});
