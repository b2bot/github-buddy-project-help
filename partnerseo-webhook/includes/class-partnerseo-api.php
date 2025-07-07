<?php
/**
 * Additional API endpoints class
 */
class PartnerSEO_API {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register additional REST API routes
     */
    public function register_routes() {
        // Token management
        register_rest_route('partnerseo/v1', '/token', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_token'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('partnerseo/v1', '/token', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'generate_token'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        // Integration check
        register_rest_route('partnerseo/v1', '/check', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'check_integration'),
            'permission_callback' => '__return_true',
        ));
        
        // Settings
        register_rest_route('partnerseo/v1', '/settings', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_settings'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('partnerseo/v1', '/settings', array(
            'methods'             => 'PATCH',
            'callback'            => array($this, 'update_settings'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        // Resend posts
        register_rest_route('partnerseo/v1', '/resend-all', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'resend_all_posts'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
    }
    
    /**
     * Send webhook to external service
     */
    public function send_webhook($post_data, $is_scheduled = false) {
        $webhook_url = get_option('partnerseo_webhook_url');
        $token = get_option('partnerseo_webhook_token');
        
        if (empty($webhook_url)) {
            return array('success' => false, 'message' => 'URL do webhook não configurada');
        }
        
        $payload = array(
            'event' => $is_scheduled ? 'POST_SCHEDULED' : 'POST_PUBLISHED',
            'post' => $post_data
        );
        
        $response = wp_remote_post($webhook_url, array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $token
            ),
            'body' => json_encode($payload),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            return array('success' => false, 'message' => $response->get_error_message());
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        return array(
            'success' => $status_code >= 200 && $status_code < 300,
            'status_code' => $status_code,
            'body' => $body
        );
    }
    
    /**
     * Get current token
     */
    public function get_token($request) {
        $token = get_option('partnerseo_webhook_token');
        return rest_ensure_response(array('token' => $token));
    }
    
    /**
     * Generate new token
     */
    public function generate_token($request) {
        $new_token = wp_generate_password(32, false);
        update_option('partnerseo_webhook_token', $new_token);
        
        return rest_ensure_response(array(
            'success' => true,
            'token' => $new_token,
            'message' => 'Novo token gerado com sucesso'
        ));
    }
    
    /**
     * Check integration
     */
    public function check_integration($request) {
        $token = $request->get_header('Authorization');
        if (strpos($token, 'Bearer ') === 0) {
            $token = substr($token, 7);
        }
        
        $stored_token = get_option('partnerseo_webhook_token');
        
        if (!$token || !hash_equals($stored_token, $token)) {
            return new WP_Error('invalid_token', 'Token inválido', array('status' => 403));
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Integração ativa e funcionando',
            'version' => PARTNERSEO_WEBHOOK_VERSION,
            'publish_endpoint' => rest_url('partnerseo/v1/publish')
        ));
    }
    
    /**
     * Get settings
     */
    public function get_settings($request) {
        return rest_ensure_response(array(
            'webhook_url' => get_option('partnerseo_webhook_url', ''),
            'webhook_active' => (bool) get_option('partnerseo_webhook_active', 0),
            'default_author' => intval(get_option('partnerseo_default_author', 1)),
            'publish_endpoint' => rest_url('partnerseo/v1/publish')
        ));
    }
    
    /**
     * Update settings
     */
    public function update_settings($request) {
        $data = $request->get_json_params();
        
        if (isset($data['webhook_url'])) {
            update_option('partnerseo_webhook_url', sanitize_text_field($data['webhook_url']));
        }
        
        if (isset($data['webhook_active'])) {
            update_option('partnerseo_webhook_active', (bool) $data['webhook_active'] ? 1 : 0);
        }
        
        if (isset($data['default_author'])) {
            update_option('partnerseo_default_author', intval($data['default_author']));
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Configurações atualizadas com sucesso'
        ));
    }
    
    /**
     * Resend all posts
     */
    public function resend_all_posts($request) {
        $posts = get_posts(array(
            'post_type' => 'post',
            'post_status' => array('publish', 'draft', 'future', 'pending'),
            'numberposts' => -1,
            'meta_key' => 'partnerseo_id'
        ));
        
        $count = 0;
        foreach ($posts as $post) {
            $post_data = array(
                'id' => get_post_meta($post->ID, 'partnerseo_id', true),
                'title' => $post->post_title,
                'content' => $post->post_content,
                'slug' => $post->post_name,
                'status' => $post->post_status,
                'excerpt' => $post->post_excerpt,
                'publishedAt' => strtotime($post->post_date)
            );
            
            $this->send_webhook($post_data);
            $count++;
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => "Reenviados {$count} posts para o webhook",
            'count' => $count
        ));
    }
    
    /**
     * Check permissions
     */
    public function check_permissions() {
        return current_user_can('manage_options');
    }
}
