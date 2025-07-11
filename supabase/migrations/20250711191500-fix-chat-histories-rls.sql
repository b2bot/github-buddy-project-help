
-- Corrigir políticas RLS da tabela chat_histories para resolver erro 403

-- Primeiro, remover as políticas existentes que estão muito restritivas
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chat_histories;
DROP POLICY IF EXISTS "Users can create their own chats" ON public.chat_histories;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chat_histories;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chat_histories;

-- Criar políticas mais flexíveis que permitam acesso adequado
CREATE POLICY "Allow authenticated users to view their own chats" 
  ON public.chat_histories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to create chats" 
  ON public.chat_histories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own chats" 
  ON public.chat_histories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own chats" 
  ON public.chat_histories 
  FOR DELETE 
  USING (auth.uid() = user_id);
