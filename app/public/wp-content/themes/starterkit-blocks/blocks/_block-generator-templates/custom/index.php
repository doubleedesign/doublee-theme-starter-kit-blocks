<?php
$is_editor = isset($is_preview) && $is_preview;
// Array of block data should be passed in from get_template_part as $args['block']
if( !$is_editor && !isset($args)) {
	return;
}

$allowed_blocks = [];
$default_blocks = array(
	array(),
)
?>

<section class="block block__template-name">
	<?php
	// Back-end preview loaded by ACF
	if($is_editor) { ?>
		<InnerBlocks
			template="<?php echo esc_attr(wp_json_encode($default_blocks)); ?>"
			allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>"
		/>
	<?php } ?>

	<?php
	// Front-end output using custom Vue component
	if( !$is_editor && isset($args['block'])) { ?>
		<template-name>
			<?php
			$content = $args['block'];
			if($content['innerBlocks']) {
				Starterkit_Theme_Frontend_Utils::output_custom_blocks($content['innerBlocks']);
			} ?>
		</template-name>
	<?php } ?>
</section>
