(function($, window, document, undefined1) {
	'use strict';

	// Used later.
	var pageLoaded;
	var resizeTimer;

	// Namespaced events.
	var eventLoad = 'load.drawFluidWidgets';
	var eventResize = 'resize.drawFluidWidgets';
	var eventSidebar = 'hideShowSidebar';

	//=============================
	// Functions to clear and draw.
	//=============================

	// Empty widget containers, for proper width
	// reading from within `triggerFluidWidgets`.
	function clearFluidWidgets() {
		// Empty the widgets.
		$('.ft-fluid-widget')
		.off()
		.find('*')
		.off()
		.end()
		.html('');
	}

	// Take some measurements, emit event.
	function triggerFluidWidgets() {
		// Clear the timer.
		clearTimeout(resizeTimer);

		// Get the target element.
		var el = $('.ft-layout-primary').find('.ft-layout-inner');

		if (!el.length) {
			el = $('.ft-fluid-widget').parent();
		}

		// Get the true width.
		var width = parseFloat(el.css('width'));

		// Trigger the rendering.
		$(document).trigger('drawFluidWidgets', [width]);
	}

	// Consolidate both functions. Set `pageLoaded`.
	function drawFluidWidgets() {
		// Clear the widgets.
		clearFluidWidgets();

		// Trigger the event.
		triggerFluidWidgets();

		// Set the flag.
		pageLoaded = true;
	}

	//==============================
	// Fire when the window resizes.
	//==============================

	$(window).off(eventResize).on(eventResize, function() {
		// Clear the widgets.
		clearFluidWidgets();

		// Clear the timer.
		clearTimeout(resizeTimer);

		// Throttle the calls.
		resizeTimer = setTimeout(triggerFluidWidgets, 100);
	});

	//==============================
	// Fire when ExtJS is available.
	//==============================

	$(document).ready(function() {
		// Prevent double-calling.
		if (pageLoaded) {
			// Exit.
			return;
		}

		// Draw the widgets.
		drawFluidWidgets();
	});

	//===============================
	// Fire when the page has loaded.
	//===============================

	$(window).off(eventLoad).on(eventLoad, function() {
		// Prevent double-calling.
		if (pageLoaded) {
			// Exit.
			return;
		}

		// Draw the widgets.
		drawFluidWidgets();
	});

	//=============================
	// Proxy to `drawFluidWidgets`.
	//=============================

	$(document).off(eventSidebar).on(eventSidebar, function() {
		// Draw the widgets.
		drawFluidWidgets();
	});

// Params: jQuery, window, document.
})(jQuery, this, this.document);