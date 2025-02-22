<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LLMS_Txt_Plugin {

    const QUERY_VAR = 'llms_txt'; // we’ll handle /llms.txt, /llms-full.txt, /llms-small.txt

    public function __construct() {
        // Register rewrite rules
        add_action( 'init', [ $this, 'register_rewrites' ] );
        // Intercept requests
        add_action( 'template_redirect', [ $this, 'maybe_serve_endpoints' ] );
        // Ensure WP sees our custom query var
        add_filter( 'query_vars', [ $this, 'add_query_var' ] );
    }

    /**
     * Register new rewrite rules for /llms.txt, /llms-full.txt, /llms-small.txt
     */
    public function register_rewrites() {
        // e.g. https://example.com/llms.txt => index.php?llms_txt=listing
        add_rewrite_rule( '^llms\.txt$', 'index.php?llms_txt=listing', 'top' );
        add_rewrite_rule( '^llms-full\.txt$', 'index.php?llms_txt=full', 'top' );
        add_rewrite_rule( '^llms-small\.txt$', 'index.php?llms_txt=small', 'top' );
    }

    /**
     * Ensure 'llms_txt' is recognized as a valid query var.
     */
    public function add_query_var( $vars ) {
        $vars[] = self::QUERY_VAR;
        return $vars;
    }

    /**
     * Check if current request is for one of our special endpoints, and serve if so.
     */
    public function maybe_serve_endpoints() {
        $endpoint = get_query_var( self::QUERY_VAR );
        if ( empty( $endpoint ) ) {
            return; // not ours
        }
        // We have 'listing', 'full', or 'small'
        switch ( $endpoint ) {
            case 'listing':
                $output = LLMS_Txt_Content::get_listing_text();
                $this->send_as_text( $output );
                break;
            case 'full':
                $output = LLMS_Txt_Content::get_full_text();
                $this->send_as_text( $output );
                break;
            case 'small':
                $output = LLMS_Txt_Content::get_small_text();
                $this->send_as_text( $output );
                break;
            default:
                // Not recognized — do nothing
                break;
        }
    }

    /**
     * Helper to send plain text response and exit.
     */
    private function send_as_text( $content ) {
        header( 'Content-Type: text/plain; charset=utf-8' );
        echo $content;
        exit; // Stop WP
    }
}
