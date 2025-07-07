// OpenAI Integration via Vercel API
// Integração real com o Assistant Clarencio deployado na Vercel

export interface GenerateContentRequest {
  keyword: string;
  category: string;
  tone: string;
  method: 'manual' | 'public_interest' | 'youtube' | 'url';
  sourceInput: string;
}

export interface GenerateContentResponse {
  title: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  content: string;
  internalLinks: string[];
}

export interface OpenAICompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface OpenAICompletionResponse {
  text: string;
  usage: {
    totalTokens: number;
  };
}

const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://github-buddy-project-help-3384kgvu3-vagners-projects-9405e3ab.vercel.app/api/generate-content';

export const openai = {
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    console.log('Chamando API da OpenAI via Vercel:', request);
    
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      throw new Error(`Falha ao gerar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  },

  async createCompletion(request: OpenAICompletionRequest): Promise<OpenAICompletionResponse> {
    // Fallback para compatibilidade com código existente
    console.log('OpenAI API call (legacy):', request);
    
    // Converte para o novo formato
    const generateRequest: GenerateContentRequest = {
      keyword: this.extractKeywordFromPrompt(request.prompt),
      category: 'Geral',
      tone: 'profissional',
      method: 'manual',
      sourceInput: request.prompt
    };

    try {
      const result = await this.generateContent(generateRequest);
      
      // Retorna no formato esperado pelo código legacy
      return {
        text: result.content,
        usage: { totalTokens: 150 }
      };
    } catch (error) {
      console.error('Erro no createCompletion:', error);
      return {
        text: "Erro ao gerar conteúdo. Tente novamente.",
        usage: { totalTokens: 0 }
      };
    }
  },

  async generateTitles(keyword: string, count: number = 5): Promise<string[]> {
    console.log(`Gerando ${count} títulos para: ${keyword}`);
    
    try {
      const request: GenerateContentRequest = {
        keyword,
        category: 'Geral',
        tone: 'profissional',
        method: 'manual',
        sourceInput: `Gere ${count} títulos de artigos de blog sobre "${keyword}" que sejam otimizados para SEO e atraentes para o público.`
      };

      const result = await this.generateContent(request);
      
      // Extrai títulos do conteúdo gerado ou retorna o título principal
      const titles = [result.title];
      
      // Adiciona títulos alternativos se necessário
      for (let i = 1; i < count; i++) {
        titles.push(`${result.title} - Variação ${i + 1}`);
      }
      
      return titles.slice(0, count);
    } catch (error) {
      console.error('Erro ao gerar títulos:', error);
      
      // Fallback com títulos genéricos
      return [
        `Como Dominar ${keyword}: Guia Completo`,
        `${keyword}: Estratégias Que Funcionam`,
        `Tudo Sobre ${keyword}: Dicas Práticas`,
        `${keyword} na Prática: Passo a Passo`,
        `Guia Definitivo de ${keyword}`
      ].slice(0, count);
    }
  },

  async generateParagraph(context: string): Promise<string> {
    console.log('Gerando parágrafo para contexto:', context);
    
    try {
      const request: GenerateContentRequest = {
        keyword: this.extractKeywordFromPrompt(context),
        category: 'Geral',
        tone: 'profissional',
        method: 'manual',
        sourceInput: context
      };

      const result = await this.generateContent(request);
      
      // Extrai o primeiro parágrafo do conteúdo
      const firstParagraph = result.content.match(/<p>(.*?)<\/p>/)?.[1] || result.excerpt;
      
      return firstParagraph;
    } catch (error) {
      console.error('Erro ao gerar parágrafo:', error);
      return "Este é um parágrafo gerado com base no contexto fornecido. O conteúdo seria criado seguindo as melhores práticas de SEO e engajamento.";
    }
  },

  // Função auxiliar para extrair palavra-chave de prompts
  extractKeywordFromPrompt(prompt: string): string {
    // Tenta extrair palavra-chave de prompts comuns
    const keywordMatch = prompt.match(/sobre\s+"([^"]+)"/i) || 
                        prompt.match(/palavra-chave[:\s]+([^\n,]+)/i) ||
                        prompt.match(/tema[:\s]+([^\n,]+)/i);
    
    if (keywordMatch) {
      return keywordMatch[1].trim();
    }
    
    // Fallback: pega as primeiras palavras significativas
    const words = prompt.split(' ').filter(word => 
      word.length > 3 && 
      !['sobre', 'para', 'como', 'gere', 'crie', 'faça'].includes(word.toLowerCase())
    );
    
    return words.slice(0, 3).join(' ') || 'conteúdo';
  }
};

