
import { useQuery } from "@tanstack/react-query";

export interface TrendsDataParams {
  keywords: string[];
  startDate: string;
  endDate: string;
}

export interface TrendsData {
  keyword: string;
  data: {
    date: string;
    value: number;
  }[];
}

export interface SeasonalityData {
  month: number;
  day: number;
  hour: number;
  value: number;
}

export interface RelatedQuery {
  query: string;
  value: number;
}

export interface TrendsResponse {
  trends: TrendsData[];
  seasonality: SeasonalityData[];
  relatedQueries: RelatedQuery[];
  insights: {
    growth: number;
    topKeyword: string;
    bestDay: string;
  };
}

// Mock data generator for demonstration
const generateMockTrendsData = (params: TrendsDataParams): TrendsResponse => {
  const { keywords, startDate, endDate } = params;
  
  // Generate time series data
  const trends = keywords.map(keyword => ({
    keyword,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 20
    }))
  }));

  // Generate seasonality heatmap data
  const seasonality = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        month: month + 1,
        day: day + 1,
        hour,
        value: Math.floor(Math.random() * 100)
      }))
    )
  ).flat(2);

  // Generate related queries
  const relatedQueries = [
    { query: "marketing digital", value: 85 },
    { query: "seo optimization", value: 72 },
    { query: "content strategy", value: 68 },
    { query: "social media", value: 63 },
    { query: "google ads", value: 58 },
    { query: "email marketing", value: 54 },
    { query: "analytics", value: 47 },
    { query: "conversion rate", value: 42 }
  ];

  const insights = {
    growth: Math.floor(Math.random() * 50) + 10,
    topKeyword: keywords[0] || "marketing digital",
    bestDay: "Segunda-feira"
  };

  return { trends, seasonality, relatedQueries, insights };
};

export const useTrendsData = (params: TrendsDataParams) => {
  return useQuery({
    queryKey: ['trends', params],
    queryFn: () => generateMockTrendsData(params),
    enabled: params.keywords.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
