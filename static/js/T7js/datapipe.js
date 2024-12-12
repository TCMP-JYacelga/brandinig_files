(function($) {
	'use strict';

	$.fn.ftDatapipe = function(options) {
		return this.each(function() {
			var $wrappingElement = $(this);
			var $table = $('<table border="0" cellspacing="0" cellpadding="0" class="ft-datapipe" width="100%"></table>');
			var total, zeroCnt, actPerc, perc, cntr;
			var data = options.data.pipeData;
			var labels = options.data.pipeLabels;
			var headers = options.data.headerData;
			var $lblRow = $('<tr></tr>');

			var $col = $('<td colspan="6" class="ft-datapipe-blue-color right_border"><strong>' + headers[0] + '</strong></td>');
			$col.appendTo($lblRow);
			$col = $('<td colspan="4" class="ft-datapipe-green-color right_border"><strong>' + headers[1] + '</strong></td>');
			$col.appendTo($lblRow);
			$col = $('<td colspan="2" class="ft-datapipe-red-color"><strong>' + headers[2] + '</strong></td>');
			$col.appendTo($lblRow);
			$lblRow.appendTo($table);

			zeroCnt = 0;
			total = 0;

			var $descRow = $('<tr class="ft-datapipe-labels"></tr>'), $dataRow = $('<tr></tr>'), val;
			cntr = 0;
			for ( cntr = 0; cntr < data.length; cntr++) {
				val = data[cntr];
				if (val === 0)
					zeroCnt++;
				total += val;

				var $colDesc = $('<td>' + labels[cntr] + '</td>');

				switch(cntr) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
						break;
					case 5:
						$colDesc.addClass('right_border');
						break;
					case 6:
					case 7:
					case 8:
						break;
					case 9:
						$colDesc.addClass('right_border');
						break;
					default:
						break;
				}

				$colDesc.appendTo($descRow);
			}

			actPerc = 100 - (zeroCnt * 4);
			var $pRow = $('<tr class="ft-datapipe-values"></tr>');
			for ( cntr = 0; cntr < data.length; cntr++) {
				val = data[cntr];
				if (val === 0)
					perc = 4;
				else
					perc = Math.abs((val * actPerc) / total);

				$col = $('<td width="' + perc + '%">' + val + '</td>');
				switch (cntr) {
					case 0:
						$col.addClass('ft-datapipe-blue-bg');
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						$col.addClass('ft-datapipe-blue-bg');
						break;
					case 6:
					case 7:
					case 8:
					case 9:
						$col.addClass('ft-datapipe-green-bg');
						break;
					case 10:
					case 11:
						$col.addClass('ft-datapipe-red-bg');
						break;
				}
				$col.appendTo($pRow);
			}

			// loop over items
			// if class found, count items in class, create gradients and apply/distribute colors

			$pRow.appendTo($table);
			$descRow.appendTo($table);
			$dataRow.appendTo($table);
			$wrappingElement.html($table);

			if ( typeof options !== 'undefined' && typeof options.processColors !== 'undefined') {
				var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/, aClasses = ['ft-datapipe-blue-bg', 'ft-datapipe-green-bg', 'ft-datapipe-red-bg'];
				var $items, rgbColor, _bgcolor, _ci, rootColor, match;

				var count = 0;
				var darkFactor = 0.25;
				var processColors = function() {
					$items = $('.' + aClasses[count], $('.ft-datapipe-values', this));
					rootColor = $items.eq(0).css('background-color');
					match = matchColors.exec(rootColor);
					if (match !== null) {
						rgbColor = ('rgba(' + match[1] + ',' + match[2] + ',' + match[3] + ',');
					}

					$items.each(function(i, e) {
						_ci = parseInt(i,10);
						if (_ci === 0) {
							_ci = 0.5;
						}
						_bgcolor = (rgbColor + ((_ci / ($items.length - 1)) + darkFactor) + ')');

						$(e).css({
							'background-color' : _bgcolor
						});
					});

					if (count < aClasses.length) {
						count++;
						processColors();
					} else {
						return;
					}
				};

				processColors();

				var $tooltip = $('.ft-datapipe-tooltip');
				var xOffset = 50, yOffset = 50, _targetPosition = 0;
				// init tooltips
				$('.ft-datapipe').hover(function(e) {
					$tooltip.show();
					_targetPosition = $(e.currentTarget).offset();
					$tooltip.css('top', (e.pageY - _targetPosition.top + yOffset) + 'px').css('left', (e.pageX - _targetPosition.left + xOffset) + 'px').position();
				}, function() {
					$tooltip.hide();
				}).mousemove(function(e) {
					_targetPosition = $(e.currentTarget).offset();
					$tooltip.css('top', (e.pageY - _targetPosition.top + yOffset) + 'px').css('left', (e.pageX - _targetPosition.left + xOffset) + 'px');
				});
			}

		});

	};

})(jQuery);

Ext.onReady(function() {
	'use strict';

	var config = {
		pipeData : [200, 90, 300, 30, 60, 80, 4, 1, 2, 3, 4, 5],
		pipeLabels : ['Repair', 'Submit', 'Verify', 'Auth', 'Hold', 'Send', 'Failed', 'Debit', 'Print', 'Clearing', 'With Client', 'With Bank'],
		headerData : ['Customer', 'Bank', 'Requests']
	};

	$('#ft-sample-datapipe').ftDatapipe({
		data : config,
		processColors : true
	});
});