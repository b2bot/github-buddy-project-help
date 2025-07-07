// Google Analytics Integration Stub
// TODO: Implementar conexão real com Google Analytics Reporting API

export interface GAMetrics {
  visitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViews: number;
  organicTraffic: number;
  socialTraffic: number;
  directTraffic: number;
}

export interface GADateRange {
  startDate: string;
  endDate: string;
}

export interface GATimeSeriesData {
  date: string;
  visitors: number;
  posts: number;
}

export const ga = {
  async fetchMetrics(dateRange: GADateRange): Promise<GAMetrics> {
    // Stub implementation
    console.log('GA API call - fetchMetrics:', dateRange);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock data
    return {
      visitors: 12543,
      bounceRate: 32.5,
      avgSessionDuration: 145, // seconds
      pageViews: 18729,
      organicTraffic: 8234,
      socialTraffic: 2134,
      directTraffic: 2175
    };
  },

  async fetchTimeSeriesData(dateRange: GADateRange): Promise<GATimeSeriesData[]> {
    console.log('GA API call - fetchTimeSeriesData:', dateRange);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock time series data
    return [
      { date: '2024-01-01', visitors: 1250, posts: 3 },
      { date: '2024-01-02', visitors: 1420, posts: 2 },
      { date: '2024-01-03', visitors: 1680, posts: 4 },
      { date: '2024-01-04', visitors: 1890, posts: 3 },
      { date: '2024-01-05', visitors: 2100, posts: 5 },
      { date: '2024-01-06', visitors: 1950, posts: 2 },
      { date: '2024-01-07', visitors: 2300, posts: 6 }
    ];
  },

  async fetchTrafficSources(): Promise<{ name: string; value: number; color: string }[]> {
    console.log('GA API call - fetchTrafficSources');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      { name: 'Orgânico', value: 8234, color: '#22c55e' },
      { name: 'Social', value: 2134, color: '#3b82f6' },
      { name: 'Direto', value: 2175, color: '#8b5cf6' },
      { name: 'Referral', value: 1890, color: '#f59e0b' },
      { name: 'Email', value: 896, color: '#ef4444' }
    ];
  }
};