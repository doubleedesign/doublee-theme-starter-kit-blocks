<?php

/**
 * Customisations to block editor functionality/display.
 */
class Starterkit_Block_Editor {

	public function __construct() {
		add_filter('allowed_block_types_all', [$this, 'allowed_blocks'], 10, 2);
		add_action('enqueue_block_editor_assets', [$this, 'disable_editor_fullscreen_mode']);
		add_action('after_setup_theme', [$this, 'disable_block_patterns']);
		add_action('after_setup_theme', [$this, 'disable_block_template_editor']);
		add_filter('block_editor_settings_all', [$this, 'disable_block_code_editor'], 10, 2);
		add_action('enqueue_block_editor_assets', [$this, 'block_editor_scripts'], 100);
		add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
		add_filter('script_loader_tag', [$this, 'script_type_module'], 10, 3);
	}


	/**
	 * Limit available blocks for simplicity
	 *
	 * @param $allowed_block_types
	 * @param $block_editor_context
	 *
	 * @return mixed
	 */
	function allowed_blocks($allowed_block_types, $block_editor_context): array {

		return array(
			'core/paragraph',
			'core/heading',
			'core/list',
			'core/image',
			'core/gallery',
			//'core/quote',
			//'core/audio',
			'core/cover',
			'core/file',
			//'core/video',
			'core/table',
			//'core/verse',
			//'core/code',
			//'core/freeform', // Classic Editor block
			//'core/html',
			//'core/preformatted',
			//'core/pullquote',
			'core/media-text',
			//'core/more',
			//'core/nextpage',
			'core/separator',
			//'core/spacer',
			//'core/shortcode',
			//'core/archives',
			//'core/categories',
			//'core/latest-comments',
			'core/latest-posts',
			//'core/calendar',
			//'core/rss',
			//'core/search',
			//'core/tag-cloud',
			//'core/embed',
			'core-embed/twitter',
			'core-embed/youtube',
			'core-embed/facebook',
			'core-embed/instagram',
			//'core-embed/wordpress',
			//'core-embed/soundcloud',
			//'core-embed/spotify',
			//'core-embed/flickr',
			'core-embed/vimeo',
			//'core-embed/animoto',
			//'core-embed/cloudup',
			//'core-embed/collegehumor',
			//'core-embed/dailymotion',
			//'core-embed/funnyordie',
			//'core-embed/hulu',
			//'core-embed/imgur',
			//'core-embed/issuu',
			//'core-embed/kickstarter',
			//'core-embed/meetup-com',
			//'core-embed/mixcloud',
			//'core-embed/photobucket',
			//'core-embed/polldaddy',
			//'core-embed/reddit',
			//'core-embed/reverbnation',
			//'core-embed/screencast',
			//'core-embed/scribd',
			//'core-embed/slideshare',
			//'core-embed/smugmug',
		);
	}


	/**
	 * Disable fullscreen mode - keep dashboard menu visible
	 * @return void
	 */
	function disable_editor_fullscreen_mode(): void {
		$script = "window.onload = function() { const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' ); if ( isFullscreenMode ) { wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' ); } }";
		wp_add_inline_script('wp-blocks', $script);
	}


	/**
	 * Disable Block Patterns functionality for simplicity
	 * (For now, at least - will probably develop for this later)
	 * @return void
	 */
	function disable_block_patterns(): void {
		remove_theme_support('core-block-patterns');
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
		wp_enqueue_script('starterkit-block-editor-js',
			get_template_directory_uri() . '/js/dist/editor.bundle.js',
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

}
