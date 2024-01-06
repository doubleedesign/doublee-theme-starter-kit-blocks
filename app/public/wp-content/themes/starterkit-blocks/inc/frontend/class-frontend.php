<?php
require_once('class-content-handling.php');
require_once('class-utils.php');

/**
 * The front-end specific functionality and customisations for the theme.
 */
class Starterkit_Frontend {

	public function __construct() {
		new Starterkit_Theme_Frontend_Utils();
		new Starterkit_Content_Handling();

		add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend']);
		add_action('enqueue_block_editor_assets', [$this, 'editor_css']);
		add_action('admin_enqueue_scripts', [$this, 'admin_css']);
		add_filter('script_loader_tag', [$this, 'script_type_module'], 10, 3);
	}


	/**
	 * Enqueue front-end scripts and styles
	 * @wp-hook
	 */
	function enqueue_frontend(): void {
		wp_enqueue_style('starterkit-style', get_stylesheet_uri(), array(), THEME_VERSION);

		wp_enqueue_script('vue-loader', 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.js', array(), '1.0.0', true);
		wp_enqueue_script('theme-vue-blocks', get_template_directory_uri() . '/blocks/vue-blocks.js', array('vue-loader'), THEME_VERSION, true);

		wp_enqueue_script('fontawesome', '//kit.fontawesome.com/328982870b.js', array(), '6.x', true);

		// Not currently using, but may need in the future
		//wp_enqueue_script('vendor-scripts', get_template_directory_uri() . '/js/dist/vendor.bundle.js', array(), THEME_VERSION, true);

		wp_enqueue_script('theme-custom-js', get_template_directory_uri() . '/js/theme.js', array(), THEME_VERSION, true);
		wp_add_inline_script('theme-custom-js',
			'const WP_VARS = ' . json_encode(array(
				'themeUrl' => get_template_directory_uri(),
			)), 'before');

		// Not currently using, but may need in the future
		//if(defined('GMAPS_KEY') && GMAPS_KEY) {
//			wp_enqueue_script('gmaps', 'https://maps.googleapis.com/maps/api/js?key=' . GMAPS_KEY, '', '3', true);
//			array_push($theme_deps, 'gmaps');
//		}

		if(is_singular() && comments_open() && get_option('thread_comments')) {
			wp_enqueue_script('comment-reply');
		}
	}


	/**
	 * Add type=module to the theme scripts
	 *
	 * @param $tag
	 * @param $handle
	 * @param $src
	 *
	 * @return mixed|string
	 */
	function script_type_module($tag, $handle, $src): mixed {
		if(in_array($handle, ['theme-vue-blocks', 'theme-custom-js'])) {
			$tag = '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '" ></script>';
		}

		return $tag;
	}


	/**
	 * Enqueue TinyMCE editor styles
	 * @wp-hook
	 *
	 * @return void
	 */
	function editor_css(): void {
		add_theme_support('wp-block-styles');
		wp_enqueue_style('starterkit-editor-styles', get_stylesheet_directory_uri() . '/styles-editor.css', THEME_VERSION);
	}


	/**
	 * Enqueue admin CSS
	 * @wp-hook
	 *
	 * @return void
	 */
	function admin_css(): void {
		wp_enqueue_style('starterkit-theme-admin', get_template_directory_uri() . '/styles-admin.css');
	}

}
