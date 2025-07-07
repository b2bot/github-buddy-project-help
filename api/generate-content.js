// Endpoint Vercel para integração com OpenAI Assistant
// Este arquivo deve ser deployado na Vercel junto com as variáveis de ambiente

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { keyword, category, tone, method, sourceInput } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: 'Palavra-chave é obrigatória' });
    }

    // Configuração da OpenAI
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

    console.log('Variáveis de ambiente:', {
      hasApiKey: !!OPENAI_API_KEY,
      hasAssistantId: !!ASSISTANT_ID
    });

    // Se não tiver as variáveis configuradas, usar fallback
    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      console.log('Variáveis OpenAI não configuradas, usando fallback');
      return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
    }

    console.log('Iniciando geração de conteúdo com OpenAI:', { keyword, category, tone, method });

    // 1. Criar thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      console.error('Erro ao criar thread:', threadResponse.statusText);
      return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
    }

    const thread = await threadResponse.json();
    console.log('Thread criada:', thread.id);

    // 2. Adicionar mensagem à thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: `Gere um artigo completo usando a função generateContent com os seguintes parâmetros:
        - Palavra-chave: ${keyword}
        - Categoria: ${category || 'Geral'}
        - Tom: ${tone}
        - Método: ${method}
        - Conteúdo base: ${sourceInput || ''}`
      })
    });

    if (!messageResponse.ok) {
      console.error('Erro ao adicionar mensagem:', messageResponse.statusText);
      return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
    }

    console.log('Mensagem adicionada à thread');

    // 3. Executar o assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        tools: [
          {
            type: 'function',
            function: {
              name: 'generateContent',
              description: 'Gera conteúdo completo com base em uma palavra-chave e preenche automaticamente os campos SEO.',
              parameters: {
                type: 'object',
                properties: {
                  keyword: { type: 'string' },
                  category: { type: 'string' },
                  tone: { type: 'string' },
                  method: { type: 'string', enum: ['manual', 'public_interest', 'youtube', 'url'] },
                  sourceInput: { type: 'string' }
                },
                required: ['keyword', 'category', 'tone', 'method', 'sourceInput']
              }
            }
          }
        ]
      })
    });

    if (!runResponse.ok) {
      console.error('Erro ao executar assistant:', runResponse.statusText);
      return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
    }

    const run = await runResponse.json();
    console.log('Run iniciada:', run.id);

    // 4. Aguardar conclusão e processar function calls
    let runStatus = run;
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo

    while (runStatus.status === 'queued' || runStatus.status === 'in_progress' || runStatus.status === 'requires_action') {
      if (attempts >= maxAttempts) {
        console.log('Timeout: Assistant demorou muito, usando fallback');
        return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
      attempts++;

      // Verificar status da run
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!statusResponse.ok) {
        console.error('Erro ao verificar status:', statusResponse.statusText);
        return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
      }

      runStatus = await statusResponse.json();
      console.log(`Status da run (tentativa ${attempts}):`, runStatus.status);

      // Se requer ação (function call)
      if (runStatus.status === 'requires_action') {
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        console.log('Function calls detectadas:', toolCalls.length);

        // Processar cada function call
        const toolOutputs = [];
        
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === 'generateContent') {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('Argumentos da função generateContent:', args);

            // Gerar conteúdo baseado nos argumentos
            const generatedContent = await generateContentWithAI(args, OPENAI_API_KEY);
            
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify(generatedContent)
            });
          }
        }

        // Submeter outputs das funções
        const submitResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}/submit_tool_outputs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            tool_outputs: toolOutputs
          })
        });

        if (!submitResponse.ok) {
          console.error('Erro ao submeter tool outputs:', submitResponse.statusText);
          return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
        }

        console.log('Tool outputs submetidos');
      }
    }

    if (runStatus.status === 'completed') {
      // Buscar mensagens da thread
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!messagesResponse.ok) {
        console.error('Erro ao buscar mensagens:', messagesResponse.statusText);
        return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
      }

      const messages = await messagesResponse.json();
      const lastMessage = messages.data[0];

      if (lastMessage && lastMessage.content[0] && lastMessage.content[0].text) {
        const responseText = lastMessage.content[0].text.value;
        
        try {
          // Tentar parsear como JSON
          const contentData = JSON.parse(responseText);
          console.log('Conteúdo gerado com sucesso via OpenAI');
          return res.status(200).json(contentData);
        } catch (parseError) {
          // Se não for JSON válido, retornar estrutura padrão
          console.log('Resposta não é JSON válido, criando estrutura padrão');
          return res.status(200).json({
            title: `${keyword}: Guia Completo`,
            slug: keyword.toLowerCase().replace(/\s+/g, '-'),
            metaDescription: `Descubra tudo sobre ${keyword} neste guia completo e prático.`,
            altText: `Imagem ilustrativa sobre ${keyword}`,
            excerpt: `Aprenda sobre ${keyword} de forma prática e eficiente.`,
            content: `<h1>${keyword}: Guia Completo</h1><p>${responseText}</p>`,
            internalLinks: []
          });
        }
      }
    }

    // Se chegou até aqui e não conseguiu gerar, usar fallback
    console.log('Não foi possível gerar conteúdo via OpenAI, usando fallback');
    return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));

  } catch (error) {
    console.error('Erro na geração de conteúdo:', error);
    
    // Em caso de erro, sempre retornar fallback em vez de erro
    const { keyword, category, tone, method, sourceInput } = req.body;
    return res.status(200).json(generateFallbackContent({ keyword, category, tone, method, sourceInput }));
  }
}

// Função auxiliar para gerar conteúdo com IA
async function generateContentWithAI(args, apiKey) {
  const { keyword, category, tone, method, sourceInput } = args;

  // Construir prompt baseado no método
  let prompt = `Crie um artigo completo sobre "${keyword}" na categoria "${category}" com tom ${tone}.`;
  
  if (method === 'public_interest' && sourceInput) {
    prompt += ` Considere os seguintes interesses do público: ${sourceInput}`;
  } else if (method === 'youtube' && sourceInput) {
    prompt += ` Baseie-se na seguinte transcrição: ${sourceInput}`;
  } else if (method === 'url' && sourceInput) {
    prompt += ` Use como referência o seguinte conteúdo: ${sourceInput}`;
  }

  prompt += `

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "title": "Título otimizado para SEO",
  "slug": "slug-amigavel-para-url",
  "metaDescription": "Meta description persuasiva com a palavra-chave",
  "altText": "Alt text para imagem de capa",
  "excerpt": "Resumo curto do artigo",
  "content": "Conteúdo HTML completo com <h1>, <h2>, <p>, etc.",
  "internalLinks": ["https://exemplo.com/link1", "https://exemplo.com/link2"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um redator SEO especialista. Sempre retorne apenas JSON válido conforme solicitado.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API OpenAI: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback se não conseguir parsear
      return generateFallbackContent({ keyword, category, tone, method, sourceInput });
    }
  } catch (error) {
    console.error('Erro ao gerar conteúdo com IA:', error);
    return generateFallbackContent({ keyword, category, tone, method, sourceInput });
  }
}

// Função de fallback para gerar conteúdo local
function generateFallbackContent({ keyword, category, tone, method, sourceInput }) {
  console.log('Gerando conteúdo fallback para:', keyword);
  
  return {
    title: `${keyword}: Guia Completo e Atualizado`,
    slug: keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    metaDescription: `Descubra tudo sobre ${keyword} neste guia completo. Aprenda as melhores práticas e estratégias para ${keyword} de forma eficiente.`,
    altText: `Imagem ilustrativa sobre ${keyword} - Guia completo`,
    excerpt: `Aprenda sobre ${keyword} de forma prática e eficiente. Este guia aborda os principais conceitos e estratégias para dominar ${keyword}.`,
    content: `
      <h1>${keyword}: Guia Completo e Atualizado</h1>
      
      <p>Bem-vindo ao guia mais completo sobre <strong>${keyword}</strong>. Neste artigo, você descobrirá tudo o que precisa saber para dominar este tema de forma prática e eficiente.</p>
      
      <h2>O que é ${keyword}?</h2>
      <p>${keyword} é um conceito fundamental que tem ganhado cada vez mais importância no cenário atual. Compreender seus princípios básicos é essencial para qualquer pessoa que deseja se destacar nesta área.</p>
      
      <h2>Por que ${keyword} é importante?</h2>
      <p>A importância de ${keyword} se manifesta em diversos aspectos:</p>
      <ul>
        <li>Melhora significativa nos resultados</li>
        <li>Otimização de processos e recursos</li>
        <li>Vantagem competitiva no mercado</li>
        <li>Maior eficiência operacional</li>
      </ul>
      
      <h2>Como implementar ${keyword}</h2>
      <p>Para implementar ${keyword} com sucesso, siga estas etapas fundamentais:</p>
      
      <h3>1. Planejamento Estratégico</h3>
      <p>O primeiro passo é desenvolver um planejamento sólido que considere todos os aspectos relevantes de ${keyword}.</p>
      
      <h3>2. Execução Prática</h3>
      <p>Com o planejamento em mãos, é hora de colocar ${keyword} em prática, sempre monitorando os resultados.</p>
      
      <h3>3. Monitoramento e Otimização</h3>
      <p>Acompanhe constantemente os resultados e faça ajustes necessários para maximizar os benefícios de ${keyword}.</p>
      
      <h2>Melhores Práticas para ${keyword}</h2>
      <p>Aqui estão algumas das melhores práticas que você deve seguir:</p>
      <ul>
        <li>Mantenha-se sempre atualizado com as tendências</li>
        <li>Invista em capacitação contínua</li>
        <li>Utilize ferramentas adequadas</li>
        <li>Meça e analise resultados regularmente</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>Dominar ${keyword} é essencial para o sucesso em ${category}. Com as estratégias e práticas apresentadas neste guia, você estará bem preparado para implementar ${keyword} de forma eficaz e obter resultados excepcionais.</p>
      
      <p>Lembre-se: o sucesso com ${keyword} vem da prática consistente e do aprendizado contínuo. Continue estudando e aplicando esses conceitos para alcançar seus objetivos.</p>
    `,
    internalLinks: []
  };
}