<?php

class Starterkit_Content_Handling {
	public function __construct() {
		add_filter('template_include', [$this, 'reroute_to_404']);
		add_action('template_redirect', [$this, 'redirect_to_url']);
	}

	/**
	 * Reroute page to 404 as per ACF field page_inaccessible
	 *
	 * @param $template
	 *
	 * @return mixed|string
	 */
	function reroute_to_404($template): mixed {
		if(function_exists('get_field') && get_field('page_inaccessible')) {
			return locate_template('404.php');
		}
		else {
			return $template;
		}
	}


	/**
	 * Redirect to a URL as per ACF field page_redirect
	 */
	function redirect_to_url(): void {
		if(function_exists('get_field')) {
			$redirect = get_field('page_redirect');
			if($redirect && $redirect['url']) {
				wp_redirect($redirect['url']);
			}
		}
	}
}
