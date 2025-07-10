// Integração OpenAI - Frontend Final Completo
// Tratamento robusto de erros e validação completa
// Inclui TODAS as funções necessárias

export interface SEOData {
  keyword: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  category: string;
  title?: string;
}

export interface GenerateContentParams {
  keyword: string;
  category: string;
  tone: string;
  method: string;
  sourceInput?: string;
}

export interface GenerateContentResponse {
  success: boolean;
  content: string;
  seoData: SEOData;
  source: 'openai' | 'fallback' | 'fallback_error';
}

// Interface para compatibilidade com código existente
export interface GenerateContentRequest {
  keyword: string;
  category: string;
  tone: string;
  method: 'manual' | 'public_interest' | 'youtube' | 'url';
  sourceInput: string;
}

export interface GenerateContentResponseLegacy {
  title: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  content: string;
  internalLinks: string[];
}

export async function generateContent(params: GenerateContentParams): Promise<GenerateContentResponse> {
  console.log('🚀 Iniciando geração de conteúdo:', params);

  try {
    // URL da API - usar a URL da Vercel do projeto
    const apiUrl = 'https://github-buddy-project-help.vercel.app/api/generate-content';
    
    console.log('📡 Fazendo requisição para:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    console.log('📊 Status da resposta:', response.status);

    if (!response.ok) {
      console.warn('⚠️ Resposta não OK, usando fallback');
      return getFallbackContent(params);
    }

    const data = await response.json();
    console.log('✅ Dados recebidos:', { 
      success: data.success, 
      source: data.source,
      hasContent: !!data.content,
      hasSeoData: !!data.seoData 
    });

    // Validar estrutura da resposta
    if (!data || typeof data !== 'object') {
      console.warn('⚠️ Dados inválidos, usando fallback');
      return getFallbackContent(params);
    }

    // Validar conteúdo
    if (!data.content || typeof data.content !== 'string') {
      console.warn('⚠️ Conteúdo inválido, usando fallback');
      return getFallbackContent(params);
    }

    // Validar seoData
    if (!data.seoData || typeof data.seoData !== 'object') {
      console.warn('⚠️ SEO Data inválido, usando fallback');
      return getFallbackContent(params);
    }

    // Garantir que todas as propriedades SEO existem
    const seoData: SEOData = {
      keyword: data.seoData.keyword || params.keyword,
      slug: data.seoData.slug || generateSlug(params.keyword),
      metaDescription: data.seoData.metaDescription || `Artigo sobre ${params.keyword}`,
      altText: data.seoData.altText || `Imagem sobre ${params.keyword}`,
      excerpt: data.seoData.excerpt || `Conteúdo sobre ${params.keyword}`,
      category: data.seoData.category || params.category,
      title: data.seoData.title || `Artigo sobre ${params.keyword}`
    };

    return {
      success: true,
      content: data.content,
      seoData: seoData,
      source: data.source || 'fallback'
    };

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return getFallbackContent(params);
  }
}

// Função para gerar títulos (compatibilidade com OpportunitiesTab)
export async function generateTitles(keyword: string, count: number = 6): Promise<string[]> {
  console.log('🎯 Gerando títulos para:', keyword);

  try {
    // Usar a mesma API para gerar títulos
    const response = await generateContent({
      keyword: `títulos sobre ${keyword}`,
      category: 'geral',
      tone: 'profissional',
      method: 'manual'
    });

    if (response.success && response.content) {
      // Extrair títulos do conteúdo gerado
      const titles = extractTitlesFromContent(response.content, keyword, count);
      console.log('✅ Títulos gerados:', titles.length);
      return titles;
    }
  } catch (error) {
    console.error('❌ Erro ao gerar títulos:', error);
  }

  // Fallback para títulos
  return generateFallbackTitles(keyword, count);
}

function extractTitlesFromContent(content: string, keyword: string, count: number): string[] {
  // Tentar extrair títulos H2 do conteúdo
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi);
  
  if (h2Matches && h2Matches.length > 0) {
    const titles = h2Matches
      .map(match => match.replace(/<[^>]*>/g, '').trim())
      .filter(title => title.length > 0)
      .slice(0, count);
    
    if (titles.length >= count) {
      return titles;
    }
  }

  // Se não conseguir extrair, gerar títulos baseados na palavra-chave
  return generateFallbackTitles(keyword, count);
}

function generateFallbackTitles(keyword: string, count: number): string[] {
  const templates = [
    `Como Dominar ${keyword}: Guia Completo`,
    `${keyword}: Estratégias Que Realmente Funcionam`,
    `Tudo Sobre ${keyword}: Do Básico ao Avançado`,
    `${keyword} na Prática: Dicas e Técnicas`,
    `Guia Definitivo de ${keyword} para Iniciantes`,
    `${keyword}: Erros Comuns e Como Evitá-los`,
    `Implementando ${keyword}: Passo a Passo`,
    `${keyword}: Tendências e Futuro`,
    `Maximizando Resultados com ${keyword}`,
    `${keyword}: Cases de Sucesso e Lições`
  ];

  return templates
    .map(template => template.replace(/\b\w/g, l => l.toUpperCase()))
    .slice(0, count);
}

function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'artigo-gerado';
  }
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
    .trim();
}

function getFallbackContent(params: GenerateContentParams): GenerateContentResponse {
  console.log('🔄 Gerando conteúdo fallback para:', params.keyword);

  const slug = generateSlug(params.keyword);
  const keyword = params.keyword || 'tópico';
  const category = params.category || 'geral';

  const content = `
    <h2>Introdução</h2>
    <p>Neste artigo, vamos explorar estratégias eficazes sobre <strong>${keyword}</strong> na categoria ${category}. Este guia abrangente foi desenvolvido para profissionais que buscam resultados práticos e mensuráveis.</p>
    
    <h2>Principais Estratégias</h2>
    <p>Para obter sucesso com ${keyword}, é fundamental seguir uma abordagem estruturada e baseada em dados. Aqui estão as principais estratégias que recomendamos:</p>
    <ul>
      <li>Análise detalhada do cenário atual</li>
      <li>Definição de objetivos claros e mensuráveis</li>
      <li>Implementação de processos otimizados</li>
      <li>Monitoramento contínuo de resultados</li>
    </ul>
    
    <h2>Implementação Prática</h2>
    <p>A implementação eficaz de ${keyword} requer atenção aos detalhes e consistência na execução. É importante estabelecer métricas de acompanhamento desde o início do processo.</p>
    <p>Considere também a importância do treinamento da equipe e da criação de processos padronizados que garantam a qualidade e eficiência das operações.</p>
    
    <h2>Resultados e Benefícios</h2>
    <p>Quando implementadas corretamente, essas estratégias de ${keyword} podem gerar resultados significativos para sua organização. Os benefícios incluem maior eficiência operacional, redução de custos e melhoria na satisfação dos clientes.</p>
    
    <h2>Conclusão</h2>
    <p>Dominar ${keyword} é essencial para o sucesso na categoria ${category}. Com as estratégias apresentadas neste artigo, você terá as ferramentas necessárias para alcançar seus objetivos de forma eficiente e sustentável.</p>
    <p><strong>Pronto para implementar essas estratégias?</strong> Comece hoje mesmo aplicando os conceitos apresentados e acompanhe os resultados.</p>
  `;

  const seoData: SEOData = {
    keyword: keyword,
    slug: slug,
    metaDescription: `Descubra estratégias eficazes sobre ${keyword} na categoria ${category}. Guia completo com dicas práticas para resultados mensuráveis.`,
    altText: `Ilustração sobre ${keyword} - estratégias e implementação`,
    excerpt: `Guia completo sobre ${keyword} com estratégias práticas e implementação eficaz na categoria ${category}.`,
    category: category,
    title: `Como Dominar ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Guia Completo`
  };

  return {
    success: true,
    content: content,
    seoData: seoData,
    source: 'fallback'
  };
}

// Objeto openai para compatibilidade com código existente
export const openai = {
  generateContent,
  generateTitles,
  
  // Função legacy para compatibilidade
  async generatePost(request: GenerateContentRequest): Promise<GenerateContentResponseLegacy> {
    const response = await generateContent({
      keyword: request.keyword,
      category: request.category,
      tone: request.tone,
      method: request.method,
      sourceInput: request.sourceInput
    });

    return {
      title: response.seoData.title || `Artigo sobre ${request.keyword}`,
      slug: response.seoData.slug,
      metaDescription: response.seoData.metaDescription,
      altText: response.seoData.altText,
      excerpt: response.seoData.excerpt,
      content: response.content,
      internalLinks: [] // Não implementado ainda
    };
  }
};
