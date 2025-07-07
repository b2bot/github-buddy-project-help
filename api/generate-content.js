// /api/generate-content.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { keyword, category, tone, method, sourceInput } = req.body;
  if (!keyword) {
    return res.status(400).json({ error: 'Palavra-chave é obrigatória' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID   = process.env.OPENAI_ASSISTANT_ID;
  if (!OPENAI_API_KEY || !ASSISTANT_ID) {
    return res.status(500).json({ error: 'Credenciais OpenAI não configuradas' });
  }

  try {
    // 1) Defina a função para o modelo
    const functions = [
      {
        name: 'generateContent',
        description: 'Gera conteúdo completo com base em parâmetros SEO',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string' },
            category: { type: 'string' },
            tone: { type: 'string' },
            method: {
              type: 'string',
              enum: ['manual', 'public_interest', 'youtube', 'url']
            },
            sourceInput: { type: 'string' }
          },
          required: ['keyword','category','tone','method','sourceInput']
        }
      }
    ];

    // 2) Chamada única ao Chat Completions com function spec
    const resp = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // ou o seu modelo configurado
        assistant_id: ASSISTANT_ID,
        messages: [
          { role:'system', content: 'Você é um redator SEO especialista. Sempre retorne JSON.' },
          { 
            role:'user', 
            content: JSON.stringify({ keyword, category, tone, method, sourceInput }) 
          }
        ],
        functions,
        function_call: { name: 'generateContent' },
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('OpenAI error:', err);
      throw new Error(err);
    }

    const data = await resp.json();

    // 3) O resultado da função virá em choices[0].message.function_call.arguments
    const fin = data.choices[0].message;
    if (fin.function_call?.arguments) {
      const content = JSON.parse(fin.function_call.arguments);
      return res.status(200).json(content);
    }

    throw new Error('Nenhuma function_call retornada');
  }
  catch(e) {
    console.error('Erro no handler:', e);
    return res.status(200).json({ 
      error: 'Não foi possível gerar conteúdo, tente fallback.' 
    });
  }
}
