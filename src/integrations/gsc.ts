
// Google Search Console Integration Stub
// TODO: Implementar conexão real com Google Search Console API

export interface GSCQuery {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface GSCMetrics {
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  averagePosition: number;
  topQueries: GSCQuery[];
}

export interface GSCDateRange {
  startDate: string;
  endDate: string;
}

export interface GSCTimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export const gsc = {
  async fetchMetrics(dateRange: GSCDateRange): Promise<GSCMetrics> {
    console.log('GSC API call - fetchMetrics:', dateRange);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data
    return {
      totalImpressions: 45678,
      totalClicks: 2134,
      averageCtr: 4.67,
      averagePosition: 12.3,
      topQueries: [
        { query: 'marketing digital para pequenas empresas', impressions: 5432, clicks: 234, ctr: 4.3, position: 8.2 },
        { query: 'como aumentar vendas online', impressions: 4123, clicks: 189, ctr: 4.6, position: 11.5 },
        { query: 'estratégias de seo 2024', impressions: 3456, clicks: 167, ctr: 4.8, position: 9.1 },
        { query: 'automação de marketing', impressions: 2987, clicks: 145, ctr: 4.9, position: 7.8 },
        { query: 'ferramentas de produtividade', impressions: 2654, clicks: 128, ctr: 4.8, position: 13.2 }
      ]
    };
  },

  async fetchTimeSeriesData(dateRange: GSCDateRange): Promise<GSCTimeSeriesData[]> {
    console.log('GSC API call - fetchTimeSeriesData:', dateRange);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock time series data
    return [
      { date: '2024-01-01', impressions: 6234, clicks: 287, ctr: 4.6, position: 12.1 },
      { date: '2024-01-02', impressions: 7123, clicks: 329, ctr: 4.6, position: 11.9 },
      { date: '2024-01-03', impressions: 6789, clicks: 314, ctr: 4.6, position: 12.3 },
      { date: '2024-01-04', impressions: 7456, clicks: 342, ctr: 4.6, position: 11.8 },
      { date: '2024-01-05', impressions: 6932, clicks: 318, ctr: 4.6, position: 12.4 },
      { date: '2024-01-06', impressions: 7234, clicks: 334, ctr: 4.6, position: 12.0 },
      { date: '2024-01-07', impressions: 6876, clicks: 310, ctr: 4.5, position: 12.2 }
    ];
  },

  async fetchTopPages(): Promise<{ page: string; impressions: number; clicks: number; ctr: number; position: number }[]> {
    console.log('GSC API call - fetchTopPages');
    
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return [
      { page: '/blog/marketing-digital-pequenas-empresas', impressions: 8934, clicks: 412, ctr: 4.6, position: 8.2 },
      { page: '/blog/como-aumentar-vendas-online', impressions: 7123, clicks: 345, ctr: 4.8, position: 9.1 },
      { page: '/blog/estrategias-seo-2024', impressions: 6234, clicks: 298, ctr: 4.8, position: 10.3 },
      { page: '/blog/automacao-marketing', impressions: 5432, clicks: 267, ctr: 4.9, position: 7.8 },
      { page: '/blog/ferramentas-produtividade', impressions: 4987, clicks: 234, ctr: 4.7, position: 11.2 }
    ];
  }
};
