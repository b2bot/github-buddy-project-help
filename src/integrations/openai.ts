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

const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://github-buddy-project-help.vercel.app/api/generate-content';

export const openai = {
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    console.log('Chamando API da OpenAI via Vercel:', request);
    
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      
      // Fallback para desenvolvimento local ou quando API falha
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('Usando fallback local devido a erro de rede');
        return this.generateFallbackContent(request);
      }
      
      throw new Error(`Falha ao gerar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  },

  // Fallback para quando a API não está disponível
  generateFallbackContent(request: GenerateContentRequest): GenerateContentResponse {
    const { keyword, category, tone } = request;
    
    return {
      title: `${keyword}: Guia Completo e Atualizado`,
      slug: keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      metaDescription: `Descubra tudo sobre ${keyword} neste guia completo. Aprenda as melhores práticas e estratégias para ${keyword} de forma eficiente.`,
      altText: `Imagem ilustrativa sobre ${keyword} - Guia completo`,
      excerpt: `Aprenda sobre ${keyword} de forma prática e eficiente. Este guia aborda os principais conceitos e estratégias para dominar ${keyword}.`,
      content: `
        <h1>${keyword}: Guia Completo e Atualizado</h1>
        
        <p>Bem-vindo ao guia mais completo sobre <strong>${keyword}</strong>. Neste artigo, você descobrirá tudo o que precisa saber para dominar este tema de forma prática e eficiente.</p>
        
        <h2>O que é ${keyword}?</h2>
        <p>${keyword} é um conceito fundamental que tem ganhado cada vez mais importância no cenário atual. Compreender seus princípios básicos é essencial para qualquer pessoa que deseja se destacar nesta área.</p>
        
        <h2>Por que ${keyword} é importante?</h2>
        <p>A importância de ${keyword} se manifesta em diversos aspectos:</p>
        <ul>
          <li>Melhora significativa nos resultados</li>
          <li>Otimização de processos e recursos</li>
          <li>Vantagem competitiva no mercado</li>
          <li>Maior eficiência operacional</li>
        </ul>
        
        <h2>Como implementar ${keyword}</h2>
        <p>Para implementar ${keyword} com sucesso, siga estas etapas fundamentais:</p>
        
        <h3>1. Planejamento Estratégico</h3>
        <p>O primeiro passo é desenvolver um planejamento sólido que considere todos os aspectos relevantes de ${keyword}.</p>
        
        <h3>2. Execução Prática</h3>
        <p>Com o planejamento em mãos, é hora de colocar ${keyword} em prática, sempre monitorando os resultados.</p>
        
        <h3>3. Monitoramento e Otimização</h3>
        <p>Acompanhe constantemente os resultados e faça ajustes necessários para maximizar os benefícios de ${keyword}.</p>
        
        <h2>Melhores Práticas para ${keyword}</h2>
        <p>Aqui estão algumas das melhores práticas que você deve seguir:</p>
        <ul>
          <li>Mantenha-se sempre atualizado com as tendências</li>
          <li>Invista em capacitação contínua</li>
          <li>Utilize ferramentas adequadas</li>
          <li>Meça e analise resultados regularmente</li>
        </ul>
        
        <h2>Conclusão</h2>
        <p>Dominar ${keyword} é essencial para o sucesso em ${category}. Com as estratégias e práticas apresentadas neste guia, você estará bem preparado para implementar ${keyword} de forma eficaz e obter resultados excepcionais.</p>
        
        <p>Lembre-se: o sucesso com ${keyword} vem da prática consistente e do aprendizado contínuo. Continue estudando e aplicando esses conceitos para alcançar seus objetivos.</p>
      `,
      internalLinks: []
    };
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
