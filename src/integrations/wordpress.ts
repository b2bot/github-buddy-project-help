
// WordPress Integration with real webhook functionality

export interface WordPressPost {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'scheduled' | 'published';
  slug?: string;
  excerpt?: string;
  metaDescription?: string;
  altText?: string;
  keyword?: string;
  featuredImageUrl?: string;
  scheduledAt?: string;
}

export interface WebhookConfig {
  url: string;
  token: string;
  active: boolean;
}

export interface WebhookEvent {
  id: string;
  type: 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED';
  status: 'success' | 'error' | 'pending';
  timestamp: string;
  postId: string;
  errorMessage?: string;
}

let webhookConfig: WebhookConfig = {
  url: localStorage.getItem('partnerseo_webhook_url') || '',
  token: localStorage.getItem('partnerseo_auth_token') || '',
  active: localStorage.getItem('partnerseo_webhook_active') === 'true'
};

export const wordpress = {
  async publishPost(postData: WordPressPost): Promise<{ success: boolean; message: string; postId?: string }> {
    console.log('Publishing post to WordPress:', postData);
    
    if (!webhookConfig.url || !webhookConfig.token) {
      return {
        success: false,
        message: 'Configuração do WordPress incompleta. Verifique URL e token.'
      };
    }
    
    try {
      // Use a URL do preview da Lovable como fallback se não houver URL configurada
      const baseUrl = webhookConfig.url || 'https://preview--ajuda-git-amigo.lovable.app';
      const endpoint = `${baseUrl}/wp-json/partnerseo/v1/webhook`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webhookConfig.token}`
        },
        body: JSON.stringify(postData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: postData.scheduledAt ? 'Post agendado com sucesso!' : 'Post publicado com sucesso!',
          postId: data.post_id?.toString()
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao publicar post'
        };
      }
      
    } catch (error) {
      console.error('WordPress publish error:', error);
      return {
        success: false,
        message: 'Erro de conexão com WordPress'
      };
    }
  },

  async schedulePost(postData: WordPressPost, scheduledAt: string): Promise<{ success: boolean; message: string }> {
    return this.publishPost({
      ...postData,
      scheduledAt
    });
  },

  async testConnection(config: WebhookConfig): Promise<{ success: boolean; message: string }> {
    console.log('Testing WordPress connection:', config);
    
    try {
      const baseUrl = config.url || 'https://preview--ajuda-git-amigo.lovable.app';
      const endpoint = `${baseUrl}/wp-json/partnerseo/v1/check`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        }
      });
      
      if (response.ok) {
        return {
          success: true,
          message: 'Conexão com WordPress estabelecida com sucesso!'
        };
      } else {
        return {
          success: false,
          message: 'Erro ao conectar com WordPress. Verifique a URL e token.'
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: 'Erro de conexão. Verifique a URL do WordPress.'
      };
    }
  },

  getWebhookConfig(): WebhookConfig {
    return webhookConfig;
  },

  setWebhookConfig(config: WebhookConfig): void {
    webhookConfig = { ...config };
    localStorage.setItem('partnerseo_webhook_url', config.url);
    localStorage.setItem('partnerseo_auth_token', config.token);
    localStorage.setItem('partnerseo_webhook_active', config.active.toString());
  },

  async getWebhookHistory(): Promise<WebhookEvent[]> {
    if (!webhookConfig.url || !webhookConfig.token) {
      return [];
    }
    
    try {
      const baseUrl = webhookConfig.url || 'https://preview--ajuda-git-amigo.lovable.app';
      const endpoint = `${baseUrl}/wp-json/partnerseo/v1/logs`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${webhookConfig.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.logs || [];
      }
    } catch (error) {
      console.error('Error fetching webhook history:', error);
    }
    
    return [];
  },

  async resendAllPosts(posts: WordPressPost[]): Promise<void> {
    console.log('Resending all posts to WordPress:', posts.length);
    
    for (const post of posts) {
      await this.publishPost(post);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
};
