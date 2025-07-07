<?php
/**
 * Main webhook handler class
 */
class PartnerSEO_Webhook {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('wp', array($this, 'check_scheduled_posts'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Main webhook endpoint for receiving posts
        register_rest_route('partnerseo/v1', '/webhook', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_webhook'),
            'permission_callback' => '__return_true',
        ));
        
        // Check integration endpoint
        register_rest_route('partnerseo/v1', '/check', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'check_integration'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('partnerseo/v1', '/logs', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_logs'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
    }
    
    /**
     * Handle incoming webhook for publishing posts
     */
    public function handle_webhook($request) {
        $json_data = json_decode($request->get_body(), true);
        
        // Validate JSON
        if (!$json_data) {
            $this->log_webhook('WEBHOOK_ERROR', $request->get_body(), 'Dados JSON inválidos', 'error');
            return new WP_Error('invalid_json', 'Dados JSON inválidos', array('status' => 400));
        }
        
        // Validate token
        $token = $request->get_header('Authorization');
        if (!$this->validate_bearer_token($token)) {
            $this->log_webhook('WEBHOOK_ERROR', $json_data, 'Token inválido', 'error');
            return new WP_Error('invalid_token', 'Token inválido', array('status' => 403));
        }
        
        // Process post creation
        $response = $this->create_post_from_webhook($json_data);
        
        return $response;
    }
    
    /**
     * Check integration
     */
    public function check_integration($request) {
        $token = $request->get_header('Authorization');
        if (!$this->validate_bearer_token($token)) {
            return new WP_Error('invalid_token', 'Token inválido', array('status' => 403));
        }
        
        $response = array(
            'status' => 'success',
            'message' => 'Integração ativa e funcionando',
            'version' => PARTNERSEO_WEBHOOK_VERSION,
            'endpoint' => rest_url('partnerseo/v1/webhook')
        );
        
        $this->log_webhook('CHECK_INTEGRATION', array(), $response, 'success');
        return rest_ensure_response($response);
    }
    
    /**
     * Create post from webhook data
     */
    private function create_post_from_webhook($data) {
        try {
            $post_data = array(
                'post_title'    => sanitize_text_field($data['title'] ?? ''),
                'post_content'  => wp_kses_post($data['content'] ?? ''),
                'post_excerpt'  => sanitize_text_field($data['excerpt'] ?? ''),
                'post_name'     => sanitize_title($data['slug'] ?? ''),
                'post_status'   => $this->determine_post_status($data),
                'post_author'   => get_option('partnerseo_default_author', 1),
                'post_type'     => 'post',
                'meta_input'    => array(
                    'partnerseo_id' => sanitize_text_field($data['id'] ?? ''),
                    '_yoast_wpseo_metadesc' => sanitize_text_field($data['metaDescription'] ?? ''),
                    'partnerseo_keyword' => sanitize_text_field($data['keyword'] ?? ''),
                )
            );
            
            // Handle scheduled posts
            if (isset($data['scheduledAt'])) {
                $scheduled_date = date('Y-m-d H:i:s', strtotime($data['scheduledAt']));
                $post_data['post_date'] = $scheduled_date;
                $post_data['post_date_gmt'] = gmdate('Y-m-d H:i:s', strtotime($scheduled_date));
                $post_data['post_status'] = 'future';
            }
            
            $post_id = wp_insert_post($post_data);
            
            if (is_wp_error($post_id)) {
                $this->log_webhook('POST_CREATE_ERROR', $data, $post_id->get_error_message(), 'error');
                return new WP_Error('post_creation_failed', 'Erro ao criar post', array('status' => 500));
            }
            
            // Handle featured image if provided
            if (!empty($data['featuredImageUrl'])) {
                $this->handle_featured_image($post_id, $data['featuredImageUrl'], $data['altText'] ?? '');
            }
            
            $response = array(
                'status' => 'success',
                'message' => isset($data['scheduledAt']) ? 'Post agendado com sucesso' : 'Post publicado com sucesso',
                'post_id' => $post_id,
                'post_url' => get_permalink($post_id),
                'post_status' => get_post_status($post_id)
            );
            
            $this->log_webhook('POST_CREATED', $data, $response, 'success');
            
            return rest_ensure_response($response);
            
        } catch (Exception $e) {
            $this->log_webhook('POST_CREATE_ERROR', $data, $e->getMessage(), 'error');
            return new WP_Error('publish_error', $e->getMessage(), array('status' => 500));
        }
    }
    
    /**
     * Determine post status based on data
     */
    private function determine_post_status($data) {
        if (isset($data['scheduledAt'])) {
            return 'future';
        }
        
        if (isset($data['status'])) {
            switch ($data['status']) {
                case 'draft':
                    return 'draft';
                case 'pending':
                    return 'pending';
                case 'scheduled':
                case 'future':
                    return 'future';
                case 'published':
                case 'publish':
                default:
                    return 'publish';
            }
        }
        
        return 'publish';
    }
    
    /**
     * Handle featured image upload
     */
    private function handle_featured_image($post_id, $image_url, $alt_text = '') {
        if (empty($image_url)) return;
        
        try {
            $response = wp_remote_get($image_url, array('timeout' => 15));
            
            if (is_wp_error($response)) {
                return;
            }
            
            $image_data = wp_remote_retrieve_body($response);
            if (empty($image_data)) return;
            
            $upload_dir = wp_upload_dir();
            $filename = basename($image_url);
            
            // Ensure filename has extension
            $wp_filetype = wp_check_filetype($filename);
            if (empty($wp_filetype['ext'])) {
                $filename .= '.jpg';
                $wp_filetype = wp_check_filetype($filename);
            }
            
            $file_path = $upload_dir['path'] . '/' . wp_unique_filename($upload_dir['path'], $filename);
            
            file_put_contents($file_path, $image_data);
            
            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_title'     => sanitize_file_name($filename),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );
            
            $attachment_id = wp_insert_attachment($attachment, $file_path, $post_id);
            
            if (!is_wp_error($attachment_id)) {
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $attachment_data = wp_generate_attachment_metadata($attachment_id, $file_path);
                wp_update_attachment_metadata($attachment_id, $attachment_data);
                
                set_post_thumbnail($post_id, $attachment_id);
                
                if (!empty($alt_text)) {
                    update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);
                }
            }
            
        } catch (Exception $e) {
            error_log('Partner SEO: Error handling featured image - ' . $e->getMessage());
        }
    }
    
    /**
     * Check for scheduled posts that need to be processed
     */
    public function check_scheduled_posts() {
        $scheduled_posts = get_posts(array(
            'post_status' => 'future',
            'meta_key' => 'partnerseo_id',
            'numberposts' => -1,
            'date_query' => array(
                'before' => current_time('mysql')
            )
        ));
        
        foreach ($scheduled_posts as $post) {
            wp_publish_post($post->ID);
        }
    }
    
    /**
     * Validate Bearer token
     */
    private function validate_bearer_token($auth_header) {
        if (empty($auth_header)) return false;
        
        if (strpos($auth_header, 'Bearer ') === 0) {
            $token = substr($auth_header, 7);
        } else {
            $token = $auth_header;
        }
        
        $stored_token = get_option('partnerseo_webhook_token');
        return !empty($token) && hash_equals($stored_token, $token);
    }
    
    /**
     * Log webhook activity
     */
    private function log_webhook($event, $payload, $response, $status) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'partnerseo_logs';
        
        $wpdb->insert(
            $table_name,
            array(
                'evento' => $event,
                'payload' => is_array($payload) ? json_encode($payload) : $payload,
                'resposta' => is_array($response) ? json_encode($response) : $response,
                'status' => $status,
                'data' => current_time('mysql')
            ),
            array('%s', '%s', '%s', '%s', '%s')
        );
    }
    
    /**
     * Get logs
     */
    public function get_logs($request) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'partnerseo_logs';
        $page = $request->get_param('page') ?: 1;
        $limit = $request->get_param('limit') ?: 20;
        $offset = ($page - 1) * $limit;
        
        $logs = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table_name} ORDER BY data DESC LIMIT %d OFFSET %d",
            $limit,
            $offset
        ));
        
        $total = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
        
        return rest_ensure_response(array(
            'logs' => $logs,
            'total' => intval($total),
            'page' => intval($page),
            'pages' => ceil($total / $limit)
        ));
    }
    
    /**
     * Check permissions
     */
    public function check_permissions() {
        return current_user_can('manage_options');
    }
}
