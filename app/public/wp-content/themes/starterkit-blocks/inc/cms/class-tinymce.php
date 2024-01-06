<?php

class Starterkit_TinyMCE {

	public function __construct() {
		add_action('admin_init', [$this, 'editor_css']);
		add_filter('tiny_mce_before_init', [$this, 'editor_css_acf']);
		add_filter('tiny_mce_before_init', [$this, 'init_settings']);
		add_filter('tiny_mce_before_init', [$this, 'populate_styleselect']);
		add_filter('tiny_mce_before_init', [$this, 'add_theme_colours']);
		add_filter('tiny_mce_plugins', [$this, 'remove_custom_colours']);
		add_filter('mce_buttons', [$this, 'remove_buttons']);
		add_filter('mce_buttons', [$this, 'add_styleselect']);
	}


	/**
	 * Some default TinyMCE settings
	 *
	 * @param $settings
	 *
	 * @wp-hook
	 *
	 * @return array
	 */
	function init_settings($settings): array {
		$settings['paste_as_text'] = true; // default to "Paste as text"
		$settings['wordpress_adv_hidden'] = false; // keep the "kitchen sink" open

		return $settings;
	}


	/**
	 * Load editor CSS in default TinyMCE
	 * @wp-hook
	 *
	 * @return void
	 */
	function editor_css(): void {
		add_editor_style('https://use.typekit.net/gwg0cmn.css');
		add_editor_style(get_stylesheet_directory_uri() . '/styles-editor.css');
	}


	/**
	 * Load editor styles in ACF WYSIWYG fields
	 * Ref: https://pagegwood.com/web-development/custom-editor-stylesheets-advanced-custom-fields-wysiwyg/
	 *
	 * @param $mce_init
	 *
	 * @wp-hook
	 *
	 * @return array
	 */
	function editor_css_acf($mce_init): array {
		$content_css = '/styles-editor.css';
		$version = filemtime(get_stylesheet_directory() . $content_css);
		$content_css = get_stylesheet_directory_uri() . $content_css . '?v=' . $version; // it caches hard, use this to force a refresh

		if(isset($mce_init['content_css'])) {
			$content_css_new = $mce_init['content_css'] . ',' . $content_css;
			$mce_init['content_css'] = $content_css_new;
		}

		return $mce_init;
	}


	/**
	 * Add predefined colours to TinyMCE
	 * @wp-hook
	 *
	 * @param $settings
	 *
	 * @return array
	 */
	function add_theme_colours($settings): array {
		$theme = Starterkit_Theme_CMS_Utils::get_theme();
		$colours = array();

		foreach($theme['colours'] as $name => $value) {
			$colours[str_replace('#', '', $value)] = ucfirst($name);
		}

		if( ! empty($colours)) {
			$map = array();
			foreach($colours as $value => $label) {
				$map[] = '"' . $value . '","' . $label . '"';
			}

			$settings['textcolor_map'] = '[' . implode(',', $map) . ']';
		}

		return $settings;
	}


	/**
	 * Remove the Color Picker plugin from TinyMCE
	 * so only the theme colours specified in starterkit_tinymce_add_custom_colours can be selected
	 * @wp-hook
	 *
	 * @param array $plugins An array of default TinyMCE plugins.
	 */
	function remove_custom_colours(array $plugins): array {
		foreach($plugins as $key => $plugin_name) {
			if('colorpicker' === $plugin_name) {
				unset($plugins[$key]);

				return $plugins;
			}
		}

		return $plugins;
	}


	/**
	 * Remove unwanted buttons from TinyMCE
	 *
	 * @param array $buttons
	 *
	 * @wp-hook
	 *
	 * @return array
	 */
	function remove_buttons(array $buttons): array {
		$to_remove = array(
			'wp_more',
			// Ability to add a "read more" tag
			'wp_adv'
			// Toggle for the "kitchen sink" i.e. second toolbar row, which is set to stay open in starterkit_tinymce_init_settings
		);

		foreach($buttons as $index => $button) {
			if(in_array($button, $to_remove)) {
				unset($buttons[$index]);
			}
		}

		return $buttons;
	}


	/**
	 * Add custom formats menu to TinyMCE
	 *
	 * @param $buttons
	 *
	 * @wp-hook
	 *
	 * @return array
	 */
	function add_styleselect($buttons): array {
		// Insert as the second item by splitting the existing array and then recombining with the new button
		return array_merge(
			array_slice($buttons, 0, 1),
			array('styleselect'),
			array_slice($buttons, 1)
		);
	}


	/**
	 * Populate custom formats menu in TinyMCE
	 * Notes: - 'selector' for block-level element that format is applied to; 'inline' to add wrapping tag e.g.'span'
	 *        - Using 'attributes' to apply the classes instead of 'class' ensures previous classes are replaced rather than added to
	 *        - 'styles' are inline styles that are applied to the items in the menu, not the output; options are pretty limited but enough to add things like colours
	 *          (further styling customisation to the menu may be done in the admin stylesheet)
	 *
	 * @param $settings
	 *
	 * @wp-hook
	 *
	 * @return array
	 */
	function populate_styleselect($settings): array {
		$style_formats = array(
			array(
				'title'   => 'Lead paragraph',
				'block'   => 'p',
				'classes' => 'lead'
			),
			array(
				'title'      => 'Button (primary)',
				'selector'   => 'a',
				'attributes' => array(
					'class' => 'btn btn--primary btn--icon'
				),
				'styles'     => array(
					'color'      => 'white',
					'background' => '602AA2',
					'fontWeight' => 'bold'
				)
			),
			array(
				'title'      => 'Button (secondary)',
				'selector'   => 'a',
				'attributes' => array(
					'class' => 'btn btn--secondary btn--icon'
				),
				'styles'     => array(
					'color'      => 'white',
					'background' => '2B193D',
					'fontWeight' => 'bold'
				)
			),
			array(
				'title'      => 'Button (accent)',
				'selector'   => 'a',
				'attributes' => array(
					'class' => 'btn btn--accent btn--icon'
				),
				'styles'     => array(
					'color'      => 'white',
					'background' => '009DD6',
					'fontWeight' => 'bold'
				)
			)
		);

		$settings['style_formats'] = json_encode($style_formats);
		unset($settings['preview_styles']);

		return $settings;
	}
}
