<?php

class Starterkit_Theme_CMS_Utils {

	public function __construct() {
	}

	/**
	 * Utility function to get theme design tokens from theme-vars.json as an associative array
	 * @wp-hook
	 * @return array
	 */
	static function get_theme(): array {
		$json = file_get_contents(get_stylesheet_directory_uri() . '/theme-vars.json');

		return json_decode($json, true);
	}
}
