function initMobileMenu() {
	const menu = document.querySelector('.site-header__nav');
	const button = document.getElementById('header-menu-button');
	const overlay = document.querySelector('.site-overlay');

	// Return early if the navigation doesn't exist.
	if ((! menu) || ('undefined' === typeof button)) {
		return;
	}

	button.addEventListener('click', function() {
		toggleMenu();
		toggleOverlay();
	});

	overlay.addEventListener('click', function() {
		toggleMenu();
		toggleOverlay();
	});

	function toggleMenu() {
		menu.classList.toggle('site-header__nav--open');
		if (button.getAttribute('aria-expanded') === 'true') {
			button.setAttribute('aria-expanded', 'false');
			button.querySelector('.fa-bars').style.display = 'block';
			button.querySelector('.fa-times').style.display = 'none';
		}
		else {
			button.setAttribute('aria-expanded', 'true');
			button.querySelector('.fa-bars').style.display = 'none';
			button.querySelector('.fa-times').style.display = 'block';
		}
	}

	function toggleOverlay() {
		overlay.classList.toggle('site-overlay--open');
	}
}

function initDropdownMenu() {
	function isMobile() {
		return window.matchMedia('(max-width:767px)').matches;
	}

	const topItems = document.querySelectorAll('.site-header__nav li.menu-item-has-children');

	topItems.forEach((item) => {
		const link = item.querySelector('.menu-dropdown-link');
		const submenu = item.querySelector('.sub-menu');
		const submenuHeight = submenu.scrollHeight;

		submenu.ariaHidden = 'true';

		link.addEventListener('click', (event) => {
			if (isMobile()) {
				event.preventDefault();

				if (link.classList.contains('open')) {
					link.classList.remove('open');
					submenu.ariaHidden = 'true';
					submenu.style.height = '0';
				}
				else {
					link.classList.add('open');
					submenu.ariaHidden = 'false';
					submenu.style.height = `${ submenuHeight }px`;
				}
			}
		});

		item.addEventListener('mouseenter', () => {
			if (! isMobile()) {
				link.classList.add('open');
				submenu.ariaHidden = 'false';
				submenu.style.height = `${ submenuHeight }px`;
			}
		});

		item.addEventListener('mouseleave', () => {
			if (! isMobile()) {
				link.classList.remove('open');
				submenu.ariaHidden = 'true';
				submenu.style.height = '0';
			}
		});
	});

	/*
	$('.menu-dropdown-link').on('click', function(event) {
		event.preventDefault();

		$(this).toggleClass('open');
		$(this).next('.sub-menu').slideToggle();

		if (! isMobile()) {
			$('.sub-menu').not($(this).next('.dropdown-menu')).slideUp();
			$('.menu-dropdown-link').not(this).removeClass('open');
		}
	});

	$('.site-header__nav .menu-item-has-children').on('mouseenter mouseleave', function() {
		if (! isMobile()) {
			$(this).find('.menu-dropdown-link').finish().toggleClass('open');
			$(this).find('.dropdown-menu').finish().slideToggle();
		}
	}); */
}

// eslint-disable-next-line no-unused-vars
//import { initGoogleMap } from './theme/gmaps.js';

document.addEventListener('DOMContentLoaded', function() {

	initMobileMenu();
	initDropdownMenu();
	//initGoogleMap(document.querySelector('.acf-map'));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy90aGVtZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuLy9pbXBvcnQgeyBhbmltYXRlSW50b1ZpZXcgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGRvdWJsZWVkZXNpZ24vYW5pbWF0ZS1pbnRvLXZpZXcvZGlzdC9hbmltYXRlLWludG8tdmlldy5qcyc7XHJcbi8vIG5vaW5zcGVjdGlvbiBFUzZVbnVzZWRJbXBvcnRzXHJcbmltcG9ydCB7IGluaXREcm9wZG93bk1lbnUsIGluaXRNb2JpbGVNZW51IH0gZnJvbSAnLi90aGVtZS9uYXZpZ2F0aW9uLmpzJztcclxuLy9pbXBvcnQgeyBpbml0R29vZ2xlTWFwIH0gZnJvbSAnLi90aGVtZS9nbWFwcy5qcyc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpbml0TW9iaWxlTWVudSgpO1xyXG5cdGluaXREcm9wZG93bk1lbnUoKTtcclxuXHQvL2luaXRHb29nbGVNYXAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjZi1tYXAnKSk7XHJcbn0pO1xyXG4iXSwiZmlsZSI6InRoZW1lLmJ1bmRsZS5qcyJ9
