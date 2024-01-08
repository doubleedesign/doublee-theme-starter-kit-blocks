<?php
// For core blocks, we can control front-end output only in this file
// Array of block data should be passed in from get_template_part as $args['block']
if( ! isset($args['block'])) {
	return;
}
?>

<section class="block block__template-name">
	<?php
	// Front-end output using custom Vue component ?>
	<template-name>
		<?php
		$content = $args['block'];
		if($content['innerBlocks']) {
			Starterkit_Theme_Frontend_Utils::output_custom_blocks($content['innerBlocks']);
		} ?>
	</template-name>
</section>
