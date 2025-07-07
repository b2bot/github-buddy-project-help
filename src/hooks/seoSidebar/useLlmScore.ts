
import { useState, useEffect } from "react";
import { calculateLlmScore } from "@/utils/seoSidebar";
import { useDebounce } from "@/hooks/useDebounce";

export interface LlmBreakdownItem {
  metric: string;
  score: number;
  weight: number;
}

export function useLlmScore(content: string, keyword: string) {
  const [llmScore, setLlmScore] = useState(0);
  const [llmBreakdown, setLlmBreakdown] = useState<LlmBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedContent = useDebounce(content, 300);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (!debouncedContent || !debouncedKeyword) {
      setLlmScore(0);
      setLlmBreakdown([]);
      return;
    }

    setIsLoading(true);
    
    const calculate = async () => {
      try {
        const result = await calculateLlmScore(debouncedContent, debouncedKeyword);
        setLlmScore(result.totalScore);
        setLlmBreakdown(result.breakdown);
      } catch (error) {
        console.error('Error calculating LLM score:', error);
        setLlmScore(0);
        setLlmBreakdown([]);
      } finally {
        setIsLoading(false);
      }
    };

    calculate();
  }, [debouncedContent, debouncedKeyword]);

  return { llmScore, llmBreakdown, isLoading };
}
