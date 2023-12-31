<?php
get_header();
get_template_part('partials/page-header');
?>
<?php if(!is_user_logged_in()) { ?>
	<section class="pseudo-module">
		<div class="row">
			<div class="col-12">
				<div class="alert alert--alert">
					<p>You don't have access to this page. If you are a site admin, please log in.</p>
					<div class="alert__buttons">
						<a class="btn btn--accent" href="<?php echo wp_login_url(); ?>">Log in</a>
						<a class="btn btn--secondary" href="<?php echo site_url(); ?>">Back to home</a>
					</div>
				</div>
			</div>
		</div>
	</section>
<?php } else {
	$backgrounds = ['light', 'dark', 'white', 'transparent'];
	$themes = ['primary', 'secondary', 'accent'];
	?>
	<section class="pseudo-module">
		<div class="row entry-content">
			<div class="col-12">
				<h2>Theme colours</h2>
			</div>
		</div>
		<div class="row" style="margin-bottom: 1rem">
			<div class="col-12 col-md-5">
				<div class="bg-primary entry-content" style="padding:1rem">
					<p>Primary</p>
				</div>
			</div>
			<div class="col-12 col-md-4">
				<div class="bg-secondary entry-content" style="padding:1rem">
					<p>Secondary</p>
				</div>
			</div>
			<div class="col-12 col-md-3">
				<div class="bg-accent entry-content" style="padding:1rem">
					<p>Accent</p>
				</div>
			</div>
		</div>
		<div class="row">
			<?php foreach(['success', 'info', 'warning', 'alert', 'light', 'dark'] as $colour) { ?>
				<div class="col-6 col-md-2">
					<div class="bg-<?php echo $colour; ?> entry-content" style="padding:1rem">
						<p><?php echo ucfirst($colour); ?></p>
					</div>
				</div>
			<?php }?>
		</div>
	</section>

	<section class="pseudo-module">
		<div class="row entry-content">
			<h2>Basic background colours and their default text</h2>
			<?php foreach ($backgrounds as $background) { ?>
				<div class="col-12 col-md-6">
					<div class="entry-content bg-<?php echo $background; ?>" style="padding:1rem; margin-bottom: 1rem;">
						<h3><?php echo ucfirst($background); ?></h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget turpis tempor, iaculis dolor eget, tempor mauris.</p>
						<p><a href="#">Basic link</a></p>
						<a href="#" class="btn">Button</a>
						<a href="#" class="btn btn--hollow">Hollow button</a>
					</div>
				</div>
			<?php } ?>
		</div>
	</section>

	<section class="pseudo-module">
		<div class="row entry-content">
			<h2>Colour themes used as a background</h2>
			<?php foreach ($themes as $background) { ?>
				<div class="col-12 col-md-6 col-lg-4">
					<div class="entry-content bg-<?php echo $background; ?>" style="padding:1rem; margin-bottom: 1rem;">
						<h3><?php echo ucfirst($background); ?></h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget turpis tempor, iaculis dolor eget, tempor mauris.</p>
						<p><a href="#">Basic link</a></p>
						<a href="#" class="btn btn--white">Button</a>
						<a href="#" class="btn btn--white--hollow">Hollow button</a>
					</div>
				</div>
			<?php } ?>
		</div>
	</section>

	<section class="pseudo-module">
		<div class="row entry-content">
			<div class="col-12">
				<h2>Colour themes used in conjunction with a basic background colour</h2>
				<div class="alert alert--warning" style="flex-wrap: wrap;">
					<p>As you can see, not all colour combinations work well together, so please choose thoughtfully.</p>
					<p>In some contexts, more specific options may be available that allow you to mix and match more than what is shown here.</p>
					<p>If you are a Double-E Design client, feel free to get in touch if you'd like any of the defaults changed across the board.</p>
				</div>
			</div>
			<?php foreach ($backgrounds as $background) { ?>
				<?php foreach($themes as $theme) { ?>
					<div class="col-12 col-md-6 col-lg-4">
						<div class="entry-content bg-<?php echo $background; ?> theme-<?php echo $theme; ?>" style="padding:1rem; margin-bottom: 1rem;">
							<h3><?php echo ucfirst($background); ?> + <?php echo $theme; ?></h3>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget turpis tempor, iaculis dolor eget, tempor mauris.</p>
							<p><a href="#">Basic link</a></p>
							<a href="#" class="btn btn--<?php echo $theme; ?>">Button</a>
							<a href="#" class="btn btn--<?php echo $theme; ?>--hollow">Hollow button</a>
						</div>
					</div>
				<?php } ?>
			<?php } ?>
		</div>
	</section>
<?php } ?>
<?php
get_footer();
