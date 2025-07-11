
// API para chat com Assistant Clarêncio
// Implementa backend proxy para operações em chat_histories

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://onnvpakhibftxpqeraur.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente Supabase com service role para operações de backend
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  // --- CORS UNIVERSAL ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  console.log('[Clarencio][API] Request:', req.method);

  try {
    // --- AUTENTICAÇÃO ---
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.error('[Clarencio][API] Token não fornecido');
      return res.status(401).json({ error: "Token de autenticação necessário" });
    }

    // Verificar usuário usando token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.log('[Clarencio][API] Erro na verificação do usuário:', userError?.message);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    console.log('[Clarencio][API] Usuário autenticado:', user.id);

    // GET - Listar histórico de chats
    if (req.method === "GET") {
      console.log('[Clarencio][API] Carregando histórico para usuário:', user.id);
      
      const { data: chats, error } = await supabaseAdmin
        .from('chat_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('[Clarencio][API] Erro ao buscar chats:', error);
        return res.status(500).json({ error: "Erro ao carregar histórico" });
      }

      console.log('[Clarencio][API] Histórico carregado:', chats?.length || 0, 'chats');
      return res.status(200).json(chats || []);
    }

    // POST - Criar ou atualizar chat
    if (req.method === "POST") {
      const { action, title, messages, chatId } = req.body;

      if (action === 'create') {
        console.log('[Clarencio][API] Criando novo chat para usuário:', user.id);
        
        const { data: newChat, error } = await supabaseAdmin
          .from('chat_histories')
          .insert([
            {
              user_id: user.id,
              title: title,
              messages: messages
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('[Clarencio][API] Erro ao criar chat:', error);
          return res.status(500).json({ error: "Erro ao criar chat" });
        }

        console.log('[Clarencio][API] Chat criado com sucesso:', newChat.id);
        return res.status(200).json(newChat);
      }

      if (action === 'update') {
        console.log('[Clarencio][API] Atualizando chat:', chatId, 'para usuário:', user.id);
        
        const { error } = await supabaseAdmin
          .from('chat_histories')
          .update({ 
            messages: messages,
            updated_at: new Date().toISOString()
          })
          .eq('id', chatId)
          .eq('user_id', user.id);

        if (error) {
          console.error('[Clarencio][API] Erro ao atualizar chat:', error);
          return res.status(500).json({ error: "Erro ao atualizar chat" });
        }

        console.log('[Clarencio][API] Chat atualizado com sucesso');
        return res.status(200).json({ success: true });
      }

      // Se não for create nem update, pode ser uma chamada para gerar resposta do Clarêncio
      const { messages = [] } = req.body;
      console.log('[Clarencio][API] Gerando resposta do Clarêncio, mensagens:', messages.length);

      // Verificar variáveis de ambiente
      const apiKey = process.env.OPENAI_API_KEY;
      console.log('[Clarencio][API] API Key disponível:', !!apiKey);

      if (apiKey) {
        try {
          // Usar OpenAI real
          const result = await generateClarencioResponse(apiKey, messages);

          if (result.success) {
            console.log('[Clarencio][API] Resposta gerada com sucesso via OpenAI');
            return res.status(200).json(result);
          }
        } catch (openaiError) {
          console.log('[Clarencio][API] Erro na OpenAI, usando fallback:', openaiError.message);
        }
      }

      // Fallback inteligente
      console.log('[Clarencio][API] Usando fallback inteligente');
      const fallbackResult = generateClarencioFallback(messages);
      
      return res.status(200).json(fallbackResult);
    }

    // DELETE - Deletar chat
    if (req.method === "DELETE") {
      const { chatId } = req.body;
      console.log('[Clarencio][API] Deletando chat:', chatId, 'para usuário:', user.id);
      
      const { error } = await supabaseAdmin
        .from('chat_histories')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) {
        console.error('[Clarencio][API] Erro ao deletar chat:', error);
        return res.status(500).json({ error: "Erro ao deletar chat" });
      }

      console.log('[Clarencio][API] Chat deletado com sucesso');
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Método não permitido" });

  } catch (error) {
    console.error('[Clarencio][API] Erro geral:', error);
    
    // Fallback de emergência
    const emergencyResult = {
      success: true,
      message: "🚀 Oiii! Sou o Clarêncio! \n\nParece que tivemos um pequeno problema técnico, mas vamos que vamos! \n\nQual é a **palavra-chave principal** que você quer trabalhar hoje? ✨",
      shouldGenerateContent: false
    };
    
    return res.status(200).json(emergencyResult);
  }
}

async function generateClarencioResponse(apiKey, messages) {
  console.log('[Clarencio][API] Chamando OpenAI para Clarêncio');

  // System prompt completo do Clarêncio
  const systemPrompt = `Você é o Clarêncio, o assistente especialista em SEO e conteúdo da plataforma Partner SEO! 🚀

## PERSONALIDADE E TOM:
- Você é SUPER otimista, empolgado e motivador
- Usa emojis estrategicamente para tornar a conversa mais dinâmica
- Tem bordões marcantes como "Vamos que vamos!", "Isso vai ser INCRÍVEL!", "Agora sim, estamos falando a mesma língua!"
- É direto, prático e focado em resultados
- Sempre demonstra confiança no sucesso do usuário

## BORDÕES CARACTERÍSTICOS (use naturalmente):
- "🎯 Perfeita escolha!"
- "🚀 Vamos que vamos!"
- "✨ Isso vai ser INCRÍVEL!"
- "💡 Agora sim, estamos falando a mesma língua!"
- "🔥 Esse conteúdo vai bombar!"
- "⚡ Preparado para decolar?"
- "🎉 Sucesso garantido!"

## FRAMEWORK DE COLETA (siga esta ordem):
1. **Palavra-chave principal** - "Qual é a palavra-chave que vai dominar o Google?"
2. **Objetivo do conteúdo** - "Qual é o objetivo? Gerar leads, educar, vender?"
3. **Persona/público-alvo** - "Para quem você está falando?"
4. **Big Idea** - "Qual é a ideia central que vai impactar?"
5. **Emoção desejada** - "Que emoção quer despertar?"
6. **Estrutura preferida** - "Como quer estruturar o conteúdo?"
7. **Call-to-action (CTA)** - "Qual ação o leitor deve tomar?"

## ⚠️ REGRAS INQUEBRÁVEIS:
1. **SEMPRE** comece com uma saudação empolgada usando seus bordões
2. **UMA pergunta por vez** - não faça várias perguntas na mesma mensagem
3. **Sempre confirme** a resposta do usuário antes de passar para a próxima etapa
4. **Use emojis** para destacar informações importantes
5. **Seja específico** nas perguntas - evite perguntas genéricas
6. **Mantenha o tom otimista** mesmo quando der dicas ou corrigir algo
7. **Só indique geração de conteúdo** quando tiver TODAS as 7 informações do framework
8. **Sempre peça confirmação** antes de finalizar

## FLUXO DE TRABALHO:
1. Saudação empolgada e primeira pergunta (palavra-chave)
2. Colete cada informação do framework (uma por vez)
3. Confirme que tem todas as informações
4. Informe que pode gerar o conteúdo
5. Peça confirmação para finalizar

## IMPORTANTE:
- Quando tiver todas as 7 informações, responda indicando que pode gerar o conteúdo
- Use frases como "Agora temos tudo para criar um conteúdo INCRÍVEL!" 
- Sempre mantenha o tom otimista e empolgado
- Nunca seja técnico demais, seja acessível e motivador

Mantenha sempre seu tom otimista e empolgado! 🌟`;

  const messagesForAPI = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messagesForAPI,
      temperature: 0.8,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const responseMessage = data.choices[0].message.content;

  // Verificar se deve gerar conteúdo
  const shouldGenerateContent = checkShouldGenerateContent(responseMessage, messages);

  return {
    success: true,
    message: responseMessage,
    shouldGenerateContent: shouldGenerateContent
  };
}

function checkShouldGenerateContent(responseMessage, messages) {
  // Verificar se o Clarêncio indicou que pode gerar conteúdo
  const generateIndicators = [
    'gerar o conteúdo',
    'criar um conteúdo',
    'todas as informações',
    'temos tudo',
    'pode gerar',
    'vamos gerar',
    'hora de criar'
  ];

  const hasGenerateIndicator = generateIndicators.some(indicator => 
    responseMessage.toLowerCase().includes(indicator)
  );

  // Verificar se temos mensagens suficientes (aproximadamente 7 respostas do usuário)
  const userMessages = messages.filter(m => m.role === 'user');
  const hasEnoughMessages = userMessages.length >= 5; // Flexibilidade

  return hasGenerateIndicator && hasEnoughMessages;
}

function generateClarencioFallback(messages) {
  console.log('[Clarencio][API] Gerando resposta fallback');
  
  const userMessages = messages.filter(m => m.role === 'user');
  const messageCount = userMessages.length;
  
  // Respostas baseadas no número de mensagens
  if (messageCount === 0) {
    return {
      success: true,
      message: "Olá! Sou o Clarêncio, seu assistente especialista em SEO e conteúdo! 🚀\n\nVamos criar um conteúdo incrível juntos? Para começar, qual é a **palavra-chave principal** que você quer trabalhar?\n\n✨ Isso vai ser INCRÍVEL!",
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 1) {
    const keyword = userMessages[0].content;
    return {
      success: true,
      message: `🎯 Perfeita escolha com "${keyword}"!\n\nAgora me conta: **qual é o objetivo** deste conteúdo? Você quer gerar leads, educar sobre o tema, aumentar vendas ou algo específico?\n\n💡 Vamos que vamos!`,
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 2) {
    return {
      success: true,
      message: "🚀 Excelente! Agora vamos definir a **persona**.\n\nPara quem você está escrevendo? Me conte sobre seu público-alvo ideal (idade, interesses, problemas que enfrentam, etc.)\n\n⚡ Preparado para decolar?",
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 3) {
    return {
      success: true,
      message: "💡 Agora sim, estamos falando a mesma língua!\n\nVamos para a **big idea** - qual é a ideia central, o conceito principal que você quer transmitir neste conteúdo?\n\n✨ Isso vai ser INCRÍVEL!",
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 4) {
    return {
      success: true,
      message: "🔥 Esse conteúdo vai bombar!\n\nAgora me conta: que **emoção** você quer despertar no seu leitor? Curiosidade, urgência, confiança, inspiração?\n\n🚀 Vamos que vamos!",
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 5) {
    return {
      success: true,
      message: "⚡ Preparado para decolar?\n\nQue **estrutura** você prefere para o conteúdo? Lista, passo a passo, comparação, storytelling?\n\n🎯 Estamos quase lá!",
      shouldGenerateContent: false
    };
  }
  
  if (messageCount === 6) {
    return {
      success: true,
      message: "🎉 Última pergunta!\n\nQual **call-to-action (CTA)** você quer incluir no final? O que o leitor deve fazer depois de ler o conteúdo?\n\n✨ Sucesso garantido!",
      shouldGenerateContent: false
    };
  }
  
  // Após 7+ mensagens, indicar que pode gerar conteúdo
  if (messageCount >= 7) {
    return {
      success: true,
      message: "🚀 **INCRÍVEL!** Agora temos todas as informações necessárias!\n\n🔥 Esse conteúdo vai bombar! Tenho tudo que preciso para criar um conteúdo otimizado e estratégico seguindo o Framework da Leadclinic.\n\n✨ Posso gerar o conteúdo agora! Vamos que vamos!\n\n💡 Clique em **'Gerar Conteúdo'** quando estiver pronto!",
      shouldGenerateContent: true
    };
  }
  
  // Fallback genérico
  return {
    success: true,
    message: "🚀 Continuando nossa conversa incrível!\n\nPara criar o melhor conteúdo possível, preciso de mais algumas informações. Qual é a próxima informação que você gostaria de compartilhar?\n\n⚡ Preparado para decolar?",
    shouldGenerateContent: false
  };
}
