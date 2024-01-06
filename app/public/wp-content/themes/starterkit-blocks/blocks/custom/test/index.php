<?php
// Array of block data should be passed in from get_template_part
if( ! isset($args['block'])) {
	return;
}

$allowed_blocks = [];
$default_blocks = array(
	array(),
)
?>

<section class="block block__test">
	<?php
	// Back-end preview loaded by ACF
	if(isset($is_preview) && $is_preview) { ?>
		<InnerBlocks
			template="<?php echo esc_attr(wp_json_encode($default_blocks)); ?>"
			allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>"
			className="block__call-to-action__inner"
		/>
	<?php } ?>

	<?php
	// Front-end output using custom Vue component ?>
	<call-to-action>
		<?php
		$content = $args['block'];
		if($content['innerBlocks']) {
			Starterkit_Theme_Frontend_Utils::output_custom_blocks($content['innerBlocks']);
		} ?>
	</call-to-action>
</section>
