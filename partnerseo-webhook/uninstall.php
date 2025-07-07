
<?php
/**
 * Uninstall script
 */

// If uninstall not called from WordPress, then exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Include functions
require_once plugin_dir_path(__FILE__) . 'includes/functions.php';

// Clean up
partnerseo_cleanup();
