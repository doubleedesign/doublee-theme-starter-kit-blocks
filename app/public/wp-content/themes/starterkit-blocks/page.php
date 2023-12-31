<?php
the_post();
get_header();
?>
	<pre>
 <?php
 $blocks = parse_blocks(get_the_content());
 print_r($blocks);
 ?>
</pre>
<?php
get_footer();
