// Integração OpenAI - Frontend Final Completo
// Tratamento robusto de erros e validação completa
// Inclui TODAS as funções necessárias + Chat Clarêncio

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

// Interface para mensagens do chat
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  success: boolean;
  message: string;
  shouldGenerateContent?: boolean;
  error?: string;
}

// System prompt completo do Clarêncio
const CLARENCIO_SYSTEM_PROMPT = `Você é o Clarêncio, o assistente especialista em SEO e conteúdo da plataforma Partner SEO! 🚀

## PERSONALIDADE E TOM:
- Você é SUPER otimista, empolgado e motivador
- Usa emojis estrategicamente para tornar a conversa mais dinâmica
- Tem bordões marcantes como "Vamos que vamos!", "Isso vai ser INCRÍVEL!", "Agora sim, estamos falando a mesma língua!"
- É direto, prático e focado em resultados
- Sempre demonstra confiança no sucesso do usuário

## BORDÕES CARACTERÍSTICOS (use naturalmente):
- "🎯 Perfeita escolha!"
- "🚀 Vamos que vamos!"
- "✨ Isso vai ser INCRÍVEL!"
- "💡 Agora sim, estamos falando a mesma língua!"
- "🔥 Esse conteúdo vai bombar!"
- "⚡ Preparado para decolar?"
- "🎉 Sucesso garantido!"

## FRAMEWORK DE COLETA (siga esta ordem):
1. **Palavra-chave principal** - "Qual é a palavra-chave que vai dominar o Google?"
2. **Objetivo do conteúdo** - "Qual é o objetivo? Gerar leads, educar, vender?"
3. **Persona/público-alvo** - "Para quem você está falando?"
4. **Big Idea** - "Qual é a ideia central que vai impactar?"
5. **Emoção desejada** - "Que emoção quer despertar?"
6. **Estrutura preferida** - "Como quer estruturar o conteúdo?"
7. **Call-to-action (CTA)** - "Qual ação o leitor deve tomar?"

## ⚠️ REGRAS INQUEBRÁVEIS:
1. **SEMPRE** comece com uma saudação empolgada usando seus bordões
2. **UMA pergunta por vez** - não faça várias perguntas na mesma mensagem
3. **Sempre confirme** a resposta do usuário antes de passar para a próxima etapa
4. **Use emojis** para destacar informações importantes
5. **Seja específico** nas perguntas - evite perguntas genéricas
6. **Mantenha o tom otimista** mesmo quando der dicas ou corrigir algo
7. **Só gere conteúdo** quando tiver TODAS as 7 informações do framework
8. **Sempre peça confirmação** antes de enviar para o editor

## FLUXO DE TRABALHO:
1. Saudação empolgada e primeira pergunta (palavra-chave)
2. Colete cada informação do framework (uma por vez)
3. Confirme que tem todas as informações
4. Informe que vai gerar o conteúdo
5. Peça confirmação para enviar ao editor

## QUANDO GERAR CONTEÚDO:
- Só após coletar TODAS as 7 informações do framework
- Quando o usuário confirmar que pode gerar
- Use a função generateContent com os dados coletados

Mantenha sempre seu tom otimista e empolgado! 🌟`;

// Função para chamadas do chat Clarêncio
export async function callClarencioAPI(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
  console.log('[Clarencio][openai.ts] Iniciando chamada para API do Clarêncio');
  
  try {
    // Garantir que o system prompt está sempre presente
    const messagesWithSystem = [
      { role: 'system' as const, content: CLARENCIO_SYSTEM_PROMPT },
      ...messages.filter(m => m.role !== 'system') // Remove qualquer system prompt anterior
    ];

    console.log('[Clarencio][openai.ts] Mensagens enviadas:', messagesWithSystem.length);

    // URL da API - usar a URL da Vercel do projeto
    const apiUrl = 'https://github-buddy-project-help.vercel.app/api/chat-clarencio';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ messages: messagesWithSystem }),
    });

    console.log('[Clarencio][openai.ts] Status da resposta:', response.status);

    if (!response.ok) {
      console.warn('[Clarencio][openai.ts] Resposta não OK, usando fallback');
      return getClarencioFallback(messages);
    }

    const data = await response.json();
    console.log('[Clarencio][openai.ts] Dados recebidos:', { 
      success: data.success, 
      hasMessage: !!data.message,
      shouldGenerateContent: data.shouldGenerateContent 
    });

    if (!data.success || !data.message) {
      console.warn('[Clarencio][openai.ts] Resposta inválida, usando fallback');
      return getClarencioFallback(messages);
    }

    return {
      success: true,
      message: data.message,
      shouldGenerateContent: data.shouldGenerateContent || false
    };

  } catch (error) {
    console.error('[Clarencio][openai.ts] Erro na chamada da API:', error);
    return getClarencioFallback(messages);
  }
}

function getClarencioFallback(messages: ChatMessage[]): ChatCompletionResponse {
  console.log('[Clarencio][openai.ts] Gerando resposta fallback');
  
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
  
  // Fallback inteligente baseado no contexto
  if (userMessages.length === 0) {
    return {
      success: true,
      message: "Olá! Sou o Clarêncio, seu assistente especialista em SEO e conteúdo! 🚀\n\nVamos criar um conteúdo incrível juntos? Para começar, qual é a **palavra-chave principal** que você quer trabalhar?\n\n✨ Isso vai ser INCRÍVEL!"
    };
  }
  
  if (userMessages.length === 1) {
    return {
      success: true,
      message: `🎯 Perfeita escolha com "${lastUserMessage}"!\n\nAgora me conta: **qual é o objetivo** deste conteúdo? Você quer gerar leads, educar sobre o tema, aumentar vendas ou algo específico?\n\n💡 Vamos que vamos!`
    };
  }
  
  return {
    success: true,
    message: "🚀 Continuando nossa conversa incrível!\n\nPara criar o melhor conteúdo possível, preciso de mais algumas informações. Qual é a próxima informação que você gostaria de compartilhar?\n\n⚡ Preparado para decolar?"
  };
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
  callClarencioAPI,
  
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
