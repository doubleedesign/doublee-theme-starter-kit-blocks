<?php
require_once('class-admin.php');
require_once('class-media.php');
require_once('class-menus.php');
require_once('class-utils.php');
require_once('class-tinymce.php');
require_once('class-block-editor.php');

/**
 * The CMS-specific settings and customisations for the theme.
 * @since 2.0.0
 */
class Starterkit_CMS {

	public function __construct() {
		new Starterkit_Theme_CMS_Utils();
		new Starterkit_Admin();
		new Starterkit_Menus();
		new Starterkit_Media();
		new Starterkit_TinyMCE();
		new Starterkit_Block_Editor();
	}
}
