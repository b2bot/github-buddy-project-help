
import { useState, useEffect } from "react";
import { calculateSeoScore } from "@/utils/seoSidebar";
import { useDebounce } from "@/hooks/useDebounce";

export interface SeoBreakdownItem {
  metric: string;
  score: number;
  weight: number;
}

export function useSeoScore(content: string, keyword: string, metaDesc: string, slug: string) {
  const [seoScore, setSeoScore] = useState(0);
  const [seoBreakdown, setSeoBreakdown] = useState<SeoBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedContent = useDebounce(content, 300);
  const debouncedKeyword = useDebounce(keyword, 300);
  const debouncedMeta = useDebounce(metaDesc, 300);
  const debouncedSlug = useDebounce(slug, 300);

  useEffect(() => {
    if (!debouncedContent || !debouncedKeyword) {
      setSeoScore(0);
      setSeoBreakdown([]);
      return;
    }

    setIsLoading(true);
    
    const calculate = async () => {
      try {
        const result = await calculateSeoScore(debouncedContent, debouncedKeyword, debouncedMeta, debouncedSlug);
        setSeoScore(result.totalScore);
        setSeoBreakdown(result.breakdown);
      } catch (error) {
        console.error('Error calculating SEO score:', error);
        setSeoScore(0);
        setSeoBreakdown([]);
      } finally {
        setIsLoading(false);
      }
    };

    calculate();
  }, [debouncedContent, debouncedKeyword, debouncedMeta, debouncedSlug]);

  return { seoScore, seoBreakdown, isLoading };
}
