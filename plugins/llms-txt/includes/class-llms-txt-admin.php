<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LLMS_Txt_Admin {

    const OPTION_KEY = 'llms_txt_plugin_options';

    public function __construct() {
        // Setup admin menu
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
        // Register our settings
        add_action( 'admin_init', [ $this, 'register_settings' ] );
    }

    /**
     * Add an entry under Settings -> LLMS TXT
     */
    public function register_admin_menu() {
        add_options_page(
            'LLMS TXT Settings',
            'LLMS TXT',
            'manage_options',
            'llms-txt-settings',
            [ $this, 'render_settings_page' ]
        );
    }

    /**
     * Register a setting that stores user options for which post types we include, etc.
     */
    public function register_settings() {
        register_setting(
            'llms_txt_plugin_group',
            self::OPTION_KEY,
            [ 'sanitize_callback' => [ $this, 'sanitize_options' ] ]
        );

        add_settings_section(
            'llms_txt_section',
            'LLMS TXT Configuration',
            function() {
                echo '<p>Configure how LLMS TXT plugin exposes your site content to LLMs.</p>';
            },
            'llms-txt-settings'
        );

        add_settings_field(
            'include_post_types',
            'Include Post Types',
            [ $this, 'render_include_post_types_field' ],
            'llms-txt-settings',
            'llms_txt_section'
        );
    }

    /**
     * Render the checkbox list for picking which post types to expose.
     */
    public function render_include_post_types_field() {
        $options = $this->get_options();
        $selected_types = isset($options['include_post_types']) ? (array)$options['include_post_types'] : [];

        $public_types = get_post_types( [ 'public' => true ], 'objects' );
        echo '<ul style="margin-top:0;">';
        foreach( $public_types as $ptype => $pobj ) {
            $checked = in_array( $ptype, $selected_types ) ? 'checked' : '';
            printf(
                '<li><label><input type="checkbox" name="%s[]" value="%s" %s> %s</label></li>',
                esc_attr( self::OPTION_KEY . '[include_post_types]' ),
                esc_attr( $ptype ),
                $checked,
                esc_html( $pobj->labels->name )
            );
        }
        echo '</ul>';
    }

    /**
     * Display the settings page HTML
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>LLMS TXT Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields( 'llms_txt_plugin_group' );
                do_settings_sections( 'llms-txt-settings' );
                submit_button();
                ?>
            </form>

            <div class="llms-txt-links" style="margin-top: 2em; padding: 1em; background: #fff; border: 1px solid #ccd0d4; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
                <h2>Available Text Files</h2>
                <p>The following text files are available for LLM consumption:</p>
                <ul style="list-style-type: disc; margin-left: 2em;">
                    <li><a href="<?php echo esc_url(home_url('/llms.txt')); ?>" target="_blank">llms.txt</a> - Basic listing of all included content</li>
                    <li><a href="<?php echo esc_url(home_url('/llms-full.txt')); ?>" target="_blank">llms-full.txt</a> - Full content of all included posts</li>
                    <li><a href="<?php echo esc_url(home_url('/llms-small.txt')); ?>" target="_blank">llms-small.txt</a> - Excerpts of all included content</li>
                </ul>
            </div>
        </div>
        <?php
    }

    /**
     * Sanitize the options saved to DB
     */
    public function sanitize_options( $input ) {
        $clean = [];
        $all_public = get_post_types( [ 'public' => true ] );
        if ( isset( $input['include_post_types'] ) && is_array( $input['include_post_types'] ) ) {
            // Only keep the ones that are valid
            $filtered = array_filter( $input['include_post_types'], function( $pt ) use ( $all_public ) {
                return in_array( $pt, $all_public, true );
            } );
            $clean['include_post_types'] = array_values( $filtered );
        } else {
            // Default to just 'post' and 'page'
            $clean['include_post_types'] = [ 'post', 'page' ];
        }
        return $clean;
    }

    /**
     * Helper to get our plugin options from DB
     */
    public function get_options() {
        $defaults = [
            'include_post_types' => [ 'post', 'page' ],
        ];
        $saved = get_option( self::OPTION_KEY, [] );
        return wp_parse_args( $saved, $defaults );
    }
}
