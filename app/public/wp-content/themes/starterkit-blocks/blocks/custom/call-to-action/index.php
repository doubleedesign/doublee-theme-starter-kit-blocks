<?php
// Array of block data should be passed in from get_template_part
if( ! isset($args['block'])) {
	return;
}

$allowed_blocks = ['core/heading', 'core/paragraph', 'core/buttons'];
$default_blocks = array(
	array(
		'core/heading',
		array(
			'level'       => 2,
			'placeholder' => 'Your heading here',
			'className'   => 'block__call-to-action__heading'
		),
	),
	array(
		'core/paragraph',
		array(
			'placeholder' => 'Your call-to-action copy here'
		)
	),
	array(
		'core/buttons',
	)
);
?>

<section class="block block__call-to-action">
	<?php // Back-end preview ?>
	<?php
	if(isset($is_preview) && $is_preview) { ?>
		<InnerBlocks
			template="<?php echo esc_attr(wp_json_encode($default_blocks)); ?>"
			allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>"
			className="block__call-to-action__inner"
		/>
	<?php } ?>

	<?php // Front-end output ?>
	<call-to-action>
		<?php
		$content = $args['block'];
		if($content['innerBlocks']) {
			Starterkit_Theme_Frontend_Utils::output_custom_blocks($content['innerBlocks']);
		} ?>
	</call-to-action>
</section>





