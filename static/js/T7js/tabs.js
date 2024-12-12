$( document ).ready(function() {
	'use strict';

	var body = $(document.body);
	var event = 'click.tabs';
	var str = '.ft-tabs a';
	var l = 'li';
	var c = 'ft-tabs-active';

	body.off(event).on(event, str, function(e) {
		// Stop click.
		e.preventDefault();

		$(e.target)
		.closest(l)
		.addClass(c)
		.siblings(l)
		.removeClass(c);
	});

});
