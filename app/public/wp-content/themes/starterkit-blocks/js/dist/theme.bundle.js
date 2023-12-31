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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy92ZW5kb3IvYm9vdHN0cmFwL2RvbS9zZWxlY3Rvci1lbmdpbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCAodjUuMi4wLWJldGExKTogZG9tL3NlbGVjdG9yLWVuZ2luZS5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcblxyXG5pbXBvcnQgeyBpc0Rpc2FibGVkLCBpc1Zpc2libGUgfSBmcm9tICcuLi91dGlsL2luZGV4J1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuXHJcbmNvbnN0IFNlbGVjdG9yRW5naW5lID0ge1xyXG4gIGZpbmQoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICAgIHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKSlcclxuICB9LFxyXG5cclxuICBmaW5kT25lKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgICByZXR1cm4gRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3Rvci5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKVxyXG4gIH0sXHJcblxyXG4gIGNoaWxkcmVuKGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gW10uY29uY2F0KC4uLmVsZW1lbnQuY2hpbGRyZW4pLmZpbHRlcihjaGlsZCA9PiBjaGlsZC5tYXRjaGVzKHNlbGVjdG9yKSlcclxuICB9LFxyXG5cclxuICBwYXJlbnRzKGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcbiAgICBjb25zdCBwYXJlbnRzID0gW11cclxuICAgIGxldCBhbmNlc3RvciA9IGVsZW1lbnQucGFyZW50Tm9kZS5jbG9zZXN0KHNlbGVjdG9yKVxyXG5cclxuICAgIHdoaWxlIChhbmNlc3Rvcikge1xyXG4gICAgICBwYXJlbnRzLnB1c2goYW5jZXN0b3IpXHJcbiAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50Tm9kZS5jbG9zZXN0KHNlbGVjdG9yKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJlbnRzXHJcbiAgfSxcclxuXHJcbiAgcHJldihlbGVtZW50LCBzZWxlY3Rvcikge1xyXG4gICAgbGV0IHByZXZpb3VzID0gZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXHJcblxyXG4gICAgd2hpbGUgKHByZXZpb3VzKSB7XHJcbiAgICAgIGlmIChwcmV2aW91cy5tYXRjaGVzKHNlbGVjdG9yKSkge1xyXG4gICAgICAgIHJldHVybiBbcHJldmlvdXNdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXZpb3VzID0gcHJldmlvdXMucHJldmlvdXNFbGVtZW50U2libGluZ1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbXVxyXG4gIH0sXHJcbiAgLy8gVE9ETzogdGhpcyBpcyBub3cgdW51c2VkOyByZW1vdmUgbGF0ZXIgYWxvbmcgd2l0aCBwcmV2KClcclxuICBuZXh0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcbiAgICBsZXQgbmV4dCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nXHJcblxyXG4gICAgd2hpbGUgKG5leHQpIHtcclxuICAgICAgaWYgKG5leHQubWF0Y2hlcyhzZWxlY3RvcikpIHtcclxuICAgICAgICByZXR1cm4gW25leHRdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5leHQgPSBuZXh0Lm5leHRFbGVtZW50U2libGluZ1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbXVxyXG4gIH0sXHJcblxyXG4gIGZvY3VzYWJsZUNoaWxkcmVuKGVsZW1lbnQpIHtcclxuICAgIGNvbnN0IGZvY3VzYWJsZXMgPSBbXHJcbiAgICAgICdhJyxcclxuICAgICAgJ2J1dHRvbicsXHJcbiAgICAgICdpbnB1dCcsXHJcbiAgICAgICd0ZXh0YXJlYScsXHJcbiAgICAgICdzZWxlY3QnLFxyXG4gICAgICAnZGV0YWlscycsXHJcbiAgICAgICdbdGFiaW5kZXhdJyxcclxuICAgICAgJ1tjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdJ1xyXG4gICAgXS5tYXAoc2VsZWN0b3IgPT4gYCR7c2VsZWN0b3J9Om5vdChbdGFiaW5kZXhePVwiLVwiXSlgKS5qb2luKCcsJylcclxuXHJcbiAgICByZXR1cm4gdGhpcy5maW5kKGZvY3VzYWJsZXMsIGVsZW1lbnQpLmZpbHRlcihlbCA9PiAhaXNEaXNhYmxlZChlbCkgJiYgaXNWaXNpYmxlKGVsKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yRW5naW5lXHJcbiJdLCJmaWxlIjoidGhlbWUuYnVuZGxlLmpzIn0=
