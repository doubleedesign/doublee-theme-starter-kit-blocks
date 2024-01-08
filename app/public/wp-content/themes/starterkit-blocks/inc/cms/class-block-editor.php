<?php

/**
 * Customisations to block editor functionality/display.
 */
class Starterkit_Block_Editor {

	public function __construct() {
		add_action('init', [$this, 'register_custom_blocks']);
		add_filter('block_categories_all', [$this, 'register_block_categories']);
		add_filter('allowed_block_types_all', [$this, 'allowed_blocks'], 10, 2);
		add_action('init', [$this, 'allowed_block_patterns'], 10, 2);
		add_filter('should_load_remote_block_patterns', '__return_false');
		add_action('after_setup_theme', [$this, 'disable_block_template_editor']);
		add_filter('block_editor_settings_all', [$this, 'disable_block_code_editor'], 10, 2);
		add_action('enqueue_block_editor_assets', [$this, 'block_editor_scripts'], 100);
		add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
		add_filter('script_loader_tag', [$this, 'script_type_module'], 10, 3);
		add_action('enqueue_block_editor_assets', [$this, 'disable_editor_fullscreen_mode']);
	}


	/**
	 * Register custom blocks
	 * @return void
	 * @uses Advanced Custom Fields Pro
	 */
	function register_custom_blocks(): void {
		$block_folders = array_diff(scandir(dirname(__DIR__, 2) . '/blocks/custom/'), ['.', '..']);

		foreach($block_folders as $block_name) {
			register_block_type(dirname(__DIR__, 2) . '/blocks/custom/' . $block_name);
			// ACF takes care of the rendering rather than using render_callback.
			// TODO See https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/inner-blocks/README.md for a starting point on removing this dependency
		}
	}


	/**
	 * Register custom block categories
	 *
	 * @param $categories
	 *
	 * @return array
	 */
	function register_block_categories($categories): array {
		$categories[] = array(
			'slug'  => 'page-layout', // because the built-in Design category uses 'layout'
			'title' => 'Layout'
		);

		return array_reverse($categories);
	}


	/**
	 * Limit available core blocks for simplicity
	 *
	 * @param $allowed_block_types
	 * @param $block_editor_context
	 *
	 * @return mixed
	 */
	function allowed_blocks($allowed_block_types, $block_editor_context): array {
		$all_block_types = WP_Block_Type_Registry::get_instance()->get_all_registered();
		$custom_block_types = array_filter($all_block_types, function($block_type) {
			return str_starts_with($block_type->name, 'custom/');
		});

		return array_merge(
			array_column($custom_block_types, 'name'),
			array(
				'core/media-text-custom',
				'core/heading',
				'core/paragraph',
				'core/list',
				'core/columns',
				'core/column',
				'core/freeform',
				'core/cover',
				'core/image',
				'core/media-text',
				'core/table',
				'core/separator',
				'core/embed',
				// allowed embed variations are curated using unregisterBlockVariation in JS because there isn't an equivalent PHP function
			)
		);
	}


	/**
	 * Disable some core Block Patterns for simplicity
	 * and register custom patterns
	 * Note: Also ensure loading of remote patterns is disabled using add_filter('should_load_remote_block_patterns', '__return_false');
	 *
	 * @return void
	 */
	function allowed_block_patterns(): void {
		unregister_block_pattern('core/social-links-shared-background-color');
		unregister_block_pattern('core/query-offset-posts');
		unregister_block_pattern('core/query-large-title-posts');
		unregister_block_pattern('core/query-grid-posts');
		unregister_block_pattern('core/query-standard-posts');
		unregister_block_pattern('core/query-medium-posts');
		unregister_block_pattern('core/query-small-posts');

		// TODO: Register custom block patterns
	}


	/**
	 * Disable block template editor option
	 * @return void
	 */
	function disable_block_template_editor(): void {
		remove_theme_support('block-templates');
	}


	/**
	 * Disable access to the block code editor
	 */
	function disable_block_code_editor($settings, $context) {
		$settings['codeEditingEnabled'] = false;

		return $settings;
	}


	/**
	 * Load the JS that modifies block stuff that can't be done in PHP or theme.json
	 * @return void
	 */
	function block_editor_scripts(): void {
		//wp_enqueue_script('starterkit-block-editor-js', get_template_directory_uri() . '/js/dist/editor.bundle.js',
		wp_enqueue_script('starterkit-block-editor-js', get_template_directory_uri() . '/js/admin/block-editor.js',
			array(
				'wp-dom',
				'wp-dom-ready',
				'wp-blocks',
				'wp-edit-post',
				'wp-element',
				'wp-plugins',
				'wp-edit-post',
				'wp-components',
				'wp-data',
				'wp-compose',
				'wp-i18n',
				'wp-hooks',
				'wp-block-editor'
			),
			THEME_VERSION,
			false
		);
	}


	/**
	 * Script to hackily remove menu items (e.g., the disabled code editor button) for simplicity
	 * @return void
	 */
	function admin_scripts(): void {
		wp_enqueue_script('starterkit-admin-js', get_stylesheet_directory_uri() . '/js/admin/admin-hacks.js');
	}


	/**
	 * Add type=module to admin JS script tag
	 *
	 * @param $tag
	 * @param $handle
	 * @param $src
	 *
	 * @return mixed|string
	 */
	function script_type_module($tag, $handle, $src): mixed {
		if(in_array($handle, ['starterkit-admin-js'])) {
			$tag = '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '" ></script>';
		}

		return $tag;
	}


	/**
	 * Disable fullscreen mode - keep dashboard menu visible
	 * @return void
	 */
	function disable_editor_fullscreen_mode(): void {
		$script = "window.onload = function() { const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' ); if ( isFullscreenMode ) { wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' ); } }";
		wp_add_inline_script('wp-blocks', $script);
	}


}
