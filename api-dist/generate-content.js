"use strict";
// API para geração de conteúdo com Assistant Clarencio
// Aplica Framework da Leadclinic para qualidade superior
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
async function handler(req, res) {
    // CORS Headers
    if (req.method === "OPTIONS") {
        res.status(200)
            .setHeader("Access-Control-Allow-Origin", "*")
            .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
            .end();
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { keyword, category, tone, method, sourceInput = '' } = req.body;
        console.log('Iniciando geração com Assistant Clarencio:', { keyword, category, tone, method });
        // Verificar variáveis de ambiente
        const apiKey = process.env.OPENAI_API_KEY;
        const assistantId = process.env.OPENAI_ASSISTANT_ID;
        const hasConfig = !!(apiKey && assistantId);
        console.log('Configuração:', { hasApiKey: !!apiKey, hasAssistantId: !!assistantId });
        if (hasConfig) {
            try {
                // Usar Assistant real da OpenAI
                const result = await generateWithAssistant(apiKey, assistantId, {
                    keyword,
                    category,
                    tone,
                    method,
                    sourceInput
                });
                if (result.success) {
                    console.log('Conteúdo gerado com sucesso via Assistant');
                    return res.status(200).json(result);
                }
            }
            catch (assistantError) {
                console.log('Erro no Assistant, usando fallback:', assistantError.message);
            }
        }
        // Fallback com Framework da Leadclinic aplicado
        console.log('Usando fallback com Framework da Leadclinic');
        const fallbackResult = generateWithFramework(keyword, category, tone, method, sourceInput);
        res.status(200).json(fallbackResult);
    }
    catch (error) {
        console.error('Erro geral:', error);
        // Fallback de emergência
        const emergencyResult = generateEmergencyFallback(req.body.keyword || 'conteúdo', req.body.category || 'geral');
        res.status(200).json(emergencyResult);
    }
}
async function generateWithAssistant(apiKey, assistantId, params) {
    const { keyword, category, tone, method, sourceInput } = params;
    // Criar thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
    });
    if (!threadResponse.ok) {
        throw new Error(`Erro ao criar thread: ${threadResponse.status}`);
    }
    const thread = await threadResponse.json();
    console.log('Thread criada:', thread.id);
    // Preparar prompt com Framework da Leadclinic
    const prompt = createFrameworkPrompt(keyword, category, tone, method, sourceInput);
    // Adicionar mensagem
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
            role: 'user',
            content: prompt
        })
    });
    if (!messageResponse.ok) {
        throw new Error(`Erro ao adicionar mensagem: ${messageResponse.status}`);
    }
    console.log('Mensagem adicionada à thread');
    // Executar run
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
            assistant_id: assistantId
        })
    });
    if (!runResponse.ok) {
        throw new Error(`Erro ao executar run: ${runResponse.status}`);
    }
    const run = await runResponse.json();
    console.log('Run iniciada:', run.id);
    // Aguardar conclusão (máximo 30 segundos)
    const finalRun = await waitForRunCompletion(apiKey, thread.id, run.id, 30);
    if (finalRun.status !== 'completed') {
        throw new Error(`Run não completada: ${finalRun.status}`);
    }
    // Obter mensagens
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
        }
    });
    if (!messagesResponse.ok) {
        throw new Error(`Erro ao obter mensagens: ${messagesResponse.status}`);
    }
    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    if (!assistantMessage || !assistantMessage.content[0]?.text?.value) {
        throw new Error('Resposta do Assistant vazia');
    }
    const responseText = assistantMessage.content[0].text.value;
    console.log('Resposta do Assistant recebida');
    // Parsear resposta JSON
    try {
        const parsedResponse = JSON.parse(responseText);
        return {
            success: true,
            content: parsedResponse.content,
            seoData: {
                keyword: keyword,
                slug: parsedResponse.slug,
                metaDescription: parsedResponse.metaDescription,
                altText: parsedResponse.altText,
                excerpt: parsedResponse.excerpt,
                category: category,
                title: parsedResponse.title
            },
            source: 'assistant'
        };
    }
    catch (parseError) {
        console.log('Erro ao parsear resposta do Assistant');
        throw new Error('Resposta inválida do Assistant');
    }
}
async function waitForRunCompletion(apiKey, threadId, runId, maxSeconds) {
    const maxAttempts = maxSeconds * 2; // Check every 500ms
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });
        if (!runResponse.ok) {
            throw new Error(`Erro ao verificar run: ${runResponse.status}`);
        }
        const run = await runResponse.json();
        console.log(`Status da run (tentativa ${attempt + 1}):`, run.status);
        if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
            return run;
        }
        // Aguardar 500ms antes da próxima verificação
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error('Timeout aguardando conclusão da run');
}
function createFrameworkPrompt(keyword, category, tone, method, sourceInput) {
    return `Crie um artigo SEO completo aplicando o Framework da Leadclinic para a palavra-chave: "${keyword}"

PARÂMETROS:
- Palavra-chave: ${keyword}
- Categoria: ${category}
- Tom: ${tone}
- Método: ${method}
${sourceInput ? `- Conteúdo base: ${sourceInput}` : ''}

FRAMEWORK DA LEADCLINIC A APLICAR:

1. ASSUNTO PRINCIPAL: ${keyword}
2. OBJETIVO: Educar e gerar leads qualificados
3. PÚBLICO-ALVO: Profissionais da área de ${category}
4. BIG IDEA: Transformar ${keyword} em vantagem competitiva
5. EMOÇÃO: Oportunidade e urgência de implementação
6. ESTRUTURA: Introdução + 3-4 seções principais + Conclusão com CTA

REQUISITOS OBRIGATÓRIOS:
- Título impactante com palavra-chave
- Meta description persuasiva (150-160 caracteres)
- Artigo estruturado com H2 e H3
- Mínimo 800 palavras
- Parágrafos curtos e escaneáveis
- CTA estratégico no final
- Alt text otimizado
- Slug SEO-friendly
- Excerpt envolvente

RETORNE APENAS JSON VÁLIDO:
{
  "title": "Título otimizado com palavra-chave",
  "slug": "slug-seo-friendly",
  "metaDescription": "Meta description persuasiva de 150-160 caracteres",
  "altText": "Alt text otimizado para imagem",
  "excerpt": "Resumo envolvente do artigo",
  "content": "Conteúdo HTML completo com <h2>, <p>, <ul>, etc."
}`;
}
function generateWithFramework(keyword, category, tone, method, sourceInput) {
    console.log('Aplicando Framework da Leadclinic no fallback');
    // Aplicar Framework da Leadclinic
    const assuntoPrincipal = keyword;
    const objetivo = 'Educar e gerar leads qualificados';
    const publicoAlvo = `Profissionais da área de ${category}`;
    const bigIdea = `Como ${keyword} pode transformar resultados na área de ${category}`;
    const emocao = 'Oportunidade e urgência de implementação';
    // Gerar slug otimizado
    const slug = keyword.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    // Título impactante seguindo Framework
    const title = `Como Dominar ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Estratégias Que Realmente Funcionam em ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    // Meta description persuasiva
    const metaDescription = `Descubra estratégias comprovadas de ${keyword} para ${category}. Guia completo com técnicas práticas para resultados mensuráveis. Comece hoje!`;
    // Alt text otimizado
    const altText = `Profissional implementando estratégias de ${keyword} em ${category} - guia completo`;
    // Excerpt envolvente
    const excerpt = `Transforme sua abordagem em ${category} com estratégias avançadas de ${keyword}. Descubra técnicas que geram resultados reais e mensuráveis.`;
    // Conteúdo estruturado seguindo Framework
    const content = `
    <h2>Por Que ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} É Fundamental Para Seu Sucesso em ${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
    <p>No cenário competitivo atual de <strong>${category}</strong>, dominar <strong>${keyword}</strong> não é mais opcional - é uma necessidade estratégica. Profissionais que aplicam essas técnicas corretamente estão obtendo resultados até 300% superiores aos concorrentes.</p>
    <p>Neste guia completo, você descobrirá estratégias comprovadas que transformarão sua abordagem e gerarão resultados mensuráveis desde a primeira implementação.</p>
    
    <h2>Os 5 Pilares Fundamentais de ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} em ${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
    <p>Após analisar centenas de casos de sucesso, identificamos 5 pilares que separam os profissionais de alta performance dos demais:</p>
    <ul>
      <li><strong>Estratégia baseada em dados:</strong> Decisões fundamentadas em métricas reais</li>
      <li><strong>Implementação sistemática:</strong> Processos estruturados e replicáveis</li>
      <li><strong>Monitoramento contínuo:</strong> Acompanhamento de KPIs essenciais</li>
      <li><strong>Otimização constante:</strong> Melhorias baseadas em resultados</li>
      <li><strong>Escalabilidade planejada:</strong> Crescimento sustentável e controlado</li>
    </ul>
    
    <h2>Implementação Prática: Passo a Passo Para Resultados Imediatos</h2>
    <p>A teoria sem aplicação prática não gera resultados. Por isso, desenvolvemos um método passo a passo que você pode implementar imediatamente:</p>
    
    <h3>Fase 1: Diagnóstico e Planejamento (Semana 1)</h3>
    <p>Comece com uma análise detalhada da situação atual. Identifique gaps, oportunidades e defina objetivos SMART específicos para <strong>${keyword}</strong> em seu contexto de <strong>${category}</strong>.</p>
    
    <h3>Fase 2: Implementação Estruturada (Semanas 2-4)</h3>
    <p>Execute as estratégias de forma sistemática, priorizando ações de alto impacto. Estabeleça métricas de acompanhamento e crie rotinas de monitoramento.</p>
    
    <h3>Fase 3: Otimização e Escala (Semanas 5-8)</h3>
    <p>Analise resultados, ajuste estratégias e prepare a escalabilidade. Esta fase é crucial para transformar sucessos pontuais em resultados consistentes.</p>
    
    <h2>Erros Críticos Que Podem Comprometer Seus Resultados</h2>
    <p>Mesmo profissionais experientes cometem erros que podem comprometer todo o trabalho. Evite estas armadilhas comuns:</p>
    <ul>
      <li>Implementar sem planejamento estratégico adequado</li>
      <li>Ignorar métricas de acompanhamento essenciais</li>
      <li>Não adaptar estratégias ao contexto específico</li>
      <li>Abandonar processos antes de ver resultados</li>
      <li>Não documentar aprendizados e melhores práticas</li>
    </ul>
    
    <h2>Cases de Sucesso: Resultados Reais em ${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
    <p>Empresas que aplicaram corretamente essas estratégias de <strong>${keyword}</strong> obtiveram resultados impressionantes:</p>
    <ul>
      <li>Aumento médio de 250% na eficiência operacional</li>
      <li>Redução de 40% nos custos de aquisição</li>
      <li>Melhoria de 180% na satisfação dos clientes</li>
      <li>Crescimento sustentável de 35% ao ano</li>
    </ul>
    
    <h2>Próximos Passos: Transforme Conhecimento em Resultados</h2>
    <p>Agora que você conhece as estratégias fundamentais de <strong>${keyword}</strong> para <strong>${category}</strong>, é hora de colocar em prática. Lembre-se: conhecimento sem ação não gera resultados.</p>
    <p>Comece implementando uma estratégia por vez, monitore os resultados e ajuste conforme necessário. A consistência na execução é o que separa profissionais de alta performance dos demais.</p>
    
    <p><strong>Pronto para transformar sua abordagem em ${category} e alcançar resultados extraordinários com ${keyword}?</strong> O momento de agir é agora. Cada dia de atraso representa oportunidades perdidas e vantagem concedida aos concorrentes.</p>
  `;
    return {
        success: true,
        content: content,
        seoData: {
            keyword: keyword,
            slug: slug,
            metaDescription: metaDescription,
            altText: altText,
            excerpt: excerpt,
            category: category,
            title: title
        },
        source: 'framework_leadclinic'
    };
}
function generateEmergencyFallback(keyword, category) {
    const slug = (keyword || 'artigo').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    return {
        success: true,
        content: `
      <h2>Conteúdo Sobre ${keyword || 'Tópico'}</h2>
      <p>Este é um artigo sobre <strong>${keyword || 'o tópico solicitado'}</strong> na categoria ${category}.</p>
      <p>O conteúdo foi gerado automaticamente e pode ser editado conforme necessário.</p>
    `,
        seoData: {
            keyword: keyword || 'artigo',
            slug: slug,
            metaDescription: `Artigo sobre ${keyword || 'o tópico'} - conteúdo otimizado para SEO.`,
            altText: `Imagem relacionada a ${keyword || 'o artigo'}`,
            excerpt: `Artigo sobre ${keyword || 'o tópico solicitado'}.`,
            category: category,
            title: `Artigo sobre ${keyword || 'Tópico'}`
        },
        source: 'emergency_fallback'
    };
}
