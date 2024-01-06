<?php
the_post();
get_header();
?>
	<div id="app">
		<?php
		$blocks = parse_blocks(get_the_content());
		Starterkit_Theme_Frontend_Utils::output_custom_blocks($blocks);
		?>
	</div>
<?php
get_footer();
