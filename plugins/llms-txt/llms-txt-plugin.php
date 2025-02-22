<?php
/**
 * Plugin Name: LLMS TXT - Automattic AI Experiments
 * Plugin URI:  https://example.com
 * Description: Provides /llms.txt, /llms-full.txt, and /llms-small.txt endpoints, plus a WP admin settings page, to expose site content for LLM usage.
 * Version:     0.0.1
 * Author:      James LePage
 * Author URI:  https://automattic.com/ai
 * License:     GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Load our classes
require_once __DIR__ . '/includes/class-llms-txt-plugin.php';
require_once __DIR__ . '/includes/class-llms-txt-admin.php';
require_once __DIR__ . '/includes/class-llms-txt-content.php';

/**
 * Init the plugin once all other plugins are loaded.
 */
function llms_txt_plugin_init() {
    // Instantiate the main plugin class
    $plugin = new LLMS_Txt_Plugin();
    // Also instantiate admin settings code
    new LLMS_Txt_Admin();
}
add_action( 'plugins_loaded', 'llms_txt_plugin_init' );

/**
 * On activation, ensure rewrites are flushed.
 */
function llms_txt_plugin_on_activation() {
    llms_txt_plugin_init();
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'llms_txt_plugin_on_activation' );

/**
 * On deactivation, flush rewrites again (removing any custom rules).
 */
function llms_txt_plugin_on_deactivation() {
    flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'llms_txt_plugin_on_deactivation' );
