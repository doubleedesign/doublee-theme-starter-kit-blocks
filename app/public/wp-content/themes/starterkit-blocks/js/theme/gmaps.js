export function initGoogleMap(selector) {
	const google = window.google;

	/**
	 * Viewport size utility function
	 *
	 * @return {boolean} Whether the screen is smaller than 768px
	 */
	function isMobile() {
		return window.matchMedia('(max-width:767px)').matches;
	}

	/**
	 * Render a Google Map onto the selected HTML element
	 *
	 * @return {Object} - The map instance
	 */
	function initMap() {
		// Find marker elements within map element
		const markers = selector.querySelectorAll('.marker');

		// Create Google map
		const map = new google.maps.Map(selector, {
			zoom: parseInt(selector.dataset.zoom) || 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [
				{
					featureType: 'administrative',
					elementType: 'labels.text.fill',
					stylers: [
						{
							color: '#6195a0',
						},
					],
				},
				{
					featureType: 'administrative.province',
					elementType: 'geometry.stroke',
					stylers: [
						{
							visibility: 'off',
						},
					],
				},
				{
					featureType: 'landscape',
					elementType: 'geometry',
					stylers: [
						{
							lightness: '0',
						},
						{
							saturation: '0',
						},
						{
							color: '#f5f5f2',
						},
						{
							gamma: '1',
						},
					],
				},
				{
					featureType: 'landscape.man_made',
					elementType: 'all',
					stylers: [
						{
							lightness: '-3',
						},
						{
							gamma: '1.00',
						},
					],
				},
				{
					featureType: 'landscape.natural.terrain',
					elementType: 'all',
					stylers: [
						{
							visibility: 'off',
						},
					],
				},
				{
					featureType: 'poi',
					elementType: 'all',
					stylers: [
						{
							visibility: 'off',
						},
					],
				},
				{
					featureType: 'poi.park',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#bae5ce',
						},
						{
							visibility: 'on',
						},
					],
				},
				{
					featureType: 'road',
					elementType: 'all',
					stylers: [
						{
							saturation: -100,
						},
						{
							lightness: 45,
						},
						{
							visibility: 'simplified',
						},
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'all',
					stylers: [
						{
							visibility: 'simplified',
						},
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#fac9a9',
						},
						{
							visibility: 'simplified',
						},
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'labels.text',
					stylers: [
						{
							color: '#4e4e4e',
						},
					],
				},
				{
					featureType: 'road.arterial',
					elementType: 'labels.text.fill',
					stylers: [
						{
							color: '#787878',
						},
					],
				},
				{
					featureType: 'road.arterial',
					elementType: 'labels.icon',
					stylers: [
						{
							visibility: 'off',
						},
					],
				},
				{
					featureType: 'transit',
					elementType: 'all',
					stylers: [
						{
							visibility: 'simplified',
						},
					],
				},
				{
					featureType: 'transit.station.airport',
					elementType: 'labels.icon',
					stylers: [
						{
							hue: '#0a00ff',
						},
						{
							saturation: '-77',
						},
						{
							gamma: '0.57',
						},
						{
							lightness: '0',
						},
					],
				},
				{
					featureType: 'transit.station.rail',
					elementType: 'labels.text.fill',
					stylers: [
						{
							color: '#43321e',
						},
					],
				},
				{
					featureType: 'transit.station.rail',
					elementType: 'labels.icon',
					stylers: [
						{
							hue: '#ff6c00',
						},
						{
							lightness: '4',
						},
						{
							gamma: '0.75',
						},
						{
							saturation: '-68',
						},
					],
				},
				{
					featureType: 'water',
					elementType: 'all',
					stylers: [
						{
							color: '#eaf6f8',
						},
						{
							visibility: 'on',
						},
					],
				},
				{
					featureType: 'water',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#c7eced',
						},
					],
				},
				{
					featureType: 'water',
					elementType: 'labels.text.fill',
					stylers: [
						{
							lightness: '-49',
						},
						{
							saturation: '-53',
						},
						{
							gamma: '0.79',
						},
					],
				},
			],
		});

		// Add markers
		map.markers = [];
		markers.forEach(function(marker) {
			initMarker(marker, map);
		});

		// Centre map based on markers
		centerMap(map);

		// Return map instance
		return map;
	}

	/**
	 * Create a marker for the given element and map
	 *
	 * @param {HTMLElement} element - The map HTML element with .marker child element with data-lat and data-lng attributes
	 * @param {Object}      map     - The map object
	 *
	 * @return {void}
	 */
	function initMarker(element, map) {
		// Create icon
		const svgMarker = {
			path: 'M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z',
			fillColor: 'black',
			fillOpacity: 1,
			strokeWeight: 0,
			rotation: 0,
			scale: 0.1,
			anchor: new google.maps.Point(15, 30),
		};

		// Get position from marker.
		const lat = element.dataset.lat;
		const lng = element.dataset.lng;
		const latLng = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
		};

		// Create marker instance.
		const marker = new google.maps.Marker({
			position: latLng,
			map,
			icon: svgMarker,
		});

		// Append to reference for later use
		map.markers.push(marker);

		// Create info window
		const infowindow = new google.maps.InfoWindow({
			content: element.innerHTML,
		});

		// Show info window when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
	}

	/**
	 * Center the map showing all markers in view.
	 *
	 * @param {Object} map - The map instance.
	 */
	function centerMap(map) {
		// Create map boundaries from all map markers.
		const bounds = new google.maps.LatLngBounds();
		map.markers.forEach(function(marker) {
			bounds.extend({
				lat: marker.position.lat(),
				lng: marker.position.lng(),
			});
		});

		// Case: Single marker.
		if (map.markers.length === 1) {
			if (isMobile()) {
				map.setCenter(bounds.getCenter());
			}
			else {
				const newCenter = {
					lat: map.markers[0].position.lat(),
					lng: map.markers[0].position.lng() + 0.05,
				};
				map.setCenter(newCenter);
			}
		}
		// Case: Multiple markers.
		else {
			map.fitBounds(bounds);
		}
	}

	initMap();
}
