import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostWizard } from "@/components/manual/CreatePostWizard";

import TipTapEditor from "@/components/manual/TipTapEditor";



import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Bold, Italic, List, ListOrdered, Quote, Code, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, Calendar, PenTool, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { openai } from "@/integrations/openai";
import { ImportContentModal } from "@/components/manual/ImportContentModal";
import { VideoEmbedModal } from "@/components/manual/VideoEmbedModal";

import { SeoConfigTab } from "@/components/seoSidebar/SeoConfigTab";
import { SeoSidebar } from "@/components/seoSidebar/SeoSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { wordpress } from "@/integrations/wordpress";

interface SEOData {
  keyword: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  category: string;
  title?: string;
}

export default function Manual() {
  const [content, setContent] = useState("");
  const [seoData, setSeoData] = useState<SEOData>({
    keyword: "",
    slug: "",
    metaDescription: "",
    altText: "",
    excerpt: "",
    category: "",
    title: ""
  });

  // Check for content from Clarencio chat
  useEffect(() => {
    const clarencioContent = localStorage.getItem('clarencio_generated_content');
    if (clarencioContent) {
      try {
        const parsed = JSON.parse(clarencioContent);
        if (parsed.content && parsed.seoData) {
          setContent(parsed.content);
          setSeoData(parsed.seoData);
          
          // Clear the stored content after loading
          localStorage.removeItem('clarencio_generated_content');
        }
      } catch (error) {
        console.error('Error parsing Clarencio content:', error);
      }
    }
  }, []);

  const handleImportContent = (importedContent: string, importedSeoData?: SEOData) => {
    setContent(importedContent);
    if (importedSeoData) {
      setSeoData(importedSeoData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor Manual</h1>
          <p className="text-gray-600">Crie e edite conteúdos otimizados para SEO</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="wizard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
                <TabsTrigger value="wizard" className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>IA Wizard</span>
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>Editor</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wizard">
                <CreatePostWizard onImport={handleImportContent} />
              </TabsContent>

              <TabsContent value="editor">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Editor de Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TipTapEditor content={content} onChange={setContent} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Preview do Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: content || '<p>Nenhum conteúdo para visualizar.</p>' }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* SEO Sidebar */}
          <div className="xl:col-span-1">
            <SeoSidebar 
              content={content} 
              seoData={seoData}
              onSeoDataChange={setSeoData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
