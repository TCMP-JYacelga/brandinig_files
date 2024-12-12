(function($, window, document, undefined1) {
	'use strict';

	var bar = $('.ft-status-bar');

	bar.each(function() {
		var el = $(this);

		var active = el.attr('data-step-active');
		active = parseFloat(active);

		el.find('li').each(function() {
			var li = $(this);

			var index = li.attr('data-step-index');
			index = parseFloat(index);

			if (active === index) {
				li.addClass('ft-status-bar-li-active');
			}
			else if (active > index) {
				li.addClass('ft-status-bar-li-done');
			}
		});
	});

// Params: jQuery, window, document.
})(jQuery, this, this.document);