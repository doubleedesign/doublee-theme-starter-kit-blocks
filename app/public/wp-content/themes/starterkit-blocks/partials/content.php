<?php
global $post;
$blocks = parse_blocks($post->post_content);
foreach($blocks as $block) {
	$full_name = $block['blockName'];
	$short_name = str_replace('custom/', '', $full_name);
	get_template_part("blocks/$full_name/$short_name", '', array('block' => $block));
}
