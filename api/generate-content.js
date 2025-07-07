// /api/generate-content.js
export default async function handler(req, res) {
  // … (checagem de método e body) …

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID   = process.env.OPENAI_ASSISTANT_ID;
  if (!OPENAI_API_KEY || !ASSISTANT_ID) {
    return res.status(500).json({ error: 'Credenciais OpenAI não configuradas' });
  }

  try {
    const functions = [ /* definição da função generateContent */ ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', { /* … */ });
    if (!resp.ok) throw new Error(await resp.text());

    const data = await resp.json();
    const fin  = data.choices[0].message;
    if (fin.function_call?.arguments) {
      const content = JSON.parse(fin.function_call.arguments);
      return res.status(200).json(content);
    }
    throw new Error('Nenhuma function_call retornada');
  } catch(e) {
    console.error('Erro no handler:', e);
    return res.status(200).json({ error: 'Não foi possível gerar conteúdo, tente fallback.' });
  }
}
