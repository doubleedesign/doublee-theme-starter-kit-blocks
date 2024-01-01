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
	}


	/**
	 * Enqueue front-end scripts and styles
	 * @wp-hook
	 */
	function enqueue_frontend(): void {
		$theme_deps = array(
			'vendor-scripts'
		);

		if(is_singular() && comments_open() && get_option('thread_comments')) {
			wp_enqueue_script('comment-reply');
		}

		wp_enqueue_style('starterkit-style', get_stylesheet_uri(), array(), THEME_VERSION);

		wp_enqueue_script('vendor-scripts', get_template_directory_uri() . '/js/dist/vendor.bundle.js', array(), THEME_VERSION, true);

		wp_enqueue_script('fontawesome', '//kit.fontawesome.com/328982870b.js', array(), '6.x', true);

		if(defined('GMAPS_KEY') && GMAPS_KEY) {
			wp_enqueue_script('gmaps', 'https://maps.googleapis.com/maps/api/js?key=' . GMAPS_KEY, '', '3', true);
			array_push($theme_deps, 'gmaps');
		}

		wp_enqueue_script('theme-scripts', get_template_directory_uri() . '/js/dist/theme.bundle.js', $theme_deps, THEME_VERSION, true);

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
