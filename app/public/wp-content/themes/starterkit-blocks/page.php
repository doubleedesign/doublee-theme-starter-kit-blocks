<?php
the_post();
get_header();
?>
	<div id="app">
		<?php
		$blocks = parse_blocks(get_the_content());
		//error_log(print_r(get_the_content(), true));
		//error_log(print_r($blocks, true));
		Starterkit_Theme_Frontend_Utils::output_custom_blocks($blocks);
		?>
	</div>
<?php
get_footer();
