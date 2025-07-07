
# Partner SEO - Webhook Integration Plugin

Plugin WordPress para integração com o Partner SEO via webhooks, permitindo publicação automática e agendamento de posts.

## Instalação

1. **Fazer o download do plugin**
   - Baixe todos os arquivos desta pasta `partnerseo-webhook/`
   - Compacte em um arquivo ZIP

2. **Instalar no WordPress**
   - Acesse o painel admin do WordPress
   - Vá em Plugins → Adicionar Novo
   - Clique em "Enviar Plugin"
   - Escolha o arquivo ZIP e clique "Instalar Agora"
   - Ative o plugin

3. **Configuração Inicial**
   - Vá em Configurações → Partner SEO Webhook
   - Defina um token de autenticação seguro
   - Escolha o autor padrão para os posts
   - Copie a URL do webhook exibida

## Configuração no Partner SEO

1. **Na aba Integrações → WordPress:**
   - Cole a URL do seu WordPress (ex: `https://seusite.com`)
   - Cole o token gerado no plugin
   - Clique em "Verificar Integração"
   - Ative a integração

## Endpoints Disponíveis

### POST `/wp-json/partnerseo/v1/publish`
Publica ou agenda um post no WordPress.

**Headers:**
```
Authorization: Bearer {seu-token}
Content-Type: application/json
```

**Body:**
```json
{
  "id": "unique-id",
  "title": "Título do Post",
  "content": "<p>Conteúdo HTML</p>",
  "slug": "slug-do-post",
  "excerpt": "Descrição curta",
  "metaDescription": "Meta descrição SEO",
  "keyword": "palavra-chave",
  "altText": "Texto alternativo da imagem",
  "featuredImageUrl": "https://example.com/image.jpg",
  "scheduledAt": "2024-07-04T15:30:00" // Opcional para agendamento
}
```

### GET `/wp-json/partnerseo/v1/logs`
Retorna logs de webhooks (requer autenticação admin).

### POST `/wp-json/partnerseo/v1/check`
Verifica se a integração está funcionando.

## Funcionalidades

- ✅ Publicação imediata de posts
- ✅ Agendamento de posts
- ✅ Upload automático de imagens de destaque
- ✅ Configuração de meta dados SEO
- ✅ Sistema de logs completo
- ✅ Validação de token de segurança
- ✅ Interface administrativa

## Logs e Monitoramento

O plugin registra todas as atividades em uma tabela customizada `wp_partnerseo_logs`:
- Payloads recebidos
- Respostas enviadas
- Status de sucesso/erro
- Timestamps

Acesse os logs em Configurações → Partner SEO Webhook.

## Segurança

- Token de autenticação obrigatório
- Validação de dados de entrada
- Sanitização de conteúdo
- Logs de auditoria

## Suporte

Para suporte técnico, verifique:
1. Se o plugin está ativado
2. Se o token está correto
3. Se a URL está acessível
4. Os logs de erro no WordPress

## Desenvolvimento

Este plugin usa a arquitetura padrão do WordPress:
- Classes organizadas em `includes/`
- Hooks e filtros apropriados
- Tabelas customizadas para logs
- REST API endpoints seguros
