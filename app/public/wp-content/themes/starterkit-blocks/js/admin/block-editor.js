/* global wp */
// See /cms/class-block-editor.php for where the compiled version of this script is loaded;
// and the dependencies that may need to be added to to ensure future modifications work

//import omit from 'lodash/omit';

wp.domReady(() => {
	//console.log(wp.blocks.getBlockTypes());

	unregisterSomeCoreStylesAndVariations();
	addCoreBlockLayoutStyles();
	customiseMediaAndTextBlock();
	customiseTypography();
});

addCoreBlockParents();
customiseBlockCategories();

/**
 * Customise the categories that some core blocks appear in
 */
function customiseBlockCategories() {
	wp.hooks.addFilter('blocks.registerBlockType', 'starterkit/customise-block-categories', function(settings, name) {
		const layoutBlocks = ['core/columns', 'core/media-text', 'core/group', 'core/separator', 'core/spacer'];
		if (layoutBlocks.includes(name)) {
			return { ...settings, category: 'page-layout' };
		}

		const mediaBlocks = ['core/embed'];
		if (mediaBlocks.includes(name)) {
			return { ...settings, category: 'media' };
		}

		return settings;
	});
}

/**
 * Limit availability of some core to specific parent blocks by adding the parent setting
 * (For custom blocks, the parent can be set in block.json)
 */
function addCoreBlockParents() {
	wp.hooks.addFilter('blocks.registerBlockType', 'starterkit/add-core-block-parents', function(settings, name) {
		if (name.includes('custom/')) {
			return settings;
		}

		if (name === 'core/columns') {
			return settings;
		}

		switch (name) {
			case 'core/heading':
			case 'core/paragraph':
			case 'core/list':
				return { ...settings, parent: ['custom/copy'] };
			case 'core/table':
				return { ...settings, parent: ['core/column', 'custom/copy'] };
			case 'core/freeform':
			case 'core/image':
				return { ...settings, parent: ['core/column'] };
		}

		return settings;
	});
}

/**
 * Add contained and fullwidth styles to a bunch of core blocks
 * (for custom blocks, this is in block.json)
 */
function addCoreBlockLayoutStyles() {
	['core/media-text', 'core/cover', 'core/embed'].forEach((block) => {
		wp.blocks.registerBlockStyle(block, {
			name: 'contained',
			label: 'Contained',
			isDefault: true,
		});
		wp.blocks.registerBlockStyle(block, {
			name: 'fullwidth',
			label: 'Fullwidth',
		});
	});
}

/**
 * Customisations specific to the media and text core block
 */
function customiseMediaAndTextBlock() {
	// Override the core Media & Text block
	wp.blocks.registerBlockVariation('core/media-text', {
		name: 'media-text-override',
		title: 'Media & Text',
		description: 'Set media and text side-by-side',
		isDefault: true,
		isActive: ['mediaPosition'],
		attributes: {
			templateLock: 'all',
		},
		innerBlocks: [['custom/copy']],
	});

	// Add a variation to the Media & Text block to reverse the order
	// Note: The icon is hackily changed using CSS because an SVG in 'icon' here doesn't work, it tries to use dashicons
	wp.blocks.registerBlockVariation('core/media-text', {
		name: 'text-media',
		title: 'Text & Media',
		description: 'Set text and media side-by-side',
		isActive: ['mediaPosition'], // somehow isActive is what makes the title show up correctly in the list view
		attributes: {
			mediaPosition: 'right',
			templateLock: 'all',
		},
		innerBlocks: [['custom/copy']],
	});
}

/**
 * Add styles and variations to core primitive typography blocks (heading, paragraph, list, etc)
 */
function customiseTypography() {
	// Add lead paragraph option
	wp.blocks.registerBlockStyle('core/paragraph', {
		name: 'lead',
		label: 'Lead Paragraph',
	});
}

/**
 * Unregister unwanted core block styles and variations
 * Note: This is only accounts for blocks that are explicitly allowed by the allowed_block_types_all filter in inc/cms/class-block-editor.php
 */
function unregisterSomeCoreStylesAndVariations() {
	wp.blocks.unregisterBlockStyle('core/image', ['rounded']);

	(['wordpress', 'soundcloud', 'spotify', 'slideshare', 'twitter', 'flickr', 'animoto', 'cloudup', 'crowdsignal', 'dailymotion', 'imgur', 'issuu', 'kickstarter', 'mixcloud', 'pocket-casts', 'reddit', 'reverbnation', 'screencast', 'scribd', 'smugmug', 'speaker-deck', 'ted', 'tumblr', 'videopress', 'amazon-kindle', 'wolfram-cloud', 'pinterest', 'wordpress-tv']).forEach((embed) => {
		wp.blocks.unregisterBlockVariation('core/embed', embed);
	});
}
