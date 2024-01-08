/* global wp */

document.addEventListener('DOMContentLoaded', async function() {
	wp.domReady(async() => {
		const menuButton = await waitForElementToExist('.interface-more-menu-dropdown', 5);
		if (menuButton) {
			menuButton.addEventListener('click', async function() {
				const menu = await waitForElementToExist('.interface-more-menu-dropdown__content .components-dropdown-menu__menu', 5);

				// Remove entire sections from the block editor options menu
				const sectionsToRemove = ['editor'];
				const sectionsToKeep = Array.from(menu.children)
					.map((section) => {
						const label = Array.from(section.children).find((child) => child.classList.contains('components-menu-group__label'));
						if (!label) {
							return section;
						}
						return (label && label?.innerText && !sectionsToRemove.includes(label.innerText.toLowerCase()) ? section : null);
					})
					.filter((section) => section !== null);
				menu.replaceChildren(arrayToHtmlCollection(sectionsToKeep));

				// Remove some specific menu items
				const itemsToRemove = ['code editor', 'copy all blocks', 'welcome guide', 'manage patterns'];
				Array.from(sectionsToKeep).forEach((section) => {
					const submenu = Array.from(section.children).find((child) => child.role === 'group');
					if (submenu) {
						const items = Array.from(submenu.children).filter((child) => child.classList.contains('components-menu-item__button'));
						const itemsToKeep = items.filter((item) => {
							// Note: This only works for items with the exact text directly in the button,
							// and would require modification to work with items that have the text in a child element
							return !itemsToRemove.includes(item.textContent.toLowerCase());
						});
						section.replaceChildren(arrayToHtmlCollection(itemsToKeep));
					}
				});
			});
		}
	});
});

// Adapted from https://codepen.io/boosmoke/pen/abbMZzb
const waitForElementToExist = (selector, limit) => {
	return new Promise((resolve, reject) => {
		let count = 0;
		(function waitForFoo() {
			const element = document.querySelector(selector);
			if (element) {
				return resolve(element);
			}
			if (limit && count > limit) {
				reject(new Error('Element not found'));
				return false;
			}
			count += 1;
			setTimeout(waitForFoo, 50);
		}());
	});
};

function arrayToHtmlCollection(array) {
	const fragment = document.createDocumentFragment();
	array.forEach((child) => {
		fragment.appendChild(child);
	});
	return fragment;
}

