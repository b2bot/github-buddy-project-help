export interface WordPressPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  metaDescription?: string;
  altText?: string;
  keyword?: string;
  status: "draft" | "pending" | "scheduled" | "published";
  featuredImageUrl?: string;
  scheduledAt?: string;
}

export interface WordPressResponse {
  success: boolean;
  message: string;
  postId?: string;
}

export const wordpress = {
  async publishPost(post: WordPressPost): Promise<WordPressResponse> {
    try {
      // Simular publicação no WordPress
      console.log('Publishing post to WordPress:', post);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Post publicado com sucesso!',
        postId: `wp_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao publicar post'
      };
    }
  },

  async schedulePost(post: WordPressPost, scheduledAt: string): Promise<WordPressResponse> {
    try {
      console.log('Scheduling post in WordPress:', post, scheduledAt);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Post agendado com sucesso!',
        postId: `wp_scheduled_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao agendar post'
      };
    }
  }
};
