<?php

class Starterkit_Media {
	public function __construct() {
		add_filter('upload_mimes', [$this, 'allow_svg']);
		add_action('after_setup_theme', [$this, 'register_image_sizes']);
		add_filter('image_size_names_choose', [$this, 'add_to_media_sizes_dropdown']);
	}

	/**
	 * Custom image size definitions
	 * @var array|array[]
	 */
	private array $image_sizes = array(
		'container_width' => array(
			'width'  => 1280,
			'height' => 1280,
			'crop'   => false
		)
	);

	/**
	 * Add SVG to allowed MIME types
	 *
	 * @param $mimes
	 *
	 * @wp-hook
	 *
	 * @return mixed
	 */
	function allow_svg($mimes): mixed {
		$mimes['svg'] = 'image/svg+xml';

		return $mimes;
	}


	/**
	 * Register custom image sizes
	 * @wp-hook
	 *
	 * @return void
	 */
	function register_image_sizes(): void {
		foreach($this->image_sizes as $name => $specs) {
			add_image_size($name, $specs['width'], $specs['height'], $specs['crop']);
		}
	}


	/**
	 * Add custom image sizes to editor image size dropdown
	 * @wp-hook
	 *
	 * @param $sizes
	 *
	 * @return mixed
	 */
	function add_to_media_sizes_dropdown($sizes): mixed {
		foreach($this->image_sizes as $name => $specs) {
			$sizes[$name] = ucfirst(str_replace('_', ' ', $name));
		}

		return $sizes;
	}
}
