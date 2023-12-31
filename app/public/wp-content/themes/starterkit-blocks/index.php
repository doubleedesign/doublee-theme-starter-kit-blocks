<?php
get_header();
if( ! is_front_page()) {
	get_template_part('partials/breadcrumbs');
}
?>
<header class="pseudo-module post-archive__header page-header bg-light">
	<div class="row">
		<div class="col-xs-12 entry-content">
			<h1>
				<?php
				if(defined('PAGE_FOR_POSTS') && is_home()) {
					echo get_the_title(PAGE_FOR_POSTS);
				} else {
					echo get_the_archive_title();
				}
				?>
			</h1>
		</div>
	</div>
</header>

<section class="pseudo-module post-archive bg-white">
	<main class="post-archive__posts">
		<div class="row">
			<?php
			if(have_posts()) {
				while(have_posts()) {
					the_post();
					get_template_part('partials/excerpt');
				}
				get_template_part('partials/pagination');
			} else { ?>
				<div class="alert alert-warning">
					<p>No posts were found</p>
				</div>
			<?php } ?>
		</div>
	</main>
</section>

<?php get_footer(); ?>
