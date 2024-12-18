$(function() {
			$(this).bind("contextmenu", function(e) {
						e.preventDefault();
						if (!e.isDefaultPrevented())
							return !1;
					});
		});

$(function() {
	$(document).unbind('keydown').bind('keydown', function(event) {
		var doPrevent = false;
		if (event.keyCode === 8) {
			var d = event.srcElement || event.target;
			if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT'
					|| d.type.toUpperCase() === 'PASSWORD'
					|| d.type.toUpperCase() === 'FILE'
					|| d.type.toUpperCase() === 'EMAIL'
					|| d.type.toUpperCase() === 'SEARCH' || d.type
					.toUpperCase() === 'DATE'))
					|| d.tagName.toUpperCase() === 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			} else {
				doPrevent = true;
			}
		}
		if (doPrevent) {
			event.preventDefault();
		}
	});
});
