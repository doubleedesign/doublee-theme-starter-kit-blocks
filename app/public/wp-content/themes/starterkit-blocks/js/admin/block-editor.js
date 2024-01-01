/* global wp */
// See /cms/class-block-editor.php for where the compiled version of this script is loaded;
// and the dependencies that may need to be added to to ensure future modifications work

import omit from 'lodash/omit';

wp.domReady(() => {
	//console.log(wp.blocks.getBlockTypes());
	wp.blocks.unregisterBlockStyle('core/image', ['rounded']);
});

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'starterkit/modify-available-block-settings',
	modifySettings,
	999
);

function modifySettings(settings, name) {
	if (name === 'core/image') {
		const updated = {
			...settings,
			styles: [],
			usesContext: [],
			attributes: omit(settings.attributes, ['width', 'height']),
		};

		return updated;
	}

	if (name === 'core/gallery') {
		console.log(settings);
	}

	return settings;
}
