<?php

use JetBrains\PhpStorm\NoReturn;

class Starterkit_Admin {

	public function __construct() {
		add_action('admin_notices', [$this, 'required_plugin_notification']);
		add_action('admin_init', [$this, 'disable_customiser']);
		add_action('admin_enqueue_scripts', [$this, 'admin_css']);
		add_action('login_enqueue_scripts', [$this, 'login_logo']);
		add_action('admin_menu', [$this, 'remove_metaboxes']);
		add_action('admin_notices', [$this, 'required_plugin_notification']);
		add_action('add_meta_boxes', [$this, 'remove_metaboxes'], 99);
		add_action('after_setup_theme', [$this, 'register_theme_support']);
	}

	function required_plugin_notification(): void {
		$warnings = array();
		if( ! is_plugin_active('advanced-custom-fields-pro/acf.php')) {
			$warnings[] = 'Advanced Custom Fields Pro';
		}

		if(count($warnings) > 0) {
			echo '<div class="notice notice-error">';
			echo '<p>The ' . wp_get_theme()->name . ' theme requires the following plugins to be installed and activated for full functionality. Without them, some features may be missing or not work as expected.</p>';
			echo '<ul>';
			foreach($warnings as $warning) {
				echo '<li>' . $warning . '</li>';
			}
			echo '</ul>';
			echo '</div>';
		}
	}


	/**
	 * Disable the Customiser in favour of having most things together in an ACF options page
	 * and because it will probably be deprecated as the block editor takes over
	 * Largely lifted from the Customizer Disabler plugin, except I haven't bothered to remove capabilities
	 * https://wordpress.org/plugins/customizer-disabler/
	 * @wp-hook
	 *
	 * @return void
	 */
	function disable_customiser(): void {
		remove_action('plugins_loaded', '_wp_customize_include');
		remove_action('admin_enqueue_scripts', '_wp_customize_loader_settings', 11);
		add_action('load-customize.php', [$this, 'override_load_customizer_action']);
		add_action('admin_init', [$this, 'remove_customiser_from_menu'], 99);
	}

	#[NoReturn] function override_load_customizer_action(): void {
		wp_die(__('The Customiser is currently disabled.', 'customizer-disabler'));
	}

	function remove_customiser_from_menu(): void {
		$customize_url = add_query_arg('return', urlencode(remove_query_arg(wp_removable_query_args(), wp_unslash($_SERVER['REQUEST_URI']))), 'customize.php');
		remove_submenu_page('themes.php', $customize_url);
	}


	/**
	 * Enqueue admin CSS
	 * @wp-hook
	 *
	 * @return void
	 */
	function admin_css(): void {
		wp_enqueue_style('starterkit-admin-css', get_stylesheet_directory_uri() . '/styles-admin.css');
		wp_enqueue_style('starterkit-fonts', 'https://use.typekit.net/gwg0cmn.css');
	}

	
	/**
	 * Customise login screen logo
	 * @wp-hook
	 */
	function login_logo(): void {
		$custom_logo_id = get_field('logo', 'options');
		if($custom_logo_id) {
			$logo = wp_get_attachment_image_src($custom_logo_id, 'full');
			?>
			<style>
				#login h1 a {
					min-width: 75%;
					min-height: 80px;
					width: <?php echo $logo[1]; ?>px !important;
					height: <?php echo $logo[2]; ?>px !important;
					background-image: url('<?php echo $logo[0]; ?>') !important;
					padding-bottom: 0 !important;
					background-size: contain !important;
				}
			</style>
		<?php }
	}


	/**
	 * Remove unwanted metaboxes
	 * @wp-hook
	 */
	function remove_metaboxes(): void {
		remove_meta_box('nf_admin_metaboxes_appendaform', array('page', 'post'), 'side');
	}


	/**
	 * Register theme support for the relevant backend features
	 * Note: I'm leaning towards using an ACF options page for most things
	 * rather than the Customizer (which does support adding a logo for example),
	 * simply to keep things in one place
	 * @wp-hook
	 */
	function register_theme_support(): void {
		add_theme_support('title-tag');
		add_theme_support('post-thumbnails');
		add_post_type_support('page', 'excerpt');
	}
}
