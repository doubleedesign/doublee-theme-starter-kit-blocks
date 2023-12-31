import Collapse from './vendor/bootstrap/collapse.js';

document.addEventListener('DOMContentLoaded', function() {
	initCollapse();
});

function initCollapse() {
	const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
	collapseElementList.map(function(collapseEl) {
		return new Collapse(collapseEl);
	});
}
