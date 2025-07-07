
<?php
/**
 * Plugin Name: Partner SEO - Webhook Integration
 * Plugin URI:      https://preview--ajuda-git-amigo.lovable.app/partner-seo-webhook
 * Description: Plugin para integração com Partner SEO via webhooks
 * Version: 1.0.0
 * Author: Partner SEO
 * Author URI:      https://preview--ajuda-git-amigo.lovable.app/
 * Text Domain: partnerseo-webhook
  * Domain Path:     /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('PARTNERSEO_WEBHOOK_VERSION', '1.0.0');
define('PARTNERSEO_WEBHOOK_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PARTNERSEO_WEBHOOK_PLUGIN_PATH', plugin_dir_path(__FILE__));

// Include required files
require_once PARTNERSEO_WEBHOOK_PLUGIN_PATH . 'includes/class-partnerseo-webhook.php';
require_once PARTNERSEO_WEBHOOK_PLUGIN_PATH . 'includes/class-partnerseo-admin.php';
require_once PARTNERSEO_WEBHOOK_PLUGIN_PATH . 'includes/class-partnerseo-api.php';
require_once PARTNERSEO_WEBHOOK_PLUGIN_PATH . 'includes/functions.php';

// Initialize plugin
add_action('plugins_loaded', 'partnerseo_webhook_init');

function partnerseo_webhook_init() {
    new PartnerSEO_Webhook();
    new PartnerSEO_Admin();
    new PartnerSEO_API();
}

// Activation hook
register_activation_hook(__FILE__, 'partnerseo_webhook_activate');
function partnerseo_webhook_activate() {
    partnerseo_create_logs_table();
    partnerseo_generate_initial_token();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'partnerseo_webhook_deactivate');
function partnerseo_webhook_deactivate() {
    // Clean up if needed
}
