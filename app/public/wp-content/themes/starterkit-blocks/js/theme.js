// eslint-disable-next-line no-unused-vars
//import { animateIntoView } from '../node_modules/@doubleedesign/animate-into-view/dist/animate-into-view.js';
// noinspection ES6UnusedImports
import { initDropdownMenu, initMobileMenu } from './theme/navigation.js';
//import { initGoogleMap } from './theme/gmaps.js';

document.addEventListener('DOMContentLoaded', function() {
	'use strict';

	initMobileMenu();
	initDropdownMenu();
	//initGoogleMap(document.querySelector('.acf-map'));
});
