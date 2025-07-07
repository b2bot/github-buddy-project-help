## Visão Geral
- **Projeto:** Partner SEO
- **Descrição:** ferramenta interna de criação e otimização de conteúdo com AI e integração WordPress.

## Histórico de Atualizações
- 2025-07-03 (Codex): implementou integração de Header e ajustes gerais.
- 2025-07-03 (Codex): adicionou 16 métricas de SEO e refatorou `SeoSidebar`.
- 2025-07-03 (Codex): atualizou manual com novo sidebar.

## Métricas e Cálculos
Listagem de funções por métrica:

### SEO Score
- Densidade de Keyword (`calculateKeywordDensity`)
- Keyword no Título (`hasKeywordInH1`)
- Meta Description (`validateMetaDescription`)
- Keyword no URL (`checkKeywordInSlug`)
- Keyword nos primeiros 10% (`checkKeywordEarly`)
- Comprimento Mínimo (`checkMinLength`)
- Headings H1-H5 (`countHeadings`, `evaluateHeadingStructure`)
- Parágrafos Curtos (`checkShortParagraphs`)
- Alt Text em Imagens (`checkImageAlts`)
- Links Internos & Externos (`countLinks`)
- Legibilidade (`calculateReadability`)
- JSON-LD FAQ / Schema (`hasFaqSchema`)
- Uso de números no título (`titleHasNumber`)

### LLM Score
- Cobertura de Entidades (`countEntities`)
- Resposta Direta (`hasDirectAnswer`)
- Structured Data (`hasStructuredData`)

## Estrutura de Pastas
```
src/components/seoSidebar/SeoSidebar.tsx
src/hooks/seoSidebar/useSeoScore.ts
src/utils/seoSidebar/*.ts
pages/manual.tsx
```

## Como Executar/Testar
```bash
npm install
npm run dev
npm run test
```

## Próximas Tarefas
- Page Analytics: adicionar sub-tabs GA/GSC
- Wizard IA: implementar seletores de parágrafo

## Notas de Design
- Utilizar shadcn/ui com Tailwind respeitando espaçamentos e tipografia do design system.

## Links Úteis
- [Preview](http://localhost:5173)
- [Rank Math](https://rankmath.com/kb/score-100-in-tests/)
- [Google Analytics API](https://developers.google.com/analytics)
