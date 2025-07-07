
<?php
/**
 * Admin interface class
 */
class PartnerSEO_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
        add_filter('plugin_action_links_' . plugin_basename(PARTNERSEO_WEBHOOK_PLUGIN_PATH . 'partnerseo-webhook.php'), array($this, 'add_action_links'));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'Partner SEO - Webhook Integration',
            'Partner SEO Webhook',
            'manage_options',
            'partnerseo-webhook',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Initialize admin settings
     */
    public function admin_init() {
        register_setting('partnerseo_webhook_settings', 'partnerseo_webhook_token');
        register_setting('partnerseo_webhook_settings', 'partnerseo_webhook_url');
        register_setting('partnerseo_webhook_settings', 'partnerseo_default_author');
        register_setting('partnerseo_webhook_settings', 'partnerseo_webhook_active');
    }
    
    /**
     * Add action links to plugin page
     */
    public function add_action_links($links) {
        $settings_link = '<a href="' . admin_url('options-general.php?page=partnerseo-webhook') . '">Configurações</a>';
        array_unshift($links, $settings_link);
        return $links;
    }
    
    /**
     * Admin page content
     */
    public function admin_page() {
        if (isset($_POST['generate_token'])) {
            $new_token = wp_generate_password(32, false);
            update_option('partnerseo_webhook_token', $new_token);
            $token_generated = true;
        }
        
        if (isset($_POST['submit'])) {
            update_option('partnerseo_webhook_url', sanitize_text_field($_POST['partnerseo_webhook_url']));
            update_option('partnerseo_default_author', intval($_POST['partnerseo_default_author']));
            update_option('partnerseo_webhook_active', isset($_POST['partnerseo_webhook_active']) ? 1 : 0);
            $settings_saved = true;
        }
        
        $webhook_url = get_option('partnerseo_webhook_url', '');
        $webhook_token = get_option('partnerseo_webhook_token', '');
        $default_author = get_option('partnerseo_default_author', 1);
        $webhook_active = get_option('partnerseo_webhook_active', 0);
        $endpoint_url = rest_url('partnerseo/v1/webhook');
        ?>
        
        <div class="wrap">
            <h1>Partner SEO - Webhook Integration</h1>
            <p>Configure a integração do WordPress com o Partner SEO através de webhooks.</p>
            
            <?php if (isset($token_generated)): ?>
                <div class="notice notice-success"><p>Novo token gerado com sucesso!</p></div>
            <?php endif; ?>
            
            <?php if (isset($settings_saved)): ?>
                <div class="notice notice-success"><p>Configurações salvas com sucesso!</p></div>
            <?php endif; ?>
            
            <form method="post" action="">
                <table class="form-table">
                    <tr>
                        <th scope="row">URL do Webhook</th>
                        <td>
                            <input type="text" name="partnerseo_webhook_url" value="<?php echo esc_attr($webhook_url); ?>" class="regular-text" placeholder="https://seu-partnerseo.com" />
                            <p class="description">URL do seu Partner SEO onde os webhooks serão enviados</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">Token de Autenticação</th>
                        <td>
                            <input type="text" value="<?php echo esc_attr($webhook_token); ?>" class="regular-text" readonly />
                            <button type="submit" name="generate_token" class="button">Gerar Novo Token</button>
                            <button type="button" onclick="copyToken()" class="button">Copiar Token</button>
                            <p class="description">Token usado para autenticar requisições do Partner SEO</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">Autor Padrão</th>
                        <td>
                            <select name="partnerseo_default_author">
                                <option value="">Selecione um autor</option>
                                <?php
                                $authors = get_users(array('who' => 'authors'));
                                foreach ($authors as $author) {
                                    $selected = ($default_author == $author->ID) ? 'selected' : '';
                                    echo '<option value="' . $author->ID . '" ' . $selected . '>' . esc_html($author->display_name) . '</option>';
                                }
                                ?>
                            </select>
                            <p class="description">Autor que será atribuído aos posts criados via webhook</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">Webhook Ativo</th>
                        <td>
                            <label>
                                <input type="checkbox" name="partnerseo_webhook_active" value="1" <?php checked($webhook_active, 1); ?> />
                                Ativar integração via webhook
                            </label>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">Endpoint REST API</th>
                        <td>
                            <code><?php echo esc_html($endpoint_url); ?></code>
                            <button type="button" onclick="copyEndpoint()" class="button">Copiar URL</button>
                            <p class="description">URL do endpoint que o Partner SEO deve usar para enviar webhooks</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Salvar Configurações'); ?>
            </form>
            
            <h2>Logs de Webhook</h2>
            <?php $this->display_logs(); ?>
        </div>
        
        <script>
        function copyToken() {
            const tokenField = document.querySelector('input[readonly]');
            tokenField.select();
            document.execCommand('copy');
            alert('Token copiado para a área de transferência!');
        }
        
        function copyEndpoint() {
            const endpoint = '<?php echo esc_js($endpoint_url); ?>';
            navigator.clipboard.writeText(endpoint).then(() => {
                alert('URL do endpoint copiada para a área de transferência!');
            });
        }
        </script>
        
        <style>
        .form-table th {
            width: 200px;
        }
        .form-table code {
            background: #f0f0f1;
            padding: 5px 8px;
            border-radius: 3px;
        }
        </style>
        
        <?php
    }
    
    /**
     * Display webhook logs
     */
    private function display_logs() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'partnerseo_logs';
        $logs = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY data DESC LIMIT 20");
        
        if (empty($logs)) {
            echo '<p>Nenhum log de webhook encontrado.</p>';
            return;
        }
        ?>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Evento</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($logs as $log): ?>
                <tr>
                    <td><?php echo esc_html(mysql2date('d/m/Y H:i:s', $log->data)); ?></td>
                    <td><?php echo esc_html($log->evento); ?></td>
                    <td>
                        <span class="status-<?php echo esc_attr($log->status); ?>">
                            <?php echo $log->status === 'success' ? '✓ Sucesso' : '✗ Erro'; ?>
                        </span>
                    </td>
                    <td>
                        <button type="button" onclick="toggleLogDetails(<?php echo $log->id; ?>)" class="button-link">
                            Ver Detalhes
                        </button>
                        <div id="log-details-<?php echo $log->id; ?>" style="display:none; margin-top:10px;">
                            <strong>Payload:</strong>
                            <pre><?php echo esc_html($log->payload); ?></pre>
                            <strong>Resposta:</strong>
                            <pre><?php echo esc_html($log->resposta); ?></pre>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <script>
        function toggleLogDetails(logId) {
            const details = document.getElementById('log-details-' + logId);
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
        </script>
        
        <style>
        .status-success { color: #46b450; }
        .status-error { color: #dc3232; }
        pre { background: #f0f0f1; padding: 10px; border-radius: 3px; overflow-x: auto; }
        </style>
        
        <?php
    }
}
