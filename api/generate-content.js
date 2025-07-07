// Endpoint Vercel para integração com OpenAI Assistant
// Este arquivo deve ser deployado na Vercel junto com as variáveis de ambiente

export default async function handler(req, res) {
  // CORS liberado geral
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tratamento pré-flight
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // ignora aqui, só devolve OK
  }

  // Validação do método principal
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

    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      return res.status(500).json({ error: 'Configuração da OpenAI não encontrada' });
    }

    console.log('Iniciando geração de conteúdo:', { keyword, category, tone, method });

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
      throw new Error(`Erro ao criar thread: ${threadResponse.statusText}`);
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
      throw new Error(`Erro ao adicionar mensagem: ${messageResponse.statusText}`);
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
      throw new Error(`Erro ao executar assistant: ${runResponse.statusText}`);
    }

    const run = await runResponse.json();
    console.log('Run iniciada:', run.id);

    // 4. Aguardar conclusão e processar function calls
    let runStatus = run;
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo

    while (runStatus.status === 'queued' || runStatus.status === 'in_progress' || runStatus.status === 'requires_action') {
      if (attempts >= maxAttempts) {
        throw new Error('Timeout: Assistant demorou muito para responder');
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
          throw new Error(`Erro ao submeter tool outputs: ${submitResponse.statusText}`);
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

      const messages = await messagesResponse.json();
      const lastMessage = messages.data[0];

      if (lastMessage && lastMessage.content[0] && lastMessage.content[0].text) {
        const responseText = lastMessage.content[0].text.value;
        
        try {
          // Tentar parsear como JSON
          const contentData = JSON.parse(responseText);
          console.log('Conteúdo gerado com sucesso');
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

    throw new Error(`Run falhou com status: ${runStatus.status}`);

  } catch (error) {
    console.error('Erro na geração de conteúdo:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
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

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback se não conseguir parsear
      return {
        title: `${keyword}: Guia Completo`,
        slug: keyword.toLowerCase().replace(/\s+/g, '-'),
        metaDescription: `Descubra tudo sobre ${keyword} neste guia completo.`,
        altText: `Imagem sobre ${keyword}`,
        excerpt: `Aprenda sobre ${keyword} de forma prática.`,
        content: `<h1>${keyword}: Guia Completo</h1><p>${content}</p>`,
        internalLinks: []
      };
    }
  } catch (error) {
    console.error('Erro ao gerar conteúdo com IA:', error);
    throw error;
  }
}

