export interface GenerateContentParams {
  keyword: string;
  tone?: string;
  length?: string;
}

export interface GenerateContentResponse {
  success: boolean;
  content: string;
  provider?: string;
  error?: string;
}

export interface GenerateTitlesResponse {
  success: boolean;
  titles: string[];
}

export interface GenerateContentRequest {
  keyword: string;
  type?: string;
  tone?: string;
  length?: string;
}

export const openai = {
  async generateContent(params: GenerateContentParams): Promise<GenerateContentResponse> {
    try {
      const prompt = `Gere um conteúdo sobre "${params.keyword}" com tom ${params.tone || 'profissional'} e tamanho ${params.length || 'médio'}.`;
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      
      return {
        success: true,
        content: data.generatedText || 'Conteúdo gerado com sucesso.',
        provider: 'openai'
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  },

  async generateTitles(keyword: string, count: number = 5): Promise<GenerateTitlesResponse> {
    try {
      const prompt = `Gere ${count} títulos sobre "${keyword}" para blog posts.`;
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      const titles = data.generatedText ? data.generatedText.split('\n').filter((t: string) => t.trim()) : [];
      
      return {
        success: true,
        titles: titles.slice(0, count)
      };
    } catch (error) {
      return {
        success: false,
        titles: []
      };
    }
  },

  async generateParagraph(context: string): Promise<string> {
    try {
      const prompt = `Com base no contexto: "${context}", gere um parágrafo complementar.`;
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      return data.generatedText || 'Parágrafo gerado com sucesso.';
    } catch (error) {
      return 'Erro ao gerar parágrafo.';
    }
  },

  async generatePost(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    return this.generateContent({
      keyword: request.keyword,
      tone: request.tone,
      length: request.length
    });
  }
};
