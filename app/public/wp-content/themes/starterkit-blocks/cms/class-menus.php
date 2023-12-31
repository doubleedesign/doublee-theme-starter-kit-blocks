<?php

class Starterkit_Menus {

	public function __construct() {
		add_action('init', [$this, 'register_menus']);
		add_action('rest_api_init', [$this, 'make_menus_available_in_rest']);
		add_filter('nav_menu_link_attributes', [$this, 'menu_link_classes'], 10, 4);
		add_filter('nav_menu_submenu_css_class', [$this, 'menu_submenu_classes'], 10, 2);
	}


	/**
	 * Register menus in the back-end
	 * @wp-hook
	 *
	 * @return void
	 */
	function register_menus(): void {
		register_nav_menus(array(
			'primary' => 'Primary menu'
		));
	}


	/**
	 * Make nav menus available in the REST API
	 * @wp-hook
	 *
	 * @return void
	 */
	function make_menus_available_in_rest(): void {

		// Route that gets the registered menu locations,
		// really just to check what they are from the API if needed
		register_rest_route('wp/v2', '/menus', array(
			'methods'  => 'GET',
			'callback' => 'get_registered_nav_menus'
			// if you're wondering where this is, it's a built-in WP function
		));

		// Route that gets a complete menu by location key (passed as a parameter to get_menu)
		register_rest_route('wp/v2', '/menu', array(
			'methods'  => 'GET',
			'callback' => 'get_menu'
		));

		/**
		 * Inner callback function to get a menu by location key
		 * e.g., /wp-json/wp/v2/menu?location=header
		 *
		 * @wp-hook
		 *
		 * @param $data
		 *
		 * @return array|false
		 */
		function get_menu($data): bool|array {
			$location = $data->get_param('location');
			$locations = get_nav_menu_locations();
			$object = wp_get_nav_menu_object($locations[$location]);

			return wp_get_nav_menu_items($object->name);
		}

		/**
		 * Add classes to menu <li> tags
		 *
		 * @param $classes
		 * @param $item
		 * @param $args
		 * @param $depth
		 *
		 * @return array
		 * @noinspection PhpUnusedParameterInspection
		 */
		function menu_item_classes($classes, $item, $args, $depth): array {

			// Header menu
			if($args->theme_location == 'header-menu') {
				$classes[] = 'nav-item';

				if(in_array('menu-item-has-children', $classes)) {
					$classes[] = 'has-sub';
					$classes[] = 'toggle-hover';
				}
			}

			// Footer menu
			if($args->theme_location == 'footer-menu') {
				if($depth == 0 && $args->depth > 1) {
					$classes[] = 'menu-item--top-level col-xs-12 col-sm-6 col-xl-3';
				}
				else {
					if($args->depth == 1) {
						$classes[] = 'col-xs-12';
					}
				}
			}

			return $classes;
		}
	}


	/**
	 * Add classes to menu <a> tags
	 *
	 * @param $atts
	 * @param $item
	 * @param $args
	 * @param $depth
	 *
	 * @return array
	 */
	function menu_link_classes($atts, $item, $args, $depth): array {

		// Header menu
		if($args->theme_location == 'header' && $depth == 0 && in_array('menu-item-has-children', $item->classes)) {
			$atts['class'] = 'menu-dropdown-link';
		}

		return $atts;
	}

	/**
	 * Add classes to sub-menu <ul>
	 *
	 * @param $classes
	 * @param $args
	 *
	 * @return array
	 */
	function menu_submenu_classes($classes, $args): array {

		// Header menu
		if($args->theme_location == 'header') {
			$classes[] = 'dropdown-menu';
		}

		return $classes;
	}
}
