<?php
global $post;
$blocks = parse_blocks($post->post_content);
foreach($blocks as $block) {
	$name = $block['blockName'];
	get_template_part("partials/blocks/$name", '', array('block' => $block));
}
