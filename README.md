
# Partner SEO - Ferramenta de Otimização de Conteúdo

Uma ferramenta interna para agências que automatiza a criação, otimização e publicação de artigos SEO usando IA

## 🚀 Funcionalidades 

### Editor Rico Avançado
- Editor de texto rico com toolbar completa
- Controle de fonte por seleção (10px - 30px)
- Níveis de cabeçalho (H1-H5) + Texto Normal
- Listas, citações, código e embeds
- Upload de imagem de destaque (máx. 100KB)
- Sugestões de parágrafo com IA

### Criação de Conteúdo com IA
- **Wizard em 4 passos**:
  1. Contexto (palavra-chave + interesses do público)
  2. Geração e seleção de títulos
  3. Geração e seleção de parágrafos
  4. Montagem final automática
- Importação de conteúdo externo (YouTube, URLs, texto)

### Otimização SEO em Tempo Real
- **SEO Score Clássico** (0-100):
  - Densidade de palavra-chave (1-2%)
  - Estrutura de headings (H1-H5)
  - Comprimento de título e meta description
  - Comprimento de parágrafos (40-60 palavras)
  - Alt text em imagens
  - Links internos
  - Legibilidade (Flesch-Kincaid)

- **LLM Score IA-First** (0-100):
  - Entidades semânticas
  - Resposta direta no primeiro parágrafo
  - JSON-LD / Schema markup
  - Cobertura de tópicos correlatos
  - Relevância contextual

### Análise e Performance
- **Analytics com 3 abas**:
  - Visão Geral: métricas GA + GSC combinadas
  - SEO Score: histórico e trends
  - LLM Score: correlação com tráfego
- Gráficos interativos (Recharts)
- Métricas em tempo real

### Integrações
- **WordPress**: webhook para publicação automática
- **Google Analytics**: métricas de tráfego
- **Google Search Console**: dados de busca
- **OpenAI**: geração de conteúdo

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup
```bash
# Clone o repositório
git clone <repository-url>
cd partner-seo

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
Configure as seguintes variáveis no seu ambiente:

```bash
# OpenAI (obrigatório para IA)
NEXT_PUBLIC_OPENAI_API_KEY=sk-...

# WordPress (opcional - para publicação)
NEXT_PUBLIC_WORDPRESS_URL=https://seusite.com
NEXT_PUBLIC_WORDPRESS_TOKEN=seu-token-aqui

# Google Analytics (opcional)
GA_VIEW_ID=123456789
GA_API_KEY=sua-chave-ga

# Google Search Console (opcional)
GSC_SITE_URL=https://seusite.com
GSC_API_KEY=sua-chave-gsc
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── manual/                 # Componentes do editor
│   │   ├── CreatePostWizard.tsx
│   │   ├── ImportContentModal.tsx
│   │   └── VideoEmbedModal.tsx
│   ├── seoScore/              # Sistema de pontuação SEO
│   │   ├── SeoConfigTab.tsx
│   │   ├── SeoOptimizationTab.tsx
│   │   └── SeoSidebar.tsx
│   └── ui/                    # Componentes base (shadcn/ui)
├── hooks/
│   ├── useSeoScore.ts         # Hook para SEO Score
│   ├── useLlmScore.ts         # Hook para LLM Score
│   └── useDebounce.ts         # Debounce para otimização
├── integrations/
│   ├── openai.ts              # Cliente OpenAI
│   ├── wordpress.ts           # Webhook WordPress
│   ├── ga.ts                  # Google Analytics
│   └── gsc.ts                 # Google Search Console
├── pages/
│   ├── Manual.tsx             # Editor principal
│   ├── Analytics.tsx          # Dashboard de métricas
│   ├── Integrations.tsx       # Configuração de APIs
│   └── Performance.tsx        # Insights de performance
└── utils/
    └── seoScore.ts            # Lógica de cálculo de scores
```

## 🎯 Como Usar

### 1. Criar Artigo Manualmente
1. Acesse `/manual`
2. Use o editor rico para escrever
3. Configure SEO na aba "Configurações SEO"
4. Monitore pontuação na aba "Otimização SEO"
5. Salve como rascunho ou envie para fila

### 2. Criar com IA (Wizard)
1. Vá para a aba "Criar com IA"
2. **Step 1**: Insira palavra-chave e interesses do público
3. **Step 2**: Selecione títulos gerados pela IA
4. **Step 3**: Escolha parágrafos relevantes
5. **Step 4**: Conteúdo é montado automaticamente no editor

### 3. Monitorar Performance
1. Acesse `/analytics`
2. **Visão Geral**: métricas GA + GSC
3. **SEO Score**: evolução da pontuação clássica
4. **LLM Score**: trends de otimização IA

## 🧪 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Linter
```

### Tecnologias Principais
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **shadcn/ui** (componentes)
- **TipTap** (editor rico)
- **Recharts** (gráficos)
- **React Query** (estado/cache)

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- Netlify
- Heroku
- AWS Amplify
- Railway

## 📊 Métricas e Scoring

### SEO Score (Métricas Clássicas)
| Métrica | Peso | Descrição |
|---------|------|-----------|
| Densidade Keyword | 20% | 1-2% ideal |
| Estrutura Headings | 15% | H1 único, H2-H5 distribuídos |
| Título SEO | 10% | 30-60 caracteres |
| Meta Description | 10% | 150-160 caracteres |
| Parágrafos | 15% | 40-60 palavras por parágrafo |
| Alt Text | 10% | Imagens com descrição |
| Links Internos | 10% | Mínimo 3 links |
| Legibilidade | 10% | Flesch-Kincaid score |

### LLM Score (Métricas IA-First)
| Métrica | Peso | Descrição |
|---------|------|-----------|
| Entidades Semânticas | 25% | Termos relacionados ao tópico |
| Resposta Direta | 20% | TL;DR no primeiro parágrafo |
| Structured Data | 15% | JSON-LD, FAQ, HowTo |
| Cobertura Tópicos | 20% | LSI e tópicos correlatos |
| Relevância Contextual | 20% | Proximidade e contexto |

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Plugin WordPress real (substituir webhook)
- [ ] A/B testing de prompts IA
- [ ] Integração com ferramentas SERP
- [ ] Sistema de templates
- [ ] Análise de concorrentes
- [ ] Automação de publicação social
- [ ] Dashboard de ROI/conversões

## 📄 Atualizações

Release 08 de Julho de 2025:

💬 Chat com a IA (Clarencio)
O sistema agora conta com uma interface de chat conversacional com a IA “Clarencio”, integrada diretamente à API da OpenAI (via Function Calling). Esse chat permite que o usuário crie conteúdos orientados por etapas, com linguagem descontraída e assistência guiada, baseado no Framework Oficial da Leadclinic.

Funcionalidades:
Fluxo guiado de criação por etapas (ex: escolha de palavra-chave, geração de título, estruturação dos parágrafos, revisão SEO).

Respostas da IA em tom amigável, com sugestões claras.

IA integrada com as funções reais do sistema (generateContent, getSeoScore, suggestSeoFixes).

Capacidade de revisar conteúdos já existentes e sugerir melhorias com base no SEO Score e LLM Score.

🎯 Estratégias de Conteúdo
Uma nova aba “Estratégia” foi adicionada ao sistema para auxiliar o planejamento de conteúdo a médio/longo prazo.

O que é possível fazer:
Criar planos de conteúdo por nicho ou campanha.

Visualizar sugestões automáticas de pauta com base em tendências e interesse do público.

Gerar títulos e temas com a IA a partir de uma base estratégica (ex: transcrição de vídeo, estudo de persona, URLs).

🧠 Modo Inteligente de Otimização (IA + Métricas)
Ao lado da aba de edição, foi integrada uma barra lateral inteligente com IA, que:

Analisa o conteúdo em tempo real com base no SEO Score e LLM Score.

Sugere ações de melhoria com comandos rápidos (ex: “reescrever o H1”, “melhorar o 2º parágrafo”).

Explica o impacto de cada sugestão em linguagem simples.

Mostra as regras que não estão sendo atendidas.

🧱 Arquitetura GPT + API OpenAI
A ferramenta utiliza um modelo GPT-4 com Assistant configurado na plataforma OpenAI (https://platform.openai.com/assistants), com suporte a Function Calling.

Funções Integradas:
generateContent: Geração completa de artigos com base em palavra-chave, transcrição ou instruções manuais.

getSeoScore: Cálculo do SEO Score com base em regras clássicas e modernas.

suggestSeoFixes: Sugestões automáticas com base nas pontuações.

publishToWordpress: Publicação automática via Webhook WordPress.

Formato de Resposta:
A IA retorna sempre em formato JSON estruturado, pronto para ser consumido pela fila de geração ou editor manual.

⚙️ Fila de Geração + Publicação Automática
Fila Inteligente:
Os conteúdos gerados vão automaticamente para uma fila.

Podem ser revisados, otimizados, ou enviados diretamente para o WordPress.

Integração WordPress:
Sistema conectado via Webhook com autenticação por token.

Permite envio de conteúdo com imagem, slug, metadados, e links internos prontos.

🧠 Estratégia de IA Conversacional
O sistema adota uma abordagem dupla para interação com a IA:

Modo	Descrição
Autônomo (API)	Geração de artigos por comandos diretos. Ideal para uso rápido e em massa.
Conversacional (Chat)	Geração passo-a-passo com orientação e sugestões. Ideal para usuários menos técnicos ou para garantir qualidade refinada.



Este projeto é propriedade privada da agência. Todos os direitos reservados.

---

**Partner SEO** - Criado para maximizar performance de conteúdo com IA 🚀
