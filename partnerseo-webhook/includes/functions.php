
<?php
/**
 * Helper functions
 */

/**
 * Create logs table on activation
 */
function partnerseo_create_logs_table() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'partnerseo_logs';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        evento varchar(100) NOT NULL,
        payload longtext,
        resposta longtext,
        status varchar(20) NOT NULL,
        data datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY evento (evento),
        KEY status (status),
        KEY data (data)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

/**
 * Generate initial token on activation
 */
function partnerseo_generate_initial_token() {
    if (!get_option('partnerseo_webhook_token')) {
        $token = wp_generate_password(32, false);
        add_option('partnerseo_webhook_token', $token);
    }
}

/**
 * Clean up on uninstall
 */
function partnerseo_cleanup() {
    global $wpdb;
    
    // Remove options
    delete_option('partnerseo_webhook_token');
    delete_option('partnerseo_webhook_url');
    delete_option('partnerseo_default_author');
    delete_option('partnerseo_webhook_active');
    
    // Drop logs table
    $table_name = $wpdb->prefix . 'partnerseo_logs';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    
    // Remove post meta
    delete_post_meta_by_key('partnerseo_id');
    
    // Remove term meta
    delete_metadata('term', 0, 'partnerseo_id', '', true);
}
