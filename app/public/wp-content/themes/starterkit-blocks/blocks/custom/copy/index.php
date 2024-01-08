<?php
$is_editor = isset($is_preview) && $is_preview;
// Array of block data should be passed in from get_template_part as $args['block']
if( !$is_editor && !isset($args)) {
	return;
}

$allowed_blocks = ['core/heading', 'core/paragraph', 'core/list', 'core/table']; // TODO: Add buttons
$default_blocks = array(
	array(
		'core/heading',
		array(
			'level'       => 2,
			'placeholder' => 'A heading could go here',
		),
	),
	array(
		'core/paragraph',
		array(
			'placeholder' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum ipsum at justo euismod, ac placerat erat dapibus. Nam lectus odio, suscipit vel efficitur ut, ullamcorper at dui. Proin laoreet eu odio a gravida."
		)
	),
	array(
		'core/paragraph',
		array(
			'placeholder' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porttitor mauris magna, ut venenatis mi ornare id. Vivamus venenatis lorem quis neque laoreet dictum. Vivamus hendrerit justo sed hendrerit tincidunt. Nullam ac feugiat felis. Donec nec gravida nisl, sed vehicula neque."
		)
	)
)
?>

<section class="block block__copy">
	<?php
	// Back-end preview loaded by ACF
	if($is_editor) { ?>
		<InnerBlocks
			template="<?php echo esc_attr(wp_json_encode($default_blocks)); ?>"
			allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>"
			templateLock="false"
		/>
	<?php } ?>

	<?php
	// Front-end output using custom Vue component
	if( !$is_editor && isset($args['block'])) { ?>
		<copy>
			<?php
			$content = $args['block'];
			if($content['innerBlocks']) {
				Starterkit_Theme_Frontend_Utils::output_custom_blocks($content['innerBlocks']);
			} ?>
		</copy>
	<?php } ?>
</section>
