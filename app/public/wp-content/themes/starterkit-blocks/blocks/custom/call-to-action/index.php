<section class="block block__call-to-action">
	<?php
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

	<InnerBlocks
		template="<?php echo esc_attr(wp_json_encode($default_blocks)); ?>"
		allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>"
		className="block__call-to-action__inner"
	/>

</section>
