
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useSeoScore } from "@/hooks/seoSidebar/useSeoScore";
import { useLlmScore } from "@/hooks/seoSidebar/useLlmScore";

interface SeoSidebarProps {
  content: string;
  keyword: string;
  metaDescription: string;
  slug: string;
}

interface ChecklistItem {
  label: string;
  completed: boolean;
  requirement: string;
}

export function SeoSidebar({ content, keyword, metaDescription, slug }: SeoSidebarProps) {
  const { seoScore, seoBreakdown, isLoading: seoLoading } = useSeoScore(content, keyword, metaDescription, slug);
  const { llmScore, llmBreakdown, isLoading: llmLoading } = useLlmScore(content, keyword);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const ScoreIcon = ({ score }: { score: number }) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  // Dynamic checklist based on actual content analysis
  const getChecklist = (): ChecklistItem[] => {
    const checklist: ChecklistItem[] = [];

    if (!keyword) {
      return [{
        label: "Defina uma palavra-chave principal",
        completed: false,
        requirement: "Adicione a palavra-chave na aba Configurações SEO"
      }];
    }

    const findSeo = (name: string) => seoBreakdown.find(m => m.metric === name);
    const findLlm = (name: string) => llmBreakdown.find(m => m.metric === name);
    const add = (label: string, metric: {score: number} | undefined, hint: string) => {
      checklist.push({
        label,
        completed: (metric?.score || 0) >= 80,
        requirement: metric ? `Score atual: ${metric.score}%` : hint
      });
    };

    add("Keyword no título (H1)", findSeo("Keyword no Título (H1)"), "Inclua a palavra-chave no título principal");
    add("Keyword na meta description", findSeo("Meta Description"), "Inclua a palavra-chave na meta description");
    add("Keyword no URL (slug)", findSeo("Keyword no URL (slug)"), "Inclua a palavra-chave no slug");
    add("Keyword nos primeiros 10%", findSeo("Keyword nos Primeiros 10%"), "Inclua a palavra-chave nos primeiros parágrafos");
    add("Densidade de keyword (1-2%)", findSeo("Densidade de Keyword (1–2%)"), "Ajuste a densidade para 1-2%");
    add("Comprimento mínimo (300 palavras)", findSeo("Comprimento Mínimo (300 palavras)"), "Escreva pelo menos 300 palavras");
    add("Headings H1-H5 corretos", findSeo("Headings (H1–H5)"), "Use 1 H1, 2+ H2 e 1+ H3");
    add("Parágrafos curtos (≤80)", findSeo("Parágrafos Curtos"), "Mantenha parágrafos até 80 palavras");
    add("Alt Text em imagens", findSeo("Alt Text em Imagens"), "Adicione texto alternativo nas imagens");
    add("Links Internos & Externos", findSeo("Links Internos & Externos DoFollow"), "Inclua links internos e externos");
    add("Legibilidade (Flesch-Kincaid)", findSeo("Legibilidade (Flesch-Kincaid)"), "Melhore a legibilidade");

    add("Cobertura de Entidades", findLlm("Cobertura de Entidades Semânticas (LLM)"), "Adicione entidades relacionadas");
    add("Resposta Direta (TL;DR)", findLlm("Resposta Direta (TL;DR)"), "Adicione um resumo inicial");
    add("Structured Data", findLlm("Structured Data (Other Schemas)"), "Inclua JSON-LD HowTo/Article/FAQ");
    add("JSON-LD FAQ/Schema", findSeo("JSON-LD FAQ / Schema"), "Adicione FAQ ou HowTo");
    add("Uso de números no título", findSeo("Uso de números no título"), "Considere usar números no H1");

    return checklist;
  };

  const checklist = getChecklist();

  return (
    <div className="space-y-4">
      {/* SEO Score */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ScoreIcon score={seoScore} />
            SEO Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
              {seoLoading ? "..." : seoScore}
            </div>
            <Progress value={seoScore} className="mt-2 h-2" />
          </div>
          
          <div className="space-y-1">
            {seoBreakdown.map((item) => (
              <div key={item.metric} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{item.metric}</span>
                <Badge 
                  variant="outline" 
                  className={`${getScoreBg(item.score)} ${getScoreColor(item.score)} text-xs px-1`}
                >
                  {item.score}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LLM Score */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ScoreIcon score={llmScore} />
            LLM Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(llmScore)}`}>
              {llmLoading ? "..." : llmScore}
            </div>
            <Progress value={llmScore} className="mt-2 h-2" />
          </div>
          
          <div className="space-y-1">
            {llmBreakdown.map((item) => (
              <div key={item.metric} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{item.metric}</span>
                <Badge 
                  variant="outline" 
                  className={`${getScoreBg(item.score)} ${getScoreColor(item.score)} text-xs px-1`}
                >
                  {item.score}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Checklist */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Checklist Dinâmico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded border">
                {item.completed ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${item.completed ? 'text-green-700' : 'text-gray-900'}`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {item.requirement}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-2 bg-muted rounded">
            <div className="text-xs font-medium">
              Progresso: {checklist.filter(item => item.completed).length}/{checklist.length}
            </div>
            <Progress 
              value={(checklist.filter(item => item.completed).length / checklist.length) * 100} 
              className="mt-1 h-1" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
