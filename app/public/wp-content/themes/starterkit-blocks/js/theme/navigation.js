export function initMobileMenu() {
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

export function initDropdownMenu() {
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
