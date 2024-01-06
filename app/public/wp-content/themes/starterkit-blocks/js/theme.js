// WP_VARS brings PHP variables into JS and is defined in inc/frontend/class-frontend.php
/* global WP_VARS */

//import { animateIntoView } from '../node_modules/@doubleedesign/animate-into-view/dist/animate-into-view.js';
//noinspection ES6UnusedImports
import { initDropdownMenu, initMobileMenu } from './theme/navigation.js';
// { initGoogleMap } from './theme/gmaps.js';

document.addEventListener('DOMContentLoaded', function() {
	'use strict';

	initMobileMenu();
	initDropdownMenu();
	//initGoogleMap(document.querySelector('.acf-map'));
});
