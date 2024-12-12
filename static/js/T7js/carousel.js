(function($, window, document, undefined1) {
	'use strict';

	//==================
	// Build the widget.
	//==================

	function render() {
		var list = $('.ft-carousel-slick-list');

		var event = 'click.slick_carousel';
		var str = '.ft-carousel-slick-item';
		var a = 'ft-carousel-slick-active';

		var options = {
			draggable: false,
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 4
		};

		list.each(function() {
			var el = $(this);

			// Remove the carousel.
			el.unslick();

			// Add the carousel.
			el.slick(options);

			// Watch for click events.
			el.off(event).on(event, str, function() {
				var item = $(this);
				var others = item.siblings(str);

				// Add active to this item.
				item.addClass(a);

				// Remove active from others.
				others.removeClass(a);
			});
		});
	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function() {
		render();
	});

// jQuery, window, document
})(jQuery, this, this.document);
