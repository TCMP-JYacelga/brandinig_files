(function($, window, document, undefined1) {
	'use strict';

	//====================
	// Click on +/- icons.
	//====================

	$(document).on('click', '.ft-accordion-exp-icon', function(e) {
		var li = $(e.target).closest('li[class*="-accordion-item"]');

		if (li.hasClass('ft-accordion-collapsed')) {
			li.removeClass('ft-accordion-collapsed');
		}
		else {
			li.addClass('ft-accordion-collapsed');
		}
	});

	//==========================
	// Hide or show the sidebar.
	//==========================

	$(document).on('click', '.ft-accordion-toggle-trigger', function() {
		var doc = $(document.documentElement);
		var _class = 'ft-sidebar-hidden';

		var msg;

		// Is sidebar hidden?
		if (doc.hasClass(_class)) {
			// Show sidebar.
			doc.removeClass(_class);
			msg = 'HIDE';
		}
		else {
			// Hide sidebar.
			doc.addClass(_class);
			msg = 'SHOW';
		}

		// Replace the header text.
		$('.ft-accordion-header-txt').html(msg);

		// Emit event, allowing others to know
		// the sidebar has been hidden / shown.
		$(document).trigger('hideShowSidebar');
	});

// Params: jQuery, window, document.
})(jQuery, this, this.document);