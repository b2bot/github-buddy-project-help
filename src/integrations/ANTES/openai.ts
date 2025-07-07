// OpenAI Integration Stub
// TODO: Implementar conexão real com OpenAI API

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

export const openai = {
  async createCompletion(request: OpenAICompletionRequest): Promise<OpenAICompletionResponse> {
    // Stub implementation
    console.log('OpenAI API call:', request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on prompt content
    if (request.prompt.includes('título') || request.prompt.includes('sugestões')) {
      return {
        text: JSON.stringify([
          "10 Estratégias Comprovadas para Aumentar Vendas Online",
          "Como Implementar Marketing Digital em Pequenas Empresas",
          "Guia Completo de SEO para Iniciantes em 2024",
          "5 Ferramentas Essenciais para Automação de Marketing"
        ]),
        usage: { totalTokens: 150 }
      };
    }
    
    if (request.prompt.includes('parágrafo')) {
      return {
        text: "Este é um parágrafo gerado pela IA como exemplo. O conteúdo seria criado com base no contexto fornecido e nas instruções específicas do usuário, mantendo consistência com o tom e estilo definidos nas preferências.",
        usage: { totalTokens: 120 }
      };
    }
    
    return {
      text: "Resposta simulada da IA baseada no prompt fornecido.",
      usage: { totalTokens: 100 }
    };
  },

  async generateTitles(keyword: string, count: number = 5): Promise<string[]> {
    const response = await this.createCompletion({
      prompt: `Gere ${count} títulos de artigos de blog sobre "${keyword}" que sejam otimizados para SEO e atraentes para o público.`,
      maxTokens: 200
    });
    
    try {
      return JSON.parse(response.text);
    } catch {
      return response.text.split('\n').filter(line => line.trim().length > 0);
    }
  },

  async generateParagraph(context: string): Promise<string> {
    const response = await this.createCompletion({
      prompt: `Com base no contexto: "${context}", gere um parágrafo informativo e bem estruturado.`,
      maxTokens: 150
    });
    
    return response.text;
  }
};