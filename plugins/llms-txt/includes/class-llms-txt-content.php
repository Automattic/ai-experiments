<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LLMS_Txt_Content {

    // We use transient caching to avoid rebuilding large strings on every request
    const CACHE_KEY_PREFIX = 'llms_txt_';

    /**
     * Return a short listing of site content (like a table of contents).
     */
    public static function get_listing_text() {
        $cache_key = self::CACHE_KEY_PREFIX . 'listing';
        $cached = get_transient( $cache_key );
        if ( false !== $cached ) {
            return $cached;
        }

        $lines   = [];
        $lines[] = '# LLMS Listing';
        $lines[] = '';

        $post_ids = self::fetch_all_included_posts();
        $lines[] = 'Files available: ' . count( $post_ids );
        foreach ( $post_ids as $pid ) {
            $title = get_the_title( $pid );
            $link = get_permalink( $pid );
            $post_type = get_post_type_object(get_post_type($pid))->labels->singular_name;
            
            // Get taxonomies and terms
            $taxonomies = get_object_taxonomies($pid);
            $tax_terms = [];
            foreach ($taxonomies as $tax) {
                $terms = wp_get_post_terms($pid, $tax);
                if (!empty($terms) && !is_wp_error($terms)) {
                    $term_names = wp_list_pluck($terms, 'name');
                    $tax_obj = get_taxonomy($tax);
                    $tax_terms[] = $tax_obj->labels->singular_name . ': ' . implode(', ', $term_names);
                }
            }
            
            $meta = " ({$post_type}";
            if (!empty($tax_terms)) {
                $meta .= " | " . implode(' | ', $tax_terms);
            }
            $meta .= ")";
            
            $lines[] = "- [{$title}{$meta}]({$link})";
        }
        $lines[] = '';

        $output = implode( "\n", $lines );
        set_transient( $cache_key, $output, HOUR_IN_SECONDS );
        return $output;
    }

    /**
     * Return the full content for each included post, in a rough Markdown format.
     */
    public static function get_full_text() {
        $cache_key = self::CACHE_KEY_PREFIX . 'full';
        $cached = get_transient( $cache_key );
        if ( false !== $cached ) {
            return $cached;
        }

        $lines = [];
        $lines[] = '# LLMS Full Content';
        $lines[] = '';

        $post_ids = self::fetch_all_included_posts();
        foreach ( $post_ids as $pid ) {
            $title   = get_the_title( $pid );
            $content = get_post( $pid )->post_content;
            $post_type = get_post_type_object(get_post_type($pid))->labels->singular_name;
            
            // Get taxonomies and terms
            $taxonomies = get_object_taxonomies($pid);
            $tax_terms = [];
            foreach ($taxonomies as $tax) {
                $terms = wp_get_post_terms($pid, $tax);
                if (!empty($terms) && !is_wp_error($terms)) {
                    $term_names = wp_list_pluck($terms, 'name');
                    $tax_obj = get_taxonomy($tax);
                    $tax_terms[] = $tax_obj->labels->singular_name . ': ' . implode(', ', $term_names);
                }
            }
            
            $meta = " ({$post_type}";
            if (!empty($tax_terms)) {
                $meta .= " | " . implode(' | ', $tax_terms);
            }
            $meta .= ")";
            
            // For real usage, use a robust HTML->MD converter. This is a simplistic approach:
            $content_md = wp_strip_all_tags( $content );
            $lines[] = "## {$title}{$meta}\n";
            $lines[] = $content_md;
            $lines[] = '';
        }

        $output = implode( "\n", $lines );
        set_transient( $cache_key, $output, HOUR_IN_SECONDS );
        return $output;
    }

    /**
     * Return a more compressed version (like excerpts).
     */
    public static function get_small_text() {
        $cache_key = self::CACHE_KEY_PREFIX . 'small';
        $cached = get_transient( $cache_key );
        if ( false !== $cached ) {
            return $cached;
        }

        $lines = [];
        $lines[] = '# LLMS Small Content (Excerpts)';
        $lines[] = '';

        $post_ids = self::fetch_all_included_posts();
        foreach ( $post_ids as $pid ) {
            $title = get_the_title( $pid );
            $post_type = get_post_type_object(get_post_type($pid))->labels->singular_name;
            
            // Get taxonomies and terms
            $taxonomies = get_object_taxonomies($pid);
            $tax_terms = [];
            foreach ($taxonomies as $tax) {
                $terms = wp_get_post_terms($pid, $tax);
                if (!empty($terms) && !is_wp_error($terms)) {
                    $term_names = wp_list_pluck($terms, 'name');
                    $tax_obj = get_taxonomy($tax);
                    $tax_terms[] = $tax_obj->labels->singular_name . ': ' . implode(', ', $term_names);
                }
            }
            
            $meta = " ({$post_type}";
            if (!empty($tax_terms)) {
                $meta .= " | " . implode(' | ', $tax_terms);
            }
            $meta .= ")";
            
            // Use excerpt if set, otherwise generate
            $excerpt = get_the_excerpt( $pid );
            if ( ! $excerpt ) {
                $excerpt = wp_trim_words( get_post( $pid )->post_content, 40 );
            }
            $link = get_permalink( $pid );

            $lines[] = "## {$title}{$meta}";
            $lines[] = $excerpt;
            $lines[] = "Link: {$link}\n";
        }

        $output = implode( "\n", $lines );
        set_transient( $cache_key, $output, HOUR_IN_SECONDS );
        return $output;
    }

    /**
     * Internal method to fetch all post IDs that the user wants to include,
     * as set in plugin settings.
     */
    private static function fetch_all_included_posts() {
        $opts = get_option( LLMS_Txt_Admin::OPTION_KEY, [] );
        $post_types = isset($opts['include_post_types']) && is_array($opts['include_post_types'])
            ? $opts['include_post_types']
            : [ 'post', 'page' ];

        $args = [
            'post_type'      => $post_types,
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ];
        return get_posts( $args );
    }
}
